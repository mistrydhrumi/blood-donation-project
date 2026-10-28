
import type { Metadata } from "next";
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
    <main className="flex h-screen w-full flex-col overflow-hidden bg-white lg:flex-row">
      <div className="flex shrink-0 items-center justify-between border-b border-gray-100 bg-white px-6 py-4 lg:hidden">
        <Brand className="text-gray-900" />
      </div>

      <section className="relative hidden h-full overflow-hidden lg:flex lg:w-1/2">
        <AuthHeroPanel />
      </section>

      <section className="h-full flex-1 overflow-y-auto bg-white">
        <div className="min-h-full flex flex-col justify-center py-8 sm:py-12">
          <AuthFormFlow />
        </div>
      </section>
    </main>
  );
}
