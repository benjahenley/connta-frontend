"use client";

import { memo } from "react";
import { Eye, Pencil, Trash2 } from "lucide-react";
import type { InvoiceRow } from "@/app/(content)/facturacion/preview/constants";
import { formatCellValue } from "@/app/(content)/facturacion/preview/formatters";
import { canEditCell } from "./tableUtils";
import { EditingCell } from "./EditingCell";

interface PreviewRowProps {
  row: InvoiceRow;
  rowIdx: number;
  columns: string[];
  origRow: InvoiceRow | undefined;
  isRestored: boolean;
  tone?: "error" | "warning";
  editCell: { row: number; col: string } | null;
  editValue: string;
  onStartEdit: (rowIdx: number, col: string, row: InvoiceRow) => void;
  onEditValueChange: (value: string) => void;
  onSaveEdit: (overrideValue?: string) => void;
  onCancelEdit: () => void;
  onDeleteRow: (rowIdx: number) => void;
  onRowClick?: (rowIdx: number) => void;
}

export const PreviewRow = memo(
  function PreviewRow({
    row,
    rowIdx,
    columns,
    origRow,
    isRestored,
    tone,
    editCell,
    editValue,
    onStartEdit,
    onEditValueChange,
    onSaveEdit,
    onCancelEdit,
    onDeleteRow,
    onRowClick,
  }: PreviewRowProps) {
    const rowToneClass =
      tone === "error"
        ? "bg-red-50/70 hover:bg-red-50"
        : tone === "warning"
          ? "bg-amber-50/60 hover:bg-amber-50"
          : "hover:bg-blue-50/30";

    return (
      <tr
        className={`border-t border-gray-50 transition-colors ${rowToneClass} ${
          isRestored ? "animate-flash-restore" : ""
        }`}>
        <td
          className={`h-11 px-4 py-2.5 align-middle ${onRowClick ? "cursor-pointer" : ""}`}
          onClick={() => onRowClick?.(rowIdx)}>
          <div className="flex items-center gap-1.5">
            <span className={`text-xs font-semibold tabular-nums ${onRowClick ? "text-[#27a0c9] hover:underline" : "text-slate-300"}`}>
              {rowIdx + 1}
            </span>
            {tone === "warning" && (
              <Eye className="h-3.5 w-3.5 text-amber-600" />
            )}
          </div>
        </td>
        {columns.map((col) => {
          const isEditing = editCell?.row === rowIdx && editCell?.col === col;
          const isEdited =
            !!origRow && String(row[col] ?? "") !== String(origRow[col] ?? "");

          return (
            <td
              key={col}
              className={`relative h-11 px-4 py-2.5 whitespace-nowrap align-middle transition-colors ${
                isEdited ? "bg-sky-50/80" : ""
              }`}>
              {isEditing ? (
                <div className="absolute inset-x-3 inset-y-1.5 flex items-center">
                  <EditingCell
                    col={col}
                    value={editValue}
                    onChange={onEditValueChange}
                    onSave={onSaveEdit}
                    onCancel={onCancelEdit}
                  />
                </div>
              ) : (
                <div
                  className={`group flex min-h-6 items-center gap-1.5 ${
                    canEditCell(row, col) ? "cursor-pointer" : "cursor-default"
                  }`}
                  onClick={() => onStartEdit(rowIdx, col, row)}>
                  <span
                    className={
                      isEdited ? "text-sky-900 font-medium" : "text-gray-700"
                    }>
                    {formatCellValue(col, row[col], row)}
                  </span>
                  {canEditCell(row, col) && (
                    <Pencil className="w-3 h-3 text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                  )}
                </div>
              )}
            </td>
          );
        })}
        <td className="h-11 px-4 py-2.5 align-middle">
          <button
            onClick={() => onDeleteRow(rowIdx)}
            title="Eliminar fila"
            className="p-1.5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer">
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </td>
      </tr>
    );
  },
  (prev, next) => {
    if (prev.row !== next.row) return false;
    if (prev.origRow !== next.origRow) return false;
    if (prev.columns !== next.columns) return false;
    if (prev.isRestored !== next.isRestored) return false;
    if (prev.tone !== next.tone) return false;

    const prevIsEditing = prev.editCell?.row === prev.rowIdx;
    const nextIsEditing = next.editCell?.row === next.rowIdx;

    if (prevIsEditing !== nextIsEditing) return false;
    if (!prevIsEditing && !nextIsEditing) return true;

    return (
      prev.editCell?.col === next.editCell?.col &&
      prev.editValue === next.editValue
    );
  },
);
