import type { Category, ReportStatus, Severity } from "@/types";
import { CATEGORY_META, SEVERITY_META, STATUS_META } from "@/types";
import {
  Construction,
  Lightbulb,
  SprayCan,
  Trash2,
  Footprints,
  Droplet,
  TreePine,
  Signpost,
  ParkingSquare,
  HelpCircle,
  type LucideIcon,
} from "lucide-react";

const ICON_MAP: Record<string, LucideIcon> = {
  construction: Construction,
  lightbulb: Lightbulb,
  "spray-can": SprayCan,
  "trash-2": Trash2,
  footprints: Footprints,
  droplet: Droplet,
  tree: TreePine,
  signpost: Signpost,
  "circle-parking": ParkingSquare,
  "circle-help": HelpCircle,
};

export function CategoryIcon({ category, className }: { category: Category; className?: string }) {
  const Icon = ICON_MAP[CATEGORY_META[category].icon] ?? HelpCircle;
  return <Icon className={className} />;
}

export function CategoryBadge({ category }: { category: Category }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-ink-100 px-2.5 py-1 text-xs font-medium text-ink-700">
      <CategoryIcon category={category} className="h-3 w-3" />
      {CATEGORY_META[category].label}
    </span>
  );
}

export function SeverityBadge({ severity }: { severity: Severity }) {
  const meta = SEVERITY_META[severity];
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${meta.color}`}>
      {meta.label}
    </span>
  );
}

export function StatusBadge({ status }: { status: ReportStatus }) {
  const meta = STATUS_META[status];
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${meta.color}`}>
      {meta.label}
    </span>
  );
}
