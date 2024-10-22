import { sendPasswordRestoreLink } from "@/api/users";
import { useToast } from "@/components/ui/use-toast";
import useUserState from "@/store/slices/userSlice";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";

export const usePasswordRestore = () => {
  const { ...user } = useUserState();

  const { toast } = useToast();

  const passwordRestoreLinkMutation = useMutation({
    mutationFn: sendPasswordRestoreLink,
    onSuccess: () => {
      toast({
        title: "Email sent",
        description: "Password restore link was sent to your email",
      });
    },
    onError: (error: string) => {
      toast({
        title: "Error sending email",
        description: error,
        variant: "destructive",
      });
    },
  });

  const [isOpenPasswordRestoreConfirm, setIsOpenPasswordRestoreConfirm] = useState(false);

  const handlePasswordRestoreLink = () => {
    const { email } = user;
    if (!email) return;
    setIsOpenPasswordRestoreConfirm(false);
    passwordRestoreLinkMutation.mutate(email);
  };

  return {
    passwordRestoreLinkMutation,
    isOpenPasswordRestoreConfirm,
    setIsOpenPasswordRestoreConfirm,
    handlePasswordRestoreLink,
  };
};
