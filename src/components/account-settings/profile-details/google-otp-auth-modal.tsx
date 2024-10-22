import { Modal } from "@/components/ui/modal";
import { Label } from "@/components/ui/label";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authOtpSetupVerify, getAuthOptSetup } from "@/api/auth";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useEffect, useState } from "react";
import { Icons } from "@/components/ui/icons";
import { TypographyMuted } from "@/components/ui/typography";
import { CustomOtpInput } from "@/components/ui/custom-otp-input";
import { z } from "zod";

const otpSchema = z.string().length(6).regex(/^\d+$/);

type GoogleOtpAuthModalProps = {
  enableGoogleAuthModalOpen: boolean;
  setEnableGoogleAuthModalOpen: (open: boolean) => void;
};

export const GoogleOtpAuthModal = (props: GoogleOtpAuthModalProps) => {
  const { enableGoogleAuthModalOpen, setEnableGoogleAuthModalOpen } = props;

  const [qrCodeData, setQrCodeData] = useState<string>();
  const [qrCodeLoading, setQrCodeLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (!enableGoogleAuthModalOpen) return;

    async function fetchQrCode() {
      try {
        setQrCodeLoading(true);
        const res = await getAuthOptSetup();
        setQrCodeData(res.data.qrCode);
      } catch (error) {
        toast({
          title: "Error fetching QR code",
          description: "There was an error fetching the QR code",
          variant: "destructive",
        });
      } finally {
        setQrCodeLoading(false);
      }
    }

    fetchQrCode();
  }, [toast, enableGoogleAuthModalOpen]);

  const [optSetupCode, setOptSetupCode] = useState("");
  const onOptSetupCodeChange = (value: string) => {
    const isNumberOrEmptyString = /^[0-9]*$/.test(value);
    if (!isNumberOrEmptyString) return;
    setOptSetupCode(value);
  };

  const queryClient = useQueryClient();

  const setupOtpMutation = useMutation({
    mutationFn: authOtpSetupVerify,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["get-me"] });
      toast({
        title: "Successfully enabled Google Authenticator",
        description: "You have successfully enabled Google Authenticator",
      });
    },
    onError: () => {
      setOptSetupCode("");

      toast({
        title: "Error enabling Google Authenticator",
        description: "There was an error enabling Google Authenticator",
        variant: "destructive",
      });
    },
  });

  const handleSetupOpt = async () => {
    const result = otpSchema.safeParse(optSetupCode);
    if (!result.success) {
      toast({
        title: "Invalid OTP code",
        description: "Please enter a valid 6 digit OTP code",
        variant: "destructive",
      });
      setOptSetupCode("");
      return;
    }

    await setupOtpMutation.mutateAsync({ code: optSetupCode });
    setEnableGoogleAuthModalOpen(false);
  };

  return (
    <Modal
      open={enableGoogleAuthModalOpen}
      onOpenChange={setEnableGoogleAuthModalOpen}
      header
      title="Enable Google Authenticator"
      titleDescription="Elementum facilisis nunc in ultricies nibh est mattis nisl"
      className="sm:w-[456px]"
    >
      <div className="flex flex-col py-7 px-7">
        <TypographyMuted className="text-sm font-medium leading-5 mb-4">
          Scan the QR code below with the Google Authenticator app
        </TypographyMuted>
        <div className="flex justify-center mb-4">
          {qrCodeLoading ? (
            <Skeleton className="w-[200px] h-[200px]" />
          ) : (
            <img src={qrCodeData} alt="QR code" className="w-[200px] h-[200px]" />
          )}
        </div>
        <div className="flex flex-col gap-y-2">
          <Label>And enter the code from the app</Label>
          <div className="flex justify-center">
            <CustomOtpInput
              value={optSetupCode}
              onChange={(value) => onOptSetupCodeChange(value)}
            />
          </div>
        </div>

        <div className="flex flex-1 gap-4 mt-8">
          <Button
            onClick={() => setEnableGoogleAuthModalOpen(false)}
            className="gap-x-1 flex-1 items-center font-bold leading-4 pl-4 pr-5 py-2.5"
            variant="secondary"
          >
            <Icons.XBrandIcon height={20} width={20} />
            <span>Cancel</span>
          </Button>
          <Button
            isPending={setupOtpMutation.isPending}
            onClick={handleSetupOpt}
            type="submit"
            className="gap-x-1.5 flex-1 items-center font-bold px-5 py-2.5 leading-4"
          >
            Setup
          </Button>
        </div>
      </div>
    </Modal>
  );
};
