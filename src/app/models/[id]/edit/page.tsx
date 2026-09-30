import { notFound } from "next/navigation";
import { and, eq } from "drizzle-orm";
import { db } from "@/db";
import { clients, models } from "@/db/schema";
import { requireUser } from "@/lib/session";
import { updateModel } from "../../actions";
import { ModelFields } from "../../model-fields";

export default async function EditModelPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await requireUser();
  const [[model], clientRows] = await Promise.all([
    db
      .select()
      .from(models)
      .where(and(eq(models.id, id), eq(models.userId, user.id))),
    db
      .select({ id: clients.id, name: clients.name })
      .from(clients)
      .where(eq(clients.userId, user.id))
      .orderBy(clients.name),
  ]);
  if (!model) notFound();

  return (
    <main className="mx-auto flex w-full max-w-2xl flex-col gap-6 p-6">
      <h1 className="text-2xl font-semibold">Edit model</h1>
      <form action={updateModel.bind(null, id)} className="flex flex-col gap-3">
        <ModelFields clients={clientRows} defaults={model} />
        <button type="submit" className="rounded bg-foreground px-3 py-2 text-background">
          Save
        </button>
      </form>
    </main>
  );
}
