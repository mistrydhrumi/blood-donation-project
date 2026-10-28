import React from "react";
import Link from "next/link";
import { Check, ArrowRight } from "lucide-react";

export function DonationAwareness() {
  const checklistItems = [
    "Eat a healthy meal",
    "Stay well hydrated",
    "Carry valid ID",
  ];

  return (
    <section className="w-full bg-white py-12 sm:py-16 lg:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 xl:gap-16 items-center">
          {/* Left Column: Awareness Information */}
          <div className="lg:col-span-7 flex flex-col items-start">
            <span className="text-xs font-bold tracking-[0.16em] uppercase text-[#C52227] block mb-3">
              DONATION AWARENESS
            </span>

            <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-bold text-gray-900 tracking-tight leading-[1.14] mb-5 sm:mb-6">
              Your donation can support more than <br className="hidden sm:inline" />
              one life.
            </h2>

            <p className="text-sm sm:text-base text-slate-500 font-normal leading-relaxed max-w-xl mb-6 sm:mb-8">
              Blood can be separated into components that help different patients.
              Eligibility and donation frequency vary—always follow guidance from
              qualified medical staff.
            </p>

            {/* Checklist of Preparation Steps */}
            <div className="flex flex-wrap items-center gap-x-6 gap-y-3 mb-7 sm:mb-9">
              {checklistItems.map((item) => (
                <div key={item} className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-emerald-600 shrink-0" strokeWidth={2.5} />
                  <span className="text-xs sm:text-sm font-medium text-gray-700">
                    {item}
                  </span>
                </div>
              ))}
            </div>

            {/* Read Donation Guidance Link */}
            <Link
              href="/signup?intent=donation_guidance"
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#C52227] hover:text-[#A8181D] transition-colors group"
            >
              <span>Read donation guidance</span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>

          {/* Right Column: Quote Card */}
          <div className="lg:col-span-5">
            <div className="bg-[#fff5f5] rounded-[28px] sm:rounded-[36px] p-8 sm:p-10 lg:p-12 flex flex-col justify-between">
              {/* Top Custom Droplet Outline Icon matching Figma */}
              <div className="mb-6 sm:mb-8 text-[#C52227]">
                <svg
                  width="36"
                  height="36"
                  viewBox="0 0 32 32"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="text-[#C52227]"
                  aria-hidden="true"
                >
                  <path
                    d="M17.5 28C12.8056 28 9 24.1944 9 19.5C9 14.8056 16.5 6 17.5 4.5C18.5 6 26 14.8056 26 19.5C26 24.1944 22.1944 28 17.5 28Z"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M23 7.5C23.8 8.5 24.5 10 24.5 11.5"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                  />
                </svg>
              </div>

              {/* Quote text */}
              <blockquote className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight leading-snug mb-8 sm:mb-10">
                “A few minutes of your time can become someone else’s second chance.”
              </blockquote>

              {/* Attribution */}
              <div className="text-xs text-gray-400 font-medium">
                BloodBridge community
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default DonationAwareness;
