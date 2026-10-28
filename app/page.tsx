import type { Metadata } from "next";
import { LandingPage } from "@/components/landing/LandingPage";

export const metadata: Metadata = {
  title: "BloodSetu - Connect with Blood Donors & Save Lives",
  description:
    "Find nearby blood donors, share urgent requests, and coordinate safely—all in a few simple steps.",
};

export default function Home() {
  return <LandingPage />;
}
