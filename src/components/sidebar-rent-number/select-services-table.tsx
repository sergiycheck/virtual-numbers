import TanstackTable from "@/components/ui/tanstack-table";
import { getCoreRowModel, useReactTable } from "@tanstack/react-table";
import clsx from "clsx";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import ServicesAPI, { TService } from "@/api/services";
import { servicesColumns } from "./services-columns";
import { Button } from "@/components/ui/button";
import { TypographyMuted, TypographySmall } from "@/components/ui/typography";
import useUserState from "@/store/slices/userSlice";
import { SummaryModalView, SummarySidebarView } from "../layout/summary/summary";
import SearchField from "../ui/search-field";
import { Icons } from "../ui/icons";
import { ScrollArea } from "../ui/scroll-area";
import { SkeletonTanstackTable } from "@/components/ui/skeleton-tanstack-table";
import { TablesNoDataFallback } from "../templates/tables-no-data-fallback";
import { Service } from "@/api/services/types";
import { useInfiniteLocationsQuery } from "./queries/get-infinite-locations-query";
import { Badge } from "../ui/badge";
import { useIsVisible } from "@/hooks/use-is-visible";
import { LocationDTO } from "@/api/locations/types";
import { cn } from "@/lib/utils";
import { debounce } from "@/utils/debounce";
import { z } from "zod";

const searchSchema = z.string().max(5).min(0);

