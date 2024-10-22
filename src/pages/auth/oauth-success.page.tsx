import { auth2faVerify, AuthResponse } from "@/api/auth";
import {
  HaveAccountOrSignUpLinkPart,
  OrSeparator,
  SocialLoginsPart,
} from "@/components/auth/social-logins-with-sign-in-link-part";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CustomOtpInput } from "@/components/ui/custom-otp-input";
import { Label } from "@/components/ui/label";
import { TypographyTitleAuth } from "@/components/ui/typography";
import { useToast } from "@/components/ui/use-toast";
import { useOAuthRedirect } from "@/hooks/useOAuthRedirect";
import { useAuthState } from "@/store/slices/authSlice";
import { useMutation } from "@tanstack/react-query";
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function OauthSuccessPage() {
  const [requiredOtp, setRequiredOtp] = useState(false);
  const [optSetupCode, setOptSetupCode] = useState("");
  const onOptSetupCodeChange = (value: string) => {
    const isNumberOrEmptyString = /^[0-9]*$/.test(value);
    if (!isNumberOrEmptyString) return;
    setOptSetupCode(value);
  };

  const { verificationToken } = useOAuthRedirect();

  const { login } = useAuthState();
  const { toast } = useToast();
  const navigate = useNavigate();

  const loginActionsCb = useCallback(
    (data: AuthResponse) => {
      login(data as AuthResponse);

      toast({
        title: "Logged in successful",
        description: "You have been logged in successfully",
      });

      navigate("/");
    },
    [login, toast, navigate]
  );

  useEffect(() => {
    if (!verificationToken) return;

    setRequiredOtp(true);
  }, [verificationToken]);

  const verify2faMutation = useMutation({
    mutationFn: auth2faVerify,
    onSuccess: (result) => {
      const data = result.data;
      toast({
        title: "2FA authentication",
        description: "2 factor authentication successful",
      });

      loginActionsCb(data as AuthResponse);
    },
    onError: () => {
      toast({
        title: "Error verifying text message",
        description: "There was an error verifying text message",
        variant: "destructive",
      });
    },
  });

  const handleVerify2fa = (code: string) => {
    verify2faMutation.mutate({ code, verificationToken });
  };

  return requiredOtp ? (
    <>
      <Card className="sm:w-[466px] sm:h-[524px] drop-shadow-card relative bottom-[54px] left-[5px]">
        <CardContent>
          <div className="flex flex-col space-y-2 text-center">
            <TypographyTitleAuth>Sign In</TypographyTitleAuth>
          </div>

          <div className="mt-8 pl-[3px]">
            <div className="flex flex-col gap-y-4">
              <Label>Enter the code from the app</Label>
              <div className="flex justify-center">
                <CustomOtpInput
                  value={optSetupCode}
                  onChange={(value) => onOptSetupCodeChange(value)}
                />
              </div>
              <div className="flex flex-1 mt-8">
                <Button
                  isPending={verify2faMutation.isPending}
                  onClick={() => {
                    handleVerify2fa(optSetupCode);
                  }}
                  type="submit"
                  className="gap-x-1.5 flex-1 items-center font-bold px-5 py-2.5 leading-4"
                >
                  Verify
                </Button>
              </div>
            </div>
          </div>

          <OrSeparator />

          <SocialLoginsPart />

          <HaveAccountOrSignUpLinkPart
            haveAccountText="Don't have an account?"
            signInOrUpLink="/auth/sign-up"
            signInOrUpText="Sign Up"
          />
        </CardContent>
      </Card>
    </>
  ) : (
    <></>
  );
}
