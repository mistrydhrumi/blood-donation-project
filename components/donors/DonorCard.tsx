"use client";

import React from "react";
import {
  MapPin,
  CheckCircle2,
  Navigation,
  Activity,
  Lock,
  Sparkles,
  MessageCircle,
} from "lucide-react";

export interface DonorItem {
  id: string;
  name: string;
  initials: string;
  bloodGroup: string;
  locality: string;
  city: string;
  distance: string;
  status: "Available" | "Unavailable" | "Cooldown";
  confirmedAgo: string;
  smartMatchTag: string;
  phone?: string | null;
  email?: string | null;
  age?: number | null;
  gender?: string | null;
}

interface DonorCardProps {
  donor: DonorItem;
  onViewProfile: (donor: DonorItem) => void;
  onContactWhatsApp: (donor: DonorItem) => void;
}

export function DonorCard({
  donor,
  onViewProfile,
  onContactWhatsApp,
}: DonorCardProps) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100/90 shadow-2xs p-5 sm:p-6 transition-all duration-150 hover:border-gray-200 hover:shadow-xs flex flex-col justify-between">
      <div>
        {/* Top Header: Avatar + Name + Blood Group */}
        <div className="flex items-start justify-between gap-3 mb-3.5">
          {/* Avatar and Name/Location */}
          <div className="flex items-center gap-3">
            {/* Peach / Pink Avatar circle with burgundy initials */}
            <div className="flex h-11 w-11 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-full bg-red-100 text-red-800 font-bold text-sm tracking-wide">
              {donor.initials}
            </div>

            <div>
              {/* Name + Blue Verified checkmark */}
              <div className="flex items-center gap-1.5">
                <h3 className="font-bold text-gray-900 text-base leading-tight">
                  {donor.name}
                </h3>
                <CheckCircle2
                  className="w-4 h-4 text-blue-600 fill-blue-50 shrink-0"
                  aria-label="Verified Donor"
                />
              </div>

              {/* Locality & City */}
              <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                <span className="truncate">
                  {donor.locality ? `${donor.locality}, ` : ""}
                  {donor.city}
                </span>
              </div>
            </div>
          </div>

          {/* Blood Group Badge: light peach pill with red text */}
          <span className="shrink-0 rounded-xl bg-red-50 border border-red-100 px-3.5 py-1 text-sm sm:text-base font-bold text-red-700">
            {donor.bloodGroup}
          </span>
        </div>

        {/* Smart Match Banner */}
        <div className="flex items-center gap-1.5 rounded-xl bg-amber-50 border border-amber-100 px-3 py-1.5 my-3.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-600 shrink-0" />
          <span className="font-bold text-xs text-amber-900">Smart Match</span>
          <span className="text-xs text-amber-800/80 font-medium">
            {donor.smartMatchTag}
          </span>
        </div>

        {/* Stats Row: Approx distance & Availability */}
        <div className="grid grid-cols-2 gap-4 py-2">
          {/* Distance */}
          <div className="flex items-start gap-2.5">
            <Navigation className="w-4 h-4 text-red-600 shrink-0 mt-0.5 rotate-45" />
            <div>
              <p className="font-bold text-sm text-gray-900 leading-tight">
                {donor.distance}
              </p>
              <p className="text-[11px] text-gray-400 mt-0.5">Approx. distance</p>
            </div>
          </div>

          {/* Availability */}
          <div className="flex items-start gap-2.5">
            <Activity className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-sm text-gray-900 leading-tight">
                {donor.status}
              </p>
              <p className="text-[11px] text-gray-400 mt-0.5">
                {donor.confirmedAgo}
              </p>
            </div>
          </div>
        </div>

        {/* Privacy Notice Pill */}
        <div className="flex items-center gap-1.5 rounded-xl bg-gray-50/80 border border-gray-100 px-3 py-2 text-[11px] text-gray-400 my-4">
          <Lock className="w-3 h-3 text-gray-400 shrink-0" />
          <span>Exact location and phone number stay private.</span>
        </div>
      </div>

      {/* Actions Row: Green WhatsApp button + View profile */}
      <div className="flex items-center gap-3 pt-1">
        <button
          type="button"
          onClick={() => onContactWhatsApp(donor)}
          className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-green-600 hover:bg-green-700 text-white font-semibold text-xs sm:text-sm py-2.5 px-4 shadow-xs transition-colors cursor-pointer"
        >
          <MessageCircle className="w-4 h-4" />
          <span>Contact on WhatsApp</span>
        </button>

        <button
          type="button"
          onClick={() => onViewProfile(donor)}
          className="shrink-0 text-xs sm:text-sm font-semibold text-gray-700 hover:text-gray-900 px-3 py-2.5 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer"
        >
          View profile
        </button>
      </div>
    </div>
  );
}

export default DonorCard;

