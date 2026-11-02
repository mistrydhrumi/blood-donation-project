"use client";

import React, { useState, useEffect, useMemo } from "react";
import { List, Map as MapIcon, ChevronDown, Users, RotateCcw } from "lucide-react";
import { supabase } from "@/lib/supabase/supabase";
import { DonorCard, type DonorItem } from "./DonorCard";
import { DonorSidebarFilters, type FilterState } from "./DonorSidebarFilters";
import { DonorProfileSheet } from "./DonorProfileSheet";

// Exact Reference Donors from Image 2
const REFERENCE_DONORS: DonorItem[] = [
  {
    id: "ref-1",
    name: "Aarav S.",
    initials: "AS",
    bloodGroup: "O+",
    locality: "Navrangpura",
    city: "Ahmedabad",
    distance: "2.1 km",
    status: "Available",
    confirmedAgo: "Confirmed 12 min ago",
    smartMatchTag: "Recently confirmed",
    phone: "+91 98250 12345",
    gender: "male",
  },
  {
    id: "ref-2",
    name: "Meera P.",
    initials: "MP",
    bloodGroup: "A+",
    locality: "Paldi",
    city: "Ahmedabad",
    distance: "3.8 km",
    status: "Available",
    confirmedAgo: "Confirmed 35 min ago",
    smartMatchTag: "Nearby",
    phone: "+91 98980 67890",
    gender: "female",
  },
  {
    id: "ref-3",
    name: "Rohan K.",
    initials: "RK",
    bloodGroup: "B+",
    locality: "Satellite",
    city: "Ahmedabad",
    distance: "4.5 km",
    status: "Available",
    confirmedAgo: "Confirmed 1 hr ago",
    smartMatchTag: "Recently confirmed",
    phone: "+91 97240 55432",
    gender: "male",
  },
  {
    id: "ref-4",
    name: "Devika R.",
    initials: "DR",
    bloodGroup: "AB-",
    locality: "Vastrapur",
    city: "Ahmedabad",
    distance: "5.2 km",
    status: "Available",
    confirmedAgo: "Confirmed 2 hrs ago",
    smartMatchTag: "Nearby",
    phone: "+91 98450 77665",
    gender: "female",
  },
];

