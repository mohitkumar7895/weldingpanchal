import React from "react";
import { cn } from "@/lib/utils";

export interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "default" | "sm" | "narrow" | "wide";
}

export function Container({
  className,
  size = "default",
  ...props
}: ContainerProps) {
  const sizes = {
    narrow: "max-w-4xl",
    sm: "max-w-5xl",
    default: "max-w-7xl",
    wide: "max-w-screen-2xl",
  };

  return (
    <div
      className={cn("w-full mx-auto px-4 sm:px-6 lg:px-8", sizes[size], className)}
      {...props}
    />
  );
}

