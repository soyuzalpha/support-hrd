export function formatRupiah(value: number | string, withPrefix: boolean = true): string {
  if (value === null || value === undefined || value === "") return "";

  const numberValue = typeof value === "string" ? Number(value) : value;

  if (isNaN(numberValue)) return "";

  const formatted = numberValue.toLocaleString("id-ID", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

  return withPrefix ? `Rp ${formatted}` : formatted;
}

export function parseRupiah(value: string | number): number {
  if (typeof value === "number") return value;

  // Hilangkan semua karakter non-digit
  const numericString = value.replace(/[^0-9]/g, "");

  return Number(numericString);
}

export const formatUsd = (value: string | number) => {
  if (!value) return "";
  const number = typeof value === "string" ? parseFloat(value) : value;
  if (isNaN(number)) return "";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  })
    .format(number)
    .replace("$", ""); // kita udah tampilkan $ manual di depan
};
