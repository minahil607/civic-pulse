export type Category =
  | "pothole"
  | "streetlight"
  | "graffiti"
  | "trash"
  | "sidewalk"
  | "water"
  | "tree"
  | "signage"
  | "parking"
  | "other";

export type Severity = "low" | "medium" | "high" | "urgent";

export type ReportStatus =
  | "submitted"
  | "acknowledged"
  | "in_progress"
  | "resolved";

export interface Report {
  id: string;
  title: string;
  description: string;
  category: Category;
  severity: Severity;
  ai_summary: string;
  ai_department: string;
  ai_priority: string;
  ai_action_items: string[];
  status: ReportStatus;
  location_text: string;
  lat: number | null;
  lng: number | null;
  photo_url: string;
  client_id: string;
  upvote_count: number;
  created_at: string;
}

export interface Upvote {
  id: string;
  report_id: string;
  client_id: string;
  created_at: string;
}

export interface AITicket {
  summary: string;
  department: string;
  priority: string;
  actionItems: string[];
}

export const CATEGORY_META: Record<Category, { label: string; icon: string }> = {
  pothole: { label: "Pothole", icon: "construction" },
  streetlight: { label: "Streetlight", icon: "lightbulb" },
  graffiti: { label: "Graffiti", icon: "spray-can" },
  trash: { label: "Trash / Litter", icon: "trash-2" },
  sidewalk: { label: "Sidewalk", icon: "footprints" },
  water: { label: "Water / Leak", icon: "droplet" },
  tree: { label: "Tree / Branch", icon: "tree" },
  signage: { label: "Signage", icon: "signpost" },
  parking: { label: "Parking", icon: "circle-parking" },
  other: { label: "Other", icon: "circle-help" },
};

export const SEVERITY_META: Record<Severity, { label: string; color: string }> = {
  low: { label: "Low", color: "bg-ink-100 text-ink-600" },
  medium: { label: "Medium", color: "bg-signal-50 text-signal-700" },
  high: { label: "High", color: "bg-signal-100 text-signal-800" },
  urgent: { label: "Urgent", color: "bg-alert-50 text-alert-700" },
};

export const STATUS_META: Record<ReportStatus, { label: string; color: string; step: number }> = {
  submitted: { label: "Submitted", color: "bg-ink-100 text-ink-700", step: 0 },
  acknowledged: { label: "Acknowledged", color: "bg-civic-50 text-civic-700", step: 1 },
  in_progress: { label: "In Progress", color: "bg-signal-50 text-signal-700", step: 2 },
  resolved: { label: "Resolved", color: "bg-civic-100 text-civic-800", step: 3 },
};

export const STATUS_FLOW: ReportStatus[] = ["submitted", "acknowledged", "in_progress", "resolved"];
