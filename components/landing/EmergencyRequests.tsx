"use client";

import React from "react";
import Link from "next/link";
import {
  AlertCircle,
  Clock,
  Droplets,
  MapPin,
  MessageCircle,
  ArrowRight,
} from "lucide-react";

export interface EmergencyRequest {
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

const EMERGENCY_REQUESTS: EmergencyRequest[] = [
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
];

export function EmergencyRequests() {
  const getUrgencyBadge = (urgency: EmergencyRequest["urgency"], label: string) => {
    switch (urgency) {
      case "immediate":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-red-50 border border-red-100/90 px-3 py-1 text-[11px] font-bold tracking-wider text-[#C52227] uppercase">
            <AlertCircle className="h-3.5 w-3.5 shrink-0" />
            <span>{label}</span>
          </span>
        );
      case "within_12_hours":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-orange-50 border border-orange-200/70 px-3 py-1 text-[11px] font-bold tracking-wider text-orange-700 uppercase">
            <Clock className="h-3.5 w-3.5 shrink-0" />
            <span>{label}</span>
          </span>
        );
      case "within_24_hours":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 border border-amber-200/70 px-3 py-1 text-[11px] font-bold tracking-wider text-amber-800 uppercase">
            <Clock className="h-3.5 w-3.5 shrink-0" />
            <span>{label}</span>
          </span>
        );
    }
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16 sm:mb-24 w-full">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-6 sm:mb-8">
        <div>
          <span className="text-xs font-bold tracking-[0.16em] uppercase text-[#C52227] block mb-1 sm:mb-1.5">
            HELP NEEDED NOW
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-[34px] font-bold text-gray-900 tracking-tight leading-tight">
            Nearby emergency requests
          </h2>
          <p className="text-sm sm:text-base text-gray-500 font-normal mt-1 sm:mt-1.5">
            Verified requests near Ahmedabad
          </p>
        </div>

        <Link
          href="/signup?intent=view_all_requests"
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#C52227] hover:text-[#A8181D] transition-colors self-start sm:self-end group"
        >
          <span>View all requests</span>
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>

      {/* 3 Request Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
        {EMERGENCY_REQUESTS.map((request) => (
          <div
            key={request.id}
            className="flex flex-col justify-between rounded-2xl sm:rounded-3xl border border-gray-200/90 bg-white p-5 sm:p-6 shadow-xs hover:shadow-md transition-all duration-200"
          >
            <div>
              {/* Top Row: Urgency Badge & Reference Code */}
              <div className="flex items-center justify-between gap-2 mb-5">
                {getUrgencyBadge(request.urgency, request.urgencyLabel)}
                <span className="text-xs font-semibold text-gray-400 tracking-wide">
                  {request.code}
                </span>
              </div>

              {/* Hospital & Blood Group Details */}
              <div className="flex items-center gap-4 mb-5">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-red-50 text-xl font-bold text-[#C52227]">
                  {request.bloodGroup}
                </div>

                <div className="min-w-0 flex-1">
                  <h3 className="text-base font-bold text-gray-900 leading-snug truncate">
                    {request.hospital}
                  </h3>
                  <div className="flex items-center gap-1 text-xs text-gray-400 font-medium mt-1">
                    <MapPin className="h-3.5 w-3.5 shrink-0" />
                    <span>{request.city}</span>
                  </div>
                </div>
              </div>

              {/* Units & Time Details Row */}
              <div className="border-t border-gray-100 pt-4 pb-4 my-2 grid grid-cols-2 gap-3">
                {/* Units Needed */}
                <div className="flex items-center gap-2.5 border-r border-gray-100 pr-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-50 text-gray-400 shrink-0">
                    <Droplets className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="text-[11px] font-normal text-gray-400 block leading-tight">
                      Units needed
                    </span>
                    <span className="text-xs sm:text-sm font-bold text-gray-900 block leading-tight mt-0.5">
                      {request.unitsNeeded} units
                    </span>
                  </div>
                </div>

                {/* Required By */}
                <div className="flex items-center gap-2.5 pl-1 sm:pl-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-50 text-gray-400 shrink-0">
                    <Clock className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="text-[11px] font-normal text-gray-400 block leading-tight">
                      Required by
                    </span>
                    <span className="text-xs sm:text-sm font-bold text-gray-900 block leading-tight mt-0.5">
                      {request.requiredBy}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Actions Row */}
            <div className="flex items-center gap-2.5 pt-3">
              <Link
                href={`/signup?intent=request_details&id=${encodeURIComponent(request.id)}`}
                className="flex-1 flex h-12 items-center justify-center rounded-xl bg-[#C52227] text-sm font-semibold text-white shadow-xs transition-all hover:bg-[#A8181D] hover:shadow active:scale-[0.98]"
              >
                View details
              </Link>

              <Link
                href={`https://wa.me/?text=${encodeURIComponent(
                  `Urgent: ${request.unitsNeeded} units of ${request.bloodGroup} needed at ${request.hospital}, ${request.city}. Ref: ${request.code}`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-gray-200 text-gray-700 shadow-2xs transition-colors hover:border-gray-300 hover:bg-gray-50 active:scale-[0.98]"
                aria-label={`Share request ${request.code} on WhatsApp`}
              >
                <MessageCircle className="h-5 w-5" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default EmergencyRequests;
