import { useEffect, useState, useCallback } from "react";
import {
  ArrowLeft,
  ArrowUp,
  MapPin,
  Clock,
  Building2,
  AlertTriangle,
  CheckCircle2,
  Sparkles,
  Loader2,
  Share2,
  Image as ImageIcon,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { getClientId } from "@/lib/clientId";
import type { Report, ReportStatus } from "@/types";
import { STATUS_META, STATUS_FLOW } from "@/types";
import { CategoryBadge, SeverityBadge, StatusBadge } from "@/components/Badges";

interface ReportDetailProps {
  report: Report;
  onBack: () => void;
}

export function ReportDetail({ report, onBack }: ReportDetailProps) {
  const [upvoteCount, setUpvoteCount] = useState(report.upvote_count);
  const [hasUpvoted, setHasUpvoted] = useState(false);
  const [voting, setVoting] = useState(false);
  const [currentStatus, setCurrentStatus] = useState<ReportStatus>(report.status);
  const [updating, setUpdating] = useState(false);
  const [copied, setCopied] = useState(false);
  const clientId = getClientId();

  const checkUpvote = useCallback(async () => {
    const { data } = await supabase
      .from("upvotes")
      .select("id")
      .eq("report_id", report.id)
      .eq("client_id", clientId)
      .maybeSingle();
    setHasUpvoted(!!data);
  }, [report.id, clientId]);

  useEffect(() => {
    checkUpvote();
  }, [checkUpvote]);

  const handleUpvote = async () => {
    if (voting) return;
    setVoting(true);
    if (hasUpvoted) {
      await supabase.from("upvotes").delete().eq("report_id", report.id).eq("client_id", clientId);
      setHasUpvoted(false);
      setUpvoteCount((c) => c - 1);
    } else {
      await supabase.from("upvotes").insert({ report_id: report.id, client_id: clientId });
      setHasUpvoted(true);
      setUpvoteCount((c) => c + 1);
    }
    setVoting(false);
  };

  const advanceStatus = async () => {
    const currentStep = STATUS_META[currentStatus].step;
    if (currentStep >= 3) return;
    const nextStatus = STATUS_FLOW[currentStep + 1];
    setUpdating(true);
    await supabase.from("reports").update({ status: nextStatus }).eq("id", report.id);
    setCurrentStatus(nextStatus);
    setUpdating(false);
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const actionItems: string[] = (() => {
    if (Array.isArray(report.ai_action_items)) return report.ai_action_items;
    try {
      return JSON.parse(report.ai_action_items as unknown as string) as string[];
    } catch {
      return [];
    }
  })();

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <button onClick={onBack} className="btn-ghost -ml-2">
        <ArrowLeft className="h-4 w-4" /> Back to feed
      </button>

      {/* Header */}
      <div className="card-surface p-6">
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <CategoryBadge category={report.category} />
          <SeverityBadge severity={report.severity} />
          <StatusBadge status={currentStatus} />
        </div>
        <h1 className="font-serif text-2xl font-medium text-ink-900 sm:text-3xl">{report.title}</h1>
        <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-ink-400">
          {report.location_text && (
            <span className="flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5" /> {report.location_text}
            </span>
          )}
          <span className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" /> {new Date(report.created_at).toLocaleString()}
          </span>
        </div>
      </div>

      {/* Photo */}
      {report.photo_url && (
        <div className="card-surface overflow-hidden">
          <div className="flex items-center gap-2 border-b border-ink-100 px-5 py-3 text-xs font-semibold uppercase tracking-wide text-ink-400">
            <ImageIcon className="h-3.5 w-3.5" /> Photo Evidence
          </div>
          <img
            src={report.photo_url}
            alt="Report evidence"
            className="max-h-96 w-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
        </div>
      )}

      {/* Description */}
      <div className="card-surface p-6">
        <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-ink-400">Citizen Description</p>
        <p className="text-sm leading-relaxed text-ink-700">{report.description}</p>
      </div>

      {/* AI Ticket */}
      {report.ai_summary && (
        <div className="card-surface overflow-hidden">
          <div className="flex items-center gap-2 border-b border-ink-100 bg-civic-50 px-5 py-3">
            <Sparkles className="h-4 w-4 text-signal-500" />
            <span className="text-sm font-semibold text-civic-800">AI-Generated Municipal Ticket</span>
          </div>
          <div className="p-5">
            <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-ink-400">Summary</p>
            <p className="mb-4 text-sm font-medium text-ink-900">{report.ai_summary}</p>

            <div className="mb-4 grid grid-cols-2 gap-4">
              <div>
                <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-ink-400">Department</p>
                <div className="flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-civic-600" />
                  <span className="text-sm font-medium text-ink-900">{report.ai_department}</span>
                </div>
              </div>
              <div>
                <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-ink-400">Priority</p>
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-signal-600" />
                  <span className="text-sm font-medium text-ink-900">{report.ai_priority}</span>
                </div>
              </div>
            </div>

            {actionItems.length > 0 && (
              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-ink-400">Action Items</p>
                <ul className="space-y-2">
                  {actionItems.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-ink-700">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-civic-500" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Status Tracker */}
      <div className="card-surface p-6">
        <p className="mb-4 text-xs font-semibold uppercase tracking-wide text-ink-400">Status Timeline</p>

        {/* Horizontal — desktop / tablet */}
        <div className="hidden sm:block">
          <div className="flex items-start">
            {STATUS_FLOW.map((status, i) => {
              const meta = STATUS_META[status];
              const currentStep = STATUS_META[currentStatus].step;
              const isDone = i <= currentStep;
              const isCurrent = i === currentStep;
              const isLast = i === STATUS_FLOW.length - 1;
              return (
                <div key={status} className="flex flex-1 flex-col items-center last:flex-none">
                  <div className="flex w-full items-center">
                    {/* Connector before */}
                    {i > 0 && (
                      <div className={`h-0.5 flex-1 ${i <= currentStep ? "bg-civic-500" : "bg-ink-200"}`} />
                    )}
                    {/* Circle */}
                    <div
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold transition-all ${
                        isDone
                          ? isCurrent
                            ? "bg-civic-700 text-white ring-4 ring-civic-200"
                            : "bg-civic-600 text-white"
                          : "bg-ink-100 text-ink-400"
                      }`}
                    >
                      {isDone && !isCurrent ? <CheckCircle2 className="h-4 w-4" /> : i + 1}
                    </div>
                    {/* Connector after */}
                    {isLast ? (
                      <div className="w-4 sm:hidden" />
                    ) : (
                      <div className={`h-0.5 flex-1 ${i < currentStep ? "bg-civic-500" : "bg-ink-200"}`} />
                    )}
                  </div>
                  <span className={`mt-2 text-center text-xs font-medium ${isDone ? "text-ink-800" : "text-ink-400"}`}>
                    {meta.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Vertical — mobile */}
        <div className="space-y-0 sm:hidden">
          {STATUS_FLOW.map((status, i) => {
            const meta = STATUS_META[status];
            const currentStep = STATUS_META[currentStatus].step;
            const isDone = i <= currentStep;
            const isCurrent = i === currentStep;
            const isLast = i === STATUS_FLOW.length - 1;
            return (
              <div key={status} className="flex gap-3">
                <div className="flex flex-col items-center">
                  <div
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold transition-all ${
                      isDone
                        ? isCurrent
                          ? "bg-civic-700 text-white ring-4 ring-civic-200"
                          : "bg-civic-600 text-white"
                        : "bg-ink-100 text-ink-400"
                    }`}
                  >
                    {isDone && !isCurrent ? <CheckCircle2 className="h-4 w-4" /> : i + 1}
                  </div>
                  {!isLast && (
                    <div className={`my-1 w-0.5 flex-1 ${i < currentStep ? "bg-civic-500" : "bg-ink-200"}`} style={{ minHeight: "24px" }} />
                  )}
                </div>
                <div className={`pb-4 pt-1.5 ${isLast ? "pb-0" : ""}`}>
                  <span className={`text-sm font-medium ${isDone ? "text-ink-800" : "text-ink-400"}`}>
                    {meta.label}
                  </span>
                  {isCurrent && (
                    <span className="ml-2 rounded-full bg-civic-50 px-2 py-0.5 text-[10px] font-semibold text-civic-700">
                      Current
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {currentStatus !== "resolved" && (
          <button onClick={advanceStatus} disabled={updating} className="btn-secondary mt-5 w-full">
            {updating ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>Advance to next status</>
            )}
          </button>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <button
          onClick={handleUpvote}
          disabled={voting}
          className={`flex flex-1 items-center justify-center gap-2 rounded-full border-2 px-6 py-3 text-sm font-semibold transition-all ${
            hasUpvoted
              ? "border-civic-600 bg-civic-50 text-civic-700"
              : "border-ink-200 bg-white text-ink-700 hover:border-civic-400"
          }`}
        >
          {voting ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowUp className="h-4 w-4" />}
          {hasUpvoted ? "Upvoted" : "Upvote"} ({upvoteCount})
        </button>
        <button onClick={handleShare} className="btn-secondary">
          {copied ? <CheckCircle2 className="h-4 w-4 text-civic-600" /> : <Share2 className="h-4 w-4" />}
          {copied ? "Copied!" : "Share"}
        </button>
      </div>
    </div>
  );
}
