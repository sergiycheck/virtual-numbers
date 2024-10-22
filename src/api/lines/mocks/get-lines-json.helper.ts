import { addSeconds } from "date-fns";
import { getLinesActiveArr } from "./get-lines-active";

export const getActiveLinesJsonMapped = () => {
  const mappedResult = getLinesActiveArr.map((line, index) => {
    return {
      ...line,
      rentEndDate:
        index === 0
          ? addSeconds(new Date(), 30).toISOString()
          : index == 1
          ? addSeconds(new Date(), 120).toISOString()
          : addSeconds(new Date(), 180).toISOString(),
    };
  });

  return {
    data: mappedResult,
  };
};
