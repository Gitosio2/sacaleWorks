import Link from "next/link";
import { desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { clients } from "@/db/schema";
import { requireUser } from "@/lib/session";
import { createClient, deleteClient } from "./actions";
import { ClientFields } from "./client-fields";

export default async function ClientsPage() {
  const user = await requireUser();
  const rows = await db
    .select()
    .from(clients)
    .where(eq(clients.userId, user.id))
    .orderBy(desc(clients.createdAt));

  return (
    <main className="mx-auto flex w-full max-w-2xl flex-col gap-8 p-6">
      <h1 className="text-2xl font-semibold">Clients</h1>

      <form action={createClient} className="flex flex-col gap-3">
        <ClientFields />
        <button type="submit" className="rounded bg-foreground px-3 py-2 text-background">
          Add client
        </button>
      </form>

      <ul className="flex flex-col gap-3">
        {rows.length === 0 && <li className="text-zinc-500">No clients yet.</li>}
        {rows.map((c) => (
          <li key={c.id} className="flex items-center justify-between gap-4 rounded border p-3">
            <div>
              <p className="font-medium">{c.name}</p>
              <p className="text-sm text-zinc-500">
                {c.contact}
                {c.company ? ` · ${c.company}` : ""}
              </p>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Link href={`/clients/${c.id}/edit`} className="underline">Edit</Link>
              <form action={deleteClient.bind(null, c.id)}>
                <button type="submit" className="text-red-600 underline">Delete</button>
              </form>
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}
