"use client";

import { FileSpreadsheet, X } from "lucide-react";
import type { ReactNode } from "react";

interface FullscreenOverlayProps {
  fileName: string;
  rowCount: number;
  onClose: () => void;
  children: ReactNode;
}

export function FullscreenOverlay({
  fileName,
  rowCount,
  onClose,
  children,
}: FullscreenOverlayProps) {
  return (
    <div
      className="fixed inset-0 z-50 overflow-hidden backdrop-blur-[1px]"
      style={{
        background:
          "linear-gradient(180deg, rgba(0,0,0,0.08) 0%, rgba(0,0,0,0.045) 14%, rgba(0,0,0,0.02) 32%, rgba(0,0,0,0.01) 100%)",
      }}>
      <div className="absolute inset-x-0 top-0 z-20 h-24">
        <div
          className="absolute inset-x-0 top-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(255,255,255,0.72) 0%, rgba(255,255,255,0.52) 35%, rgba(255,255,255,0.18) 68%, rgba(255,255,255,0) 100%)",
          }}>
          <div className="flex items-start justify-between gap-3 px-4 py-3 sm:pointer-events-auto sm:items-center sm:px-6 sm:py-4">
            <div className="flex min-w-0 flex-1 items-start gap-2 sm:items-center sm:gap-3">
              <FileSpreadsheet className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600 sm:mt-0" />
              <div className="min-w-0 flex-1">
                <div className="fc-sora truncate text-sm font-medium text-slate-900">
                  {fileName}
                </div>
                <div className="fc-sora mt-0.5 text-xs text-slate-600 sm:hidden">
                  {rowCount} filas
                </div>
              </div>
              <span className="hidden shrink-0 text-slate-300 sm:inline">|</span>
              <span className="fc-sora hidden shrink-0 text-sm text-slate-600 sm:inline">
                {rowCount} filas
              </span>
            </div>
            <button
              onClick={onClose}
              className="shrink-0 rounded-lg p-2 text-slate-500 transition-colors hover:bg-black/5 hover:text-slate-900 cursor-pointer">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="fc-scrollbar absolute inset-0 overflow-auto bg-white">
        <div className="min-h-full flex flex-col justify-center">
          {children}
        </div>
      </div>
    </div>
  );
}
