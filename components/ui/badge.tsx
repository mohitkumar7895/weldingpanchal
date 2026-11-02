import React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "orange" | "bronze" | "mocha" | "charcoal" | "sandstone" | "neutral" | "success" | "outline";
}

export function Badge({
  className,
  variant = "bronze",
  ...props
}: BadgeProps) {
  const variants = {
    // Map orange to Antique Bronze for backward compatibility and luxury aesthetic
    orange: "bg-[#F7F2EA] text-[#A98559] border-[#D8C7B0]",
    bronze: "bg-[#F7F2EA] text-[#A98559] border-[#D8C7B0]",
    mocha: "bg-[#F3EFEA] text-[#806B59] border-[#D1C6BD]",
    charcoal: "bg-[#40352E] text-white border-[#362D27]",
    sandstone: "bg-[#ECE8E1] text-[#292522] border-[#D8D0C5]",
    neutral: "bg-[#F5F0E8] text-[#292522] border-[#D8D0C5]",
    success: "bg-emerald-50 text-emerald-800 border-emerald-200",
    outline: "bg-transparent text-[#77716E] border-[#D8D0C5]",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border transition-colors",
        variants[variant],
        className
      )}
      {...props}
    />
  );
}
