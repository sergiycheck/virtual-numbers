import { forwardRef, useEffect, useMemo, useState } from "react";
import { Modal } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DialogClose } from "@radix-ui/react-dialog";
import {
  Select,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import CreditsIcon from "@/assets/svg/credits.svg?react";
import { Icons } from "../ui/icons";
import { TypographyMuted } from "../ui/typography";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import AdminUsersAPI from "@/api/admin-users";
import { Label } from "../ui/label";
import { UserModel } from "@/api/users/types";
import { z } from "zod";
import { useToast } from "../ui/use-toast";
import TransactionsAPI from "@/api/transactions";

const amountSchema = z.number();

interface Props {
  trigger: React.ReactNode;
}

export default function TransferCreditsModal({ trigger }: Props) {
  const [isOpen, setIsOpen] = useState(false);

  const queryClient = useQueryClient();

  const user = queryClient.getQueryData(["get-me"]) as UserModel;

  const { data: subUsers } = useQuery({
    queryKey: ["sub-uses"],
    queryFn: async () => {
      const response = await AdminUsersAPI.list();
      return response.data;
    },
  });

  const subUsersWithMe = useMemo(() => {
    return user && subUsers && [user, ...subUsers];
  }, [subUsers, user]);

  const [firstSelectedUser, setFirstSelectedUser] = useState<UserModel | null>(null);
  const [secondSelectedUser, setSecondSelectedUser] = useState<UserModel | null>(null);

  const [amount, setAmount] = useState("");
  const onAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = amountSchema.safeParse(Number(e.target.value));
    if (value.success) {
      setAmount(value.data.toString());
    }
  };

  useEffect(() => {
    if (subUsersWithMe) {
      setFirstSelectedUser(subUsersWithMe[0]);
      setSecondSelectedUser(subUsersWithMe[1]);
    }
  }, [subUsersWithMe]);

  const { toast } = useToast();

  const tranferTransactionMutation = useMutation({
    mutationFn: TransactionsAPI.post,
    onSuccess: () => {
      setIsOpen(false);
      queryClient.invalidateQueries({ queryKey: ["sub-uses"] });
      queryClient.invalidateQueries({ queryKey: ["get-me"] });
      toast({
        title: "Credits transferred",
        description: "Credits were successfully transferred",
      });
    },
    onError: (error: string) => {
      toast({
        title: "Error transferring credits",
        description: error,
        variant: "destructive",
      });
    },
  });

  const handleTransfer = () => {
    if (!firstSelectedUser || !secondSelectedUser || !amount) return;

    tranferTransactionMutation.mutate({
      sum: Number(amount),
      toUserId: secondSelectedUser.id,
      fromUserId: firstSelectedUser.id,
    });
  };

  return (
    <Modal
      open={isOpen}
      onOpenChange={setIsOpen}
      trigger={trigger}
      header
      title="Transfer credits"
      titleDescription={
        <div className="flex items-center">
          <TypographyMuted className="text-text_03">
            Elementum facilisis nunc in ultricies nibh est mattis nisl
          </TypographyMuted>
        </div>
      }
      className="sm:w-[460px] sm:h-[456px]"
    >
      <div className="flex flex-col pt-6 px-7">
        <div className="space-y-5">
          {/* from */}
          <div className="flex flex-col gap-y-2">
            <Label>From</Label>
            <Select
              defaultValue={firstSelectedUser?.email}
              onValueChange={(value) => {
                const selectedUser = subUsersWithMe?.find((user) => user.id === value);
                selectedUser && setFirstSelectedUser(selectedUser);
              }}
            >
              <SelectTrigger className="border-field_border bg-container_dark py-2.5 pr-4 pl-3 focus:ring-1 rounded-lg">
                <SelectValue asChild>
                  <Value
                    value={firstSelectedUser?.email.toString()}
                    balance={firstSelectedUser?.balance.toString()}
                  />
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {subUsersWithMe?.map((user) => {
                  return (
                    <SelectItem key={user.id} value={user.id}>
                      <span>{user.email}</span>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>
          {/* to */}
          <div className="flex flex-col gap-y-2">
            <Label>To</Label>
            <Select
              defaultValue={secondSelectedUser?.email}
              onValueChange={(value) => {
                const selectedUser = subUsersWithMe?.find((user) => user.id === value);
                selectedUser && setSecondSelectedUser(selectedUser);
              }}
            >
              <SelectTrigger className="border-field_border bg-container_dark py-2.5 pr-4 pl-3 focus:ring-1 rounded-lg">
                <SelectValue asChild>
                  <Value
                    value={secondSelectedUser?.email.toString()}
                    balance={secondSelectedUser?.balance.toString()}
                  />
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {subUsersWithMe?.map((user) => {
                  return (
                    <SelectItem key={user.id} value={user.id}>
                      {user.email}
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>

          {/* amount */}
          <div className="flex flex-col gap-y-2">
            <Label>Transferring Amount</Label>
            <div className="relative">
              <CreditsIcon height={20} width={20} className="absolute top-[10px] left-3" />
              <Input
                onChange={onAmountChange}
                value={amount}
                className="pl-[42px]"
                placeholder="Enter Amount"
              />
            </div>
          </div>
        </div>

        <div className="flex flex-1 gap-4 mt-8">
          <DialogClose asChild>
            <Button
              onClick={() => setIsOpen(false)}
              className="gap-x-1 flex-1 items-center font-bold leading-4 pl-4 pr-5 py-2.5"
              variant="secondary"
            >
              <Icons.XBrandIcon height={20} width={20} />
              <span>Cancel</span>
            </Button>
          </DialogClose>
          <Button
            isPending={tranferTransactionMutation.isPending}
            onClick={handleTransfer}
            type="submit"
            className="gap-x-1.5 flex-1 items-center font-bold px-5 py-2.5 leading-4"
          >
            <Icons.TransferDark height={20} width={20} className="fill-current" />
            <span>Transfer</span>
          </Button>
        </div>
      </div>
    </Modal>
  );
}

interface ValueProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: string;
  balance?: string;
}

const Value = forwardRef<HTMLDivElement, ValueProps>((props, forwardedRef) => {
  const { value, balance, ...restProps } = props;

  return (
    <div {...restProps} ref={forwardedRef} className="flex items-center w-full">
      <div className="flex justify-between w-full">
        <span>{value}</span>
        <div className="flex items-center gap-x-2.5">
          <TypographyMuted className="text-text_03 text-sm">Balance: </TypographyMuted>
          <div className="flex gap-x-1 items-center">
            <CreditsIcon height={12} width={12} />
            <span className="text-xs font-medium">{balance}</span>
          </div>
        </div>
      </div>
      <div className="h-4 w-[1px] ml-4 mr-[11px] bg-border" />
    </div>
  );
});
