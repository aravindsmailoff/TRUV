"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Globe,
  Building2,
  ShieldCheck,
  ArrowLeft,
  Clock,
  ArrowRight,
} from "lucide-react";
import { Magnet } from "@/components/reactbits/Magnet";
import { registerNewUser } from "@/lib/auth/authStore";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [role, setRole] = useState<"buyer" | "manufacturer">("buyer");
  const [country, setCountry] = useState("United States");
  const [iecCode, setIecCode] = useState("");
  const [gstin, setGstin] = useState("");

  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !companyName) {
      setErrorMsg("Please fill in all required fields.");
      return;
    }

    const result = registerNewUser({
      name,
      email,
      password: password || "password123",
      companyName,
      role,
      country,
      iecCode: role === "manufacturer" ? iecCode : undefined,
      gstin: role === "manufacturer" ? gstin : undefined,
    });

    if (!result.success) {
      setErrorMsg("An account with this email address already exists.");
      return;
    }

    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[#f4faed] text-[#18280e] flex flex-col justify-between font-sans selection:bg-[#b2eb76] selection:text-[#18280e]">
      {/* Top Navbar */}
      <header className="h-16 bg-white border-b border-black/10 px-5 lg:px-8 flex items-center justify-between">
        <Link href="/" className="inline-flex items-center gap-2 group">
          <span className="size-3 rounded-full bg-[#3f7308] group-hover:bg-[#b2eb76] transition-colors" />
          <span className="font-bold text-lg tracking-tight text-[#18280e]">TRUVX</span>
          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#ebf7d9] text-[#3f7308] font-bold">
            TRADE OPERATOR
          </span>
        </Link>

        <Link
          href="/"
          className="text-xs font-mono text-stone-600 hover:text-black flex items-center gap-1.5 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Home</span>
        </Link>
      </header>

      {/* Main Container */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-10">
        <div className="w-full max-w-xl">
          {/* Main Card with Chamfered Cut Corners */}
          <div
            className="relative bg-white p-6 sm:p-8 rounded-2xl border border-stone-200/80 shadow-xl overflow-hidden"
            style={{ "--corner-size-desktop": "17px", "--corner-size-mobile": "13px" } as React.CSSProperties}
          >
            {/* Cut Corners */}
            <div className="pointer-events-none absolute inset-0 z-20">
              <div className="cut-corner absolute bg-[#f4faed]" style={{ top: "-1px", left: "-1px", clipPath: "polygon(0 0, 100% 0, 0 100%)" }} />
              <div className="cut-corner absolute bg-[#f4faed]" style={{ top: "-1px", right: "-1px", clipPath: "polygon(0 0, 100% 0, 100% 100%)" }} />
              <div className="cut-corner absolute bg-[#f4faed]" style={{ bottom: "-1px", left: "-1px", clipPath: "polygon(0 0, 0 100%, 100% 100%)" }} />
              <div className="cut-corner absolute bg-[#f4faed]" style={{ bottom: "-1px", right: "-1px", clipPath: "polygon(100% 0, 0 100%, 100% 100%)" }} />
            </div>

            {/* Submission State Screen */}
            {submitted ? (
              <div className="py-6 text-center space-y-5">
                <div className="size-16 mx-auto rounded-full bg-[#ebf7d9] text-[#3f7308] flex items-center justify-center shadow-inner">
                  <Clock className="w-8 h-8 animate-pulse" />
                </div>

                <div className="space-y-2">
                  <div className="inline-block px-3 py-1 rounded-full bg-[#ebf7d9] text-xs font-mono font-bold text-[#3f7308]">
                    APPLICATION SUBMITTED — PENDING WHITELIST
                  </div>
                  <h2 className="text-2xl font-bold text-[#18280e] tracking-tight">
                    Registration Under Administrative Review
                  </h2>
                  <p className="text-xs sm:text-sm text-stone-600 font-mono max-w-md mx-auto leading-relaxed">
                    Thank you, <strong>{name}</strong>. Access to TRUV is strictly gated for authenticated trade counterparties.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-[#f4faed] border border-[#d8e5ca] text-xs font-mono text-left space-y-2 text-stone-700">
                  <div className="flex items-center gap-2 font-bold text-[#18280e]">
                    <ShieldCheck className="w-4 h-4 text-[#3f7308]" />
                    <span>Whitelisting Verification Process</span>
                  </div>
                  <p className="leading-relaxed text-[11px] text-stone-600">
                    The TRUV trade compliance admin will verify your business credentials for <strong>{companyName}</strong>. Once whitelisted, your access will be activated and an approval confirmation email will be dispatched to <strong>{email}</strong>.
                  </p>
                </div>

                <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                  <Link
                    href="/signin"
                    className="w-full sm:w-auto px-5 py-2.5 rounded-md bg-[#18280e] text-[#b2eb76] font-semibold text-xs inline-flex items-center justify-center gap-2 hover:bg-[#18280e]/90 transition-all shadow-sm"
                  >
                    <span>Proceed to Sign In</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>

                  <Link
                    href="/admin"
                    className="w-full sm:w-auto px-4 py-2.5 rounded-md border border-stone-200 bg-white text-stone-700 text-xs font-mono font-medium hover:bg-stone-50 transition-colors"
                  >
                    <span>Open Admin Whitelist Desk (Demo)</span>
                  </Link>
                </div>
              </div>
            ) : (
              /* Signup Form */
              <div className="space-y-6">
                <div>
                  <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-[#ebf7d9] text-[10px] font-mono text-[#3f7308] font-bold uppercase mb-2">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Gated Commercial Network</span>
                  </div>
                  <h2 className="text-2xl font-bold tracking-tight text-[#18280e]">
                    Apply for Whitelisted Access
                  </h2>
                  <p className="text-xs text-stone-600 font-mono mt-1">
                    All accounts require administrative verification before login access is granted.
                  </p>
                </div>

                {errorMsg && (
                  <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs font-mono">
                    {errorMsg}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4 text-xs font-mono">
                  {/* Role Selector Pill */}
                  <div>
                    <label className="text-stone-500 font-bold block mb-1.5 uppercase text-[10px]">
                      Account Type
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setRole("buyer");
                          setCountry("United States");
                        }}
                        className={`p-2.5 rounded-lg border text-left flex items-center gap-2 transition-all ${
                          role === "buyer"
                            ? "bg-[#18280e] text-[#b2eb76] border-[#18280e] font-bold shadow-xs"
                            : "bg-white text-stone-700 border-stone-200 hover:bg-stone-50"
                        }`}
                      >
                        <Globe className="w-4 h-4 shrink-0" />
                        <div>
                          <div className="font-semibold text-xs">Foreign Buyer</div>
                          <div className="text-[10px] opacity-80">Importing from India</div>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setRole("manufacturer");
                          setCountry("India");
                        }}
                        className={`p-2.5 rounded-lg border text-left flex items-center gap-2 transition-all ${
                          role === "manufacturer"
                            ? "bg-[#18280e] text-[#b2eb76] border-[#18280e] font-bold shadow-xs"
                            : "bg-white text-stone-700 border-stone-200 hover:bg-stone-50"
                        }`}
                      >
                        <Building2 className="w-4 h-4 shrink-0" />
                        <div>
                          <div className="font-semibold text-xs">Indian MSME</div>
                          <div className="text-[10px] opacity-80">Industrial Exporter</div>
                        </div>
                      </button>
                    </div>
                  </div>

                  {/* Name & Email */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-stone-600 block mb-1">Full Name *</label>
                      <div className="relative">
                        <input
                          type="text"
                          required
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="e.g. Marcus Vance"
                          className="w-full bg-[#f4faed]/60 border border-[#d8e5ca] rounded-md px-3 py-2 text-[#18280e] focus:outline-none focus:border-[#3f7308]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-stone-600 block mb-1">Business Work Email *</label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@company.com"
                        className="w-full bg-[#f4faed]/60 border border-[#d8e5ca] rounded-md px-3 py-2 text-[#18280e] focus:outline-none focus:border-[#3f7308]"
                      />
                    </div>
                  </div>

                  {/* Company Name & Country */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-stone-600 block mb-1">Company Legal Entity *</label>
                      <input
                        type="text"
                        required
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        placeholder="e.g. Pacific Arch Hardware LLC"
                        className="w-full bg-[#f4faed]/60 border border-[#d8e5ca] rounded-md px-3 py-2 text-[#18280e] focus:outline-none focus:border-[#3f7308]"
                      />
                    </div>

                    <div>
                      <label className="text-stone-600 block mb-1">Country *</label>
                      <input
                        type="text"
                        required
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                        placeholder="e.g. United States or India"
                        className="w-full bg-[#f4faed]/60 border border-[#d8e5ca] rounded-md px-3 py-2 text-[#18280e] focus:outline-none focus:border-[#3f7308]"
                      />
                    </div>
                  </div>

                  {/* Manufacturer Specific Fields: DGFT IEC & GSTIN */}
                  {role === "manufacturer" && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 rounded-lg bg-[#ebf7d9] border border-[#d8e5ca]">
                      <div>
                        <label className="text-stone-700 block mb-1 font-bold">DGFT IEC Code *</label>
                        <input
                          type="text"
                          required
                          value={iecCode}
                          onChange={(e) => setIecCode(e.target.value)}
                          placeholder="e.g. 0508012491"
                          className="w-full bg-white border border-[#d8e5ca] rounded-md px-3 py-2 text-[#18280e] focus:outline-none focus:border-[#3f7308]"
                        />
                      </div>
                      <div>
                        <label className="text-stone-700 block mb-1 font-bold">GSTIN Registration *</label>
                        <input
                          type="text"
                          required
                          value={gstin}
                          onChange={(e) => setGstin(e.target.value)}
                          placeholder="e.g. 09AAHFM9201L1Z4"
                          className="w-full bg-white border border-[#d8e5ca] rounded-md px-3 py-2 text-[#18280e] focus:outline-none focus:border-[#3f7308]"
                        />
                      </div>
                    </div>
                  )}

                  {/* Password */}
                  <div>
                    <label className="text-stone-600 block mb-1">Create Password *</label>
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-[#f4faed]/60 border border-[#d8e5ca] rounded-md px-3 py-2 text-[#18280e] focus:outline-none focus:border-[#3f7308]"
                    />
                  </div>

                  {/* Submit Button */}
                  <div className="pt-2">
                    <Magnet padding={20} magnetStrength={2}>
                      <button
                        type="submit"
                        className="w-full py-3 rounded-md bg-[#18280e] text-[#b2eb76] font-semibold text-xs tracking-wider uppercase flex items-center justify-center gap-2 hover:bg-[#18280e]/90 transition-all cursor-pointer shadow-sm"
                      >
                        <ShieldCheck className="w-4 h-4 text-[#b2eb76]" />
                        <span>Submit Registration for Whitelisting</span>
                      </button>
                    </Magnet>
                  </div>
                </form>

                <div className="text-center pt-2 border-t border-stone-200/60 text-xs font-mono text-stone-600">
                  <span>Already whitelisted? </span>
                  <Link href="/signin" className="text-[#3f7308] hover:underline font-bold">
                    Sign In
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-4 text-center text-xs font-mono text-stone-500 border-t border-black/10">
        TRUV Global Business Trust &amp; Trade Execution Infrastructure
      </footer>
    </div>
  );
}
