"use client";

import React from "react";
import { Droplets, Heart, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { type ProfileStepOneData, ROLES } from "@/lib/validations/profile";

interface RoleOption {
  value: (typeof ROLES)[number];
  label: string;
  description: string;
  icon: React.ReactNode;
}

const ROLE_OPTIONS: RoleOption[] = [
  {
    value: "donor",
    label: "Donor",
    description: "I want to donate blood",
    icon: <Droplets className="w-9 h-9 text-red-600" />,
  },
  {
    value: "requester",
    label: "Requester",
    description: "I may need to request blood",
    icon: <Heart className="w-9 h-9 text-red-600" />,
  },
  {
    value: "both",
    label: "Both",
    description: "I want to donate and request",
    icon: <Users className="w-9 h-9 text-red-600" />,
  },
];

interface ProfileStepOneProps {
  data: ProfileStepOneData;
  errors: Partial<Record<keyof ProfileStepOneData, string>>;
  onChange: (data: Partial<ProfileStepOneData>) => void;
}

export function ProfileStepOne({ data, errors, onChange }: ProfileStepOneProps) {
  return (
    <div className="flex flex-col">
      {/* Section label */}
      <span className="text-xs font-bold tracking-widest uppercase text-red-700 mb-3">
        Choose your role
      </span>

      {/* Heading */}
      <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight leading-tight mb-2">
        How will you use BloodBridge?
      </h2>

      {/* Sub-text */}
      <p className="text-sm text-gray-500 mb-8">
        You can change this later in your profile.
      </p>

      {/* Role cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {ROLE_OPTIONS.map((option) => {
          const isSelected = data.role === option.value;
          return (
            <button
              key={option.value}
              type="button"
              onClick={() => onChange({ role: option.value })}
              className={cn(
                "relative flex flex-col items-center justify-center gap-3 rounded-2xl border px-5 py-7 text-center transition-all duration-150 cursor-pointer",
                isSelected
                  ? "border-red-500 bg-red-50 shadow-sm"
                  : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50"
              )}
              aria-pressed={isSelected}
            >
              {/* Checkmark */}
              {isSelected && (
                <span className="absolute top-3 right-3.5 text-gray-700">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    aria-hidden="true"
                  >
                    <path
                      d="M3 8.5L6.5 12L13 5"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
              )}

              {/* Icon */}
              <div className="flex items-center justify-center">
                {option.icon}
              </div>

              {/* Label */}
              <p className="text-sm font-bold text-gray-900">{option.label}</p>

              {/* Description */}
              <p className="text-xs text-red-600 font-medium">
                {option.description}
              </p>
            </button>
          );
        })}
      </div>

      {/* Role error */}
      {errors.role && (
        <p className="mt-3 text-xs text-red-600 font-medium">{errors.role}</p>
      )}
    </div>
  );
}

