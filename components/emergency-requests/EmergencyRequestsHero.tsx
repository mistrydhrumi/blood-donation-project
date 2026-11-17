"use client";

import React from "react";

interface EmergencyRequestsHeroProps {
  onCreateClick?: () => void;
}

export function EmergencyRequestsHero({ onCreateClick }: EmergencyRequestsHeroProps) {
  return (
    <section className="w-full bg-red-50/50 border-b border-red-100/70 py-10 sm:py-12 md:py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          {/* Left Text Content */}
          <div className="max-w-2xl">
            {/* Eyebrow Label */}
            <span className="block text-xs font-bold tracking-wider uppercase text-red-700 mb-2 sm:mb-2.5">
              EMERGENCY REQUESTS
            </span>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-4xl lg:text-4xl font-semibold text-gray-900 tracking-tight leading-tight">
              Respond when every minute matters
            </h1>

            {/* Subtitle */}
            <p className="mt-2 sm:mt-2.5 text-sm sm:text-base text-gray-500 font-normal leading-relaxed">
              Browse active, hospital-linked requests and share them with your trusted network.
            </p>
          </div>

          {/* Right Action Button */}
          <div className="shrink-0 self-start md:self-center">
            <button
              type="button"
              onClick={onCreateClick}
              className="inline-flex items-center justify-center gap-1.5 h-10 px-5 rounded-xl bg-red-700 text-white text-sm font-medium shadow-sm hover:bg-red-800 active:scale-95 transition-all duration-150 cursor-pointer select-none"
            >
              <span className="text-base leading-none font-medium">+</span>
              <span>Create blood request</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default EmergencyRequestsHero;
