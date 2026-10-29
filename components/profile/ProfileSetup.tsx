"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle } from "lucide-react";

import {
  profileStepOneSchema,
  profileStepTwoSchema,
  profileStepThreeSchema,
  profileSetupSchema,
  type ProfileStepOneData,
  type ProfileStepTwoData,
  type ProfileStepThreeData,
  type ProfileSetupData,
} from "@/lib/validations/profile";
import { getProfileFormData, upsertProfile } from "@/services/profile.service";

import { StepIndicator } from "@/components/profile/StepIndicator";
import { ProfileStepOne } from "@/components/profile/ProfileStepOne";
import { ProfileStepTwo } from "@/components/profile/ProfileStepTwo";
import { ProfileStepThree } from "@/components/profile/ProfileStepThree";
import { ProfileNavigation } from "@/components/profile/ProfileNavigation";
import { Button } from "@/components/ui/button";

/* ── Default states ─────────────────────────────────────────────────── */

const DEFAULT_STEP1: ProfileStepOneData = { role: "both" };

const DEFAULT_STEP2: ProfileStepTwoData = {
  fullName: "",
  city: "",
  state: "",
  pincode: "",
};

const DEFAULT_STEP3: ProfileStepThreeData = {
  bloodGroup: "O+",
  lastDonationDate: "",
  weight: undefined as unknown as number,
  age: undefined as unknown as number,
  gender: undefined as unknown as (typeof import("@/lib/validations/profile").GENDERS)[number],
  disease: "",
  isAvailable: true,
};

/* ── Error-collection helper ────────────────────────────────────────── */

type FieldErrors<T> = Partial<Record<keyof T, string>>;

function collectErrors<T>(result: {
  error?: { issues: { path: PropertyKey[]; message: string }[] } | undefined;
}): FieldErrors<T> {
  const errors: FieldErrors<T> = {};
  if (!result.error) return errors;
  for (const issue of result.error.issues) {
    const rawKey = issue.path[0];
    if (rawKey === undefined || typeof rawKey === "symbol") continue;
    const key = rawKey as keyof T;
    if (!errors[key]) errors[key] = issue.message;
  }
  return errors;
}

/* ══════════════════════════════════════════════════════════════════════ */

