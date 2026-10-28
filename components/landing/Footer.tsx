import React from "react";
import Link from "next/link";
import { ShieldCheck, Droplets } from "lucide-react";

export function Footer() {
  const exploreLinks = [
    { label: "Find donors", href: "/donors" },
    { label: "Emergency requests", href: "/requests" },
    { label: "Blood banks", href: "/blood-banks" },
  ];

  const companyLinks = [
    { label: "About us", href: "/about" },
    { label: "Privacy policy", href: "/privacy" },
    { label: "Terms of use", href: "/terms" },
  ];

  return (
    <footer className="bg-[#0B1327] text-white pt-16 sm:pt-20 pb-12 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main 4-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 pb-14 sm:pb-16">
          {/* Column 1: Brand & Mission Statement */}
          <div className="lg:col-span-5 flex flex-col justify-between">
            <div>
              {/* Brand Logo */}
              <Link
                href="/"
                className="inline-flex items-center gap-3 select-none transition-opacity hover:opacity-95"
                aria-label="BloodSetu home"
              >
                <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-[#C52227] text-white shadow-sm">
                  <Droplets className="w-5 h-5" fill="currentColor" />
                </span>
                <span className="text-xl sm:text-[22px] font-bold tracking-tight">
                  <span className="text-white">Blood</span>
                  <span className="text-[#C52227]">Setu</span>
                </span>
              </Link>

              {/* Tagline */}
              <p className="mt-5 text-sm text-slate-400 leading-relaxed max-w-sm">
                A trusted bridge between people who need blood and those ready to help.
              </p>
            </div>

            {/* Privacy Badge */}
            <div className="mt-6 flex items-center gap-2 text-xs text-slate-400">
              <ShieldCheck className="w-4 h-4 text-slate-400 flex-shrink-0" />
              <span>Privacy-first donor connections</span>
            </div>
          </div>

          {/* Column 2: Explore */}
          <div className="lg:col-span-2">
            <h3 className="text-sm font-semibold text-white tracking-wide">
              Explore
            </h3>
            <ul className="mt-5 space-y-3.5">
              {exploreLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-slate-400 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Company */}
          <div className="lg:col-span-2">
            <h3 className="text-sm font-semibold text-white tracking-wide">
              Company
            </h3>
            <ul className="mt-5 space-y-3.5">
              {companyLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-slate-400 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: In an emergency */}
          <div className="lg:col-span-3">
            <h3 className="text-sm font-semibold text-white tracking-wide">
              In an emergency
            </h3>
            <p className="mt-5 text-sm text-slate-400 leading-relaxed">
              Always contact your hospital or local emergency service first. BloodSetu does not replace medical advice.
            </p>
          </div>
        </div>

        {/* Bottom Bar Divider */}
        <div className="pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>© 2025 BloodSetu</p>
          <p>Built for safer, faster connections</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
