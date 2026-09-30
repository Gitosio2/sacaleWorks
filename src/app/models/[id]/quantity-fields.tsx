const QUICK = [
  ["1/16", "1/16"],
  ["1/8", "1/8"],
  ["1/4", "1/4"],
  ["1/2", "1/2"],
  ["1", "1 unit"],
] as const;

export function QuantityFields({ defaultQuick = "" }: { defaultQuick?: string }) {
  const input = "rounded border px-3 py-2";
  return (
    <>
      <select name="quantity" defaultValue={defaultQuick} className={input}>
        <option value="">Quantity (optional)</option>
        {QUICK.map(([value, label]) => (
          <option key={value} value={value}>{label}</option>
        ))}
      </select>
      <input
        name="quantityCustom"
        placeholder="Custom (3/8, 0,3...)"
        className={`${input} w-40`}
      />
    </>
  );
}
