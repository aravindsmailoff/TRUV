"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ShieldCheck,
  ArrowLeft,
  AlertTriangle,
  ArrowRight,
  Clock,
  Building2,
  Globe2,
  Code2,
  Lock,
  Mail,
} from "lucide-react";
import { Magnet } from "@/components/reactbits/Magnet";
import { loginUserWithCredentials } from "@/lib/auth/authStore";

function SignInContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const roleParam = searchParams.get("role") || "manufacturer";

  const getDefaultEmailForRole = (role: "manufacturer" | "buyer" | "service") => {
    if (role === "buyer") return "m.vance@pacificarchhardware.com";
    if (role === "service") return "accounts@hyperscalelabs.io";
    return "exports@mpfbrassware.com";
  };

  const initialRole: "manufacturer" | "buyer" | "service" =
    roleParam === "buyer" ? "buyer" : roleParam === "service" ? "service" : "manufacturer";

  const [activeRole, setActiveRole] = useState<"manufacturer" | "buyer" | "service">(initialRole);
  const [email, setEmail] = useState(() => getDefaultEmailForRole(initialRole));
  const [password, setPassword] = useState("");
  const [prevRoleParam, setPrevRoleParam] = useState(roleParam);
  const [statusMsg, setStatusMsg] = useState<{
    type: "error" | "pending" | "success";
    text: string;
  } | null>(null);

  if (roleParam !== prevRoleParam) {
    setPrevRoleParam(roleParam);
    const syncedRole: "manufacturer" | "buyer" | "service" =
      roleParam === "buyer" ? "buyer" : roleParam === "service" ? "service" : "manufacturer";
    setActiveRole(syncedRole);
    setEmail(getDefaultEmailForRole(syncedRole));
  }

  const handleRoleTabClick = (role: "manufacturer" | "buyer" | "service") => {
    setActiveRole(role);
    setStatusMsg(null);
    if (role === "manufacturer") {
      setEmail("exports@mpfbrassware.com");
    } else if (role === "buyer") {
      setEmail("m.vance@pacificarchhardware.com");
    } else {
      setEmail("accounts@hyperscalelabs.io");
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMsg(null);

    if (!email) {
      setStatusMsg({ type: "error", text: "Please enter your business email address." });
      return;
    }

    if (!password) {
      setStatusMsg({ type: "error", text: "Please enter your password." });
      return;
    }

    const res = loginUserWithCredentials(email, password);

    if (!res.success) {
      if (res.reason === "pending") {
        setStatusMsg({
          type: "pending",
          text: res.message,
        });
      } else {
        setStatusMsg({
          type: "error",
          text: res.message || "Invalid credentials. Please check your password or role.",
        });
      }
      return;
    }

    setStatusMsg({
      type: "success",
      text:
        res.user?.role === "buyer"
          ? "Foreign Buyer Account verified! Redirecting to Global Sourcing Portal..."
          : res.user?.role === "service"
          ? "Freelancer / Agency verified! Redirecting to Service Portal..."
          : "Indian Manufacturer Account verified! Redirecting to Factory Dashboard...",
    });

    setTimeout(() => {
      if (res.user?.role === "buyer") {
        router.push("/buyer");
      } else if (res.user?.role === "service") {
        router.push("/service");
      } else {
        router.push("/dashboard");
      }
    }, 900);
  };

  return (
    <div className="w-full max-w-md">
      {/* Role Switcher Tabs */}
      <div className="flex rounded-xl bg-white/80 p-1 border border-stone-200/80 mb-4 shadow-sm">
        <button
          type="button"
          onClick={() => handleRoleTabClick("manufacturer")}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-2 rounded-lg text-[11px] font-mono font-semibold transition-all ${
            activeRole === "manufacturer"
              ? "bg-[#18280e] text-[#b2eb76] shadow-sm"
              : "text-stone-600 hover:text-stone-900"
          }`}
        >
          <Building2 className="w-3.5 h-3.5" />
          <span>Manufacturer</span>
        </button>
        <button
          type="button"
          onClick={() => handleRoleTabClick("buyer")}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-2 rounded-lg text-[11px] font-mono font-semibold transition-all ${
            activeRole === "buyer"
              ? "bg-[#18280e] text-[#b2eb76] shadow-sm"
              : "text-stone-600 hover:text-stone-900"
          }`}
        >
          <Globe2 className="w-3.5 h-3.5" />
          <span>Foreign Buyer</span>
        </button>
        <button
          type="button"
          onClick={() => handleRoleTabClick("service")}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-2 rounded-lg text-[11px] font-mono font-semibold transition-all ${
            activeRole === "service"
              ? "bg-[#18280e] text-[#b2eb76] shadow-sm"
              : "text-stone-600 hover:text-stone-900"
          }`}
        >
          <Code2 className="w-3.5 h-3.5" />
          <span>Freelancer</span>
        </button>
      </div>

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
            <span>
              {activeRole === "manufacturer"
                ? "Indian Goods Exporter Rails"
                : activeRole === "buyer"
                ? "Verified Foreign Buyer Sourcing"
                : "Service provider workspace"}
            </span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-[#18280e]">
            {activeRole === "manufacturer"
              ? "Sign In to Factory Dashboard"
              : activeRole === "buyer"
              ? "Sign In to Buyer Portal"
              : "Sign In to Service Portal"}
          </h2>
          <p className="text-xs text-stone-600 font-mono mt-1">
            {activeRole === "manufacturer"
              ? "Access Moradabad Precision Foundry export orders, UCP 600 LC, and QIMA proofs."
              : activeRole === "buyer"
              ? "Access Pacific Architectural Hardware sourcing RFQs, PayPal orders, and supplier catalogs."
              : "Access HyperScale Labs milestones, Loom proofs, GitHub PR deliverables, and dispute defense."}
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
                  : "Authentication Error"}
              </span>
            </div>
            <p className="text-[11px] opacity-90">{statusMsg.text}</p>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-4 text-xs font-mono">
          <div>
            <label className="text-stone-700 font-semibold block mb-1">
              {activeRole === "manufacturer"
                ? "Manufacturer Business Email"
                : activeRole === "buyer"
                ? "Foreign Buyer Email"
                : "Agency / Freelancer Email"}
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com"
                className="w-full bg-[#f4faed]/60 border border-[#d8e5ca] rounded-md pl-9 pr-3 py-2 text-[#18280e] focus:outline-none focus:border-[#3f7308] font-mono"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-stone-700 font-semibold">Password</label>
              <span className="text-[10px] text-stone-500 font-mono">Demo password: password123</span>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password..."
                className="w-full bg-[#f4faed]/60 border border-[#d8e5ca] rounded-md pl-9 pr-3 py-2 text-[#18280e] focus:outline-none focus:border-[#3f7308] font-mono"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <Magnet padding={20} magnetStrength={2}>
              <button
                type="submit"
                className="w-full py-3 rounded-md bg-[#18280e] text-[#b2eb76] font-semibold text-xs tracking-wider uppercase flex items-center justify-center gap-2 hover:bg-[#18280e]/90 transition-all cursor-pointer shadow-sm active:scale-[0.99]"
              >
                <span>
                  {activeRole === "manufacturer"
                    ? "Enter Manufacturer Workspace"
                    : activeRole === "buyer"
                    ? "Enter Foreign Buyer Portal"
                    : "Enter Freelancer Portal"}
                </span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </Magnet>
          </div>
        </form>

        {/* Credential Hint helper */}
        <div className="pt-3 border-t border-stone-200/60 text-[11px] font-mono text-stone-600 bg-stone-50/70 p-3 rounded-lg space-y-1">
          <div className="font-bold text-stone-800 flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-[#3f7308]" />
            <span>Pre-Configured Whitelisted Credentials:</span>
          </div>
          <div className="text-[10px] space-y-0.5 text-stone-600">
            {activeRole === "manufacturer" && (
              <div>
                • Email: <code className="text-[#18280e] font-bold">exports@mpfbrassware.com</code> | Pass: <code className="text-[#18280e] font-bold">password123</code>
              </div>
            )}
            {activeRole === "buyer" && (
              <div>
                • Email: <code className="text-[#18280e] font-bold">m.vance@pacificarchhardware.com</code> | Pass: <code className="text-[#18280e] font-bold">password123</code>
              </div>
            )}
            {activeRole === "service" && (
              <div>
                • Email: <code className="text-[#18280e] font-bold">accounts@hyperscalelabs.io</code> | Pass: <code className="text-[#18280e] font-bold">password123</code>
              </div>
            )}
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
  );
}

export default function SigninPage() {
  return (
    <div className="min-h-screen bg-[#f4faed] text-[#18280e] flex flex-col justify-between font-sans selection:bg-[#b2eb76] selection:text-[#18280e]">
      {/* Top Navbar */}
      <header className="h-16 bg-white border-b border-black/10 px-5 lg:px-8 flex items-center justify-between">
        <Link href="/" className="inline-flex items-center gap-2 group">
          <span className="size-3 rounded-full bg-[#3f7308] group-hover:bg-[#b2eb76] transition-colors" />
          <span className="font-bold text-lg tracking-tight text-[#18280e]">TRUVX</span>
          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#ebf7d9] text-[#3f7308] font-bold">
            SECURE PORTAL LOGIN
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
        <Suspense
          fallback={
            <div className="w-full max-w-md p-8 bg-white rounded-2xl border border-stone-200 text-center font-mono text-xs">
              Loading...
            </div>
          }
        >
          <SignInContent />
        </Suspense>
      </main>

      {/* Footer */}
      <footer className="py-4 text-center text-xs font-mono text-stone-500 border-t border-black/10">
        TRUVX • Trade workspace prototype
      </footer>
    </div>
  );
}
