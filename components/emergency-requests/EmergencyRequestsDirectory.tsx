"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  AlertCircle,
  Clock,
  Droplets,
  MapPin,
  MessageCircle,
  Search,
  ShieldCheck,
  ChevronDown,
  ArrowRight,
} from "lucide-react";

export interface EmergencyRequestItem {
  id: string;
  code: string;
  urgency: "immediate" | "within_12_hours" | "within_24_hours";
  urgencyLabel: string;
  bloodGroup: string;
  hospital: string;
  city: string;
  unitsNeeded: number;
  requiredBy: string;
}

const INITIAL_REQUESTS: EmergencyRequestItem[] = [
  {
    id: "1",
    code: "BR-1048",
    urgency: "immediate",
    urgencyLabel: "IMMEDIATE",
    bloodGroup: "O-",
    hospital: "Civil Hospital Ahmedabad",
    city: "Ahmedabad",
    unitsNeeded: 2,
    requiredBy: "Today, 6:00 PM",
  },
  {
    id: "2",
    code: "BR-1047",
    urgency: "within_12_hours",
    urgencyLabel: "WITHIN 12 HOURS",
    bloodGroup: "B+",
    hospital: "Zydus Hospital",
    city: "Ahmedabad",
    unitsNeeded: 1,
    requiredBy: "Today, 10:30 PM",
  },
  {
    id: "3",
    code: "BR-1042",
    urgency: "within_24_hours",
    urgencyLabel: "WITHIN 24 HOURS",
    bloodGroup: "A+",
    hospital: "Apollo Hospital",
    city: "Gandhinagar",
    unitsNeeded: 3,
    requiredBy: "Tomorrow, 11:00 AM",
  },
  {
    id: "4",
    code: "BR-1039",
    urgency: "immediate",
    urgencyLabel: "IMMEDIATE",
    bloodGroup: "AB+",
    hospital: "Sterling Hospital",
    city: "Vadodara",
    unitsNeeded: 2,
    requiredBy: "Today, 8:00 PM",
  },
  {
    id: "5",
    code: "BR-1035",
    urgency: "within_12_hours",
    urgencyLabel: "WITHIN 12 HOURS",
    bloodGroup: "O+",
    hospital: "SVP Hospital",
    city: "Ahmedabad",
    unitsNeeded: 4,
    requiredBy: "Tomorrow, 9:00 AM",
  },
  {
    id: "6",
    code: "BR-1031",
    urgency: "within_24_hours",
    urgencyLabel: "WITHIN 24 HOURS",
    bloodGroup: "B-",
    hospital: "Kiran Hospital",
    city: "Surat",
    unitsNeeded: 1,
    requiredBy: "Tomorrow, 2:00 PM",
  },
];

interface EmergencyRequestsDirectoryProps {
  customRequests?: EmergencyRequestItem[];
  onSelectRequest?: (request: EmergencyRequestItem) => void;
}

