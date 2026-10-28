"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Lock,
  MessageCircle,
  HeartHandshake,
} from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden pt-6 pb-12 sm:pt-10 sm:pb-16 lg:pt-14 lg:pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 xl:gap-12 items-center">
          {/* Left Column: Content */}
          <div className="lg:col-span-6 xl:col-span-6 flex flex-col items-start text-left z-10">
            {/* Live Donors Pill Badge */}
            <div className="inline-flex items-center gap-2 rounded-full bg-red-50/90 border border-red-100/90 px-3.5 py-1.5 shadow-xs mb-6 sm:mb-7">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-700" />
              </span>
              <span className="text-xs sm:text-sm font-bold tracking-wider text-red-700 uppercase">
                1,248 DONORS AVAILABLE TODAY
              </span>
              <span className="ml-0.5 rounded bg-white px-1.5 py-0.5 text-xs font-semibold uppercase tracking-wider text-gray-400 border border-gray-200/70">
                SAMPLE DATA
              </span>
            </div>

            {/* Display Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl tracking-tight text-gray-900 leading-tight mb-5 sm:mb-6">
              Every drop can <br className="hidden sm:inline" />
              <span className="text-red-700">save a life.</span>
            </h1>

            {/* Supporting Subtitle */}
            <p className="text-base sm:text-lg text-slate-500 font-normal leading-relaxed max-w-lg mb-8 sm:mb-9">
              Find nearby blood donors, share urgent requests, and coordinate
              safely—all in a few simple steps.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-3.5 sm:gap-4 mb-8 sm:mb-10 w-full sm:w-auto">
              <Link
                href="/signup"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-700 px-7 py-3.5 text-base font-semibold text-white shadow-sm transition-all hover:bg-red-800 hover:shadow-md active:scale-95 w-full sm:w-auto"
              >
                <span>Find blood</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                href="/signup"
                className="inline-flex items-center justify-center rounded-xl border border-gray-200 bg-white px-6 py-3.5 text-base font-semibold text-gray-800 shadow-xs transition-all hover:border-gray-300 hover:bg-gray-50 active:scale-95 w-full sm:w-auto"
              >
                Become a donor
              </Link>
            </div>

            {/* Trust Badges */}
            <div className="flex flex-wrap items-center gap-y-2 gap-x-5 sm:gap-x-7 text-xs font-medium text-slate-600">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-red-700 shrink-0" />
                <span>Verified profiles</span>
              </div>

              <div className="flex items-center gap-1.5">
                <Lock className="w-4 h-4 text-red-700 shrink-0" />
                <span>Privacy protected</span>
              </div>

              <div className="flex items-center gap-1.5">
                <MessageCircle className="w-4 h-4 text-red-700 shrink-0" />
                <span>WhatsApp connect</span>
              </div>
            </div>
          </div>

          {/* Right Column: Doctor Hero Image & Floating Cards */}
          <div className="lg:col-span-6 xl:col-span-6 relative mt-4 lg:mt-0 flex justify-center lg:justify-end">
            <div className="relative w-full max-w-xl">
              {/* Doctor Main Image Container with Large Rounded Corners matching Figma */}
              <div className="relative aspect-4/3 w-full overflow-hidden rounded-3xl shadow-sm bg-gray-100 border border-gray-100">
                <Image
                  src="/images/hero-doctor.jpg"
                  alt="Doctor consulting with patient"
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 560px"
                  className="object-cover object-center"
                />
              </div>

              {/* Floating Badge 1: Connections Made (Top-Right Overlap) */}
              <div className="absolute -top-3 sm:-top-4 right-2 sm:-right-4 z-20 flex items-center gap-3 rounded-2xl bg-white/95 px-3.5 py-3 sm:px-4 sm:py-3.5 border border-gray-100/90 ">
                <div className="flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-xl bg-red-50 text-red-700 shrink-0">
                  <HeartHandshake className="h-5 w-5 sm:h-6 sm:w-6" />
                </div>
                <div>
                  <div className="text-base sm:text-lg text-gray-900 leading-none">
                    18,400+
                  </div>
                  <div className="text-xs font-medium text-gray-400 mt-1 leading-none">
                    connections made
                  </div>
                </div>
              </div>

              {/* Floating Badge 2: Donor Found Nearby (Bottom-Left Overlap) */}
              <div className="absolute -bottom-4 sm:-bottom-5 -left-2 sm:-left-6 z-20 flex items-center gap-3 rounded-2xl bg-white/95 px-3.5 py-3 sm:px-4 sm:py-3.5 border border-gray-100/90">
                <div className="flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-full bg-red-100 text-red-700 font-bold text-xs sm:text-sm shrink-0">
                  MP
                </div>
                <div className="pr-1">
                  <div className="text-xs sm:text-sm text-gray-900 leading-tight">
                    Donor found nearby
                  </div>
                  <div className="text-xs font-medium text-gray-400 leading-tight mt-0.5">
                    A+ · 3.8 km away
                  </div>
                </div>
                <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0 ml-1" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
