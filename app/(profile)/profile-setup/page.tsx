import type { Metadata } from "next";

import { ProfileSetup } from "@/components/profile/ProfileSetup";

export const metadata: Metadata = {
  title: "Profile Setup | BloodBridge",
  description:
    "Complete your BloodBridge profile to connect with donors and requesters.",
};

export default function ProfileSetupPage() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-100">
      <main className="flex-1 w-full bg-slate-100 flex items-start justify-center pb-12">
        <div className="w-full max-w-2xl">
          <ProfileSetup />
        </div>
      </main>
    </div>
  );
}
