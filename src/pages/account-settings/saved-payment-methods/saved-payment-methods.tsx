import { Icons } from "@/components/ui/icons";
import { TypographyMuted, TypographyP } from "@/components/ui/typography";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Modal } from "@/components/ui/modal";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import StripeAPI from "@/api/stripe";
import { SkeletonCard } from "@/components/account-settings/saved-payment-methods/skeleton-card";
import { CardDetailsChangeDefaultMethod } from "@/components/account-settings/saved-payment-methods/card-details-change-default";
import { CardDetailsAddNewCard } from "@/components/account-settings/saved-payment-methods/card-details-add-new";
import { cardIcons } from "@/components/account-settings/saved-payment-methods/saved-payments-methods-data";
import { StripeCard } from "@/api/stripe/types";
import { useToast } from "@/components/ui/use-toast";
import { TablesNoDataFallback } from "@/components/templates/tables-no-data-fallback";
import ConfirmActionModal from "@/components/ui/modal-confirm-action";

export const SavedPaymentMethods = () => {
  const [changePaymentMethodOpen, setChangePaymentMethodOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState<StripeCard>();

  const [addNewCardDialogOpen, setAddNewCardDialogOpen] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["saved-payment-methods"],
    queryFn: async () => {
      const res = await StripeAPI.cards();
      return res.data;
    },
  });

  const cards = data?.cards;
  const defaultCardId = data?.defaultCardId;
  const emptyData = !cards?.length;

  return (
    <div className="pt-7 sm:px-12 flex flex-col h-full">
      <div className="flex flex-col gap-4 flex-1 sm:w-[582px]">
        {isLoading ? (
          <>
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </>
        ) : emptyData ? (
          <TablesNoDataFallback />
        ) : (
          <>
            {cards?.map((item) => (
              <CardItem
                key={item.id}
                {...{
                  item,
                  defaultCardId,
                  changePaymentMethodOpen,
                  setChangePaymentMethodOpen,
                  setSelectedCard,
                }}
              />
            ))}
          </>
        )}
      </div>

      <div className="border-input border-t py-6 pl-6  flex justify-end">
        <Button
          className="py-3 px-5 flex gap-x-[6px] items-center justify-center w-[248px] h-[40px]"
          onClick={() => {
            setAddNewCardDialogOpen(!changePaymentMethodOpen);
          }}
        >
          <Icons.PlusDark width={20} height={20} />
          <TypographyP className="dark:text-text_primary_inverted font-bold leading-6 capitalize tracking-wider w-[182px]">
            Add new payment method
          </TypographyP>
        </Button>
      </div>

      {/* change default card modal  */}
      <Modal
        open={changePaymentMethodOpen}
        onOpenChange={setChangePaymentMethodOpen}
        header={true}
        className="sm:w-[459px] sm:h-[504px]"
        title={"Change payment method"}
        titleDescription={
          <div className="flex items-center">
            <TypographyMuted className="text-text_03">
              Elementum facilisis nunc in ultricies nibh est mattis nisl
            </TypographyMuted>
          </div>
        }
      >
        <div className="pt-8 px-7 pb-7">
          <CardDetailsChangeDefaultMethod
            setOpen={setChangePaymentMethodOpen}
            selectedCard={selectedCard}
          />
        </div>
      </Modal>

      {/* add new card modal  */}
      <Modal
        open={addNewCardDialogOpen}
        onOpenChange={setAddNewCardDialogOpen}
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
          <CardDetailsAddNewCard setOpen={setAddNewCardDialogOpen} />
        </div>
      </Modal>
    </div>
  );
};

