import React from "react";
import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { ContactForm } from "@/components/forms/contact-form";
import {
  PhoneCall,
  Mail,
  Building,
  Headphones,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Contact Us & Regional Offices | WeldingPanchal",
  description:
    "Get in touch with the WeldingPanchal operations desk. Regional offices in Ahmedabad, Vadodara, Surat, and Rajkot. 24/7 industrial helpline.",
};

export default function ContactPage() {
  return (
    <div className="bg-ivory min-h-screen py-12">
      <Container>
        {/* Header */}
        <div className="max-w-3xl mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sandstone/40 border border-sandstone text-espresso text-xs font-semibold mb-3">
            <Headphones className="h-3.5 w-3.5 text-bronze" />
            24/7 Operations Support
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-espresso tracking-tight">
            Connect With Our Construction Project Engineering Desk
          </h1>
          <p className="mt-3 text-base text-text-secondary leading-relaxed">
            Whether you need emergency on-site welders, a comprehensive tender quotation, or bulk
            steel dispatch, our certified operations team is ready to deploy.
          </p>
        </div>

        {/* 2 Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Contact Form (7 cols) */}
          <div className="lg:col-span-7">
            <ContactForm />
          </div>

          {/* Regional Hubs & Info (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            {/* Quick Contact Card */}
            <div className="bg-white rounded-[20px] border border-sandstone p-6 shadow-luxury space-y-4">
              <h3 className="font-bold text-espresso text-base">Direct Channels</h3>

              <div className="flex items-start gap-3.5 text-xs">
                <div className="h-10 w-10 rounded-xl bg-ivory border border-sandstone text-bronze flex items-center justify-center flex-shrink-0">
                  <PhoneCall className="h-4 w-4" />
                </div>
                <div>
                  <span className="font-semibold text-espresso block">Toll-Free Operations Desk</span>
                  <a href="tel:+919876543210" className="text-espresso hover:text-mocha text-sm font-bold transition-colors">
                    +91 (079) 4920-8000 / +91 98765 43210
                  </a>
                  <p className="text-text-secondary mt-0.5">Mon – Sat, 7:00 AM – 9:00 PM IST</p>
                </div>
              </div>

              <div className="flex items-start gap-3.5 text-xs">
                <div className="h-10 w-10 rounded-xl bg-ivory border border-sandstone text-mocha flex items-center justify-center flex-shrink-0">
                  <Mail className="h-4 w-4" />
                </div>
                <div>
                  <span className="font-semibold text-espresso block">General & Tender Inquiries</span>
                  <a href="mailto:info@weldingpanchal.com" className="text-espresso hover:text-mocha text-sm font-bold transition-colors">
                    info@weldingpanchal.com
                  </a>
                  <p className="text-text-secondary mt-0.5">Response guaranteed within 3 business hours</p>
                </div>
              </div>
            </div>

            {/* Regional Depot Addresses */}
            <div className="bg-white rounded-[20px] border border-sandstone p-6 shadow-luxury space-y-4">
              <h3 className="font-bold text-espresso text-base flex items-center gap-2">
                <Building className="h-4 w-4 text-bronze" />
                Regional Operational Hubs
              </h3>

              <div className="space-y-3.5 text-xs divide-y divide-sandstone/40">
                <div className="pt-2 first:pt-0">
                  <p className="font-bold text-espresso">Ahmedabad (Head Office & Hub 01)</p>
                  <p className="text-text-secondary mt-0.5">
                    Level 5, Panchal Industrial Tower, S.G. Highway, Thaltej, Ahmedabad - 380054
                  </p>
                </div>

                <div className="pt-3">
                  <p className="font-bold text-espresso">Vadodara (Fabrication & Machinery Depot)</p>
                  <p className="text-text-secondary mt-0.5">
                    Plot 112, GIDC Industrial Estate, Makarpura, Vadodara - 390010
                  </p>
                </div>

                <div className="pt-3">
                  <p className="font-bold text-espresso">Surat (Civil & Structural Division)</p>
                  <p className="text-text-secondary mt-0.5">
                    Shop 402, Ring Road Commercial Centre, Majura Gate, Surat - 395002
                  </p>
                </div>

                <div className="pt-3">
                  <p className="font-bold text-espresso">Rajkot (Foundry & Mechanical Engineering)</p>
                  <p className="text-text-secondary mt-0.5">
                    Phase-II, Aji Industrial Area, Rajkot - 360003
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
