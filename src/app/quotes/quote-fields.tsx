import { quoteStatus } from "@/db/schema";
import { quoteStatusLabels } from "@/lib/labels";

type Defaults = {
  title?: string;
  clientId?: string | null;
  priceCents?: number | null;
  status?: (typeof quoteStatus.enumValues)[number];
};

export function QuoteFields({
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
      <input name="title" placeholder="Quote title" required defaultValue={defaults.title} className={input} />
      <label className={label}>
        Client
        <select name="clientId" defaultValue={defaults.clientId ?? ""} className={input}>
          <option value="">— No client —</option>
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
        Status
        <select name="status" defaultValue={defaults.status ?? "open"} className={input}>
          {quoteStatus.enumValues.map((s) => (
            <option key={s} value={s}>{quoteStatusLabels[s]}</option>
          ))}
        </select>
      </label>
    </>
  );
}
