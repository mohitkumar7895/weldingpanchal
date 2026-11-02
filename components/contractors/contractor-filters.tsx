"use client";

import React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Search, RotateCcw } from "lucide-react";

const CITIES = [
  "All Cities",
  "Ahmedabad",
  "Vadodara",
  "Surat",
  "Rajkot",
  "Gandhinagar",
  "Bhavnagar",
  "Jamnagar",
];

export function ContractorFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentCity = searchParams.get("city") || "";
  const currentVerification = searchParams.get("verified") || "";
  const currentSearch = searchParams.get("search") || "";

  function updateFilter(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value && value !== "All Cities") {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.set("page", "1");
    router.push(`/contractors?${params.toString()}`);
  }

  function handleReset() {
    router.push("/contractors");
  }

  function handleSearchSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const s = formData.get("search") as string;
    updateFilter("search", s);
  }

  return (
    <div className="bg-white rounded-[20px] border border-[#D8D0C5] p-5 shadow-card flex flex-col sm:flex-row gap-3 items-center justify-between">
      <form onSubmit={handleSearchSubmit} className="flex-1 w-full flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#A98559]" />
          <input
            name="search"
            type="text"
            defaultValue={currentSearch}
            placeholder="Search contractors by company name, specialization..."
            className="w-full h-11 pl-10 pr-4 text-sm rounded-xl border border-[#D8D0C5] bg-[#F5F0E8]/40 focus:bg-white focus:border-[#806B59] focus:ring-2 focus:ring-[#806B59]/20 transition-all text-[#292522] placeholder:text-[#9C9590]"
          />
        </div>
        <Button type="submit" variant="primary">
          Search
        </Button>
      </form>

      <div className="flex items-center gap-3 w-full sm:w-auto">
        <select
          value={currentCity || "All Cities"}
          onChange={(e) => updateFilter("city", e.target.value)}
          className="h-11 px-3.5 text-xs rounded-xl border border-[#D8D0C5] bg-white text-[#292522] focus:border-[#806B59] focus:ring-1 focus:ring-[#806B59] w-full sm:w-44 font-medium"
        >
          {CITIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        {(currentCity || currentSearch || currentVerification) && (
          <Button variant="ghost" size="md" onClick={handleReset} leftIcon={<RotateCcw className="h-4 w-4" />}>
            Reset
          </Button>
        )}
      </div>
    </div>
  );
}
