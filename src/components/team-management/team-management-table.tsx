import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Status } from "./status";
import { columnNames } from "./team-management.data";
import { Icons } from "../ui/icons";

import CreditsIcon from "@/assets/svg/credits.svg?react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import AdminUsersAPI from "@/api/admin-users";
import { SkeletonTable } from "./team-management-table-skeleton";
import { useToast } from "../ui/use-toast";
import ConfirmActionModal from "../ui/modal-confirm-action";
import { useMemo, useState } from "react";
import { UserModel } from "@/api/users/types";
import { removeAfterAtSymbol } from "@/utils/remove-after-symbol";

export interface TeamManagementTableRow {
  id: string;
  accountName: string;
  emailAddress: string;
  credits: number;
  activeNumbers: number;
  status: Status;
  actionEnabled: boolean;
}

export default function TeamManagementTable() {
  const { data, isLoading, isFetching } = useQuery({
    queryKey: ["sub-uses"],
    queryFn: async () => {
      const response = await AdminUsersAPI.list();
      return response.data;
    },
  });

  if (isLoading || isFetching) {
    return <SkeletonTable />;
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow className="text-xs font-medium !border-b-0 grid grid-cols-[163.8px_201px_163.8px_163.8px_163.8px_163.8px]">
            <TableHead className="text-text_03 pl-8 pr-6 pt-3 pb-0 h-auto">Account Name</TableHead>

            {columnNames.map((columnName) => (
              <TableHead key={columnName} className="text-text_03 px-6 pt-3 pb-0 h-auto">
                {columnName}
              </TableHead>
            ))}

            <TableHead className="text-text_03 text-right px-8 pt-3 pb-0 h-auto">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data?.map((row) => (
            <RowItem key={row.id} row={row} />
          ))}
        </TableBody>
      </Table>
    </>
  );
}

const RowItem = ({ row }: { row: UserModel }) => {
  const queryClient = useQueryClient();

  const { toast } = useToast();

  const removeSubUserMutation = useMutation({
    mutationFn: AdminUsersAPI.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sub-uses"] });
      toast({
        title: "Sub user removed",
        description: "Sub user was successfully removed",
      });
    },
    onError: (error: string) => {
      toast({
        title: "Error removing sub user",
        description: error,
        variant: "destructive",
      });
    },
  });

  const [isOpen, setIsOpen] = useState(false);
  const handleDeleteSubUser = (subUserId: string) => {
    setIsOpen(false);
    removeSubUserMutation.mutate(subUserId);
  };

  const userNameFromEmail = useMemo(() => {
    return removeAfterAtSymbol(row.email);
  }, [row.email]);

  return (
    <>
      <TableRow className="h-16 grid grid-cols-[163.8px_201px_163.8px_163.8px_163.8px_163.8px]">
        <TableCell className="py-6 pl-8 pr-6 text-text_01 text-[0.8125rem] font-medium leading-4 overflow-hidden">
          {row.fullName || userNameFromEmail}
        </TableCell>
        <TableCell className="p-6 text-text_02 text-[0.8125rem] font-medium leading-4">
          {row.email}
        </TableCell>
        <TableCell className="p-6 text-text_02 text-sm font-medium">
          <div className="flex items-center gap-1">
            <CreditsIcon height={16} width={16} />
            <span className="leading-5 text-sm">{row.balance}</span>
          </div>
        </TableCell>
        <TableCell className="p-6 text-text_02 text-[0.8125rem] font-medium leading-4">0</TableCell>
        <TableCell className="px-6 py-[22px]">
          <Status status={"confirmed"} />
        </TableCell>
        <TableCell className="pl-6 py-[14px] pr-8 flex justify-end">
          <div
            onClick={() => {
              if (!row.isEmailConfirmed) return;
              setIsOpen(true);
            }}
            className="grid place-content-center w-8 h-9 bg-btn_secondary_disabled rounded-[6px]"
          >
            {row.isEmailConfirmed ? (
              <Icons.RemoveUserWarning width={20} height={20} className="cursor-pointer" />
            ) : (
              <Icons.RemoveUserDisabled width={20} height={20} className="cursor-not-allowed" />
            )}
          </div>
        </TableCell>
      </TableRow>

      {/* confirm delete sub user */}
      <ConfirmActionModal
        open={isOpen}
        onOpenChange={setIsOpen}
        actionCallback={() => handleDeleteSubUser(row.id)}
        title="Delete Sub User"
        titleDescription="Are you sure you want to delete this account?"
      />
    </>
  );
};
