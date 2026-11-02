"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { MaterialRow } from "@/types";
import { formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { MaterialQuoteModal } from "@/components/materials/material-quote-modal";
import { ShoppingCart } from "lucide-react";

interface MaterialCardProps {
  material: MaterialRow;
}

export function MaterialCard({ material }: MaterialCardProps) {
  const [quoteOpen, setQuoteOpen] = useState(false);

  const fallbackImage = "/images/material-steel.jpg";

  return (
    <>
      <div className="group bg-white rounded-[20px] border border-[#D8D0C5] hover:border-[#806B59] hover:shadow-luxury-hover hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between overflow-hidden shadow-card">
        <div>
          {/* Material Image */}
          <div className="relative h-44 w-full bg-[#40352E] overflow-hidden">
            <Image
              src={material.image_url || fallbackImage}
              alt={material.name}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
            {material.brand && (
              <span className="absolute top-3 left-3 bg-[#40352E]/90 text-white backdrop-blur-sm text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                {material.brand}
              </span>
            )}
            <span
              className={`absolute top-3 right-3 text-[10px] font-bold px-2 py-0.5 rounded backdrop-blur-sm ${
                material.is_in_stock
                  ? "bg-emerald-700 text-white"
                  : "bg-[#806B59] text-white"
              }`}
            >
              {material.is_in_stock ? "In Stock" : "On Request"}
            </span>
          </div>

          <div className="p-5">
            <div className="flex items-center justify-between gap-2 mb-1">
              <span className="text-[11px] font-mono text-[#77716E]">
                SKU: {material.sku}
              </span>
              {material.category_name && (
                <span className="text-[11px] font-bold text-[#A98559] truncate">
                  {material.category_name}
                </span>
              )}
            </div>

            <Link
              href={`/materials/${material.sku}`}
              className="font-bold text-[#40352E] hover:text-[#806B59] transition-colors text-base line-clamp-1"
            >
              {material.name}
            </Link>

            <div className="mt-4 pt-3 border-t border-[#D8D0C5]/40 flex items-center justify-between text-xs text-[#77716E]">
              <span>Min. Order:</span>
              <strong className="text-[#40352E] font-bold">
                {material.min_order_quantity} {material.unit}
              </strong>
            </div>
          </div>
        </div>

        {/* Pricing & Order Actions */}
        <div className="bg-[#F5F0E8] px-5 py-3.5 border-t border-[#D8D0C5] flex items-center justify-between gap-3">
          <div>
            <span className="text-[10px] uppercase font-bold text-[#77716E] block">
              Wholesale Price
            </span>
            <span className="text-base font-bold text-[#40352E]">
              {formatCurrency(material.price_per_unit)}
              <span className="text-xs font-normal text-[#77716E]"> / {material.unit}</span>
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Link href={`/materials/${material.sku}`}>
              <Button variant="secondary" size="sm">
                Specs
              </Button>
            </Link>
            <Button
              variant="primary"
              size="sm"
              leftIcon={<ShoppingCart className="h-3.5 w-3.5" />}
              onClick={() => setQuoteOpen(true)}
            >
              Inquire
            </Button>
          </div>
        </div>
      </div>

      <MaterialQuoteModal
        isOpen={quoteOpen}
        onClose={() => setQuoteOpen(false)}
        material={material}
      />
    </>
  );
}
