import { StripeElementStyle } from "@stripe/stripe-js";

export const stripeElementOptions = (darkMode: boolean) => ({
  style: {
    base: {
      fontSize: "14px",
      lineHeight: "20px",
      fontWeight: 500,
      color: darkMode ? "#D6D6D6" : "#161616",
      fontFamily: "'Inter', sans-serif",
      "::placeholder": {
        color: "#454545",
      },
    },
  } as StripeElementStyle,
});
