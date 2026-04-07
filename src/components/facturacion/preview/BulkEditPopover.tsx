"use client";

import { forwardRef, useRef, useState, useLayoutEffect } from "react";
import { createPortal } from "react-dom";
import { ChevronDown } from "lucide-react";
import { COL_LABELS, DROPDOWN_COLS, DATE_COLS } from "@/app/(content)/facturacion/preview/constants";
import { CustomDateInput } from "./CustomDateInput";

interface BulkEditPopoverProps {
  col: string;
  value: string;
  menuOpen: boolean;
  onValueChange: (v: string) => void;
  onMenuToggle: () => void;
  onMenuSelect: (v: string) => void;
  onApply: () => void;
  onCancel: () => void;
}

export const BulkEditPopover = forwardRef<HTMLDivElement, BulkEditPopoverProps>(
  function BulkEditPopover(
    { col, value, menuOpen, onValueChange, onMenuToggle, onMenuSelect, onApply, onCancel },
    ref,
  ) {
    const localRef = useRef<HTMLDivElement | null>(null);
    const anchorRef = useRef<HTMLDivElement | null>(null);
    const [position, setPosition] = useState<{
      top: number;
      left: number;
      minWidth: number;
    } | null>(null);

    const opts = DROPDOWN_COLS[col];
    const isSelect = !!opts;
    const isDate = !isSelect && DATE_COLS.has(col);

    useLayoutEffect(() => {
      const anchor = anchorRef.current;
      const node = localRef.current;
      if (!anchor || !node) return;

      const updatePosition = () => {
        const anchorRect = anchor.getBoundingClientRect();
        const popoverRect = node.getBoundingClientRect();
        const padding = 8;
        let nextLeft = anchorRect.left;
        if (nextLeft + popoverRect.width > window.innerWidth - padding) {
          nextLeft = Math.max(padding, window.innerWidth - popoverRect.width - padding);
        }
        setPosition({ top: anchorRect.bottom + 8, left: nextLeft, minWidth: Math.max(anchorRect.width, 256) });
      };

      updatePosition();
      window.addEventListener("scroll", updatePosition, true);
      window.addEventListener("resize", updatePosition);
      return () => {
        window.removeEventListener("scroll", updatePosition, true);
        window.removeEventListener("resize", updatePosition);
      };
    }, [col, value, menuOpen]);

    return (
      <>
        <div ref={anchorRef} className="absolute left-0 top-full h-0 w-0" />
        {typeof document !== "undefined" &&
          createPortal(
            <div
              ref={(node) => {
                localRef.current = node;
                if (typeof ref === "function") ref(node);
                else if (ref) ref.current = node;
              }}
              className="fc-sora fixed z-[1100] min-w-64 rounded-2xl border bg-white p-2 normal-case shadow-lg"
              style={{
                top: position?.top ?? -9999,
                left: position?.left ?? -9999,
                minWidth: position?.minWidth ?? 256,
                visibility: position ? "visible" : "hidden",
                borderColor: "#e8ecf0",
                boxShadow: "0 12px 30px rgba(15, 23, 42, 0.10)",
              }}>
              <div
                className="mb-2 inline-flex items-center gap-2 rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide"
                style={{ background: "rgba(39,160,201,.08)", color: "#1e7a9c" }}>
                <span>{COL_LABELS[col] || col}</span>
                <span className="text-gray-400">=</span>
                <span className="text-gray-500 font-medium normal-case">valor para toda la columna</span>
              </div>
              <div className="flex items-center gap-2">
                {isSelect && opts ? (
                  <div className="relative min-w-0 flex-1">
                    <button
                      type="button"
                      onClick={onMenuToggle}
                      className="flex w-full items-center justify-between rounded-xl border px-3 py-2 text-sm text-gray-700 transition-colors"
                      style={{ borderColor: "#dbe7ee", background: "white" }}>
                      <span
                        className={`min-w-0 truncate ${value ? "text-gray-700" : "text-gray-400"}`}>
                        {opts.find((o) => o.value === value)?.label ?? "Seleccioná un valor"}
                      </span>
                      <ChevronDown className={`ml-2 h-4 w-4 shrink-0 text-gray-400 transition-transform ${menuOpen ? "rotate-180" : ""}`} />
                    </button>
                    {menuOpen && (
                      <div
                        className="absolute left-0 right-0 top-full z-[1200] mt-2 max-h-48 overflow-y-auto rounded-xl border bg-white py-1 shadow-lg"
                        style={{ borderColor: "#dbe7ee" }}>
                        {opts.map((option) => (
                          <button
                            key={option.value}
                            type="button"
                            onClick={() => onMenuSelect(option.value)}
                            className={`flex w-full items-center px-3 py-2 text-left text-sm transition-colors hover:bg-sky-50 ${
                              value === option.value ? "text-sky-700 bg-sky-50" : "text-gray-700"
                            }`}>
                            {option.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ) : isDate ? (
                  <CustomDateInput
                    value={value}
                    placeholder="Seleccionar fecha"
                    onChange={onValueChange}
                  />
                ) : (
                  <input
                    autoFocus
                    value={value}
                    onChange={(e) => onValueChange(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") onApply();
                      if (e.key === "Escape") { onCancel(); e.stopPropagation(); }
                    }}
                    placeholder="Ingresá un valor"
                    className="min-w-0 flex-1 rounded-xl border px-3 py-2 text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-sky-200"
                    style={{ borderColor: "#dbe7ee" }}
                  />
                )}
                <button
                  type="button"
                  onClick={onApply}
                  className="shrink-0 rounded-xl px-3 py-2 text-xs font-semibold transition-colors"
                  style={{ background: "rgba(39,160,201,.10)", color: "#1e7a9c" }}>
                  Aplicar
                </button>
              </div>
            </div>,
            document.body,
          )}
      </>
    );
  },
);
