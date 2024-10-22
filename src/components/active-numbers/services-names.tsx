import { ILine } from "@/api/lines/types";
import { TypographyMuted } from "../ui/typography";
import { Badge } from "../ui/badge";

export const ServicesNames = ({ iLine }: { iLine: ILine }) => {
  return (
    <>
      {iLine.services.length > 4 ? (
        <div className="flex space-x-2 items-center">
          <TypographyMuted className="text-nowrap">
            {iLine.services
              .slice(0, 4)
              .map((item) => item.name)
              .join(", ")
              .slice(0, 20)}
            {"..."}
          </TypographyMuted>
          <Badge className="bg-container_light dark:text-text_01 w-[1.625rem]" variant={"rounded"}>
            +1
          </Badge>
        </div>
      ) : (
        <>{iLine.services.map((item) => item.name).join(", ")}</>
      )}
    </>
  );
};
