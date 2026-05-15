"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

export interface GuideTOCSection {
  id: string;
  label: string;
}

interface GuideTOCProps {
  sections: GuideTOCSection[];
  activeSection: string;
  onSectionClick?: (id: string) => void;
  className?: string;
}

const SORA_FAMILY = "var(--font-sora), ui-sans-serif, system-ui, sans-serif";
const CONDENSED_FAMILY =
  "var(--font-condensed), ui-sans-serif, system-ui, sans-serif";
const ACCENT = "#27a0c9";

export function GuideTOC({
  sections,
  activeSection,
  onSectionClick,
  className = "",
}: GuideTOCProps) {
  return (
    <aside className={`hidden xl:block py-10 ${className}`}>
      <div
        className="sticky top-28 rounded-2xl border bg-white/92 px-5 py-5 backdrop-blur"
        style={{
          borderColor: "#e5edf3",
          boxShadow:
            "0 1px 2px rgba(15,23,42,0.04), 0 8px 24px -12px rgba(15,23,42,0.08)",
        }}>
        <div className="flex items-baseline justify-between mb-4">
          <p
            className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-400"
            style={{ fontFamily: SORA_FAMILY }}>
            En esta guía
          </p>
          <span
            className="text-[10px] font-semibold tracking-wider text-gray-300 tabular-nums"
            style={{ fontFamily: SORA_FAMILY }}>
            {sections.length} {sections.length === 1 ? "PASO" : "PASOS"}
          </span>
        </div>

        <nav className="space-y-0.5">
          {sections.map((section, index) => {
            const isActive = section.id === activeSection;
            return (
              <a
                key={section.id}
                href={`#${section.id}`}
                onClick={() => onSectionClick?.(section.id)}
                className="group relative flex items-start gap-3 rounded-xl pl-4 pr-3 py-2.5 transition-colors"
                style={{
                  background: isActive
                    ? "rgba(39,160,201,.08)"
                    : "transparent",
                }}>
                {/* Active accent bar (left) */}
                <span
                  aria-hidden
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] rounded-r-full transition-opacity"
                  style={{
                    height: "1.25rem",
                    background: ACCENT,
                    opacity: isActive ? 1 : 0,
                  }}
                />
                <span
                  className="text-lg leading-none tabular-nums transition-colors mt-0.5"
                  style={{
                    fontFamily: CONDENSED_FAMILY,
                    color: isActive ? ACCENT : "#cbd5e1",
                  }}>
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span
                  className="text-sm leading-snug transition-colors"
                  style={{
                    fontFamily: SORA_FAMILY,
                    color: isActive ? "#0f172a" : "#64748b",
                  }}>
                  {section.label}
                </span>
              </a>
            );
          })}
        </nav>

        <div
          className="mt-6 pt-5"
          style={{ borderTop: "1px solid #f1f5f9" }}>
          <p
            className="text-xs text-gray-400 mb-2.5"
            style={{ fontFamily: SORA_FAMILY }}>
            ¿Necesitás más ayuda?
          </p>
          <Link
            href="/mis-certificados/guia"
            className="inline-flex items-center gap-1.5 text-xs font-semibold transition-all hover:gap-2.5"
            style={{ fontFamily: SORA_FAMILY, color: ACCENT }}>
            Ver todas las guías
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      </div>
    </aside>
  );
}
