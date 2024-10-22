import React from "react";
import { Modal } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DialogClose } from "@radix-ui/react-dialog";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { Icons } from "../ui/icons";
import { TypographyMuted } from "../ui/typography";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import AdminUsersAPI from "@/api/admin-users";
import { useToast } from "@/components/ui/use-toast";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

interface Props {
  trigger: React.ReactNode;
}

const formSchema = z.object({
  email: z.string().email().min(5, {
    message: "Email must be at least 5 characters.",
  }),
});

export default function AddTeamMemberModal({ trigger }: Props) {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  const [isOpen, setIsOpen] = React.useState(false);

  const queryClient = useQueryClient();

  const { toast } = useToast();

  const addSubUserMutation = useMutation({
    mutationFn: AdminUsersAPI.create,
    onSuccess: () => {
      setIsOpen(false);
      queryClient.invalidateQueries({ queryKey: ["sub-uses"] });
      toast({
        title: "Sub user added",
        description: "Sub user was added",
      });
    },
    onError: (error: string) => {
      toast({
        title: "Error adding sub user",
        description: error,
        variant: "destructive",
      });
    },
  });

  return (
    <Modal
      open={isOpen}
      onOpenChange={setIsOpen}
      trigger={trigger}
      header
      title="Add new team member"
      titleDescription={
        <div className="flex items-center">
          <TypographyMuted className="text-text_03">
            Elementum facilisis nunc in ultricies nibh est mattis nisl
          </TypographyMuted>
        </div>
      }
      className="sm:w-[460px] sm:h-[280x]"
    >
      <div className="flex flex-col pt-5 px-7 pb-7">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit((data) => {
              addSubUserMutation.mutate(data);
            })}
          >
            <FormField
              name="email"
              control={form.control}
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel>Email address</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        className="border-field_border"
                        placeholder="Enter email address"
                      />
                    </FormControl>
                  </FormItem>
                );
              }}
            />
            <div className="flex flex-1 gap-4 mt-8">
              <DialogClose asChild>
                <Button
                  className="gap-x-1 flex-1 items-center font-bold leading-4 pl-4 pr-5 py-2.5"
                  variant="secondary"
                >
                  <Icons.XBrandIcon height={20} width={20} />
                  <span>Cancel</span>
                </Button>
              </DialogClose>
              <Button
                isPending={addSubUserMutation.isPending}
                type="submit"
                className="gap-x-1.5 flex-1 py-2.5 px-5"
              >
                <Icons.Send height={20} width={20} />
                <span>Send invite</span>
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </Modal>
  );
}
