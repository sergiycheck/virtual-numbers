import { Button } from "../ui/button";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Icons } from "../ui/icons";
import { TypographyH2 } from "../ui/typography";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "../ui/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { helpCenterContactUsDataSchema, submitHelpCenterContactUs } from "@/api/users";
import { z } from "zod";

interface Props {
  show: boolean;
  close: () => void;
}

export default function ContactUsForm({ show, close }: Props) {
  const form = useForm({
    resolver: zodResolver(helpCenterContactUsDataSchema),
    defaultValues: {
      name: "",
      contactEmail: "",
      subject: "",
      message: "",
    },
  });

  const queryClient = useQueryClient();
  const { toast } = useToast();

  const submitHelpCenterContactUsMutation = useMutation({
    mutationFn: submitHelpCenterContactUs,
    onSuccess: () => {
      close();

      queryClient.invalidateQueries({ queryKey: ["get-me"] });

      toast({
        title: "Message sent",
        description: "Your message has been sent",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "An error occurred",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: z.infer<typeof helpCenterContactUsDataSchema>) => {
    submitHelpCenterContactUsMutation.mutate(data);
  };

  if (!show) return null;
  return (
    <div
      className="fixed bottom-14 right-12 flex flex-col p-6 gap-y-3 w-[26.75rem] 
      bg-background border-input border dark:bg-container_same_bg rounded-lg"
    >
      <Icons.CloseModal
        height={20}
        width={20}
        className="absolute top-6 right-6 text-text_subtitle cursor-pointer"
        onClick={close}
      />
      <TypographyH2 className="text-xl font-bold text-text_title">Contact us</TypographyH2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="space-y-3">
            <FormField
              name="name"
              control={form.control}
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Text" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
            <FormField
              name="contactEmail"
              control={form.control}
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel>Contact email</FormLabel>
                    <FormControl>
                      <Input placeholder="Text" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
            <FormField
              name="subject"
              control={form.control}
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel>Subject</FormLabel>
                    <FormControl>
                      <Input placeholder="Text" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
            <FormField
              name="message"
              control={form.control}
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel>Message</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Text"
                        className="bg-container_dark placeholder:text-[#454545] border border-field_border focus-visible:ring-1 rounded-lg h-[132px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
          </div>
          <div className="flex flex-1 gap-4 mt-3">
            <Button
              className="gap-x-1 flex-1 items-center font-bold leading-4 pl-4 pr-5 py-2.5"
              variant="secondary"
              onClick={(e) => {
                e.preventDefault();
                close();
              }}
            >
              <Icons.XBrandIcon height={20} width={20} />
              <span>Cancel</span>
            </Button>
            <Button
              isPending={submitHelpCenterContactUsMutation.isPending}
              type="submit"
              className="gap-x-1.5 flex-1 py-2.5 px-5"
            >
              <Icons.Send height={20} width={20} />
              <span>Send</span>
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
