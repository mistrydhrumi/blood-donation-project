import type { Metadata } from "next";
import "./globals.css";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

export const metadata: Metadata = {
  title: "BloodSetu - Blood Donation Platform",
  description: "Connecting blood donors and requesters quickly and securely.",
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={cn("h-full antialiased font-sans", "font-sans", geist.variable)}>
      <body className="h-full flex flex-col">{children}</body>
    </html>
  );
}
