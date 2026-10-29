"use client";

import React from "react";
import { Activity, AlertCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ProfileFormField } from "@/components/profile/ProfileFormField";
import {
  type ProfileStepThreeData,
  BLOOD_GROUPS,
  GENDERS,
} from "@/lib/validations/profile";

interface ProfileStepThreeProps {
  data: ProfileStepThreeData;
  errors: Partial<Record<keyof ProfileStepThreeData, string>>;
  onChange: (data: Partial<ProfileStepThreeData>) => void;
}

const GENDER_LABELS: Record<(typeof GENDERS)[number], string> = {
  male:             "Male",
  female:           "Female",
  other:            "Other",
  prefer_not_to_say: "Prefer not to say",
};

export function ProfileStepThree({ data, errors, onChange }: ProfileStepThreeProps) {
  return (
    <div className="flex flex-col">
      {/* Section label */}
      <span className="text-xs font-bold tracking-widest uppercase text-red-700 mb-3">
        Donor setup
      </span>

      <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight leading-tight mb-2">
        Set your availability
      </h2>

      <p className="text-sm text-gray-500 mb-7">
        These details help us make safer, more relevant matches.
      </p>

      {/* Row 1: Blood group + Last donation date */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-5 mb-5">
        <ProfileFormField label="Blood group" error={errors.bloodGroup}>
          <SelectField
            value={data.bloodGroup ?? ""}
            hasError={!!errors.bloodGroup}
            onChange={(v) =>
              onChange({ bloodGroup: v as (typeof BLOOD_GROUPS)[number] })
            }
            placeholder="Select blood group"
            options={BLOOD_GROUPS.map((bg) => ({ value: bg, label: bg }))}
          />
        </ProfileFormField>

        <ProfileFormField label="Last donation date" error={errors.lastDonationDate}>
          <Input
            type="date"
            value={data.lastDonationDate ?? ""}
            error={errors.lastDonationDate}
            max={new Date().toISOString().split("T")[0]}
            onChange={(e) => onChange({ lastDonationDate: e.target.value })}
          />
        </ProfileFormField>
      </div>

      {/* Row 2: Weight + Age */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-5 mb-5">
        <ProfileFormField label="Weight (kg)" error={errors.weight}>
          <Input
            type="number"
            inputMode="decimal"
            placeholder="e.g. 65"
            min={20}
            max={300}
            value={data.weight === undefined || data.weight === 0 ? "" : String(data.weight)}
            error={errors.weight}
            onChange={(e) => {
              const v = e.target.value;
              onChange({ weight: v === "" ? undefined : parseFloat(v) });
            }}
          />
        </ProfileFormField>

        <ProfileFormField label="Age" error={errors.age}>
          <Input
            type="number"
            inputMode="numeric"
            placeholder="e.g. 25"
            min={18}
            max={120}
            value={data.age === undefined || data.age === 0 ? "" : String(data.age)}
            error={errors.age}
            onChange={(e) => {
              const v = e.target.value;
              onChange({ age: v === "" ? undefined : parseInt(v, 10) });
            }}
          />
        </ProfileFormField>
      </div>

      {/* Row 3: Gender */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-5 mb-5">
        <ProfileFormField label="Gender" error={errors.gender}>
          <SelectField
            value={data.gender ?? ""}
            hasError={!!errors.gender}
            onChange={(v) =>
              onChange({ gender: v as (typeof GENDERS)[number] })
            }
            placeholder="Select gender"
            options={GENDERS.map((g) => ({ value: g, label: GENDER_LABELS[g] }))}
          />
        </ProfileFormField>

        {/* Disease / medical conditions */}
        <ProfileFormField
          label="Existing conditions (optional)"
          error={errors.disease}
        >
          <Input
            type="text"
            placeholder="e.g. diabetes, hypertension"
            value={data.disease ?? ""}
            error={errors.disease}
            onChange={(e) => onChange({ disease: e.target.value })}
          />
        </ProfileFormField>
      </div>

      {/* Available to donate toggle */}
      <div className="mb-6">
        <ToggleRow
          icon={<Activity className="w-5 h-5 text-red-600" />}
          title="Available to donate"
          subtitle="You can pause this at any time."
          checked={data.isAvailable}
          onChange={(checked) => onChange({ isAvailable: checked })}
        />
      </div>

      {/* Medical disclaimer — plain border, no colored background */}
      <div className="flex items-start gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3.5">
        <AlertCircle className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
        <p className="text-xs text-gray-500 leading-relaxed">
          The 90-day cooldown is an informational reminder, not medical
          clearance. A qualified professional must confirm eligibility.
        </p>
      </div>
    </div>
  );
}

/* ── Shared helpers ─────────────────────────────────────────────────── */

interface SelectFieldProps {
  value: string;
  hasError: boolean;
  onChange: (value: string) => void;
  placeholder: string;
  options: { value: string; label: string }[];
}

function SelectField({
  value, hasError, onChange, placeholder, options,
}: SelectFieldProps) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`flex h-12 w-full appearance-none rounded-xl border bg-white px-3.5 py-2 text-sm text-gray-900 shadow-xs transition-all focus-visible:outline-none focus-visible:border-red-500 focus-visible:ring-2 focus-visible:ring-red-500/20 ${
          hasError
            ? "border-red-500 ring-2 ring-red-100"
            : "border-gray-200 hover:border-gray-300"
        }`}
      >
        <option value="">{placeholder}</option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
      <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-400">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="1.5"
            strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
    </div>
  );
}

interface ToggleRowProps {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

function ToggleRow({ icon, title, subtitle, checked, onChange }: ToggleRowProps) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border border-gray-200 bg-white px-4 py-4">
      <div className="flex items-center gap-3">
        <span className="shrink-0">{icon}</span>
        <div>
          <p className="text-sm font-semibold text-gray-900">{title}</p>
          <p className="text-xs text-gray-500">{subtitle}</p>
        </div>
      </div>
      <label className="relative inline-flex items-center cursor-pointer">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="peer sr-only"
        />
        <div
          className={`w-5 h-5 rounded flex items-center justify-center border-2 transition-colors ${
            checked
              ? "bg-blue-600 border-blue-600"
              : "bg-white border-gray-300 hover:border-gray-400"
          }`}
          aria-hidden="true"
        >
          {checked && (
            <svg width="10" height="8" viewBox="0 0 10 8" fill="none" aria-hidden="true">
              <path d="M1 4L4 7L9 1" stroke="white" strokeWidth="1.5"
                strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </div>
      </label>
    </div>
  );
}
