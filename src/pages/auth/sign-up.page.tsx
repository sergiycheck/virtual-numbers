import { TypographyTitleAuth } from "@/components/ui/typography";
import { UserSignUpForm } from "@/components/auth/user-sign-up-form";
import { Card, CardContent } from "@/components/ui/card";
import { SocilaLoginWithSignInLinkPart } from "@/components/auth/social-logins-with-sign-in-link-part";

export default function AuthenticationPage() {
  return (
    <Card className="sm:min-w-[460px] drop-shadow-card relative bottom-[54px] left-[5px]">
      <CardContent>
        <div className="flex flex-col space-y-2 text-center">
          <TypographyTitleAuth>Sign up</TypographyTitleAuth>
        </div>
        <div className="mt-8 pl-[3px]">
          <UserSignUpForm />
        </div>

        <SocilaLoginWithSignInLinkPart />
      </CardContent>
    </Card>
  );
}
