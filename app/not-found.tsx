import React from "react";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { HardHat, ArrowLeft, Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] bg-ivory flex items-center justify-center py-16">
      <Container className="text-center space-y-6 max-w-lg">
        <div className="h-16 w-16 mx-auto rounded-2xl bg-white border border-sandstone flex items-center justify-center text-bronze shadow-luxury">
          <HardHat className="h-8 w-8" />
        </div>
        <div className="space-y-2">
          <span className="text-xs uppercase tracking-widest font-bold text-bronze">
            Error 404
          </span>
          <h1 className="text-3xl font-bold tracking-tight text-espresso">
            Work Zone Not Found
          </h1>
          <p className="text-sm text-text-secondary leading-relaxed">
            The page or fabrication blueprint you are looking for does not exist, has been relocated, or is undergoing active maintenance.
          </p>
        </div>
        <div className="flex items-center justify-center gap-3 pt-2">
          <Link href="/">
            <Button variant="primary" size="md" leftIcon={<Home className="h-4 w-4" />}>
              Return Home
            </Button>
          </Link>
          <Link href="/services">
            <Button variant="secondary" size="md" leftIcon={<ArrowLeft className="h-4 w-4" />}>
              View Services
            </Button>
          </Link>
        </div>
      </Container>
    </div>
  );
}
