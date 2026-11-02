"use client";

import React from "react";
import {
  X,
  MapPin,
  CheckCircle2,
  Lock,
  Phone,
  MessageCircle,
  ShieldCheck,
  Droplets,
  Calendar,
  Sparkles,
} from "lucide-react";
import type { DonorItem } from "./DonorCard";

interface DonorProfileSheetProps {
  donor: DonorItem | null;
  isOpen: boolean;
  onClose: () => void;
  onContactWhatsApp: (donor: DonorItem) => void;
}

export function DonorProfileSheet({
  donor,
  isOpen,
  onClose,
  onContactWhatsApp,
}: DonorProfileSheetProps) {
  if (!isOpen || !donor) return null;

  const cleanPhone = donor.phone ? donor.phone.replace(/[^0-9]/g, "") : "";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-100 bg-gray-50/50">
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-red-50 text-red-700">
              <Droplets className="w-4 h-4" fill="currentColor" />
            </span>
            <h3 className="font-bold text-gray-900 text-base">Donor Profile</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {/* Avatar + Name + Blood Group */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3.5">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-100 text-red-800 font-bold text-lg">
                {donor.initials}
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h4 className="font-bold text-gray-900 text-lg">
                    {donor.name}
                  </h4>
                  <CheckCircle2 className="w-4 h-4 text-blue-600 fill-blue-50" />
                </div>
                <p className="flex items-center gap-1 text-xs text-gray-500 mt-0.5">
                  <MapPin className="w-3.5 h-3.5 text-gray-400" />
                  {donor.locality ? `${donor.locality}, ` : ""}
                  {donor.city}
                </p>
              </div>
            </div>

            <span className="rounded-xl bg-red-50 border border-red-100 px-4 py-1.5 text-lg font-bold text-red-700">
              {donor.bloodGroup}
            </span>
          </div>

          {/* Smart Match info */}
          <div className="rounded-2xl bg-amber-50 border border-amber-100 p-3.5 flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-xs text-amber-900">
                Verified Opt-in Donor
              </p>
              <p className="text-xs text-amber-800/80 mt-0.5 leading-relaxed">
                {donor.name} has opted in to receive emergency blood requests for{" "}
                {donor.bloodGroup} blood in {donor.city}.
              </p>
            </div>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="rounded-xl border border-gray-100 bg-gray-50/50 p-3">
              <span className="text-gray-400 block mb-0.5">Status</span>
              <span className="font-semibold text-emerald-700 flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                {donor.status}
              </span>
            </div>
            <div className="rounded-xl border border-gray-100 bg-gray-50/50 p-3">
              <span className="text-gray-400 block mb-0.5">Distance</span>
              <span className="font-semibold text-gray-800">
                {donor.distance} approx.
              </span>
            </div>
          </div>

          {/* Privacy Note */}
          <div className="flex items-center gap-2 rounded-xl bg-gray-50 border border-gray-100 p-3 text-xs text-gray-500">
            <Lock className="w-4 h-4 text-gray-400 shrink-0" />
            <span>
              Direct contact details are shared safely via verified WhatsApp message.
            </span>
          </div>

          {/* Action Button */}
          <div className="pt-2">
            <button
              type="button"
              onClick={() => {
                onContactWhatsApp(donor);
                onClose();
              }}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-green-600 hover:bg-green-700 text-white font-semibold text-sm py-3 px-4 shadow-sm transition-colors cursor-pointer"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Contact {donor.name} on WhatsApp</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DonorProfileSheet;

