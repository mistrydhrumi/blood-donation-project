"use client";

import React from "react";

interface EmergencyRequestsHeroProps {
  onCreateClick?: () => void;
}

export function EmergencyRequestsHero({ onCreateClick }: EmergencyRequestsHeroProps) {
  return (
    <section className="w-full bg-[#FFF8F7] border-b border-[#F7EBEA] py-10 sm:py-12 md:py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          {/* Left Text Content */}
          <div className="max-w-2xl">
            {/* Eyebrow Label */}
            <span className="block text-xs font-bold tracking-[0.08em] uppercase text-[#C72C36] mb-2 sm:mb-2.5">
              EMERGENCY REQUESTS
            </span>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-4xl lg:text-[40px] font-semibold text-[#172033] tracking-tight leading-tight">
              Respond when every minute matters
            </h1>

            {/* Subtitle */}
            <p className="mt-2 sm:mt-2.5 text-sm sm:text-base text-[#647085] font-normal leading-relaxed">
              Browse active, hospital-linked requests and share them with your trusted network.
            </p>
          </div>

          {/* Right Action Button */}
          <div className="shrink-0 self-start md:self-center">
            <button
              type="button"
              onClick={onCreateClick}
              className="inline-flex items-center justify-center gap-1.5 h-10 px-5 rounded-xl bg-[#C72C36] text-white text-sm font-medium shadow-[0_2px_8px_rgba(199,44,54,0.2)] hover:bg-[#B2242D] active:scale-95 transition-all duration-150 cursor-pointer select-none"
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
