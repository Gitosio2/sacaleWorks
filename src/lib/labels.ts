import type { modelPhase } from "@/db/schema";

export type ModelPhase = (typeof modelPhase.enumValues)[number];

export const phaseLabels: Record<ModelPhase, string> = {
  not_started: "Not started",
  pending_decal_design: "Pending decal design",
  pending_painting: "Pending painting",
  pending_decals: "Pending decals",
  pending_varnish: "Pending varnish",
  pending_assembly: "Pending assembly",
  finished: "Finished",
};

export const supplyStatusLabels = {
  to_order: "To order",
  ordered: "Ordered",
  in_hand: "In hand",
} as const;

// "12,50" or "12.5" -> 1250 (cents). Empty -> null. Invalid -> throws.
export function parseEuros(raw: string) {
  const value = raw.trim().replace(",", ".");
  if (!value) return null;
  const cents = Math.round(Number(value) * 100);
  if (!Number.isFinite(cents) || cents < 0) throw new Error("Invalid price");
  return cents;
}

// 90 -> "01:30"
export function formatDuration(totalMinutes: number) {
  const h = Math.floor(totalMinutes / 60);
  const m = totalMinutes % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

// "1:30" -> 90 (minutes 00-59). Returns null if the format is invalid.
export function parseDuration(value: string) {
  const match = /^(\d{1,2}):([0-5]\d)$/.exec(value.trim());
  if (!match) return null;
  return Number(match[1]) * 60 + Number(match[2]);
}

export function formatEuros(cents: number | null) {
  if (cents === null) return "—";
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR",
  }).format(cents / 100);
}
