"use client";

import { Loader2, RefreshCw } from "lucide-react";

interface ProgressBannerProps {
  processedCount: number;
  totalCount: number;
  onCheckStatus: () => void;
  isChecking: boolean;
}

export function ProgressBanner({
  processedCount,
  totalCount,
  onCheckStatus,
  isChecking,
}: ProgressBannerProps) {
  const pct = totalCount > 0 ? (processedCount / totalCount) * 100 : 0;

  return (
    <div
      className="mt-5 px-5 py-4 rounded-xl"
      style={{
        background: "rgba(39,160,201,.06)",
        border: "1px solid rgba(39,160,201,.15)",
      }}>
      <div className="flex items-center justify-between gap-3 mb-3">
        <div className="flex items-center gap-3">
          <Loader2
            className="w-5 h-5 flex-shrink-0 animate-spin"
            style={{ color: "#27a0c9" }}
          />
          <span
            className="fc-sora text-sm font-semibold"
            style={{ color: "#1e7a9c" }}>
            Generando CAEs... {processedCount}/{totalCount}
          </span>
        </div>
        <button
          type="button"
          onClick={onCheckStatus}
          disabled={isChecking}
          className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors disabled:opacity-50"
          style={{ color: "#1e7a9c", background: "rgba(39,160,201,.12)" }}>
          <RefreshCw className={`w-3.5 h-3.5 ${isChecking ? "animate-spin" : ""}`} />
          Verificar estado
        </button>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${pct}%`, background: "#27a0c9" }}
        />
      </div>
      <p className="fc-sora text-xs text-gray-400 mt-2">
        Podés navegar a otra página — el proceso continúa en segundo plano.
      </p>
    </div>
  );
}
