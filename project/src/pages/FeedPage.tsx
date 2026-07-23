import { useEffect, useState, useCallback } from "react";
import { ArrowUp, MessageSquare, MapPin, Filter, Loader2, Plus, Inbox } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { getClientId } from "@/lib/clientId";
import type { Report, Category } from "@/types";
import { CATEGORY_META, STATUS_META } from "@/types";
import { CategoryBadge, SeverityBadge, StatusBadge } from "@/components/Badges";
import type { View } from "@/components/AppShell";

interface FeedPageProps {
  onNavigate: (view: View) => void;
  onOpenReport: (report: Report) => void;
}

type SortMode = "recent" | "top";

export function FeedPage({ onNavigate, onOpenReport }: FeedPageProps) {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortMode, setSortMode] = useState<SortMode>("recent");
  const [filterCategory, setFilterCategory] = useState<Category | "all">("all");
  const [upvotedIds, setUpvotedIds] = useState<Set<string>>(new Set());
  const [voting, setVoting] = useState<string | null>(null);
  const clientId = getClientId();

  const load = useCallback(async () => {
    setLoading(true);
    let query = supabase.from("reports").select("*");
    if (filterCategory !== "all") query = query.eq("category", filterCategory);
    if (sortMode === "top") {
      query = query.order("upvote_count", { ascending: false }).order("created_at", { ascending: false });
    } else {
      query = query.order("created_at", { ascending: false });
    }
    const { data } = await query.limit(50);
    setReports((data as Report[]) ?? []);

    const { data: myVotes } = await supabase
      .from("upvotes")
      .select("report_id")
      .eq("client_id", clientId);
    setUpvotedIds(new Set((myVotes ?? []).map((v) => v.report_id)));
    setLoading(false);
  }, [filterCategory, sortMode, clientId]);

  useEffect(() => {
    load();
  }, [load]);

  const handleUpvote = async (report: Report) => {
    if (voting === report.id) return;
    setVoting(report.id);
    const hasUpvoted = upvotedIds.has(report.id);

    if (hasUpvoted) {
      await supabase.from("upvotes").delete().eq("report_id", report.id).eq("client_id", clientId);
      setUpvotedIds((prev) => {
        const next = new Set(prev);
        next.delete(report.id);
        return next;
      });
      setReports((prev) =>
        prev.map((r) => (r.id === report.id ? { ...r, upvote_count: r.upvote_count - 1 } : r)),
      );
    } else {
      await supabase.from("upvotes").insert({ report_id: report.id, client_id: clientId });
      setUpvotedIds((prev) => new Set(prev).add(report.id));
      setReports((prev) =>
        prev.map((r) => (r.id === report.id ? { ...r, upvote_count: r.upvote_count + 1 } : r)),
      );
    }
    setVoting(null);
  };

  const categories: (Category | "all")[] = [
    "all", "pothole", "streetlight", "graffiti", "trash", "sidewalk",
    "water", "tree", "signage", "parking", "other",
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-serif text-3xl font-medium text-ink-900 sm:text-4xl">Community Feed</h1>
          <p className="mt-1.5 text-sm text-ink-500">
            Civic issues reported by your neighbors. Upvote to build momentum.
          </p>
        </div>
        <button onClick={() => onNavigate("report")} className="btn-primary shrink-0">
          <Plus className="h-4 w-4" /> Report an Issue
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-ink-400">
          <Filter className="h-3.5 w-3.5" /> Filter
        </div>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilterCategory(cat)}
            className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
              filterCategory === cat
                ? "bg-ink-900 text-white"
                : "bg-white text-ink-600 border border-ink-200 hover:border-ink-300"
            }`}
          >
            {cat === "all" ? "All" : CATEGORY_META[cat as Category].label}
          </button>
        ))}
      </div>

      {/* Sort toggle */}
      <div className="flex items-center gap-2">
        <span className="text-xs text-ink-400">Sort by:</span>
        <button
          onClick={() => setSortMode("recent")}
          className={`rounded-full px-3 py-1 text-xs font-medium ${sortMode === "recent" ? "bg-civic-100 text-civic-800" : "text-ink-500 hover:text-ink-800"}`}
        >
          Most Recent
        </button>
        <button
          onClick={() => setSortMode("top")}
          className={`rounded-full px-3 py-1 text-xs font-medium ${sortMode === "top" ? "bg-civic-100 text-civic-800" : "text-ink-500 hover:text-ink-800"}`}
        >
          Most Upvoted
        </button>
      </div>

      {/* Reports */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="skeleton h-36 rounded-2xl" />
          ))}
        </div>
      ) : reports.length === 0 ? (
        <div className="card-surface flex flex-col items-center justify-center px-6 py-16 text-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-ink-100">
            <Inbox className="h-7 w-7 text-ink-400" />
          </div>
          <p className="text-base font-medium text-ink-700">No reports yet</p>
          <p className="mt-1 max-w-sm text-sm text-ink-500">
            Be the first to report a civic issue in your neighborhood.
          </p>
          <button onClick={() => onNavigate("report")} className="btn-primary mt-6">
            <Plus className="h-4 w-4" /> Report an Issue
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {reports.map((report) => {
            const hasUpvoted = upvotedIds.has(report.id);
            return (
              <div
                key={report.id}
                className="card-surface group flex gap-4 p-5 transition-all hover:border-ink-300 hover:shadow-md"
              >
                {/* Upvote */}
                <button
                  onClick={() => handleUpvote(report)}
                  disabled={voting === report.id}
                  className="flex w-14 shrink-0 flex-col items-center justify-center gap-0.5 rounded-xl border border-ink-200 transition-all hover:border-civic-400 hover:bg-civic-50"
                >
                  {voting === report.id ? (
                    <Loader2 className="h-5 w-5 animate-spin text-ink-400" />
                  ) : (
                    <ArrowUp
                      className={`h-5 w-5 transition-colors ${
                        hasUpvoted ? "fill-civic-600 text-civic-600" : "text-ink-400 group-hover:text-civic-600"
                      }`}
                    />
                  )}
                  <span className={`text-sm font-bold ${hasUpvoted ? "text-civic-600" : "text-ink-600"}`}>
                    {report.upvote_count}
                  </span>
                </button>

                {/* Content */}
                <button
                  onClick={() => onOpenReport(report)}
                  className="min-w-0 flex-1 text-left"
                >
                  <div className="mb-2 flex flex-wrap items-center gap-2">
                    <CategoryBadge category={report.category} />
                    <SeverityBadge severity={report.severity} />
                    <StatusBadge status={report.status} />
                  </div>
                  <h3 className="font-semibold text-ink-900 group-hover:text-civic-700">{report.title}</h3>
                  <p className="mt-1 line-clamp-2 text-sm text-ink-500">{report.description}</p>
                  <div className="mt-2 flex items-center gap-4 text-xs text-ink-400">
                    {report.location_text && (
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" /> {report.location_text}
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      <MessageSquare className="h-3 w-3" />
                      {timeAgo(report.created_at)}
                    </span>
                    {report.ai_department && (
                      <span className="hidden items-center gap-1 sm:flex">
                        Routed to: <span className="font-medium text-ink-600">{report.ai_department}</span>
                      </span>
                    )}
                  </div>
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 30) return `${days}d ago`;
  return new Date(iso).toLocaleDateString();
}
