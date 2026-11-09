"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Building2,
  Globe,
  CheckCircle2,
  XCircle,
  Mail,
  Clock,
  ArrowLeft,
  Send,
  ExternalLink,
} from "lucide-react";
import { Magnet } from "@/components/reactbits/Magnet";
import {
  getRegisteredUsers,
  whitelistAndSendEmail,
  rejectRegistration,
  getDispatchedEmails,
  RegisteredUser,
  DispatchedEmail,
} from "@/lib/auth/authStore";

export default function AdminWhitelistDashboard() {
  const [users, setUsers] = useState<RegisteredUser[]>(() => {
    if (typeof window !== "undefined") return getRegisteredUsers();
    return [];
  });
  const [emails, setEmails] = useState<DispatchedEmail[]>(() => {
    if (typeof window !== "undefined") return getDispatchedEmails();
    return [];
  });
  const [filter, setFilter] = useState<"all" | "pending" | "whitelisted">("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [recentNotice, setRecentNotice] = useState<string | null>(null);

  const loadData = () => {
    setUsers(getRegisteredUsers());
    setEmails(getDispatchedEmails());
  };

  useEffect(() => {
    const handleAuthChange = () => loadData();
    window.addEventListener("truv-auth-changed", handleAuthChange);
    return () => window.removeEventListener("truv-auth-changed", handleAuthChange);
  }, []);

  const handleWhitelist = (userId: string, userName: string, userEmail: string) => {
    const res = whitelistAndSendEmail(userId);
    if (res.success) {
      setRecentNotice(`✓ Whitelisted: Approval email dispatched to ${userEmail} with active login access.`);
      loadData();
    }
  };

  const handleReject = (userId: string) => {
    const res = rejectRegistration(userId);
    if (res.success) {
      setRecentNotice(`Account rejected and access denied.`);
      loadData();
    }
  };

  const filteredUsers = users.filter((u) => {
    if (filter === "pending" && u.status !== "pending") return false;
    if (filter === "whitelisted" && u.status !== "whitelisted") return false;
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      return (
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        u.companyName.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const pendingCount = users.filter((u) => u.status === "pending").length;
  const whitelistedCount = users.filter((u) => u.status === "whitelisted").length;

  return (
    <div className="min-h-screen bg-[#f4faed] text-[#18280e] font-sans selection:bg-[#b2eb76] selection:text-[#18280e]">
      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-white border-b border-black/10 px-5 lg:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4 shadow-xs">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-mono text-stone-600 hover:text-black transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>TRUV Home</span>
          </Link>
          <span className="text-stone-300">|</span>
          <div className="flex items-center gap-2">
            <span className="size-2 rounded-full bg-[#3f7308] animate-pulse" />
            <span className="font-bold text-sm tracking-tight text-[#18280e]">
              TRUV Trade Compliance &amp; Whitelist Desk
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#ebf7d9] text-[#3f7308] font-bold">
              ADMIN DESK
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/signin"
            className="text-xs font-mono text-stone-600 hover:text-[#18280e] flex items-center gap-1"
          >
            <span>Test User Sign In</span>
            <ExternalLink className="w-3 h-3" />
          </Link>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-[82rem] mx-auto px-5 lg:px-8 py-8 space-y-8">
        {/* Top Notification Toast */}
        {recentNotice && (
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-mono flex items-center justify-between shadow-xs animate-in fade-in">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
              <span>{recentNotice}</span>
            </div>
            <button
              onClick={() => setRecentNotice(null)}
              className="text-emerald-700 hover:text-emerald-900 text-sm font-bold"
            >
              ✕
            </button>
          </div>
        )}

        {/* 4 Summary Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-mono">
          <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-xs space-y-1">
            <span className="text-[10px] text-stone-500 uppercase tracking-wider block font-bold">
              Pending Whitelist Reviews
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-[#18280e]">{pendingCount}</span>
              {pendingCount > 0 && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold animate-pulse">
                  Action Required
                </span>
              )}
            </div>
            <span className="text-[11px] text-stone-400">Awaiting admin email release</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-xs space-y-1">
            <span className="text-[10px] text-stone-500 uppercase tracking-wider block font-bold">
              Whitelisted Trade Accounts
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-[#3f7308]">{whitelistedCount}</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-[#ebf7d9] text-[#3f7308] font-bold">
                Active
              </span>
            </div>
            <span className="text-[11px] text-stone-400">Permanent login granted</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-xs space-y-1">
            <span className="text-[10px] text-stone-500 uppercase tracking-wider block font-bold">
              Dispatched Access Emails
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-[#18280e]">{emails.length}</span>
              <span className="text-xs text-stone-500">Notified</span>
            </div>
            <span className="text-[11px] text-stone-400">SMTP confirmation records</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-xs space-y-1">
            <span className="text-[10px] text-stone-500 uppercase tracking-wider block font-bold">
              Statutory Verification Rails
            </span>
            <div className="text-sm font-bold text-[#18280e] pt-1">
              DGFT • GSTIN • ICEGATE
            </div>
            <span className="text-[11px] text-stone-400">Govt API verification active</span>
          </div>
        </div>

        {/* Whitelisting Verification Table Container */}
        <div
          className="relative bg-white rounded-2xl border border-stone-200/80 shadow-xl overflow-hidden font-mono"
          style={{ "--corner-size-desktop": "17px", "--corner-size-mobile": "13px" } as React.CSSProperties}
        >
          {/* Cut Corners */}
          <div className="pointer-events-none absolute inset-0 z-20">
            <div className="cut-corner absolute bg-[#f4faed]" style={{ top: "-1px", left: "-1px", clipPath: "polygon(0 0, 100% 0, 0 100%)" }} />
            <div className="cut-corner absolute bg-[#f4faed]" style={{ top: "-1px", right: "-1px", clipPath: "polygon(0 0, 100% 0, 100% 100%)" }} />
            <div className="cut-corner absolute bg-[#f4faed]" style={{ bottom: "-1px", left: "-1px", clipPath: "polygon(0 0, 0 100%, 100% 100%)" }} />
            <div className="cut-corner absolute bg-[#f4faed]" style={{ bottom: "-1px", right: "-1px", clipPath: "polygon(100% 0, 0 100%, 100% 100%)" }} />
          </div>

          {/* Table Controls Header */}
          <div className="p-5 border-b border-stone-200/70 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-[#fbfdf9]">
            <div>
              <h2 className="text-base font-bold text-[#18280e]">
                Registered Counterparty Verification Queue
              </h2>
              <p className="text-xs text-stone-500 mt-0.5">
                Verify legal entities, inspect statutory DGFT/GSTIN filings, and release login permissions.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              {/* Filter Pills */}
              <div className="flex rounded-lg bg-stone-100 p-0.5 text-xs">
                <button
                  onClick={() => setFilter("all")}
                  className={`px-3 py-1 rounded-md transition-colors ${
                    filter === "all" ? "bg-white font-bold shadow-xs text-black" : "text-stone-600"
                  }`}
                >
                  All ({users.length})
                </button>
                <button
                  onClick={() => setFilter("pending")}
                  className={`px-3 py-1 rounded-md transition-colors ${
                    filter === "pending" ? "bg-white font-bold shadow-xs text-amber-900" : "text-stone-600"
                  }`}
                >
                  Pending ({pendingCount})
                </button>
                <button
                  onClick={() => setFilter("whitelisted")}
                  className={`px-3 py-1 rounded-md transition-colors ${
                    filter === "whitelisted" ? "bg-white font-bold shadow-xs text-[#3f7308]" : "text-stone-600"
                  }`}
                >
                  Whitelisted ({whitelistedCount})
                </button>
              </div>

              {/* Search */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search user, company..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-white border border-stone-200 text-xs rounded-md pl-3 pr-3 py-1.5 focus:outline-none focus:border-[#3f7308] w-48"
                />
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs divide-y divide-stone-200">
              <thead className="bg-[#f4faed] text-stone-600 uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="py-3 px-4">User &amp; Email</th>
                  <th className="py-3 px-4">Company Entity</th>
                  <th className="py-3 px-4">Role</th>
                  <th className="py-3 px-4">Statutory Evidence</th>
                  <th className="py-3 px-4">Registered</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Admin Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 bg-white text-stone-800">
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-stone-500">
                      No registrations match this filter.
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((u) => {
                    const isPending = u.status === "pending";
                    const isWhitelisted = u.status === "whitelisted";

                    return (
                      <tr key={u.id} className="hover:bg-[#f4faed]/40 transition-colors">
                        <td className="py-3.5 px-4">
                          <div className="font-bold text-[#18280e]">{u.name}</div>
                          <div className="text-[11px] text-stone-500">{u.email}</div>
                        </td>

                        <td className="py-3.5 px-4">
                          <div className="font-semibold text-stone-900">{u.companyName}</div>
                          <div className="text-[10px] text-stone-500">{u.country}</div>
                        </td>

                        <td className="py-3.5 px-4">
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                              u.role === "buyer"
                                ? "bg-blue-50 text-blue-700 border border-blue-200"
                                : u.role === "admin"
                                ? "bg-purple-50 text-purple-700 border border-purple-200"
                                : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            }`}
                          >
                            {u.role === "buyer" && <Globe className="w-3 h-3" />}
                            {u.role === "manufacturer" && <Building2 className="w-3 h-3" />}
                            <span>{u.role}</span>
                          </span>
                        </td>

                        <td className="py-3.5 px-4 text-[11px]">
                          {u.iecCode ? (
                            <div className="space-y-0.5">
                              <div>IEC: <strong className="text-[#18280e]">{u.iecCode}</strong></div>
                              <div className="text-stone-500">GST: {u.gstin}</div>
                            </div>
                          ) : (
                            <span className="text-stone-400">Foreign Purchasing Desk</span>
                          )}
                        </td>

                        <td className="py-3.5 px-4 text-[11px] text-stone-500">
                          {new Date(u.registeredAt).toLocaleDateString()}
                        </td>

                        <td className="py-3.5 px-4">
                          {isPending && (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-300 animate-pulse">
                              <Clock className="w-3 h-3 text-amber-600" />
                              <span>Pending Review</span>
                            </span>
                          )}
                          {isWhitelisted && (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#ebf7d9] text-[#3f7308] border border-[#d8e5ca]">
                              <CheckCircle2 className="w-3 h-3 text-[#3f7308]" />
                              <span>Whitelisted</span>
                            </span>
                          )}
                          {u.status === "rejected" && (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-rose-50 text-rose-800 border border-rose-300">
                              <XCircle className="w-3 h-3 text-rose-600" />
                              <span>Rejected</span>
                            </span>
                          )}
                        </td>

                        <td className="py-3.5 px-4 text-right">
                          {isPending && (
                            <div className="flex items-center justify-end gap-2">
                              <Magnet padding={10} magnetStrength={2}>
                                <button
                                  onClick={() => handleWhitelist(u.id, u.name, u.email)}
                                  className="px-3 py-1.5 rounded-md bg-[#18280e] text-[#b2eb76] font-semibold text-[11px] hover:bg-[#18280e]/90 transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
                                >
                                  <Send className="w-3 h-3" />
                                  <span>Whitelist &amp; Send Email</span>
                                </button>
                              </Magnet>

                              <button
                                onClick={() => handleReject(u.id)}
                                className="px-2.5 py-1.5 rounded-md border border-stone-200 text-stone-600 hover:text-rose-700 hover:bg-rose-50 text-[11px] transition-colors"
                              >
                                Reject
                              </button>
                            </div>
                          )}

                          {isWhitelisted && (
                            <span className="text-[11px] text-stone-500 flex items-center justify-end gap-1">
                              <Mail className="w-3.5 h-3.5 text-[#3f7308]" />
                              <span>Approval Email Sent</span>
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Live Dispatched Emails Log Feed */}
        <div className="space-y-4 font-mono">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-[#3f7308]" />
              <h3 className="text-base font-bold text-[#18280e]">
                Live Dispatched Approval Emails Log
              </h3>
            </div>
            <span className="text-xs text-stone-500">
              Simulated SMTP Delivery Queue ({emails.length} sent)
            </span>
          </div>

          <div className="space-y-2.5">
            {emails.length === 0 ? (
              <div className="p-4 rounded-xl bg-white border border-stone-200 text-xs text-stone-500 text-center">
                No emails dispatched yet. Approve a pending applicant above to trigger an approval email.
              </div>
            ) : (
              emails.slice(0, 5).map((em) => (
                <div
                  key={em.id}
                  className="p-4 rounded-xl bg-white border border-stone-200/80 shadow-xs space-y-1.5 text-xs"
                >
                  <div className="flex justify-between items-center text-[11px]">
                    <span className="font-bold text-[#18280e]">To: {em.toEmail} ({em.userName} — {em.companyName})</span>
                    <span className="text-stone-400">{new Date(em.sentAt).toLocaleTimeString()}</span>
                  </div>
                  <div className="font-semibold text-stone-900">{em.subject}</div>
                  <p className="text-stone-600 text-[11px] whitespace-pre-line leading-relaxed bg-[#f4faed] p-2.5 rounded-lg border border-[#d8e5ca]">
                    {em.body}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
