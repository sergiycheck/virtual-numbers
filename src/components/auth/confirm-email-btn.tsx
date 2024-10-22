import { useEffect, useRef, useState } from "react";
import moment from "moment";
import mdf from "moment-duration-format";
import { useToast } from "../ui/use-toast";
import { resendEmailconfirmation } from "@/api/auth";
import { Button } from "../ui/button";
mdf(moment as any);

export default function ConfirmEmailBtn() {
  const { toast } = useToast();
  const [resend, setResend] = useState(false); // Set initially to false
  const [remainingTime, setRemainingTime] = useState(0);
  const signedUpEmail = window?.localStorage?.signedUpEmail as string;

  const countdownIntervalRef = useRef<NodeJS.Timeout>();
  const [isPending, setIsPending] = useState(false);

  const handleResend = () => {
    setIsPending(true);
    resendEmailconfirmation(signedUpEmail)
      .then(() => {
        toast({
          title: "Sent!",
          description: "Confirmation link has been successfully re-sent",
        });
        setResend(false); // Disable the button
      })
      .catch((err: string) => {
        toast({
          title: "Error",
          description: err,
          variant: "destructive",
        });
        setResend(true);
      })
      .finally(() => {
        setIsPending(false);
      });
  };

  useEffect(() => {
    if (!resend) {
      setRemainingTime(60); // Set the initial time to 60 seconds (1 minute)

      // Start a countdown to re-enable the button
      countdownIntervalRef.current = setInterval(() => {
        setRemainingTime((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(countdownIntervalRef.current);
            setResend(true); // Enable the button after the countdown
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000); // Update the time every second
    } else {
      clearInterval(countdownIntervalRef.current);
    }
  }, [resend]);

  useEffect(() => {
    // Clear the countdown interval when the component unmounts
    return () => {
      if (countdownIntervalRef.current) {
        clearInterval(countdownIntervalRef.current);
      }
    };
  }, []);

  return (
    <Button disabled={!resend || remainingTime > 0} isPending={isPending} onClick={handleResend}>
      {remainingTime > 0
        ? `Resend in ${moment.duration(remainingTime, "seconds").format("m:ss")}`
        : "Resend"}
    </Button>
  );
}
