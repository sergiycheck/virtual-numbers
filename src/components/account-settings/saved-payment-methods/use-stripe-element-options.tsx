import { useTheme } from "@/components/theme/theme-provider";
import { stripeElementOptions } from "@/utils/stripe";
import { useMemo } from "react";

export const useStripeElementOptions = () => {
  const { theme } = useTheme();
  const darkMode = theme === "dark";
  const elementOptions = useMemo(() => stripeElementOptions(darkMode), [darkMode]);

  return elementOptions;
};
