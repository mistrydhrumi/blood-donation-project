"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface StepIndicatorProps {
  currentStep: number; // 1 | 2 | 3
  totalSteps?: number;
}

export function StepIndicator({
  currentStep,
  totalSteps = 3,
}: StepIndicatorProps) {
  const progress = Math.round((currentStep / totalSteps) * 100);

  return (
    <div className="w-full px-0">
      {/* Top bar */}
      <div className="flex items-center justify-between mb-2.5">
        <span className="text-xs text-gray-500 font-medium">Profile setup</span>
        <span className="text-xs text-gray-500 font-medium">
          Step {currentStep} of {totalSteps}
        </span>
      </div>

      {/* Progress track */}
      <div className="w-full h-1 bg-gray-200 rounded-full overflow-hidden">
        <div
          className={cn(
            "h-full bg-red-700 rounded-full transition-all duration-500 ease-in-out"
          )}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}

