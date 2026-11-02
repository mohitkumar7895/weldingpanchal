import React from "react";
import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { ShieldCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "Privacy Policy | WeldingPanchal",
  description: "Learn how WeldingPanchal protects your data and preserves confidentiality across construction projects.",
};

export default function PrivacyPage() {
  return (
    <div className="bg-ivory min-h-screen py-12">
      <Container>
        <div className="max-w-3xl mx-auto bg-white rounded-[24px] border border-sandstone p-8 sm:p-12 shadow-luxury">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sandstone/40 border border-sandstone text-xs font-semibold text-espresso mb-3">
            <ShieldCheck className="h-3.5 w-3.5 text-mocha" />
            Compliance & Data Governance
          </div>
          <h1 className="text-3xl font-extrabold text-espresso mb-2">Privacy Policy</h1>
          <p className="text-xs text-text-secondary mb-8">Last Updated: October 30, 2026</p>

          <div className="prose prose-sm text-text-secondary space-y-6 text-sm leading-relaxed">
            <section>
              <h2 className="text-lg font-bold text-espresso mb-2">1. Overview</h2>
              <p>
                WeldingPanchal ("Platform", "we", "us", or "our") respects your personal and commercial data.
                This Privacy Policy outlines how we collect, store, verify, and handle details submitted by
                clients, building workers, trade craftsmen, contractors, and material vendors.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-espresso mb-2">2. Information We Collect</h2>
              <ul className="list-disc pl-5 space-y-1 text-xs text-text-secondary">
                <li><strong className="text-espresso">Identity Data:</strong> Full legal name, photo, Aadhaar/ID proof (for verification).</li>
                <li><strong className="text-espresso">Contact Data:</strong> Verified mobile telephone number, email address, physical delivery address.</li>
                <li><strong className="text-espresso">Professional Credentials:</strong> Trade certifications, trade experience years, skill assessments, previous site references.</li>
                <li><strong className="text-espresso">Commercial Records:</strong> Booking requests, bill of quantities (BOQ), transaction invoices, review ratings.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-bold text-espresso mb-2">3. Purpose and Use of Data</h2>
              <p>
                We use collected information solely to match verified construction tradesmen with verified work orders,
                process milestone releases, deliver material dispatches, verify contractor licensing, and maintain
                site safety standards. We never sell or license your personal information to third-party advertisers.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-espresso mb-2">4. Data Security</h2>
              <p>
                All account passwords are encrypted using modern industry standards (Argon2 / bcrypt). Authentication
                sessions are transmitted exclusively over secure HTTPS using HTTP-only cryptographic cookies.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-espresso mb-2">5. Contact Our Data Protection Desk</h2>
              <p>
                For data access, corrections, or profile deletion requests, contact our Compliance Office at{" "}
                <a href="mailto:privacy@weldingpanchal.com" className="text-mocha font-semibold underline hover:text-espresso">
                  privacy@weldingpanchal.com
                </a>.
              </p>
            </section>
          </div>
        </div>
      </Container>
    </div>
  );
}
