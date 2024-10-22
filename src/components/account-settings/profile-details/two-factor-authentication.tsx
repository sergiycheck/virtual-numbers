import { Switch } from "@/components/ui/switch";
import { Icons } from "@/components/ui/icons";
import { TypographyP } from "@/components/ui/typography";
import { useEffect, useState } from "react";
import { GoogleOtpAuthModal } from "./google-otp-auth-modal";
import useUserState from "@/store/slices/userSlice";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";
import { authOtpRemove } from "@/api/auth";
import ConfirmActionModal from "@/components/ui/modal-confirm-action";

export default function TwoFactorAuthentication() {
  const { ...user } = useUserState();
  const { isOTPAuthRequired, isPhoneAuthRequired } = user;

  const [isGoogleAuthenticator, setIsGoogleAuthenticator] = useState(false);
  const [enableGoogleAuthModalOpen, setEnableGoogleAuthModalOpen] = useState(false);
  const [enableConfirmDisableOtpModal, setEnableConfirmDisableOtpModal] = useState(false);

  // TODO: not implemented on the backend
  // const [isPhoneAuthTextMessage, setIsPhoneAuthTextMessage] = useState(false);
  // const [phoneAuthModalOpen, setPhoneAuthModalOpen] = useState(false);
  // const [enableConfirmDisableTextMessageModal, setEnableConfirmDisableTextMessageModal] =
  //   useState(false);

  useEffect(() => {
    setIsGoogleAuthenticator(isOTPAuthRequired || false);
    // setIsPhoneAuthTextMessage(isPhoneAuthRequired || false);
  }, [isOTPAuthRequired, isPhoneAuthRequired]);

  const queryClient = useQueryClient();
  const { toast } = useToast();

  const removeOtpMutation = useMutation({
    mutationFn: authOtpRemove,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["get-me"] });

      toast({
        title: "Successfully removed Google Authenticator",
        description: "You have successfully removed Google Authenticator",
      });
    },
    onError: () => {
      toast({
        title: "Error removing Google Authenticator",
        description: "There was an error removing Google Authenticator",
        variant: "destructive",
      });
    },
  });

  const handleRemoveOtp = () => {
    removeOtpMutation.mutate();
    setIsGoogleAuthenticator(false);
    setEnableConfirmDisableOtpModal(false);
  };

  // TODO: not implemented on the backend
  // const removeTextMessageVerificationMutation = useMutation({
  //   mutationFn: authTextMessageRemove,
  //   onSuccess: () => {
  //     queryClient.invalidateQueries({ queryKey: ["get-me"] });

  //     toast({
  //       title: "Successfully removed Text Message Verification",
  //       description: "You have successfully removed Text Message Verification",
  //     });
  //   },
  //   onError: () => {
  //     toast({
  //       title: "Error removing Text Message Verification",
  //       description: "There was an error removing Text Message Verification",
  //       variant: "destructive",
  //     });
  //   },
  // });

  // const handleRemoveTextMessageVerification = () => {
  //   removeTextMessageVerificationMutation.mutate();
  //   setIsPhoneAuthTextMessage(false);
  //   setEnableConfirmDisableTextMessageModal(false);
  // };

  return (
    <div className="max-w-[29.5rem] text-text_04 ">
      <p className="font-semibold text-base mb-5">Two-factor authentication</p>
      <div className="flex gap-x-3 items-center py-3 px-5 rounded-lg bg-[rgba(255,255,255,0.02)] mb-4 w-full md:w-[472px] h-[60px]">
        <Icons.GoogleAuthenticator height={36} width={36} />
        <TypographyP className="text-sm font-medium leading-5">Google Authenticator</TypographyP>
        <Switch
          onCheckedChange={() => {
            if (!isGoogleAuthenticator) {
              // when user wants to enable otp
              setEnableGoogleAuthModalOpen(true);
            } else if (isGoogleAuthenticator) {
              //when user wants to disable otp
              setEnableConfirmDisableOtpModal(true);
            }
          }}
          checked={isGoogleAuthenticator}
          className="ml-auto"
        />
      </div>
      {/* otp modal */}
      <GoogleOtpAuthModal
        enableGoogleAuthModalOpen={enableGoogleAuthModalOpen}
        setEnableGoogleAuthModalOpen={setEnableGoogleAuthModalOpen}
      />
      {/* confirm disable otp modal */}
      <ConfirmActionModal
        isPending={removeOtpMutation.isPending}
        open={enableConfirmDisableOtpModal}
        onOpenChange={(open) => {
          setEnableConfirmDisableOtpModal(open);
        }}
        actionCallback={handleRemoveOtp}
        title="Disable OTP?"
        titleDescription="Are you sure you want to disable Google Authenticator?"
      />

      {/* TODO: not implemented on the backend */}
      {/* <div className="flex gap-x-3 items-center py-3 px-5 rounded-lg bg-[rgba(255,255,255,0.02)] w-full md:w-[472px] h-[60px]">
        <div className="grid place-content-center h-9 w-9 dark:bg-[rgba(255,255,255,0.10)] rounded-full bg-foreground">
          <Icons.AndroidDevice height={20} width={20} />
        </div>
        <TypographyP className="text-sm font-medium leading-5">Text Message</TypographyP>
        <Switch
          onCheckedChange={() => {
            if (!isPhoneAuthTextMessage) {
              // when user wants to enable text message
              setPhoneAuthModalOpen(true);
            } else if (isPhoneAuthTextMessage) {
              // when user wants to disable text message
              setEnableConfirmDisableTextMessageModal(true);
            }
          }}
          checked={isPhoneAuthTextMessage}
          className="ml-auto"
        />
      </div> */}
      {/* TODO: not implemented on the backend */}
      {/* phone message modal */}
      {/* <PhoneNumberTextMessageModal isOpen={phoneAuthModalOpen} setIsOpen={setPhoneAuthModalOpen} /> */}
      {/* confirm disable text message modal */}
      {/* TODO: not implemented on the backend */}
      {/* <ConfirmActionModal
        open={enableConfirmDisableTextMessageModal}
        onOpenChange={(open) => {
          setEnableConfirmDisableTextMessageModal(open);
        }}
        actionCallback={handleRemoveTextMessageVerification}
        title="Disable Text Message?"
        titleDescription="Are you sure you want to disable Text Message?"
      /> */}
    </div>
  );
}
