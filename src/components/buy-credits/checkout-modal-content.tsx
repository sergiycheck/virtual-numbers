import { useQuery } from "@tanstack/react-query";
import { Button } from "../ui/button";
import { Icons } from "../ui/icons";
import TanstackTableCheckbox from "../ui/tanstack-table-checkbox";
import { TypographyMuted, TypographyP } from "../ui/typography";
import CreditsIcon from "@/assets/svg/credits.svg?react";
import StripeAPI from "@/api/stripe";
import { SkeletonSmallPaymentCard } from "./skeleton-small-card-item";
import { StripeCard } from "@/api/stripe/types";
import { ScrollArea } from "../ui/scroll-area";
import { useEffect, useState } from "react";
import { TablesNoDataFallback } from "../templates/tables-no-data-fallback";

type CheckoutModalContentProps = {
  resultedCredits: number;
  resultedTotal: number;
  onSubmit: (card: StripeCard) => void;
  onAddNewPaymentClick: () => void;
  isPending: boolean;
};

export const CheckoutModalContent = (props: CheckoutModalContentProps) => {
  const { resultedCredits, resultedTotal, onSubmit, onAddNewPaymentClick, isPending } = props;

  const { data, isLoading } = useQuery({
    queryKey: ["saved-payment-methods"],
    queryFn: async () => {
      const res = await StripeAPI.cards();
      return res.data;
    },
  });

  const [scrollAreaHeigh, setScrollAreaHeight] = useState(112);
  const [selectedCard, setSelectedCard] = useState<StripeCard | null>(null);

  useEffect(() => {
    if (data && data.cards?.length) {
      setSelectedCard(data.cards[0]);
    }
  }, [data]);

  const emptyData = !data?.cards?.length;

  return (
    <>
      <div className="pt-5 px-7">
        <div className="flex flex-col flex-1">
          {/* credits amount */}
          <div className="flex p-4 bg-container_light rounded-t-lg border-b border-input">
            <TypographyP className="flex-1 text-base leading-5">Credits amount</TypographyP>
            <div className="flex space-x-[1.5px] justify-center items-center">
              <CreditsIcon />
              <TypographyMuted>{resultedCredits}</TypographyMuted>
              <Icons.DownArrow />
            </div>
          </div>
          {/* subtotal */}
          <div className="px-5 py-4 border border-input rounded-b-lg space-y-1">
            <div className="flex justify-between">
              <TypographyMuted>Subtotal</TypographyMuted>
              <TypographyMuted>${resultedTotal.toFixed(2)}</TypographyMuted>
            </div>
            <div className="flex justify-between">
              <TypographyMuted className="text-base leading-5 font-semibold text-text_03">
                Total
              </TypographyMuted>
              <TypographyMuted className="text-base leading-5 font-semibold text-foreground">
                ${resultedTotal.toFixed(2)}
              </TypographyMuted>
            </div>
          </div>
          {/* select payment method */}
          <TypographyP className="text-text_01 leading-5 font-medium mt-6 mb-4">
            Select payment method
          </TypographyP>

          {/* payment methods */}
          <ScrollArea
            style={{
              height: `${scrollAreaHeigh}px`,
            }}
          >
            <div className="flex flex-col gap-4">
              {isLoading ? (
                <>
                  <SkeletonSmallPaymentCard />
                  <SkeletonSmallPaymentCard />
                </>
              ) : emptyData ? (
                <TablesNoDataFallback />
              ) : (
                <>
                  {data?.cards?.map((item) => (
                    <SmallCardItem
                      key={item.id}
                      card={item}
                      setSelectedCard={setSelectedCard}
                      selectedCard={selectedCard}
                    />
                  ))}
                </>
              )}
            </div>
          </ScrollArea>
          {/* show all and add new */}
          <div className="flex justify-between mt-4">
            <Button
              onClick={() => setScrollAreaHeight((old) => (old === 112 ? 200 : 112))}
              variant={"ghost"}
              className="flex gap-1 items-center px-0 py-0 h-fit hover:bg-inherit"
            >
              <TypographyP className="text-text_brand font-bold">Show all</TypographyP>
              <Icons.DownArrow className="w-4 h-4 relative " />
            </Button>
            <Button
              onClick={onAddNewPaymentClick}
              variant={"ghost"}
              className="flex gap-1 items-center px-0 py-0 h-fit hover:bg-inherit"
            >
              <Icons.PlusBrandIcon className="w-4 h-4 relative " />
              <TypographyP className="text-text_brand font-bold">
                Add new payment method
              </TypographyP>
            </Button>
          </div>
        </div>
        {/* checkout button */}
        <div className="pt-9 pb-5">
          <Button
            isPending={isPending}
            onClick={() => {
              if (selectedCard) {
                onSubmit(selectedCard);
              }
            }}
            className="w-full"
          >
            Confirm purchase
          </Button>
        </div>
      </div>
    </>
  );
};

const SmallCardItem = ({
  card,
  setSelectedCard,
  selectedCard,
}: {
  card: StripeCard;
  setSelectedCard: (card: StripeCard) => void;
  selectedCard: StripeCard | null;
}) => {
  return (
    <div
      className="px-5 py-3 bg-container_light rounded-lg flex cursor-pointer"
      onClick={() => {
        setSelectedCard(card);
      }}
    >
      <div className="flex gap-4 items-center">
        <TanstackTableCheckbox
          variant="circle"
          {...{
            checked: selectedCard?.id === card.id,
            onChange: () => {
              setSelectedCard(card);
            },
          }}
        />
        <div className="flex gap-3">
          <div className="rounded-lg bg-[rgba(255,_255,_255,_0.10)] w-[41px] h-6 grid place-items-center">
            <Icons.VisaText />
          </div>
          <TypographyP className="text-[13px] leading-5">Ending in {card.last4}</TypographyP>
        </div>
      </div>
      <div className="ml-auto flex space-x-1 items-center">
        <TypographyMuted className="text-text_03 text-xs font-medium">
          Billing Zip Code:
        </TypographyMuted>
        <TypographyMuted className="text-text_01 text-xs font-medium">
          {card.address_zip}
        </TypographyMuted>
      </div>
    </div>
  );
};
