import { Modal } from "@/components/ui/modal";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authTextMsgSetupPhone, authTextMsgSetupVerify } from "@/api/auth";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Icons } from "@/components/ui/icons";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { isValidPhoneNumber } from "react-phone-number-input";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { PhoneInput } from "@/components/ui/phone-input";
import { Input } from "@/components/ui/input";

type PhoneNumberTextMessageModalProps = {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
};

const FormSchema = z.object({
  phone: z.string().refine(isValidPhoneNumber, { message: "Invalid phone number" }),
  textMessage: z.string(),
});

export const PhoneNumberTextMessageModal = (props: PhoneNumberTextMessageModalProps) => {
  const { isOpen, setIsOpen } = props;

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      phone: "",
      textMessage: "",
    },
  });

  const { watch } = form;

  const phoneNumber = watch("phone");

  const queryClient = useQueryClient();

  const { toast } = useToast();

  const authSetupPhoneMutation = useMutation({
    mutationFn: authTextMsgSetupPhone,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["get-me"] });

      toast({
        title: "Text message sent",
        description: "A text message has been sent to your phone",
      });
    },
    onError: () => {
      toast({
        title: "Error sending text message",
        description: "There was an error sending the text message",
        variant: "destructive",
      });
    },
  });

  const handleSendCodeToThePhone = () => {
    authSetupPhoneMutation.mutate({ phone: phoneNumber });
  };

  const authTextMsgSetupMutation = useMutation({
    mutationFn: authTextMsgSetupVerify,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["get-me"] });

      toast({
        title: "Successfully enabled text message verification",
        description: "You have successfully enabled text message verification",
      });
    },
    onError: () => {
      toast({
        title: "Error enabling text message verification",
        description: "There was an error enabling text message verification",
        variant: "destructive",
      });
    },
  });

  const onSubmit = async (values: z.infer<typeof FormSchema>) => {
    const { textMessage } = values;
    await authTextMsgSetupMutation.mutateAsync({ code: textMessage });
    setIsOpen(false);
  };

  return (
    <Modal
      open={isOpen}
      onOpenChange={setIsOpen}
      header
      title="Enable Phone Text Message"
      titleDescription="Elementum facilisis nunc in ultricies nibh est mattis nisl"
      className="sm:w-[456px]"
    >
      <div className="flex flex-col py-7 px-7">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8 flex flex-col items-start"
          >
            <div className="flex gap-x-4 items-end">
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem className="flex flex-col items-start">
                    <FormLabel className="text-left">Phone Number</FormLabel>
                    <FormControl className="w-full">
                      <PhoneInput placeholder="Enter a phone number" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <Button
                isPending={authSetupPhoneMutation.isPending}
                onClick={(e) => {
                  e.preventDefault();
                  handleSendCodeToThePhone();
                }}
                className="gap-x-1.5 flex-1 items-center font-bold px-5 py-2.5 leading-4 w-full"
              >
                Send Code
              </Button>
            </div>

            <FormField
              control={form.control}
              name="textMessage"
              render={({ field }) => (
                <FormItem className="flex flex-col items-start w-full">
                  <FormLabel className="text-left">Text message</FormLabel>
                  <FormControl className="w-full">
                    <Input placeholder="Enter the text message from you phone" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <div className="flex flex-1 gap-4 mt-8 w-full">
              <Button
                onClick={(e) => {
                  e.preventDefault();
                  setIsOpen(false);
                }}
                className="gap-x-1 flex-1 items-center font-bold leading-4 pl-4 pr-5 py-2.5"
                variant="secondary"
              >
                <Icons.XBrandIcon height={20} width={20} />
                <span>Cancel</span>
              </Button>
              <Button
                isPending={authTextMsgSetupMutation.isPending}
                type="submit"
                className="gap-x-1.5 flex-1 items-center font-bold px-5 py-2.5 leading-4"
              >
                Setup
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </Modal>
  );
};
