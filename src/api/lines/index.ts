import { makeApiRequest } from "..";
import { PaginatedParams, PaginatedResponse } from "../general.types";
import { ILine, ILineUsed } from "./types";
// import { getActiveLinesJsonMapped } from "./mocks/get-lines-json.helper";
// import { getLines } from "./mocks/get-lines";
// import { getLinesReportedJson } from "./mocks/get-lines-reported";

const LinesAPI = {
  get: (params: PaginatedParams) =>
    // mock
    //   ({
    //   data: { ...getLines },
    // }),
    makeApiRequest<PaginatedResponse<ILineUsed>>({
      method: "get",
      url: "/lines",
      params,
    }),
  getActive: (params: PaginatedParams) =>
    // mock
    // ({
    //   data: {
    //     ...getActiveLinesJsonMapped(),
    //   },
    // }),
    makeApiRequest<PaginatedResponse<ILine>>({
      method: "get",
      url: "/lines/active",
      params,
    }),
  getReported: (params: PaginatedParams) =>
    // mock
    // ({
    //   data: { ...getLinesReportedJson },
    // }),
    makeApiRequest<PaginatedResponse<ILineUsed>>({
      method: "get",
      url: "/lines/reported",
      params,
    }),
  post: (servicesIds: number[]) =>
    makeApiRequest<ILine>({
      method: "post",
      url: "/lines",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      data: JSON.stringify({ servicesIds }),
    }),
  addServices: ({ lineId, servicesIds }: { lineId: string; servicesIds: number[] }) =>
    makeApiRequest<ILine>({
      method: "post",
      url: `/lines/${lineId}/add-services`,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      data: JSON.stringify({ servicesIds }),
    }),
  subUser: (id: string) =>
    makeApiRequest({
      method: "get",
      url: `/lines/sub-user/${id}`,
    }),
  prolong: ({ lineId, minutes }: { lineId: string; minutes: number }) =>
    makeApiRequest<ILine>({
      method: "post",
      url: `/lines/${lineId}/prolong/${minutes}`,
    }),

  report: ({ lineId, option, text }: { lineId: string; option: string; text: string }) =>
    makeApiRequest({
      method: "post",
      url: `/lines/${lineId}/report`,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      data: JSON.stringify({ text, option }),
    }),
  finishLine: (id: string) =>
    makeApiRequest({
      method: "delete",
      url: `/lines/${id}`,
    }),
  getPriceForNumberByMinutes: ({ phoneId, minutes }: { phoneId: string; minutes: number }) =>
    makeApiRequest<number>({
      method: "get",
      url: `/lines/${phoneId}/prolong/pricing/${minutes}`,
    }),
};

export default LinesAPI;
