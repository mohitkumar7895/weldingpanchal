import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import {
  HardHat,
  ShieldCheck,
  Award,
  Building2,
  TrendingUp,
  CheckCircle2,
  MapPin,
  Sparkles,
} from "lucide-react";

export const metadata: Metadata = {
  title: "About Us | WeldingPanchal Industrial Construction Platform",
  description:
    "WeldingPanchal bridges certified industrial tradesmen, licensed general contractors, and heavy building supplies with high reliability across India.",
};

export default function AboutPage() {
  return (
    <div className="bg-ivory min-h-screen py-12">
      <Container>
        {/* Hero Section */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sandstone/40 border border-sandstone text-espresso text-xs font-semibold mb-4">
            <HardHat className="h-3.5 w-3.5 text-bronze" />
            Engineering India's Infrastructure
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-espresso tracking-tight leading-tight">
            Bridging Craftsmen, Contractors & Materials Under One Trusted Banner
          </h1>
          <p className="mt-4 text-base sm:text-lg text-text-secondary leading-relaxed">
            Founded with the conviction that Indian construction workers and site developers deserve
            transparent pricing, guaranteed skill verification, and institutional safety standards.
          </p>
        </div>

        {/* Mission & Vision Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <div className="bg-white rounded-[20px] border border-sandstone p-8 shadow-luxury">
            <div className="h-12 w-12 rounded-xl bg-ivory border border-sandstone text-bronze flex items-center justify-center mb-6">
              <TrendingUp className="h-6 w-6" />
            </div>
            <h2 className="text-2xl font-bold text-espresso mb-3">Our Mission</h2>
            <p className="text-sm text-text-secondary leading-relaxed">
              To empower over 100,000 skilled building tradesmen across India with verified digital
              credentials, fair living daily wages, and on-time direct bank settlements, while
              eliminating predatory middlemen from the construction supply chain.
            </p>
          </div>

          <div className="bg-white rounded-[20px] border border-sandstone p-8 shadow-luxury">
            <div className="h-12 w-12 rounded-xl bg-espresso text-sandstone flex items-center justify-center mb-6">
              <Building2 className="h-6 w-6" />
            </div>
            <h2 className="text-2xl font-bold text-espresso mb-3">Our Operational Vision</h2>
            <p className="text-sm text-text-secondary leading-relaxed">
              To be the digital backbone for industrial factories, commercial towers, and residential
              projects across Gujarat and western India, delivering turnkey engineering execution
              and BIS-certified structural raw materials within hours of order dispatch.
            </p>
          </div>
        </div>

        {/* Core Pillars */}
        <div className="bg-white rounded-[20px] border border-sandstone p-8 sm:p-12 mb-16 shadow-luxury">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-espresso">
              The WeldingPanchal Standard
            </h2>
            <p className="text-sm text-text-secondary mt-2">
              Every worker, contractor, and material listed on our platform adheres to strict multi-point audits.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            <div className="space-y-3">
              <div className="h-11 w-11 rounded-xl bg-ivory border border-sandstone text-mocha flex items-center justify-center">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <h3 className="font-bold text-espresso text-base">Triple-Layer Verification</h3>
              <p className="text-xs text-text-secondary leading-relaxed">
                Aadhaar government ID verification, physical craftsmanship skill testing, and verified
                past customer project references before any worker profile is activated.
              </p>
            </div>

            <div className="space-y-3">
              <div className="h-11 w-11 rounded-xl bg-ivory border border-sandstone text-bronze flex items-center justify-center">
                <Award className="h-5 w-5" />
              </div>
              <h3 className="font-bold text-espresso text-base">ISO 9001:2015 & PPE Safety</h3>
              <p className="text-xs text-text-secondary leading-relaxed">
                Mandatory PPE safety adherence (hard hats, steel-toe boots, auto-darkening welding
                helmets, harnesses) and adherence to Indian standard building codes.
              </p>
            </div>

            <div className="space-y-3">
              <div className="h-11 w-11 rounded-xl bg-ivory border border-sandstone text-espresso flex items-center justify-center">
                <CheckCircle2 className="h-5 w-5" />
              </div>
              <h3 className="font-bold text-espresso text-base">Milestone Escrow Protection</h3>
              <p className="text-xs text-text-secondary leading-relaxed">
                Transparent billing with zero surprise costs. Funds remain protected in escrow and
                are disbursed only when you inspect and sign off on completed milestones.
              </p>
            </div>
          </div>
        </div>

        {/* Operating Hubs Across Gujarat */}
        <div className="bg-espresso text-white rounded-[24px] p-8 sm:p-12 mb-16 shadow-luxury border border-sandstone/20">
          <div className="max-w-2xl mb-8">
            <span className="text-xs font-bold text-bronze uppercase tracking-widest block mb-2">
              Regional Operations Footprint
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Rapid Response Hubs Across Gujarat
            </h2>
            <p className="text-sm text-sandstone mt-2">
              Our regional depot centers and field engineers ensure same-day team mobilization and material dispatch.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">
            <div className="p-4 rounded-xl bg-white/5 border border-sandstone/20">
              <div className="flex items-center gap-1.5 text-bronze font-bold text-sm mb-1">
                <MapPin className="h-4 w-4" /> Ahmedabad
              </div>
              <p className="text-xs text-sandstone/80">Headquarters & Central Dispatch</p>
            </div>
            <div className="p-4 rounded-xl bg-white/5 border border-sandstone/20">
              <div className="flex items-center gap-1.5 text-bronze font-bold text-sm mb-1">
                <MapPin className="h-4 w-4" /> Vadodara
              </div>
              <p className="text-xs text-sandstone/80">Heavy Industrial & Fabrication Depot</p>
            </div>
            <div className="p-4 rounded-xl bg-white/5 border border-sandstone/20">
              <div className="flex items-center gap-1.5 text-bronze font-bold text-sm mb-1">
                <MapPin className="h-4 w-4" /> Surat
              </div>
              <p className="text-xs text-sandstone/80">Commercial & High-Rise Operations</p>
            </div>
            <div className="p-4 rounded-xl bg-white/5 border border-sandstone/20">
              <div className="flex items-center gap-1.5 text-bronze font-bold text-sm mb-1">
                <MapPin className="h-4 w-4" /> Rajkot
              </div>
              <p className="text-xs text-sandstone/80">Foundry, Forging & Mechanical Cluster</p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="bg-espresso rounded-[24px] p-8 sm:p-12 text-center text-white shadow-luxury relative overflow-hidden border border-sandstone/30">
          <div className="absolute top-0 right-0 w-80 h-80 bg-mocha/20 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sandstone/20 border border-sandstone/30 text-sandstone text-xs font-semibold mb-4">
              <Sparkles className="h-3.5 w-3.5 text-bronze" /> Verified Construction Workforce
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
              Ready to Build With Verified Tradesmen?
            </h2>
            <p className="mt-3 text-sm sm:text-base text-sandstone">
              Find vetted welders, masons, carpenters, or request a complete turnkey project quotation today.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Link href="/workers">
                <Button variant="primary" size="lg">
                  Explore Skilled Workers
                </Button>
              </Link>
              <Link href="/contractors">
                <Button variant="secondary" size="lg">
                  Find Contractors
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
