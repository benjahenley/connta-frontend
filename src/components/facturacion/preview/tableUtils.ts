import { parseCbteTipo } from "@/app/(content)/facturacion/preview/formatters";
import type { InvoiceRow } from "@/app/(content)/facturacion/preview/constants";
import {
  SERVICE_DATE_COLS,
  DATE_COLS,
  PRICE_COLS,
} from "@/app/(content)/facturacion/preview/constants";

export function parseDecimalValue(
  value: string | number | null | undefined,
): number | null {
  if (typeof value === "number") {
    return Number.isFinite(value) ? value : null;
  }
  if (value == null) return null;

  const raw = String(value).trim().replace(/\s/g, "");
  if (!raw) return null;

  const lastComma = raw.lastIndexOf(",");
  const lastDot = raw.lastIndexOf(".");
  const decimalIndex = Math.max(lastComma, lastDot);

  if (decimalIndex === -1) {
    const parsed = Number(raw.replace(/[^\d-]/g, ""));
    return Number.isFinite(parsed) ? parsed : null;
  }

  const integerPart = raw.slice(0, decimalIndex).replace(/[^\d-]/g, "");
  const decimalPart = raw.slice(decimalIndex + 1).replace(/[^\d]/g, "");
  const normalized = `${integerPart || "0"}.${decimalPart}`;
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : null;
}

export function normalizeEditValue(col: string, value: string): string | number {
  if (!value.trim()) return value;
  if (col === "cbteTipo") {
    const code = parseCbteTipo(value);
    if (code !== null) return code;
  }
  if (col === "concepto") {
    const parsed = Number(value);
    if (parsed === 1 || parsed === 2 || parsed === 3) return parsed;
  }
  if (col === "condicionIvaReceptorId") {
    const parsed = Number(value);
    if (!isNaN(parsed) && parsed > 0) return parsed;
  }
  if (col === "alicuotaIva" || PRICE_COLS.has(col)) {
    const parsed = parseDecimalValue(value);
    if (!isNaN(parsed) && parsed >= 0) return parsed;
  }
  if (col === "docTipo") {
    const parsed = Number(value);
    if (!isNaN(parsed) && parsed >= 0) return parsed;
  }
  return value;
}

export function isServiceConcept(value: string | number | null | undefined): boolean {
  const concepto = Number(value);
  return concepto === 2 || concepto === 3;
}

export function canEditCell(row: InvoiceRow, col: string): boolean {
  if (SERVICE_DATE_COLS.has(col) && !isServiceConcept(row.concepto)) {
    return false;
  }
  return true;
}

export function toDateInputValue(value: string): string {
  const digits = value.replace(/\D/g, "");
  if (!/^\d{8}$/.test(digits)) return "";
  return `${digits.slice(0, 4)}-${digits.slice(4, 6)}-${digits.slice(6, 8)}`;
}

export function fromDateInputValue(value: string): string {
  return value.replace(/\D/g, "");
}

export { DATE_COLS };
