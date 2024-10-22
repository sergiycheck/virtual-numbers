import { useState, useEffect } from "react";
import { differenceInSeconds } from "date-fns";

const useCountdown = (targetDate: string, callBack: () => void) => {
  const [timeLeft, setTimeLeft] = useState(() =>
    differenceInSeconds(new Date(targetDate), new Date())
  );

  useEffect(() => {
    if (timeLeft <= 0) {
      callBack();
      return;
    }

    const intervalId = setInterval(() => {
      const newTimeLeft = differenceInSeconds(new Date(targetDate), new Date());
      setTimeLeft(newTimeLeft);
    }, 1000);

    return () => clearInterval(intervalId);
  }, [targetDate, timeLeft, callBack]);

  const formatTimeLeft = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(
      secs
    ).padStart(2, "0")}`;
  };

  return { formattedTime: formatTimeLeft(timeLeft), timeLeft };
};

export default useCountdown;
