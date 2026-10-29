import type { Metadata } from "next";
import "./globals.css";

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
      <body className="min-h-full flex flex-col bg-white">{children}</body>
    </html>
  );
}
