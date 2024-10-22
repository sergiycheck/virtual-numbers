import React from "react";
import { Button } from "@/components/ui/button";
import { TypographyP, TypographySmall } from "@/components/ui/typography";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import LinesAPI from "@/api/lines";
import useUserState from "@/store/slices/userSlice";
import { ILine } from "@/api/lines/types";
import { SummaryModalView } from "../layout/summary/summary";
import { Icons } from "../ui/icons";
import { useToast } from "../ui/use-toast";
import { assert } from "@/utils/assert";

export const AddTimeModalContent = ({
  line,
  setIsOpenProlongPhoneNumberModal,
}: {
  line?: ILine;
  setIsOpenProlongPhoneNumberModal: (value: boolean) => void;
}) => {
  const { ...user } = useUserState();

  const [initialProlongTime, setInitialProlongTime] = React.useState(5);

  const { data: totalCostResponse } = useQuery({
    queryKey: ["lines-prolong-pricing", { phoneId: line?.id, minutes: initialProlongTime }],
    queryFn: async () => {
      assert(line?.id, "line id is required");
      const response = await LinesAPI.getPriceForNumberByMinutes({
        phoneId: line?.id,
        minutes: initialProlongTime,
      });
      return response.data.toFixed(2);
    },
    enabled: !!line?.id,
  });

  const queryClient = useQueryClient();
  const { toast } = useToast();

  const prolongPhoneMutation = useMutation({
    mutationFn: LinesAPI.prolong,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lines-active"] });
      queryClient.invalidateQueries({ queryKey: ["get-me"] });
      toast({
        title: "Success",
        description: "Phone time has been added successfully",
      });
    },
    onError: (error: string) => {
      toast({
        title: "Error",
        description: error,
        variant: "destructive",
      });
    },
  });

  const handleSubmitProlongPhone = async () => {
    if (!line) return;
    await prolongPhoneMutation.mutateAsync({ lineId: line.id, minutes: initialProlongTime });
    setIsOpenProlongPhoneNumberModal(false);
  };

  return (
    <div className="flex flex-col px-6 pb-5">
      {/* minus and plus buttons */}
      <div className="flex my-6 gap-x-3">
        <Button
          variant={"secondary"}
          className="w-[68px] h-[40px] bg-container_brand_dark"
          onClick={() => {
            if (initialProlongTime > 5) {
              setInitialProlongTime(initialProlongTime - 5);
            }
          }}
        >
          <Icons.MinusBrandIcon />
        </Button>

        <div className="bg-container_dark rounded-lg flex justify-center flex-1 items-center">
          <TypographyP className="font-normal">{initialProlongTime} minutes</TypographyP>
        </div>

        <Button
          variant={"secondary"}
          className="w-[68px] h-[40px] bg-container_brand_dark"
          onClick={() => {
            setInitialProlongTime(initialProlongTime + 5);
          }}
        >
          <Icons.PlusBrandIcon />
        </Button>
      </div>

      {/* summary */}
      <div className="mt-5 mb-[20px]">
        <SummaryModalView balance={user.balance || 0} totalCost={Number(totalCostResponse || 0)} />
      </div>

      <Button isPending={prolongPhoneMutation.isPending} onClick={handleSubmitProlongPhone}>
        <div className="flex space-x-2 items-center">
          <Icons.AddTime />
          <TypographySmall className="font-bold leading-none relative">Add time</TypographySmall>
        </div>
      </Button>
    </div>
  );
};
