"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Calendar, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";

interface CustomDateInputProps {
  value: string;
  placeholder?: string;
  onChange: (value: string) => void;
}

const WEEK_DAYS = ["Lu", "Ma", "Mi", "Ju", "Vi", "Sa", "Do"];

function parseAfipDate(value: string): Date | null {
  const digits = value.replace(/\D/g, "");
  if (!/^\d{8}$/.test(digits)) return null;
  const year = Number(digits.slice(0, 4));
  const month = Number(digits.slice(4, 6)) - 1;
  const day = Number(digits.slice(6, 8));
  const date = new Date(year, month, day);
  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month ||
    date.getDate() !== day
  ) {
    return null;
  }
  return date;
}

function toAfipDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}${month}${day}`;
}

function sameDay(a: Date | null, b: Date | null): boolean {
  if (!a || !b) return false;
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function formatDisplayDate(value: string): string {
  const date = parseAfipDate(value);
  if (!date) return "";
  return new Intl.DateTimeFormat("es-AR").format(date);
}

function startOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function buildCalendarDays(month: Date): Date[] {
  const firstDay = startOfMonth(month);
  const startOffset = (firstDay.getDay() + 6) % 7;
  const startDate = new Date(firstDay);
  startDate.setDate(firstDay.getDate() - startOffset);

  return Array.from({ length: 42 }, (_, index) => {
    const next = new Date(startDate);
    next.setDate(startDate.getDate() + index);
    return next;
  });
}

export function CustomDateInput({
  value,
  placeholder = "Seleccionar fecha",
  onChange,
}: CustomDateInputProps) {
  const selectedDate = useMemo(() => parseAfipDate(value), [value]);
  const [open, setOpen] = useState(false);
  const [visibleMonth, setVisibleMonth] = useState<Date>(
    selectedDate ? startOfMonth(selectedDate) : startOfMonth(new Date()),
  );
  const rootRef = useRef<HTMLDivElement | null>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const popupRef = useRef<HTMLDivElement | null>(null);
  const [position, setPosition] = useState<{
    top: number;
    left: number;
  } | null>(null);

  useEffect(() => {
    if (!open) return;

    const handlePointerDown = (event: MouseEvent | TouchEvent) => {
      const target = event.target as Node | null;
      const clickedTrigger = rootRef.current && target
        ? rootRef.current.contains(target)
        : false;
      const clickedPopup = popupRef.current && target
        ? popupRef.current.contains(target)
        : false;

      if (!clickedTrigger && !clickedPopup) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("touchstart", handlePointerDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("touchstart", handlePointerDown);
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;

    const updatePosition = () => {
      const trigger = triggerRef.current;
      const popup = popupRef.current;
      if (!trigger || !popup) return;

      const rect = trigger.getBoundingClientRect();
      const popupRect = popup.getBoundingClientRect();
      const padding = 8;

      let left = rect.left;
      let top = rect.bottom + 8;

      if (left + popupRect.width > window.innerWidth - padding) {
        left = Math.max(padding, window.innerWidth - popupRect.width - padding);
      }

      if (top + popupRect.height > window.innerHeight - padding) {
        top = Math.max(padding, rect.top - popupRect.height - 8);
      }

      setPosition({ top, left });
    };

    updatePosition();
    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, true);
    return () => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
    };
  }, [open, visibleMonth]);

  useEffect(() => {
    if (selectedDate) {
      setVisibleMonth(startOfMonth(selectedDate));
    }
  }, [selectedDate]);

  const days = useMemo(() => buildCalendarDays(visibleMonth), [visibleMonth]);
  const monthLabel = new Intl.DateTimeFormat("es-AR", {
    month: "long",
    year: "numeric",
  }).format(visibleMonth);
  const today = new Date();

  return (
    <div ref={rootRef} className="relative">
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex h-11 w-full items-center justify-between rounded-xl border border-gray-200 bg-white px-3 text-sm text-gray-900 outline-none transition hover:border-gray-300 focus:border-[#27a0c9] focus:ring-2 focus:ring-sky-200">
        <span className={value ? "text-gray-900" : "text-gray-300"}>
          {formatDisplayDate(value) || placeholder}
        </span>
        <span className="flex items-center gap-1 text-gray-400">
          <Calendar className="h-4 w-4" />
          <ChevronDown
            className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`}
          />
        </span>
      </button>

      {open &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            ref={popupRef}
            data-calendar-popup="true"
            className="fixed z-[1200] w-[280px] rounded-2xl border border-gray-200 bg-white p-3 shadow-[0_18px_40px_rgba(15,23,42,0.12)]"
            style={{
              top: position?.top ?? -9999,
              left: position?.left ?? -9999,
              visibility: position ? "visible" : "hidden",
            }}>
            <div className="mb-3 flex items-center justify-between">
              <button
                type="button"
                onClick={() =>
                  setVisibleMonth(
                    new Date(
                      visibleMonth.getFullYear(),
                      visibleMonth.getMonth() - 1,
                      1,
                    ),
                  )
                }
                className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700">
                <ChevronLeft className="h-4 w-4" />
              </button>
              <span className="text-sm font-medium capitalize text-gray-900">
                {monthLabel}
              </span>
              <button
                type="button"
                onClick={() =>
                  setVisibleMonth(
                    new Date(
                      visibleMonth.getFullYear(),
                      visibleMonth.getMonth() + 1,
                      1,
                    ),
                  )
                }
                className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700">
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>

            <div className="mb-2 grid grid-cols-7 gap-1">
              {WEEK_DAYS.map((day) => (
                <div
                  key={day}
                  className="flex h-8 items-center justify-center text-[11px] font-semibold uppercase tracking-wide text-gray-400">
                  {day}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-1">
              {days.map((day) => {
                const inMonth = day.getMonth() === visibleMonth.getMonth();
                const isSelected = sameDay(day, selectedDate);
                const isToday = sameDay(day, today);

                return (
                  <button
                    key={`${day.getFullYear()}-${day.getMonth()}-${day.getDate()}`}
                    type="button"
                    onClick={() => {
                      onChange(toAfipDate(day));
                      setOpen(false);
                    }}
                    className={`flex h-8 w-8 items-center justify-center rounded-lg text-sm transition-colors ${
                      isSelected
                        ? "bg-[#27a0c9] text-white"
                        : inMonth
                          ? "text-gray-700 hover:bg-sky-50"
                          : "text-gray-300 hover:bg-gray-50"
                    } ${isToday && !isSelected ? "ring-1 ring-[#27a0c9]/35" : ""}`}>
                    {day.getDate()}
                  </button>
                );
              })}
            </div>

            <div className="mt-3 flex items-center justify-between border-t border-gray-100 pt-3">
              <button
                type="button"
                onClick={() => {
                  onChange("");
                  setOpen(false);
                }}
                className="text-xs font-medium text-gray-400 transition-colors hover:text-gray-600">
                Limpiar
              </button>
              <button
                type="button"
                onClick={() => {
                  const next = new Date();
                  onChange(toAfipDate(next));
                  setOpen(false);
                }}
                className="text-xs font-medium text-[#27a0c9] transition-colors hover:text-[#1e7a9c]">
                Hoy
              </button>
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
}
