import { useState } from "react";
import { sendPasswordRestoreLink } from "@/api/users";
import { Card, CardContent } from "@/components/ui/card";
import { SocilaLoginWithSignInLinkPart } from "@/components/auth/social-logins-with-sign-in-link-part";
import { RiCheckboxCircleLine, RiErrorWarningLine } from "react-icons/ri";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  TypographyH4,
  TypographyMuted,
  TypographyP,
  TypographyTitleAuth,
} from "@/components/ui/typography";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";

type RestorePasswordFormData = {
  email: string;
};
type RestorePasswordModalState = "idle" | "pending" | "success" | "error";

const formSchema = z.object({
  email: z.string().email().min(5, {
    message: "Email must be at least 5 characters.",
  }),
});

export const PassRestorePage = () => {
  const [state, setState] = useState<RestorePasswordModalState>("idle");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  const { toast } = useToast();

  const sendPasswordRestoreMutation = useMutation({
    mutationFn: sendPasswordRestoreLink,
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Password reset link has been sent to your email",
      });
      setState("success");
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Something went wrong, please try again",
        variant: "destructive",
      });
      setState("error");
    },
  });

  const handleRestore = ({ email }: RestorePasswordFormData) => {
    sendPasswordRestoreMutation.mutate(email);
  };

  return (
    <Card className="w-[400px] sm:min-w-[460px] drop-shadow-card relative bottom-[54px] left-[5px]">
      <CardContent>
        <TypographyTitleAuth className="text-center">Reset password</TypographyTitleAuth>

        <Form {...form}>
          {state === "idle" && (
            <form
              onSubmit={form.handleSubmit(handleRestore)}
              className="pb-4 flex flex-col gap-y-4"
            >
              <div className="flex flex-col space-y-2 mt-8">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email address</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter email address" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Button
                isPending={sendPasswordRestoreMutation.isPending}
                type="submit"
                className="w-full justify-center"
              >
                Send reset link
              </Button>
            </form>
          )}

          {state == "success" && (
            <div className="flex items-center gap-4 mt-8">
              <RiCheckboxCircleLine className="text-text_success" size={35} />
              <div className="flex flex-col">
                <TypographyP className="text-xl font-semibold">Sent!</TypographyP>
                <TypographyMuted className="text-sm">
                  Reset password link has been successfully sent to your email
                </TypographyMuted>
              </div>
            </div>
          )}

          {state == "error" && (
            <div className="flex items-center gap-4 text-text_warning mt-8">
              <RiErrorWarningLine size={25} />
              <div className="flex flex-col">
                <TypographyH4>Restoring Failed</TypographyH4>
                <TypographyP>Somethin went wrong</TypographyP>
              </div>
            </div>
          )}
        </Form>
        <SocilaLoginWithSignInLinkPart />
      </CardContent>
    </Card>
  );
};
