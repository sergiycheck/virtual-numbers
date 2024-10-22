import { useMemo } from "react";

export const useNumberFormatted = (number: string) => {
  const numberFormatted = useMemo(
    () => `(${number.slice(1, 4)}) ${number.slice(4, 7)} ${number.slice(7)}`,
    [number]
  );

  return numberFormatted;
};
