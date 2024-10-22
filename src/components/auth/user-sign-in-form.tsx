import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input, InputPassword } from "@/components/ui/input";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useToast } from "../ui/use-toast";
import { useAuthState } from "@/store/slices/authSlice";
import { useCallback, useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import {
  auth2faVerify,
  AuthResponse,
  Login2FADataFromVerificationToken,
  logInUser,
} from "@/api/auth";
import { decodeJwt } from "jose";
import { Label } from "../ui/label";
import { CustomOtpInput } from "../ui/custom-otp-input";

const formSchema = z.object({
  email: z.string().email().min(5, {
    message: "Email must be at least 5 characters.",
  }),
  password: z.string().min(4, {
    message: "Password must be at least 4 characters.",
  }),
});

type UserFormValue = z.infer<typeof formSchema>;

export function UserSignInForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const navigate = useNavigate();
  const { toast } = useToast();
  const { login } = useAuthState();
  const [searchParams] = useSearchParams();
  const error = searchParams.get("error");

  useEffect(() => {
    let timeOutId: any = "";
    if (error) {
      timeOutId = setTimeout(() => {
        toast({
          title: "Error",
          description: decodeURIComponent(error),
          variant: "destructive",
        });
      }, 0);
    }

    return () => {
      clearTimeout(timeOutId);
    };
  }, [error, toast]);

  const [verificationToken, setVerificationToken] = useState("");
  const [requiredOtp, setRequiredOtp] = useState(false);
  const [optSetupCode, setOptSetupCode] = useState("");
  const onOptSetupCodeChange = (value: string) => {
    const isNumberOrEmptyString = /^[0-9]*$/.test(value);
    if (!isNumberOrEmptyString) return;
    setOptSetupCode(value);
  };

  const [requiredSmsTextMessage, setRequiredSmsTextMessage] = useState(false);
  const [smsTextMessage, setSmsTextMessage] = useState("");
  const onSmsTextMessageChange = (value: string) => {
    const isNumberOrEmptyString = /^[0-9]*$/.test(value);
    if (!isNumberOrEmptyString) return;
    setSmsTextMessage(value);
  };

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

  const loginMutation = useMutation({
    mutationFn: logInUser,
    onSuccess: (result) => {
      const data = result.data as any;
      if (data?.verificationToken) {
        setVerificationToken(data.verificationToken);

        const dataFromVerificationTOken = decodeJwt(
          data?.verificationToken
        ) as unknown as Login2FADataFromVerificationToken;

        setRequiredOtp(dataFromVerificationTOken.isOTPAuthRequired);
        setRequiredSmsTextMessage(dataFromVerificationTOken.isPhoneAuthRequired);
      } else if (data.accessToken && data.refreshToken) {
        loginActionsCb(data as AuthResponse);
      }
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Invalid email or password",
        variant: "destructive",
      });
    },
  });

  const onSubmit = async (data: UserFormValue) => {
    const { email, password } = data;

    loginMutation.mutate({
      email,
      password,
    });
  };

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
      <div className="flex flex-col gap-y-4">
        <Label>Enter the code from the app</Label>
        <div className="flex justify-center">
          <CustomOtpInput value={optSetupCode} onChange={(value) => onOptSetupCodeChange(value)} />
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
    </>
  ) : requiredSmsTextMessage ? (
    <>
      <div className="flex flex-col gap-y-4">
        <Label>Enter the code from text message</Label>
        <div className="flex justify-center">
          <Input value={smsTextMessage} onChange={(e) => onSmsTextMessageChange(e.target.value)} />
        </div>
        <div className="flex flex-1 mt-8">
          <Button
            isPending={verify2faMutation.isPending}
            onClick={() => handleVerify2fa(smsTextMessage)}
            type="submit"
            className="gap-x-1.5 flex-1 items-center font-bold px-5 py-2.5 leading-4"
          >
            Verify
          </Button>
        </div>
      </div>
    </>
  ) : (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col items-start">
          <div className="flex flex-col gap-y-4 w-full">
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

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <InputPassword type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            ></FormField>
          </div>

          <Button size="link" variant={"link"} asChild className="font-bold leading-5 mt-[10px]">
            <Link to="/auth/pass-restore">Forgot password or email?</Link>
          </Button>

          <Button
            isPending={loginMutation.isPending}
            type="submit"
            variant={"default"}
            className="w-full mt-8"
          >
            <span>Sign In with Email</span>
          </Button>
        </form>
      </Form>
    </>
  );
}
