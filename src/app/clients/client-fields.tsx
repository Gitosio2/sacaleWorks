type Defaults = { name?: string; contact?: string; company?: string | null };

export function ClientFields({ defaults = {} }: { defaults?: Defaults }) {
  const input = "rounded border px-3 py-2";
  return (
    <>
      <input name="name" placeholder="Name" required defaultValue={defaults.name} className={input} />
      <input name="contact" placeholder="Contact (email or phone)" required defaultValue={defaults.contact} className={input} />
      <input name="company" placeholder="Company (optional)" defaultValue={defaults.company ?? ""} className={input} />
    </>
  );
}
