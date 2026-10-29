"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Menu, X, Droplets } from "lucide-react";

export interface NavbarProps {
  activePath?: string;
}

export function Navbar({ activePath = "/" }: NavbarProps) {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 8);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "Find Donors", href: "/donors" },
    { label: "Emergency Requests", href: "/requests" },
    { label: "Blood Banks", href: "/blood-banks" },
    { label: "About us", href: "/about" },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 w-full transition-all duration-200 ${isScrolled
          ? "bg-white/95 backdrop-blur-md border-b border-gray-200/80 shadow-xs"
          : "bg-white/95 backdrop-blur-md border-b border-gray-100"
          }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-18 sm:h-20">
            {/* Brand Logo */}
            <Link
              href="/"
              className="flex items-center gap-2.5 select-none transition-opacity hover:opacity-95"
              aria-label="BloodSetu home"
            >
              <span className="flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-red-700 text-white shadow-sm">
                <Droplets className="w-5 h-5 sm:w-5.5 sm:h-5.5" fill="currentColor" />
              </span>
              <span className="text-xl sm:text-2xl font-bold tracking-tight">
                <span className="text-gray-900">Blood</span>
                <span className="text-red-700">Setu</span>
              </span>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-7 lg:gap-8">
              {navLinks.map((link) => {
                const isActive = link.href === activePath;
                return (
                  <Link
                    key={link.label}
                    href={link.href}
                    className={`text-sm font-medium transition-colors hover:text-red-800 ${isActive ? "text-red-700 font-semibold" : "text-gray-600"
                      }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>

            {/* Right Action Buttons */}
            <div className="hidden md:flex items-center gap-4">
              <Link
                href="/login"
                onClick={(e) => {
                  e.preventDefault();
                  router.push("/login");
                }}
                className="text-sm font-semibold text-gray-800 hover:text-red-800 px-3.5 py-2 rounded-lg transition-colors cursor-pointer select-none"
                aria-label="Navigate to login page"
              >
                Login
              </Link>

              <Link
                href="/profile-setup"
                onClick={(e) => {
                  e.preventDefault();
                  router.push("/profile-setup");
                }}
                className="inline-flex items-center justify-center rounded-xl bg-red-700 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-red-800 hover:shadow active:scale-95 cursor-pointer"
              >
                Become a donor
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <div className="flex md:hidden">
              <button
                type="button"
                onClick={() => setMobileMenuOpen((prev) => !prev)}
                className="inline-flex items-center justify-center rounded-lg p-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900 focus:outline-none"
                aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              >
                {mobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Drawer Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-b border-gray-100 bg-white px-4 pt-3 pb-6 shadow-lg animate-in fade-in slide-in-from-top-2 duration-200">
            <nav className="flex flex-col gap-2.5 pb-4 border-b border-gray-100">
              {navLinks.map((link) => {
                const isActive = link.href === activePath;
                return (
                  <Link
                    key={link.label}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`px-3 py-2 rounded-lg text-base font-medium transition-colors ${isActive
                      ? "bg-red-50 text-red-700 font-semibold"
                      : "text-gray-700 hover:bg-gray-50 hover:text-red-800"
                      }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>

            <div className="flex flex-col gap-2.5 pt-4">
              <Link
                href="/login"
                onClick={(e) => {
                  e.preventDefault();
                  setMobileMenuOpen(false);
                  router.push("/login");
                }}
                className="flex h-11 w-full items-center justify-center rounded-xl border border-gray-200 text-sm font-semibold text-gray-800 hover:bg-gray-50 transition-colors cursor-pointer"
              >
                Login
              </Link>

              <Link
                href="/profile-setup"
                onClick={(e) => {
                  e.preventDefault();
                  setMobileMenuOpen(false);
                  router.push("/profile-setup");
                }}
                className="flex h-11 w-full items-center justify-center rounded-xl bg-red-700 text-sm font-semibold text-white shadow-sm hover:bg-red-800 transition-colors cursor-pointer"
              >
                Become a donor
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Spacer to preserve layout height and avoid page jump with fixed navbar */}
      <div className="h-18 sm:h-20 w-full shrink-0" aria-hidden="true" />
    </>
  );
}

export default Navbar;
