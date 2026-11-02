import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { ServiceCard } from "@/components/services/service-card";
import { listServiceCategories, listServices } from "@/lib/data/services";
import { Wrench, ShieldCheck, CheckCircle2, Clock, Search } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Construction & Engineering Services | WeldingPanchal",
  description:
    "Explore certified industrial welding, masonry, carpentry, electrical, plumbing, painting, and turnkey site services with transparent pricing.",
};

interface ServicesPageProps {
  searchParams: Promise<{
    category?: string;
    search?: string;
    page?: string;
  }>;
}

export default async function ServicesPage({ searchParams }: ServicesPageProps) {
  const resolvedParams = await searchParams;
  const categorySlug = resolvedParams.category || "";
  const search = resolvedParams.search || "";
  const page = Math.max(1, parseInt(resolvedParams.page || "1", 10));
  const limit = 12;

  const categories = await listServiceCategories();

  let categoryId: number | undefined;
  if (categorySlug) {
    const matched = categories.find((c) => c.slug === categorySlug);
    if (matched) categoryId = matched.id;
  }

  const { services, total } = await listServices({
    category_id: categoryId,
    search: search || undefined,
    is_active: true,
    page,
    limit,
  });

  const totalPages = Math.ceil(total / limit) || 1;

  return (
    <div className="bg-[#F5F0E8] min-h-screen py-10">
      <Container>
        {/* Header */}
        <div className="mb-8 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FFFFFF] border border-[#D8D0C5] text-xs font-bold text-[#A98559] shadow-subtle">
            <Wrench className="h-3.5 w-3.5 text-[#A98559]" />
            Specialized On-Site Capabilities
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#40352E] tracking-tight">
            Industrial & Residential Construction Services
          </h1>
          <p className="text-sm sm:text-base text-[#77716E] max-w-3xl leading-relaxed">
            Book professional structural welding, precision brick masonry, turnkey electrical wiring,
            plumbing overhauls, and architectural carpentry executed by certified craftsmen.
          </p>
        </div>

        {/* Category Pills & Search */}
        <div className="bg-white rounded-[20px] border border-[#D8D0C5] p-5 shadow-card mb-8 space-y-4">
          <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
            <form action="/services" method="GET" className="flex-1 w-full flex gap-2">
              {categorySlug && <input type="hidden" name="category" value={categorySlug} />}
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#A98559]" />
                <input
                  name="search"
                  type="text"
                  defaultValue={search}
                  placeholder="Search services by keyword (e.g. welding, piping, wiring)..."
                  className="w-full h-11 pl-10 pr-4 text-sm rounded-xl border border-[#D8D0C5] bg-[#F5F0E8]/40 focus:bg-white focus:border-[#806B59] focus:ring-2 focus:ring-[#806B59]/20 transition-all text-[#292522] placeholder:text-[#9C9590]"
                />
              </div>
              <button
                type="submit"
                className="h-11 px-5 rounded-xl bg-[#806B59] text-white font-semibold text-xs hover:bg-[#6C5A4B] transition-colors"
              >
                Search
              </button>
            </form>

            {(categorySlug || search) && (
              <Link
                href="/services"
                className="text-xs font-semibold text-[#77716E] hover:text-[#40352E] px-3.5 py-2.5 rounded-xl bg-[#F5F0E8] hover:bg-[#ECE8E1] transition-colors whitespace-nowrap border border-[#D8D0C5]"
              >
                Clear Filters
              </Link>
            )}
          </div>

          <div className="pt-2 border-t border-[#D8D0C5]/40 flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            <Link
              href="/services"
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                !categorySlug
                  ? "bg-[#40352E] text-white shadow-sm"
                  : "bg-[#F5F0E8] text-[#40352E] hover:bg-[#ECE8E1] border border-[#D8D0C5]/60"
              }`}
            >
              All Services
            </Link>
            {categories.map((c) => {
              const isSelected = categorySlug === c.slug;
              return (
                <Link
                  key={c.id}
                  href={`/services?category=${c.slug}`}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                    isSelected
                      ? "bg-[#40352E] text-white shadow-sm"
                      : "bg-[#F5F0E8] text-[#40352E] hover:bg-[#ECE8E1] border border-[#D8D0C5]/60"
                  }`}
                >
                  {c.name}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Results Count & Badges */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-[#77716E]">
            Showing <strong className="text-[#40352E]">{services.length}</strong> of{" "}
            <strong className="text-[#40352E]">{total}</strong> construction services
          </p>
          <div className="hidden sm:flex items-center gap-4 text-xs font-semibold text-[#77716E]">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-[#A98559]" /> Workmanship Warranty Included
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <Clock className="h-4 w-4 text-[#806B59]" /> Punctual Dispatch
            </span>
          </div>
        </div>

        {/* Services Grid */}
        {services.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-[20px] border border-[#D8D0C5] p-12 text-center max-w-xl mx-auto my-8 shadow-card">
            <div className="h-16 w-16 bg-[#F5F0E8] text-[#806B59] rounded-2xl flex items-center justify-center mx-auto mb-4 border border-[#D8D0C5]">
              <Wrench className="h-8 w-8 text-[#A98559]" />
            </div>
            <h3 className="text-lg font-bold text-[#40352E]">No Services Found</h3>
            <p className="text-xs text-[#77716E] mt-2">
              Try choosing another trade category or clearing your search term.
            </p>
          </div>
        )}
      </Container>
    </div>
  );
}