export function SelectServicesTable({
  onSubmitSelectedServices,
  submitButtonText,
  summaryView,
  isPending,
  selectedServices,
}: {
  onSubmitSelectedServices: (services: TService[]) => void;
  submitButtonText: string;
  summaryView: "sidebar" | "modal";
  isPending: boolean;
  selectedServices?: Service[];
}) {
  const [searchValue, setSearchValue] = useState("");
  const [searchLocationValue, setSearchLocationValue] = useState("");

  const { ...user } = useUserState();

  const [rowSelection, setRowSelection] = useState({});
  const [defaultRowSelection, setDefaultRowSelection] = useState({});

  const { data: linesResponse, isLoading } = useQuery({
    queryKey: ["search-services", searchValue, searchLocationValue],
    queryFn: async () => {
      const response = await ServicesAPI.get({ search: searchValue, zip: searchLocationValue });
      return response.data;
    },
  });

  const defaultValue = useMemo(() => {
    return [];
  }, []);

  const extractDefaultSelection = useCallback(
    (name: string) => {
      return !Object.keys(defaultRowSelection).includes(name);
    },
    [defaultRowSelection]
  );

  const table = useReactTable<TService>({
    data: linesResponse ?? defaultValue,
    columns: servicesColumns,
    state: {
      rowSelection,
    },
    enableRowSelection: (row) => extractDefaultSelection(row.original.name),
    onRowSelectionChange: setRowSelection,
    getRowId: (row) => row.name,
    getCoreRowModel: getCoreRowModel(),
  });

  useEffect(() => {
    if (selectedServices) {
      const selectedServicesState = selectedServices.reduce((acc, c) => {
        acc[c.name] = true;
        return acc;
      }, {});

      setRowSelection(selectedServicesState);

      setDefaultRowSelection(selectedServicesState);
    }
  }, [selectedServices]);

  const totalCost = table
    .getSelectedRowModel()
    .flatRows.filter((item) => extractDefaultSelection(item.original.name))
    .reduce((acc, c) => (acc += c.original.price), 0);

  const selectedServicesFromTableLength = table
    .getSelectedRowModel()
    .flatRows.filter((item) => extractDefaultSelection(item.original.name)).length;

  const selectedServicesFromTable = table
    .getSelectedRowModel()
    .flatRows.filter((item) => extractDefaultSelection(item.original.name))
    .map((r) => r.original);

  const insufficientCredits = useMemo(() => (user.balance ?? 0) < totalCost, [totalCost, user]);

  const isButtonDisabled = useMemo(() => {
    return !selectedServicesFromTableLength || insufficientCredits;
  }, [insufficientCredits, selectedServicesFromTableLength]);

  const emptyData = !linesResponse?.length;

  return (
    <div
      className={cn(
        "flex flex-col relative gap-y-[5px] h-full",
        summaryView == "modal" ? "h-[calc(100vh-200px)]" : "h-full"
      )}
    >
      {/* search input with table */}
      <div className="flex flex-col space-y-2 px-7">
        <LocationsCommandComponent
          searchLocationValue={searchLocationValue}
          setSearchLocationValue={setSearchLocationValue}
        />
        <TypographyMuted className="text-sm">Select services</TypographyMuted>
        <SearchField
          className="w-full"
          placeholder="Search service by name"
          onChange={(e) => {
            const searchValue = searchSchema.safeParse(e.target.value);
            if (searchValue.success) {
              debounce(setSearchValue(searchValue.data), 500)();
            }
          }}
        ></SearchField>
      </div>

      <div className="h-full overflow-hidden">
        <ScrollArea
          id="services-table"
          style={{
            minHeight: "600px",
            maxHeight: "calc(100vh - 500px)",
            height: summaryView == "sidebar" ? `100%` : "600px",
          }}
        >
          {isLoading ? (
            <SkeletonTanstackTable cols={2} rows={9} />
          ) : emptyData ? (
            <TablesNoDataFallback />
          ) : (
            <>
              <TanstackTable
                table={table}
                tHeadClassName={
                  summaryView == "sidebar" ? "dark:bg-sidebar_bg bg-background" : "bg-background"
                }
              />
              <div className="h-[500px] w-full"></div>
            </>
          )}
        </ScrollArea>
      </div>

      {/* summary */}
      <div
        className={clsx(
          ` flex flex-col border-t border-input bg-container_same_bg py-5 px-7 gap-y-4
            shadow-[0px_-5px_18.8px_0px_rgba(0,0,0,0.25)]
            xl:absolute fixed bottom-0 left-0 right-0
          `
        )}
      >
        {/* Summary */}
        {!!selectedServicesFromTableLength &&
          (summaryView === "sidebar" ? (
            <>
              <SummarySidebarView balance={user.balance || 0} totalCost={totalCost} />
            </>
          ) : (
            <>
              <SummaryModalView balance={user.balance || 0} totalCost={totalCost} />
            </>
          ))}

        {summaryView === "sidebar" ? (
          <>
            <Button
              variant="secondary"
              onClick={() => {
                onSubmitSelectedServices(selectedServicesFromTable);
                setRowSelection({});
              }}
              disabled={isButtonDisabled}
              isPending={isPending}
              className="flex items-center space-x-1 "
            >
              {isButtonDisabled ? <Icons.PlusDisabled /> : <Icons.PlusBrandIcon />}
              <TypographySmall
                className={clsx("font-bold", isButtonDisabled && "text-text_disabled")}
              >
                {submitButtonText}
              </TypographySmall>
            </Button>
          </>
        ) : (
          <>
            <Button
              variant="default"
              onClick={() => {
                onSubmitSelectedServices(selectedServicesFromTable);
                setRowSelection({});
              }}
              disabled={isButtonDisabled}
              isPending={isPending}
              className="flex items-center space-x-1 relative top-[5px]"
            >
              {isButtonDisabled ? <Icons.PlusDisabled /> : <Icons.PlusDark />}
              <TypographySmall
                className={clsx("font-bold", isButtonDisabled && "text-text_disabled")}
              >
                {submitButtonText}
              </TypographySmall>
            </Button>
          </>
        )}
      </div>
    </div>
  );
}

