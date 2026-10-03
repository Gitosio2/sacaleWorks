import { supplyStatus } from "@/db/schema";
import type { parts } from "@/db/schema";
import { formatEuros, supplyStatusLabels } from "@/lib/labels";

type Part = typeof parts.$inferSelect;

// Shared by models and quotes. The owner-specific server actions come in as
// props, already bound to the owning model or quote.
export function PartsSection({
  parts: rows,
  add,
  updateStatus,
  remove,
}: {
  parts: Part[];
  add: (formData: FormData) => Promise<void>;
  updateStatus: (partId: string, formData: FormData) => Promise<void>;
  remove: (partId: string) => Promise<void>;
}) {
  const input = "rounded border px-3 py-2";
  const totalCents = rows.reduce((acc, p) => acc + (p.priceCents ?? 0), 0);

  return (
    <section className="flex flex-col gap-4">
      <h2 className="text-xl font-semibold">Parts: {formatEuros(totalCents)}</h2>

      <form action={add} className="flex flex-col gap-3">
        <input name="description" placeholder="Description" required className={input} />
        <div className="flex gap-3">
          <input name="brand" placeholder="Brand" className={`${input} w-full`} />
          <input name="reference" placeholder="Reference" className={`${input} w-full`} />
        </div>
        <div className="flex gap-3">
          <input name="price" inputMode="decimal" placeholder="Price (€)" className={`${input} w-full`} />
          <input name="store" placeholder="Store" className={`${input} w-full`} />
        </div>
        <input name="url" type="url" placeholder="Store link (https://...)" className={input} />
        <select name="status" defaultValue="to_order" className={input}>
          {supplyStatus.enumValues.map((s) => (
            <option key={s} value={s}>{supplyStatusLabels[s]}</option>
          ))}
        </select>
        <button type="submit" className="rounded bg-foreground px-3 py-2 text-background">
          Add part
        </button>
      </form>

      <ul className="flex flex-col gap-2">
        {rows.length === 0 && <li className="text-zinc-500">No parts yet.</li>}
        {rows.map((p) => (
          <li key={p.id} className="flex flex-col gap-2 rounded border p-3">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-medium">{p.description}</p>
                <p className="text-sm text-zinc-500">
                  {[p.brand, p.reference].filter(Boolean).join(" · ") || "—"}
                  {" · "}
                  {formatEuros(p.priceCents)}
                </p>
                <p className="text-sm text-zinc-500">
                  {p.url ? (
                    <a href={p.url} target="_blank" rel="noopener noreferrer" className="underline">
                      {p.store ?? "Store link"}
                    </a>
                  ) : (
                    (p.store ?? "No store")
                  )}
                </p>
              </div>
              <form action={remove.bind(null, p.id)}>
                <button type="submit" className="text-sm text-red-600 underline">
                  Delete
                </button>
              </form>
            </div>
            <form action={updateStatus.bind(null, p.id)} className="flex gap-2">
              <select name="status" defaultValue={p.status} className="rounded border px-2 py-1 text-sm">
                {supplyStatus.enumValues.map((s) => (
                  <option key={s} value={s}>{supplyStatusLabels[s]}</option>
                ))}
              </select>
              <button type="submit" className="text-sm underline">Update status</button>
            </form>
          </li>
        ))}
      </ul>
    </section>
  );
}
