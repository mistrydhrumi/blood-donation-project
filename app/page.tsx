import type { Metadata } from "next";
import HeroSection from "@/components/landing/HeroSection";
import QuickDonorSearch from "@/components/landing/QuickDonorSearch";
import BloodGroupSearch from "@/components/landing/BloodGroupSearch";
import EmergencyRequests from "@/components/landing/EmergencyRequests";
import CommunityImpact from "@/components/landing/CommunityImpact";
import DonationAwareness from "@/components/landing/DonationAwareness";

export const metadata: Metadata = {
  title: "BloodSetu - Connect with Blood Donors & Save Lives",
  description:
    "Find nearby blood donors, share urgent requests, and coordinate safely—all in a few simple steps.",
};

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col bg-white text-gray-900 selection:bg-red-500 selection:text-white">
      <HeroSection />

      <QuickDonorSearch />

      <BloodGroupSearch />

      <EmergencyRequests />

      <CommunityImpact />

      <DonationAwareness />
    </main>
  );
}
