import { useEffect, useState } from "react";
import { FileText, TrendingUp, CheckCircle2, Clock, Building2, ArrowRight, Plus } from "lucide-react";
import { supabase } from "@/lib/supabase";
import type { Report } from "@/types";
import { CATEGORY_META, STATUS_META } from "@/types";
import { CategoryIcon } from "@/components/Badges";
import type { View } from "@/components/AppShell";

interface DashboardPageProps {
  onNavigate: (view: View) => void;
  onOpenReport: (report: Report) => void;
}

export function DashboardPage({ onNavigate, onOpenReport }: DashboardPageProps) {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("reports")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(100);
      setReports((data as Report[]) ?? []);
      setLoading(false);
    })();
  }, []);

  const total = reports.length;
  const resolved = reports.filter((r) => r.status === "resolved").length;
  const inProgress = reports.filter(
    (r) => r.status === "acknowledged" || r.status === "in_progress",
  ).length;
  const totalUpvotes = reports.reduce((s, r) => s + r.upvote_count, 0);
  const resolutionRate = total > 0 ? Math.round((resolved / total) * 100) : 0;

  const stats = [
    { label: "Total Reports", value: total, icon: FileText, tint: "bg-civic-50 text-civic-700" },
    { label: "Resolved", value: resolved, icon: CheckCircle2, tint: "bg-civic-50 text-civic-700" },
    { label: "In Progress", value: inProgress, icon: Clock, tint: "bg-signal-50 text-signal-700" },
    { label: "Community Upvotes", value: totalUpvotes, icon: TrendingUp, tint: "bg-signal-50 text-signal-700" },
  ];

  // Category breakdown
  const categoryCounts = reports.reduce<Record<string, number>>((acc, r) => {
    acc[r.category] = (acc[r.category] ?? 0) + 1;
    return acc;
  }, {});
  const topCategories = Object.entries(categoryCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  // Department breakdown
  const deptCounts = reports.reduce<Record<string, number>>((acc, r) => {
    if (r.ai_department) acc[r.ai_department] = (acc[r.ai_department] ?? 0) + 1;
    return acc;
  }, {});
  const topDepartments = Object.entries(deptCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4);

  // Status breakdown
  const statusCounts = reports.reduce<Record<string, number>>((acc, r) => {
    acc[r.status] = (acc[r.status] ?? 0) + 1;
    return acc;
  }, {});

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-serif text-3xl font-medium text-ink-900 sm:text-4xl">Neighborhood Dashboard</h1>
          <p className="mt-1.5 text-sm text-ink-500">
            Track civic issues across your community and see what's getting fixed.
          </p>
        </div>
        <button onClick={() => onNavigate("report")} className="btn-primary shrink-0">
          <Plus className="h-4 w-4" /> Report an Issue
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="card-surface p-5">
              <div className={`mb-3 flex h-9 w-9 items-center justify-center rounded-lg ${s.tint}`}>
                <Icon className="h-4.5 w-4.5" />
              </div>
              <p className="text-2xl font-bold text-ink-900">{loading ? "—" : s.value}</p>
              <p className="mt-0.5 text-xs text-ink-500">{s.label}</p>
            </div>
          );
        })}
      </div>

      {/* Resolution rate */}
      <div className="card-surface p-6">
        <div className="mb-3 flex items-center justify-between">
          <p className="text-sm font-semibold text-ink-800">Resolution Rate</p>
          <span className="text-2xl font-bold text-civic-700">{resolutionRate}%</span>
        </div>
        <div className="h-3 w-full overflow-hidden rounded-full bg-ink-100">
          <div
            className="h-full rounded-full bg-gradient-to-r from-civic-500 to-civic-700 transition-all duration-500"
            style={{ width: `${resolutionRate}%` }}
          />
        </div>
        <p className="mt-2 text-xs text-ink-400">
          {resolved} of {total} reports resolved
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Top Categories */}
        <div className="card-surface p-6">
          <p className="mb-4 text-sm font-semibold text-ink-800">Top Issue Categories</p>
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="skeleton h-8 rounded-lg" />
              ))}
            </div>
          ) : topCategories.length === 0 ? (
            <p className="text-sm text-ink-500">No reports yet.</p>
          ) : (
            <div className="space-y-3">
              {topCategories.map(([cat, count]) => {
                const pct = total > 0 ? Math.round((count / total) * 100) : 0;
                return (
                  <div key={cat} className="flex items-center gap-3">
                    <CategoryIcon category={cat as Report["category"]} className="h-4 w-4 shrink-0 text-ink-500" />
                    <span className="w-28 shrink-0 text-sm font-medium text-ink-700">
                      {CATEGORY_META[cat as Report["category"]].label}
                    </span>
                    <div className="h-2 flex-1 overflow-hidden rounded-full bg-ink-100">
                      <div
                        className="h-full rounded-full bg-civic-500 transition-all duration-500"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span className="w-8 text-right text-xs font-semibold text-ink-600">{count}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Department Routing */}
        <div className="card-surface p-6">
          <p className="mb-4 text-sm font-semibold text-ink-800">AI Department Routing</p>
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="skeleton h-8 rounded-lg" />
              ))}
            </div>
          ) : topDepartments.length === 0 ? (
            <p className="text-sm text-ink-500">No AI-routed reports yet.</p>
          ) : (
            <div className="space-y-3">
              {topDepartments.map(([dept, count]) => (
                <div key={dept} className="flex items-center gap-3">
                  <Building2 className="h-4 w-4 shrink-0 text-civic-600" />
                  <span className="flex-1 text-sm font-medium text-ink-700">{dept}</span>
                  <span className="rounded-full bg-civic-50 px-2.5 py-0.5 text-xs font-semibold text-civic-700">
                    {count} {count === 1 ? "report" : "reports"}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Status breakdown */}
      <div className="card-surface p-6">
        <p className="mb-4 text-sm font-semibold text-ink-800">Status Breakdown</p>
        {loading ? (
          <div className="flex gap-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="skeleton h-10 flex-1 rounded-lg" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {(Object.keys(STATUS_META) as (keyof typeof STATUS_META)[]).map((status) => {
              const meta = STATUS_META[status];
              const count = statusCounts[status] ?? 0;
              return (
                <div key={status} className={`rounded-xl p-4 text-center ${meta.color}`}>
                  <p className="text-2xl font-bold">{count}</p>
                  <p className="mt-0.5 text-xs font-medium">{meta.label}</p>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Recent reports */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-ink-900">Recent Reports</h2>
          <button onClick={() => onNavigate("feed")} className="btn-ghost text-xs">
            View all <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="skeleton h-20 rounded-2xl" />
            ))}
          </div>
        ) : reports.length === 0 ? (
          <div className="card-surface px-6 py-10 text-center text-sm text-ink-500">
            No reports yet. Be the first to report an issue.
          </div>
        ) : (
          <div className="space-y-3">
            {reports.slice(0, 5).map((r) => (
              <button
                key={r.id}
                onClick={() => onOpenReport(r)}
                className="card-surface group flex w-full items-center justify-between p-4 text-left transition-all hover:border-ink-300 hover:shadow-md"
              >
                <div className="min-w-0">
                  <h3 className="truncate text-sm font-semibold text-ink-900">{r.title}</h3>
                  <p className="mt-0.5 text-xs text-ink-500">
                    {CATEGORY_META[r.category].label} · {STATUS_META[r.status].label} · {r.upvote_count} upvotes
                  </p>
                </div>
                <ArrowRight className="h-4 w-4 shrink-0 text-ink-300 transition-transform group-hover:translate-x-0.5" />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
