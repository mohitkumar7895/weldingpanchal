import React from "react";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "bronze" | "outline" | "ghost" | "charcoal" | "danger";
  size?: "sm" | "md" | "lg" | "icon";
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      isLoading = false,
      leftIcon,
      rightIcon,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed select-none active:scale-[0.99]";

    const variants = {
      // Warm Mocha for primary buttons
      primary:
        "bg-[#806B59] text-white hover:bg-[#6C5A4B] focus:ring-[#806B59] shadow-sm shadow-[#806B59]/25",
      // Pure white with sandstone border
      secondary:
        "bg-white text-[#40352E] border border-[#D8D0C5] hover:bg-[#F5F0E8] hover:border-[#806B59] focus:ring-[#806B59] shadow-subtle",
      // Antique bronze for distinct luxurious highlights
      bronze:
        "bg-[#A98559] text-white hover:bg-[#916F46] focus:ring-[#A98559] shadow-sm shadow-[#A98559]/25",
      // Mocha outline
      outline:
        "bg-transparent text-[#806B59] border border-[#806B59] hover:bg-[#F5F0E8] focus:ring-[#806B59]",
      // Ghost
      ghost:
        "bg-transparent text-[#292522] hover:text-[#40352E] hover:bg-[#EAE5DE] focus:ring-[#806B59]",
      // Espresso brown
      charcoal:
        "bg-[#40352E] text-white hover:bg-[#2B241F] focus:ring-[#40352E] shadow-sm",
      // Danger
      danger:
        "bg-red-700 text-white hover:bg-red-800 focus:ring-red-600 shadow-sm",
    };

    const sizes = {
      sm: "h-9 px-3.5 text-xs gap-1.5 rounded-lg",
      md: "h-11 px-4 text-sm gap-2 rounded-xl",
      lg: "h-12 px-6 text-base gap-2.5 rounded-xl font-semibold",
      icon: "h-10 w-10 p-0 rounded-xl",
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
        {!isLoading && leftIcon && <span className="flex-shrink-0">{leftIcon}</span>}
        <span>{children}</span>
        {!isLoading && rightIcon && <span className="flex-shrink-0">{rightIcon}</span>}
      </button>
    );
  }
);

Button.displayName = "Button";
