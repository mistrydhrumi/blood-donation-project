"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  Droplets,
  MapPin,
  ChevronDown,
  ArrowRight,
  Check,
} from "lucide-react";

export interface QuickDonorSearchProps {
  onSearch?: (bloodGroup: string, city: string) => void;
}

const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
const CITIES = [
  "Ahmedabad",
  "Surat",
  "Vadodara",
  "Rajkot",
  "Mumbai",
  "Delhi",
  "Bengaluru",
  "Pune",
  "Hyderabad",
  "Chennai",
  "Kolkata",
];

export function QuickDonorSearch({ onSearch }: QuickDonorSearchProps) {
  const [selectedBloodGroup, setSelectedBloodGroup] = useState("O+");
  const [selectedCity, setSelectedCity] = useState("Ahmedabad");
  const [bloodGroupOpen, setBloodGroupOpen] = useState(false);
  const [cityOpen, setCityOpen] = useState(false);
  const [citySearchQuery, setCitySearchQuery] = useState("");

  const bloodGroupRef = useRef<HTMLDivElement>(null);
  const cityRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        bloodGroupRef.current &&
        !bloodGroupRef.current.contains(event.target as Node)
      ) {
        setBloodGroupOpen(false);
      }
      if (
        cityRef.current &&
        !cityRef.current.contains(event.target as Node)
      ) {
        setCityOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const router = useRouter();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(selectedBloodGroup, selectedCity);
    } else {
      router.push(
        `/signup?intent=search&bloodGroup=${encodeURIComponent(
          selectedBloodGroup
        )}&city=${encodeURIComponent(selectedCity)}`
      );
    }
  };

  const filteredCities = CITIES.filter((city) =>
    city.toLowerCase().includes(citySearchQuery.toLowerCase())
  );

  return (
    <div className="relative z-30 flex justify-center px-4 sm:px-6 lg:px-8 -mt-2 sm:-mt-4 mb-16 sm:mb-20">
      <div className="bg-white rounded-2xl sm:rounded-3xl border border-gray-100 shadow-xl shadow-slate-100/90 p-4 sm:p-5 lg:p-6 transition-shadow hover:shadow-2xl hover:shadow-slate-200/80 w-full max-w-7xl">
        <form
          onSubmit={handleSearchSubmit}
          className="flex flex-col lg:flex-row lg:items-center gap-4 lg:gap-6"
        >
          {/* 1. Header / Icon Block */}
          <div className="flex items-center gap-3.5 lg:min-w-52 shrink-0">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 text-red-700 shrink-0">
              <Search className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-gray-900 tracking-tight">
                Quick donor search
              </h3>
              <p className="text-xs text-gray-400 font-normal">
                Start with the essentials
              </p>
            </div>
          </div>

          {/* 2. Selectors Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4 flex-1">
            {/* Blood Group Selector */}
            <div className="relative" ref={bloodGroupRef}>
              <label className="block text-xs font-semibold text-gray-400 tracking-wider mb-1.5 uppercase">
                Blood group
              </label>

              <button
                type="button"
                onClick={() => {
                  setBloodGroupOpen((prev) => !prev);
                  setCityOpen(false);
                }}
                className="flex h-12 w-full items-center justify-between rounded-xl border border-gray-200 bg-white px-3.5 text-sm font-semibold text-gray-900 shadow-2xs transition-all hover:border-gray-300 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 outline-none cursor-pointer"
                aria-haspopup="listbox"
                aria-expanded={bloodGroupOpen}
              >
                <div className="flex items-center gap-2">
                  <Droplets className="h-4 w-4 text-red-500 fill-red-500/20" />
                  <span className="text-base font-bold text-gray-900">
                    {selectedBloodGroup}
                  </span>
                </div>
                <ChevronDown
                  className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${bloodGroupOpen ? "rotate-180 text-gray-600" : ""
                    }`}
                />
              </button>

              {/* Blood Group Dropdown */}
              {bloodGroupOpen && (
                <div className="absolute left-0 top-full mt-1.5 w-full rounded-xl border border-gray-100 bg-white p-1.5 shadow-xl z-50 grid grid-cols-4 gap-1 animate-in fade-in slide-in-from-top-1 duration-150">
                  {BLOOD_GROUPS.map((group) => {
                    const isSelected = selectedBloodGroup === group;
                    return (
                      <button
                        key={group}
                        type="button"
                        onClick={() => {
                          setSelectedBloodGroup(group);
                          setBloodGroupOpen(false);
                        }}
                        className={`flex h-10 items-center justify-center rounded-lg text-sm font-bold transition-colors cursor-pointer ${isSelected
                          ? "bg-red-700 text-white shadow-xs"
                          : "text-gray-700 hover:bg-red-50 hover:text-red-800"
                          }`}
                      >
                        {group}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* City Selector */}
            <div className="relative" ref={cityRef}>
              <label className="block text-xs font-semibold text-gray-400 tracking-wider mb-1.5 uppercase">
                City
              </label>

              <button
                type="button"
                onClick={() => {
                  setCityOpen((prev) => !prev);
                  setBloodGroupOpen(false);
                }}
                className="flex h-12 w-full items-center justify-between rounded-xl border border-gray-200 bg-white px-3.5 text-sm font-semibold text-gray-900 shadow-2xs transition-all hover:border-gray-300 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 outline-none cursor-pointer"
                aria-haspopup="listbox"
                aria-expanded={cityOpen}
              >
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-gray-400" />
                  <span className="text-sm font-medium text-gray-800">
                    {selectedCity}
                  </span>
                </div>
                <ChevronDown
                  className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${cityOpen ? "rotate-180 text-gray-600" : ""
                    }`}
                />
              </button>

              {/* City Dropdown with Search */}
              {cityOpen && (
                <div className="absolute left-0 top-full mt-1.5 w-full rounded-xl border border-gray-100 bg-white p-2 shadow-xl z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                  <input
                    type="text"
                    value={citySearchQuery}
                    onChange={(e) => setCitySearchQuery(e.target.value)}
                    placeholder="Search city..."
                    className="w-full h-9 px-3 rounded-lg border border-gray-200 text-xs text-gray-800 placeholder:text-gray-400 outline-none focus:border-red-500 mb-1.5"
                    autoFocus
                  />
                  <div className="max-h-48 overflow-y-auto flex flex-col gap-0.5">
                    {filteredCities.length > 0 ? (
                      filteredCities.map((city) => {
                        const isSelected = selectedCity === city;
                        return (
                          <button
                            key={city}
                            type="button"
                            onClick={() => {
                              setSelectedCity(city);
                              setCityOpen(false);
                              setCitySearchQuery("");
                            }}
                            className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium text-left transition-colors cursor-pointer ${isSelected
                              ? "bg-red-50 text-red-700 font-semibold"
                              : "text-gray-700 hover:bg-gray-50"
                              }`}
                          >
                            <span>{city}</span>
                            {isSelected && (
                              <Check className="h-3.5 w-3.5 text-red-700" />
                            )}
                          </button>
                        );
                      })
                    ) : (
                      <div className="px-3 py-2 text-xs text-gray-400 text-center">
                        No city found
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 3. Search Donors Action Button */}
          <div className="pt-1 sm:pt-0 shrink-0 lg:self-end">
            <button
              type="submit"
              className="flex h-12 w-full lg:w-auto items-center justify-center gap-2 rounded-xl bg-red-700 px-6 text-sm font-semibold text-white shadow-sm transition-all hover:bg-red-800 hover:shadow active:scale-95 cursor-pointer"
            >
              <span>Search donors</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default QuickDonorSearch;
