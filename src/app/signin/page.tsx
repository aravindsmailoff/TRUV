"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ShieldCheck,
  ArrowLeft,
  AlertTriangle,
  ArrowRight,
  Clock,
} from "lucide-react";
import { Magnet } from "@/components/reactbits/Magnet";
import { loginUserWithCredentials } from "@/lib/auth/authStore";

export default function SigninPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [statusMsg, setStatusMsg] = useState<{
    type: "error" | "pending" | "success";
    text: string;
  } | null>(null);

  const handleLogin = (loginEmail: string, loginPass?: string) => {
    setStatusMsg(null);
    const targetEmail = loginEmail || email;
    const targetPass = loginPass || password || "password123";

    if (!targetEmail) {
      setStatusMsg({ type: "error", text: "Please enter your email address." });
      return;
    }

    const res = loginUserWithCredentials(targetEmail, targetPass);

    if (!res.success) {
      if (res.reason === "pending") {
        setStatusMsg({
          type: "pending",
          text: res.message,
        });
      } else {
        setStatusMsg({
          type: "error",
          text: res.message,
        });
      }
      return;
    }

    setStatusMsg({
      type: "success",
      text: res.user?.role === "buyer" 
        ? "Foreign Buyer Account verified! Redirecting to Foreign Buyer Portal..."
        : "Whitelisted account verified! Redirecting to Platform...",
    });

    setTimeout(() => {
      if (res.user?.role === "buyer") {
        router.push("/buyer");
      } else {
        router.push("/dashboard");
      }
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-[#f4faed] text-[#18280e] flex flex-col justify-between font-sans selection:bg-[#b2eb76] selection:text-[#18280e]">
      {/* Top Navbar */}
      <header className="h-16 bg-white border-b border-black/10 px-5 lg:px-8 flex items-center justify-between">
        <Link href="/" className="inline-flex items-center gap-2 group">
          <span className="size-3 rounded-full bg-[#3f7308] group-hover:bg-[#b2eb76] transition-colors" />
          <span className="font-bold text-lg tracking-tight text-[#18280e]">TRUV</span>
          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#ebf7d9] text-[#3f7308] font-bold">
            OPERATOR LOGIN
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
        <div className="w-full max-w-md">
          {/* Main Card with Chamfered Cut Corners */}
          <div
            className="relative bg-white p-6 sm:p-8 rounded-2xl border border-stone-200/80 shadow-xl overflow-hidden space-y-6"
            style={{ "--corner-size-desktop": "17px", "--corner-size-mobile": "13px" } as React.CSSProperties}
          >
            {/* Cut Corners */}
            <div className="pointer-events-none absolute inset-0 z-20">
              <div className="cut-corner absolute bg-[#f4faed]" style={{ top: "-1px", left: "-1px", clipPath: "polygon(0 0, 100% 0, 0 100%)" }} />
              <div className="cut-corner absolute bg-[#f4faed]" style={{ top: "-1px", right: "-1px", clipPath: "polygon(0 0, 100% 0, 100% 100%)" }} />
              <div className="cut-corner absolute bg-[#f4faed]" style={{ bottom: "-1px", left: "-1px", clipPath: "polygon(0 0, 0 100%, 100% 100%)" }} />
              <div className="cut-corner absolute bg-[#f4faed]" style={{ bottom: "-1px", right: "-1px", clipPath: "polygon(100% 0, 0 100%, 100% 100%)" }} />
            </div>

            {/* Header */}
            <div>
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-[#ebf7d9] text-[10px] font-mono text-[#3f7308] font-bold uppercase mb-2">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Whitelisted Trade Access</span>
              </div>
              <h2 className="text-2xl font-bold tracking-tight text-[#18280e]">
                Sign In to TRUV
              </h2>
              <p className="text-xs text-stone-600 font-mono mt-1">
                Persistent authentication for whitelisted buyers and manufacturers.
              </p>
            </div>

            {/* Status Feedback Message */}
            {statusMsg && (
              <div
                className={`p-3.5 rounded-xl border text-xs font-mono leading-relaxed space-y-1 ${
                  statusMsg.type === "pending"
                    ? "bg-amber-50 border-amber-300 text-amber-900"
                    : statusMsg.type === "success"
                    ? "bg-emerald-50 border-emerald-300 text-emerald-900"
                    : "bg-rose-50 border-rose-300 text-rose-900"
                }`}
              >
                <div className="flex items-center gap-2 font-bold">
                  {statusMsg.type === "pending" && <Clock className="w-4 h-4 text-amber-700 shrink-0" />}
                  {statusMsg.type === "error" && <AlertTriangle className="w-4 h-4 text-rose-700 shrink-0" />}
                  {statusMsg.type === "success" && <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />}
                  <span>
                    {statusMsg.type === "pending"
                      ? "Account Pending Whitelisting"
                      : statusMsg.type === "success"
                      ? "Whitelisted Access Granted"
                      : "Login Error"}
                  </span>
                </div>
                <p className="text-[11px] opacity-90">{statusMsg.text}</p>
                {statusMsg.type === "pending" && (
                  <div className="pt-1">
                    <Link
                      href="/admin"
                      className="inline-block text-[#3f7308] font-bold hover:underline text-[11px]"
                    >
                      → Go to Admin Dashboard to Whitelist this account
                    </Link>
                  </div>
                )}
              </div>
            )}

            {/* Login Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleLogin(email, password);
              }}
              className="space-y-4 text-xs font-mono"
            >
              <div>
                <label className="text-stone-600 block mb-1">Business Email *</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full bg-[#f4faed]/60 border border-[#d8e5ca] rounded-md px-3 py-2 text-[#18280e] focus:outline-none focus:border-[#3f7308]"
                />
              </div>

              <div>
                <label className="text-stone-600 block mb-1">Password *</label>
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
                    <span>Authenticate &amp; Enter Platform</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </Magnet>
              </div>
            </form>

            {/* Quick Demo Pre-filled Credentials for Testing */}
            <div className="pt-4 border-t border-stone-200/60 space-y-2">
              <span className="text-[10px] font-mono text-stone-500 uppercase tracking-wider block font-bold">
                Quick Test Accounts (Click to test):
              </span>

              <div className="grid grid-cols-1 gap-1.5 text-[11px] font-mono">
                <button
                  type="button"
                  onClick={() => {
                    setEmail("m.vance@pacificarchhardware.com");
                    setPassword("password123");
                    handleLogin("m.vance@pacificarchhardware.com", "password123");
                  }}
                  className="w-full text-left p-2 rounded bg-[#f4faed] border border-[#d8e5ca] hover:bg-[#ebf7d9] text-stone-800 flex justify-between items-center transition-colors"
                >
                  <span>🇺🇸 Whitelisted Buyer: <strong>m.vance@pacificarch...</strong></span>
                  <span className="text-[10px] text-[#3f7308] font-bold">✓ Approved</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setEmail("exports@mpfbrassware.com");
                    setPassword("password123");
                    handleLogin("exports@mpfbrassware.com", "password123");
                  }}
                  className="w-full text-left p-2 rounded bg-[#f4faed] border border-[#d8e5ca] hover:bg-[#ebf7d9] text-stone-800 flex justify-between items-center transition-colors"
                >
                  <span>🇮🇳 Whitelisted MSME: <strong>exports@mpfbrass...</strong></span>
                  <span className="text-[10px] text-[#3f7308] font-bold">✓ Approved</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setEmail("sourcing@nordicapparel.se");
                    setPassword("password123");
                    handleLogin("sourcing@nordicapparel.se", "password123");
                  }}
                  className="w-full text-left p-2 rounded bg-amber-50 border border-amber-200 hover:bg-amber-100 text-amber-900 flex justify-between items-center transition-colors"
                >
                  <span>⏳ Pending Buyer: <strong>sourcing@nordic...</strong></span>
                  <span className="text-[10px] text-amber-700 font-bold">Pending Review</span>
                </button>
              </div>
            </div>

            <div className="text-center pt-2 border-t border-stone-200/60 text-xs font-mono text-stone-600 flex justify-between">
              <Link href="/signup" className="text-[#3f7308] hover:underline font-bold">
                Request Whitelist Sign Up
              </Link>
              <Link href="/admin" className="text-stone-500 hover:underline">
                Admin Whitelist Desk →
              </Link>
            </div>
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
