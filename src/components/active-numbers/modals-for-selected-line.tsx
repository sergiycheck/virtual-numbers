import { TypographyMuted } from "@/components/ui/typography";
import { Modal } from "@/components/ui/modal";
import { SelectServicesTable } from "@/components/sidebar-rent-number/select-services-table";
import { AddTimeModalContent } from "@/components/active-numbers/add-time-modal-content";
import { ReportNumberModalContent } from "@/components/active-numbers/report-number-modal-content";

import { TService } from "@/api/services";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import LinesAPI from "@/api/lines";
import { Badge } from "@/components/ui/badge";
import { useModalsSelectedAndOpenState } from "./hooks/use-modals-selected-and-open-state";
import { useToast } from "../ui/use-toast";
import { useNumberFormatted } from "./hooks/use-number-formatted";

export const ModalsForSelectedLine = ({
  selectedILine,
  isOpenSelectServicesModal,
  setIsOpenSelectServicesModal,
  isOpenProlongPhoneNumberModal,
  setIsOpenProlongPhoneNumberModal,
  isOpenReportPhoneNumberModal,
  setIsOpenReportPhoneNumberModal,
}: ReturnType<typeof useModalsSelectedAndOpenState>) => {
  const numberFormatted = useNumberFormatted(selectedILine?.number || "");

  const queryClient = useQueryClient();
  const { toast } = useToast();

  const addNewServiceToPhoneMutation = useMutation({
    mutationFn: LinesAPI.addServices,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lines-active"] });
      toast({
        title: "Success",
        description: "Service has been added successfully",
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

  const onSubmitSelectedServices = async (services: TService[]) => {
    if (!selectedILine) return;

    const servicesIds = services.map((item) => item.id);
    await addNewServiceToPhoneMutation.mutateAsync({ lineId: selectedILine?.id, servicesIds });
    setIsOpenSelectServicesModal(false);
  };

  return (
    <>
      {/* add service to current phone modal  */}
      <Modal
        open={isOpenSelectServicesModal}
        onOpenChange={setIsOpenSelectServicesModal}
        header={true}
        title={"Add service"}
        className="sm:w-[428px]"
        titleDescription={
          <div className="flex sm:items-center space-x-2">
            <TypographyMuted className="text-sm">Select services to add to</TypographyMuted>
            <Badge variant={"destructive"}>{numberFormatted}</Badge>
          </div>
        }
      >
        <div className="pt-6">
          <SelectServicesTable
            selectedServices={selectedILine?.services}
            isPending={addNewServiceToPhoneMutation.isPending}
            onSubmitSelectedServices={onSubmitSelectedServices}
            submitButtonText="Add service"
            summaryView="modal"
          />
        </div>
      </Modal>

      {/* prolong current phone number time  */}
      <Modal
        open={isOpenProlongPhoneNumberModal}
        onOpenChange={setIsOpenProlongPhoneNumberModal}
        header={true}
        className="sm:w-[428px] sm:min-h-[324px]"
        title={"Add time"}
        titleDescription={
          <div className="inline-flex gap-x-[6px] items-center">
            <TypographyMuted>Select the time you want to add to</TypographyMuted>
            <Badge variant={"destructive"}>{numberFormatted}</Badge>
          </div>
        }
      >
        <AddTimeModalContent
          line={selectedILine}
          setIsOpenProlongPhoneNumberModal={setIsOpenProlongPhoneNumberModal}
        />
      </Modal>

      {/* report current phone */}
      <Modal
        open={isOpenReportPhoneNumberModal}
        onOpenChange={setIsOpenReportPhoneNumberModal}
        header={true}
        className="sm:w-[428px] sm:h-[444px]"
        title={"Report number"}
        titleDescription={
          <div className="inline-flex space-x-2 items-center">
            <TypographyMuted>Add report reason of</TypographyMuted>
            <Badge variant={"destructive"}>{numberFormatted}</Badge>
          </div>
        }
      >
        <ReportNumberModalContent
          line={selectedILine}
          setIsOpenReportPhoneNumberModal={setIsOpenReportPhoneNumberModal}
        />
      </Modal>
    </>
  );
};
