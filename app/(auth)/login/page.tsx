
import type { Metadata } from "next";
import { AuthHeroPanel } from "@/components/auth/AuthHeroPanel";
import { SignInForm } from "@/components/auth/SignInForm";
import { Brand } from "@/components/auth/BrandLogo";

export const metadata: Metadata = {
    title: "Login | BloodSetu",
    description: "Sign in to your BloodSetu account.",
};

export default function LoginPage() {
    return (
        <main className="flex h-screen w-full flex-col overflow-hidden bg-white lg:flex-row">
            <div className="flex shrink-0 items-center justify-between border-b border-gray-100 px-6 py-4 lg:hidden">
                <Brand className="text-gray-900" />
            </div>

            <section className="relative hidden h-full overflow-hidden lg:flex lg:w-1/2">
                <AuthHeroPanel />
            </section>

            <section className="flex flex-1 items-center justify-center overflow-y-auto bg-white py-4">
                <SignInForm />
            </section>
        </main>
    );
}
