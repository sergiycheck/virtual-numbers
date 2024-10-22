import { Link } from "react-router-dom";
import { TypographyMuted } from "@/components/ui/typography";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { DiscordAuthButton, GoogleAuthBtn, SlackAuthBtn } from "@/components/ui/auth-buttons";

export const OrSeparator = () => {
  return (
    <div className="relative py-1 my-5 h-4">
      <Separator className="separator-gradient absolute w-[50%] left-0 transform rotate-180" />
      <div
        className="
        absolute
        left-[50%] top-[-15px] flex h-[40px] w-[40px] translate-x-[-50%]  items-center
      justify-center rounded-full bg-card z-10"
      >
        <TypographyMuted className="text-text_03">or</TypographyMuted>
      </div>
      <Separator className="separator-gradient absolute w-[50%] right-0" />
    </div>
  );
};

export const SocialLoginsPart = () => (
  <div className="flex flex-col sm:flex-row sm:space-x-3">
    <GoogleAuthBtn />
    <DiscordAuthButton />
    <SlackAuthBtn />
  </div>
);

export const HaveAccountOrSignUpLinkPart = (props: {
  haveAccountText: string;
  signInOrUpLink: string;
  signInOrUpText: string;
}) => {
  return (
    <div className="flex items-end justify-center gap-3 w-full mt-7">
      <TypographyMuted className="dark:text-text_03 text-[13px] leading-4">
        {props.haveAccountText}
      </TypographyMuted>
      <Button size="link" variant={"link"} asChild>
        <Link to={props.signInOrUpLink}>{props.signInOrUpText}</Link>
      </Button>
    </div>
  );
};

export const SocilaLoginWithSignInLinkPart = () => {
  return (
    <>
      <OrSeparator />

      <SocialLoginsPart />

      <HaveAccountOrSignUpLinkPart
        haveAccountText="Already have account?"
        signInOrUpLink="/auth/sign-in"
        signInOrUpText="Sign In"
      />
    </>
  );
};
