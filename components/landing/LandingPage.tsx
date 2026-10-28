"use client";

import React from "react";
import { Navbar } from "./Navbar";
import { HeroSection } from "./HeroSection";
import { QuickDonorSearch } from "./QuickDonorSearch";
import { BloodGroupSearch } from "./BloodGroupSearch";
import { EmergencyRequests } from "./EmergencyRequests";
import { CommunityImpact } from "./CommunityImpact";
import { DonationAwareness } from "./DonationAwareness";
import { Footer } from "./Footer";

export function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-900 selection:bg-red-500 selection:text-white">
      {/* Top Navigation */}
      <Navbar activePath="/" />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col">
        {/* Hero Section */}
        <HeroSection />

        {/* Quick Donor Search Card (Image 2) */}
        <QuickDonorSearch />

        {/* Search by blood group Section */}
        <BloodGroupSearch />

        {/* Nearby emergency requests Section */}
        <EmergencyRequests />

        {/* Community Impact Statistics Section */}
        <CommunityImpact />

        {/* Donation Awareness Guidance Section */}
        <DonationAwareness />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default LandingPage;
