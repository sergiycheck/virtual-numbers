import { SelectServicesTable } from "./select-services-table";
import { useState } from "react";
import { TService } from "@/api/services";
import ConfirmActionModal from "@/components/ui/modal-confirm-action";
import { TypographyMuted, TypographySmall } from "../ui/typography";
import CreditsIcon from "@/assets/svg/credits.svg?react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import LinesAPI from "@/api/lines";
import { useToast } from "../ui/use-toast";

export function SelectServicesTableSideBar() {
  const [requestConfirmationDialog, setRequestConfirmationDialog] = useState(false);

  const [selectedServices, setSelectedServices] = useState<TService[]>([]);
  const totalCost = selectedServices.reduce((acc, c) => (acc += c.price), 0);

  const onSubmitSelectedServices = async (services: TService[]) => {
    setSelectedServices(services);
    setRequestConfirmationDialog(true);
  };

  const queryClient = useQueryClient();
  const { toast } = useToast();

  const requestLinesMutation = useMutation({
    mutationFn: LinesAPI.post,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lines-active"] });
      queryClient.invalidateQueries({ queryKey: ["get-me"] });
      queryClient.invalidateQueries({ queryKey: ["sms-active"] });

      toast({
        title: "Success",
        description: "Phone number has been requested successfully",
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

  const handleRequestLines = async () => {
    await requestLinesMutation.mutateAsync(selectedServices.map((service) => service.id));
    setRequestConfirmationDialog(false);
  };

  return (
    <div className="flex flex-col flex-1 h-full overflow-hidden">
      <SelectServicesTable
        isPending={requestLinesMutation.isPending}
        onSubmitSelectedServices={onSubmitSelectedServices}
        submitButtonText="Rent number"
        summaryView="sidebar"
      />

      <ConfirmActionModal
        isPending={requestLinesMutation.isPending}
        open={requestConfirmationDialog}
        onOpenChange={setRequestConfirmationDialog}
        actionCallback={handleRequestLines}
        title="Request phone number?"
        titleDescription="Are you sure you want to request phone number with services:"
        description={
          <>
            <ul className="ml-5 py-2 list-disc">
              {selectedServices.map((service) => (
                <li key={service.id}>{service.name}</li>
              ))}
            </ul>
            <div className="flex items-center space-x-2">
              <TypographySmall>That will cost</TypographySmall>
              <div className="flex items-center gap-1">
                <CreditsIcon width={15} height={15} />
                <TypographyMuted>{totalCost.toFixed(2)}</TypographyMuted>
              </div>
              <TypographySmall>credits</TypographySmall>
            </div>
          </>
        }
      />
    </div>
  );
}
