import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import AppRouter from "@/components/router";

import { Toaster } from "@/components/ui/toaster";

import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { Suspense, useEffect, useState, lazy } from "react";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false,
    },
  },
});

const useShowTanstackDevtools = () => {
  const [showDevtools, setShowDevtools] = useState(false);

  useEffect(() => {
    // @ts-expect-error assigning property to the window object
    window.toggleDevtools = () => setShowDevtools((old) => !old);
  }, []);

  return {
    showDevtools,
  };
};

const ReactQueryDevtoolsProduction = lazy(() =>
  import("@tanstack/react-query-devtools/production").then((d) => ({
    default: d.ReactQueryDevtools,
  }))
);

const STRIPE_PK = import.meta.env.VITE_STRIPE_PK;
const stripePromise = loadStripe(STRIPE_PK);

function App() {
  const { showDevtools } = useShowTanstackDevtools();
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <QueryClientProvider client={queryClient}>
        <Elements stripe={stripePromise}>
          <AppRouter />
          <Toaster />
        </Elements>
        {showDevtools && (
          <Suspense fallback={null}>
            <ReactQueryDevtoolsProduction />
          </Suspense>
        )}
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
