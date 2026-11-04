"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { fetchBloodGroupDonorCounts } from "@/services/donors.service";

const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];

export function BloodGroupSearch() {
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;

    async function loadCounts() {
      setIsLoading(true);
      const { counts: fetchedCounts, error } =
        await fetchBloodGroupDonorCounts();

      if (!isMounted) return;

      if (!error && fetchedCounts) {
        setCounts(fetchedCounts);
      }
      setIsLoading(false);
    }

    loadCounts();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16 sm:mb-24 w-full">
      {/* Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-6 sm:mb-8">
        <div>
          <span className="text-xs font-bold tracking-widest uppercase text-red-700 block mb-1.5 sm:mb-2">
            FIND YOUR MATCH
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 tracking-tight leading-tight">
            Search by blood group
          </h2>
        </div>

        <Link
          href="/donors"
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-red-700 hover:text-red-800 transition-colors self-start sm:self-end group"
        >
          <span>View all donors</span>
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>

      {/* 8-Card Blood Group Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 sm:gap-4">
        {BLOOD_GROUPS.map((group) => {
          const count = counts[group] ?? 0;
          return (
            <Link
              key={group}
              href={`/donors?bloodGroup=${encodeURIComponent(group)}`}
              className="group relative flex flex-col justify-between rounded-2xl border border-gray-200/90 bg-white p-4 sm:p-4.5 transition-all duration-200 hover:border-red-600 hover:shadow-md cursor-pointer select-none"
            >
              {/* Top row: Blood Group Letter & Arrow Icon */}
              <div className="flex items-center justify-between mb-3">
                <span className="text-xl sm:text-2xl font-bold text-gray-900 group-hover:text-red-700 transition-colors">
                  {group}
                </span>
                <ArrowRight className="h-4 w-4 text-gray-300 transition-all duration-200 group-hover:text-red-700 group-hover:translate-x-0.5" />
              </div>

              {/* Bottom: Available Donors Count dynamically loaded from Supabase */}
              <span className="text-xs text-gray-400 font-normal group-hover:text-gray-500 transition-colors">
                {isLoading ? (
                  <span className="inline-block h-3.5 w-14 bg-gray-100 rounded animate-pulse" />
                ) : (
                  `${count} available`
                )}
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

export default BloodGroupSearch;