function DropdownMenuLineItem({
  onEditCardHandler,
  onDeleteCardHandler,
  onSetDefaultCardHandler,
}: {
  onEditCardHandler: () => void;
  onDeleteCardHandler: () => void;
  onSetDefaultCardHandler: () => void;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="secondary" className="w-8 h-8 p-2">
          <Icons.EllipsisVertical />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[169px] bg-container_dark">
        <DropdownMenuGroup>
          {/* edit */}
          <DropdownMenuItem className="flex space-x-2 items-center" onClick={onEditCardHandler}>
            <Icons.Edit width={20} height={20} />
            <TypographyMuted className="font-semibold">Edit</TypographyMuted>
          </DropdownMenuItem>

          {/* set to default */}
          <DropdownMenuItem
            className="flex space-x-2 items-center"
            onClick={onSetDefaultCardHandler}
          >
            <Icons.Edit width={20} height={20} />
            <TypographyMuted className="font-semibold">Set to default</TypographyMuted>
          </DropdownMenuItem>

          {/* remove */}
          <DropdownMenuItem className="flex space-x-2 items-center" onClick={onDeleteCardHandler}>
            <Icons.Warning fill="#B93A3A" width={20} height={20} />
            <TypographyMuted className="text-text_warning font-semibold">Remove</TypographyMuted>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

type CardItemProps = {
  item: StripeCard;
  defaultCardId?: string;
  changePaymentMethodOpen: boolean;
  setChangePaymentMethodOpen: (value: boolean) => void;
  setSelectedCard: (value: StripeCard) => void;
};

const CardItem = ({
  item,
  defaultCardId,
  changePaymentMethodOpen,
  setChangePaymentMethodOpen,
  setSelectedCard,
}: CardItemProps) => {
  const { toast } = useToast();

  const queryClient = useQueryClient();

  const deleteCardMutation = useMutation({
    mutationFn: StripeAPI.deleteCard,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["saved-payment-methods"] });
      toast({
        title: "Card deleted",
        description: "Card was successfully deleted",
      });
    },
    onError: (error: string) => {
      toast({
        title: "Error deleting card",
        description: error,
        variant: "destructive",
      });
    },
  });

  const setDefaultCardMutation = useMutation({
    mutationFn: StripeAPI.setDefaultCard,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["saved-payment-methods"] });
      toast({
        title: "Card was set to default",
        description: "Card was successfully set to default",
      });
    },
    onError: (error: string) => {
      toast({
        title: "Error setting card to default",
        description: error,
        variant: "destructive",
      });
    },
  });

  const handleSetCardToDefault = (cardId: string) => {
    setDefaultCardMutation.mutate({ cardId });
  };

  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);

  const handleDeleteCard = (cardId: string) => {
    deleteCardMutation.mutate({ cardId });
    setIsDeleteConfirmOpen(false);
  };

  return (
    <>
      <div className="px-5 py-3 bg-container_light rounded-lg flex">
        <div className="flex gap-5 items-center">
          <div className="rounded-lg bg-[rgba(255,_255,_255,_0.10)] w-[41px] h-6 grid place-items-center">
            {
              cardIcons.find((card) => card.type.toLowerCase().includes(item.brand.toLowerCase()))
                ?.icon
            }
          </div>

          <div className="flex gap-y-[2px] flex-col">
            <TypographyP className="text-[14px] leading-5 font-semibold">
              Ending in {item.last4}
            </TypographyP>
            <div className="flex space-x-1 items-center">
              <TypographyMuted className="text-text_03 text-xs font-medium">
                Billing Zip Code:
              </TypographyMuted>
              <TypographyMuted className="text-text_01 text-xs font-medium">
                {item.address_zip}
              </TypographyMuted>
            </div>
          </div>
        </div>

        <div className="flex gap-x-4 ml-auto items-center">
          {/* eslint-disable  @typescript-eslint/no-explicit-any */}
          {item.id == defaultCardId && <Badge variant="success">Default</Badge>}

          <div className="flex space-x-2 justify-end items-center">
            <DropdownMenuLineItem
              onEditCardHandler={() => {
                setChangePaymentMethodOpen(!changePaymentMethodOpen);
                setSelectedCard(item);
              }}
              onDeleteCardHandler={() => {
                setIsDeleteConfirmOpen(true);
              }}
              onSetDefaultCardHandler={() => {
                handleSetCardToDefault(item.id);
              }}
            />
          </div>
        </div>
      </div>

      {/* confirm delete card */}
      <ConfirmActionModal
        open={isDeleteConfirmOpen}
        onOpenChange={setIsDeleteConfirmOpen}
        actionCallback={() => handleDeleteCard(item.id)}
        title="Delete card"
        titleDescription="Are you sure you want to delete this card?"
      />
    </>
  );
};
