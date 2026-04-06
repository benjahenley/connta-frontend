"use client";

import { CheckCircle2, XCircle } from "lucide-react";
import { renderErrorText } from "@/app/(content)/facturacion/preview/renderErrorText";

interface GenerateResult {
  caeGenerados: number;
  errores: number;
  failedInvoiceError: string | null;
}

interface ResultBannerProps {
  result: GenerateResult;
  onBack: () => void;
}

export function ResultBanner({ result, onBack }: ResultBannerProps) {
  if (result.errores === 0) {
    return (
      <div
        className="flex items-center gap-3 px-5 py-4 rounded-xl mt-5"
        style={{
          background: "rgba(16,185,129,.08)",
          border: "1px solid rgba(16,185,129,.2)",
        }}>
        <CheckCircle2
          className="w-5 h-5 flex-shrink-0"
          style={{ color: "#10b981" }}
        />
        <span
          className="fc-sora text-sm font-semibold"
          style={{ color: "#10b981" }}>
          {result.caeGenerados} CAEs generados exitosamente
        </span>
        <button
          onClick={onBack}
          className="ml-auto text-sm font-medium px-3 py-1.5 rounded-lg cursor-pointer"
          style={{ background: "rgba(39,160,201,.1)", color: "#1e7a9c" }}>
          Volver al historial
        </button>
      </div>
    );
  }

  return (
    <div
      className="px-5 py-4 rounded-xl space-y-2 mt-5"
      style={{
        background: "rgba(239,68,68,.06)",
        border: "1px solid rgba(239,68,68,.18)",
      }}>
      <div className="flex items-start gap-3">
        <XCircle className="w-5 h-5 flex-shrink-0 text-red-500 mt-0.5" />
        <div className="fc-sora text-sm flex-1">
          <p className="font-semibold text-red-600">
            La generación se detuvo por un error en la factura #
            {result.caeGenerados + 1}
          </p>
          {result.failedInvoiceError && (
            <p className="text-red-500 mt-1 break-words">
              {renderErrorText(result.failedInvoiceError)}
            </p>
          )}
          <p className="text-gray-500 mt-2">
            {result.caeGenerados > 0 && (
              <span className="font-medium" style={{ color: "#10b981" }}>
                {result.caeGenerados} CAEs generados antes del error.{" "}
              </span>
            )}
            Las facturas restantes no fueron procesadas para preservar la
            numeración secuencial.
          </p>
        </div>
      </div>
      <div className="flex justify-end">
        <button
          onClick={onBack}
          className="text-sm font-medium px-3 py-1.5 rounded-lg cursor-pointer"
          style={{ background: "rgba(39,160,201,.1)", color: "#1e7a9c" }}>
          Volver al historial
        </button>
      </div>
    </div>
  );
}
