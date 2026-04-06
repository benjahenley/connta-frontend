import {
  CBTE_TIPO_LABELS,
  CONDICION_IVA_OPTIONS,
  DOC_TIPO_OPTIONS,
  IVA_ALICUOTA_OPTIONS,
  PRICE_COLS,
  DATE_COLS,
  SERVICE_DATE_COLS,
} from "./constants";

function isServiceConcept(value: string | number | null | undefined): boolean {
  const concepto = Number(value);
  return concepto === 2 || concepto === 3;
}

export function parseCbteTipo(raw: string): number | null {
  const v = raw.trim();
  const num = Number(v);
  if (!isNaN(num) && CBTE_TIPO_LABELS[num]) return num;

  const n = v
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9 ]/g, "")
    .trim();

  if (n === "a") return 1;
  if (n === "b") return 6;
  if (n === "c") return 11;

  if (/^fa$|^fact?\s*a$|^factura\s*a$/.test(n)) return 1;
  if (/^fb$|^fact?\s*b$|^factura\s*b$/.test(n)) return 6;
  if (/^fc$|^fact?\s*c$|^factura\s*c$/.test(n)) return 11;

  if (/^nda$|^n\.?\s*d\.?\s*a$|^nota\s*debito\s*a$/.test(n)) return 2;
  if (/^ndb$|^n\.?\s*d\.?\s*b$|^nota\s*debito\s*b$/.test(n)) return 7;
  if (/^ndc$|^n\.?\s*d\.?\s*c$|^nota\s*debito\s*c$/.test(n)) return 12;

  if (/^nca$|^n\.?\s*c\.?\s*a$|^nota\s*credito\s*a$/.test(n)) return 3;
  if (/^ncb$|^n\.?\s*c\.?\s*b$|^nota\s*credito\s*b$/.test(n)) return 8;
  if (/^ncc$|^n\.?\s*c\.?\s*c$|^nota\s*credito\s*c$/.test(n)) return 13;

  if (/^fce\s*a$/.test(n)) return 201;
  if (/^fce\s*b$/.test(n)) return 206;
  if (/^fce\s*c$/.test(n)) return 211;

  return null;
}

export function formatCbteTipo(val: string | number | null): string {
  if (val == null) return "—";
  const code = Number(val);
  const label = CBTE_TIPO_LABELS[code];
  return label ? label : String(val);
}

export function formatPrice(val: string | number | null): string {
  if (val == null || val === "") return "—";
  const n = typeof val === "number" ? val : parseFloat(String(val));
  if (isNaN(n)) return String(val);
  return `$ ${n.toLocaleString("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function formatDocNro(
  val: string | number | null,
  docTipo: string | number | null,
): string {
  if (val == null || val === "") return "—";
  const s = String(val).replace(/[-\s.]/g, "");
  if (Number(docTipo) === 80 && s.length === 11) {
    return `${s.slice(0, 2)}-${s.slice(2, 10)}-${s.slice(10)}`;
  }
  return s;
}

export function formatDate(val: string | number | null): string {
  if (val == null || val === "") return "—";
  const s = String(val).replace(/[-/]/g, "");
  if (s.length === 8 && /^\d{8}$/.test(s)) {
    return `${s.slice(6, 8)}/${s.slice(4, 6)}/${s.slice(0, 4)}`;
  }
  return String(val);
}

export function formatCellValue(
  col: string,
  value: string | number | null,
  row: Record<string, string | number | null>,
): string {
  if (col === "alicuotaIva") {
    if (value == null || value === "") return "21%";
    const opt = IVA_ALICUOTA_OPTIONS.find((o) => o.value === String(value));
    if (opt) return opt.label.split(" · ")[0];
    const formatted = String(value).trim();
    return formatted.endsWith("%") ? formatted : `${formatted}%`;
  }
  if (col === "cbteTipo") return formatCbteTipo(value);
  if (col === "docTipo") {
    return (
      DOC_TIPO_OPTIONS.find((o) => o.value === String(value))?.label ??
      String(value ?? "—")
    );
  }
  if (col === "docNro") return formatDocNro(value, row["docTipo"]);
  if (col === "condicionIvaReceptorId") {
    return (
      CONDICION_IVA_OPTIONS.find((o) => o.value === String(value))?.label ??
      String(value ?? "—")
    );
  }
  if (SERVICE_DATE_COLS.has(col) && !isServiceConcept(row["concepto"])) {
    return "—";
  }
  if (DATE_COLS.has(col)) return formatDate(value);
  if (PRICE_COLS.has(col)) return formatPrice(value);
  return value != null ? String(value) : "—";
}
