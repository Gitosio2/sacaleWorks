import Link from "next/link";
import { notFound } from "next/navigation";
import { and, desc, eq, sum } from "drizzle-orm";
import { db } from "@/db";
import { clients, models, timeEntries } from "@/db/schema";
import { formatDuration, formatEuros, phaseLabels } from "@/lib/labels";
import { requireUser } from "@/lib/session";
import { addTimeEntry, deleteTimeEntry } from "./actions";

export default async function ModelDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await requireUser();

  const [row] = await db
    .select({ model: models, clientName: clients.name })
    .from(models)
    .leftJoin(clients, eq(models.clientId, clients.id))
    .where(and(eq(models.id, id), eq(models.userId, user.id)));
  if (!row) notFound();
  const { model: m, clientName } = row;

  const [entries, [{ total }]] = await Promise.all([
    db
      .select()
      .from(timeEntries)
      .where(and(eq(timeEntries.modelId, id), eq(timeEntries.userId, user.id)))
      .orderBy(desc(timeEntries.workedOn), desc(timeEntries.id)),
    db
      .select({ total: sum(timeEntries.minutes) })
      .from(timeEntries)
      .where(and(eq(timeEntries.modelId, id), eq(timeEntries.userId, user.id))),
  ]);

  const today = new Date().toLocaleDateString("sv-SE", {
    timeZone: "Europe/Madrid",
  });
  const input = "rounded border px-3 py-2";

  return (
    <main className="mx-auto flex w-full max-w-2xl flex-col gap-8 p-6">
      <div className="flex flex-col gap-1">
        <Link href="/models" className="text-sm underline">
          ← Models
        </Link>
        <h1 className="text-2xl font-semibold">
          {m.name}
          {m.company ? ` · ${m.company}` : ""}
        </h1>
        <p className="text-sm text-zinc-500">
          {clientName ?? "Own project"} · {phaseLabels[m.phase]} ·{" "}
          {formatEuros(m.priceCents)}
        </p>
        <p className="text-sm text-zinc-500">
          Requested: {m.requestedDate ?? "—"} · Estimated:{" "}
          {m.estimatedDate ?? "—"}
        </p>
      </div>

      <section className="flex flex-col gap-4">
        <h2 className="text-xl font-semibold">
          Time: {formatDuration(Number(total ?? 0))}
        </h2>

        <form action={addTimeEntry.bind(null, id)} className="flex gap-3">
          <input
            name="workedOn"
            type="date"
            required
            defaultValue={today}
            className={input}
          />
          <input
            name="duration"
            placeholder="hh:mm"
            pattern="\d{1,2}:[0-5]\d"
            title="Format hh:mm, e.g. 01:30"
            required
            className={`${input} w-24`}
          />
          <button
            type="submit"
            className="rounded bg-foreground px-3 py-2 text-background"
          >
            Add
          </button>
        </form>

        <ul className="flex flex-col gap-2">
          {entries.length === 0 && (
            <li className="text-zinc-500">No time logged yet.</li>
          )}
          {entries.map((e) => (
            <li
              key={e.id}
              className="flex items-center justify-between rounded border p-3"
            >
              <span>
                {e.workedOn} · {formatDuration(e.minutes)}
              </span>
              <form action={deleteTimeEntry.bind(null, id, e.id)}>
                <button type="submit" className="text-sm text-red-600 underline">
                  Delete
                </button>
              </form>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
