import { Link, Navigate, useParams } from "react-router-dom";
import { confirmRestorePassword } from "@/api/users";
import { useState } from "react";
import { RiCheckboxCircleLine, RiErrorWarningLine, RiLoader5Fill } from "react-icons/ri";
import { InputPassword } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { SocilaLoginWithSignInLinkPart } from "@/components/auth/social-logins-with-sign-in-link-part";
import { TypographyTitleAuth } from "@/components/ui/typography";

export const ConfirmPasswordRestorePage = () => {
  const [state, setState] = useState<"idle" | "pending" | "success" | "error">("idle");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const params = useParams();
  const token = params.token;

  if (!token) return <Navigate to="/users/pass-restore" />;

  const handleSubmit = (e: React.FormEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setState("pending");
    confirmRestorePassword({
      changeToken: token,
      password,
      repeatPassword,
    })
      .then(() => setState("success"))
      .catch(() => setState("error"));
  };

  const isValid = password === repeatPassword;

  return (
    <Card className="w-[460px] drop-shadow-card relative bottom-[54px] left-[5px]">
      <CardContent className="flex flex-col space-y-8">
        <TypographyTitleAuth>Restore password</TypographyTitleAuth>

        <div className="mt-8 pl-[3px]">
          <form onSubmit={handleSubmit}>
            {state == "idle" && (
              <>
                <div className="pb-8">
                  <InputPassword
                    value={password}
                    onChange={(e) => setPassword(e.currentTarget.value)}
                    placeholder="Enter password"
                  />
                  <InputPassword
                    value={repeatPassword}
                    onChange={(e) => setRepeatPassword(e.currentTarget.value)}
                    className="mt-4"
                    placeholder="Enter password again"
                  />
                </div>
                <Button disabled={!isValid} type="submit" className="w-full justify-center">
                  Restore
                </Button>
              </>
            )}
            {state === "pending" && (
              <div className="flex items-center gap-4 text-primary">
                <RiLoader5Fill className="animate-spin" size={35} />
                <div className="flex flex-col">
                  <span className="text-lg font-semibold">Restoring...</span>
                  <span className="text-sm">Please wait</span>
                </div>
              </div>
            )}
            {state == "success" && (
              <div>
                <div className="flex items-center gap-4 text-primary">
                  <RiCheckboxCircleLine className="text-green-500" size={35} />
                  <div className="flex flex-col">
                    <span className="text-lg font-semibold">Success!</span>
                    <p className="text-sm">The password has been successfully changed.</p>
                  </div>
                </div>
                <div className="flex justify-center mt-8">
                  <Link to="/auth/sign-in">
                    <Button className="w-[100px] justify-center">Sign In</Button>
                  </Link>
                </div>
              </div>
            )}
            {state == "error" && (
              <div className="flex items-center gap-4 text-destructive/60">
                <RiErrorWarningLine size={25} />
                <div className="flex flex-col">
                  <span className="text-lg font-semibold clas">Restoring failed</span>
                  <p className="text-sm">
                    Link is expired or invalid.
                    <br />
                    Please, try again.
                  </p>
                </div>
              </div>
            )}
          </form>
        </div>
        <SocilaLoginWithSignInLinkPart />
      </CardContent>
    </Card>
  );
};