type LocationsCommandComponentProps = {
  searchLocationValue: string;
  setSearchLocationValue: (value: string) => void;
};
const LocationsCommandComponent = (props: LocationsCommandComponentProps) => {
  const { searchLocationValue, setSearchLocationValue } = props;
  const [searchFieldValue, setSearchFieldValue] = useState("");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const updateSearchLocationValue = () => {
      const baseSearchValue = removeZeroFromZip(searchFieldValue);
      const searchValue = searchSchema.safeParse(baseSearchValue);
      if (searchValue.success) {
        setSearchLocationValue(searchValue.data);
      }
    };
    debounce(updateSearchLocationValue, 500)();
  }, [searchFieldValue]);

  const { data: locationsResponse, fetchNextPage } = useInfiniteLocationsQuery(searchLocationValue);

  const locationsData = useMemo(
    () => (locationsResponse ? locationsResponse.pages.flatMap((d) => d.data) : []),
    [locationsResponse]
  );

  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        debounce(() => setOpen(false), 100)();
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div ref={wrapperRef} className="flex flex-col space-y-2 ">
      <TypographyMuted>Select Zip Code</TypographyMuted>
      <div className="flex flex-col relative">
        <SearchField
          tabIndex={-1}
          value={searchFieldValue}
          onChange={(e) => {
            const searchValue = searchSchema.safeParse(e.target.value);
            if (searchValue.success) {
              const searchValueData = searchValue.data;
              setSearchFieldValue(searchValueData);
            }
          }}
          onClick={() => debounce(() => setOpen(true), 100)()}
          onFocus={() => debounce(() => setOpen(true), 100)()}
          placeholder="Search by zip code"
          className={cn(
            open
              ? "rounded-b-none border-b-none focus-visible:outline-none focus-visible:ring-0"
              : "rounded-t-lg rounded-b-lg"
          )}
        />

        <div className={cn(open ? "absolute z-20 top-[40px] w-full" : "hidden")}>
          <ScrollArea
            className={cn(
              "h-72 w-full mt-0  bg-container_dark rounded-b-lg border-l border-r border-b border-border"
            )}
          >
            {locationsData.map((item) => {
              return (
                <ListItemFromDropdown
                  key={`${item.zip}`}
                  item={item}
                  nearLastItem={locationsData[locationsData.length - 1].zip === item.zip}
                  fetchNextPage={fetchNextPage}
                  searchLocationValue={searchLocationValue}
                  setSearchFieldValue={setSearchFieldValue}
                  setOpen={setOpen}
                ></ListItemFromDropdown>
              );
            })}
          </ScrollArea>
        </div>
      </div>
    </div>
  );
};

function addZeroToZip(zip: string) {
  return zip.toString().length == 4 ? `0${zip}` : zip;
}

function removeZeroFromZip(zip: string) {
  return zip.length === 5 && zip[0] === "0" ? zip.slice(1) : zip;
}

type ListItemFromDropdownProps = {
  item: LocationDTO;
  nearLastItem: boolean;
  fetchNextPage: any;
  searchLocationValue: string;
  setSearchFieldValue: (value: string) => void;
  setOpen: (value: boolean) => void;
};

const ListItemFromDropdown = (props: ListItemFromDropdownProps) => {
  const { item, nearLastItem, fetchNextPage, searchLocationValue, setSearchFieldValue, setOpen } =
    props;

  const ref = useRef(null);
  const isVisible = useIsVisible(ref);

  useEffect(() => {
    if (isVisible && nearLastItem) {
      fetchNextPage();
    }
  }, [isVisible, nearLastItem, fetchNextPage]);

  const formattedZip = useMemo(() => {
    return addZeroToZip(item.zip.toString());
  }, [item.zip]);

  return (
    <div
      ref={ref}
      className="flex items-center justify-between cursor-pointer border-b border-dropdown_values_border
        hover:bg-container_light_1 px-4 py-2"
      onClick={() => {
        const searchValue = searchSchema.safeParse(item.zip.toString());
        if (searchValue.success) {
          setSearchFieldValue(addZeroToZip(searchValue.data));
          setOpen(false);
        }
      }}
    >
      <div className="flex gap-x-[10px] items-center">
        <Badge
          className="text-text_02 text-[12px] rounded-sm py-[2px] px-[6px] w-[47px] h-[20px] 
        bg-[rgba(204,199,196,0.04)]
        "
          variant={"destructive"}
        >
          {formattedZip}
        </Badge>
        <TypographyMuted>
          {item.city}, {item.state_id}
        </TypographyMuted>
      </div>
      {searchLocationValue == item.zip.toString() && (
        <Icons.CheckBrand className="w-5 h-5 text-text_brand" />
      )}
    </div>
  );
};
