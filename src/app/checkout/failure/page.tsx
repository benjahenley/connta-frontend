"use client";

import Link from "next/link";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { XCircle, RotateCcw } from "lucide-react";

function FailureContent() {
  const params = useSearchParams();
  const externalRef = params.get("external_reference") ?? "";
  const tierStr = externalRef.split(":")[1];

  const retryHref = tierStr ? `/checkout?plan=${tierStr}` : "/dashboard";

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-10 max-w-md w-full text-center">
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
          style={{ background: "rgba(239,68,68,0.08)" }}>
          <XCircle size={40} style={{ color: "#ef4444" }} />
        </div>
        <h1 className="text-2xl font-extrabold text-gray-900 mb-2">
          Pago no completado
        </h1>
        <p className="text-gray-500 text-sm mb-8">
          El pago no pudo procesarse. Tu plan no fue modificado. Podés intentarlo de
          nuevo o usar otro medio de pago.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href={retryHref}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-bold text-white"
            style={{ background: "#27a0c9", boxShadow: "0 4px 14px rgba(39,160,201,0.25)" }}>
            <RotateCcw size={14} />
            Intentar de nuevo
          </Link>
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-gray-600 border border-gray-200 hover:bg-gray-50 transition-colors">
            Volver al dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <Suspense>
      <FailureContent />
    </Suspense>
  );
}
