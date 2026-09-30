import Link from "next/link";
import { desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { clients, models } from "@/db/schema";
import { formatEuros, phaseLabels } from "@/lib/labels";
import { requireUser } from "@/lib/session";
import { createModel, deleteModel } from "./actions";
import { ModelFields } from "./model-fields";

export default async function ModelsPage() {
  const user = await requireUser();
  const [rows, clientRows] = await Promise.all([
    db
      .select({ model: models, clientName: clients.name })
      .from(models)
      .leftJoin(clients, eq(models.clientId, clients.id))
      .where(eq(models.userId, user.id))
      .orderBy(desc(models.createdAt)),
    db
      .select({ id: clients.id, name: clients.name })
      .from(clients)
      .where(eq(clients.userId, user.id))
      .orderBy(clients.name),
  ]);

  return (
    <main className="mx-auto flex w-full max-w-2xl flex-col gap-8 p-6">
      <h1 className="text-2xl font-semibold">Models</h1>

      <form action={createModel} className="flex flex-col gap-3">
        <ModelFields clients={clientRows} />
        <button type="submit" className="rounded bg-foreground px-3 py-2 text-background">
          Add model
        </button>
      </form>

      <ul className="flex flex-col gap-3">
        {rows.length === 0 && <li className="text-zinc-500">No models yet.</li>}
        {rows.map(({ model: m, clientName }) => (
          <li key={m.id} className="flex items-center justify-between gap-4 rounded border p-3">
            <div>
              <p className="font-medium">
                {m.name}
                {m.company ? ` · ${m.company}` : ""}
              </p>
              <p className="text-sm text-zinc-500">
                {clientName ?? "Own project"} · {phaseLabels[m.phase]} · {formatEuros(m.priceCents)}
              </p>
              <p className="text-sm text-zinc-500">
                Requested: {m.requestedDate ?? "—"} · Estimated: {m.estimatedDate ?? "—"}
              </p>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Link href={`/models/${m.id}/edit`} className="underline">Edit</Link>
              <form action={deleteModel.bind(null, m.id)}>
                <button type="submit" className="text-red-600 underline">Delete</button>
              </form>
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}
