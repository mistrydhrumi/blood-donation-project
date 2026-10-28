import type { Metadata } from "next";
import { Navbar } from "@/components/landing/Navbar";
import { ProfileSetup } from "@/components/profile/ProfileSetup";

export const metadata: Metadata = {
  title: "Profile Setup | BloodBridge",
  description: "Complete your BloodBridge profile to connect with donors and requesters.",
};

export default function ProfileSetupPage() {
  return (
    <>
      {/* Shared navbar across all three steps */}
      <Navbar activePath="/profile-setup" />

      <main className="w-full bg-slate-100 flex items-start justify-center ">
        <div className="w-full max-w-2xl">
          <ProfileSetup />
        </div>
      </main>
    </>
  );
}
