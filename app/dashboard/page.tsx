"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Zap, Plus, LogOut, FileText, TrendingUp, DollarSign,
  Clock, MoreVertical, Search, Bell, ChevronRight, LayoutDashboard,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/ThemeToggle";

/* ─── Mock data ─── */
const MOCK_USER = { name: "Rahul Sharma", email: "rahul@example.com" };

const MOCK_INVOICES = [
  { id: "RS-2604-001", client: "Priya Mehta", item: "Website Design", amount: 25000, gst: 4500, total: 29500, status: "Paid" as const, date: "12 Apr 2026" },
  { id: "RS-2604-002", client: "Tech Solutions Pvt Ltd", item: "Logo + Branding", amount: 15000, gst: 2700, total: 17700, status: "Unpaid" as const, date: "15 Apr 2026" },
  { id: "RS-2604-003", client: "Ankit Verma", item: "Social Media Posts (10)", amount: 8000, gst: 0, total: 8000, status: "Paid" as const, date: "16 Apr 2026" },
  { id: "RS-2604-004", client: "StartupXYZ", item: "Mobile App UI", amount: 45000, gst: 8100, total: 53100, status: "Unpaid" as const, date: "17 Apr 2026" },
  { id: "RS-2604-005", client: "Neha Gupta", item: "Content Writing (5 articles)", amount: 5000, gst: 0, total: 5000, status: "Paid" as const, date: "17 Apr 2026" },
];

const totalEarned = MOCK_INVOICES.filter(i => i.status === "Paid").reduce((s, i) => s + i.total, 0);
const totalPending = MOCK_INVOICES.filter(i => i.status === "Unpaid").reduce((s, i) => s + i.total, 0);

const STATS = [
  { label: "Total Earned", value: `₹ ${totalEarned.toLocaleString("en-IN")}`, icon: DollarSign, iconBg: "bg-emerald-100 dark:bg-emerald-950/50", iconColor: "text-emerald-600 dark:text-emerald-400" },
  { label: "Pending", value: `₹ ${totalPending.toLocaleString("en-IN")}`, icon: Clock, iconBg: "bg-amber-100 dark:bg-amber-950/50", iconColor: "text-amber-600 dark:text-amber-400" },
  { label: "Invoices", value: String(MOCK_INVOICES.length), icon: FileText, iconBg: "bg-violet-100 dark:bg-violet-950/50", iconColor: "text-violet-600 dark:text-violet-400" },
  { label: "This Month", value: "₹ 1,13,300", icon: TrendingUp, iconBg: "bg-pink-100 dark:bg-pink-950/50", iconColor: "text-pink-600 dark:text-pink-400" },
];

const NAV = [
  { icon: LayoutDashboard, label: "Overview", active: true },
  { icon: FileText, label: "Invoices", active: false },
  { icon: TrendingUp, label: "Reports", active: false },
  { icon: DollarSign, label: "Payments", active: false },
];

