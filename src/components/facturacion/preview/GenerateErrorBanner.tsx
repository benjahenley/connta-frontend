"use client";

import { XCircle, X } from "lucide-react";
import { renderErrorText } from "@/app/(content)/facturacion/preview/renderErrorText";

interface GenerateErrorBannerProps {
  error: string;
  onDismiss: () => void;
}

export function GenerateErrorBanner({
  error,
  onDismiss,
}: GenerateErrorBannerProps) {
  return (
    <div
      className="mt-5 flex items-start gap-3 px-5 py-4 rounded-xl"
      style={{
        background: "rgba(239,68,68,.08)",
        border: "1px solid rgba(239,68,68,.2)",
      }}>
      <XCircle className="w-5 h-5 flex-shrink-0 text-red-500 mt-0.5" />
      <p className="fc-sora text-sm text-red-600 break-words">
        {renderErrorText(error)}
      </p>
      <button
        onClick={onDismiss}
        className="ml-auto flex-shrink-0 p-1 text-red-400 hover:text-red-600 rounded-lg transition-colors cursor-pointer">
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
