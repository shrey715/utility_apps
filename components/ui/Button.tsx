"use client";

import { cn } from "@/lib/utils";
import { forwardRef, ReactNode, ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger" | "success";
  size?: "sm" | "md" | "lg";
  color?: "red" | "orange" | "yellow" | "green" | "cyan" | "blue" | "purple" | "pink";
  isLoading?: boolean;
  children?: ReactNode;
}

const colorStyles = {
  red: "bg-[#ff4757] shadow-[0_4px_0_#cc3a47] hover:shadow-[0_6px_0_#cc3a47] active:shadow-none",
  orange: "bg-[#ff6b35] shadow-[0_4px_0_#cc5529] hover:shadow-[0_6px_0_#cc5529] active:shadow-none",
  yellow: "bg-[#ffd93d] text-black shadow-[0_4px_0_#ccae31] hover:shadow-[0_6px_0_#ccae31] active:shadow-none",
  green: "bg-[#2ed573] shadow-[0_4px_0_#25aa5c] hover:shadow-[0_6px_0_#25aa5c] active:shadow-none",
  cyan: "bg-[#00d4ff] text-black shadow-[0_4px_0_#00a9cc] hover:shadow-[0_6px_0_#00a9cc] active:shadow-none",
  blue: "bg-[#3742fa] shadow-[0_4px_0_#2c35c8] hover:shadow-[0_6px_0_#2c35c8] active:shadow-none",
  purple: "bg-[#a55eea] shadow-[0_4px_0_#844bbb] hover:shadow-[0_6px_0_#844bbb] active:shadow-none",
  pink: "bg-[#ff6b9d] shadow-[0_4px_0_#cc567e] hover:shadow-[0_6px_0_#cc567e] active:shadow-none",
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", color = "cyan", isLoading, children, disabled, ...props }, ref) => {
    const variants = {
      primary: colorStyles[color],
      secondary: "bg-[#252525] border-2 border-[#444] text-white hover:border-[#555] shadow-[0_4px_0_#1a1a1a] hover:shadow-[0_6px_0_#1a1a1a] active:shadow-none",
      ghost: "bg-transparent text-white/70 hover:text-white hover:bg-white/10",
      danger: colorStyles.red,
      success: colorStyles.green,
    };

    const sizes = {
      sm: "px-4 py-2 text-sm",
      md: "px-6 py-3 text-base",
      lg: "px-8 py-4 text-lg",
    };

    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center gap-2 font-bold rounded-xl",
          "transition-all duration-100 ease-out",
          "hover:-translate-y-0.5 active:translate-y-1",
          "focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00d4ff]",
          "disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none",
          variants[variant],
          sizes[size],
          className
        )}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading && (
          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
              fill="none"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button };
export type { ButtonProps };