export default function DashboardPage() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"All" | "Paid" | "Unpaid">("All");

  const filtered = MOCK_INVOICES.filter(inv => {
    const q = search.toLowerCase();
    const match = inv.client.toLowerCase().includes(q) || inv.item.toLowerCase().includes(q) || inv.id.toLowerCase().includes(q);
    return match && (filter === "All" || inv.status === filter);
  });

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0a0f1e] flex">

      {/* ── Sidebar (desktop) ── */}
      <aside className="hidden lg:flex flex-col w-56 shrink-0 min-h-screen border-r border-slate-200/60 bg-white dark:border-white/[0.05] dark:bg-slate-950 fixed top-0 left-0 z-30">
        {/* Logo */}
        <div className="flex h-16 items-center gap-2.5 px-5 border-b border-slate-100 dark:border-white/[0.05]">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600 shadow-md shadow-violet-500/20">
            <Zap className="h-3.5 w-3.5 text-white fill-white" />
          </div>
          <span className="text-[15px] font-bold text-slate-900 dark:text-white">
            Refine<span className="text-violet-600">Split</span>
          </span>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-3 space-y-0.5">
          {NAV.map(item => (
            <button key={item.label} className={`w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-150 ${item.active ? "bg-violet-50 dark:bg-violet-950/50 text-violet-700 dark:text-violet-300" : "text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/[0.04] hover:text-slate-800 dark:hover:text-slate-200"}`}>
              <item.icon className="h-4 w-4" />
              {item.label}
            </button>
          ))}
        </nav>

        {/* User */}
        <div className="p-3 border-t border-slate-100 dark:border-white/[0.05]">
          <div className="flex items-center gap-2.5 px-2 py-2 rounded-xl mb-1">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-violet-600 to-indigo-600 text-white text-xs font-bold shrink-0">
              {MOCK_USER.name.charAt(0)}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">{MOCK_USER.name}</p>
              <p className="text-[10px] text-slate-400 truncate">{MOCK_USER.email}</p>
            </div>
          </div>
          <Link href="/">
            <Button variant="ghost" size="sm" className="w-full justify-start text-slate-500 dark:text-slate-400 text-xs" id="logout-btn">
              <LogOut className="h-3.5 w-3.5 mr-2" />Logout
            </Button>
          </Link>
        </div>
      </aside>

      {/* ── Main ── */}
      <div className="flex-1 lg:ml-56 min-w-0">

        {/* Top bar */}
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-slate-200/60 dark:border-white/[0.05] bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl px-4 sm:px-6">
          <div className="flex items-center gap-3">
            {/* Mobile logo */}
            <Link href="/" className="flex items-center gap-2 lg:hidden">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600">
                <Zap className="h-3.5 w-3.5 text-white fill-white" />
              </div>
              <span className="text-base font-bold text-slate-900 dark:text-white">Refine<span className="text-violet-600">Split</span></span>
            </Link>
            {/* Desktop greeting */}
            <div className="hidden lg:block">
              <h1 className="text-base font-bold text-slate-900 dark:text-white">Good evening, {MOCK_USER.name.split(" ")[0]} 👋</h1>
              <p className="text-xs text-slate-400 dark:text-slate-500">{new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" })}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <button className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-400 hover:text-violet-600 transition-colors" aria-label="Notifications">
              <Bell className="h-4 w-4" />
              <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-violet-600" />
            </button>
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-violet-600 to-indigo-600 text-white text-xs font-bold lg:hidden">{MOCK_USER.name.charAt(0)}</div>
          </div>
        </header>

        {/* Page body */}
        <main className="p-4 sm:p-6 max-w-5xl mx-auto pb-10">

          {/* Stat cards */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 mb-7">
            {STATS.map(s => (
              <div key={s.label} className="rounded-2xl border border-slate-200/60 dark:border-white/[0.06] bg-white dark:bg-slate-900 p-4 shadow-sm hover:shadow-md transition-shadow">
                <div className={`mb-3 inline-flex h-9 w-9 items-center justify-center rounded-xl ${s.iconBg}`}>
                  <s.icon className={`h-4 w-4 ${s.iconColor}`} />
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-0.5">{s.label}</p>
                <p className="text-lg font-bold text-slate-900 dark:text-white leading-tight">{s.value}</p>
              </div>
            ))}
          </div>

          {/* Quick action */}
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">Recent Invoices</h2>
            <Link href="/invoice" id="create-new-invoice-dashboard">
              <Button size="sm" className="shadow-lg shadow-violet-500/20">
                <Plus className="h-3.5 w-3.5 mr-1.5" />New Invoice
              </Button>
            </Link>
          </div>

          {/* Invoice table card */}
          <div className="rounded-2xl border border-slate-200/60 dark:border-white/[0.06] bg-white dark:bg-slate-900 shadow-sm overflow-hidden">
            {/* Toolbar */}
            <div className="flex flex-col gap-3 p-4 border-b border-slate-100 dark:border-white/[0.05] sm:flex-row sm:items-center sm:justify-between">
              {/* Filters */}
              <div className="flex gap-1">
                {(["All", "Paid", "Unpaid"] as const).map(f => (
                  <button key={f} onClick={() => setFilter(f)} className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${filter === f ? "bg-violet-100 dark:bg-violet-950/50 text-violet-700 dark:text-violet-300" : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"}`} id={`filter-${f.toLowerCase()}`}>
                    {f}
                    <span className="ml-1.5 rounded-full bg-slate-100 dark:bg-slate-700 px-1.5 py-0.5 text-[10px] font-bold">
                      {f === "All" ? MOCK_INVOICES.length : MOCK_INVOICES.filter(i => i.status === f).length}
                    </span>
                  </button>
                ))}
              </div>
              {/* Search */}
              <div className="relative sm:w-52">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                <input type="text" placeholder="Search invoices…" value={search} onChange={e => setSearch(e.target.value)}
                  className="h-9 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 pl-8 pr-3 text-xs text-slate-700 dark:text-slate-200 placeholder:text-slate-400 focus:border-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-400/15"
                  id="invoice-search"
                />
              </div>
            </div>

            {/* List */}
            {filtered.length === 0 ? (
              <div className="py-16 text-center">
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-800">
                  <FileText className="h-6 w-6 text-slate-400" />
                </div>
                <p className="font-semibold text-sm text-slate-700 dark:text-slate-300">No invoices found</p>
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">{search ? "Try a different search" : "Create your first invoice"}</p>
                {!search && (
                  <Link href="/invoice">
                    <Button size="sm" className="mt-4" id="empty-create-btn"><Plus className="h-3.5 w-3.5 mr-1" />New Invoice</Button>
                  </Link>
                )}
              </div>
            ) : (
              <div className="divide-y divide-slate-100 dark:divide-white/[0.04]">
                {filtered.map(inv => (
                  <div key={inv.id} className="group flex items-center justify-between px-5 py-3.5 hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors cursor-pointer">
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div className="hidden sm:flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-violet-50 dark:bg-violet-950/40">
                        <FileText className="h-3.5 w-3.5 text-violet-600 dark:text-violet-400" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">{inv.client}</p>
                        <p className="text-[11px] text-slate-400 dark:text-slate-500 truncate">{inv.item} · {inv.id}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 ml-3 shrink-0">
                      <div className="text-right hidden sm:block">
                        <p className="text-sm font-bold text-slate-900 dark:text-white">₹ {inv.total.toLocaleString("en-IN")}</p>
                        <p className="text-[10px] text-slate-400">{inv.date}</p>
                      </div>
                      <Badge variant={inv.status === "Paid" ? "success" : "warning"}>
                        {inv.status}
                      </Badge>
                      <button className="opacity-0 group-hover:opacity-100 transition-opacity h-7 w-7 flex items-center justify-center rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700" aria-label="Options">
                        <MoreVertical className="h-3.5 w-3.5 text-slate-400" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {filtered.length > 0 && (
              <div className="border-t border-slate-100 dark:border-white/[0.04] px-5 py-3 text-center">
                <button className="inline-flex items-center gap-1 text-xs font-semibold text-violet-600 dark:text-violet-400 hover:text-violet-700" id="view-all-invoices">
                  View all invoices <ChevronRight className="h-3.5 w-3.5" />
                </button>
              </div>
            )}
          </div>

          {/* Mobile logout */}
          <div className="mt-6 lg:hidden">
            <Link href="/"><Button variant="outline" className="w-full dark:border-slate-700 dark:text-slate-300" id="mobile-logout-btn"><LogOut className="h-4 w-4 mr-2" />Logout</Button></Link>
          </div>
        </main>
      </div>
    </div>
  );
}