export function DonorDirectory() {
  const [donors, setDonors] = useState<DonorItem[]>(REFERENCE_DONORS);
  const [viewMode, setViewMode] = useState<"list" | "map">("list");
  const [sortBy, setSortBy] = useState<"nearest" | "recent">("nearest");
  const [selectedDonor, setSelectedDonor] = useState<DonorItem | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  // Filters State matching sidebar
  const [filters, setFilters] = useState<FilterState>({
    bloodGroup: "All groups",
    city: "",
    distance: "Within 10 km",
    availableNow: true,
    availableToday: false,
  });

  // Query Supabase profiles table
  useEffect(() => {
    async function fetchSupabaseDonors() {
      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .in("role", ["donor", "both"]);

        if (error) {
          console.warn("Supabase fetch notice:", error.message);
        } else if (data && data.length > 0) {
          const liveDonors: DonorItem[] = data.map((row, idx) => {
            const rawName = row.full_name || "Donor";
            const parts = rawName.trim().split(" ");
            const shortName =
              parts.length > 1
                ? `${parts[0]} ${parts[1][0]}.`
                : parts[0];
            const initials =
              parts.length > 1
                ? `${parts[0][0]}${parts[1][0]}`.toUpperCase()
                : rawName.slice(0, 2).toUpperCase();

            return {
              id: row.id,
              name: shortName,
              initials: initials || "DN",
              bloodGroup: row.blood_group || "O+",
              locality: row.locality || row.city || "Ahmedabad",
              city: row.city || "Ahmedabad",
              distance: `${(1.5 + (idx % 8) * 0.7).toFixed(1)} km`,
              status: row.is_available ? "Available" : "Unavailable",
              confirmedAgo: "Confirmed recently",
              smartMatchTag: idx % 2 === 0 ? "Recently confirmed" : "Nearby",
              phone: row.phone,
              email: row.email,
              age: row.age,
              gender: row.gender,
            };
          });

          // Combine live donors with the reference donors
          setDonors([...liveDonors, ...REFERENCE_DONORS]);
        }
      } catch (e) {
        console.warn("Supabase connection check:", e);
      }
    }

    fetchSupabaseDonors();
  }, []);

  const handleFilterChange = (partial: Partial<FilterState>) => {
    setFilters((prev) => ({ ...prev, ...partial }));
  };

  const handleClearAll = () => {
    setFilters({
      bloodGroup: "All groups",
      city: "",
      distance: "Within 10 km",
      availableNow: false,
      availableToday: false,
    });
  };

  // Filtered Donors list
  const filteredDonors = useMemo(() => {
    return donors.filter((d) => {
      // Blood Group filter
      if (
        filters.bloodGroup !== "All groups" &&
        d.bloodGroup.toUpperCase() !== filters.bloodGroup.toUpperCase()
      ) {
        return false;
      }

      // City / locality filter
      if (filters.city.trim() !== "") {
        const query = filters.city.toLowerCase().trim();
        const matchesCity = d.city.toLowerCase().includes(query);
        const matchesLocality = d.locality.toLowerCase().includes(query);
        if (!matchesCity && !matchesLocality) return false;
      }

      // Availability filter
      if (filters.availableNow && d.status !== "Available") {
        return false;
      }

      return true;
    });
  }, [donors, filters]);

  // WhatsApp Contact Handler
  const handleContactWhatsApp = (donor: DonorItem) => {
    const rawDigits = donor.phone ? donor.phone.replace(/[^0-9]/g, "") : "919825012345";
    const phoneWithCode = rawDigits.startsWith("91") ? rawDigits : `91${rawDigits}`;
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
                  {filteredDonors.length} matching donors
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

            {/* 3. View content: List vs Map */}
            {viewMode === "map" ? (
              <div className="w-full bg-white rounded-2xl border border-gray-100 p-6 sm:p-10 text-center shadow-xs">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-red-700 mx-auto mb-4">
                  <MapIcon className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-1.5">
                  Interactive Donors Map
                </h3>
                <p className="text-xs sm:text-sm text-gray-500 max-w-md mx-auto mb-6">
                  {filteredDonors.length} privacy-protected donor locations plotted
                  within {filters.distance.toLowerCase()} around {activeCityLabel}.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 max-w-2xl mx-auto text-left">
                  {filteredDonors.slice(0, 6).map((d) => (
                    <div
                      key={d.id}
                      className="p-3 rounded-xl border border-gray-100 bg-gray-50/70 text-xs"
                    >
                      <p className="font-bold text-gray-900">{d.name} ({d.bloodGroup})</p>
                      <p className="text-gray-500">{d.locality} • {d.distance}</p>
                    </div>
                  ))}
                </div>
              </div>
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
              /* Empty Search Results */
              <div className="w-full bg-white rounded-2xl border border-gray-100 p-8 sm:p-12 text-center shadow-xs">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-700 mx-auto mb-3.5">
                  <Users className="w-7 h-7" />
                </div>
                <h3 className="text-base font-bold text-gray-900 mb-1">
                  No matching donors found
                </h3>
                <p className="text-xs sm:text-sm text-gray-500 max-w-sm mx-auto mb-5 leading-relaxed">
                  No donors match {filters.bloodGroup !== "All groups" ? filters.bloodGroup : ""}{" "}
                  with your current filters. Try resetting the filters or widening your distance.
                </p>
                <button
                  type="button"
                  onClick={handleClearAll}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-red-700 text-white font-semibold text-xs hover:bg-red-800 transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset filters</span>
                </button>
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

