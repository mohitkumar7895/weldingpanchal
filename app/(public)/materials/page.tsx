import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { MaterialCard } from "@/components/materials/material-card";
import { listMaterialCategories, listMaterials } from "@/lib/data/materials";
import { Package, ShieldCheck, Truck, Search } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Building Materials & Heavy Construction Supplies | WeldingPanchal",
  description:
    "Direct wholesale supply of certified TMT rebar, structural steel beams, cement bags, bricks, electrical conduits, and industrial welding electrodes.",
};

interface MaterialsPageProps {
  searchParams: Promise<{
    category?: string;
    brand?: string;
    in_stock?: string;
    search?: string;
    page?: string;
  }>;
}

export default async function MaterialsPage({ searchParams }: MaterialsPageProps) {
  const resolvedParams = await searchParams;
  const categorySlug = resolvedParams.category || "";
  const brand = resolvedParams.brand || "";
  const inStock = resolvedParams.in_stock === "true" ? true : undefined;
  const search = resolvedParams.search || "";
  const page = Math.max(1, parseInt(resolvedParams.page || "1", 10));
  const limit = 12;

  const categories = await listMaterialCategories();

  let categoryId: number | undefined;
  if (categorySlug) {
    const matched = categories.find((c) => c.slug === categorySlug);
    if (matched) categoryId = matched.id;
  }

  const { materials, total } = await listMaterials({
    category_id: categoryId,
    brand: brand || undefined,
    in_stock: inStock,
    search: search || undefined,
    is_active: true,
    page,
    limit,
  });

  return (
    <div className="bg-ivory min-h-screen py-8">
      <Container>
        {/* Header */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sandstone/40 border border-sandstone text-espresso text-xs font-semibold mb-3">
            <Package className="h-3.5 w-3.5 text-bronze" />
            Wholesale Construction Supplies
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-espresso tracking-tight">
            Building Materials & Industrial Supplies Library
          </h1>
          <p className="mt-2 text-sm sm:text-base text-text-secondary max-w-3xl">
            Source high-grade structural steel, IS-certified cement, river sand, premium AAC blocks,
            plumbing pipes, and welding rods directly from verified manufacturers at factory-direct pricing.
          </p>
        </div>

        {/* Search & Category Filter */}
        <div className="bg-white rounded-[20px] border border-sandstone p-5 shadow-luxury mb-8 space-y-4">
          <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
            <form action="/materials" method="GET" className="flex-1 w-full flex gap-2">
              {categorySlug && <input type="hidden" name="category" value={categorySlug} />}
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-text-secondary" />
                <input
                  name="search"
                  type="text"
                  defaultValue={search}
                  placeholder="Search materials by name, SKU, or brand (e.g. Tata, Ultratech, Fe 550D)..."
                  className="w-full h-11 pl-10 pr-4 text-sm rounded-xl border border-sandstone bg-ivory/50 focus:bg-white focus:border-mocha focus:ring-2 focus:ring-mocha/20 text-espresso outline-none transition-all placeholder:text-text-secondary/60"
                />
              </div>
              <button
                type="submit"
                className="h-11 px-6 rounded-xl bg-mocha text-white font-medium text-sm hover:bg-espresso transition-colors shadow-sm"
              >
                Search
              </button>
            </form>

            {(categorySlug || search || brand) && (
              <Link
                href="/materials"
                className="text-xs font-medium text-text-secondary hover:text-espresso px-3 py-2 rounded-xl bg-sandstone/30 hover:bg-sandstone/50 transition-colors whitespace-nowrap"
              >
                Clear Filters
              </Link>
            )}
          </div>

          <div className="pt-2 border-t border-sandstone/50 flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            <Link
              href="/materials"
              className={`px-3.5 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-colors ${
                !categorySlug
                  ? "bg-espresso text-white shadow-sm"
                  : "bg-white border border-sandstone text-espresso hover:bg-ivory"
              }`}
            >
              All Materials
            </Link>
            {categories.map((c) => {
              const isSelected = categorySlug === c.slug;
              return (
                <Link
                  key={c.id}
                  href={`/materials?category=${c.slug}`}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-colors ${
                    isSelected
                      ? "bg-espresso text-white shadow-sm"
                      : "bg-white border border-sandstone text-espresso hover:bg-ivory"
                  }`}
                >
                  {c.name}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Results Bar */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-text-secondary">
            Showing <strong className="text-espresso">{materials.length}</strong> of{" "}
            <strong className="text-espresso">{total}</strong> verified building items
          </p>
          <div className="hidden sm:flex items-center gap-3 text-xs text-text-secondary">
            <span className="flex items-center gap-1.5">
              <Truck className="h-4 w-4 text-bronze" /> Direct Site Delivery across Gujarat
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-mocha" /> Bureau of Indian Standards (BIS) Certified
            </span>
          </div>
        </div>

        {/* Materials Grid */}
        {materials.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {materials.map((m) => (
              <MaterialCard key={m.id} material={m} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-[20px] border border-sandstone p-12 text-center max-w-xl mx-auto my-8 shadow-luxury">
            <div className="h-16 w-16 bg-ivory text-bronze rounded-full flex items-center justify-center mx-auto mb-4 border border-sandstone">
              <Package className="h-8 w-8" />
            </div>
            <h3 className="text-lg font-bold text-espresso">No Materials Found</h3>
            <p className="text-sm text-text-secondary mt-2">
              Try choosing another category or searching for general product terms like "steel", "cement", or "pipe".
            </p>
          </div>
        )}
      </Container>
    </div>
  );
}
