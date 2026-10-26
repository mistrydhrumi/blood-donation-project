"use client";

import React, { useState } from "react";
import { PhoneLoginForm } from "./PhoneLoginForm";
import { OtpVerificationForm } from "./OtpVerificationForm";

export function AuthFormFlow() {
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [phoneNumber, setPhoneNumber] = useState("9876543210");

  const handlePhoneSubmit = (phone: string) => {
    setPhoneNumber(phone || "9876543210");
    setStep("otp");
  };

  const handleBackToPhone = () => {
    setStep("phone");
  };

  return (
    <div className="w-full flex items-center justify-center transition-all duration-300">
      {step === "phone" ? (
        <PhoneLoginForm onSuccess={handlePhoneSubmit} />
      ) : (
        <OtpVerificationForm
          phoneNumber={phoneNumber}
          onBack={handleBackToPhone}
        />
      )}
    </div>
  );
}
