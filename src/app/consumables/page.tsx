import Link from "next/link";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { consumables, supplyStatus } from "@/db/schema";
import { formatEuros, supplyStatusLabels } from "@/lib/labels";
import { requireUser } from "@/lib/session";
import {
  createConsumable,
  deleteConsumable,
  updateConsumableStatus,
} from "./actions";
import { ConsumableFields } from "./consumable-fields";

export default async function ConsumablesPage() {
  const user = await requireUser();
  const rows = await db
    .select()
    .from(consumables)
    .where(eq(consumables.userId, user.id))
    .orderBy(consumables.description);

  return (
    <main className="mx-auto flex w-full max-w-2xl flex-col gap-8 p-6">
      <div className="flex flex-col gap-1">
        <Link href="/" className="text-sm underline">
          ← Home
        </Link>
        <h1 className="text-2xl font-semibold">Consumables</h1>
      </div>

      <form action={createConsumable} className="flex flex-col gap-3">
        <ConsumableFields />
        <button type="submit" className="rounded bg-foreground px-3 py-2 text-background">
          Add consumable
        </button>
      </form>

      <ul className="flex flex-col gap-3">
        {rows.length === 0 && <li className="text-zinc-500">No consumables yet.</li>}
        {rows.map((c) => (
          <li key={c.id} className="flex flex-col gap-2 rounded border p-3">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-medium">{c.description}</p>
                <p className="text-sm text-zinc-500">
                  {[c.store, c.reference].filter(Boolean).join(" · ") || "—"}
                  {" · "}
                  {formatEuros(c.priceCents)}
                </p>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Link href={`/consumables/${c.id}/edit`} className="underline">Edit</Link>
                <form action={deleteConsumable.bind(null, c.id)}>
                  <button type="submit" className="text-red-600 underline">Delete</button>
                </form>
              </div>
            </div>
            <form action={updateConsumableStatus.bind(null, c.id)} className="flex gap-2">
              <select name="status" defaultValue={c.status} className="rounded border px-2 py-1 text-sm">
                {supplyStatus.enumValues.map((s) => (
                  <option key={s} value={s}>{supplyStatusLabels[s]}</option>
                ))}
              </select>
              <button type="submit" className="text-sm underline">Update status</button>
            </form>
          </li>
        ))}
      </ul>
    </main>
  );
}
