"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { MaterialRow } from "@/types";
import { formatCurrency } from "@/lib/utils";
import { X, Package, CheckCircle2, AlertCircle } from "lucide-react";

interface MaterialQuoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  material: MaterialRow;
}

export function MaterialQuoteModal({ isOpen, onClose, material }: MaterialQuoteModalProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("Ahmedabad");
  const [quantity, setQuantity] = useState(`${material.min_order_quantity} ${material.unit}`);
  const [message, setMessage] = useState(
    `Requesting bulk trade price quote and on-site delivery estimate for ${material.name} (SKU: ${material.sku}).`
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim(),
          city: city.trim(),
          material_id: material.id,
          enquiry_type: "material_quote",
          subject: `Material Quote Request: ${material.name}`,
          quantity: quantity.trim(),
          message: message.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.message || "Failed to submit request. Please check inputs.");
        return;
      }

      setSuccess(true);
    } catch (err: any) {
      setError(err.message || "Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function handleReset() {
    setSuccess(false);
    setError(null);
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-[#40352E]/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-lg rounded-[24px] shadow-2xl border border-[#D8D0C5] overflow-hidden max-h-[92vh] flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#D8D0C5] bg-[#F5F0E8]">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-[#806B59] text-white flex items-center justify-center shadow-sm">
              <Package className="h-5 w-5 text-[#A98559]" />
            </div>
            <div>
              <h3 className="font-bold text-[#40352E] text-base leading-none">
                Wholesale Material Quote
              </h3>
              <p className="text-xs text-[#77716E] mt-1">Direct supplier dispatch & site logistics</p>
            </div>
          </div>
          <button
            onClick={handleReset}
            className="p-1.5 rounded-lg text-[#77716E] hover:text-[#40352E] hover:bg-[#EAE5DE] transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Success View */}
        {success ? (
          <div className="p-6 sm:p-8 text-center overflow-y-auto flex-1">
            <div className="h-16 w-16 bg-emerald-50 text-emerald-800 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-200">
              <CheckCircle2 className="h-9 w-9 text-emerald-700" />
            </div>
            <h4 className="text-xl font-bold text-[#40352E]">
              Quotation Request Received!
            </h4>
            <p className="text-sm text-[#77716E] mt-2 max-w-md mx-auto">
              Our materials logistics desk will send official wholesale pricing and delivery schedules
              for <strong className="text-[#40352E]">{material.name}</strong> to{" "}
              <strong className="text-[#40352E]">{phone}</strong>.
            </p>
            <div className="mt-6 flex justify-center">
              <Button variant="primary" onClick={handleReset}>
                Done
              </Button>
            </div>
          </div>
        ) : (
          /* Form View */
          <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 overflow-y-auto flex-1">
            {/* Material Summary */}
            <div className="p-3.5 rounded-2xl bg-[#F5F0E8] border border-[#D8D0C5] flex items-center justify-between">
              <div>
                <p className="text-[11px] font-mono text-[#77716E]">SKU: {material.sku}</p>
                <p className="text-sm font-bold text-[#40352E]">{material.name}</p>
                <p className="text-xs text-[#77716E]">Brand: {material.brand || "Industrial Grade"}</p>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-[#77716E] uppercase block font-semibold">Trade Price</span>
                <span className="text-base font-bold text-[#40352E]">
                  {formatCurrency(material.price_per_unit)} / {material.unit}
                </span>
              </div>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-semibold text-[#40352E] mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh Patel"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full h-11 px-3 text-sm rounded-xl border border-[#D8D0C5] focus:border-[#806B59] focus:ring-2 focus:ring-[#806B59]/20"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#40352E] mb-1">
                  10-Digit Mobile Phone *
                </label>
                <input
                  type="tel"
                  required
                  pattern="^[6-9]\d{9}$"
                  placeholder="e.g. 9876543210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full h-11 px-3 text-sm rounded-xl border border-[#D8D0C5] focus:border-[#806B59] focus:ring-2 focus:ring-[#806B59]/20"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-semibold text-[#40352E] mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  placeholder="e.g. ramesh@buildcorp.in"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-11 px-3 text-sm rounded-xl border border-[#D8D0C5] focus:border-[#806B59] focus:ring-2 focus:ring-[#806B59]/20"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#40352E] mb-1">
                  Site Delivery City *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ahmedabad"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full h-11 px-3 text-sm rounded-xl border border-[#D8D0C5] focus:border-[#806B59] focus:ring-2 focus:ring-[#806B59]/20"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#40352E] mb-1">
                Estimated Order Quantity ({material.unit})
              </label>
              <input
                type="text"
                placeholder={`Min: ${material.min_order_quantity} ${material.unit}`}
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="w-full h-11 px-3 text-sm rounded-xl border border-[#D8D0C5] focus:border-[#806B59] focus:ring-2 focus:ring-[#806B59]/20"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#40352E] mb-1">
                Delivery Requirements & Project Notes
              </label>
              <textarea
                rows={3}
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full p-3 text-sm rounded-xl border border-[#D8D0C5] focus:border-[#806B59] focus:ring-2 focus:ring-[#806B59]/20"
              />
            </div>

            <div className="pt-2 flex items-center justify-end gap-3 border-t border-[#D8D0C5]">
              <Button type="button" variant="ghost" onClick={handleReset} disabled={loading}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" isLoading={loading}>
                Send Quotation Request
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
