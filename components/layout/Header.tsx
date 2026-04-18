"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Logo } from "@/components/Logo";

const NAV = [
  { label: "Features", href: "/#features" },
  { label: "How it works", href: "/#how-it-works" },
  { label: "Pricing", href: "/#pricing" },
  { label: "Dashboard", href: "/dashboard" },
];

export function Header() {
  const pathname = usePathname();
  const isDashboard = pathname?.startsWith("/dashboard");
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-[#0a0f1e] border-b border-slate-200/80 dark:border-slate-800/60">
      <div className="mx-auto flex h-[56px] max-w-[1100px] items-center justify-between px-6 lg:px-10">

        {/* Logo */}
        <Link href="/" className="shrink-0 text-slate-900 dark:text-white">
          <Logo size={30} wordmark className="text-slate-900 dark:text-white" />
        </Link>

        {/* Center nav — desktop */}
        {!isDashboard && (
          <nav className="hidden md:flex items-center gap-7">
            {NAV.map((l) => (
              <Link
                key={l.label}
                href={l.href}
                className="text-[13.5px] text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors duration-150"
              >
                {l.label}
              </Link>
            ))}
          </nav>
        )}

        {/* Right side */}
        <div className="flex items-center gap-2.5">
          <ThemeToggle />

          {isDashboard ? (
            <Link href="/" className="text-[13px] text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors">
              ← Home
            </Link>
          ) : (
            <>
              {/* Sign in — desktop */}
              <Link
                href="/login"
                id="header-signin-btn"
                className="hidden md:inline-flex items-center text-[13px] font-medium text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white px-3.5 py-[7px] rounded-[7px] border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all duration-150"
              >
                Sign in
              </Link>

              {/* Generate Invoice CTA */}
              <Link href="/invoice" id="header-cta-btn">
                <span className="inline-flex items-center text-[13px] font-medium px-4 py-[7px] rounded-[7px] bg-[#185FA5] hover:bg-[#1a6ab8] text-white transition-colors duration-150 cursor-pointer">
                  Generate Invoice
                </span>
              </Link>
            </>
          )}

          {/* Mobile hamburger */}
          <button
            onClick={() => setOpen((v) => !v)}
            className="md:hidden flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400"
            aria-label="Toggle menu"
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Mobile nav */}
      {open && (
        <div className="md:hidden border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-[#0a0f1e] px-6 py-3 space-y-0.5">
          {!isDashboard && NAV.map((l) => (
            <Link key={l.label} href={l.href} onClick={() => setOpen(false)}
              className="block py-2 text-[13.5px] text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            >
              {l.label}
            </Link>
          ))}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 mt-1 space-y-2">
            <Link href="/login" onClick={() => setOpen(false)} className="block py-2 text-[13px] text-slate-600 dark:text-slate-400">Sign in</Link>
            <Link href="/invoice" onClick={() => setOpen(false)}>
              <span className="block text-center py-2 rounded-[7px] text-[13px] font-medium bg-[#185FA5] text-white">Generate Invoice</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
