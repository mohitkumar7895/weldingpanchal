"use client";

import React from "react";
import { motion, type Variants } from "framer-motion";
import { cn } from "@/lib/utils";

interface AnimatedWordHeadingProps {
  text: string;
  className?: string;
  as?: "h1" | "h2" | "h3" | "h4";
  highlightWords?: string[];
  highlightClassName?: string;
  delay?: number;
}

/**
 * AnimatedWordHeading: Splits text into words and glides each word in
 * with a subtle elevation and blur-to-focus transition when scrolled into view.
 */
export function AnimatedWordHeading({
  text,
  className,
  as: Tag = "h2",
  highlightWords = [],
  highlightClassName = "text-[#806B59]",
  delay = 0,
}: AnimatedWordHeadingProps) {
  const words = text.split(" ");

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.045,
        delayChildren: delay,
      },
    },
  };

  const wordVariants: Variants = {
    hidden: {
      opacity: 0,
      y: 20,
      filter: "blur(3px)",
    },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: {
        duration: 0.45,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  const MotionTag = motion[Tag];

  return (
    <MotionTag
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={containerVariants}
      className={cn("flex flex-wrap items-baseline gap-x-[0.28em] gap-y-1", className)}
    >
      {words.map((word, i) => {
        const cleanWord = word.replace(/[^a-zA-Z0-9]/g, "").toLowerCase();
        const isHighlight = highlightWords.some(
          (hw) => hw.toLowerCase() === cleanWord || word.toLowerCase().includes(hw.toLowerCase())
        );

        return (
          <motion.span
            key={i}
            variants={wordVariants}
            className={cn("inline-block", isHighlight && highlightClassName)}
          >
            {word}
          </motion.span>
        );
      })}
    </MotionTag>
  );
}

interface AnimatedSectionHeaderProps {
  badge?: string;
  title: string;
  description?: string;
  action?: React.ReactNode;
  align?: "left" | "center" | "right";
  className?: string;
}

/**
 * AnimatedSectionHeader: Full section header with animated badge,
 * gliding animated words, and smooth fade-in description.
 */
export function AnimatedSectionHeader({
  badge,
  title,
  description,
  action,
  align = "left",
  className,
}: AnimatedSectionHeaderProps) {
  const alignClass = {
    left: "text-left items-start",
    center: "text-center items-center mx-auto",
    right: "text-right items-end ml-auto",
  }[align];

  return (
    <div className={cn("flex flex-col md:flex-row md:items-end justify-between mb-10 sm:mb-12 gap-4", className)}>
      <div className={cn("flex flex-col max-w-3xl", alignClass)}>
        {badge && (
          <motion.span
            initial={{ opacity: 0, scale: 0.9, y: 8 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-widest font-bold text-[#A98559] bg-[#F7F2EA] border border-[#D8C7B0] px-3.5 py-1 rounded-full mb-3 shadow-subtle"
          >
            {badge}
          </motion.span>
        )}

        <AnimatedWordHeading
          text={title}
          as="h2"
          className={cn(
            "text-2xl sm:text-3xl lg:text-4xl font-black text-[#40352E] tracking-tight",
            align === "center" ? "justify-center" : align === "right" ? "justify-end" : "justify-start"
          )}
        />

        {description && (
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.45, delay: 0.12, ease: "easeOut" }}
            className="text-sm sm:text-base text-[#77716E] leading-relaxed mt-1"
          >
            {description}
          </motion.p>
        )}
      </div>

      {action && (
        <motion.div
          initial={{ opacity: 0, x: 10 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.4, delay: 0.15 }}
          className="flex-shrink-0"
        >
          {action}
        </motion.div>
      )}
    </div>
  );
}

interface ScrollRevealProps {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  yOffset?: number;
  className?: string;
}

/**
 * ScrollReveal: Simple, highly performant element wrapper that fades and rises in.
 */
export function ScrollReveal({
  children,
  delay = 0,
  duration = 0.5,
  yOffset = 22,
  className,
}: ScrollRevealProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: yOffset }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{ duration, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

interface StaggerContainerProps {
  children: React.ReactNode;
  staggerDelay?: number;
  className?: string;
}

/**
 * StaggerContainer: Triggers a wave of child elements to animate into view in sequence.
 */
export function StaggerContainer({
  children,
  staggerDelay = 0.07,
  className,
}: StaggerContainerProps) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.08 }}
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: staggerDelay,
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/**
 * StaggerItem: Child card or tile inside a StaggerContainer.
 */
export function StaggerItem({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 24, scale: 0.98 },
        visible: {
          opacity: 1,
          y: 0,
          scale: 1,
          transition: {
            duration: 0.45,
            ease: [0.22, 1, 0.36, 1],
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

