// utils/extensions/date.ts
import { format } from "date-fns";
import moment from "moment";

/**
 * Parse date ke moment object
 */
export function parseDate(input: string | Date | number): moment.Moment {
  return moment(input);
}

/**
 * Format tanggal ke string (default: YYYY-MM-DD)
 */
export function formatDate(input: string | number, format = "YYYY-MM-DD"): string {
  const date = parseDate(input);
  return date.isValid() ? date.format(format) : "";
}

export function validDate(input: string | number) {
  const date = parseDate(input);
  return date.isValid() ? date.format("YYYY-MM-DD") : date;
}

export function dateDisplay(dateString: string, withHour: boolean = false): string {
  if (!dateString) return "-";

  const format = withHour ? "YYYY-MM-DD HH:mm" : "YYYY-MM-DD";
  const date = moment(dateString, ["YYYY-MM-DD HH:mm:ss", moment.ISO_8601], true);

  return date.isValid() ? date.format(format) : "";
}

/**
 * Cek apakah dua tanggal sama (tanpa jam)
 */
export function isSameDate(a: string | Date, b: string | Date): boolean {
  return moment(a).isSame(moment(b), "day");
}

/**
 * Hitung selisih hari antara dua tanggal
 */
export function getDayDiff(from: string | Date, to: string | Date): number {
  return moment(to).diff(moment(from), "days");
}

/**
 * Ambil hari ini (YYYY-MM-DD)
 */
export function getToday(format = "YYYY-MM-DD"): string {
  return moment().format(format);
}

/**
 * Ambil tanggal hari pertama bulan ini
 */
export function getFirstDayOfMonth(format = "YYYY-MM-DD"): string {
  return moment().startOf("month").format(format);
}

/**
 * Ambil tanggal hari terakhir bulan ini
 */
export function getLastDayOfMonth(format = "YYYY-MM-DD"): string {
  return moment().endOf("month").format(format);
}

/**
 * Ambil tahun dari tanggal
 */
export function getYear(input: string | Date | number): number {
  return moment(input).year();
}

/**
 * Ambil bulan (1–12) dari tanggal
 */
export function getMonth(input: string | Date | number): number {
  return moment(input).month() + 1; // month() is 0-indexed
}

/**
 * Ambil hari (1–31) dari tanggal
 */
export function getDay(input: string | Date | number): number {
  return moment(input).date();
}

/**
 * Format ke ISO String (YYYY-MM-DDTHH:mm:ssZ)
 */
// export function toISOStringFormat(input: string | Date | number): string {
//   const date = parseDate(input);
//   return date.isValid() ? date.toISOString() : "";
// }

export function toISOStringFormat(date: Date): string {
  // Kalau input kosong/null, langsung return ""
  if (!date) return "";

  // Format ke "YYYY-MM-DD HH:mm:ss" sesuai local time
  return format(date, "yyyy-MM-dd HH:mm:ss");
}
