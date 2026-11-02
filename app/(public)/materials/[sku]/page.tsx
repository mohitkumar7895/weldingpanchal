import React from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { getMaterialBySku } from "@/lib/data/materials";
import { MaterialRow } from "@/types";
import {
  ShieldCheck,
  ChevronRight,
  Scale,
} from "lucide-react";
import { MaterialDetailOrder } from "@/components/materials/material-detail-order";

export const dynamic = "force-dynamic";

interface MaterialDetailPageProps {
  params: Promise<{ sku: string }>;
}

export async function generateMetadata({ params }: MaterialDetailPageProps): Promise<Metadata> {
  const resolved = await params;
  const material = await getMaterialBySku(resolved.sku);
  if (!material) {
    return { title: "Material Not Found | WeldingPanchal" };
  }
  return {
    title: `${material.name} (${material.sku}) | WeldingPanchal Materials`,
    description: `Buy wholesale ${material.name} from ${material.brand || "verified brands"}. Current rate: ₹${material.price_per_unit} per ${material.unit}. On-site delivery across Gujarat.`,
  };
}

function getMaterialImage(m: MaterialRow): string {
  if (m.image_url && m.image_url.startsWith("/images/")) return m.image_url;
  const name = (m.name + " " + (m.category_name || "")).toLowerCase();
  if (name.includes("cement")) return "/images/material-cement.jpg";
  if (name.includes("brick") || name.includes("block")) return "/images/material-bricks.jpg";
  return "/images/material-steel.jpg";
}

export default async function MaterialDetailPage({ params }: MaterialDetailPageProps) {
  const resolved = await params;
  const material = await getMaterialBySku(resolved.sku);
  if (!material) notFound();

  const displayImage = getMaterialImage(material);

  // Parse specifications if string
  let specsObj: Record<string, any> = {};
  if (material.specifications) {
    if (typeof material.specifications === "string") {
      try {
        specsObj = JSON.parse(material.specifications);
      } catch {
        specsObj = { specifications: material.specifications };
      }
    } else {
      specsObj = material.specifications;
    }
  }

  return (
    <div className="bg-ivory min-h-screen py-8">
      <Container>
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-xs text-text-secondary mb-6">
          <Link href="/" className="hover:text-espresso transition-colors">
            Home
          </Link>
          <ChevronRight className="h-3.5 w-3.5 text-sandstone" />
          <Link href="/materials" className="hover:text-espresso transition-colors">
            Materials Library
          </Link>
          <ChevronRight className="h-3.5 w-3.5 text-sandstone" />
          <span className="text-espresso font-medium truncate max-w-xs">{material.name}</span>
        </nav>

        {/* Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-8">
            {/* Image Gallery / Showcase */}
            <div className="bg-white rounded-[20px] border border-sandstone p-6 shadow-luxury overflow-hidden">
              <div className="relative h-72 sm:h-96 w-full rounded-2xl overflow-hidden bg-ivory border border-sandstone">
                <Image
                  src={displayImage}
                  alt={material.name}
                  fill
                  sizes="(max-width: 1024px) 100vw, 66vw"
                  className="object-cover"
                  priority
                />
                {material.brand && (
                  <span className="absolute top-4 left-4 bg-espresso/90 text-white backdrop-blur-sm text-xs font-bold px-3 py-1 rounded-lg uppercase tracking-wider">
                    {material.brand}
                  </span>
                )}
                <span
                  className={`absolute top-4 right-4 text-xs font-bold px-3 py-1 rounded-lg backdrop-blur-sm ${
                    material.is_in_stock
                      ? "bg-mocha text-white"
                      : "bg-espresso/80 text-sandstone"
                  }`}
                >
                  {material.is_in_stock ? "Stock Available" : "Procure on Request"}
                </span>
              </div>

              <div className="mt-6">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-mono text-text-secondary bg-ivory border border-sandstone px-2.5 py-0.5 rounded-lg">
                    SKU: {material.sku}
                  </span>
                  {material.category_name && (
                    <span className="text-xs font-semibold text-bronze uppercase tracking-wider">
                      {material.category_name}
                    </span>
                  )}
                </div>

                <h1 className="text-2xl sm:text-3xl font-extrabold text-espresso tracking-tight">
                  {material.name}
                </h1>
              </div>
            </div>

            {/* Technical Specifications */}
            <div className="bg-white rounded-[20px] border border-sandstone p-6 sm:p-8 shadow-luxury">
              <h2 className="text-lg font-bold text-espresso mb-4 flex items-center gap-2">
                <Scale className="h-5 w-5 text-bronze" />
                Technical Specifications & Standards
              </h2>

              <div className="border border-sandstone rounded-xl overflow-hidden">
                <table className="min-w-full divide-y divide-sandstone text-xs">
                  <tbody className="divide-y divide-sandstone/50">
                    <tr className="bg-ivory/50">
                      <td className="px-4 py-3 font-semibold text-text-secondary w-1/3">Standard Unit</td>
                      <td className="px-4 py-3 text-espresso font-medium">{material.unit}</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-semibold text-text-secondary">Primary Brand</td>
                      <td className="px-4 py-3 text-espresso font-medium">{material.brand || "Industrial Grade"}</td>
                    </tr>
                    <tr className="bg-ivory/50">
                      <td className="px-4 py-3 font-semibold text-text-secondary">Minimum Order Quantity</td>
                      <td className="px-4 py-3 text-espresso font-medium">
                        {material.min_order_quantity} {material.unit}
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-semibold text-text-secondary">Inventory Status</td>
                      <td className="px-4 py-3 text-espresso font-medium">
                        {material.is_in_stock
                          ? `Ready for immediate dispatch (${material.stock_quantity} in regional warehouse)`
                          : "Scheduled batch manufacturing / on-order"}
                      </td>
                    </tr>
                    {Object.entries(specsObj).map(([key, val]) => (
                      <tr key={key} className="even:bg-ivory/50">
                        <td className="px-4 py-3 font-semibold text-text-secondary capitalize">
                          {key.replace(/_/g, " ")}
                        </td>
                        <td className="px-4 py-3 text-espresso font-medium">{String(val)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Quality & Logistics Compliance */}
            <div className="bg-white rounded-[20px] border border-sandstone p-6 sm:p-8 shadow-luxury">
              <h2 className="text-lg font-bold text-espresso mb-4 flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-mocha" />
                Material Quality Assurance & Transit
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-text-primary">
                <div className="p-4 rounded-xl border border-sandstone bg-ivory/40">
                  <h4 className="font-bold text-espresso mb-1">Mill Test Certificate (MTC)</h4>
                  <p className="text-text-secondary">
                    Supplied with physical batch test certificates verifying tensile strength, elongation, and chemical composition.
                  </p>
                </div>
                <div className="p-4 rounded-xl border border-sandstone bg-ivory/40">
                  <h4 className="font-bold text-espresso mb-1">Weighbridge Verified</h4>
                  <p className="text-text-secondary">
                    Gross, tare, and net weights certified via electronic weighbridge slips before unloading at your job site.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Sidebar: Order & Inquire */}
          <div className="lg:col-span-1">
            <MaterialDetailOrder material={material} />
          </div>
        </div>
      </Container>
    </div>
  );
}
