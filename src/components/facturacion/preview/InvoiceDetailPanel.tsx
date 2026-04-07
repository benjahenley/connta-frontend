"use client";

import { useEffect, useState } from "react";
import { ChevronDown, X } from "lucide-react";
import type { InvoiceRow } from "@/app/(content)/facturacion/preview/constants";
import {
  COL_LABELS,
  DATE_COLS,
  DROPDOWN_COLS,
  EXPECTED_COLS,
  PRICE_COLS,
} from "@/app/(content)/facturacion/preview/constants";
import { formatCellValue } from "@/app/(content)/facturacion/preview/formatters";
import { CustomDateInput } from "@/components/facturacion/preview/CustomDateInput";
import { parseDecimalValue } from "@/components/facturacion/preview/tableUtils";

interface InvoiceDetailPanelProps {
  row: InvoiceRow;
  rowIndex: number;
  fullscreen?: boolean;
  onClose: () => void;
  onFieldChange: (rowIdx: number, col: string, value: string | number) => void;
}

const PANEL_FIELDS = [
  "cbteTipo",
  "concepto",
  "cbteFch",
  "docTipo",
  "docNro",
  "condicionIvaReceptorId",
  "razonSocial",
  "domicilioReceptor",
  "impNeto",
  "alicuotaIva",
  "impIva",
  "impOpEx",
  "impTotal",
  "fchServDesde",
  "fchServHasta",
  "fchVtoPago",
  "descripcion",
];

const PANEL_COL_LABELS: Record<string, string> = {
  ...COL_LABELS,
  domicilioReceptor: "Dirección",
};

function fieldValue(row: InvoiceRow, field: string): string {
  const raw = row[field];
  if (raw == null) return "";
  return String(raw);
}

