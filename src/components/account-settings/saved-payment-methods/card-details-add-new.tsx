import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { useStripeElementOptions } from "./use-stripe-element-options";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/ui/icons";
import { TypographySmall } from "@/components/ui/typography";
import { useToast } from "@/components/ui/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import StripeAPI from "@/api/stripe";
import { useState } from "react";

export function CardDetailsAddNewCard({ setOpen }: { setOpen: (open: boolean) => void }) {
  const elementOptions = useStripeElementOptions();

  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();

  const queryClient = useQueryClient();

  const [loadingAddNewCard, setLoadingAddNewCard] = useState(false);

  const createCardMutation = useMutation({
    mutationFn: StripeAPI.createCard,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["saved-payment-methods"] });
      toast({
        title: "Card created",
        description: "Card was successfully created",
      });
    },
    onError: (error: string) => {
      setLoadingAddNewCard(false);
      toast({
        title: "Error creating card",
        description: error,
        variant: "destructive",
      });
    },
  });

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();

    const target = e.target as typeof e.target & {
      card_name: { value: string };
      cardholder_name: { value: string };
    };

    if (!stripe || !elements) {
      return;
    }

    const card = elements.getElement(CardNumberElement);

    if (!card) return;

    const result = await stripe.createToken(card, {
      name: target.card_name.value,
    });

    if (result.error) {
      toast({
        title: "Error creating card",
        description: result.error.message,
        variant: "destructive",
      });

      return;
    }

    const token = result.token;

    setLoadingAddNewCard(true);

    await createCardMutation.mutateAsync({
      token: token.id,
      setDefault: false,
    });

    setLoadingAddNewCard(false);

    setOpen(false);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col">
      {/* Card number */}
      <div className="mb-5">
        <div className="flex flex-col gap-2">
          <Label>Card number</Label>
          <div className="input-like-wrapper">
            <CardNumberElement options={elementOptions} />
          </div>
        </div>
      </div>

      <div className="flex gap-x-5 mb-5">
        {/* Exp date */}
        <div className="flex flex-col gap-2 flex-auto">
          <Label>Exp. date</Label>
          <div className="input-like-wrapper">
            <CardExpiryElement options={elementOptions} />
          </div>
        </div>

        {/* CVV */}
        <div className="flex flex-col gap-2 flex-auto">
          <Label>CVV</Label>
          <div className="input-like-wrapper">
            <CardCvcElement options={elementOptions} />
          </div>
        </div>
      </div>

      {/* Cardholder name */}
      <div className="flex flex-col gap-2">
        <Label>Cardholder name</Label>
        <Input id="card_name" name="card_name" placeholder="Card name" className="border-input" />
      </div>

      {/* checkout button */}
      <div className="pt-8">
        <div className="flex space-x-4">
          <Button
            className="w-full"
            variant="secondary"
            onClick={(e) => {
              e.preventDefault();
              setOpen(false);
            }}
          >
            <div className="flex space-x-1 items-center">
              <Icons.XBrandIcon className="w-5 h-5" />
              <TypographySmall className="font-bold relative">Cancel</TypographySmall>
            </div>
          </Button>

          <Button isPending={loadingAddNewCard} className="w-full" type="submit">
            <div className="flex gap-x-[6px] items-center">
              <Icons.PlusDark className="w-5 h-5" />
              <TypographySmall className="font-bold relative">Add card</TypographySmall>
            </div>
          </Button>
        </div>
      </div>
    </form>
  );
}
