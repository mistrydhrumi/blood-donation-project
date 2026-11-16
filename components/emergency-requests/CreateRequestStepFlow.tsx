"use client";

import React, { useState } from "react";
import {
  Check,
  User,
  Building2,
  MessageSquare,
  Lock,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  MessageCircle,
  PhoneCall,
  Calendar,
} from "lucide-react";
import { EmergencyRequestItem } from "./EmergencyRequestsDirectory";

interface CreateRequestStepFlowProps {
  onCancel: () => void;
  onPublish: (newRequest: EmergencyRequestItem) => void;
}

export type UrgencyOption =
  | "immediate"
  | "within_12_hours"
  | "within_24_hours"
  | "scheduled";

export interface CreateRequestFormData {
  // Step 1: Patient & blood
  patientName: string;
  bloodGroup: string;
  unitsRequired: number;
  relationship: string;

  // Step 2: Hospital & timing
  hospitalName: string;
  city: string;
  hospitalAddress: string;
  requiredDateTime: string;
  urgency: UrgencyOption;

  // Step 3: Contact & review
  contactNumber: string;
  preferredContact: string;
  additionalInfo: string;
  consentConfirmed: boolean;
}

const BLOOD_GROUPS = ["Select group", "A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

const RELATIONSHIPS = [
  "Family member",
  "Friend",
  "Self",
  "Hospital staff",
  "Other",
];

const PREFERRED_CONTACTS = [
  "WhatsApp message",
  "Phone call",
  "WhatsApp or Phone call",
];

export function CreateRequestStepFlow({
  onCancel,
  onPublish,
}: CreateRequestStepFlowProps) {
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);

  const [formData, setFormData] = useState<CreateRequestFormData>({
    patientName: "",
    bloodGroup: "O-",
    unitsRequired: 1,
    relationship: "Family member",
    hospitalName: "",
    city: "Ahmedabad",
    hospitalAddress: "",
    requiredDateTime: "",
    urgency: "immediate",
    contactNumber: "+91 98765 43210",
    preferredContact: "WhatsApp message",
    additionalInfo: "",
    consentConfirmed: true,
  });

  const [errorMsg, setErrorMsg] = useState<string>("");

  const handleNextStep = () => {
    setErrorMsg("");
    if (currentStep === 1) {
      if (!formData.patientName.trim()) {
        setErrorMsg("Please enter the patient's full name.");
        return;
      }
      if (formData.bloodGroup === "Select group" || !formData.bloodGroup) {
        setErrorMsg("Please select a required blood group.");
        return;
      }
      setCurrentStep(2);
    } else if (currentStep === 2) {
      if (!formData.hospitalName.trim()) {
        setErrorMsg("Please enter the hospital name.");
        return;
      }
      if (!formData.city.trim()) {
        setErrorMsg("Please enter the city.");
        return;
      }
      setCurrentStep(3);
    }
  };

  const handlePrevStep = () => {
    setErrorMsg("");
    if (currentStep === 2) setCurrentStep(1);
    if (currentStep === 3) setCurrentStep(2);
  };

  const handlePublish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.contactNumber.trim()) {
      setErrorMsg("Please enter a contact number.");
      return;
    }
    if (!formData.consentConfirmed) {
      setErrorMsg("Please confirm the consent checkbox to publish your request.");
      return;
    }

    const urgencyLabelMap: Record<UrgencyOption, string> = {
      immediate: "IMMEDIATE",
      within_12_hours: "WITHIN 12 HOURS",
      within_24_hours: "WITHIN 24 HOURS",
      scheduled: "SCHEDULED",
    };

    const newRequest: EmergencyRequestItem = {
      id: `custom-${Date.now()}`,
      code: `BR-${Math.floor(1000 + Math.random() * 9000)}`,
      urgency:
        formData.urgency === "scheduled" ? "within_24_hours" : formData.urgency,
      urgencyLabel: urgencyLabelMap[formData.urgency],
      bloodGroup: formData.bloodGroup,
      hospital: formData.hospitalName,
      city: formData.city,
      unitsNeeded: formData.unitsRequired || 1,
      requiredBy:
        formData.requiredDateTime ||
        (formData.urgency === "immediate"
          ? "Today, within 4 hours"
          : "Today, 6:00 PM"),
    };

    onPublish(newRequest);
  };

  return (
    <div className="w-full bg-white">
      {/* 1. Hero Section matching Image 1 */}
      <section className="w-full bg-[#FFF8F7] border-b border-[#F7EBEA] py-10 sm:py-12 md:py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back button */}
          <button
            type="button"
            onClick={onCancel}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-[#C72C36] mb-3 sm:mb-4 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Cancel and back to emergency requests</span>
          </button>

          {/* Eyebrow Label */}
          <span className="block text-xs font-bold tracking-[0.08em] uppercase text-[#C72C36] mb-2 sm:mb-2.5">
            CREATE REQUEST
          </span>

          {/* Main Headline */}
          <h1 className="text-3xl sm:text-4xl lg:text-[40px] font-semibold text-[#172033] tracking-tight leading-tight">
            Tell us what the patient needs
          </h1>

          {/* Subtitle */}
          <p className="mt-2 text-sm sm:text-base text-[#647085] font-normal leading-relaxed">
            We&apos;ll guide you through the essentials. You can review everything before publishing.
          </p>
        </div>
      </section>

      {/* 2. Main Form & Sidebar Section */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          {/* Main Card (Form) */}
          <div className="lg:col-span-8 xl:col-span-9 bg-white rounded-2xl sm:rounded-3xl border border-gray-200/90 shadow-2xs overflow-hidden">
            {/* Top Stepper Header matching Images 2, 3, 5 */}
            <div className="px-6 sm:px-8 pt-6 pb-5 border-b border-gray-100 bg-gray-50/50">
              <div className="flex items-center gap-6 sm:gap-10 overflow-x-auto scrollbar-none">
                {/* Step 1 Pill */}
                <div className="flex items-center gap-2.5 shrink-0">
                  <span
                    className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                      currentStep > 1
                        ? "bg-[#C72C36] text-white"
                        : currentStep === 1
                        ? "bg-[#C72C36] text-white"
                        : "bg-gray-200 text-gray-500"
                    }`}
                  >
                    {currentStep > 1 ? <Check className="w-3.5 h-3.5" /> : "1"}
                  </span>
                  <span
                    className={`text-xs sm:text-sm font-semibold ${
                      currentStep === 1
                        ? "text-gray-900"
                        : currentStep > 1
                        ? "text-gray-900"
                        : "text-gray-400"
                    }`}
                  >
                    Patient & blood
                  </span>
                </div>

                {/* Step 2 Pill */}
                <div className="flex items-center gap-2.5 shrink-0">
                  <span
                    className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                      currentStep > 2
                        ? "bg-[#C72C36] text-white"
                        : currentStep === 2
                        ? "bg-[#C72C36] text-white"
                        : "bg-gray-200 text-gray-500"
                    }`}
                  >
                    {currentStep > 2 ? <Check className="w-3.5 h-3.5" /> : "2"}
                  </span>
                  <span
                    className={`text-xs sm:text-sm font-semibold ${
                      currentStep === 2
                        ? "text-gray-900"
                        : currentStep > 2
                        ? "text-gray-900"
                        : "text-gray-400"
                    }`}
                  >
                    Hospital & timing
                  </span>
                </div>

                {/* Step 3 Pill */}
                <div className="flex items-center gap-2.5 shrink-0">
                  <span
                    className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                      currentStep === 3
                        ? "bg-[#C72C36] text-white"
                        : "bg-gray-200 text-gray-500"
                    }`}
                  >
                    3
                  </span>
                  <span
                    className={`text-xs sm:text-sm font-semibold ${
                      currentStep === 3 ? "text-gray-900" : "text-gray-400"
                    }`}
                  >
                    Contact & review
                  </span>
                </div>
              </div>
            </div>

            {/* Error Message */}
            {errorMsg && (
              <div className="mx-6 sm:mx-8 mt-5 p-3 rounded-xl bg-red-50 border border-red-200/80 text-xs sm:text-sm text-[#C72C36] font-medium">
                {errorMsg}
              </div>
            )}

            {/* Form Content */}
            <div className="p-6 sm:p-8">
              {/* STEP 1: Patient & blood (Image 2) */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  {/* Step Header */}
                  <div className="flex items-start gap-3.5">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#FFF1F2] text-[#C72C36]">
                      <User className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-gray-900 leading-snug">
                        Patient and blood requirement
                      </h2>
                      <p className="text-xs text-gray-400 font-normal mt-0.5">
                        Only include details necessary to find the right donor.
                      </p>
                    </div>
                  </div>

                  {/* 2x2 Input Fields */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 pt-1">
                    {/* Patient Name */}
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1.5">
                        Patient name
                      </label>
                      <input
                        type="text"
                        placeholder="Full name"
                        value={formData.patientName}
                        onChange={(e) =>
                          setFormData({ ...formData, patientName: e.target.value })
                        }
                        className="w-full h-11 px-3.5 text-sm text-gray-800 font-medium bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-[#C72C36] focus:ring-1 focus:ring-[#C72C36] transition-colors"
                      />
                    </div>

                    {/* Required blood group */}
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1.5">
                        Required blood group
                      </label>
                      <select
                        value={formData.bloodGroup}
                        onChange={(e) =>
                          setFormData({ ...formData, bloodGroup: e.target.value })
                        }
                        className="w-full h-11 px-3.5 text-sm text-gray-800 font-medium bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-[#C72C36] focus:ring-1 focus:ring-[#C72C36] transition-colors cursor-pointer"
                      >
                        {BLOOD_GROUPS.map((bg) => (
                          <option key={bg} value={bg}>
                            {bg}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Units required */}
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1.5">
                        Units required
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="20"
                        value={formData.unitsRequired}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            unitsRequired: parseInt(e.target.value) || 1,
                          })
                        }
                        className="w-full h-11 px-3.5 text-sm text-gray-800 font-medium bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-[#C72C36] focus:ring-1 focus:ring-[#C72C36] transition-colors"
                      />
                    </div>

                    {/* Relationship to patient */}
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1.5">
                        Relationship to patient
                      </label>
                      <select
                        value={formData.relationship}
                        onChange={(e) =>
                          setFormData({ ...formData, relationship: e.target.value })
                        }
                        className="w-full h-11 px-3.5 text-sm text-gray-800 font-medium bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-[#C72C36] focus:ring-1 focus:ring-[#C72C36] transition-colors cursor-pointer"
                      >
                        {RELATIONSHIPS.map((rel) => (
                          <option key={rel} value={rel}>
                            {rel}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Patient privacy notice box matching Image 2 */}
                  <div className="bg-[#FFF9EC] border border-[#FDE68A]/70 rounded-xl p-4 flex items-start gap-3 mt-4">
                    <Lock className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                    <div>
                      <span className="block text-xs font-bold text-amber-950">
                        Patient privacy matters
                      </span>
                      <p className="text-xs text-amber-900/90 leading-relaxed mt-0.5">
                        The patient&apos;s full name is only visible to verified responders and administrators.
                      </p>
                    </div>
                  </div>

                  {/* Bottom Action Bar */}
                  <div className="border-t border-gray-100 pt-5 mt-6 flex items-center justify-end">
                    <button
                      type="button"
                      onClick={handleNextStep}
                      className="inline-flex items-center gap-2 h-11 px-6 rounded-xl bg-[#C72C36] hover:bg-[#B2242D] text-white text-sm font-semibold shadow-xs active:scale-95 transition-all cursor-pointer"
                    >
                      <span>Continue</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 2: Hospital & timing (Images 3 & 4) */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  {/* Step Header */}
                  <div className="flex items-start gap-3.5">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#FFF1F2] text-[#C72C36]">
                      <Building2 className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-gray-900 leading-snug">
                        Hospital and timing
                      </h2>
                      <p className="text-xs text-gray-400 font-normal mt-0.5">
                        Donors use these details to plan safely.
                      </p>
                    </div>
                  </div>

                  {/* 2x2 Input Fields */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 pt-1">
                    {/* Hospital Name */}
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1.5">
                        Hospital name
                      </label>
                      <input
                        type="text"
                        placeholder="Search hospital"
                        value={formData.hospitalName}
                        onChange={(e) =>
                          setFormData({ ...formData, hospitalName: e.target.value })
                        }
                        className="w-full h-11 px-3.5 text-sm text-gray-800 font-medium bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-[#C72C36] focus:ring-1 focus:ring-[#C72C36] transition-colors"
                      />
                    </div>

                    {/* City */}
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1.5">
                        City
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Ahmedabad"
                        value={formData.city}
                        onChange={(e) =>
                          setFormData({ ...formData, city: e.target.value })
                        }
                        className="w-full h-11 px-3.5 text-sm text-gray-800 font-medium bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-[#C72C36] focus:ring-1 focus:ring-[#C72C36] transition-colors"
                      />
                    </div>

                    {/* Hospital address */}
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1.5">
                        Hospital address
                      </label>
                      <input
                        type="text"
                        placeholder="Area or street"
                        value={formData.hospitalAddress}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            hospitalAddress: e.target.value,
                          })
                        }
                        className="w-full h-11 px-3.5 text-sm text-gray-800 font-medium bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-[#C72C36] focus:ring-1 focus:ring-[#C72C36] transition-colors"
                      />
                    </div>

                    {/* Required date and time */}
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1.5">
                        Required date and time
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="mm/dd/yyyy --:-- --"
                          value={formData.requiredDateTime}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              requiredDateTime: e.target.value,
                            })
                          }
                          className="w-full h-11 pl-3.5 pr-10 text-sm text-gray-800 font-medium bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-[#C72C36] focus:ring-1 focus:ring-[#C72C36] transition-colors"
                        />
                        <Calendar className="absolute right-3.5 top-3.5 h-4 w-4 text-gray-400 pointer-events-none" />
                      </div>
                    </div>
                  </div>

                  {/* Urgency Section matching Image 4 */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-2.5">
                      Urgency
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      {/* Immediate */}
                      <button
                        type="button"
                        onClick={() =>
                          setFormData({ ...formData, urgency: "immediate" })
                        }
                        className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                          formData.urgency === "immediate"
                            ? "border-2 border-[#C72C36] bg-[#FFF5F5]"
                            : "border-gray-200 bg-white hover:border-gray-300"
                        }`}
                      >
                        <span className="block text-sm font-bold text-gray-900">
                          Immediate
                        </span>
                        <span className="block text-xs text-gray-500 mt-1">
                          Critical need as advised by hospital
                        </span>
                      </button>

                      {/* Within 12 hours */}
                      <button
                        type="button"
                        onClick={() =>
                          setFormData({ ...formData, urgency: "within_12_hours" })
                        }
                        className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                          formData.urgency === "within_12_hours"
                            ? "border-2 border-[#C72C36] bg-[#FFF5F5]"
                            : "border-gray-200 bg-white hover:border-gray-300"
                        }`}
                      >
                        <span className="block text-sm font-bold text-gray-900">
                          Within 12 hours
                        </span>
                        <span className="block text-xs text-gray-500 mt-1">
                          Select the closest accurate timeframe
                        </span>
                      </button>

                      {/* Within 24 hours */}
                      <button
                        type="button"
                        onClick={() =>
                          setFormData({ ...formData, urgency: "within_24_hours" })
                        }
                        className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                          formData.urgency === "within_24_hours"
                            ? "border-2 border-[#C72C36] bg-[#FFF5F5]"
                            : "border-gray-200 bg-white hover:border-gray-300"
                        }`}
                      >
                        <span className="block text-sm font-bold text-gray-900">
                          Within 24 hours
                        </span>
                        <span className="block text-xs text-gray-500 mt-1">
                          Select the closest accurate timeframe
                        </span>
                      </button>

                      {/* Scheduled */}
                      <button
                        type="button"
                        onClick={() =>
                          setFormData({ ...formData, urgency: "scheduled" })
                        }
                        className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                          formData.urgency === "scheduled"
                            ? "border-2 border-[#C72C36] bg-[#FFF5F5]"
                            : "border-gray-200 bg-white hover:border-gray-300"
                        }`}
                      >
                        <span className="block text-sm font-bold text-gray-900">
                          Scheduled
                        </span>
                        <span className="block text-xs text-gray-500 mt-1">
                          Select the closest accurate timeframe
                        </span>
                      </button>
                    </div>
                  </div>

                  {/* Bottom Action Bar */}
                  <div className="border-t border-gray-100 pt-5 mt-6 flex items-center justify-end gap-3">
                    <button
                      type="button"
                      onClick={handlePrevStep}
                      className="px-5 py-2.5 text-sm font-semibold text-gray-600 hover:text-gray-900 transition-colors cursor-pointer"
                    >
                      Back
                    </button>
                    <button
                      type="button"
                      onClick={handleNextStep}
                      className="inline-flex items-center gap-2 h-11 px-6 rounded-xl bg-[#C72C36] hover:bg-[#B2242D] text-white text-sm font-semibold shadow-xs active:scale-95 transition-all cursor-pointer"
                    >
                      <span>Continue</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 3: Contact & review (Images 5 & 6) */}
              {currentStep === 3 && (
                <form onSubmit={handlePublish} className="space-y-6">
                  {/* Step Header */}
                  <div className="flex items-start gap-3.5">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#FFF1F2] text-[#C72C36]">
                      <MessageSquare className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-gray-900 leading-snug">
                        Contact and consent
                      </h2>
                      <p className="text-xs text-gray-400 font-normal mt-0.5">
                        Choose how potential donors can reach you.
                      </p>
                    </div>
                  </div>

                  {/* 2 Inputs in Row 1 */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 pt-1">
                    {/* Contact Number */}
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1.5">
                        Contact number
                      </label>
                      <input
                        type="tel"
                        placeholder="+91 98765 43210"
                        value={formData.contactNumber}
                        onChange={(e) =>
                          setFormData({ ...formData, contactNumber: e.target.value })
                        }
                        className="w-full h-11 px-3.5 text-sm text-gray-800 font-medium bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-[#C72C36] focus:ring-1 focus:ring-[#C72C36] transition-colors"
                      />
                    </div>

                    {/* Preferred Contact */}
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1.5">
                        Preferred contact
                      </label>
                      <select
                        value={formData.preferredContact}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            preferredContact: e.target.value,
                          })
                        }
                        className="w-full h-11 px-3.5 text-sm text-gray-800 font-medium bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-[#C72C36] focus:ring-1 focus:ring-[#C72C36] transition-colors cursor-pointer"
                      >
                        {PREFERRED_CONTACTS.map((pc) => (
                          <option key={pc} value={pc}>
                            {pc}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Additional Information Textarea */}
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1.5">
                      Additional information
                    </label>
                    <textarea
                      rows={4}
                      placeholder="Ward, department, or useful instructions"
                      value={formData.additionalInfo}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          additionalInfo: e.target.value,
                        })
                      }
                      className="w-full p-3.5 text-sm text-gray-800 font-medium bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-[#C72C36] focus:ring-1 focus:ring-[#C72C36] transition-colors"
                    />
                  </div>

                  {/* Consent Checkbox */}
                  <div className="flex items-start gap-3 pt-1">
                    <input
                      type="checkbox"
                      id="consent-checkbox"
                      checked={formData.consentConfirmed}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          consentConfirmed: e.target.checked,
                        })
                      }
                      className="h-4 w-4 mt-0.5 rounded border-gray-300 text-[#C72C36] focus:ring-[#C72C36] cursor-pointer"
                    />
                    <label
                      htmlFor="consent-checkbox"
                      className="text-xs text-gray-600 leading-relaxed cursor-pointer select-none"
                    >
                      I confirm these details are accurate and consent to sharing request information with potential donors. I understand a response is not a confirmed donation.
                    </label>
                  </div>

                  {/* Bottom Action Bar matching user instruction: "button of last step will be like PUBLISH REQUEST" */}
                  <div className="border-t border-gray-100 pt-5 mt-6 flex items-center justify-end gap-3">
                    <button
                      type="button"
                      onClick={handlePrevStep}
                      className="px-5 py-2.5 text-sm font-semibold text-gray-600 hover:text-gray-900 transition-colors cursor-pointer"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      className="inline-flex items-center gap-2 h-11 px-7 rounded-xl bg-[#C72C36] hover:bg-[#B2242D] text-white text-sm font-semibold shadow-xs active:scale-95 transition-all cursor-pointer"
                    >
                      <span>Publish request</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>

          {/* Right Sidebar Card: Safe by design / Share-ready / Need help (Images 2, 3, 5) */}
          <div className="lg:col-span-4 xl:col-span-3">
            <div className="bg-white rounded-2xl sm:rounded-3xl border border-gray-200/90 p-6 lg:p-7 shadow-xs sticky top-28 space-y-6">
              {/* Feature 1: Safe by design */}
              <div className="space-y-1.5">
                <div className="text-[#C72C36] mb-2">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h4 className="text-sm font-bold text-gray-900">
                  Safe by design
                </h4>
                <p className="text-xs text-gray-500 leading-relaxed">
                  Phone numbers and patient details are never shown publicly.
                </p>
              </div>

              {/* Feature 2: Share-ready */}
              <div className="space-y-1.5">
                <div className="text-[#C72C36] mb-2">
                  <MessageCircle className="w-6 h-6" />
                </div>
                <h4 className="text-sm font-bold text-gray-900">
                  Share-ready
                </h4>
                <p className="text-xs text-gray-500 leading-relaxed">
                  After publishing, review a concise message before sharing it.
                </p>
              </div>

              {/* Feature 3: Need help call support */}
              <div className="border-t border-gray-100 pt-5">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-red-50 text-[#C72C36] flex items-center justify-center shrink-0">
                    <PhoneCall className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="block text-[11px] text-gray-400 font-medium">
                      Need help?
                    </span>
                    <span className="block text-xs sm:text-sm font-bold text-gray-900">
                      Call support: 1800 000 124
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default CreateRequestStepFlow;
