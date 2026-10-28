"use client";

import React from "react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ProfileNavigationProps {
  step: number;
  totalSteps?: number;
  onBack: () => void;
  onNext: () => void;
  nextLabel?: string;
  isLoading?: boolean;
  className?: string;
}

export function ProfileNavigation({
  step,
  totalSteps = 3,
  onBack,
  onNext,
  nextLabel,
  isLoading = false,
  className,
}: ProfileNavigationProps) {
  const isFirst = step === 1;
  const isLast = step === totalSteps;
  const label = nextLabel ?? (isLast ? "Complete setup" : "Continue");

  return (
    <div
      className={cn(
        "flex items-center justify-end gap-4 pt-2",
        className
      )}
    >
      {!isFirst && (
        <button
          type="button"
          onClick={onBack}
          disabled={isLoading}
          className="text-sm font-semibold text-gray-700 hover:text-gray-900 transition-colors disabled:opacity-50 cursor-pointer"
        >
          Back
        </button>
      )}

      <Button
        type="button"
        onClick={onNext}
        disabled={isLoading}
        size="lg"
        className="bg-red-700 hover:bg-red-800 text-white font-semibold rounded-xl px-7 h-12 flex items-center gap-2 shadow-sm hover:shadow-md transition-all"
      >
        {isLoading ? (
          <>
            <span className="inline-block w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
            <span>Saving…</span>
          </>
        ) : (
          <>
            <span>{label}</span>
            <ArrowRight className="w-4 h-4" />
          </>
        )}
      </Button>
    </div>
  );
}

