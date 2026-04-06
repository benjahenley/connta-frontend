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
      <div className="group absolute inset-x-0 top-0 z-20 h-24">
        <div
          className="absolute inset-x-0 top-0 transition-transform duration-200 sm:pointer-events-none sm:-translate-y-full sm:group-hover:translate-y-0 sm:group-focus-within:translate-y-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(255,255,255,0.72) 0%, rgba(255,255,255,0.52) 35%, rgba(255,255,255,0.18) 68%, rgba(255,255,255,0) 100%)",
          }}>
          <div className="flex items-center justify-between px-6 py-4 sm:pointer-events-auto">
            <div className="flex items-center gap-3">
              <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
              <span className="fc-sora text-sm font-medium text-slate-900">
                {fileName}
              </span>
              <span className="text-slate-400">|</span>
              <span className="fc-sora text-sm text-slate-600">
                {rowCount} filas
              </span>
            </div>
            <button
              onClick={onClose}
              className="rounded-lg p-2 text-slate-500 transition-colors hover:bg-black/5 hover:text-slate-900 cursor-pointer">
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
