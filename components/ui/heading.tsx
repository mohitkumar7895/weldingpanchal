"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { AnimatedWordHeading } from "@/components/ui/animated";

export interface SectionHeadingProps extends React.HTMLAttributes<HTMLDivElement> {
  badge?: string;
  title: string;
  description?: string;
  align?: "left" | "center" | "right";
}

export function SectionHeading({
  badge,
  title,
  description,
  align = "left",
  className,
  ...props
}: SectionHeadingProps) {
  const alignClass = {
    left: "text-left items-start",
    center: "text-center items-center mx-auto",
    right: "text-right items-end ml-auto",
  }[align];

  return (
    <div
      className={cn("flex flex-col max-w-3xl space-y-2.5 mb-10", alignClass, className)}
      {...props}
    >
      {badge && (
        <motion.span
          initial={{ opacity: 0, scale: 0.9, y: 8 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-widest font-bold text-[#A98559] bg-[#F7F2EA] border border-[#D8C7B0] px-3.5 py-1 rounded-full shadow-subtle mb-1"
        >
          {badge}
        </motion.span>
      )}

      <AnimatedWordHeading
        text={title}
        as="h2"
        className={cn(
          "text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-[#40352E] leading-tight",
          align === "center" ? "justify-center" : align === "right" ? "justify-end" : "justify-start"
        )}
      />

      {description && (
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.45, delay: 0.1, ease: "easeOut" }}
          className="text-sm sm:text-base text-[#77716E] leading-relaxed mt-1"
        >
          {description}
        </motion.p>
      )}
    </div>
  );
}
