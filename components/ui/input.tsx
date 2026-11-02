import React from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = "text", label, error, helperText, id, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-xs font-semibold text-[#40352E]"
          >
            {label}
          </label>
        )}
        <input
          id={inputId}
          type={type}
          ref={ref}
          className={cn(
            "flex h-11 w-full rounded-xl border border-[#D8D0C5] bg-white px-3.5 py-2 text-sm text-[#292522] transition-colors placeholder:text-[#9C9590] focus:border-[#806B59] focus:outline-none focus:ring-2 focus:ring-[#806B59]/20 disabled:cursor-not-allowed disabled:bg-[#F5F0E8] disabled:opacity-75",
            error && "border-red-600 focus:border-red-600 focus:ring-red-600/20",
            className
          )}
          {...props}
        />
        {error && <p className="text-xs text-red-600 font-medium">{error}</p>}
        {!error && helperText && (
          <p className="text-xs text-[#77716E]">{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, helperText, id, rows = 3, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-xs font-semibold text-[#40352E]"
          >
            {label}
          </label>
        )}
        <textarea
          id={inputId}
          ref={ref}
          rows={rows}
          className={cn(
            "flex w-full rounded-xl border border-[#D8D0C5] bg-white p-3.5 text-sm text-[#292522] transition-colors placeholder:text-[#9C9590] focus:border-[#806B59] focus:outline-none focus:ring-2 focus:ring-[#806B59]/20 disabled:cursor-not-allowed disabled:bg-[#F5F0E8] disabled:opacity-75",
            error && "border-red-600 focus:border-red-600 focus:ring-red-600/20",
            className
          )}
          {...props}
        />
        {error && <p className="text-xs text-red-600 font-medium">{error}</p>}
        {!error && helperText && (
          <p className="text-xs text-[#77716E]">{helperText}</p>
        )}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";
