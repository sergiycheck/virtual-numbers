import { Button } from "@/components/ui/button";
import { Icons } from "@/components/ui/icons";
import ConfirmActionModal from "@/components/ui/modal-confirm-action";
import { cn } from "@/lib/utils";
import { deleteUser } from "@/api/users";
import { useToast } from "@/components/ui/use-toast";
import { useAuthState } from "@/store/slices/authSlice";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export const ProfileRemove = () => {
  const [saveChangesOpen] = useState(false);

  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();
  const { logout } = useAuthState();
  const navigate = useNavigate();

  const deleteUserMutation = useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      toast({
        title: "User deleted",
        description: "User was deleted",
      });
    },
    onError: (error: string) => {
      toast({
        title: "Error deleting user",
        description: error,
        variant: "destructive",
      });
    },
  });

  const handleDeleteUser = () => {
    setIsOpen(false);
    deleteUserMutation.mutate();
    logout();
    navigate("/auth/sign-in");
  };

  return (
    <>
      {/* was requested to implement and after that to remove 😁👍 */}
      <div className={cn(" w-full mt-14 flex")}>
        <div className="flex flex-col md:flex-row gap-y-4 py-6 self-end w-full border-input border-t ">
          <Button
            onClick={() => setIsOpen(true)}
            variant="link"
            className="hover:text-text_warning text-text_warning text-sm font-bold pl-0"
          >
            <Icons.RedTrashCan height={16} width={16} className="mr-1" />
            {"Delete account"}
          </Button>
          <div className={cn("hidden gap-4 ml-auto", saveChangesOpen && "flex")}>
            <Button className="gap-x-1 pl-4 pr-5 py-2.5" variant="secondary">
              <Icons.XBrandIcon height={20} width={20} className="fill-current" />
              <span>Cancel</span>
            </Button>
            <Button className="gap-x-1.5 px-5 py-2.5">
              <Icons.Check height={20} width={20} />
              <span>Save changes</span>
            </Button>
          </div>
        </div>

        <ConfirmActionModal
          open={isOpen}
          onOpenChange={setIsOpen}
          actionCallback={handleDeleteUser}
          title="Delete account"
          titleDescription="Are you sure you want to delete your account?"
        />
      </div>
    </>
  );
};
