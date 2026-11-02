"use client";

import React from "react";
import { SlidersHorizontal, MapPin, ChevronDown } from "lucide-react";

export interface FilterState {
  bloodGroup: string;
  city: string;
  distance: string;
  availableNow: boolean;
  availableToday: boolean;
}

interface DonorSidebarFiltersProps {
  filters: FilterState;
  onChange: (filters: Partial<FilterState>) => void;
  onClearAll: () => void;
}

const BLOOD_GROUPS = [
  "All groups",
  "O+",
  "O-",
  "A+",
  "A-",
  "B+",
  "B-",
  "AB+",
  "AB-",
];

const DISTANCES = [
  "Within 5 km",
  "Within 10 km",
  "Within 25 km",
  "Within 50 km",
  "Any distance",
];

export function DonorSidebarFilters({
  filters,
  onChange,
  onClearAll,
}: DonorSidebarFiltersProps) {
  return (
    <aside className="w-full lg:w-72 xl:w-80 shrink-0">
      <div className="bg-white rounded-2xl border border-gray-100 shadow-xs p-5 sm:p-6 sticky top-24">
        {/* Header */}
        <div className="flex items-center justify-between pb-5 mb-5 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-gray-800" />
            <h2 className="text-base font-bold text-gray-900 tracking-tight">
              Filters
            </h2>
          </div>
          <button
            type="button"
            onClick={onClearAll}
            className="text-xs sm:text-sm font-semibold text-red-600 hover:text-red-700 hover:underline transition-colors cursor-pointer"
          >
            Clear all
          </button>
        </div>

        {/* 1. Blood group */}
        <div className="mb-4">
          <label className="text-xs font-semibold text-gray-500 mb-1.5 block">
            Blood group
          </label>
          <div className="relative">
            <select
              value={filters.bloodGroup}
              onChange={(e) => onChange({ bloodGroup: e.target.value })}
              className="w-full appearance-none rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 pr-9 text-sm font-medium text-gray-800 shadow-2xs hover:border-gray-300 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all cursor-pointer"
            >
              {BLOOD_GROUPS.map((bg) => (
                <option key={bg} value={bg}>
                  {bg}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          </div>
        </div>

        {/* 2. City or locality */}
        <div className="mb-4">
          <label className="text-xs font-semibold text-gray-500 mb-1.5 block">
            City or locality
          </label>
          <div className="relative">
            <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 flex items-center justify-center text-gray-400">
              <span className="flex h-5 w-5 items-center justify-center rounded-full border border-gray-300 text-gray-400">
                <MapPin className="w-3 h-3 text-gray-500" />
              </span>
            </div>
            <input
              type="text"
              placeholder="Try Ahmedabad"
              value={filters.city}
              onChange={(e) => onChange({ city: e.target.value })}
              className="w-full rounded-xl border border-gray-200 bg-white pl-10 pr-3.5 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 shadow-2xs hover:border-gray-300 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all"
            />
          </div>
        </div>

        {/* 3. Distance */}
        <div className="mb-5">
          <label className="text-xs font-semibold text-gray-500 mb-1.5 block">
            Distance
          </label>
          <div className="relative">
            <select
              value={filters.distance}
              onChange={(e) => onChange({ distance: e.target.value })}
              className="w-full appearance-none rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 pr-9 text-sm font-medium text-gray-800 shadow-2xs hover:border-gray-300 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all cursor-pointer"
            >
              {DISTANCES.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          </div>
        </div>

        {/* 4. Availability checkboxes */}
        <div>
          <label className="text-xs font-semibold text-gray-500 mb-2.5 block">
            Availability
          </label>
          <div className="flex flex-col gap-2.5">
            {/* Available now */}
            <label className="flex items-center gap-2.5 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={filters.availableNow}
                onChange={(e) => onChange({ availableNow: e.target.checked })}
                className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 accent-blue-600 cursor-pointer"
              />
              <span className="text-sm font-medium text-gray-800">
                Available now
              </span>
            </label>

            {/* Available today */}
            <label className="flex items-center gap-2.5 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={filters.availableToday}
                onChange={(e) =>
                  onChange({ availableToday: e.target.checked })
                }
                className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 accent-blue-600 cursor-pointer"
              />
              <span className="text-sm font-medium text-gray-800">
                Available today
              </span>
            </label>
          </div>
        </div>
      </div>
    </aside>
  );
}

export default DonorSidebarFilters;

