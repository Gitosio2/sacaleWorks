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

export function formatEuros(cents: number | null) {
  if (cents === null) return "—";
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR",
  }).format(cents / 100);
}
