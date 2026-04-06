"use client";

import { useState, useRef, useEffect, useLayoutEffect } from "react";
import { createPortal } from "react-dom";

interface CellDropdownProps {
  options: readonly { value: string; label: string }[];
  value: string;
  onSelect: (v: string) => void;
  onCancel: () => void;
}

export function CellDropdown({ options, value, onSelect, onCancel }: CellDropdownProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const activeRef = useRef<HTMLButtonElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [search, setSearch] = useState("");
  const [dropPos, setDropPos] = useState<{
    top: number;
    left: number;
    minWidth: number;
  } | null>(null);

  const filtered = search
    ? options.filter((o) => o.label.toLowerCase().includes(search.toLowerCase()))
    : [...options];

  useLayoutEffect(() => {
    const input = inputRef.current;
    const menu = menuRef.current;
    if (!input || !menu) return;

    const updatePosition = () => {
      const rect = input.getBoundingClientRect();
      const menuRect = menu.getBoundingClientRect();
      const padding = 8;
      let left = rect.left;

      if (left + menuRect.width > window.innerWidth - padding) {
        left = Math.max(padding, window.innerWidth - menuRect.width - padding);
      }

      setDropPos({
        top: rect.bottom + 4,
        left,
        minWidth: Math.max(rect.width, 180),
      });
    };

    updatePosition();
    window.addEventListener("scroll", updatePosition, true);
    window.addEventListener("resize", updatePosition);
    return () => {
      window.removeEventListener("scroll", updatePosition, true);
      window.removeEventListener("resize", updatePosition);
    };
  }, [search, options, value]);

  useEffect(() => {
    activeRef.current?.scrollIntoView({ block: "nearest" });
  }, [value]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        containerRef.current &&
        !containerRef.current.contains(target) &&
        menuRef.current &&
        !menuRef.current.contains(target)
      ) {
        onCancel();
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [onCancel]);

  return (
    <div ref={containerRef} className="relative">
      <input
        ref={inputRef}
        autoFocus
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Escape") { onCancel(); e.stopPropagation(); }
          if (e.key === "Enter" && filtered.length === 1) onSelect(filtered[0].value);
        }}
        placeholder="Buscar..."
        className="h-8 w-full rounded-lg border px-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sky-300"
        style={{ borderColor: "#27a0c9" }}
      />
      {typeof document !== "undefined" &&
        createPortal(
          <div
            ref={menuRef}
            className="fc-sora fc-scrollbar fixed z-[9999] max-h-48 overflow-y-auto rounded-xl border bg-white shadow-lg"
            style={{
              top: dropPos?.top ?? -9999,
              left: dropPos?.left ?? -9999,
              minWidth: dropPos?.minWidth ?? 180,
              visibility: dropPos ? "visible" : "hidden",
              borderColor: "#dbe7ee",
            }}>
            {filtered.length === 0 && (
              <div className="px-3 py-2 text-xs text-gray-400">Sin resultados</div>
            )}
            {filtered.map((o) => {
              const isActive = o.value === value;
              return (
                <button
                  key={o.value}
                  ref={isActive ? activeRef : undefined}
                  type="button"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    onSelect(o.value);
                  }}
                  className={`flex w-full items-center px-3 py-1.5 text-left text-sm transition-colors hover:bg-sky-50 ${
                    isActive ? "text-sky-700 bg-sky-50 font-medium" : "text-gray-700"
                  }`}>
                  {o.label}
                </button>
              );
            })}
          </div>,
          document.body,
        )}
    </div>
  );
}
