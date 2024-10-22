import CreditsIcon from "@/assets/svg/credits.svg?react";
import { useCallback, useEffect, useState } from "react";
import { Button } from "../ui/button";
import clsx from "clsx";
import { Input } from "../ui/input";
import TanstackTableCheckbox from "../ui/tanstack-table-checkbox";
import {
  TypographyH2,
  TypographyMuted,
  TypographyMutedColumnTitle,
  TypographyP,
  TypographySmall,
} from "../ui/typography";
import { TableOverflowWrapper } from "../templates/tables-overflow-wrapper";
import {
  BuyCreditsTableTBodyRowWrapper,
  BuyCreditsTableTHeadRowWrapper,
} from "./buy-credits-table-row-wrapper";
import { Modal } from "../ui/modal";
import { Icons } from "../ui/icons";
import ArrowLeft from "@/assets/svg/arrow-left.svg?react";
import { CheckoutModalContent } from "./checkout-modal-content";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import StripeAPI from "@/api/stripe";
import { Price, StripeCard } from "@/api/stripe/types";
import useUserState from "@/store/slices/userSlice";
import { useNavigate } from "react-router-dom";
import { CardDetailsAddNewCard } from "../account-settings/saved-payment-methods/card-details-add-new";
import { TablesNoDataFallback } from "../templates/tables-no-data-fallback";
import { debounce } from "@/utils/debounce";

