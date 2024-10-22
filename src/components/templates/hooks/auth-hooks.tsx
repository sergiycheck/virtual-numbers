import { InfiniteData, useQuery, useQueryClient } from "@tanstack/react-query";
import { getUser } from "@/api/users";
import useUserState from "@/store/slices/userSlice";
import { useCallback, useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";
import { getAuthTokens } from "@/api/auth";
import { useToast } from "@/components/ui/use-toast";
import { baseURL } from "@/api";
import { Message, MessageSchema } from "@/api/sms/types";
import { ILine } from "@/api/lines/types";
import { mergeArrs } from "@/utils/merge-arrays";
import { PaginatedResponse } from "@/api/general.types";
import { produce } from "immer";
import { TypographyMuted } from "@/components/ui/typography";

export const useAuthHooks = () => {
  const { updateUser } = useUserState();
  const { toast } = useToast();
  const toastIdRef = useRef<string | undefined>(undefined);
  const queryClient = useQueryClient();

  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    const tokens = getAuthTokens();
    if (socketRef.current || !tokens) return;
    const socket = io(baseURL, {
      extraHeaders: {
        Authorization: "Bearer " + tokens.accessToken,
      },
    });
    socketRef.current = socket;
  }, []);

  useQuery({
    queryKey: ["get-me"],
    queryFn: async () => {
      const response = await getUser();
      updateUser(response.data);
      return response.data;
    },
  });

  const handleNotification = useCallback(
    (content: string) => {
      const t = toast({
        title: "New SMS! 📩" + ` ${content.slice(0, 10)}...`,
        description: (
          <div className="flex gap-x-2 items-end justify-center">
            <TypographyMuted>You've just received a new SMS</TypographyMuted>
          </div>
        ),
        duration: 1000 * 60 * 60,
      });
      toastIdRef.current = t.id;
    },
    [toast]
  );

  useEffect(() => {
    const socket = socketRef.current;

    if (!socket || socket.connected) return;

    socket.on("connect", function () {
      console.log("WS connection established");
    });

    socket.on("sms", function (payload: Partial<Message>) {
      const parsedResult = MessageSchema.safeParse(payload);

      if (!parsedResult.success) {
        console.error(parsedResult.error.errors);
        toast({
          title: "Error",
          description: parsedResult.error.message,
          variant: "destructive",
        });

        return;
      }

      const safePayload = parsedResult.data;

      const content = safePayload.content;
      handleNotification(content);

      const linesActive = queryClient.getQueryData(["lines-active"]) as InfiniteData<
        PaginatedResponse<ILine>,
        unknown
      >;
      if (linesActive) {
        queryClient.setQueryData(
          ["lines-active"],
          (old: InfiniteData<PaginatedResponse<ILine>, unknown>) => {
            const indexOfThePage = old?.pages.findIndex((page) =>
              page.data.some((line) => line.number === safePayload.receiver)
            );

            if (indexOfThePage === -1) {
              return old;
            } else {
              const indexOfLine = old.pages[indexOfThePage].data.findIndex((line) => {
                return line.number === safePayload.receiver;
              });

              const nextState = produce(old, (draft) => {
                const smsArrToUpdate = draft.pages[indexOfThePage].data[indexOfLine].smsArr;
                const mergedArr = mergeArrs(smsArrToUpdate, [safePayload as Message]);
                draft.pages[indexOfThePage].data[indexOfLine].smsArr = mergedArr;
              });

              return nextState;
            }
          }
        );
      }
    });

    socket.on("disconnect", function () {
      console.log("Disconnected");
    });
  }, [handleNotification, toast, queryClient]);
};
