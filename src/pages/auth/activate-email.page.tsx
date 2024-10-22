import { useParams } from "react-router";
import { activateUser } from "@/api/users";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { useQuery } from "@tanstack/react-query";
import { RiLoader5Fill, RiCheckboxCircleLine, RiErrorWarningLine } from "react-icons/ri";
import { Card, CardContent } from "@/components/ui/card";
import { SocilaLoginWithSignInLinkPart } from "@/components/auth/social-logins-with-sign-in-link-part";
import { TypographyTitleAuth } from "@/components/ui/typography";

const ConfirmSignUpPage = () => {
  const { toast } = useToast();
  const params = useParams();
  const token = params.token;
  const navigate = useNavigate();

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
      navigate("/auth/sign-in");
    }
  }, [isFetched, isError, navigate, toast]);

  return (
    <Card className="sm:min-w-[460px] drop-shadow-card relative bottom-[54px] left-[5px]">
      <CardContent>
        <TypographyTitleAuth>Email confirmation</TypographyTitleAuth>
        <div className="p-4 rounded-lg mt-8 pl-[3px]">
          {!!token && (
            <>
              {isLoading && !isError && (
                <div className="flex items-center gap-4 text-foreground">
                  <RiLoader5Fill className="animate-spin" size={25} />
                  <div className="flex flex-col">
                    <span className="font-bold text-xl">Confirming...</span>
                    <span className="text-sm">Please wait</span>
                  </div>
                </div>
              )}
              {!isLoading && !isError && (
                <div className="flex items-center gap-4 text-foreground">
                  <RiCheckboxCircleLine size={25} />
                  <div className="flex flex-col">
                    <span className="font-bold text-xl">Email confirmed successfully!</span>
                    <span className="text-sm">You can close this page</span>
                  </div>
                </div>
              )}
            </>
          )}

          {!token ||
            (isError && (
              <div className="flex items-center gap-4 text-text_warning">
                <RiErrorWarningLine size={25} />
                <div className="flex flex-col">
                  <span className="font-bold text-xl">Confirmation failed</span>
                  <p className="text-sm">
                    Confirmation link is expired or invalid token provided
                    <br />
                    Please, try again or resend confirmation link
                  </p>
                </div>
              </div>
            ))}
        </div>

        <SocilaLoginWithSignInLinkPart />
      </CardContent>
    </Card>
  );
};

export default ConfirmSignUpPage;
