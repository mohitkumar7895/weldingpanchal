"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, MapPin, HardHat, Building2, Wrench, Boxes, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function HeroSearch() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"worker" | "contractor" | "service" | "material">("worker");
  const [query, setQuery] = useState("");
  const [city, setCity] = useState("");

  const tabs = [
    { id: "worker", label: "Find Workers", icon: HardHat, placeholder: "e.g. Welder, Mason, Electrician, Carpenter..." },
    { id: "contractor", label: "Contractors", icon: Building2, placeholder: "e.g. Civil Contractor, Structural Steel, RCC..." },
    { id: "service", label: "Services", icon: Wrench, placeholder: "e.g. Industrial Welding, Turnkey Masonry, Wiring..." },
    { id: "material", label: "Materials", icon: Boxes, placeholder: "e.g. TMT Steel, Ultratech Cement, AAC Blocks..." },
  ] as const;

  const activeTabConfig = tabs.find((t) => t.id === activeTab) || tabs[0];

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();

    if (activeTab === "worker") {
      const params = new URLSearchParams();
      if (query.trim()) params.set("skill", query.trim());
      if (city.trim()) params.set("city", city.trim());
      router.push(`/workers?${params.toString()}`);
    } else if (activeTab === "contractor") {
      const params = new URLSearchParams();
      if (query.trim()) params.set("search", query.trim());
      if (city.trim()) params.set("city", city.trim());
      router.push(`/contractors?${params.toString()}`);
    } else if (activeTab === "service") {
      const params = new URLSearchParams();
      if (query.trim()) params.set("search", query.trim());
      router.push(`/services?${params.toString()}`);
    } else if (activeTab === "material") {
      const params = new URLSearchParams();
      if (query.trim()) params.set("search", query.trim());
      router.push(`/materials?${params.toString()}`);
    }
  }

  return (
    <div className="bg-white rounded-[20px] shadow-luxury border border-[#D8D0C5] p-3 sm:p-4 w-full backdrop-blur-sm">
      {/* Category Tabs */}
      <div className="flex items-center gap-1.5 border-b border-[#D8D0C5]/40 pb-3 mb-3.5 overflow-x-auto scrollbar-none">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isSelected = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                isSelected
                  ? "bg-[#40352E] text-white shadow-sm"
                  : "text-[#77716E] hover:text-[#40352E] hover:bg-[#F5F0E8]"
              }`}
            >
              <Icon className={`h-4 w-4 ${isSelected ? "text-[#A98559]" : "text-[#77716E]"}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Search Input Bar */}
      <form onSubmit={handleSearch} className="flex flex-col sm:flex-row items-center gap-2.5">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#A98559]" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={activeTabConfig.placeholder}
            className="w-full h-12 pl-10 pr-3 text-sm text-[#292522] placeholder:text-[#9C9590] rounded-xl border border-[#D8D0C5] bg-[#F5F0E8]/40 focus:bg-white focus:outline-none focus:border-[#806B59] focus:ring-2 focus:ring-[#806B59]/20 transition-all"
          />
        </div>

        {(activeTab === "worker" || activeTab === "contractor") && (
          <div className="relative w-full sm:w-48">
            <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#A98559]" />
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="City in Gujarat..."
              className="w-full h-12 pl-10 pr-3 text-sm text-[#292522] placeholder:text-[#9C9590] rounded-xl border border-[#D8D0C5] bg-[#F5F0E8]/40 focus:bg-white focus:outline-none focus:border-[#806B59] focus:ring-2 focus:ring-[#806B59]/20 transition-all"
            />
          </div>
        )}

        <Button
          type="submit"
          variant="primary"
          size="lg"
          className="w-full sm:w-auto h-12 px-6 flex-shrink-0"
          rightIcon={<ArrowRight className="h-4 w-4" />}
        >
          Search
        </Button>
      </form>
    </div>
  );
}
