import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input, InputPassword } from "@/components/ui/input";
import { createUser } from "@/api/users";
import { useToast } from "../ui/use-toast";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const formSchema = z
  .object({
    fullName: z.string().min(1, { message: "Full name is required." }),
    userName: z.string().min(1, { message: "Username is required." }),
    email: z.string().email().min(5, { message: "Email must be at least 5 characters." }),
    password: z.string().min(4, { message: "Password must be at least 4 characters." }),
    repeatPassword: z
      .string()
      .min(4, { message: "Repeat password must be at least 4 characters." }),
  })
  .refine((data) => data.password === data.repeatPassword, {
    message: "Passwords do not match.",
    path: ["repeatPassword"],
  });

type UserFormValue = z.infer<typeof formSchema>;

export function UserSignUpForm() {
  const { toast } = useToast();
  const navigate = useNavigate();

  const form = useForm<UserFormValue>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      userName: "",
      email: "",
      password: "",
      repeatPassword: "",
    },
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const onSubmit = async (data: UserFormValue) => {
    const { fullName, userName, email, password } = data;

    setIsSubmitting(true);

    createUser({
      fullName,
      userName,
      email,
      password,
    })
      .then(() => {
        localStorage.signedUpEmail = email;
        navigate("/auth/confirm-email");
      })
      .catch((err) =>
        toast({
          title: "Error",
          description: err,
          variant: "destructive",
        })
      )
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
        <FormField
          control={form.control}
          name="fullName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter full name" {...field} type="text" />
              </FormControl>
              <FormDescription></FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="userName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter username"
                  {...field}
                  type="text"
                  autoComplete="username"
                />
              </FormControl>
              <FormDescription></FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email address</FormLabel>
              <FormControl>
                <Input placeholder="Enter email address" {...field} type="email" />
              </FormControl>
              <FormDescription></FormDescription>
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
                <InputPassword type="password" {...field} autoComplete="new-password" />
              </FormControl>
              <FormDescription></FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="repeatPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Repeat Password</FormLabel>
              <FormControl>
                <InputPassword
                  type="password"
                  {...field}
                  placeholder="Repeat password"
                  autoComplete="new-password"
                />
              </FormControl>
              <FormDescription></FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button isPending={isSubmitting} type="submit" variant={"default"} className="w-full">
          Sign up with Email
        </Button>
      </form>
    </Form>
  );
}
