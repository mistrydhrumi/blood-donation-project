import React from "react";
import Image from "next/image";
import { ShieldCheck, CheckCircle2, Lock, Radio } from "lucide-react";
import { Brand } from "./BrandLogo";

export function AuthHeroPanel() {
  return (
    <div className="relative flex flex-col justify-between w-full h-full p-6 sm:p-10 xl:p-14 overflow-hidden bg-[#6a0e13] select-none">
      {/* Background Image with Authentic Hospital/Donation Scene */}
      <div className="absolute inset-0 pointer-events-none">
        <Image
          src="/images/blood-donation-hero.jpg"
          alt="Blood donation hospital scene"
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-cover object-center"
        />
        {/* Red Duotone Color Overlay matching Figma design */}
        <div className="absolute inset-0 bg-[#6E0F14]/80 mix-blend-multiply" />
        {/* <div className="absolute inset-0 bg-gradient-to-b from-[#7A1218]/90 via-transparent to-[#4A080D]/90" /> */}
        <div className="absolute inset-0 bg-[#4A080D]/75" />
      </div>

      {/* Top Branding Section */}
      <div className="relative z-10">
        <Brand className="text-white" />
      </div>

      {/* Center Main Content */}
      <div className="relative z-10 my-auto py-4 xl:py-6 max-w-xl">
        {/* Pill Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-white/20 bg-white/10 backdrop-blur-md mb-5 xl:mb-7">
          <ShieldCheck className="w-4 h-4 text-white/90" />
          <span className="text-[11px] font-semibold tracking-widest text-white/95 uppercase">
            Trusted Community Platform
          </span>
        </div>

        {/* Display Heading */}
        <h1 className="text-3xl sm:text-4xl xl:text-[48px] text-white tracking-tight leading-[1.12]">
          Be the bridge <br />
          someone is waiting <br />
          for.
        </h1>

        {/* Supporting Description */}
        <p className="mt-4 xl:mt-5 text-sm sm:text-base text-red-100/85 max-w-md font-normal leading-relaxed">
          Join thousands of donors and requesters making blood access faster and safer.
        </p>
      </div>

      {/* Bottom Trust Indicators */}
      <div className="relative z-10 pt-4 xl:pt-5 border-t border-white/10">
        <div className="flex flex-wrap items-center gap-5 xl:gap-8 text-white/90 text-xs font-medium">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-red-200 shrink-0" />
            <span>Verified profiles</span>
          </div>

          <div className="flex items-center gap-1.5">
            <Lock className="w-4 h-4 text-red-200 shrink-0" />
            <span>Privacy controls</span>
          </div>

          <div className="flex items-center gap-1.5">
            <Radio className="w-4 h-4 text-red-200 shrink-0" />
            <span>Direct connection</span>
          </div>
        </div>
      </div>
    </div>
  );
}
