
"use client";

import { useState } from "react";
import Link from "next/link";
import {
    ArrowRight,
    Mail,
    Lock,
    Eye,
    EyeOff,
    ShieldCheck,
} from "lucide-react";

import { supabase } from "@/lib/supabase/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function SignInForm() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [isError, setIsError] = useState(false);

    const handleSubmit = async (
        e: React.FormEvent<HTMLFormElement>
    ) => {
        e.preventDefault();

        setLoading(true);
        setMessage("");
        setIsError(false);

        try {
            const { error } = await supabase.auth.signInWithPassword({
                email: email.trim(),
                password,
            });

            if (error) {
                throw error;
            }

            window.location.assign("/");
        } catch (error: unknown) {
            setIsError(true);
            setMessage(
                error instanceof Error
                    ? error.message
                    : "Unable to sign in. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="mx-auto flex w-full max-w-[420px] flex-col justify-center px-6 py-6 sm:py-8">
            <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#C52227] sm:text-xs">
                Welcome back to BloodSetu
            </span>

            <h2 className="mb-1 mt-2 text-2xl font-bold leading-tight tracking-tight text-gray-900 sm:text-3xl">
                Sign in to your account
            </h2>

            <p className="mb-6 mt-1 text-sm text-gray-500">
                Enter your email and password to continue.
            </p>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div className="space-y-1.5">
                    <Label htmlFor="signin-email" className="text-xs font-medium text-gray-700">
                        Email address
                    </Label>

                    <Input
                        id="signin-email"
                        type="email"
                        autoComplete="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="name@example.com"
                        required
                        prefixElement={
                            <div className="flex h-full items-center border-r border-gray-200 bg-gray-50/60 px-3.5 text-gray-400">
                                <Mail className="h-4 w-4" />
                            </div>
                        }
                    />
                </div>

                <div className="space-y-1.5">
                    <Label htmlFor="signin-password" className="text-xs font-medium text-gray-700">
                        Password
                    </Label>

                    <Input
                        id="signin-password"
                        type={showPassword ? "text" : "password"}
                        autoComplete="current-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password"
                        required
                        prefixElement={
                            <div className="flex h-full items-center border-r border-gray-200 bg-gray-50/60 px-3.5 text-gray-400">
                                <Lock className="h-4 w-4" />
                            </div>
                        }
                        suffixElement={
                            <button
                                type="button"
                                onClick={() => setShowPassword((prev) => !prev)}
                                className="cursor-pointer p-1 text-gray-400 transition-colors hover:text-gray-600"
                                aria-label={showPassword ? "Hide password" : "Show password"}
                            >
                                {showPassword ? (
                                    <EyeOff className="h-4 w-4" />
                                ) : (
                                    <Eye className="h-4 w-4" />
                                )}
                            </button>
                        }
                    />
                </div>

                <Button
                    type="submit"
                    size="lg"
                    disabled={loading}
                    className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-[#C52227] py-3.5 text-sm font-medium text-white shadow-sm transition-all hover:bg-[#B01B20] disabled:cursor-not-allowed disabled:opacity-60"
                >
                    <span>{loading ? "Signing in..." : "Sign in"}</span>
                    {!loading && <ArrowRight className="h-4 w-4" />}
                </Button>

                {message && (
                    <p
                        role="alert"
                        className={`text-sm ${isError ? "text-red-600" : "text-green-700"
                            }`}
                    >
                        {message}
                    </p>
                )}
            </form>

            <div className="relative my-6 flex items-center justify-center">
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200" />
                </div>

                <div className="relative flex items-center gap-1.5 bg-white px-3 text-[11px] font-medium uppercase tracking-wider text-gray-400">
                    <ShieldCheck className="h-3.5 w-3.5" />
                    <span>Safe &amp; secure</span>
                </div>
            </div>

            <p className="text-center text-sm text-gray-500">
                Don&apos;t have an account?{" "}
                <Link
                    href="/signup"
                    className="font-medium text-[#C52227] hover:underline"
                >
                    Create account
                </Link>
            </p>
        </div>
    );
}
