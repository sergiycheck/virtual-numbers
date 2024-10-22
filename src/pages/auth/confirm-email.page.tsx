import { TypographyMuted, TypographyTitleAuth } from "@/components/ui/typography";
import ConfirmEmailBtn from "@/components/auth/confirm-email-btn";
import { Card, CardContent } from "@/components/ui/card";
import { SocilaLoginWithSignInLinkPart } from "@/components/auth/social-logins-with-sign-in-link-part";

export default function Page() {
  return (
    <Card className="sm:min-w-[460px] drop-shadow-card relative bottom-[54px] left-[5px]">
      <CardContent>
        <div className="flex flex-col text-center">
          <TypographyTitleAuth>Email Confirmation Required</TypographyTitleAuth>
          <div className="my-8 pl-[3px]">
            <TypographyMuted>Please check your email for a confirmation link.</TypographyMuted>
            <TypographyMuted>You can close this page after confirmation.</TypographyMuted>
          </div>

          <ConfirmEmailBtn />
        </div>

        <SocilaLoginWithSignInLinkPart />
      </CardContent>
    </Card>
  );
}
