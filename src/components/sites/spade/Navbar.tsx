"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShieldCheck, Heart, BarChart3, User, Building2, Landmark, Bot, LogOut } from "lucide-react";
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
            <svg width="133" height="22" viewBox="0 0 133 22" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M9.30957 0C14.8953 0 18.3086 2.13921 18.3086 6.41699L17.998 6.72266H13.0332L12.7227 6.41699C12.7227 5.19477 11.7921 4.27734 9.30957 4.27734C6.82702 4.27734 5.58594 4.88911 5.58594 6.11133C5.58608 7.33332 6.82707 7.63881 8.99902 7.94434L11.1719 8.25C17.688 9.16668 18.9296 11.9165 18.9297 15.2773C18.9297 18.6384 16.447 21.9999 9.62012 22C3.41393 22 0.000216012 19.5557 0 14.9727L0.310547 14.667H5.27539L5.58594 14.9727C5.58613 16.8057 6.82747 17.7227 9.62012 17.7227C12.1025 17.7226 13.6543 17.1107 13.6543 15.583C13.6541 14.0555 12.4123 13.7499 10.2402 13.4443L8.06836 13.1387C1.55181 12.222 0.310606 9.16681 0.310547 6.11133C0.310547 2.75022 3.10319 1.6036e-06 9.30957 0ZM68.877 0.305664C76.6349 0.305664 79.7383 4.27778 79.7383 11C79.7383 17.7222 76.6349 21.6943 68.877 21.6943V21.6963H61.1191L60.8086 21.3906V0.611328L61.1191 0.305664H68.877ZM98.2656 0.611328V4.58301L97.9551 4.88867H87.7148L87.4043 5.19434V8.25L87.7148 8.55566H97.335L97.6445 8.86133V12.833L97.335 13.1387H87.7148L87.4043 13.4443V16.8057L87.7148 17.1113H97.9551L98.2656 17.417V21.3887L97.9551 21.6943V21.6963H82.1289L81.8184 21.3906V0.611328L82.1289 0.305664H98.2656ZM31.3281 0.305664C35.9828 0.305664 39.0867 2.74984 39.0869 7.02734V10.3926C39.0868 14.6702 35.9828 17.1143 31.3281 17.1143L26.7354 17.1113L26.4248 17.417V21.3887L26.1143 21.6943H21.1494L20.8389 21.3887V0.614258L21.1494 0.305664H31.3281ZM51.8711 0.611328L58.6982 17.417V21.3887L58.3877 21.6943H54.6641L54.3535 21.3887L53.1123 18.0273L52.4912 17.7227H45.3545L44.7334 18.0273L43.4922 21.3887L43.1816 21.6943H39.458L39.1484 21.3887V17.417L45.9746 0.611328L46.2852 0.305664H51.5605L51.8711 0.611328ZM66.3945 5.19434V16.8057L66.7051 17.1113H69.1875C72.601 17.1113 74.1523 15.8889 74.1523 11C74.1523 6.11111 72.601 4.88867 69.1875 4.88867H66.7051L66.3945 5.19434ZM46.5957 12.833L46.9062 13.1387H50.9404L51.25 12.833L49.0781 7.02734H48.7676L46.5957 12.833ZM26.4248 5.19434V12.2227L26.7354 12.5273H31.3281V12.5312C32.5693 12.5312 33.5009 12.2256 33.501 10.3926V7.02734C33.5008 5.1944 32.5693 4.88867 31.3281 4.88867H26.7354L26.4248 5.19434ZM106.387 0.305664L107.18 1.08594L104.385 8.55566H103.966L101.171 1.08594L101.964 0.305664H106.387Z"
                fill="#18280E"
              />
            </svg>
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
                  <div className="absolute top-full left-0 w-[580px] bg-white rounded-2xl shadow-xl border border-stone-200/80 p-6 grid grid-cols-2 gap-6 animate-in fade-in slide-in-from-top-1 duration-150">
                    <div>
                      <div className="text-[11px] font-mono tracking-wider text-stone-500 uppercase mb-3 font-semibold">
                        Use Cases
                      </div>
                      <div className="space-y-1">
                        <Link
                          href="/use-case/risk-authorization"
                          className="group flex items-start gap-3 p-2 rounded-xl hover:bg-[#f4faed] transition-colors"
                        >
                          <div className="w-7 h-7 rounded-lg bg-[#f0fae6] flex items-center justify-center text-[#18280e] group-hover:bg-[#b2eb76]/40 transition-colors">
                            <ShieldCheck className="w-3.5 h-3.5" />
                          </div>
                          <div>
                            <div className="text-xs font-semibold text-stone-900 group-hover:text-[#18280e]">Risk &amp; Authorization</div>
                            <div className="text-[11px] text-stone-500">Automate real-time decisioning</div>
                          </div>
                        </Link>
                        <Link
                          href="/#rewards"
                          className="group flex items-start gap-3 p-2 rounded-xl hover:bg-[#f4faed] transition-colors"
                        >
                          <div className="w-7 h-7 rounded-lg bg-[#f0fae6] flex items-center justify-center text-[#18280e] group-hover:bg-[#b2eb76]/40 transition-colors">
                            <Heart className="w-3.5 h-3.5" />
                          </div>
                          <div>
                            <div className="text-xs font-semibold text-stone-900 group-hover:text-[#18280e]">Rewards &amp; Attribution</div>
                            <div className="text-[11px] text-stone-500">Reward the right spend, right away</div>
                          </div>
                        </Link>
                        <Link
                          href="/#analytics"
                          className="group flex items-start gap-3 p-2 rounded-xl hover:bg-[#f4faed] transition-colors"
                        >
                          <div className="w-7 h-7 rounded-lg bg-[#f0fae6] flex items-center justify-center text-[#18280e] group-hover:bg-[#b2eb76]/40 transition-colors">
                            <BarChart3 className="w-3.5 h-3.5" />
                          </div>
                          <div>
                            <div className="text-xs font-semibold text-stone-900 group-hover:text-[#18280e]">Analytics &amp; AI</div>
                            <div className="text-[11px] text-stone-500">Turn messy data into intelligence</div>
                          </div>
                        </Link>
                        <Link
                          href="/#user-experience"
                          className="group flex items-start gap-3 p-2 rounded-xl hover:bg-[#f4faed] transition-colors"
                        >
                          <div className="w-7 h-7 rounded-lg bg-[#f0fae6] flex items-center justify-center text-[#18280e] group-hover:bg-[#b2eb76]/40 transition-colors">
                            <User className="w-3.5 h-3.5" />
                          </div>
                          <div>
                            <div className="text-xs font-semibold text-stone-900 group-hover:text-[#18280e]">User Experience</div>
                            <div className="text-[11px] text-stone-500">Improve transaction visibility</div>
                          </div>
                        </Link>
                      </div>
                    </div>

                    <div className="border-l border-stone-200/60 pl-6">
                      <div className="text-[11px] font-mono tracking-wider text-stone-500 uppercase mb-3 font-semibold">
                        Industries
                      </div>
                      <div className="space-y-1">
                        <Link href="/#industries" className="group flex items-start gap-3 p-2 rounded-xl hover:bg-[#f4faed] transition-colors">
                          <div className="w-7 h-7 rounded-lg bg-[#f0fae6] flex items-center justify-center text-[#18280e]">
                            <Building2 className="w-3.5 h-3.5" />
                          </div>
                          <div>
                            <div className="text-xs font-semibold text-stone-900">Fintechs</div>
                            <div className="text-[11px] text-stone-500">Build with clean transaction data</div>
                          </div>
                        </Link>
                        <Link href="/#industries" className="group flex items-start gap-3 p-2 rounded-xl hover:bg-[#f4faed] transition-colors">
                          <div className="w-7 h-7 rounded-lg bg-[#f0fae6] flex items-center justify-center text-[#18280e]">
                            <Landmark className="w-3.5 h-3.5" />
                          </div>
                          <div>
                            <div className="text-xs font-semibold text-stone-900">Banks</div>
                            <div className="text-[11px] text-stone-500">Modernize your data foundation</div>
                          </div>
                        </Link>
                        <Link href="/#industries" className="group flex items-start gap-3 p-2 rounded-xl hover:bg-[#f4faed] transition-colors">
                          <div className="w-7 h-7 rounded-lg bg-[#f0fae6] flex items-center justify-center text-[#18280e]">
                            <Bot className="w-3.5 h-3.5" />
                          </div>
                          <div>
                            <div className="text-xs font-semibold text-stone-900">AI</div>
                            <div className="text-[11px] text-stone-500">Intelligent financial automation</div>
                          </div>
                        </Link>
                      </div>
                    </div>
                  </div>
                )}
              </li>

              {/* Customers */}
              <li>
                <Link href="/customers" className="inline-block text-15px-btn hover:text-[#3f7308] cursor-pointer transition-colors">
                  <span>Customers</span>
                </Link>
              </li>

              {/* Sponsor Infrastructure & Trade Console */}
              <li>
                <Link
                  href="/dashboard"
                  className="inline-flex items-center gap-1.5 text-15px-btn text-[#18280e] hover:text-[#3f7308] font-bold cursor-pointer transition-colors bg-[#b2eb76]/40 hover:bg-[#b2eb76] px-3 py-1.5 rounded-lg border border-[#3f7308]/30"
                  title="Live PayPal, Elastic, Zapier & Astropods Execution Rails"
                >
                  <span>Sponsor Rails (PayPal &amp; Elastic)</span>
                  <span className="size-2 rounded-full bg-[#18280e] animate-pulse" />
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
                    <Link href="https://spade.com/about/" target="_blank" className="block px-3 py-1.5 text-xs font-medium text-stone-800 hover:bg-[#f4faed] rounded-lg">
                      About
                    </Link>
                    <Link href="https://spade.com/careers/" target="_blank" className="block px-3 py-1.5 text-xs font-medium text-stone-800 hover:bg-[#f4faed] rounded-lg">
                      Careers
                    </Link>
                    <Link href="https://spade.com/security/" target="_blank" className="block px-3 py-1.5 text-xs font-medium text-stone-800 hover:bg-[#f4faed] rounded-lg">
                      Security
                    </Link>
                  </div>
                )}
              </li>

              {/* Docs */}
              <li>
                <Link
                  href="https://docs.spade.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block text-15px-btn hover:text-[#3f7308] cursor-pointer transition-colors"
                >
                  <span>Docs</span>
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
        <div className="lg:hidden bg-white border-b border-stone-200 px-6 py-6 space-y-4 shadow-lg">
          <Link href="/use-case/risk-authorization" onClick={() => setMobileMenuOpen(false)} className="block text-sm font-medium py-1">
            Risk &amp; Authorization
          </Link>
          <Link href="/customers" onClick={() => setMobileMenuOpen(false)} className="block text-sm font-medium py-1">
            Customers
          </Link>
          <Link
            href="/dashboard"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-bold text-[#18280e] bg-[#b2eb76]/40 px-3 py-1.5 rounded-md"
          >
            Sponsor Rails (PayPal &amp; Elastic)
          </Link>
          <Link href="https://docs.spade.com/" target="_blank" className="block text-sm font-medium py-1">
            Docs
          </Link>
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
