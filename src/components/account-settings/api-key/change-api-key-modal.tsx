import React from "react";
import { Button } from "@/components/ui/button";
import { DialogClose } from "@/components/ui/dialog";
import { Modal } from "@/components/ui/modal";
import { X as CancelIcon } from "lucide-react";
import { Icons } from "@/components/ui/icons";
import { regenerateApiAccessKey } from "@/api/users";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";

interface Props {
  trigger: React.ReactNode;
}

export default function ChangeApiKeyModal({ trigger }: Props) {
  const { toast } = useToast();
  const [show, setShow] = React.useState(false);

  const queryClient = useQueryClient();

  const regenerateApiKeyMutation = useMutation({
    mutationFn: regenerateApiAccessKey,

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["api-access"] });
      toast({
        title: "API Key Regenerated",
        description: "Your API Key has been successfully regenerated",
      });
    },
    onError: (error: string) => {
      setShow(false);

      toast({
        title: "Error Regenerating API Key",
        description: error,
        variant: "destructive",
      });
    },
  });

  return (
    <Modal
      open={show}
      onOpenChange={setShow}
      header
      trigger={trigger}
      title="Are you sure you want to change the existing API?"
      titleSytles="text-center"
      titleDescription="Velit aenean maecenas ipsum malesuada bibendum gravida dignissim. Ut nibh malesuada lectus est."
      titleDescriptionStyles="text-center"
      className="sm:w-[455px]"
    >
      <div className="flex flex-1 gap-4 mt-7 px-7 pb-7">
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
          isPending={regenerateApiKeyMutation.isPending}
          onClick={async () => {
            await regenerateApiKeyMutation.mutateAsync();
            setShow(false);
          }}
          type="submit"
          className="gap-x-1.5 flex-1 py-2.5 px-5"
        >
          <Icons.RegenerateDark height={20} width={20} className="text-icon_dark fill-current" />
          <span>Regenerate</span>
        </Button>
      </div>
    </Modal>
  );
}
