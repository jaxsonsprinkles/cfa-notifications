import type { Metadata } from "next";
import { DM_Sans, DM_Mono } from "next/font/google";
import Navbar from "@/components/Navbar";

import "./globals.css";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const dmMono = DM_Mono({
  variable: "--font-dm-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "CFA Notifications",
  description: "Helps CFA leaders manage notification emails",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${dmSans.variable} ${dmMono.variable} antialiased min-h-screen`}
        style={{ fontFamily: "var(--font-dm-sans), system-ui, sans-serif" }}
      >
        <Navbar />
        <main className="max-w-4xl mx-auto px-4 pb-10">{children}</main>
      </body>
    </html>
  );
}
