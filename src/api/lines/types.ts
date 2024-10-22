import { Service } from "../services/types";
import { Message } from "../sms/types";

export type ILine = {
  id: string;
  createdAt: string;
  updatedAt: string;
  number: string;
  rentStartDate: string;
  rentEndDate: string;
  services: Service[];
  timeoutId: number;
  reported: boolean;
  smsArr: Message[];
};

export type ILineUsed = ILine & {
  costSum: number;
};
