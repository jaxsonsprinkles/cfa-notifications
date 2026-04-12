"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BellRing } from "lucide-react";

const navLinks = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Members", href: "/members" },
  { label: "Events", href: "/events" },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <header
      className="sticky top-0 z-50 w-full mb-6"
      style={{
        background: "oklch(1.0 0 0 / 0.85)",
        backdropFilter: "blur(12px)",
        borderBottom: "1px solid oklch(0.93 0.008 75)",
        boxShadow: "0 1px 12px 0 hsl(0 0 0 / 0.07)",
      }}
    >
      <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
        {/* Brand */}
        <Link href="/dashboard" className="flex items-center gap-2 group">
          <div
            className="flex items-center justify-center w-8 h-8 rounded-lg"
            style={{ background: "oklch(0.4984 0.1887 20.4719)" }}
          >
            <BellRing className="w-4 h-4 text-white" />
          </div>
          <span
            className="font-semibold text-sm tracking-tight"
            style={{ color: "oklch(0.22 0.04 265)" }}
          >
            CFA Notifications
          </span>
        </Link>

        {/* Nav links */}
        <nav className="flex items-center gap-1">
          {navLinks.map(({ label, href }) => {
            const active = pathname === href || pathname.startsWith(href + "/");
            return (
              <Link
                key={href}
                href={href}
                className="px-3 py-1.5 rounded-md text-sm font-medium transition-colors"
                style={{
                  color: active
                    ? "oklch(0.4984 0.1887 20.4719)"
                    : "oklch(0.45 0.03 265)",
                  background: active
                    ? "oklch(0.4984 0.1887 20.4719 / 0.08)"
                    : "transparent",
                }}
              >
                {label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
