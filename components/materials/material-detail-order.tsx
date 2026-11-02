"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { MaterialQuoteModal } from "@/components/materials/material-quote-modal";
import { MaterialRow } from "@/types";
import { formatCurrency } from "@/lib/utils";
import { ShoppingCart, Truck, ShieldCheck, PhoneCall, CheckCircle2 } from "lucide-react";

interface MaterialDetailOrderProps {
  material: MaterialRow;
}

export function MaterialDetailOrder({ material }: MaterialDetailOrderProps) {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <div className="bg-white rounded-[20px] border border-sandstone p-6 shadow-luxury sticky top-24">
        <div className="border-b border-sandstone/60 pb-5">
          <span className="text-[11px] uppercase tracking-wider font-semibold text-text-secondary">
            Wholesale Trade Rate
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-3xl font-extrabold text-espresso">
              {formatCurrency(material.price_per_unit)}
            </span>
            <span className="text-sm font-medium text-text-secondary">/ {material.unit}</span>
          </div>
          <p className="text-xs text-text-secondary mt-1">
            Ex-factory bulk rate. Inclusive of standard GST and depot handling.
          </p>
        </div>

        {/* Benefits Checklist */}
        <div className="py-5 space-y-3 border-b border-sandstone/60 text-xs text-espresso">
          <div className="flex items-center gap-2.5">
            <Truck className="h-4 w-4 text-bronze flex-shrink-0" />
            <span>Heavy vehicle hydraulic tipper & crane unloading</span>
          </div>
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="h-4 w-4 text-mocha flex-shrink-0" />
            <span>100% Genuine brand guarantee or full refund</span>
          </div>
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="h-4 w-4 text-mocha flex-shrink-0" />
            <span>Minimum order: {material.min_order_quantity} {material.unit}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="pt-5 space-y-3">
          <Button
            variant="primary"
            size="lg"
            className="w-full"
            leftIcon={<ShoppingCart className="h-5 w-5" />}
            onClick={() => setModalOpen(true)}
          >
            Request Bulk Quote
          </Button>

          <a
            href="tel:+919876543210"
            className="flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl border border-sandstone bg-ivory hover:bg-sandstone/30 text-xs font-semibold text-espresso transition-colors"
          >
            <PhoneCall className="h-4 w-4 text-text-secondary" />
            Call Materials Logistics Desk
          </a>

          <p className="text-[11px] text-center text-text-secondary">
            Contractor tiered discounts available for consignments exceeding 100+ units.
          </p>
        </div>
      </div>

      <MaterialQuoteModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        material={material}
      />
    </>
  );
}
