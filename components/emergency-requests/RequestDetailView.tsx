"use client";

import React, { useState } from "react";
import {
  AlertCircle,
  Clock,
  Droplets,
  MapPin,
  MessageCircle,
  Languages,
  Copy,
  Check,
  ArrowLeft,
} from "lucide-react";
import { EmergencyRequestItem } from "./EmergencyRequestsDirectory";

interface RequestDetailViewProps {
  request: EmergencyRequestItem;
  onBack: () => void;
}

type Language = "en" | "hi" | "gu";

// Helper to translate requiredBy to Hindi
function getRequiredByHindi(requiredBy: string): string {
  return requiredBy
    .replace(/Today/gi, "आज")
    .replace(/Tomorrow/gi, "कल")
    .replace(/AM/gi, "सुबह")
    .replace(/PM/gi, "शाम")
    .replace(/6:00 शाम/gi, "शाम 6:00 बजे")
    .replace(/10:30 शाम/gi, "रात 10:30 बजे")
    .replace(/8:00 शाम/gi, "रात 8:00 बजे")
    .replace(/2:00 शाम/gi, "दोपहर 2:00 बजे")
    .replace(/9:00 सुबह/gi, "सुबह 9:00 बजे")
    .replace(/11:00 सुबह/gi, "सुबह 11:00 बजे");
}

// Helper to translate requiredBy to Gujarati
function getRequiredByGujarati(requiredBy: string): string {
  return requiredBy
    .replace(/Today/gi, "આજે")
    .replace(/Tomorrow/gi, "આવતીકાલે")
    .replace(/AM/gi, "સવારે")
    .replace(/PM/gi, "સાંજે")
    .replace(/6:00 સાંજે/gi, "સાંજે 6:00 વાગ્યા સુધી")
    .replace(/10:30 સાંજે/gi, "રાત્રે 10:30 વાગ્યા સુધી")
    .replace(/8:00 સાંજે/gi, "રાત્રે 8:00 વાગ્યા સુધી")
    .replace(/2:00 સાંજે/gi, "બપોરે 2:00 વાગ્યા સુધી")
    .replace(/9:00 સવારે/gi, "સવારે 9:00 વાગ્યા સુધી")
    .replace(/11:00 સવારે/gi, "સવારે 11:00 વાગ્યા સુધી");
}

