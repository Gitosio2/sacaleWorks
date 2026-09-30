import { modelPhase } from "@/db/schema";
import { phaseLabels } from "@/lib/labels";

type Defaults = {
  name?: string;
  company?: string | null;
  clientId?: string | null;
  priceCents?: number | null;
  phase?: (typeof modelPhase.enumValues)[number];
  requestedDate?: string | null;
  estimatedDate?: string | null;
};

export function ModelFields({
  clients,
  defaults = {},
}: {
  clients: { id: string; name: string }[];
  defaults?: Defaults;
}) {
  const input = "rounded border px-3 py-2";
  const label = "flex flex-col gap-1 text-sm text-zinc-500";
  return (
    <>
      <input name="name" placeholder="Model name" required defaultValue={defaults.name} className={input} />
      <input
        name="company"
        placeholder="Company of the real subject (optional)"
        defaultValue={defaults.company ?? ""}
        className={input}
      />
      <label className={label}>
        Client
        <select name="clientId" defaultValue={defaults.clientId ?? ""} className={input}>
          <option value="">— No client (own project) —</option>
          {clients.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </label>
      <label className={label}>
        Price (€)
        <input
          name="price"
          inputMode="decimal"
          placeholder="0.00"
          defaultValue={defaults.priceCents != null ? (defaults.priceCents / 100).toFixed(2) : ""}
          className={input}
        />
      </label>
      <label className={label}>
        Phase
        <select name="phase" defaultValue={defaults.phase ?? "not_started"} className={input}>
          {modelPhase.enumValues.map((p) => (
            <option key={p} value={p}>{phaseLabels[p]}</option>
          ))}
        </select>
      </label>
      <label className={label}>
        Requested date (from client)
        <input name="requestedDate" type="date" defaultValue={defaults.requestedDate ?? ""} className={input} />
      </label>
      <label className={label}>
        Estimated date
        <input name="estimatedDate" type="date" defaultValue={defaults.estimatedDate ?? ""} className={input} />
      </label>
    </>
  );
}
