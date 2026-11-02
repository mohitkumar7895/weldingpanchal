import React from "react";
import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { FileText } from "lucide-react";

export const metadata: Metadata = {
  title: "Terms of Service | WeldingPanchal",
  description: "Terms and conditions governing the engagement of construction professionals, contractors, and building materials on WeldingPanchal.",
};

export default function TermsPage() {
  return (
    <div className="bg-ivory min-h-screen py-12">
      <Container>
        <div className="max-w-3xl mx-auto bg-white rounded-[24px] border border-sandstone p-8 sm:p-12 shadow-luxury">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sandstone/40 border border-sandstone text-xs font-semibold text-espresso mb-3">
            <FileText className="h-3.5 w-3.5 text-bronze" />
            Legal Agreement
          </div>
          <h1 className="text-3xl font-extrabold text-espresso mb-2">Terms of Service</h1>
          <p className="text-xs text-text-secondary mb-8">Effective Date: October 30, 2026</p>

          <div className="prose prose-sm text-text-secondary space-y-6 text-sm leading-relaxed">
            <section>
              <h2 className="text-lg font-bold text-espresso mb-2">1. Acceptance of Terms</h2>
              <p>
                By registering, accessing, or placing a work booking on WeldingPanchal, you agree to comply with
                these Terms of Service and applicable Indian construction, labor, and building safety regulations.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-espresso mb-2">2. Roles & Platform Relationship</h2>
              <p>
                WeldingPanchal serves as an institutional technology platform enabling project owners ("Customers")
                to connect with independent verified tradesmen ("Workers"), registered engineering firms ("Contractors"),
                and authorized material vendors. Tradesmen operate as independent service providers.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-espresso mb-2">3. Site Safety & PPE Compliance</h2>
              <p>
                All on-site workers and project owners must adhere strictly to site safety guidelines, including
                wearing standard PPE (helmets, protective shoes, welding visors). Work involving hazardous conditions
                must meet Indian Factory Act and building construction regulations.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-espresso mb-2">4. Bookings, Payments & Cancellations</h2>
              <p>
                Bookings submitted through WeldingPanchal transition through defined state milestones (Pending &rarr;
                Accepted &rarr; In Progress &rarr; Completed). Customers may cancel bookings with zero penalty up to
                12 hours prior to scheduled shift mobilization.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-espresso mb-2">5. Dispute Resolution & Jurisdiction</h2>
              <p>
                Any legal dispute arising from transactions on WeldingPanchal shall be subject to the exclusive
                jurisdiction of courts situated in Ahmedabad, Gujarat, India.
              </p>
            </section>
          </div>
        </div>
      </Container>
    </div>
  );
}
