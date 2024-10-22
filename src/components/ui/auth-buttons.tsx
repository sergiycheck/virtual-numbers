import { Button } from "./button";
import { Icons } from "./icons";
import { baseURL } from "@/api";
import { TypographyP } from "./typography";

export function DiscordAuthButton() {
  return (
    <Button
      className="w-full h-9"
      variant="outline"
      type="button"
      onClick={() => window.location.assign(`${baseURL}/auth/discord`)}
    >
      <Icons.discord className="mr-2 h-5 w-5" />
      <TypographyP className="font-semibold leading-4 text-foreground">Discord</TypographyP>
    </Button>
  );
}

export function GoogleAuthBtn() {
  return (
    <Button
      className="w-full h-9"
      variant="outline"
      type="button"
      onClick={async () => {
        window.location.assign(`${baseURL}/auth/google`);
      }}
    >
      <Icons.google className="mr-2 h-5 w-5" />
      <TypographyP className="font-semibold leading-4 text-foreground">Google</TypographyP>
    </Button>
  );
}

export function SlackAuthBtn() {
  return (
    <Button
      className="w-full h-9"
      variant="outline"
      type="button"
      onClick={() => window.location.assign(`${baseURL}/auth/slack`)}
    >
      <Icons.slack className="mr-2 h-5 w-5" />
      <TypographyP className="font-semibold leading-4 text-foreground">Slack</TypographyP>
    </Button>
  );
}
