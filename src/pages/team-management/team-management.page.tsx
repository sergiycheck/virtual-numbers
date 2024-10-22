import TeamManagementTable from "@/components/team-management/team-management-table";
import { TableOverflowWrapper } from "@/components/templates/tables-overflow-wrapper";
import AddTeamMemberModal from "@/components/team-management/add-team-member-modal";
import TransferCreditsModal from "@/components/team-management/transfer-credits-modal";
import { Button } from "@/components/ui/button";
import { TypographyH1, TypographyMuted } from "@/components/ui/typography";
import { Icons } from "@/components/ui/icons";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import AdminUsersAPI from "@/api/admin-users";
import { TablesNoDataFallback } from "@/components/templates/tables-no-data-fallback";
import { useMemo } from "react";
import { UserModel } from "@/api/users/types";

export default function TeamManagementPage() {
  const queryClient = useQueryClient();

  const user = queryClient.getQueryData(["get-me"]) as UserModel;

  const {
    data: subUsers,
    isLoading,
    isFetching,
  } = useQuery({
    queryKey: ["sub-uses"],
    queryFn: async () => {
      const response = await AdminUsersAPI.list();
      return response.data;
    },
  });

  const subUsersWithMe = useMemo(() => {
    return user && subUsers && [user, ...subUsers];
  }, [subUsers, user]);

  const notEnoghtTeamMembersToTransferCreditsOrLoading =
    (subUsersWithMe && subUsersWithMe?.length < 2) || isLoading || isFetching;

  const emptyData = !subUsersWithMe?.length;

  return (
    <div className="flex flex-col h-full">
      <div className="px-12 py-8 border-b border-input">
        <TypographyH1>Team Management</TypographyH1>
        <TypographyMuted className="text-text_02">
          Elementum facilisis nunc in ultricies nibh. Est mattis nisl id in consequat sed.
        </TypographyMuted>
      </div>
      {/* team management table */}
      <div className="flex-1">
        {emptyData ? (
          <TablesNoDataFallback />
        ) : (
          <TableOverflowWrapper className="xl:max-w-[1020px]" scrollAreaClassName="h-[650px] mt-4">
            <TeamManagementTable />
          </TableOverflowWrapper>
        )}
      </div>

      {/* transfer and  add new team member buttons*/}
      <div className="flex flex-col md:flex-row md:justify-end gap-4 py-6 px-12 self-end w-full border-input border-t">
        <TransferCreditsModal
          trigger={
            <Button
              disabled={notEnoghtTeamMembersToTransferCreditsOrLoading}
              isPending={isFetching}
              className="gap-x-1 w-[170px] flex justify-center items-center disabled:cursor-not-allowed"
              variant="secondary"
            >
              <Icons.TransferBrand
                height={20}
                width={20}
                className="fill-current relative left-[-1px]"
              />
              <span>Transfer credits</span>
            </Button>
          }
        />
        <AddTeamMemberModal
          trigger={
            <Button className="gap-x-1 w-[225px]">
              <Icons.PlusDark height={20} width={20} />
              <span>Add new team member</span>
            </Button>
          }
        />
      </div>
    </div>
  );
}
