import { useEffect } from "react";
import { useToast } from "../ui/use-toast";
import { ConfirmEmailContent } from "./confirm-email-content";
import { activateUser } from "@/api/users";
import { useQuery } from "@tanstack/react-query";
import { useParams, useNavigate } from "react-router";

const ConfirmSignUpPage = () => {
  const { toast } = useToast();
  const params = useParams();
  const redirect = useNavigate();
  const token = params.token;

  const { isFetched, isLoading, isError } = useQuery({
    queryKey: ["confirm-sign-up"],
    queryFn: async () => activateUser(token as string),
    enabled: !!token,
    refetchOnWindowFocus: false,
    retry: false,
  });

  useEffect(() => {
    if (isFetched && !isError) {
      toast({
        title: "Account Confirmed!",
        description: "Please proceed to login.",
      });

      redirect("/sign-in");
    }
  }, [isFetched, isError, toast]);

  return <ConfirmEmailContent token={!!token} isError={isError} isLoading={isLoading} />;
};

export default ConfirmSignUpPage;
