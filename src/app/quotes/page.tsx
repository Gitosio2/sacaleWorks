import Link from "next/link";
import { desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { clients, quotes } from "@/db/schema";
import { formatEuros, quoteStatusLabels } from "@/lib/labels";
import { requireUser } from "@/lib/session";
import { createQuote, deleteQuote } from "./actions";
import { QuoteFields } from "./quote-fields";

export default async function QuotesPage() {
  const user = await requireUser();
  const [rows, clientRows] = await Promise.all([
    db
      .select({ quote: quotes, clientName: clients.name })
      .from(quotes)
      .leftJoin(clients, eq(quotes.clientId, clients.id))
      .where(eq(quotes.userId, user.id))
      .orderBy(desc(quotes.createdAt)),
    db
      .select({ id: clients.id, name: clients.name })
      .from(clients)
      .where(eq(clients.userId, user.id))
      .orderBy(clients.name),
  ]);

  return (
    <main className="mx-auto flex w-full max-w-2xl flex-col gap-8 p-6">
      <div className="flex flex-col gap-1">
        <Link href="/" className="text-sm underline">
          ← Home
        </Link>
        <h1 className="text-2xl font-semibold">Quotes</h1>
      </div>

      <form action={createQuote} className="flex flex-col gap-3">
        <QuoteFields clients={clientRows} />
        <button type="submit" className="rounded bg-foreground px-3 py-2 text-background">
          Add quote
        </button>
      </form>

      <ul className="flex flex-col gap-3">
        {rows.length === 0 && <li className="text-zinc-500">No quotes yet.</li>}
        {rows.map(({ quote: q, clientName }) => (
          <li key={q.id} className="flex items-center justify-between gap-4 rounded border p-3">
            <div>
              <Link href={`/quotes/${q.id}`} className="font-medium underline">
                {q.title}
              </Link>
              <p className="text-sm text-zinc-500">
                {clientName ?? "No client"} · {quoteStatusLabels[q.status]} · {formatEuros(q.priceCents)}
              </p>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Link href={`/quotes/${q.id}/edit`} className="underline">Edit</Link>
              <form action={deleteQuote.bind(null, q.id)}>
                <button type="submit" className="text-red-600 underline">Delete</button>
              </form>
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}