function BuyCreditsTable() {
  const [customCredits, setCustomCredits] = useState("");
  const [customPrice, setCustomPrice] = useState("--");
  const [customTotal, setCustomTotal] = useState("--");

  const [selectedRowId, setSelectedRowId] = useState("");
  const [resultedTotal, setResultedTotal] = useState(0);
  const [resultedCredits, setResultedCredits] = useState(0);

  const calculatePriceMutation = useMutation({
    mutationFn: async (numberValue: number) => {
      const result = await StripeAPI.calculatePrice(numberValue);
      return result.data;
    },
  });

  const handleCustomCreditsChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value.length > 10) return;

    const isNumber = /^[0-9]*$/.test(value);
    if (!isNumber) return;

    setCustomCredits(value);
    const numberValue = Number(value);

    if (value && !isNaN(numberValue)) {
      const totalPrice = await calculatePriceMutation.mutateAsync(numberValue);
      console.log("totalPrice", totalPrice);

      const pricePerCredit = (totalPrice / numberValue).toFixed(2);
      setCustomPrice(pricePerCredit);
      setCustomTotal(totalPrice.toString());

      setResultedTotal(Number(totalPrice));
      setResultedCredits(Number(value));
    } else {
      setCustomPrice("--");
      setCustomTotal("--");
    }
  };

  const [isOpenCheckoutModal, setIsOpenCheckoutModal] = useState(false);
  const [isOpenWaitingModal, setIsOpenWaitingModal] = useState(false);
  const [isOpenErrorModal, setIsOpenErrorModal] = useState(false);
  const [isOpenSuccessModal, setIsOpenSuccessModal] = useState(false);
  const navigate = useNavigate();
  const [addNewPaymentModalOpen, setAddNewPaymentModalOpen] = useState(false);

  const queryClient = useQueryClient();
  const createPaymentMutation = useMutation({
    mutationFn: StripeAPI.payment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["get-me"] });
    },
  });

  const { ...user } = useUserState();

  const onSubmitPayment = async (selectedCard: StripeCard) => {
    try {
      setIsOpenCheckoutModal(false);
      setIsOpenWaitingModal(true);
      await createPaymentMutation.mutateAsync({
        quantity: resultedCredits,
        cardId: selectedCard.id,
      });
      setIsOpenWaitingModal(false);
      setIsOpenSuccessModal(true);
    } catch (error) {
      setIsOpenWaitingModal(false);
      setIsOpenErrorModal(true);
    }
  };

  const { data: pricing } = useQuery({
    queryKey: ["get-prices"],
    queryFn: async () => {
      const result = await StripeAPI.getMockPrices();
      return result.data;
    },
  });

  const emptyCreditsData = !pricing?.length;

  const selectOptionCb = useCallback((option: Price) => {
    setSelectedRowId(option.id);
    setResultedTotal(option.total);
    setResultedCredits(option.credits);
  }, []);

  useEffect(() => {
    pricing && selectOptionCb(pricing[0]);
  }, [selectOptionCb, pricing]);

  return (
    <div className="flex flex-col flex-1 h-full">
      <div className="flex-1">
        {emptyCreditsData ? (
          <TablesNoDataFallback />
        ) : (
          <TableOverflowWrapper scrollAreaClassName="h-full">
            <BuyCreditsTableTHeadRowWrapper className="h-7 pt-3">
              <TypographyMutedColumnTitle className="pl-16 pr-6">
                Credits
              </TypographyMutedColumnTitle>
              <TypographyMutedColumnTitle className=" px-6">
                Price per Credit
              </TypographyMutedColumnTitle>
              <TypographyMutedColumnTitle className=" px-6">Total Price</TypographyMutedColumnTitle>
            </BuyCreditsTableTHeadRowWrapper>

            {pricing.map((option) => (
              <BuyCreditsTableTBodyRowWrapper
                onClick={() => {
                  selectOptionCb(option);
                }}
                key={option.id}
                className={clsx(
                  `h-16 cursor-pointer border-b border-input`,
                  selectedRowId === option.id && "dark:bg-container_same_bg"
                )}
              >
                <div className="pl-5 py-[22px] grid place-items-center">
                  <TanstackTableCheckbox
                    variant="circle"
                    {...{
                      checked: selectedRowId === option.id,
                      onChange: () => {
                        selectOptionCb(option);
                      },
                    }}
                  />
                </div>

                <div className="flex space-x-1 items-center py-[22px] pr-6">
                  <CreditsIcon className="h-5 w-5 relative top-[-1px]" />
                  <TypographyP className={clsx("text-base leading-4 font-normal")}>
                    {option.credits}
                  </TypographyP>
                </div>

                <TypographyMuted
                  className={clsx(
                    "py-6 pl-4 pr-6 text-[13px] leading-4 font-medium",
                    selectedRowId === option.id && "text-foreground"
                  )}
                >
                  ${option.pricePerCredit.toFixed(2)}
                </TypographyMuted>

                <TypographyMuted
                  className={clsx(
                    "py-6 pl-4 pr-6 text-[13px] leading-4 font-medium",
                    selectedRowId === option.id && "text-foreground"
                  )}
                >
                  ${option.total.toFixed(2)}
                </TypographyMuted>
              </BuyCreditsTableTBodyRowWrapper>
            ))}
            <BuyCreditsTableTBodyRowWrapper
              className={clsx(
                `h-16 cursor-pointer border-b border-input`,
                selectedRowId === "custom" && "dark:bg-container_same_bg"
              )}
            >
              <div className="pl-5 py-[22px] grid place-items-center">
                <TanstackTableCheckbox
                  variant="circle"
                  {...{
                    checked: selectedRowId === "custom",
                    onChange: () => {
                      setSelectedRowId("custom");
                      setResultedTotal(Number(customTotal));
                      setResultedCredits(Number(customCredits));
                    },
                  }}
                />
              </div>

              <div className="flex space-x-1 items-center py-[22px] pr-6">
                <CreditsIcon className="h-5 w-5 relative top-[-1px]" />

                <Input
                  className="h-5 pl-0 border-none active:border-none text-base leading-4 font-normal
                focus-visible:ring-0 bg-transparent w-36"
                  value={customCredits}
                  onChange={(e) => debounce(handleCustomCreditsChange(e), 500)()}
                  onFocus={() => setSelectedRowId("custom")}
                  placeholder="Enter amount"
                />
              </div>

              <TypographyMuted className={clsx("py-6 pl-4 pr-6 text-[13px] leading-4 font-medium")}>
                {!!customCredits && "$"}
                {customPrice}
              </TypographyMuted>

              <TypographyMuted className={clsx("py-6 pl-4 pr-6 text-[13px] leading-4 font-medium")}>
                {!!customCredits && "$"}
                {customTotal}
              </TypographyMuted>
            </BuyCreditsTableTBodyRowWrapper>
          </TableOverflowWrapper>
        )}
      </div>
      {!!resultedTotal && (
        <div
          className="h-[84px] ml-4 px-8 py-5 flex justify-between mb-4
          items-center border rounded-lg border-input dark:bg-container_same_bg"
        >
          <div className="flex flex-col space-y-1">
            <TypographyMuted className="text-text_02 font-medium">Summary:</TypographyMuted>

            <div className="flex items-center space-x-1">
              <CreditsIcon className="w-5 h-5" />
              <TypographyP className="text-base leading-5">
                {resultedCredits.toFixed(0)}
              </TypographyP>
              <TypographyMuted className="text-text_01 text-base leading-5">
                / ${resultedTotal.toFixed(2)}
              </TypographyMuted>
            </div>
          </div>

          <div className="flex items-center">
            <Button
              isPending={isOpenCheckoutModal}
              className="group py-3 px-5"
              onClick={() => setIsOpenCheckoutModal(true)}
            >
              Continue
            </Button>
          </div>
        </div>
      )}

      {/* checkout modal  */}
      <Modal
        open={isOpenCheckoutModal}
        onOpenChange={setIsOpenCheckoutModal}
        header={true}
        className="sm:w-[472px] sm:max-h-[650px]"
        title={"Checkout"}
        titleDescription={
          <div className="flex items-center">
            <TypographyMuted className="text-text_03">
              Elementum facilisis nunc in ultricies nibh est mattis nisl id in consequat sed.
            </TypographyMuted>
          </div>
        }
      >
        <CheckoutModalContent
          isPending={createPaymentMutation.isPending}
          resultedCredits={resultedCredits}
          resultedTotal={resultedTotal}
          onSubmit={onSubmitPayment}
          onAddNewPaymentClick={() => setAddNewPaymentModalOpen(true)}
        />
      </Modal>

      {/* add new card modal  */}
      <Modal
        open={addNewPaymentModalOpen}
        onOpenChange={setAddNewPaymentModalOpen}
        header={true}
        className="sm:w-[459px] sm:h-[462px]"
        title={"Add new card"}
        titleDescription={
          <div className="flex items-center">
            <TypographyMuted className="text-text_03">
              Elementum facilisis nunc in ultricies nibh est mattis nisl
            </TypographyMuted>
          </div>
        }
      >
        <div className="pt-8 px-7 pb-7">
          <CardDetailsAddNewCard setOpen={setAddNewPaymentModalOpen} />
        </div>
      </Modal>

      {/* waiting for payment */}
      <Modal
        open={isOpenWaitingModal}
        onOpenChange={setIsOpenWaitingModal}
        header={false}
        className="sm:w-[395px] sm:h-[190px]"
      >
        <div className="py-7 px-7 gap-2">
          <div className="flex items-center justify-center">
            <Icons.CheckoutWaitingForPayment className="w-[52px] h-[52px] animate-spin" />
          </div>

          <div className="flex flex-col items-center gap-y-1 relative top-[11px]">
            <TypographyH2>Waiting for payment</TypographyH2>
            <TypographyMuted className="text-text_03 text-center">
              Elementum facilisis nunc in ultricies nibh est mattis nisl id in consequat sed.
            </TypographyMuted>
          </div>
        </div>
      </Modal>

      {/* error checkout dialog */}
      <Modal
        open={isOpenErrorModal}
        onOpenChange={setIsOpenErrorModal}
        header={false}
        className="sm:w-[395px] sm:h-[258px]"
      >
        <div className="py-7 px-7">
          <div className="flex items-center justify-center">
            <Icons.CheckoutError className="w-[52px] h-[52px] animate-bounce" />
          </div>

          <div className="flex flex-col justify-center items-center gap-1 mt-[10px]">
            <TypographyH2>Error happened!</TypographyH2>
            <TypographyMuted className="text-text_03 text-center">
              Elementum facilisis nunc in ultricies nibh est mattis nisl id in consequat sed.
            </TypographyMuted>
          </div>

          <div className="flex justify-center mt-7">
            <Button
              className="py-[10px] px-5 flex gap-x-[6px]"
              onClick={() => setIsOpenErrorModal(false)}
            >
              <ArrowLeft className="w-5 h-5" />
              <TypographyP className="text-sm leading-4 font-bold text-text_primary_inverted">
                Back to checkout
              </TypographyP>
            </Button>
          </div>
        </div>
      </Modal>

      {/* success checkout dialog */}
      <Modal
        open={isOpenSuccessModal}
        onOpenChange={setIsOpenSuccessModal}
        header={false}
        className="sm:w-[395px] sm:h-[262px]"
      >
        <div className="py-7 px-7 gap-2 flex flex-col">
          <div className="flex items-center justify-center">
            <Icons.CheckoutSuccess className="w-[52px] h-[52px]" />
          </div>

          <div className="flex flex-col justify-center items-center gap-1">
            <TypographyH2>Purchase Confirmed!</TypographyH2>
            <div className="flex flex-col gap-1">
              <div className="flex gap-2 items-center justify-center">
                <TypographyMuted className="text-text_03 leading-5">
                  Your new balance is
                </TypographyMuted>

                <div className="flex gap-1 items-center justify-center">
                  <CreditsIcon className="w-4 h-4" />
                  <TypographySmall className="leading-6 text-text_01">
                    {user?.balance}
                  </TypographySmall>
                </div>
                <TypographyMuted className="text-text_03 leading-5">credits.</TypographyMuted>
              </div>

              <TypographyMuted className="text-text_03 text-center leading-5 relative top-[-1px]">
                Happy Activating!
              </TypographyMuted>
            </div>
          </div>

          <div className="flex justify-center items-center mt-4">
            <Button
              onClick={() => {
                navigate("/");
              }}
              className="px-5 py-3 h-10 w-[93px]"
            >
              {"Let’s go"}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default BuyCreditsTable;
