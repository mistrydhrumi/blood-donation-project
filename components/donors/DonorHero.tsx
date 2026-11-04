"use client";

import React from "react";

export function DonorHero() {
  return (
    <section className="w-full bg-red-50 border-b border-red-100 pt-10 pb-12 sm:pt-14 sm:pb-16 lg:pt-16 lg:pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Eyebrow Label */}
        <span className="inline-block text-xs font-bold tracking-widest uppercase text-red-700 mb-3 sm:mb-3.5">
          Donor directory
        </span>

        {/* Main Heading */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 tracking-tight leading-tight mb-3">
          Find a blood donor near you
        </h1>

        {/* Subtitle */}
        <p className="text-sm sm:text-base text-gray-600 max-w-2xl leading-relaxed">
          Search privacy-protected profiles and connect directly with donors who
          have opted in.
        </p>
      </div>
    </section>
  );
}

export default DonorHero;

