import { Metadata } from "next";
import { AuthHeroPanel } from "@/components/auth/AuthHeroPanel";
import { AuthFormFlow } from "@/components/auth/AuthFormFlow";
import { Brand } from "@/components/auth/BrandLogo";

export const metadata: Metadata = {
  title: "Login | BloodSetu - Blood Donation Platform",
  description:
    "Log in to BloodSetu to connect with blood donors and requesters quickly and securely.",
};

export default function LoginPage() {
  return (
    <main className="h-screen w-full flex flex-col lg:flex-row bg-white overflow-hidden">
      {/* Mobile Header (visible only on small screens) */}
      <div className="lg:hidden shrink-0 flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-white">
        <Brand className="text-gray-900" />
      </div>

      {/* Left Column: Hero Branding & Trust Panel */}
      <section className="hidden lg:flex lg:w-1/2 h-full relative overflow-hidden">
        <AuthHeroPanel />
      </section>

      {/* Right Column: Phone Authentication & Verification Code Flow */}
      <section className="flex-1 h-full flex items-center justify-center bg-white overflow-y-auto lg:overflow-hidden py-4">
        <AuthFormFlow />
      </section>
    </main>
  );
}
