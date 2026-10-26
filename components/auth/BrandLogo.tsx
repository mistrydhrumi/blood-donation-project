"use client";

import { Droplets } from "lucide-react";
import Link from "next/link";

export interface BrandProps {
  compact?: boolean;
  className?: string;
}

export function Brand({ compact = false, className = "" }: BrandProps) {
  return (
    <Link
      href="/"
      className={`brand inline-flex items-center gap-2.5 font-bold text-xl tracking-tight select-none transition-opacity hover:opacity-95 ${className}`}
      aria-label="BloodSetu home"
    >
      <span className="brand-mark inline-flex items-center justify-center w-9 h-9 rounded-xl bg-red-600 text-white shadow-sm">
        <Droplets
          size={compact ? 18 : 22}
          fill="currentColor"
        />
      </span>

      {!compact && (
        <span className="brand-text">
          Blood<span>Setu</span>
        </span>
      )}
    </Link>
  );
}

export default Brand;