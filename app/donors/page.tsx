import type { Metadata } from "next";
import { Suspense } from "react";
import { DonorHero } from "@/components/donors/DonorHero";
import { DonorDirectory } from "@/components/donors/DonorDirectory";

export const metadata: Metadata = {
  title: "Find a Blood Donor Near You | BloodBridge",
  description:
    "Search privacy-protected profiles and connect directly with donors who have opted in.",
};

export default function FindDonorsPage() {
  return (
    <main className="min-h-screen flex flex-col bg-white">
      {/* 1. Exact Hero Header from Image 1 */}
      <DonorHero />

      {/* 2. Interactive Directory with Sidebar Filters & Donor Cards from Image 2 */}
      <Suspense
        fallback={
          <div className="w-full bg-gray-50 min-h-[500px] flex items-center justify-center">
            <div className="flex items-center gap-2.5 text-gray-500 text-sm font-medium">
              <span className="h-5 w-5 border-2 border-red-700 border-t-transparent rounded-full animate-spin" />
              <span>Loading donors directory...</span>
            </div>
          </div>
        }
      >
        <DonorDirectory />
      </Suspense>
    </main>
  );
}

