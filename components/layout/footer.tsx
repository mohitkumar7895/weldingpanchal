import React from "react";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Flame, Mail, Phone, MapPin, Award, CheckCircle2, ShieldCheck } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-[#40352E] text-[#D8D0C5] border-t border-[#806B59]/40">
      <Container className="py-8 sm:py-12 lg:py-16">
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-5 gap-6 sm:gap-8 lg:gap-12">
          {/* Brand Info (Full width on mobile, 2 cols on lg) */}
          <div className="col-span-2 lg:col-span-2 space-y-3 sm:space-y-4">
            <Link href="/" className="inline-flex items-center gap-2.5">
              <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-xl bg-gradient-to-br from-[#806B59] to-[#2B241F] flex items-center justify-center text-white border border-[#A98559]/30">
                <Flame className="h-4.5 w-4.5 sm:h-5 sm:w-5 text-[#A98559]" />
              </div>
              <span className="text-lg sm:text-xl font-black tracking-tight text-white">
                WELDING<span className="text-[#A98559]">PANCHAL</span>
              </span>
            </Link>
            <p className="text-xs sm:text-sm text-[#D8D0C5] leading-relaxed max-w-sm">
              Earthy Construction Luxury. Empowering India's master craftsmen, licensed civil contractors, and industrial building projects with verified track records.
            </p>
            <div className="flex items-center gap-2 sm:gap-3 pt-1">
              <div className="flex items-center gap-1.5 text-[11px] sm:text-xs text-[#F5F0E8] bg-[#2B241F] px-2.5 py-1 sm:px-3.5 sm:py-1.5 rounded-lg sm:rounded-xl border border-[#806B59]/40">
                <Award className="h-3.5 w-3.5 text-[#A98559]" />
                <span className="font-semibold">ISO 9001:2015</span>
              </div>
              <div className="flex items-center gap-1.5 text-[11px] sm:text-xs text-[#F5F0E8] bg-[#2B241F] px-2.5 py-1 sm:px-3.5 sm:py-1.5 rounded-lg sm:rounded-xl border border-[#806B59]/40">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                <span className="font-semibold">AWS & IS Standards</span>
              </div>
            </div>
          </div>

          {/* Quick Links: Services (Aamne-Samne Col 1 on mobile) */}
          <div className="col-span-1">
            <h4 className="text-[11px] sm:text-xs font-bold uppercase tracking-widest text-[#F5F0E8] mb-2.5 sm:mb-4">
              Core Trades
            </h4>
            <ul className="space-y-1.5 sm:space-y-2.5 text-xs sm:text-sm text-[#D8D0C5]">
              <li>
                <Link href="/workers?skill=Welder" className="hover:text-[#A98559] transition-colors">
                  Structural Welders
                </Link>
              </li>
              <li>
                <Link href="/workers?skill=Mason" className="hover:text-[#A98559] transition-colors">
                  Brick & Block Masons
                </Link>
              </li>
              <li>
                <Link href="/workers?skill=Carpenter" className="hover:text-[#A98559] transition-colors">
                  Carpenters
                </Link>
              </li>
              <li>
                <Link href="/workers?skill=Electrician" className="hover:text-[#A98559] transition-colors">
                  Electricians
                </Link>
              </li>
              <li>
                <Link href="/workers?skill=Plumber" className="hover:text-[#A98559] transition-colors">
                  Plumbers
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Links: Solutions (Aamne-Samne Col 2 on mobile) */}
          <div className="col-span-1">
            <h4 className="text-[11px] sm:text-xs font-bold uppercase tracking-widest text-[#F5F0E8] mb-2.5 sm:mb-4">
              Platform
            </h4>
            <ul className="space-y-1.5 sm:space-y-2.5 text-xs sm:text-sm text-[#D8D0C5]">
              <li>
                <Link href="/" className="hover:text-[#A98559] transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/contractors" className="hover:text-[#A98559] transition-colors">
                  Contractors
                </Link>
              </li>
              <li>
                <Link href="/materials" className="hover:text-[#A98559] transition-colors">
                  Materials
                </Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-[#A98559] transition-colors">
                  Services
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-[#A98559] transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-[#A98559] transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Details (Compact on mobile) */}
          <div className="col-span-2 lg:col-span-1 space-y-2 sm:space-y-3 pt-3 sm:pt-0 border-t border-[#806B59]/30 lg:border-t-0">
            <h4 className="text-[11px] sm:text-xs font-bold uppercase tracking-widest text-[#F5F0E8] mb-1.5 sm:mb-4">
              Headquarters
            </h4>
            <p className="text-xs text-[#D8D0C5] flex items-start gap-2">
              <MapPin className="h-4 w-4 text-[#A98559] flex-shrink-0 mt-0.5" />
              <span>S.G. Highway, Thaltej, Ahmedabad - 380054</span>
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2 pt-0.5">
              <p className="text-xs text-[#D8D0C5] flex items-center gap-2">
                <Phone className="h-3.5 w-3.5 text-[#A98559] flex-shrink-0" />
                <a href="tel:+919876543210" className="hover:text-white font-medium">
                  +91 (079) 4920-8000
                </a>
              </p>
              <p className="text-xs text-[#D8D0C5] flex items-center gap-2">
                <Mail className="h-3.5 w-3.5 text-[#A98559] flex-shrink-0" />
                <a href="mailto:info@weldingpanchal.com" className="hover:text-white font-medium">
                  info@weldingpanchal.com
                </a>
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-6 pt-5 sm:mt-12 sm:pt-8 border-t border-[#806B59]/40 flex flex-col sm:flex-row items-center justify-between text-[11px] sm:text-xs text-[#D8D0C5] gap-3 sm:gap-4 text-center sm:text-left">
          <p>© {new Date().getFullYear()} WeldingPanchal. All rights reserved.</p>
          <div className="flex items-center gap-4 sm:gap-6">
            <Link href="/privacy" className="hover:text-white transition-colors">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-white transition-colors">
              Terms
            </Link>
            <Link href="/sitemap.xml" className="hover:text-white transition-colors">
              Sitemap
            </Link>
          </div>
        </div>
      </Container>
    </footer>
  );
}
