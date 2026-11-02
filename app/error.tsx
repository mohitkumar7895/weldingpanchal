"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { AlertTriangle, Home, RefreshCw } from "lucide-react";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Runtime error caught by app/error.tsx:", error);
  }, [error]);

  return (
    <div className="min-h-[70vh] bg-[#F5F0E8] flex items-center justify-center py-16 px-4">
      <Container size="narrow">
        <div className="bg-white rounded-[24px] border border-[#D8D0C5] p-8 sm:p-12 text-center shadow-card max-w-lg mx-auto space-y-6">
          <div className="h-16 w-16 bg-[#F5F0E8] text-[#806B59] rounded-2xl flex items-center justify-center mx-auto border border-[#D8D0C5]">
            <AlertTriangle className="h-8 w-8 text-[#A98559]" />
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl font-black text-[#40352E] tracking-tight">
              Something Went Wrong
            </h1>
            <p className="text-xs sm:text-sm text-[#77716E] leading-relaxed">
              We encountered an unexpected error while loading this page. Please try refreshing or return to the homepage.
            </p>
            {error.digest && (
              <p className="text-[11px] font-mono text-[#A98559] pt-2">
                Error Reference: {error.digest}
              </p>
            )}
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Button
              variant="primary"
              size="md"
              onClick={() => reset()}
              leftIcon={<RefreshCw className="h-4 w-4" />}
              className="w-full sm:w-auto"
            >
              Try Again
            </Button>
            <Link href="/" className="w-full sm:w-auto">
              <Button
                variant="secondary"
                size="md"
                leftIcon={<Home className="h-4 w-4" />}
                className="w-full sm:w-auto"
              >
                Go to Home
              </Button>
            </Link>
          </div>
        </div>
      </Container>
    </div>
  );
}

