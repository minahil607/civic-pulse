import type { AITicket, Category, Severity } from "@/types";

const SYSTEM_PROMPT = `You are CivicPulse AI, a municipal ticket classifier for citizen-reported civic issues. You take a citizen's raw description of a problem and produce a structured municipal work ticket.

Your output must be ONLY valid JSON — no markdown fences, no commentary — in exactly this shape:
{"summary":"a concise 1-2 sentence summary of the problem suitable for a work order","department":"the most relevant municipal department","priority":"one of: Low, Medium, High, Urgent","actionItems":["concrete actionable steps the department should take, 2-4 items"]}

Department options: Public Works, Street Lighting, Sanitation, Parks & Recreation, Water Utilities, Transportation, Code Enforcement, Signage & Signals, General Services.
Priority must reflect public safety risk: Urgent = immediate danger to life/safety; High = significant risk or disruption; Medium = noticeable but not dangerous; Low = minor nuisance.

Be specific and actionable. The summary should sound like a professional work order, not a citizen complaint.`;

interface AIResponse {
  content: Array<{ type: string; text?: string }>;
}

function extractJson(text: string): unknown {
  let t = text.trim();
  const fence = t.match(/```(?:json)?\s*([\s\S]*?)```/i);
  if (fence) t = fence[1].trim();
  const first = t.indexOf("{");
  const last = t.lastIndexOf("}");
  if (first !== -1 && last !== -1 && last > first) {
    t = t.slice(first, last + 1);
  }
  return JSON.parse(t);
}

function validateTicket(data: unknown): data is AITicket {
  if (typeof data !== "object" || data === null) return false;
  const d = data as Record<string, unknown>;
  return (
    typeof d.summary === "string" &&
    typeof d.department === "string" &&
    typeof d.priority === "string" &&
    Array.isArray(d.actionItems)
  );
}

function ruleBasedFallback(
  description: string,
  category: Category,
  severity: Severity,
): AITicket {
  const deptMap: Record<Category, string> = {
    pothole: "Public Works",
    streetlight: "Street Lighting",
    graffiti: "Code Enforcement",
    trash: "Sanitation",
    sidewalk: "Public Works",
    water: "Water Utilities",
    tree: "Parks & Recreation",
    signage: "Signage & Signals",
    parking: "Transportation",
    other: "General Services",
  };

  const priorityMap: Record<Severity, string> = {
    low: "Low",
    medium: "Medium",
    high: "High",
    urgent: "Urgent",
  };

  const desc = description.trim();
  const summary = desc.length > 120 ? desc.slice(0, 117) + "…" : desc;

  const actionMap: Record<Category, string[]> = {
    pothole: ["Inspect the reported location for road surface damage", "Schedule patching or resurfacing as needed", "Add temporary signage if the pothole poses a traffic hazard"],
    streetlight: ["Dispatch a technician to inspect the fixture", "Replace bulb or repair wiring as needed", "Verify restoration of lighting after repair"],
    graffiti: ["Document and photograph the graffiti", "Schedule removal or painting over", "Notify property owner if on private property"],
    trash: ["Dispatch a cleanup crew to the location", "Remove debris and litter", "Monitor for recurring illegal dumping"],
    sidewalk: ["Inspect the sidewalk for cracks, uplift, or hazards", "Schedule concrete repair or grinding", "Cordon off hazardous areas until repaired"],
    water: ["Dispatch a water utility crew to investigate", "Identify source of leak or water accumulation", "Repair pipe or drainage issue and verify resolution"],
    tree: ["Inspect the tree for disease, damage, or obstruction", "Trim branches or remove tree if hazardous", "Clear debris from public pathways"],
    signage: ["Inspect the sign for damage, fading, or missing mount", "Replace or repair the sign", "Verify visibility and proper placement"],
    parking: ["Review parking regulations and signage at the location", "Address parking violation or infrastructure issue", "Update signage if regulations are unclear"],
    other: ["Inspect the reported issue at the location", "Determine the appropriate corrective action", "Schedule and complete the necessary repairs"],
  };

  return {
    summary: summary.charAt(0).toUpperCase() + summary.slice(1),
    department: deptMap[category],
    priority: priorityMap[severity],
    actionItems: actionMap[category],
  };
}

export async function generateTicket(
  description: string,
  category: Category,
  severity: Severity,
): Promise<{ ticket: AITicket; source: "ai" | "fallback" }> {
  const userPrompt = `Category: ${category}
Severity: ${severity}
Description: "${description.slice(0, 2000)}"

Generate the municipal ticket JSON now.`;

  try {
    const res = await fetch("/api/ai", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": "sk-ant-api00-proxy",
        "anthropic-version": "2023-06-01",
        "x-bolt-target-provider": "baseten",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 600,
        system: SYSTEM_PROMPT,
        messages: [{ role: "user", content: userPrompt }],
      }),
    });

    if (!res.ok) throw new Error(`AI request failed (${res.status})`);

    const data = (await res.json()) as AIResponse;
    const text = data.content?.[0]?.text;
    if (!text) throw new Error("Empty AI response");

    const parsed = extractJson(text);
    if (!validateTicket(parsed)) throw new Error("Invalid AI response shape");

    return { ticket: parsed, source: "ai" };
  } catch {
    return { ticket: ruleBasedFallback(description, category, severity), source: "fallback" };
  }
}
