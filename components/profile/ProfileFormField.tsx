"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface ProfileFormFieldProps {
  label: string;
  error?: string;
  children: React.ReactNode;
  className?: string;
}

/**
 * Reusable wrapper: label + control + field-level error message.
 */
export function ProfileFormField({
  label,
  error,
  children,
  className,
}: ProfileFormFieldProps) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <label className="text-sm font-medium text-gray-600">{label}</label>
      {children}
      {error && (
        <p className="text-xs text-red-600 font-medium mt-0.5">{error}</p>
      )}
    </div>
  );
}

