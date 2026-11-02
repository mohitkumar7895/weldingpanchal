"use client";

import React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, RotateCcw } from "lucide-react";

const SKILLS = [
  "All Trades",
  "Welder",
  "Mason",
  "Carpenter",
  "Electrician",
  "Plumber",
  "Painter",
  "Labour",
  "Tile Installer",
];

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

export function WorkerFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentSkill = searchParams.get("skill") || "";
  const currentCity = searchParams.get("city") || "";
  const currentExp = searchParams.get("min_experience") || "";
  const currentAvail = searchParams.get("availability") || "";
  const currentSearch = searchParams.get("q") || "";
  const currentSort = searchParams.get("sort") || "rating";

  function updateFilter(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value && value !== "All Trades" && value !== "All Cities") {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.set("page", "1");
    router.push(`/workers?${params.toString()}`);
  }

  function handleReset() {
    router.push("/workers");
  }

  function handleSearchSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const q = formData.get("q") as string;
    updateFilter("q", q);
  }

  return (
    <div className="bg-white rounded-[20px] border border-[#D8D0C5] p-5 shadow-card space-y-4">
      {/* Search Input & Reset Button */}
      <div className="flex flex-col sm:flex-row gap-3">
        <form onSubmit={handleSearchSubmit} className="flex-1 flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#A98559]" />
            <input
              name="q"
              type="text"
              defaultValue={currentSearch}
              placeholder="Search by worker name, trade craft, or certification..."
              className="w-full h-11 pl-10 pr-4 text-sm rounded-xl border border-[#D8D0C5] bg-[#F5F0E8]/40 focus:bg-white focus:border-[#806B59] focus:ring-2 focus:ring-[#806B59]/20 transition-all text-[#292522] placeholder:text-[#9C9590]"
            />
          </div>
          <Button type="submit" variant="primary">
            Search
          </Button>
        </form>

        {(currentSkill || currentCity || currentExp || currentAvail || currentSearch) && (
          <Button
            variant="ghost"
            size="md"
            onClick={handleReset}
            leftIcon={<RotateCcw className="h-4 w-4" />}
          >
            Reset
          </Button>
        )}
      </div>

      {/* Trade Category Tabs */}
      <div>
        <span className="text-[11px] font-bold text-[#77716E] uppercase tracking-wider block mb-2">
          Select Trade Craft
        </span>
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {SKILLS.map((skill) => {
            const isSelected =
              skill === "All Trades"
                ? !currentSkill
                : currentSkill.toLowerCase() === skill.toLowerCase();
            return (
              <button
                key={skill}
                type="button"
                onClick={() => updateFilter("skill", skill === "All Trades" ? "" : skill)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  isSelected
                    ? "bg-[#40352E] text-white shadow-sm"
                    : "bg-[#F5F0E8] text-[#40352E] hover:bg-[#ECE8E1] border border-[#D8D0C5]/60"
                }`}
              >
                {skill}
              </button>
            );
          })}
        </div>
      </div>

      {/* Secondary Dropdown Filters */}
      <div className="pt-3 border-t border-[#D8D0C5]/40 grid grid-cols-2 sm:grid-cols-4 gap-3">
        {/* City Filter */}
        <div>
          <label className="block text-[10px] font-bold text-[#77716E] uppercase mb-1">
            City
          </label>
          <select
            value={currentCity || "All Cities"}
            onChange={(e) => updateFilter("city", e.target.value)}
            className="w-full h-10 px-3 text-xs rounded-xl border border-[#D8D0C5] bg-white text-[#292522] focus:border-[#806B59] focus:ring-1 focus:ring-[#806B59]"
          >
            {CITIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        {/* Experience Filter */}
        <div>
          <label className="block text-[10px] font-bold text-[#77716E] uppercase mb-1">
            Experience
          </label>
          <select
            value={currentExp}
            onChange={(e) => updateFilter("min_experience", e.target.value)}
            className="w-full h-10 px-3 text-xs rounded-xl border border-[#D8D0C5] bg-white text-[#292522] focus:border-[#806B59] focus:ring-1 focus:ring-[#806B59]"
          >
            <option value="">Any Experience</option>
            <option value="2">2+ Years</option>
            <option value="5">5+ Years</option>
            <option value="8">8+ Years</option>
            <option value="12">12+ Years (Master)</option>
          </select>
        </div>

        {/* Availability Filter */}
        <div>
          <label className="block text-[10px] font-bold text-[#77716E] uppercase mb-1">
            Availability
          </label>
          <select
            value={currentAvail}
            onChange={(e) => updateFilter("availability", e.target.value)}
            className="w-full h-10 px-3 text-xs rounded-xl border border-[#D8D0C5] bg-white text-[#292522] focus:border-[#806B59] focus:ring-1 focus:ring-[#806B59]"
          >
            <option value="">All Statuses</option>
            <option value="available">Available Now</option>
            <option value="busy">On Site (Busy)</option>
            <option value="on_leave">On Leave</option>
          </select>
        </div>

        {/* Sort Filter */}
        <div>
          <label className="block text-[10px] font-bold text-[#77716E] uppercase mb-1">
            Sort By
          </label>
          <select
            value={currentSort}
            onChange={(e) => updateFilter("sort", e.target.value)}
            className="w-full h-10 px-3 text-xs rounded-xl border border-[#D8D0C5] bg-white text-[#292522] focus:border-[#806B59] focus:ring-1 focus:ring-[#806B59]"
          >
            <option value="rating">Top Rated</option>
            <option value="experience">Most Experienced</option>
            <option value="rate_asc">Daily Wage: Low to High</option>
            <option value="rate_desc">Daily Wage: High to Low</option>
          </select>
        </div>
      </div>
    </div>
  );
}