export function RequestDetailView({ request, onBack }: RequestDetailViewProps) {
  const [selectedLanguage, setSelectedLanguage] = useState<Language>("en");
  const [copied, setCopied] = useState<boolean>(false);

  // Generate messages in each language
  const messages: Record<Language, string> = {
    en: `Urgent blood request ${request.code}: ${request.bloodGroup}, ${request.unitsNeeded} units needed at ${request.hospital}, ${request.city}. Required ${request.requiredBy}. Please respond only if eligible and available.`,
    hi: `तत्काल रक्त आवश्यकता ${request.code}: ${request.hospital}, ${request.city} में ${request.bloodGroup} के ${request.unitsNeeded} यूनिट की आवश्यकता है। समय सीमा: ${getRequiredByHindi(request.requiredBy)}। कृपया पात्र और उपलब्ध होने पर ही संपर्क करें।`,
    gu: `તાત્કાલિક રક્તની જરૂરિયાત ${request.code}: ${request.hospital}, ${request.city} ખાતે ${request.bloodGroup} ના ${request.unitsNeeded} યુનિટની જરૂર છે. સમય: ${getRequiredByGujarati(request.requiredBy)}। જો તમે યોગ્ય અને ઉપલબ્ધ હોવ તો જ સંપર્ક કરો.`,
  };

  const currentMessage = messages[selectedLanguage];

  const handleCopy = () => {
    navigator.clipboard.writeText(currentMessage);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const whatsAppUrl = `https://wa.me/?text=${encodeURIComponent(currentMessage)}`;

  const getUrgencyBadge = (
    urgencyType: EmergencyRequestItem["urgency"],
    label: string
  ) => {
    switch (urgencyType) {
      case "immediate":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-red-50 text-red-700 px-2.5 py-0.5 sm:px-3 sm:py-1 text-xs font-bold tracking-wider uppercase">
            <AlertCircle className="h-3.5 w-3.5 shrink-0 text-red-700" />
            <span>{label}</span>
          </span>
        );
      case "within_12_hours":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 text-amber-700 px-2.5 py-0.5 sm:px-3 sm:py-1 text-xs font-bold tracking-wider uppercase">
            <Clock className="h-3.5 w-3.5 shrink-0 text-amber-700" />
            <span>{label}</span>
          </span>
        );
      case "within_24_hours":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100/70 text-amber-800 px-2.5 py-0.5 sm:px-3 sm:py-1 text-xs font-bold tracking-wider uppercase">
            <Clock className="h-3.5 w-3.5 shrink-0 text-amber-800" />
            <span>{label}</span>
          </span>
        );
    }
  };

  return (
    <div className="w-full bg-white">
      {/* 1. Header Section */}
      <section className="w-full bg-red-50/50 border-b border-red-100/70 py-10 sm:py-12 md:py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Button */}
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-red-700 mb-4 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to all emergency requests</span>
          </button>

          {/* Eyebrow Label */}
          <span className="block text-xs font-bold tracking-wider uppercase text-red-700 mb-2 sm:mb-2.5">
            REQUEST {request.code}
          </span>

          {/* Main Headline */}
          <h1 className="text-3xl sm:text-4xl lg:text-4xl font-semibold text-gray-900 tracking-tight leading-tight">
            {request.bloodGroup} blood needed urgently
          </h1>

          {/* Subtitle */}
          <p className="mt-2 text-sm sm:text-base text-gray-500 font-normal leading-relaxed">
            {request.hospital}, {request.city}
          </p>
        </div>
      </section>

      {/* 2. Main Content Grid */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          {/* Left Column: Request Summary Card */}
          <div className="lg:col-span-5 xl:col-span-4">
            <div className="rounded-2xl sm:rounded-3xl border border-gray-200/90 bg-white p-5 sm:p-6 shadow-2xs">
              {/* Urgency Badge + Reference Code */}
              <div className="flex items-center justify-between gap-2 mb-4">
                <div>{getUrgencyBadge(request.urgency, request.urgencyLabel)}</div>
                <span className="text-xs font-semibold text-gray-400 tracking-wide">
                  {request.code}
                </span>
              </div>

              {/* Blood Group Badge & Hospital Info */}
              <div className="flex items-center gap-4 mb-5">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-red-50 text-xl font-bold text-red-700">
                  {request.bloodGroup}
                </div>

                <div className="min-w-0 flex-1">
                  <h3 className="text-base font-bold text-gray-900 leading-snug">
                    {request.hospital}
                  </h3>
                  <div className="flex items-center gap-1 text-xs text-gray-400 font-medium mt-1">
                    <MapPin className="h-3.5 w-3.5 shrink-0" />
                    <span>{request.city}</span>
                  </div>
                </div>
              </div>

              {/* Units & Required By Details */}
              <div className="border-t border-gray-100 pt-4 pb-4 my-2 grid grid-cols-2 gap-3">
                <div className="flex items-center gap-2.5 border-r border-gray-100 pr-2">
                  <Droplets className="h-4 w-4 text-gray-400 shrink-0" />
                  <div>
                    <span className="text-xs text-gray-400 font-normal block leading-tight">
                      Units needed
                    </span>
                    <span className="text-xs sm:text-sm font-bold text-gray-900 block leading-tight mt-0.5">
                      {request.unitsNeeded} units
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 pl-1 sm:pl-2">
                  <Clock className="h-4 w-4 text-gray-400 shrink-0" />
                  <div>
                    <span className="text-xs text-gray-400 font-normal block leading-tight">
                      Required by
                    </span>
                    <span className="text-xs sm:text-sm font-bold text-gray-900 block leading-tight mt-0.5">
                      {request.requiredBy}
                    </span>
                  </div>
                </div>
              </div>

              {/* Bottom Buttons */}
              <div className="flex items-center gap-2.5 pt-3">
                <button
                  type="button"
                  className="flex-1 h-12 rounded-xl bg-red-700 text-sm font-semibold text-white shadow-xs hover:bg-red-800 transition-colors flex items-center justify-center select-none"
                >
                  View details
                </button>

                <a
                  href={whatsAppUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-12 w-12 shrink-0 flex items-center justify-center rounded-xl border border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50 transition-colors"
                  aria-label="Direct message"
                >
                  <MessageCircle className="h-5 w-5" />
                </a>
              </div>
            </div>
          </div>

          {/* Right Column: "Share this request" Card */}
          <div className="lg:col-span-7 xl:col-span-8">
            <div className="rounded-2xl sm:rounded-3xl border border-gray-200/90 bg-white p-5 sm:p-6 lg:p-7 shadow-xs">
              {/* Header Row: Icon + Title + AI subtitle */}
              <div className="flex items-start gap-3.5 mb-5">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-700">
                  <Languages className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900 leading-snug">
                    Share this request
                  </h2>
                  <p className="text-xs text-gray-400 font-normal mt-0.5">
                    AI-assisted translation · Review before sharing
                  </p>
                </div>
              </div>

              {/* Language Switcher Tabs */}
              <div className="flex items-center gap-2 mb-4">
                <button
                  type="button"
                  onClick={() => setSelectedLanguage("en")}
                  className={`px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-colors cursor-pointer ${
                    selectedLanguage === "en"
                      ? "bg-slate-900 text-white"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                  }`}
                >
                  English
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedLanguage("hi")}
                  className={`px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-colors cursor-pointer ${
                    selectedLanguage === "hi"
                      ? "bg-slate-900 text-white"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                  }`}
                >
                  हिन्दी
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedLanguage("gu")}
                  className={`px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-colors cursor-pointer ${
                    selectedLanguage === "gu"
                      ? "bg-slate-900 text-white"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                  }`}
                >
                  ગુજરાતી
                </button>
              </div>

              {/* Message Box */}
              <div className="border border-gray-200 rounded-2xl bg-white p-4 sm:p-5 mb-5 min-h-36 flex items-center">
                <p className="text-sm sm:text-base text-gray-800 leading-relaxed font-normal select-text">
                  {currentMessage}
                </p>
              </div>

              {/* Action Buttons at Bottom */}
              <div className="flex flex-wrap items-center justify-end gap-3 pt-2">
                {/* Copy Message Button */}
                <button
                  type="button"
                  onClick={handleCopy}
                  className="inline-flex items-center justify-center gap-2 h-11 px-5 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 text-sm font-semibold transition-colors shadow-2xs cursor-pointer"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-600" />
                      <span className="text-emerald-700">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 text-gray-500" />
                      <span>Copy message</span>
                    </>
                  )}
                </button>

                {/* Share on WhatsApp Button */}
                <a
                  href={whatsAppUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 h-11 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold shadow-xs active:scale-95 transition-all select-none cursor-pointer"
                >
                  {/* WhatsApp SVG Icon */}
                  <svg
                    className="w-4 h-4 fill-current shrink-0"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.03 14.69 2 12.04 2ZM12.05 3.67C14.25 3.67 16.31 4.53 17.87 6.09C19.42 7.65 20.28 9.72 20.28 11.92C20.28 16.46 16.59 20.15 12.04 20.15C10.56 20.15 9.11 19.76 7.85 19.01L7.55 18.83L4.43 19.65L5.26 16.61L5.06 16.29C4.24 14.99 3.81 13.47 3.81 11.91C3.81 7.37 7.5 3.67 12.05 3.67ZM8.73 7.34C8.57 7.34 8.31 7.4 8.09 7.64C7.87 7.88 7.24 8.47 7.24 9.68C7.24 10.89 8.12 12.06 8.24 12.22C8.36 12.38 9.94 14.82 12.37 15.87C14.39 16.74 14.8 16.57 15.24 16.53C15.68 16.49 16.66 15.95 16.86 15.39C17.06 14.83 17.06 14.35 17 14.25C16.94 14.15 16.79 14.09 16.56 13.98C16.33 13.87 15.21 13.32 15 13.24C14.79 13.16 14.64 13.12 14.49 13.35C14.34 13.58 13.91 14.09 13.78 14.24C13.65 14.39 13.52 14.41 13.29 14.3C13.06 14.19 12.33 13.95 11.46 13.17C10.78 12.57 10.32 11.83 10.19 11.6C10.06 11.37 10.18 11.25 10.29 11.14C10.39 11.04 10.51 10.88 10.63 10.74C10.75 10.6 10.79 10.5 10.87 10.34C10.95 10.18 10.91 10.04 10.85 9.92C10.79 9.8 10.34 8.7 10.15 8.24C9.97 7.8 9.78 7.86 9.63 7.85C9.49 7.85 9.33 7.84 9.17 7.84C9.01 7.84 8.75 7.9 8.53 8.14C8.75 7.88 8.73 7.34 8.73 7.34Z" />
                  </svg>
                  <span>Share on WhatsApp</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default RequestDetailView;
