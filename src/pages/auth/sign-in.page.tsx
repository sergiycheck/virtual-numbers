import { TypographyTitleAuth } from "@/components/ui/typography";
import { UserSignInForm } from "@/components/auth/user-sign-in-form";
import { Card, CardContent } from "@/components/ui/card";
import {
  HaveAccountOrSignUpLinkPart,
  OrSeparator,
  SocialLoginsPart,
} from "@/components/auth/social-logins-with-sign-in-link-part";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

export default function SignInPage() {
  const queryClient = useQueryClient();

  useEffect(() => {
    queryClient.clear();
  }, [queryClient]);

  return (
    <Card className="sm:w-[466px] drop-shadow-card relative bottom-[54px] left-[5px]">
      <CardContent>
        <div className="flex flex-col space-y-2 text-center">
          <TypographyTitleAuth>Sign In</TypographyTitleAuth>
        </div>

        <div className="mt-8 pl-[3px]">
          <UserSignInForm />
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
  );
}
