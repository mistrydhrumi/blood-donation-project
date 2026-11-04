"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { List, Map as MapIcon, ChevronDown, Users, RotateCcw, HeartHandshake } from "lucide-react";
import { DonorCard, type DonorItem } from "./DonorCard";
import { DonorSidebarFilters, type FilterState } from "./DonorSidebarFilters";
import { DonorProfileSheet } from "./DonorProfileSheet";
import { DonorMap } from "./DonorMap";
import { fetchDonorsFromSupabase } from "@/services/donors.service";

export function DonorDirectory() {
  const searchParams = useSearchParams();
  const queryBloodGroup = searchParams.get("bloodGroup");
  const queryCity = searchParams.get("city");

  const normalizeBloodGroupParam = (bg: string | null): string => {
    if (!bg || !bg.trim()) return "All groups";
    // Handle URL decoding where '+' might become ' ' (e.g., 'A ' -> 'A+')
    return bg.trim().replace(/\s+/g, "+").toUpperCase();
  };

  const [donors, setDonors] = useState<DonorItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState<number>(0);

  const [viewMode, setViewMode] = useState<"list" | "map">("list");
  const [sortBy, setSortBy] = useState<"nearest" | "recent">("nearest");
  const [selectedDonor, setSelectedDonor] = useState<DonorItem | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  // Filters State initialized from search params if present
  const [filters, setFilters] = useState<FilterState>(() => ({
    bloodGroup: normalizeBloodGroupParam(queryBloodGroup),
    city: queryCity && queryCity.trim() ? queryCity.trim() : "",
    distance: "Any distance",
    availableNow: false,
    availableToday: false,
  }));

  // Synchronize filters when searchParams change (e.g. navigation from landing page)
  useEffect(() => {
    const bg = searchParams.get("bloodGroup");
    const c = searchParams.get("city");

    if (bg !== null || c !== null) {
      setFilters((prev) => ({
        ...prev,
        bloodGroup: bg !== null ? normalizeBloodGroupParam(bg) : prev.bloodGroup,
        city: c !== null ? c.trim() : prev.city,
      }));
    }
  }, [searchParams]);

  // Query Supabase profiles table on mount and when refresh is triggered
  useEffect(() => {
    let isMounted = true;

    async function loadDonors() {
      const { data, error } = await fetchDonorsFromSupabase();

      if (!isMounted) return;

      if (error) {
        setFetchError("Unable to load live donors from database. Please check your connection.");
        setDonors([]);
      } else {
        setFetchError(null);
        setDonors(data);
      }
      setIsLoading(false);
    }

    loadDonors();

    return () => {
      isMounted = false;
    };
  }, [refreshTrigger]);

  const handleRetry = () => {
    setIsLoading(true);
    setFetchError(null);
    setRefreshTrigger((prev) => prev + 1);
  };

  const handleFilterChange = (partial: Partial<FilterState>) => {
    setFilters((prev) => ({ ...prev, ...partial }));
  };

  const handleClearAll = () => {
    setFilters({
      bloodGroup: "All groups",
      city: "",
      distance: "Any distance",
      availableNow: false,
      availableToday: false,
    });
    if (typeof window !== "undefined" && window.location.search) {
      window.history.replaceState(null, "", window.location.pathname);
    }
  };

  // Filtered & Sorted Donors list
  const filteredDonors = useMemo(() => {
    const list = donors.filter((d) => {
      // Blood Group filter
      if (
        filters.bloodGroup !== "All groups" &&
        d.bloodGroup.trim().toUpperCase() !== filters.bloodGroup.trim().toUpperCase()
      ) {
        return false;
      }

      // City / locality / pincode search
      if (filters.city.trim() !== "") {
        const query = filters.city.toLowerCase().trim();
        const matchesCity = d.city.toLowerCase().includes(query);
        const matchesLocality = d.locality ? d.locality.toLowerCase().includes(query) : false;
        const matchesState = d.state ? d.state.toLowerCase().includes(query) : false;
        const matchesPincode = d.pincode ? d.pincode.includes(query) : false;

        if (!matchesCity && !matchesLocality && !matchesState && !matchesPincode) {
          return false;
        }
      }

      // Availability filter
      if (filters.availableNow && d.status !== "Available") {
        return false;
      }

      if (filters.availableToday && d.status !== "Available") {
        return false;
      }

      return true;
    });

    if (sortBy === "recent") {
      // Keep recent order as returned from DB
      return list;
    }

    return list;
  }, [donors, filters, sortBy]);

  // WhatsApp Contact Handler
  const handleContactWhatsApp = (donor: DonorItem) => {
    const rawNumber = donor.rawPhone
      ? donor.rawPhone.replace(/[^0-9]/g, "")
      : "";

    const phoneWithCode = rawNumber.length > 0
      ? (rawNumber.startsWith("91") ? rawNumber : `91${rawNumber}`)
      : "919825012345"; // fallback number

    const text = encodeURIComponent(
      `Hello ${donor.name}, I found your verified profile on BloodBridge. Are you available for a ${donor.bloodGroup} blood donation near ${donor.city}?`
    );
    window.open(`https://wa.me/${phoneWithCode}?text=${text}`, "_blank");
  };

  const handleViewProfile = (donor: DonorItem) => {
    setSelectedDonor(donor);
    setIsSheetOpen(true);
  };

  const activeCityLabel = filters.city.trim() || "Ahmedabad";

  return (
    <div className="w-full bg-gray-50 min-h-[calc(100vh-280px)] py-8 sm:py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-start">
          {/* 1. Left Sidebar Filters matching Image 2 */}
          <DonorSidebarFilters
            filters={filters}
            onChange={handleFilterChange}
            onClearAll={handleClearAll}
          />

          {/* 2. Main Content Right Panel */}
          <div className="flex-1 w-full">
            {/* Top Bar matching Image 2 */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              {/* Left Count & Locality notice */}
              <div>
                <h2 className="text-xl font-bold text-gray-900 tracking-tight">
                  {isLoading ? "Searching donors..." : `${filteredDonors.length} matching donors`}
                </h2>
                <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
                  Showing approximate locations near {activeCityLabel}
                </p>
              </div>

              {/* Right View Toggle (List / Map) & Nearest sort dropdown */}
              <div className="flex items-center gap-3 shrink-0">
                {/* List / Map view toggle */}
                <div className="flex items-center rounded-xl border border-gray-200 bg-white p-1 shadow-2xs">
                  <button
                    type="button"
                    onClick={() => setViewMode("list")}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      viewMode === "list"
                        ? "bg-red-50 text-red-700 shadow-2xs"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    <List className="w-3.5 h-3.5" />
                    <span>List</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setViewMode("map")}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      viewMode === "map"
                        ? "bg-red-50 text-red-700 shadow-2xs"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    <MapIcon className="w-3.5 h-3.5" />
                    <span>Map</span>
                  </button>
                </div>

                {/* Sort Dropdown */}
                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={(e) =>
                      setSortBy(e.target.value as "nearest" | "recent")
                    }
                    className="appearance-none rounded-xl border border-gray-200 bg-white px-3.5 py-2 pr-8 text-xs sm:text-sm font-semibold text-gray-800 shadow-2xs hover:border-gray-300 focus:outline-none focus:border-red-500 transition-all cursor-pointer"
                  >
                    <option value="nearest">Nearest</option>
                    <option value="recent">Recently confirmed</option>
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500" />
                </div>
              </div>
            </div>

            {/* Error Banner */}
            {fetchError && (
              <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-xs sm:text-sm text-red-700 flex items-center justify-between gap-3">
                <span className="font-medium">{fetchError}</span>
                <button
                  type="button"
                  onClick={handleRetry}
                  className="px-3 py-1.5 rounded-lg bg-red-700 hover:bg-red-800 text-white font-semibold text-xs transition-colors shrink-0 cursor-pointer"
                >
                  Retry
                </button>
              </div>
            )}

            {/* 3. Loading Skeleton */}
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 animate-pulse">
                {[1, 2, 3, 4].map((n) => (
                  <div
                    key={n}
                    className="bg-white rounded-2xl border border-gray-100 p-6 flex flex-col justify-between h-64"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-12 rounded-full bg-gray-200" />
                        <div className="space-y-2">
                          <div className="h-4 w-28 bg-gray-200 rounded" />
                          <div className="h-3 w-20 bg-gray-100 rounded" />
                        </div>
                      </div>
                      <div className="h-8 w-12 bg-gray-100 rounded-xl" />
                    </div>
                    <div className="h-8 w-full bg-amber-50/60 rounded-xl my-3" />
                    <div className="h-10 w-full bg-gray-100 rounded-xl mt-auto" />
                  </div>
                ))}
              </div>
            ) : viewMode === "map" ? (
              filteredDonors.length > 0 ? (
                <DonorMap
                  donors={filteredDonors}
                  selectedDonor={selectedDonor}
                  onSelectDonor={(donor) => setSelectedDonor(donor)}
                  onViewProfile={handleViewProfile}
                  onContactWhatsApp={handleContactWhatsApp}
                  activeCity={activeCityLabel}
                />
              ) : (
                /* Empty state matching styling */
                <div className="w-full bg-white rounded-2xl border border-gray-100 p-8 sm:p-12 text-center shadow-xs">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-red-700 mx-auto mb-4">
                    <MapIcon className="w-8 h-8" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-1.5">
                    No donor locations to display
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-500 max-w-md mx-auto mb-6">
                    {donors.length === 0
                      ? "No donors are registered in the database yet."
                      : `No donors match your current filters in ${activeCityLabel}.`}
                  </p>
                  {donors.length > 0 && (
                    <button
                      type="button"
                      onClick={handleClearAll}
                      className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-gray-200 text-gray-700 font-semibold text-xs sm:text-sm hover:bg-gray-50 transition-colors cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Reset filters</span>
                    </button>
                  )}
                </div>
              )
            ) : filteredDonors.length > 0 ? (
              /* 2-column Grid matching Image 2 */
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
                {filteredDonors.map((donor) => (
                  <DonorCard
                    key={donor.id}
                    donor={donor}
                    onViewProfile={handleViewProfile}
                    onContactWhatsApp={handleContactWhatsApp}
                  />
                ))}
              </div>
            ) : (
              /* Empty Search Results / Graceful DB Empty State */
              <div className="w-full bg-white rounded-2xl border border-gray-100 p-8 sm:p-12 text-center shadow-xs">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-red-700 mx-auto mb-4">
                  <Users className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-1.5">
                  {donors.length === 0
                    ? "No donors registered yet"
                    : "No matching donors found"}
                </h3>
                <p className="text-xs sm:text-sm text-gray-500 max-w-md mx-auto mb-6 leading-relaxed">
                  {donors.length === 0
                    ? "Be the first lifesaver to register in your area! Complete your profile setup to appear in donor searches."
                    : `No donors match blood group ${
                        filters.bloodGroup !== "All groups" ? filters.bloodGroup : ""
                      } in ${activeCityLabel} with your current filters.`}
                </p>

                <div className="flex flex-wrap items-center justify-center gap-3">
                  {donors.length > 0 && (
                    <button
                      type="button"
                      onClick={handleClearAll}
                      className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-gray-200 text-gray-700 font-semibold text-xs sm:text-sm hover:bg-gray-50 transition-colors cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Reset filters</span>
                    </button>
                  )}
                  <Link
                    href="/profile-setup"
                    className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-red-700 hover:bg-red-800 text-white font-semibold text-xs sm:text-sm shadow-xs transition-colors cursor-pointer"
                  >
                    <HeartHandshake className="w-4 h-4" />
                    <span>Become a donor</span>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Slide-over Profile Sheet */}
      <DonorProfileSheet
        donor={selectedDonor}
        isOpen={isSheetOpen}
        onClose={() => setIsSheetOpen(false)}
        onContactWhatsApp={handleContactWhatsApp}
      />
    </div>
  );
}

export default DonorDirectory;
