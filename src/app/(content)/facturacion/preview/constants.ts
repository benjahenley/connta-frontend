export const CBTE_TIPO_LABELS: Record<number, string> = {
  1: "Factura A",
  2: "Nota Débito A",
  3: "Nota Crédito A",
  6: "Factura B",
  7: "Nota Débito B",
  8: "Nota Crédito B",
  11: "Factura C",
  12: "Nota Débito C",
  13: "Nota Crédito C",
  201: "FCE A",
  206: "FCE B",
  211: "FCE C",
};

export const CONCEPTO_OPTIONS = [
  { value: "1", label: "1 · Productos" },
  { value: "2", label: "2 · Servicios" },
  { value: "3", label: "3 · Productos y Servicios" },
] as const;

export const CBTE_TIPO_OPTIONS = Object.entries(CBTE_TIPO_LABELS).map(
  ([value, label]) => ({ value, label: `${value} · ${label}` }),
);

export const DOC_TIPO_OPTIONS = [
  { value: "80", label: "80 · CUIT" },
  { value: "86", label: "86 · CUIL" },
  { value: "96", label: "96 · DNI" },
  { value: "99", label: "99 · Doc. Extranjero" },
  { value: "0",  label: "0 · CI Policía Federal" },
  { value: "1",  label: "1 · CI Buenos Aires" },
  { value: "20", label: "20 · CI Extranjera" },
  { value: "23", label: "23 · Pasaporte" },
  { value: "24", label: "24 · CDI" },
] as const;

export const IVA_ALICUOTA_OPTIONS = [
  { value: "0",    label: "0% · Exento / No Gravado" },
  { value: "2.5",  label: "2,5%" },
  { value: "5",    label: "5%" },
  { value: "10.5", label: "10,5%" },
  { value: "21",   label: "21%" },
  { value: "27",   label: "27%" },
] as const;

export const CONDICION_IVA_OPTIONS = [
  { value: "1",  label: "1 · Responsable Inscripto" },
  { value: "4",  label: "4 · Exento" },
  { value: "5",  label: "5 · Consumidor Final" },
  { value: "6",  label: "6 · Monotributista" },
  { value: "7",  label: "7 · No Categorizado" },
  { value: "8",  label: "8 · Proveedor del Exterior" },
  { value: "9",  label: "9 · Cliente del Exterior" },
  { value: "10", label: "10 · Ley 19.640" },
  { value: "11", label: "11 · Agente de Percepción" },
  { value: "12", label: "12 · Pequeño Contribuyente Eventual" },
  { value: "13", label: "13 · Monotributista Social" },
  { value: "14", label: "14 · Peq. Contrib. Eventual Social" },
] as const;

export interface InvoiceRow {
  [key: string]: string | number | null;
}

export const EXPECTED_COLS = [
  "cbteTipo",
  "concepto",
  "docTipo",
  "docNro",
  "domicilioReceptor",
  "condicionIvaReceptorId",
  "razonSocial",
  "descripcion",
  "impNeto",
  "alicuotaIva",
  "impIva",
  "impOpEx",
  "impTotal",
  "cbteFch",
  "fchServDesde",
  "fchServHasta",
  "fchVtoPago",
];

export const REQUIRED_COLS = new Set([
  "cbteTipo",
  "docTipo",
  "docNro",
  "impTotal",
  "cbteFch",
]);

export const SERVICE_REQUIRED_COLS = new Set([
  "fchServDesde",
  "fchServHasta",
  "fchVtoPago",
]);

export const SERVICE_DATE_COLS = new Set([
  "fchServDesde",
  "fchServHasta",
  "fchVtoPago",
]);

export const COL_LABELS: Record<string, string> = {
  cbteTipo: "Tipo Cbte",
  concepto: "Conc.",
  docTipo: "T. Doc",
  docNro: "Nro Doc",
  domicilioReceptor: "Domicilio",
  condicionIvaReceptorId: "Cond. IVA",
  razonSocial: "Razón Social",
  descripcion: "Descripción",
  impNeto: "Imp. Neto",
  alicuotaIva: "% IVA",
  impIva: "Imp. IVA",
  impOpEx: "Imp. Op.Ex.",
  impTotal: "Imp. Total",
  cbteFch: "Fecha",
  fchServDesde: "Serv. Desde",
  fchServHasta: "Serv. Hasta",
  fchVtoPago: "Vto. Pago",
};

export const PRICE_COLS = new Set(["impNeto", "impIva", "impOpEx", "impTotal"]);

export const DATE_COLS = new Set([
  "cbteFch",
  "fchServDesde",
  "fchServHasta",
  "fchVtoPago",
]);

/** Columns that render as a custom dropdown in cell editing */
export const DROPDOWN_COLS: Record<string, readonly { value: string; label: string }[]> = {
  cbteTipo: CBTE_TIPO_OPTIONS,
  concepto: CONCEPTO_OPTIONS,
  condicionIvaReceptorId: CONDICION_IVA_OPTIONS,
  docTipo: DOC_TIPO_OPTIONS,
  alicuotaIva: IVA_ALICUOTA_OPTIONS,
};
