import { Button } from "@/components/ui/button";
import { DialogClose } from "@/components/ui/dialog";
import { Modal } from "@/components/ui/modal";
import { X as CancelIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { InputPassword } from "@/components/ui/input";
import { Icons } from "@/components/ui/icons";
import { TypographyP } from "@/components/ui/typography";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { changePassword } from "@/api/users";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";
import ConfirmActionModal from "@/components/ui/modal-confirm-action";
import { usePasswordRestore } from "./use-password-restore";

interface Props {
  trigger: React.ReactNode;
}

const changePasswordSchema = z
  .object({
    oldPassword: z.string().min(4, { message: "Password must be at least 4 characters." }),
    newPassword: z.string().min(4, { message: "Password must be at least 4 characters." }),
    confirmPassword: z
      .string()
      .min(4, { message: "Repeat password must be at least 4 characters." }),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  })
  .refine((data) => data.oldPassword !== data.newPassword, {
    message: "New password must be different from the old password.",
    path: ["newPassword"],
  });

export default function ChangePasswordModal({ trigger }: Props) {
  const form = useForm({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const [isOpen, setIsOpen] = useState(false);

  const { toast } = useToast();

  const changePasswordMutation = useMutation({
    mutationFn: changePassword,
    onSuccess: () => {
      toast({
        title: "Password changed",
        description: "Password was successfully changed",
      });
    },
    onError: (error: string) => {
      toast({
        title: "Error changing password",
        description: error,
        variant: "destructive",
      });
    },
  });

  const handleChangePassword = async (data: z.infer<typeof changePasswordSchema>) => {
    const dataToSubmit = {
      oldPassword: data.oldPassword,
      newPassword: data.newPassword,
      repeatPassword: data.confirmPassword,
    };
    await changePasswordMutation.mutateAsync({ data: dataToSubmit });
    setIsOpen(false);
  };

  const {
    isOpenPasswordRestoreConfirm,
    setIsOpenPasswordRestoreConfirm,
    handlePasswordRestoreLink,
  } = usePasswordRestore();

  return (
    <>
      <Modal
        open={isOpen}
        onOpenChange={setIsOpen}
        header
        trigger={trigger}
        title="Change password"
        titleDescription="Elementum facilisis nunc in ultricies nibh est mattis nisl"
        className="max-w-[26.5rem]"
      >
        <div className="flex flex-col pt-6 px-7 pb-7">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleChangePassword)}>
              <div className="space-y-5">
                <FormField
                  name="oldPassword"
                  control={form.control}
                  render={({ field }) => {
                    return (
                      <FormItem>
                        <FormLabel>Old password</FormLabel>
                        <FormControl>
                          <>
                            <InputPassword placeholder="Text" {...field} />
                            <div className="flex gap-x-1 items-center">
                              <Icons.QuestionFill
                                height={16}
                                width={16}
                                className="text-icond_dark_2 fill-current"
                              />
                              <TypographyP
                                onClick={() => setIsOpenPasswordRestoreConfirm(true)}
                                className="text-sm leading-4 font-bold text-text_disabled cursor-pointer"
                              >
                                Forgot password?
                              </TypographyP>
                            </div>
                          </>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />
                <FormField
                  name="newPassword"
                  control={form.control}
                  render={({ field }) => {
                    return (
                      <FormItem>
                        <FormLabel>New password</FormLabel>
                        <FormControl>
                          <InputPassword placeholder="Text" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />
                <FormField
                  name="confirmPassword"
                  control={form.control}
                  render={({ field }) => {
                    return (
                      <FormItem>
                        <FormLabel>Repeat new password</FormLabel>
                        <FormControl>
                          <InputPassword placeholder="Text" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />
              </div>
              <div className="flex flex-1 gap-4 mt-9 ">
                <DialogClose asChild>
                  <Button
                    className="gap-x-1 flex-1 items-center font-bold leading-4 pl-4 pr-5 py-2.5"
                    variant="secondary"
                  >
                    <CancelIcon height={20} width={20} />
                    <span>Cancel</span>
                  </Button>
                </DialogClose>
                <Button
                  isPending={changePasswordMutation.isPending}
                  type="submit"
                  className="flex-1 py-2.5 px-5 tracking-wide"
                >
                  Change password
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </Modal>

      {/* confirm password forgot */}
      <ConfirmActionModal
        isPending={changePasswordMutation.isPending}
        open={isOpenPasswordRestoreConfirm}
        onOpenChange={setIsOpenPasswordRestoreConfirm}
        actionCallback={handlePasswordRestoreLink}
        title="Forgot password"
        titleDescription="Are you sure you want to send password restore link to your email?"
      />
    </>
  );
}
