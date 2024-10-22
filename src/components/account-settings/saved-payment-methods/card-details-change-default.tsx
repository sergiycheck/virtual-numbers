import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useStripeElementOptions } from "./use-stripe-element-options";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/ui/icons";
import { TypographySmall } from "@/components/ui/typography";
import { useState } from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { useToast } from "@/components/ui/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import StripeAPI from "@/api/stripe";
import { StripeCard } from "@/api/stripe/types";

export function CardDetailsChangeDefaultMethod({
  setOpen,
  selectedCard,
}: {
  setOpen: (open: boolean) => void;
  selectedCard: StripeCard | undefined;
}) {
  const elementOptions = useStripeElementOptions();
  const [radioValue, setRadioValue] = useState(false);
  const radioGroupValue = radioValue ? "default" : "not-default";

  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [loadingChange, setLoadingChange] = useState(false);

  const editCardMutation = useMutation({
    mutationFn: StripeAPI.putCard,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["saved-payment-methods"] });

      toast({
        title: "Card set to default",
        description: "Card was set to default",
      });
    },
    onError: (error: string) => {
      setLoadingChange(false);
      toast({
        title: "Error setting card to default",
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

    if (!selectedCard) return;

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

    setLoadingChange(true);

    await editCardMutation.mutateAsync({
      cardId: selectedCard.id,
      token: token.id,
      setDefault: radioValue,
    });

    setLoadingChange(false);
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

      <div className="mb-[1.2rem]">
        {/* Cardholder name */}
        <div className="flex flex-col gap-2">
          <Label>Cardholder name</Label>
          <Input id="card_name" name="card_name" placeholder="Card name" className="border-input" />
        </div>
      </div>

      <RadioGroup
        className="flex gap-x-3 items-center"
        value={radioGroupValue}
        onValueChange={() => {
          setRadioValue(true);
        }}
      >
        <RadioGroupItem value="default" id="r1" />
        <Label className="text-sm leading-5 font-medium" htmlFor="r1">
          Use as default card
        </Label>
      </RadioGroup>

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

          <Button isPending={loadingChange} className="w-full" type="submit">
            <div className="flex gap-x-[6px] items-center">
              <Icons.Check className="w-5 h-5" />

              <TypographySmall className="font-bold relative">Save changes</TypographySmall>
            </div>
          </Button>
        </div>
      </div>
    </form>
  );
}