export function EmergencyRequestsDirectory({
  customRequests = [],
  onSelectRequest,
}: EmergencyRequestsDirectoryProps) {
  const [requests] = useState<EmergencyRequestItem[]>([
    ...customRequests,
    ...INITIAL_REQUESTS,
  ]);
  const [bloodGroup, setBloodGroup] = useState<string>("all");
  const [city, setCity] = useState<string>("Ahmedabad");
  const [urgency, setUrgency] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("urgent");
  const [sortOpen, setSortOpen] = useState<boolean>(false);

  // Active filter state after clicking Search
  const [appliedFilters, setAppliedFilters] = useState({
    bloodGroup: "all",
    city: "",
    urgency: "all",
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setAppliedFilters({
      bloodGroup,
      city: city.trim().toLowerCase(),
      urgency,
    });
  };

  const filteredRequests = useMemo(() => {
    return requests.filter((req) => {
      if (
        appliedFilters.bloodGroup !== "all" &&
        req.bloodGroup.toLowerCase() !== appliedFilters.bloodGroup.toLowerCase()
      ) {
        return false;
      }
      if (
        appliedFilters.urgency !== "all" &&
        req.urgency !== appliedFilters.urgency
      ) {
        return false;
      }
      if (appliedFilters.city) {
        const matchesCity = req.city
          .toLowerCase()
          .includes(appliedFilters.city);
        const matchesHospital = req.hospital
          .toLowerCase()
          .includes(appliedFilters.city);
        if (!matchesCity && !matchesHospital) {
          return false;
        }
      }
      return true;
    });
  }, [requests, appliedFilters]);

  const getUrgencyBadge = (
    urgencyType: EmergencyRequestItem["urgency"],
    label: string,
  ) => {
    switch (urgencyType) {
      case "immediate":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-red-50 text-red-700 px-2.5 py-0.5 sm:px-3 sm:py-1 text-xs font-bold tracking-wider uppercase">
            <AlertCircle className="h-3.5 w-3.5 shrink-0 text-red-700" />
            <span>{label}</span>
          </span>
        );
      case "within_12_hours":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 text-amber-700 px-2.5 py-0.5 sm:px-3 sm:py-1 text-xs font-bold tracking-wider uppercase">
            <Clock className="h-3.5 w-3.5 shrink-0 text-amber-700" />
            <span>{label}</span>
          </span>
        );
      case "within_24_hours":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100/70 text-amber-800 px-2.5 py-0.5 sm:px-3 sm:py-1 text-xs font-bold tracking-wider uppercase">
            <Clock className="h-3.5 w-3.5 shrink-0 text-amber-800" />
            <span>{label}</span>
          </span>
        );
    }
  };

  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
        {/* Left Column: Filter Bar + Request Cards */}
        <div className="lg:col-span-8 xl:col-span-9 space-y-6">
          {/* Top Search & Filter Bar Card */}
          <form
            onSubmit={handleSearch}
            className="bg-white rounded-2xl sm:rounded-3xl border border-gray-200/90 p-4 sm:p-5 lg:p-6 shadow-2xs"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-12 gap-3.5 sm:gap-4 items-end">
              {/* 1. Blood group */}
              <div className="md:col-span-3">
                <label className="block text-xs font-medium text-gray-500 mb-1.5">
                  Blood group
                </label>
                <div className="relative">
                  <select
                    value={bloodGroup}
                    onChange={(e) => setBloodGroup(e.target.value)}
                    className="w-full h-11 px-3.5 text-sm text-gray-800 font-medium bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-red-700 focus:ring-1 focus:ring-red-700 transition-colors appearance-none cursor-pointer"
                  >
                    <option value="all">All groups</option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                  </select>
                  <ChevronDown className="absolute right-3.5 top-3.5 h-4 w-4 text-gray-400 pointer-events-none" />
                </div>
              </div>

              {/* 2. City */}
              <div className="md:col-span-4">
                <label className="block text-xs font-medium text-gray-500 mb-1.5">
                  City
                </label>
                <input
                  type="text"
                  placeholder="e.g. Ahmedabad"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full h-11 px-3.5 text-sm text-gray-800 font-medium bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-red-700 focus:ring-1 focus:ring-red-700 transition-colors"
                />
              </div>

              {/* 3. Urgency */}
              <div className="md:col-span-3">
                <label className="block text-xs font-medium text-gray-500 mb-1.5">
                  Urgency
                </label>
                <div className="relative">
                  <select
                    value={urgency}
                    onChange={(e) => setUrgency(e.target.value)}
                    className="w-full h-11 px-3.5 text-sm text-gray-800 font-medium bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-red-700 focus:ring-1 focus:ring-red-700 transition-colors appearance-none cursor-pointer"
                  >
                    <option value="all">All urgency levels</option>
                    <option value="immediate">Immediate</option>
                    <option value="within_12_hours">Within 12 hours</option>
                    <option value="within_24_hours">Within 24 hours</option>
                  </select>
                  <ChevronDown className="absolute right-3.5 top-3.5 h-4 w-4 text-gray-400 pointer-events-none" />
                </div>
              </div>

              {/* 4. Search Button */}
              <div className="md:col-span-2">
                <button
                  type="submit"
                  className="w-full h-11 inline-flex items-center justify-center gap-2 px-5 bg-red-700 hover:bg-red-800 text-white text-sm font-semibold rounded-xl shadow-xs active:scale-95 transition-all duration-150 cursor-pointer select-none"
                >
                  <Search className="w-4 h-4 shrink-0" />
                  <span>Search</span>
                </button>
              </div>
            </div>
          </form>

          {/* Active Requests Counter & Sort Header */}
          <div className="flex items-center justify-between pt-1">
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 tracking-tight leading-tight">
                {filteredRequests.length} active requests
              </h2>
              <p className="text-xs text-gray-400 font-normal mt-0.5">
                Updated just now
              </p>
            </div>

            {/* Sort Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setSortOpen(!sortOpen)}
                className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-gray-800 hover:text-gray-900 cursor-pointer"
              >
                <span>
                  {sortBy === "urgent"
                    ? "Most urgent first"
                    : sortBy === "newest"
                      ? "Newest first"
                      : "Nearest first"}
                </span>
                <ChevronDown className="w-4 h-4 text-gray-600" />
              </button>

              {sortOpen && (
                <div className="absolute right-0 mt-2 w-44 bg-white border border-gray-100 rounded-xl shadow-lg py-1.5 z-20">
                  <button
                    type="button"
                    onClick={() => {
                      setSortBy("urgent");
                      setSortOpen(false);
                    }}
                    className={`w-full text-left px-3.5 py-1.5 text-xs font-medium ${
                      sortBy === "urgent"
                        ? "text-red-700 bg-red-50/50 font-semibold"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    Most urgent first
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setSortBy("newest");
                      setSortOpen(false);
                    }}
                    className={`w-full text-left px-3.5 py-1.5 text-xs font-medium ${
                      sortBy === "newest"
                        ? "text-red-700 bg-red-50/50 font-semibold"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    Newest first
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setSortBy("nearest");
                      setSortOpen(false);
                    }}
                    className={`w-full text-left px-3.5 py-1.5 text-xs font-medium ${
                      sortBy === "nearest"
                        ? "text-red-700 bg-red-50/50 font-semibold"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    Nearest first
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* List of Emergency Request Cards */}
          <div className="space-y-4">
            {filteredRequests.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-2xl sm:rounded-3xl border border-dashed border-gray-200">
                <div className="w-12 h-12 rounded-full bg-red-50 text-red-700 flex items-center justify-center mx-auto mb-3">
                  <Droplets className="w-6 h-6" />
                </div>
                <h3 className="text-base font-semibold text-gray-900">
                  No matching emergency requests
                </h3>
                <p className="text-sm text-gray-500 mt-1 max-w-sm mx-auto">
                  Try clearing your filters or changing the city.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setBloodGroup("all");
                    setCity("");
                    setUrgency("all");
                    setAppliedFilters({
                      bloodGroup: "all",
                      city: "",
                      urgency: "all",
                    });
                  }}
                  className="mt-4 px-4 py-2 text-xs font-semibold text-red-700 bg-red-50 hover:bg-red-100 rounded-xl transition-colors cursor-pointer"
                >
                  Clear all filters
                </button>
              </div>
            ) : (
              filteredRequests.map((request) => (
                <div
                  key={request.id}
                  className="rounded-2xl sm:rounded-3xl border border-gray-200/90 bg-white p-4 sm:p-5 lg:p-6 shadow-2xs hover:shadow-xs transition-all duration-150"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 lg:gap-6">
                    {/* Left: Urgency Badge + Code */}
                    <div className="shrink-0 w-32 md:w-36">
                      {getUrgencyBadge(request.urgency, request.urgencyLabel)}
                      <span className="text-xs font-semibold text-gray-400 mt-2 block tracking-wide">
                        {request.code}
                      </span>
                    </div>

                    {/* Blood Group Badge */}
                    <div className="shrink-0">
                      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-xl font-bold text-red-700">
                        {request.bloodGroup}
                      </div>
                    </div>

                    {/* Hospital & Location */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base font-bold text-gray-900 leading-snug truncate">
                        {request.hospital}
                      </h3>
                      <div className="flex items-center gap-1 text-xs text-gray-400 font-medium mt-1">
                        <MapPin className="h-3.5 w-3.5 shrink-0" />
                        <span>{request.city}</span>
                      </div>
                    </div>

                    {/* Units Needed */}
                    <div className="shrink-0 flex items-center gap-2.5">
                      <Droplets className="h-4 w-4 text-gray-400 shrink-0" />
                      <div>
                        <span className="text-xs text-gray-400 font-normal block leading-tight">
                          Units needed
                        </span>
                        <span className="text-xs sm:text-sm font-bold text-gray-900 block leading-tight mt-0.5">
                          {request.unitsNeeded} units
                        </span>
                      </div>
                    </div>

                    {/* Required By */}
                    <div className="shrink-0 flex items-center gap-2.5">
                      <Clock className="h-4 w-4 text-gray-400 shrink-0" />
                      <div>
                        <span className="text-xs text-gray-400 font-normal block leading-tight">
                          Required by
                        </span>
                        <span className="text-xs sm:text-sm font-bold text-gray-900 block leading-tight mt-0.5">
                          {request.requiredBy}
                        </span>
                      </div>
                    </div>

                    {/* Right Action Buttons */}
                    <div className="shrink-0 flex items-center gap-2.5 pt-2 md:pt-0 border-t md:border-t-0 border-gray-100">
                      <button
                        type="button"
                        onClick={() => onSelectRequest?.(request)}
                        className="inline-flex items-center justify-center px-5 py-2.5 sm:py-3 rounded-xl bg-red-700 text-xs sm:text-sm font-semibold text-white shadow-xs hover:bg-red-800 active:scale-95 transition-all cursor-pointer whitespace-nowrap"
                      >
                        View details
                      </button>

                      <Link
                        href={`https://wa.me/?text=${encodeURIComponent(
                          `Urgent: ${request.unitsNeeded} units of ${request.bloodGroup} needed at ${request.hospital}, ${request.city}. Ref: ${request.code}`,
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50 active:scale-95 transition-colors"
                        aria-label={`Share request ${request.code} on WhatsApp`}
                      >
                        <MessageCircle className="h-5 w-5" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Column: "Before you respond" Card */}
        <div className="lg:col-span-4 xl:col-span-3">
          <div className="bg-white rounded-2xl sm:rounded-3xl border border-gray-200/90 p-6 lg:p-7 shadow-xs sticky top-28">
            {/* Green Shield Check Icon */}
            <div className="mb-4">
              <span className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100/70">
                <ShieldCheck className="w-6 h-6 text-emerald-600" />
              </span>
            </div>

            {/* Title */}
            <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-4 tracking-tight">
              Before you respond
            </h3>

            {/* 3 Guidance Points from Reference Image */}
            <ul className="space-y-3 text-xs sm:text-sm text-gray-600 leading-relaxed mb-5">
              <li className="flex items-start">
                <span>Confirm the request with the hospital.</span>
              </li>
              <li className="flex items-start">
                <span>Never pay money to donate blood.</span>
              </li>
              <li className="flex items-start">
                <span>Protect personal details until needed.</span>
              </li>
            </ul>

            {/* Safety Guidance Red Link */}
            <Link
              href="/about#safety"
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-red-700 hover:text-red-800 hover:underline transition-colors group"
            >
              <span>Read safety guidance</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export default EmergencyRequestsDirectory;
