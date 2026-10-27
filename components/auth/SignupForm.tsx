
"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  ShieldCheck,
  Mail,
  User,
  Phone,
  Lock,
  Eye,
  EyeOff,
} from "lucide-react";
import { supabase } from "@/lib/supabase/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function SignupForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [emailSent, setEmailSent] = useState(false);
  const [isError, setIsError] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setLoading(true);
    setMessage("");
    setIsError(false);

    try {
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: {
            full_name: name.trim(),
            phone: phone.trim(),
          },
          emailRedirectTo: `${window.location.origin}/login`,
        },
      });

      if (error) {
        throw error;
      }

      if (data.session) {
        window.location.assign("/");
        return;
      }

      setEmailSent(true);
      setMessage(
        "Your account has been created. Please check your email and click the confirmation link to continue."
      );
    } catch (error: unknown) {
      setIsError(true);
      setMessage(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  if (emailSent) {
    return (
      <div className="mx-auto flex w-full max-w-[420px] flex-col justify-center px-6 py-8">
        <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-red-50">
          <Mail className="h-7 w-7 text-[#C52227]" />
        </div>

        <h2 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
          Confirm your email
        </h2>

        <p className="mt-3 text-sm leading-6 text-gray-500">
          We've sent a confirmation link to{" "}
          <span className="font-semibold text-gray-800">{email}</span>.
          Open the email and click the link to activate your account.
        </p>

        <p className="mt-5 text-sm text-green-700" role="status">
          {message}
        </p>

        <button
          type="button"
          onClick={() => {
            setEmailSent(false);
            setMessage("");
          }}
          className="mt-6 text-left text-sm font-medium text-[#C52227] hover:underline"
        >
          Back to sign up
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-[420px] flex-col justify-center px-6 py-6 sm:py-8">
      <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#C52227] sm:text-xs">
        Welcome to BloodSetu
      </span>

      <h2 className="mb-1 mt-1.5 text-2xl font-bold leading-tight tracking-tight text-gray-900 sm:text-3xl xl:text-[32px]">
        Create your account
      </h2>

      <p className="mb-5 text-xs font-normal text-gray-500 sm:text-sm">
        Fill in your details to get started with BloodSetu.
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
        <div className="space-y-1.5">
          <Label htmlFor="name" className="text-xs font-medium text-gray-700">
            Full Name
          </Label>
          <Input
            id="name"
            type="text"
            autoComplete="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="John Doe"
            required
            prefixElement={
              <div className="flex h-full select-none items-center border-r border-gray-200 bg-gray-50/60 px-3.5 text-gray-400">
                <User className="h-4 w-4" />
              </div>
            }
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="email" className="text-xs font-medium text-gray-700">
            Email address
          </Label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="name@example.com"
            required
            prefixElement={
              <div className="flex h-full select-none items-center border-r border-gray-200 bg-gray-50/60 px-3.5 text-gray-400">
                <Mail className="h-4 w-4" />
              </div>
            }
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="phone" className="text-xs font-medium text-gray-700">
            Phone number
          </Label>
          <Input
            id="phone"
            type="tel"
            autoComplete="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+91 98765 43210"
            required
            prefixElement={
              <div className="flex h-full select-none items-center border-r border-gray-200 bg-gray-50/60 px-3.5 text-gray-400">
                <Phone className="h-4 w-4" />
              </div>
            }
          />
        </div>

        <div className="space-y-1.5">
          <Label
            htmlFor="password"
            className="text-xs font-medium text-gray-700"
          >
            Password
          </Label>
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            minLength={6}
            required
            prefixElement={
              <div className="flex h-full select-none items-center border-r border-gray-200 bg-gray-50/60 px-3.5 text-gray-400">
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
          className="mt-2 flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#C52227] py-3.5 text-sm font-medium text-white shadow-sm transition-all hover:bg-[#B01B20] hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
        >
          <span>{loading ? "Creating account..." : "Create account"}</span>
          {!loading && <ArrowRight className="h-4 w-4" />}
        </Button>

        {message && (
          <p
            role="alert"
            className={`text-sm ${isError ? "text-red-600" : "text-green-700"}`}
          >
            {message}
          </p>
        )}
      </form>

      <div className="relative my-5 flex items-center justify-center xl:my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-200" />
        </div>
        <div className="relative flex items-center gap-1.5 bg-white px-3 text-[11px] font-medium uppercase tracking-wider text-gray-400">
          <ShieldCheck className="h-3.5 w-3.5" />
          <span>Safe &amp; secure</span>
        </div>
      </div>

      <p className="text-center text-xs leading-relaxed text-gray-400">
        By continuing, you agree to our{" "}
        <Link
          href="/terms"
          className="text-gray-500 underline underline-offset-2 hover:text-gray-900"
        >
          Terms of Use
        </Link>{" "}
        and{" "}
        <Link
          href="/privacy"
          className="text-gray-500 underline underline-offset-2 hover:text-gray-900"
        >
          Privacy Policy
        </Link>
        .
      </p>
    </div>
  );
}
