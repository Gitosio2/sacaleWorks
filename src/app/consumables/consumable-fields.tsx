import { supplyStatus } from "@/db/schema";
import { supplyStatusLabels } from "@/lib/labels";

type Defaults = {
  description?: string;
  store?: string | null;
  reference?: string | null;
  priceCents?: number | null;
  status?: (typeof supplyStatus.enumValues)[number];
};

export function ConsumableFields({ defaults = {} }: { defaults?: Defaults }) {
  const input = "rounded border px-3 py-2";
  return (
    <>
      <input name="description" placeholder="Description" required defaultValue={defaults.description} className={input} />
      <div className="flex gap-3">
        <input name="store" placeholder="Store" defaultValue={defaults.store ?? ""} className={`${input} w-full`} />
        <input name="reference" placeholder="Reference (optional)" defaultValue={defaults.reference ?? ""} className={`${input} w-full`} />
      </div>
      <input
        name="price"
        inputMode="decimal"
        placeholder="Price (€)"
        defaultValue={defaults.priceCents != null ? (defaults.priceCents / 100).toFixed(2) : ""}
        className={input}
      />
      <select name="status" defaultValue={defaults.status ?? "to_order"} className={input}>
        {supplyStatus.enumValues.map((s) => (
          <option key={s} value={s}>{supplyStatusLabels[s]}</option>
        ))}
      </select>
    </>
  );
}
