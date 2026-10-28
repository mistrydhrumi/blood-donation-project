"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { ProfileFormField } from "@/components/profile/ProfileFormField";
import { type ProfileStepTwoData } from "@/lib/validations/profile";

interface ProfileStepTwoProps {
  data: ProfileStepTwoData;
  errors: Partial<Record<keyof ProfileStepTwoData, string>>;
  onChange: (data: Partial<ProfileStepTwoData>) => void;
}

const INDIAN_STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
  "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram",
  "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
  "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
  "Andaman and Nicobar Islands", "Chandigarh",
  "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi", "Jammu and Kashmir", "Ladakh", "Lakshadweep", "Puducherry",
];

export function ProfileStepTwo({ data, errors, onChange }: ProfileStepTwoProps) {
  return (
    <div className="flex flex-col">
      {/* Section label */}
      <span className="text-xs font-bold tracking-widest uppercase text-red-700 mb-3">
        About you
      </span>

      <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight leading-tight mb-2">
        Let&apos;s create your profile
      </h2>

      <p className="text-sm text-gray-500 mb-7">
        We only show privacy-safe details in public searches.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-5">
        {/* Full name */}
        <ProfileFormField label="Full name" error={errors.fullName}>
          <Input
            type="text"
            placeholder="Your full name"
            value={data.fullName}
            error={errors.fullName}
            onChange={(e) => onChange({ fullName: e.target.value })}
            autoComplete="name"
          />
        </ProfileFormField>

        {/* City */}
        <ProfileFormField label="City" error={errors.city}>
          <Input
            type="text"
            placeholder="Your city"
            value={data.city}
            error={errors.city}
            onChange={(e) => onChange({ city: e.target.value })}
            autoComplete="address-level2"
          />
        </ProfileFormField>

        {/* State */}
        <ProfileFormField label="State" error={errors.state}>
          <div className="relative">
            <select
              value={data.state}
              onChange={(e) => onChange({ state: e.target.value })}
              className={`flex h-12 w-full appearance-none rounded-xl border bg-white px-3.5 py-2 text-sm text-gray-900 shadow-xs transition-all focus-visible:outline-none focus-visible:border-red-500 focus-visible:ring-2 focus-visible:ring-red-500/20 ${
                errors.state
                  ? "border-red-500 ring-2 ring-red-100"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <option value="">Select your state</option>
              {INDIAN_STATES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
            <ChevronIcon />
          </div>
        </ProfileFormField>

        {/* Pincode */}
        <ProfileFormField label="Pincode" error={errors.pincode}>
          <Input
            type="text"
            inputMode="numeric"
            placeholder="6-digit PIN code"
            value={data.pincode}
            error={errors.pincode}
            maxLength={6}
            onChange={(e) => {
              const val = e.target.value.replace(/\D/g, "").slice(0, 6);
              onChange({ pincode: val });
            }}
          />
        </ProfileFormField>
      </div>
    </div>
  );
}

function ChevronIcon() {
  return (
    <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-400">
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="1.5"
          strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
}
