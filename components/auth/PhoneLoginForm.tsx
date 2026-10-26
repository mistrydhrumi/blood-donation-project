"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowRight, ShieldCheck, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export interface PhoneLoginFormProps {
  onSuccess?: (phone: string) => void;
}

export function PhoneLoginForm({ onSuccess }: PhoneLoginFormProps) {
  const [phoneNumber, setPhoneNumber] = useState("");
  const countryCode = "+91";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSuccess?.(phoneNumber || "98765 43210");
  };

  return (
    <div className="w-full max-w-[420px] mx-auto px-6 py-6 sm:py-8 flex flex-col justify-center">
      {/* Eyebrow Header */}
      <span className="text-[11px] sm:text-xs tracking-[0.16em] uppercase text-[#C52227]">
        Welcome to BloodSetu
      </span>

      {/* Main Title */}
      <h2 className="text-2xl sm:text-3xl xl:text-[34px] text-gray-900 tracking-tight mt-2 mb-1.5 leading-tight">
        Continue with your phone
      </h2>

      {/* Helper text */}
      <p className="text-xs sm:text-sm text-gray-500 mb-6 font-normal">
        We&apos;ll send a one-time code to verify your number.
      </p>

      {/* Phone Number Input Form */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="phone-number" className="text-xs text-gray-700">
            Phone number
          </Label>
          <Input
            id="phone-number"
            type="tel"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            placeholder="98765 43210"
            prefixElement={
              <div className="h-full flex items-center gap-1.5 px-3.5 border-r border-gray-200 bg-gray-50/60 text-gray-700 font-medium text-xs sm:text-sm select-none">
                <span>{countryCode}</span>
                <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
              </div>
            }
          />
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          size="lg"
          className="w-full bg-[#C52227] hover:bg-[#B01B20] text-white font-medium text-sm rounded-xl py-3.5 shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2 mt-1"
        >
          <span>Send verification code</span>
          <ArrowRight className="w-4 h-4" />
        </Button>
      </form>

      {/* Safe & Secure Trust Divider */}
      <div className="relative my-6 xl:my-7 flex items-center justify-center">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-200" />
        </div>
        <div className="relative px-3 bg-white flex items-center gap-1.5 text-[11px] font-medium text-gray-400 uppercase tracking-wider">
          <ShieldCheck className="w-3.5 h-3.5 text-gray-400" />
          <span>Safe &amp; secure</span>
        </div>
      </div>

      {/* Terms and Privacy Notice */}
      <p className="text-xs text-gray-400 text-center leading-relaxed">
        By continuing, you agree to the{" "}
        <Link
          href="#"
          className="text-gray-500 hover:text-gray-900 underline underline-offset-2 transition-colors"
        >
          Terms of Use
        </Link>{" "}
        and{" "}
        <Link
          href="#"
          className="text-gray-500 hover:text-gray-900 underline underline-offset-2 transition-colors"
        >
          Privacy Policy
        </Link>
        .
      </p>
    </div>
  );
}
