"use client";

import React, { useState, useRef } from "react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface OtpVerificationFormProps {
  phoneNumber?: string;
  onBack?: () => void;
  onVerify?: (code: string) => void;
}

export function OtpVerificationForm({
  phoneNumber = "+91 98••••••210",
  onBack,
  onVerify,
}: OtpVerificationFormProps) {
  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Format phone display with dots if a raw phone number is provided
  const displayPhone = phoneNumber.includes("•")
    ? phoneNumber
    : phoneNumber.length >= 10
    ? `+91 ${phoneNumber.slice(0, 2)}••••••${phoneNumber.slice(-3)}`
    : "+91 98••••••210";

  const handleChange = (index: number, value: string) => {
    // Only accept numeric inputs
    const lastChar = value.slice(-1);
    if (value && !/^\d$/.test(lastChar)) return;

    const newOtp = [...otp];
    newOtp[index] = lastChar;
    setOtp(newOtp);

    // Auto-focus next input
    if (lastChar && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData("text").trim();
    if (!/^\d+$/.test(pasteData)) return;

    const digits = pasteData.slice(0, 6).split("");
    const newOtp = [...otp];
    digits.forEach((digit, idx) => {
      newOtp[idx] = digit;
    });
    setOtp(newOtp);

    // Focus the next empty input or the last one
    const nextIdx = Math.min(digits.length, 5);
    inputRefs.current[nextIdx]?.focus();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onVerify?.(otp.join(""));
  };

  return (
    <div className="w-full max-w-[420px] mx-auto px-6 py-6 sm:py-8 flex flex-col justify-center">
      {/* Eyebrow Header */}
      <span className="text-[11px] sm:text-xs font-bold tracking-[0.16em] uppercase text-[#C52227]">
        Step 2 of 2
      </span>

      {/* Main Title */}
      <h2 className="text-2xl sm:text-3xl xl:text-[34px] font-bold text-gray-900 tracking-tight mt-2 mb-2 leading-tight">
        Enter verification code
      </h2>

      {/* Helper text */}
      <p className="text-xs sm:text-sm text-gray-500 mb-6 sm:mb-8 font-normal leading-relaxed">
        We sent a 6-digit code to{" "}
        <span className="font-semibold text-gray-800">{displayPhone}</span>. It
        expires in 10 minutes.
      </p>

      {/* 6-Digit Code Input Form */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <div className="grid grid-cols-6 gap-2 sm:gap-2.5">
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => {
                inputRefs.current[index] = el;
              }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onPaste={handlePaste}
              className="w-full h-13 sm:h-14 rounded-xl border border-gray-200 text-center text-xl sm:text-2xl font-bold text-gray-900 bg-white shadow-xs focus:border-[#C52227] focus:ring-2 focus:ring-red-500/20 outline-none transition-all select-none"
              aria-label={`Digit ${index + 1}`}
            />
          ))}
        </div>

        {/* Action Button */}
        <Button
          type="submit"
          size="lg"
          className="w-full bg-[#C52227] hover:bg-[#B01B20] text-white font-medium text-sm rounded-xl py-3.5 shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2"
        >
          <span>Verify &amp; continue</span>
          <ArrowRight className="w-4 h-4" />
        </Button>
      </form>

      {/* Resend and Change Phone Navigation */}
      <div className="mt-8 flex flex-col items-center gap-2.5 text-center">
        <span className="text-xs sm:text-sm text-gray-400 font-medium select-none">
          Resend code in 00:24
        </span>

        <button
          type="button"
          onClick={onBack}
          className="text-xs sm:text-sm font-medium text-[#C52227] hover:text-[#9B1519] hover:underline transition-colors cursor-pointer"
        >
          Change phone number
        </button>
      </div>
    </div>
  );
}
