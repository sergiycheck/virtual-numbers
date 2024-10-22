import { makeApiRequest } from "..";
// import getServicesJson from "./mocks/get-services.json";

export type TService = {
  id: number;
  name: string;
  disabled: boolean;
  price: number;
};

const ServicesAPI = {
  get: ({ search, zip }: { search?: string; zip?: string }) =>
    // mock
    // ({
    //   data: getServicesJson,
    // }),
    makeApiRequest<TService[]>({
      method: "get",
      url: "/services",
      params: {
        search,
        zip,
      },
    }),
};

export default ServicesAPI;
