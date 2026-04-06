"use client";

import Link from "next/link";
import { Clock, ArrowRight } from "lucide-react";

export default function Page() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-10 max-w-md w-full text-center">
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
          style={{ background: "rgba(245,158,11,0.08)" }}>
          <Clock size={40} style={{ color: "#f59e0b" }} />
        </div>
        <h1 className="text-2xl font-extrabold text-gray-900 mb-2">
          Pago pendiente
        </h1>
        <p className="text-gray-500 text-sm mb-2">
          Tu pago está siendo procesado. Esto puede demorar unos minutos dependiendo
          del medio de pago elegido.
        </p>
        <p className="text-gray-400 text-xs mb-8">
          Cuando se confirme, tu plan se actualizará automáticamente y te
          notificaremos por email.
        </p>
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold text-white"
          style={{ background: "#27a0c9", boxShadow: "0 4px 14px rgba(39,160,201,0.25)" }}>
          Ir al dashboard
          <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  );
}
