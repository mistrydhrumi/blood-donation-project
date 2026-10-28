"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export interface BloodGroupItem {
  group: string;
  count: number;
}

const BLOOD_GROUPS_DATA: BloodGroupItem[] = [
  { group: "A+", count: 184 },
  { group: "A-", count: 42 },
  { group: "B+", count: 136 },
  { group: "B-", count: 38 },
  { group: "O+", count: 312 },
  { group: "O-", count: 56 },
  { group: "AB+", count: 28 },
  { group: "AB-", count: 19 },
];

export function BloodGroupSearch() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16 sm:mb-24 w-full">
      {/* Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-6 sm:mb-8">
        <div>
          <span className="text-xs font-bold tracking-[0.16em] uppercase text-[#C52227] block mb-1.5 sm:mb-2">
            FIND YOUR MATCH
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-[34px] font-bold text-gray-900 tracking-tight leading-tight">
            Search by blood group
          </h2>
        </div>

        <Link
          href="/signup?intent=view_all_donors"
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#C52227] hover:text-[#A8181D] transition-colors self-start sm:self-end group"
        >
          <span>View all donors</span>
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>

      {/* 8-Card Blood Group Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 sm:gap-4">
        {BLOOD_GROUPS_DATA.map((item) => (
          <Link
            key={item.group}
            href={`/signup?intent=search&bloodGroup=${encodeURIComponent(item.group)}`}
            className="group relative flex flex-col justify-between rounded-2xl border border-gray-200/90 bg-white p-4 sm:p-4.5 transition-all duration-200 hover:border-[#C52227] hover:shadow-md cursor-pointer select-none"
          >
            {/* Top row: Blood Group Letter & Arrow Icon */}
            <div className="flex items-center justify-between mb-3">
              <span className="text-xl sm:text-2xl font-bold text-gray-900 group-hover:text-[#C52227] transition-colors">
                {item.group}
              </span>
              <ArrowRight className="h-4 w-4 text-gray-300 transition-all duration-200 group-hover:text-[#C52227] group-hover:translate-x-0.5" />
            </div>

            {/* Bottom: Available Donors Count */}
            <span className="text-xs text-gray-400 font-normal group-hover:text-gray-500 transition-colors">
              {item.count} available
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}

export default BloodGroupSearch;
