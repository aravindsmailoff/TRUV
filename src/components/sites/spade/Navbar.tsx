"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShieldCheck, Heart, BarChart3, User, Building2, Landmark, Bot, LogOut, Globe, Code2, Factory, PackageCheck } from "lucide-react";
import { Magnet } from "@/components/reactbits/Magnet";
import { IntelligenceConsoleModal } from "./IntelligenceConsoleModal";
import { getCurrentSessionUser, setCurrentSessionUser, RegisteredUser } from "@/lib/auth/authStore";

export function Navbar() {
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [solutionsOpen, setSolutionsOpen] = useState(false);
  const [companyOpen, setCompanyOpen] = useState(false);
  const [consoleOpen, setConsoleOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<RegisteredUser | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);

    const handleAuthChange = () => {
      setCurrentUser(getCurrentSessionUser());
    };
    handleAuthChange();
    window.addEventListener("truv-auth-changed", handleAuthChange);

    // Stealth Backdoor Entrance Shortcut: Ctrl+Shift+A or Cmd+Shift+A
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === "A" || e.key === "a")) {
        e.preventDefault();
        router.push("/admin");
      }
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("truv-auth-changed", handleAuthChange);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [router]);

  return (
    <header
      className={`sticky inset-x-0 top-0 z-50 h-16 w-full bg-white transition-all ${
        isScrolled ? "shadow-black/5 shadow-md" : ""
      }`}
    >
      <div className="max-w-[80rem] mx-auto px-5 lg:px-8 h-full">
        <div className="flex h-full items-center justify-between gap-x-8">
          {/* Brand Logo */}
          <Link href="/" aria-label="Back to Home" className="inline-block text-[#18280E] cursor-pointer">
            <span className="text-3xl font-black tracking-tight">TRUVX<span className="text-[#79a83e]">.</span></span>
          </Link>

          {/* Desktop Nav */}
          <nav aria-label="Main navigation" className="max-lg:hidden">
            <ul className="flex gap-x-10 items-center">
              {/* Solutions */}
              <li
                className="relative"
                onMouseEnter={() => setSolutionsOpen(true)}
                onMouseLeave={() => setSolutionsOpen(false)}
              >
                <button
                  type="button"
                  aria-expanded={solutionsOpen}
                  className="text-15px-btn hover:text-[#3f7308] cursor-pointer transition-colors inline-flex items-center gap-x-1.5"
                >
                  <span>Solutions</span>
                  <div className={`w-2 h-1.5 shrink-0 transition-transform duration-200 ${solutionsOpen ? "rotate-180" : ""}`}>
                    <svg viewBox="0 0 22 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                      <path d="M2.0326 15.6442L0 13.5799L0 2.0643L2.0326 0L21.48 7.27606L21.48 8.36816L2.0326 15.6442Z" fill="currentColor" transform="rotate(90 11 8)" />
                    </svg>
                  </div>
                </button>

                {solutionsOpen && (
                  <div className="absolute top-full left-0 w-[480px] bg-white rounded-2xl shadow-xl border border-stone-200/80 p-4 space-y-2 animate-in fade-in slide-in-from-top-1 duration-150">
                    <div className="text-[10px] font-mono tracking-wider text-stone-400 uppercase font-bold px-2 mb-1">
                      Platform Solutions by Trade Role
                    </div>

                    {/* 1. Indian Manufacturers */}
                    <Link
                      href="/solutions/manufacturer"
                      onClick={() => setSolutionsOpen(false)}
                      className="group flex items-start gap-3.5 p-3 rounded-xl hover:bg-[#f4faed] transition-colors border border-transparent hover:border-[#d8e5ca]"
                    >
                      <div className="w-10 h-10 rounded-xl bg-[#ebf7d9] border border-[#d8e5ca] flex items-center justify-center text-[#18280e] group-hover:bg-[#18280e] group-hover:text-[#b2eb76] transition-all shrink-0 shadow-xs">
                        <Building2 className="w-5 h-5 stroke-[1.75]" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-stone-900 group-hover:text-[#18280e] flex items-center gap-2">
                          <span>Indian Manufacturers</span>
                          <span className="text-[9px] font-mono px-1.5 py-0.5 rounded-full bg-[#ebf7d9] text-[#284905] font-bold">
                            Goods Export
                          </span>
                        </div>
                        <p className="text-[11px] text-stone-500 leading-snug mt-0.5">
                          Discover export opportunities and manage buyer requests and orders.
                        </p>
                      </div>
                    </Link>

                    {/* 2. Foreign Buyers */}
                    <Link
                      href="/solutions/buyer"
                      onClick={() => setSolutionsOpen(false)}
                      className="group flex items-start gap-3.5 p-3 rounded-xl hover:bg-[#f4faed] transition-colors border border-transparent hover:border-[#d8e5ca]"
                    >
                      <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200/80 flex items-center justify-center text-blue-800 group-hover:bg-blue-900 group-hover:text-white transition-all shrink-0 shadow-xs">
                        <Globe className="w-5 h-5 stroke-[1.75]" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-stone-900 group-hover:text-[#18280e] flex items-center gap-2">
                          <span>Foreign Buyers</span>
                          <span className="text-[9px] font-mono px-1.5 py-0.5 rounded-full bg-blue-50 text-blue-700 font-bold">
                            Global Sourcing
                          </span>
                        </div>
                        <p className="text-[11px] text-stone-500 leading-snug mt-0.5">
                          Explore Indian manufacturers, sourcing requests and quotations.
                        </p>
                      </div>
                    </Link>

                    {/* 3. Freelancers & IT Agencies */}
                    <Link
                      href="/solutions/service"
                      onClick={() => setSolutionsOpen(false)}
                      className="group flex items-start gap-3.5 p-3 rounded-xl hover:bg-[#f4faed] transition-colors border border-transparent hover:border-[#d8e5ca]"
                    >
                      <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200/80 flex items-center justify-center text-emerald-800 group-hover:bg-[#18280e] group-hover:text-[#b2eb76] transition-all shrink-0 shadow-xs">
                        <Code2 className="w-5 h-5 stroke-[1.75]" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-stone-900 group-hover:text-[#18280e] flex items-center gap-2">
                          <span>Freelancers &amp; IT Agencies</span>
                          <span className="text-[9px] font-mono px-1.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold">
                            Service Export
                          </span>
                        </div>
                        <p className="text-[11px] text-stone-500 leading-snug mt-0.5">
                          Explore opportunities for international service providers.
                        </p>
                      </div>
                    </Link>
                  </div>
                )}
              </li>

              {/* Customers */}
              <li>
                <Link href="/#customers" className="inline-block text-15px-btn hover:text-[#3f7308] cursor-pointer transition-colors">
                  <span>Workflows</span>
                </Link>
              </li>

              {/* Company */}
              <li
                className="relative"
                onMouseEnter={() => setCompanyOpen(true)}
                onMouseLeave={() => setCompanyOpen(false)}
              >
                <button
                  type="button"
                  aria-expanded={companyOpen}
                  className="text-15px-btn hover:text-[#3f7308] cursor-pointer transition-colors inline-flex items-center gap-x-1.5"
                >
                  <span>Company</span>
                  <div className={`w-2 h-1.5 shrink-0 transition-transform duration-200 ${companyOpen ? "rotate-180" : ""}`}>
                    <svg viewBox="0 0 22 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                      <path d="M2.0326 15.6442L0 13.5799L0 2.0643L2.0326 0L21.48 7.27606L21.48 8.36816L2.0326 15.6442Z" fill="currentColor" transform="rotate(90 11 8)" />
                    </svg>
                  </div>
                </button>

                {companyOpen && (
                  <div className="absolute top-full left-0 w-44 bg-white rounded-2xl shadow-xl border border-stone-200/80 p-2 space-y-1 animate-in fade-in slide-in-from-top-1 duration-150">
                    <Link href="/#trade-execution" className="block px-3 py-1.5 text-xs font-medium text-stone-800 hover:bg-[#f4faed] rounded-lg">
                      About
                    </Link>
                    <Link href="/solutions/manufacturer" className="block px-3 py-1.5 text-xs font-medium text-stone-800 hover:bg-[#f4faed] rounded-lg">
                      Manufacturers
                    </Link>
                    <Link href="/solutions/buyer" className="block px-3 py-1.5 text-xs font-medium text-stone-800 hover:bg-[#f4faed] rounded-lg">
                      Buyers
                    </Link>
                  </div>
                )}
              </li>

              {/* Docs */}
              <li>
                <Link
                  href="/#trade-execution"
                  className="inline-block text-15px-btn hover:text-[#3f7308] cursor-pointer transition-colors"
                >
                  <span>How it works</span>
                </Link>
              </li>
            </ul>
          </nav>

          {/* Right Button / Auth CTAs */}
          <div className="flex items-center gap-x-3 max-lg:hidden">
            {currentUser ? (
              <div className="flex items-center gap-x-3">
                <Link
                  href="/dashboard"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#f4faed] border border-[#d8e5ca] text-xs font-mono font-medium text-[#18280e] hover:bg-[#ebf7d9] transition-colors"
                >
                  <span className="w-2 h-2 rounded-full bg-[#18280e] animate-pulse" />
                  <span className="font-semibold">{currentUser.name}</span>
                  <span className="text-[#4a5b38]">({currentUser.role.toUpperCase()})</span>
                </Link>

                {currentUser.role === "admin" && (
                  <Link
                    href="/admin"
                    className="text-[11px] font-mono font-bold text-amber-900 bg-amber-50 border border-amber-200 px-2 py-1 rounded hover:bg-amber-100 transition-colors"
                    title="Administrative Compliance & Whitelist Console"
                  >
                    Backdoor Desk
                  </Link>
                )}

                <button
                  type="button"
                  onClick={() => setCurrentSessionUser(null)}
                  className="inline-flex items-center gap-1 text-xs font-mono font-semibold text-rose-700 bg-rose-50 border border-rose-200 px-2.5 py-1.5 rounded hover:bg-rose-100 transition-colors cursor-pointer"
                  title="Sign out of TRUV"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-x-2">
                <Link
                  href="/signin"
                  className="px-3.5 py-2 text-xs font-mono font-semibold text-[#18280e] hover:text-[#3f7308] transition-colors"
                >
                  Sign In
                </Link>
                <Magnet padding={20} magnetStrength={3}>
                  <Link
                    href="/signup"
                    className="group relative inline-flex appearance-none items-center py-2 select-none transition-[color] justify-center text-white min-h-[36px] px-4 cursor-pointer"
                  >
                    <span className="absolute inset-0 rounded-md transition-[background-color,transform] group-hover:scale-[0.98] origin-center bg-[#18280e] group-hover:bg-[#253d16]" />
                    <span className="text-xs font-mono font-semibold relative z-10 tracking-tight">Request Access</span>
                  </Link>
                </Magnet>
              </div>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            type="button"
            aria-label="Open menu"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="grid cursor-pointer lg:hidden p-1"
          >
            <div className="col-start-1 row-start-1 my-auto flex h-[22px] w-[38px] flex-col items-end justify-between">
              <span className="h-0.5 w-full bg-black" />
              <span className="h-0.5 w-6 bg-black/40" />
              <span className="h-0.5 w-6 bg-black/40" />
            </div>
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-stone-200 px-6 py-6 space-y-3 shadow-lg font-mono text-xs">
          <div className="text-[10px] text-stone-400 font-bold uppercase tracking-wider">
            Trade Solutions by Role
          </div>
          <Link
            href="/solutions/manufacturer"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2.5 py-2 text-stone-800 font-bold hover:text-[#3f7308]"
          >
            <div className="w-6 h-6 rounded-md bg-[#ebf7d9] flex items-center justify-center text-[#18280e]">
              <Building2 className="w-3.5 h-3.5" />
            </div>
            <span>Indian Manufacturers</span>
          </Link>
          <Link
            href="/solutions/buyer"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2.5 py-2 text-stone-800 font-bold hover:text-[#3f7308]"
          >
            <div className="w-6 h-6 rounded-md bg-blue-50 flex items-center justify-center text-blue-800">
              <Globe className="w-3.5 h-3.5" />
            </div>
            <span>Foreign Buyers</span>
          </Link>
          <Link
            href="/solutions/service"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2.5 py-2 text-stone-800 font-bold hover:text-[#3f7308]"
          >
            <div className="w-6 h-6 rounded-md bg-emerald-50 flex items-center justify-center text-emerald-800">
              <Code2 className="w-3.5 h-3.5" />
            </div>
            <span>Freelancers &amp; IT Agencies</span>
          </Link>
          <div className="pt-2 border-t border-stone-100">
            <Link href="/#customers" onClick={() => setMobileMenuOpen(false)} className="block py-1 text-stone-600">
              Customers
            </Link>
          </div>
          <div className="pt-3 border-t border-stone-200 space-y-2">
            {currentUser ? (
              <>
                <Link
                  href="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-sm font-semibold text-[#18280e] py-1"
                >
                  Dashboard ({currentUser.name})
                </Link>
                {currentUser.role === "admin" && (
                  <Link
                    href="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block text-sm font-mono font-bold text-amber-900 bg-amber-50 px-2 py-1 rounded"
                  >
                    Backdoor Console
                  </Link>
                )}
                <button
                  type="button"
                  onClick={() => {
                    setCurrentSessionUser(null);
                    setMobileMenuOpen(false);
                  }}
                  className="block text-left w-full text-sm font-semibold text-rose-700 py-1"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/signin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-sm font-semibold text-[#18280e] py-1"
                >
                  Sign In
                </Link>
                <Link
                  href="/signup"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-center mt-2 w-full py-2.5 rounded-md text-xs font-mono font-semibold bg-[#18280e] text-[#b2eb76]"
                >
                  Request Whitelisted Access
                </Link>
              </>
            )}
          </div>
        </div>
      )}

      {/* Global Transaction Intelligence Console Modal */}
      <IntelligenceConsoleModal isOpen={consoleOpen} onClose={() => setConsoleOpen(false)} />
    </header>
  );
}
