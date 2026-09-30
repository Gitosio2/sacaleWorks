import { notFound } from "next/navigation";
import { and, eq } from "drizzle-orm";
import { db } from "@/db";
import { consumables } from "@/db/schema";
import { requireUser } from "@/lib/session";
import { updateConsumable } from "../../actions";
import { ConsumableFields } from "../../consumable-fields";

export default async function EditConsumablePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await requireUser();
  const [consumable] = await db
    .select()
    .from(consumables)
    .where(and(eq(consumables.id, id), eq(consumables.userId, user.id)));
  if (!consumable) notFound();

  return (
    <main className="mx-auto flex w-full max-w-2xl flex-col gap-6 p-6">
      <h1 className="text-2xl font-semibold">Edit consumable</h1>
      <form action={updateConsumable.bind(null, id)} className="flex flex-col gap-3">
        <ConsumableFields defaults={consumable} />
        <button type="submit" className="rounded bg-foreground px-3 py-2 text-background">
          Save
        </button>
      </form>
    </main>
  );
}
