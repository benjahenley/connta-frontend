"use client";

import { useState, useCallback, useRef, useEffect, useMemo } from "react";
import { Pencil } from "lucide-react";
import type { InvoiceRow } from "@/app/(content)/facturacion/preview/constants";
import {
  REQUIRED_COLS,
  SERVICE_REQUIRED_COLS,
  COL_LABELS,
} from "@/app/(content)/facturacion/preview/constants";
import {
  normalizeEditValue,
  canEditCell,
  toDateInputValue,
  fromDateInputValue,
  DATE_COLS,
} from "./tableUtils";
import { PreviewRow } from "./PreviewRow";
import { BulkEditPopover } from "./BulkEditPopover";

interface PreviewTableProps {
  rows: InvoiceRow[];
  originalRows: InvoiceRow[];
  columns: string[];
  sticky?: boolean;
  hasServiceRows: boolean;
  restoredIds?: Set<string>;
  rowTones?: Map<string, "error" | "warning">;
  onCellEdit: (rowIdx: number, col: string, value: string | number) => void;
  onBulkEdit: (col: string, value: string | number) => void;
  onDeleteRow: (rowIdx: number) => void;
  onRowClick?: (rowIdx: number) => void;
}

export function PreviewTable({
  rows,
  originalRows,
  columns,
  sticky = false,
  hasServiceRows,
  restoredIds,
  rowTones,
  onCellEdit,
  onBulkEdit,
  onDeleteRow,
  onRowClick,
}: PreviewTableProps) {
  const bulkEditRef = useRef<HTMLDivElement | null>(null);

  const originalById = useMemo(
    () => new Map(originalRows.map((r) => [String(r._id ?? ""), r])),
    [originalRows],
  );

  const [editCell, setEditCell] = useState<{ row: number; col: string } | null>(null);
  const [editValue, setEditValue] = useState("");

  const [bulkEditColumn, setBulkEditColumn] = useState<string | null>(null);
  const [bulkEditValue, setBulkEditValue] = useState("");
  const [bulkEditMenuOpen, setBulkEditMenuOpen] = useState(false);

  const startEdit = useCallback(
    (rowIdx: number, col: string, row: InvoiceRow) => {
      if (!canEditCell(row, col)) return;
      setBulkEditColumn(null);
      setBulkEditMenuOpen(false);
      setEditCell({ row: rowIdx, col });
      const rawValue = String(row[col] ?? "");
      setEditValue(DATE_COLS.has(col) ? toDateInputValue(rawValue) : rawValue);
    },
    [],
  );

  const saveEdit = useCallback(
    (overrideValue?: string) => {
      if (!editCell) return;
      const val = overrideValue !== undefined ? overrideValue : editValue;
      const normalizedValue = DATE_COLS.has(editCell.col) ? fromDateInputValue(val) : val;
      const finalValue = normalizeEditValue(editCell.col, normalizedValue);
      const currentValue = rows[editCell.row]?.[editCell.col];
      if (String(finalValue) !== String(currentValue ?? "")) {
        onCellEdit(editCell.row, editCell.col, finalValue);
      }
      setEditCell(null);
    },
    [editCell, editValue, onCellEdit, rows],
  );

  const startBulkEdit = (col: string) => {
    setEditCell(null);
    setBulkEditColumn(col);
    setBulkEditValue("");
    setBulkEditMenuOpen(false);
  };

  const applyBulkEdit = useCallback(() => {
    if (!bulkEditColumn) return;
    const normalizedValue = DATE_COLS.has(bulkEditColumn)
      ? fromDateInputValue(bulkEditValue)
      : bulkEditValue;
    const finalValue = normalizeEditValue(bulkEditColumn, normalizedValue);
    onBulkEdit(bulkEditColumn, finalValue);
    setBulkEditColumn(null);
    setBulkEditMenuOpen(false);
  }, [bulkEditColumn, bulkEditValue, onBulkEdit]);

  const cancelEdit = () => {
    setEditCell(null);
    setBulkEditColumn(null);
    setBulkEditMenuOpen(false);
  };

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape" && bulkEditColumn) setBulkEditColumn(null);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [bulkEditColumn]);

  useEffect(() => {
    if (!bulkEditColumn) return;
    const handlePointerDown = (event: MouseEvent | TouchEvent) => {
      const target = event.target as Node | null;
      if (bulkEditRef.current && target && !bulkEditRef.current.contains(target)) {
        setBulkEditColumn(null);
      }
    };
    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("touchstart", handlePointerDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("touchstart", handlePointerDown);
    };
  }, [bulkEditColumn]);

  return (
    <table className="w-full min-w-max text-sm">
      <thead className={sticky ? "sticky top-0 z-10" : ""}>
        <tr style={{ background: "#f8fafc" }}>
          <th
            className="px-4 py-3 w-14 text-left text-xs font-semibold uppercase tracking-wider whitespace-nowrap"
            style={{ ...(sticky ? { background: "#f8fafc" } : {}), color: "#cbd5e1" }}>
            #
          </th>
          {columns.map((col) => {
            const isRequired = REQUIRED_COLS.has(col);
            const isServiceRequired = SERVICE_REQUIRED_COLS.has(col) && hasServiceRows;
            const showAsterisk = isRequired || isServiceRequired;
            return (
              <th
                key={col}
                className="relative px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider whitespace-nowrap"
                style={{ ...(sticky ? { background: "#f8fafc" } : {}), color: "#9ca3af" }}>
                <button
                  type="button"
                  onClick={() => startBulkEdit(col)}
                  className="group inline-flex items-center gap-1.5 cursor-pointer hover:text-gray-600 transition-colors">
                  <span>
                    {COL_LABELS[col] || col}
                    {showAsterisk && <span style={{ color: "#dc2626" }}> *</span>}
                  </span>
                  <Pencil className="w-3 h-3 text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
                {bulkEditColumn === col && (
                  <BulkEditPopover
                    ref={bulkEditRef}
                    col={col}
                    value={bulkEditValue}
                    menuOpen={bulkEditMenuOpen}
                    onValueChange={setBulkEditValue}
                    onMenuToggle={() => setBulkEditMenuOpen((p) => !p)}
                    onMenuSelect={(v) => { setBulkEditValue(v); setBulkEditMenuOpen(false); }}
                    onApply={applyBulkEdit}
                    onCancel={cancelEdit}
                  />
                )}
              </th>
            );
          })}
          <th className="px-4 py-3 w-10" style={sticky ? { background: "#f8fafc" } : undefined} />
        </tr>
      </thead>
      <tbody>
        {rows.map((row, rowIdx) => (
          <PreviewRow
            key={row._id ?? rowIdx}
            row={row}
            rowIdx={rowIdx}
            columns={columns}
            origRow={originalById.get(String(row._id ?? ""))}
            isRestored={!!restoredIds?.has(String(row._id ?? ""))}
            tone={rowTones?.get(String(row._id ?? ""))}
            editCell={editCell}
            editValue={editValue}
            onStartEdit={startEdit}
            onEditValueChange={setEditValue}
            onSaveEdit={saveEdit}
            onCancelEdit={cancelEdit}
            onDeleteRow={onDeleteRow}
            onRowClick={onRowClick}
          />
        ))}
      </tbody>
    </table>
  );
}
