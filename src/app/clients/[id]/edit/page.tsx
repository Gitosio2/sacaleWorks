import { notFound } from "next/navigation";
import { and, eq } from "drizzle-orm";
import { db } from "@/db";
import { clients } from "@/db/schema";
import { requireUser } from "@/lib/session";
import { updateClient } from "../../actions";
import { ClientFields } from "../../client-fields";

export default async function EditClientPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await requireUser();
  const [client] = await db
    .select()
    .from(clients)
    .where(and(eq(clients.id, id), eq(clients.userId, user.id)));
  if (!client) notFound();

  return (
    <main className="mx-auto flex w-full max-w-2xl flex-col gap-6 p-6">
      <h1 className="text-2xl font-semibold">Edit client</h1>
      <form action={updateClient.bind(null, id)} className="flex flex-col gap-3">
        <ClientFields defaults={client} />
        <button type="submit" className="rounded bg-foreground px-3 py-2 text-background">
          Save
        </button>
      </form>
    </main>
  );
}
