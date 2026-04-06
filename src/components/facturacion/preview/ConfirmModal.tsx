"use client";

import { Loader2 } from "lucide-react";
import type { ReactNode } from "react";

interface ConfirmModalProps {
  icon: ReactNode;
  iconBg: string;
  title: string;
  description: ReactNode;
  confirmLabel: string;
  confirmingLabel: string;
  confirmIcon: ReactNode;
  confirmStyle?: string;
  confirmBg?: string;
  isLoading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  cancelLabel?: string;
}

export function ConfirmModal({
  icon,
  iconBg,
  title,
  description,
  confirmLabel,
  confirmingLabel,
  confirmIcon,
  confirmStyle = "text-white bg-red-500 hover:bg-red-600",
  confirmBg,
  isLoading = false,
  onConfirm,
  onCancel,
  cancelLabel = "Cancelar",
}: ConfirmModalProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{
        background: "rgba(15,23,42,.6)",
        backdropFilter: "blur(4px)",
      }}>
      <div
        className="bg-white rounded-2xl w-full max-w-md mx-4 overflow-hidden"
        style={{ boxShadow: "0 25px 60px rgba(0,0,0,.2)" }}>
        <div className="px-6 pt-6 pb-4">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
            style={{ background: iconBg }}>
            {icon}
          </div>
          <h3 className="fc-condensed text-2xl font-bold text-gray-900 mb-1">
            {title}
          </h3>
          <p className="fc-sora text-sm text-gray-500 leading-relaxed">
            {description}
          </p>
        </div>
        <div className="px-6 pb-6 pt-2 flex items-center justify-end gap-2.5">
          <button
            onClick={onCancel}
            className="fc-sora px-4 py-2.5 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer">
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className={`fc-sora inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors cursor-pointer disabled:opacity-50 ${confirmStyle}`}
            style={confirmBg ? { background: confirmBg } : undefined}>
            {isLoading ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              confirmIcon
            )}
            {isLoading ? confirmingLabel : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
