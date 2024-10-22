import { ILine } from "@/api/lines/types";
import React from "react";

export const useModalsSelectedAndOpenState = () => {
  const [selectedILine, setSelectedILine] = React.useState<ILine | undefined>();

  const [isOpenSelectServicesModal, setIsOpenSelectServicesModal] = React.useState(false);

  const [isOpenProlongPhoneNumberModal, setIsOpenProlongPhoneNumberModal] = React.useState(false);

  const [isOpenReportPhoneNumberModal, setIsOpenReportPhoneNumberModal] = React.useState(false);

  return {
    selectedILine,
    setSelectedILine,
    isOpenSelectServicesModal,
    setIsOpenSelectServicesModal,
    isOpenProlongPhoneNumberModal,
    setIsOpenProlongPhoneNumberModal,
    isOpenReportPhoneNumberModal,
    setIsOpenReportPhoneNumberModal,
  };
};