function formatMoneyInput(value: string): string {
  const trimmed = value.trim();
  if (!trimmed) return "";

  const parsed = parseDecimalValue(trimmed);
  if (parsed === null) return "";

  const sanitized = trimmed.replace(/\s/g, "").replace(/[^\d,.-]/g, "");
  const negative = sanitized.startsWith("-");
  const absoluteValue = Math.abs(parsed);
  const formatted = absoluteValue.toLocaleString("es-AR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return `${negative && parsed !== 0 ? "-" : ""}${formatted}`;
}

export function InvoiceDetailPanel({
  row,
  rowIndex,
  fullscreen = false,
  onClose,
  onFieldChange,
}: InvoiceDetailPanelProps) {
  const isService = Number(row.concepto) === 2 || Number(row.concepto) === 3;
  const visibleFields = PANEL_FIELDS.filter((field) => {
    if ((field === "fchServDesde" || field === "fchServHasta" || field === "fchVtoPago") && !isService) {
      return false;
    }
    return EXPECTED_COLS.includes(field) || field === "domicilioReceptor";
  });

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  const containerClass = fullscreen
    ? "fixed inset-x-0 bottom-0 top-14 z-[61] flex flex-col overflow-hidden rounded-t-[28px] border border-gray-100 bg-white shadow-2xl sm:inset-y-0 sm:left-auto sm:right-0 sm:top-0 sm:w-[min(48vw,720px)] sm:min-w-[420px] sm:rounded-none sm:rounded-l-[28px] sm:border-l sm:border-t-0 2xl:w-[min(52vw,820px)]"
    : "fixed inset-x-2 bottom-2 top-2 z-[61] flex flex-col overflow-hidden rounded-[28px] border border-gray-200 bg-white shadow-2xl sm:inset-x-4 sm:top-1/2 sm:bottom-auto sm:w-[min(1080px,calc(100vw-2rem))] sm:max-w-[1080px] sm:-translate-x-1/2 sm:-translate-y-1/2 sm:left-1/2";

  return (
    <>
      <div
        className="fixed inset-0 z-[60]"
        style={{ background: fullscreen ? "rgba(0,0,0,0.08)" : "rgba(15,23,42,0.22)" }}
        onClick={onClose}
      />

      <div className={containerClass}>
        <div
          className={`sticky top-0 z-10 flex items-center justify-between border-b border-gray-100 bg-white/95 py-3 backdrop-blur ${
            fullscreen ? "px-4 sm:px-5 xl:px-6 2xl:px-7" : "px-4 sm:px-5"
          }`}
        >
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">
              Detalle editable
            </p>
            <p className="text-sm font-semibold text-gray-900">
              Fila {rowIndex + 1}
            </p>
          </div>
          <button
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-xl text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600">
            <X size={16} />
          </button>
        </div>

        <div
          className={`py-3 ${
            fullscreen
              ? "fc-scrollbar flex-1 overflow-y-auto px-4 pb-[max(1rem,env(safe-area-inset-bottom))] sm:px-5 xl:px-6 2xl:px-7"
              : "fc-scrollbar flex-1 overflow-y-auto px-4 pb-[max(1rem,env(safe-area-inset-bottom))] sm:px-5"
          }`}
        >
          <div
            className={
              fullscreen
                ? "grid gap-3"
                : "grid gap-3 sm:grid-cols-2 xl:grid-cols-3"
            }
          >
            {visibleFields.map((field) => (
              <FieldEditor
                key={field}
                field={field}
                row={row}
                onChange={(value) => onFieldChange(rowIndex, field, value)}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

function FieldEditor({
  field,
  row,
  onChange,
}: {
  field: string;
  row: InvoiceRow;
  onChange: (value: string | number) => void;
}) {
  const rawValue = fieldValue(row, field);
  const options = DROPDOWN_COLS[field];
  const displayValue = formatCellValue(field, row[field], row);
  const isEmpty = displayValue === "—" || displayValue === "";
  const isWideField = field === "descripcion";
  const isHalfWideField = field === "razonSocial" || field === "domicilioReceptor";
  const isPriceField = PRICE_COLS.has(field);

  return (
    <label
      className={
        isWideField
          ? "sm:col-span-2 xl:col-span-3"
          : isHalfWideField
            ? "sm:col-span-2 xl:col-span-1"
            : ""
      }>
      <span className="mb-1 block text-[10px] font-medium uppercase tracking-[0.08em] text-gray-400">
        {PANEL_COL_LABELS[field] || field}
      </span>

      {options ? (
        <div className="relative">
          <select
            value={rawValue}
            onChange={(e) => onChange(e.target.value)}
            className="h-11 w-full appearance-none rounded-xl border border-gray-200 bg-white px-3 pr-9 text-sm text-gray-900 outline-none transition focus:border-[#27a0c9] focus:ring-2 focus:ring-sky-200">
            <option value="">Seleccionar</option>
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        </div>
      ) : DATE_COLS.has(field) ? (
        <CustomDateInput value={rawValue} onChange={onChange} />
      ) : isPriceField ? (
        <MoneyInput value={rawValue} onChange={onChange} />
      ) : (
        <input
          type="text"
          value={rawValue}
          onChange={(e) => onChange(e.target.value)}
          placeholder={isEmpty ? "Sin dato" : undefined}
          className="h-11 w-full rounded-xl border border-gray-200 bg-white px-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-300 focus:border-[#27a0c9] focus:ring-2 focus:ring-sky-200"
        />
      )}
    </label>
  );
}

function MoneyInput({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string | number) => void;
}) {
  const [displayValue, setDisplayValue] = useState(() => formatMoneyInput(value));

  useEffect(() => {
    setDisplayValue(formatMoneyInput(value));
  }, [value]);

  return (
    <input
      type="text"
      inputMode="decimal"
      value={displayValue}
      onChange={(e) => {
        const formatted = formatMoneyInput(e.target.value);
        setDisplayValue(formatted);

        if (!formatted.trim()) {
          onChange("");
          return;
        }

        const parsed = parseDecimalValue(formatted);
        onChange(parsed ?? "");
      }}
      className="h-11 w-full rounded-xl border border-gray-200 bg-white px-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-300 focus:border-[#27a0c9] focus:ring-2 focus:ring-sky-200"
    />
  );
}
