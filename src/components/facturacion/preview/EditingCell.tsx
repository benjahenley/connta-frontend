"use client";

import { DROPDOWN_COLS, DATE_COLS } from "@/app/(content)/facturacion/preview/constants";
import { CellDropdown } from "./CellDropdown";

interface EditingCellProps {
  col: string;
  value: string;
  onChange: (v: string) => void;
  onSave: (override?: string) => void;
  onCancel: () => void;
}

export function EditingCell({ col, value, onChange, onSave, onCancel }: EditingCellProps) {
  const options = DROPDOWN_COLS[col];

  if (options) {
    return (
      <CellDropdown
        options={options}
        value={value}
        onSelect={(v) => { onChange(v); onSave(v); }}
        onCancel={onCancel}
      />
    );
  }

  const sharedInputProps = {
    autoFocus: true,
    value,
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => onChange(e.target.value),
    onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") onSave();
      if (e.key === "Escape") { onCancel(); e.stopPropagation(); }
    },
    onBlur: () => onSave(),
    className: "h-8 w-full rounded-lg border px-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sky-300",
    style: { borderColor: "#27a0c9" },
  };

  if (DATE_COLS.has(col)) {
    return <input type="date" {...sharedInputProps} />;
  }

  return <input {...sharedInputProps} />;
}
