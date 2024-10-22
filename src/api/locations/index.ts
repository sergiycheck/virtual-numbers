import { makeApiRequest } from "..";
import { PagenatedParamsWithSearch, PaginatedResponse } from "../general.types";
import { LocationDTO } from "./types";

const LocationsAPI = {
  get: (params: Partial<PagenatedParamsWithSearch>) =>
    makeApiRequest<PaginatedResponse<LocationDTO>>({
      method: "get",
      url: "/locations",
      params,
    }),
};

export default LocationsAPI;
