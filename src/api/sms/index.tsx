import { makeApiRequest } from "..";
import { PaginatedParams, PaginatedResponse } from "../general.types";
import { Message } from "./types";
// import getSmsActiveLinesJson from "./mocks/get-sms-active-lines.json";

const SMSApi = {
  sms: (params?: PaginatedParams & { search?: string }) =>
    makeApiRequest<PaginatedResponse<Message>>({
      method: "get",
      url: "/sms",
      params,
    }),
  "/sms/sub-user": ({ search, subUserId }: { search?: string; subUserId: string }) =>
    makeApiRequest<Message[]>({
      method: "get",
      url: `/sms/sub-user/${subUserId}`,
      params: {
        search,
      },
    }),
  activeLinesSms: (params?: PaginatedParams & { search?: string }) =>
    // mock
    // ({
    //   data: {
    //     data: getSmsActiveLinesJson,
    //   },
    // }),

    makeApiRequest<PaginatedResponse<Message>>({
      method: "get",
      url: "/sms/active-lines",
      params,
    }),
  activeLinesSmsByPhoneId: (params?: PaginatedParams & { search?: string; phoneId: string }) =>
    // mock
    // ({
    //   data: {
    //     data: getSmsActiveLinesJson,
    //   },
    // }),

    makeApiRequest<PaginatedResponse<Message>>({
      method: "get",
      url: `/sms/by-phone-id/${params?.phoneId}`,
      params,
    }),
};

export default SMSApi;
