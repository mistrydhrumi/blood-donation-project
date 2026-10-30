import type { Metadata } from "next";
import "./globals.css";
import { Geist } from "next/font/google";
import Header from "@/components/common/header";
import Footer from "@/components/common/footer";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "BloodSetu - Blood Donation Platform",
  description: "Connecting blood donors and requesters quickly and securely.",
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased font-sans">
      <body className="min-h-full flex flex-col bg-white">
        <Header activePath="/" />
        {children}
        <Footer />
      </body>
    </html>
  );
}
