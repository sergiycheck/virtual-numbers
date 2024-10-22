import { baseURL } from "@/api";
import { authRevokeConnectedAccount, getAuthTokens } from "@/api/auth";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/ui/icons";
import ConfirmActionModal from "@/components/ui/modal-confirm-action";
import { TypographyP } from "@/components/ui/typography";
import { useToast } from "@/components/ui/use-toast";
import useUserState from "@/store/slices/userSlice";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CircleCheck, LucideProps } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

type ConenctionHandlerProps = {
  accessToken: string;
  action: "connect" | "revoke";
};

const ACCOUNTS = [
  {
    name: "Slack",
    icon: Icons.slack,
    description: "Lorem ipsum dolor sit, consectetur elitl.",
    isConnected: false,
    connectHandler: (props: ConenctionHandlerProps) => {
      window.location.assign(
        baseURL.concat(`/auth/slack?action=${props.action}&access_token=${props.accessToken}`)
      );
    },
  },
  {
    name: "Discord",
    icon: Icons.discord,
    description: "Lorem ipsum dolor sit, consectetur elitl.",
    isConnected: false,
    connectHandler: (props: ConenctionHandlerProps) => {
      window.location.assign(
        baseURL.concat(`/auth/discord?action=${props.action}&access_token=${props.accessToken}`)
      );
    },
  },
  {
    name: "Google",
    icon: Icons.google,
    description: "Lorem ipsum dolor sit, consectetur elitl.",
    isConnected: false,
    connectHandler: (props: ConenctionHandlerProps) => {
      window.location.assign(
        baseURL.concat(`/auth/google?action=${props.action}&access_token=${props.accessToken}`)
      );
    },
  },
];

export default function Accounts() {
  const authResult = getAuthTokens();
  const accessToken = authResult?.accessToken || "";
  const { ...user } = useUserState();

  const accountsMapped = useMemo(() => {
    return ACCOUNTS.map((account) => {
      let isConnected = false;

      if (user.googleUserId && account.name == "Google") {
        isConnected = true;
      } else if (user.slackUserId && account.name == "Slack") {
        isConnected = true;
      } else if (user.discordUserId && account.name == "Discord") {
        isConnected = true;
      }

      return {
        ...account,
        isConnected,
        connectHandler: () => account.connectHandler({ accessToken, action: "connect" }),
      };
    });
  }, [user, accessToken]);

  const queryClient = useQueryClient();

  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: ["get-me"] });
  }, [queryClient]);

  return (
    <div className="max-w-[29.5rem] text-text_04">
      <TypographyP className="font-semibold text-base mb-2 text-text_summary">Accounts</TypographyP>
      {accountsMapped.map((account) => {
        const { name, icon: Icon, description, isConnected } = account;

        return (
          <AccountItem
            key={name}
            name={name}
            description={description}
            isConnected={isConnected}
            connectHandler={account.connectHandler}
            Icon={Icon}
          ></AccountItem>
        );
      })}
    </div>
  );
}

const AccountItem = ({
  name,
  description,
  isConnected,
  connectHandler,
  Icon,
}: {
  name: string;
  description: string;
  isConnected: boolean;
  connectHandler: () => void;
  Icon: ({ ...props }: LucideProps) => JSX.Element;
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const queryClient = useQueryClient();
  const { toast } = useToast();

  const revokeConnectedAccountMutation = useMutation({
    mutationFn: authRevokeConnectedAccount,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["get-me"] });
      toast({
        title: "Successfully disconnected account",
        description: "You have successfully disconnected your account",
      });
    },
    onError: () => {
      toast({
        title: "Error disconnecting account",
        description: "There was an error disconnecting your account",
        variant: "destructive",
      });
    },
  });

  const handleDisconnectUser = () => {
    setIsOpen(false);
    revokeConnectedAccountMutation.mutate({ provider: name.toLowerCase() });
  };

  return (
    <>
      <div key={name} className="flex py-4 border-b border-solid border-input items-center">
        <div className="relative mr-3">
          {isConnected ? (
            <CircleCheck
              height={16}
              width={16}
              className="absolute text-icon_brand fill-current stroke-secondary top-[-3px] right-[-3px]"
            />
          ) : null}
          <Icon height={32} width={32} />
        </div>
        <p className="flex flex-col flex-1">
          <span className="text-sm text-primary font-semibold">{name}</span>
          <span className="text-sm text-text_03">{description}</span>
        </p>
        <Button
          onClick={isConnected ? () => setIsOpen(true) : connectHandler}
          variant={isConnected ? "secondary" : "default"}
          className="min-w-[111px]"
        >
          {isConnected ? "Disconnect" : "Connect"}
        </Button>
        {/* confirm disconnect */}
        <ConfirmActionModal
          isPending={revokeConnectedAccountMutation.isPending}
          open={isOpen}
          onOpenChange={setIsOpen}
          actionCallback={handleDisconnectUser}
          title="Disconnect account"
          titleDescription="Are you sure you want to disconnect your account?"
        />
      </div>
    </>
  );
};