export function ProfileSetup() {
  const router = useRouter();

  const [step, setStep] = useState(1);
  const [step1, setStep1] = useState<ProfileStepOneData>(DEFAULT_STEP1);
  const [step2, setStep2] = useState<ProfileStepTwoData>(DEFAULT_STEP2);
  const [step3, setStep3] = useState<ProfileStepThreeData>(DEFAULT_STEP3);

  const [errors1, setErrors1] = useState<FieldErrors<ProfileStepOneData>>({});
  const [errors2, setErrors2] = useState<FieldErrors<ProfileStepTwoData>>({});
  const [errors3, setErrors3] = useState<FieldErrors<ProfileStepThreeData>>({});

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  /* ── Fetch profile data from service on mount ──────────────────────── */

  useEffect(() => {
    async function loadProfile() {
      const initial = await getProfileFormData();
      if (!initial) return;

      if (initial.step1) setStep1((prev) => ({ ...prev, ...initial.step1 }));
      if (initial.step2) setStep2((prev) => ({ ...prev, ...initial.step2 }));
      if (initial.step3) setStep3((prev) => ({ ...prev, ...initial.step3 }));
    }

    loadProfile();
  }, []);

  /* ── Change handlers ─────────────────────────────────────────────── */

  const handleChange1 = useCallback((partial: Partial<ProfileStepOneData>) => {
    setStep1((p) => ({ ...p, ...partial }));
    setErrors1((p) => {
      const n = { ...p };
      for (const k of Object.keys(partial) as (keyof ProfileStepOneData)[]) delete n[k];
      return n;
    });
  }, []);

  const handleChange2 = useCallback((partial: Partial<ProfileStepTwoData>) => {
    setStep2((p) => ({ ...p, ...partial }));
    setErrors2((p) => {
      const n = { ...p };
      for (const k of Object.keys(partial) as (keyof ProfileStepTwoData)[]) delete n[k];
      return n;
    });
  }, []);

  const handleChange3 = useCallback((partial: Partial<ProfileStepThreeData>) => {
    setStep3((p) => ({ ...p, ...partial }));
    setErrors3((p) => {
      const n = { ...p };
      for (const k of Object.keys(partial) as (keyof ProfileStepThreeData)[]) delete n[k];
      return n;
    });
  }, []);

  /* ── Navigation ──────────────────────────────────────────────────── */

  const handleBack = () => { if (step > 1) setStep((s) => s - 1); };

  const handleNext = async () => {
    if (step === 1) {
      const r = profileStepOneSchema.safeParse(step1);
      if (!r.success) { setErrors1(collectErrors<ProfileStepOneData>(r)); return; }
      setErrors1({});
      setStep(2);
      return;
    }

    if (step === 2) {
      const r = profileStepTwoSchema.safeParse(step2);
      if (!r.success) { setErrors2(collectErrors<ProfileStepTwoData>(r)); return; }
      setErrors2({});
      setStep(3);
      return;
    }

    if (step === 3) {
      const r3 = profileStepThreeSchema.safeParse(step3);
      if (!r3.success) { setErrors3(collectErrors<ProfileStepThreeData>(r3)); return; }
      setErrors3({});

      const combined: ProfileSetupData = { ...step1, ...step2, ...step3 };
      const finalResult = profileSetupSchema.safeParse(combined);
      if (!finalResult.success) {
        setSubmitError("Please review all fields before submitting.");
        return;
      }
      await handleSubmit(finalResult.data);
    }
  };

  /* ── Supabase upsert ─────────────────────────────────────────────── */

  const handleSubmit = async (data: ProfileSetupData) => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const { error: upsertErr } = await upsertProfile(data);

      if (upsertErr) {
        if (upsertErr.code === "42501") {
          setSubmitError("Permission denied. Please make sure you are signed in and try again.");
        } else if (upsertErr.code === "42703") {
          setSubmitError(
            "One or more profile fields are missing from the database. Please verify your table schema."
          );
        } else {
          setSubmitError(upsertErr.message || "An error occurred while saving your profile. Please try again.");
        }
        return;
      }

      setSuccess(true);
    } catch (err: unknown) {
      setSubmitError(
        err instanceof Error ? err.message : "An unexpected error occurred. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  /* ── Success screen ──────────────────────────────────────────────── */

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center text-center py-14 px-6">
        <div className="flex items-center justify-center w-16 h-16 rounded-full bg-green-50 mb-5">
          <CheckCircle className="w-9 h-9 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Profile created!</h2>
        <p className="text-sm text-gray-500 mb-8 max-w-sm">
          Your BloodBridge profile is all set. You can update it any time from your profile settings.
        </p>
        <Button
          onClick={() => router.push("/")}
          size="lg"
          className="bg-red-700 hover:bg-red-800 text-white font-semibold rounded-xl px-8"
        >
          Go to home
        </Button>
      </div>
    );
  }

  /* ── Main render ─────────────────────────────────────────────────── */

  return (
    <div className="w-full max-w-2xl mx-auto px-4 sm:px-6 py-6 sm:py-10 flex flex-col gap-6">
      <StepIndicator currentStep={step} totalSteps={3} />

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-6 sm:px-10 py-8 sm:py-10">
        {step === 1 && <ProfileStepOne data={step1} errors={errors1} onChange={handleChange1} />}
        {step === 2 && <ProfileStepTwo data={step2} errors={errors2} onChange={handleChange2} />}
        {step === 3 && <ProfileStepThree data={step3} errors={errors3} onChange={handleChange3} />}

        {submitError && (
          <div className="mt-5 flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 px-4 py-3">
            <svg className="w-4 h-4 text-red-600 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
            </svg>
            <p className="text-xs text-red-700 font-medium">{submitError}</p>
          </div>
        )}

        <ProfileNavigation
          step={step}
          totalSteps={3}
          onBack={handleBack}
          onNext={handleNext}
          isLoading={isSubmitting}
          nextLabel={step === 3 ? "Complete setup" : "Continue"}
          className="mt-8"
        />
      </div>
    </div>
  );
}
