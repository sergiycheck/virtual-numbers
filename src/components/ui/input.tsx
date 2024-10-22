import * as React from "react";

import { cn } from "@/lib/utils";
import { Eye, EyeOff } from "lucide-react";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          `h-10 flex w-full rounded-lg border border-border bg-container_dark 
          px-3 py-1 text-sm shadow-sm transition-colors file:border-0 
          file:bg-transparent file:text-sm file:font-medium 
          placeholder:text-[#454545]
          focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring 
          disabled:cursor-not-allowed disabled:opacity-50`,
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

const InputPassword = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    const [showPassword, setShowPassword] = React.useState(false);
    const togglePassword = () => setShowPassword((prev) => !prev);

    return (
      <div className="relative">
        <input
          ref={ref}
          id="hs-toggle-password"
          type={showPassword ? "text" : "password"}
          className={cn(
            `block w-full rounded-lg border border-border  bg-container_dark 
            px-3 py-2 text-sm 
            leading-5  placeholder:text-[#454545]
            ring-offset-background
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring
              disabled:cursor-not-allowed disabled:opacity-50`,
            className
          )}
          placeholder="Enter password"
          {...props}
        />

        <button
          type="button"
          onClick={togglePassword}
          className="absolute end-[6px] top-0 rounded-e-md p-3"
        >
          {showPassword ? (
            <Eye className="text-gray-400 dark:text-btn_primary w-4 h-4" />
          ) : (
            <EyeOff className="text-gray-400 dark:text-btn_primary w-4 h-4" />
          )}
        </button>
      </div>
    );
  }
);
InputPassword.displayName = "InputPassword";

export { Input, InputPassword };
