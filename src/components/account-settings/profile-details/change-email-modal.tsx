import { Button } from "@/components/ui/button";
import { DialogClose } from "@/components/ui/dialog";
import { Modal } from "@/components/ui/modal";
import { Check as CheckIcon, X as CancelIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input, InputPassword } from "@/components/ui/input";
import { Icons } from "@/components/ui/icons";
import { TypographyP } from "@/components/ui/typography";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { changeEmail } from "@/api/users";
import { useToast } from "@/components/ui/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import ConfirmActionModal from "@/components/ui/modal-confirm-action";
import { usePasswordRestore } from "./use-password-restore";
import { useState } from "react";

interface Props {
  trigger: React.ReactNode;
}

const ChangeEmailSchema = z.object({
  email: z
    .string()
    .email({ message: "Enter a valid email address." })
    .min(4, { message: "Email must be at least 4 characters." }),
  password: z.string().min(4, { message: "Enter current password." }),
});

export default function ChangeEmailModal({ trigger }: Props) {
  const form = useForm({
    resolver: zodResolver(ChangeEmailSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const [isOpen, setIsOpen] = useState(false);

  const { toast } = useToast();

  const changeEmailMutation = useMutation({
    mutationFn: changeEmail,
    onSuccess: () => {
      toast({
        title: "Email changed",
        description: "Email was successfully changed",
      });
    },
    onError: (error: string) => {
      toast({
        title: "Error changing email",
        description: error,
        variant: "destructive",
      });
    },
  });

  const handleChangeEmail = async (data: z.infer<typeof ChangeEmailSchema>) => {
    await changeEmailMutation.mutateAsync({ values: data });
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
        title="Change email"
        titleDescription="Elementum facilisis nunc in ultricies nibh est mattis nisl"
        className="max-w-[26.5rem]"
      >
        <div className="flex flex-col pt-5 px-7 pb-7">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleChangeEmail)}>
              <div className="space-y-5">
                <FormField
                  name="email"
                  control={form.control}
                  render={({ field }) => {
                    return (
                      <FormItem>
                        <FormLabel>New email address</FormLabel>
                        <FormControl>
                          <Input placeholder="Text" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />
                <FormField
                  name="password"
                  control={form.control}
                  render={({ field }) => {
                    return (
                      <FormItem>
                        <FormLabel>Confirm with password</FormLabel>
                        <FormControl>
                          <>
                            <InputPassword placeholder="Text" {...field} />
                            <div className="flex gap-x-1 items-center mt-1">
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
                      </FormItem>
                    );
                  }}
                />
              </div>
              <div className="flex flex-1 gap-4 mt-8">
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
                  isPending={changeEmailMutation.isPending}
                  type="submit"
                  className="gap-x-1.5 flex-1 py-2.5 px-5"
                >
                  <CheckIcon height={20} width={20} />
                  <span>Save changes</span>
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </Modal>

      {/* confirm password forgot */}
      <ConfirmActionModal
        isPending={changeEmailMutation.isPending}
        open={isOpenPasswordRestoreConfirm}
        onOpenChange={setIsOpenPasswordRestoreConfirm}
        actionCallback={handlePasswordRestoreLink}
        title="Forgot password"
        titleDescription="Are you sure you want to send password restore link to your email?"
      />
    </>
  );
}
