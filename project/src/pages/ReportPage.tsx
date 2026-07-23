import { useState } from "react";
import {
  Wand2,
  Loader2,
  ArrowRight,
  Sparkles,
  Building2,
  AlertTriangle,
  CheckCircle2,
  MapPin,
  Camera,
  Lightbulb,
  ChevronRight,
} from "lucide-react";
import { generateTicket } from "@/lib/ai";
import { supabase } from "@/lib/supabase";
import { getClientId } from "@/lib/clientId";
import type { Category, Severity, AITicket, Report } from "@/types";
import { CATEGORY_META, SEVERITY_META } from "@/types";
import { CategoryIcon } from "@/components/Badges";
import type { View } from "@/components/AppShell";

interface ReportPageProps {
  onNavigate: (view: View) => void;
  onOpenReport: (report: Report) => void;
}

const CATEGORIES = Object.keys(CATEGORY_META) as Category[];
const SEVERITIES = Object.keys(SEVERITY_META) as Severity[];

export function ReportPage({ onNavigate, onOpenReport }: ReportPageProps) {
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<Category>("pothole");
  const [severity, setSeverity] = useState<Severity>("medium");
  const [location, setLocation] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [generating, setGenerating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [ticket, setTicket] = useState<AITicket | null>(null);
  const [ticketSource, setTicketSource] = useState<"ai" | "fallback" | null>(null);
  const [error, setError] = useState<string | null>(null);

  const canGenerate = description.trim().length >= 10;

  const handleGenerate = async () => {
    if (!canGenerate) return;
    setError(null);
    setGenerating(true);
    setTicket(null);
    setTicketSource(null);

    const { ticket, source } = await generateTicket(description, category, severity);
    setTicket(ticket);
    setTicketSource(source);
    setGenerating(false);
  };

  const handleSubmit = async () => {
    if (!ticket) return;
    setError(null);
    setSaving(true);

    const title = ticket.summary.split(".")[0].slice(0, 80) || description.slice(0, 80);

    const { data, error: insertError } = await supabase
      .from("reports")
      .insert({
        title,
        description: description.trim(),
        category,
        severity,
        ai_summary: ticket.summary,
        ai_department: ticket.department,
        ai_priority: ticket.priority,
        ai_action_items: JSON.stringify(ticket.actionItems),
        status: "submitted",
        location_text: location.trim(),
        photo_url: photoUrl.trim(),
        client_id: getClientId(),
        upvote_count: 0,
      })
      .select()
      .single();

    setSaving(false);

    if (insertError || !data) {
      setError("Could not save your report. Please try again.");
      return;
    }

    onOpenReport(data as Report);
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="font-serif text-3xl font-medium text-ink-900 sm:text-4xl">Report an Issue</h1>
        <p className="mt-1.5 text-sm text-ink-500">
          Describe a civic problem in your neighborhood. AI will generate a structured municipal ticket.
        </p>
      </div>

      {/* Description */}
      <div className="card-surface p-6">
        <label className="mb-2 block text-sm font-semibold text-ink-800">
          What's the problem?
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="e.g. There's a large pothole forming at the intersection of Oak St and 3rd Ave. It's been getting worse over the past two weeks and cars are swerving into oncoming traffic to avoid it."
          rows={5}
          className="input-field resize-none"
        />
        <div className="mt-2 flex justify-between text-xs text-ink-400">
          <span>{description.length} characters</span>
          <span>Min 10 to generate ticket</span>
        </div>
      </div>

      {/* Category */}
      <div className="card-surface p-6">
        <label className="mb-3 block text-sm font-semibold text-ink-800">Category</label>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`flex items-center gap-2 rounded-xl border-2 px-3 py-2.5 text-left text-sm font-medium transition-all ${
                category === cat
                  ? "border-civic-700 bg-civic-50 text-civic-800"
                  : "border-ink-200 bg-white text-ink-600 hover:border-ink-300"
              }`}
            >
              <CategoryIcon category={cat} className="h-4 w-4 shrink-0" />
              <span className="truncate">{CATEGORY_META[cat].label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Severity */}
      <div className="card-surface p-6">
        <label className="mb-3 block text-sm font-semibold text-ink-800">Severity</label>
        <div className="grid grid-cols-4 gap-2">
          {SEVERITIES.map((sev) => {
            const meta = SEVERITY_META[sev];
            return (
              <button
                key={sev}
                onClick={() => setSeverity(sev)}
                className={`rounded-xl border-2 px-2 py-3 text-center text-sm font-semibold transition-all ${
                  severity === sev
                    ? "border-ink-900 bg-ink-50"
                    : "border-ink-200 bg-white hover:border-ink-300"
                }`}
              >
                <span className={`inline-block rounded-full px-2 py-0.5 text-xs ${meta.color}`}>
                  {meta.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Location + Photo */}
      <div className="card-surface space-y-4 p-6">
        <div>
          <label className="mb-2 block text-sm font-semibold text-ink-800">Location</label>
          <div className="relative">
            <MapPin className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. Oak St & 3rd Ave, near the bus stop"
              className="input-field pl-11"
            />
          </div>
        </div>
        <div>
          <label className="mb-2 block text-sm font-semibold text-ink-800">Photo URL (optional)</label>
          <div className="relative">
            <Camera className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
            <input
              type="url"
              value={photoUrl}
              onChange={(e) => setPhotoUrl(e.target.value)}
              placeholder="https://example.com/photo.jpg"
              className="input-field pl-11"
            />
          </div>
        </div>
      </div>

      {/* Generate button */}
      <button
        onClick={handleGenerate}
        disabled={!canGenerate || generating}
        className="btn-primary w-full text-base"
      >
        {generating ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" />
            <span>Generating municipal ticket…</span>
          </>
        ) : (
          <>
            <Wand2 className="h-5 w-5" />
            <span>Generate AI Ticket</span>
            <ArrowRight className="h-4 w-4" />
          </>
        )}
      </button>

      {generating && (
        <div className="flex items-center justify-center gap-2 text-sm text-ink-500">
          <Sparkles className="h-4 w-4 animate-pulse text-signal-500" />
          AI is analyzing the issue and routing it to the right department…
        </div>
      )}

      {error && (
        <div className="rounded-xl bg-alert-50 px-5 py-4 text-sm text-alert-700">{error}</div>
      )}

      {/* AI Ticket Preview */}
      {ticket && (
        <div className="animate-fade-in-up space-y-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-civic-700">
            <Sparkles className="h-4 w-4 text-signal-500" />
            AI-Generated Municipal Ticket
            {ticketSource === "fallback" && (
              <span className="rounded-full bg-ink-100 px-2 py-0.5 text-xs font-medium text-ink-500">
                rule-based
              </span>
            )}
          </div>

          <div className="card-surface overflow-hidden">
            {/* Summary */}
            <div className="border-b border-ink-100 p-5">
              <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-ink-400">Summary</p>
              <p className="text-sm font-medium text-ink-900">{ticket.summary}</p>
            </div>

            {/* Department + Priority */}
            <div className="grid grid-cols-2 divide-x divide-ink-100 border-b border-ink-100">
              <div className="p-5">
                <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-ink-400">Department</p>
                <div className="flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-civic-600" />
                  <span className="text-sm font-medium text-ink-900">{ticket.department}</span>
                </div>
              </div>
              <div className="p-5">
                <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-ink-400">Priority</p>
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-signal-600" />
                  <span className="text-sm font-medium text-ink-900">{ticket.priority}</span>
                </div>
              </div>
            </div>

            {/* Action Items */}
            <div className="p-5">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-ink-400">Action Items</p>
              <ul className="space-y-2">
                {ticket.actionItems.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-ink-700">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-civic-500" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <button onClick={handleSubmit} disabled={saving} className="btn-primary w-full text-base">
            {saving ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <>
                <CheckCircle2 className="h-5 w-5" />
                Submit Report
                <ChevronRight className="h-4 w-4" />
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
