import clsx from "clsx";
import { useTheme } from "./theme-provider";
import { useMemo } from "react";
import { Icons } from "@/components/ui/icons";

function ThemeSwitch() {
  const { setTheme, theme } = useTheme();

  const toggleDarkMode = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const darkMode = useMemo(() => theme === "dark", [theme]);

  return (
    <div
      className="relative flex gap-1 rounded-[7px] bg-zinc-300 dark:bg-black p-[2px] h-8 w-16 cursor-pointer"
      onClick={toggleDarkMode}
    >
      <button
        className={clsx(
          "py-1 px-1  flex items-center justify-center z-10 rounded-[6px] h-7 w-7",
          !darkMode && "opacity-50"
        )}
      >
        <Icons.Moon fill="#DD8F57" color="#DD8F57" className="transition-all h-4 w-4" />
      </button>

      <button
        className={clsx(
          "py-1 px-1 flex items-center justify-center rounded-[6px] right-[2px] relative h-7 w-7 z-20",
          darkMode && "opacity-50"
        )}
      >
        <Icons.Sun
          fill="#DD8F57"
          color="#DD8F57"
          className="transition-all h-4 w-4 relative left-[1.4px]"
        />
      </button>

      <div
        className={clsx(
          "absolute transition-all top-0.5 left-0.5 rounded-[6px] bg-dark-50 h-7 w-7 duration-200",
          darkMode ? "translate-x-0 bg-card" : "translate-x-[calc(113%)] bg-card"
        )}
      />
    </div>
  );
}

export default ThemeSwitch;
