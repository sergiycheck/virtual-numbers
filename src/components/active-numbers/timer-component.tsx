import useCountdown from "@/hooks/useCountdown";
import { useQueryClient } from "@tanstack/react-query";
import { TypographyMuted } from "../ui/typography";
import { Icons } from "../ui/icons";

export const TimerComponent = ({ endDate }: { endDate: string }) => {
  const queryClient = useQueryClient();

  const { formattedTime, timeLeft } = useCountdown(endDate, () => {
    setTimeout(() => {
      queryClient.invalidateQueries({ queryKey: ["lines-active"] });
    }, 2000);
  });

  return (
    <>
      {timeLeft > 120 ? (
        <>
          <Icons.TimerText01 width={20} height={20} className="text-icond_light_2" />
          <TypographyMuted className="text-text_01">{formattedTime}</TypographyMuted>
        </>
      ) : timeLeft < 60 ? (
        <>
          <Icons.TimerWarning width={20} height={20} className="text-icond_warning" />
          <TypographyMuted className="text-text_warning">{formattedTime}</TypographyMuted>
        </>
      ) : (
        <>
          <Icons.TimerNotice width={20} height={20} className="text-icond_notice" />
          <TypographyMuted className="text-text_notice">{formattedTime}</TypographyMuted>
        </>
      )}
    </>
  );
};
