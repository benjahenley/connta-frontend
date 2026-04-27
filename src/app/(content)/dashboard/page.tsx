"use client";

import { useAuth } from "@/components/providers/AuthProvider";
import { PageHeader } from "@/components/ui/PageHeader";
import { paymentsApi } from "@/services/payments";
import { SubscriptionStatus } from "@/types/auth";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  FileKey2,
  LayoutDashboard,
  Settings,
  BarChart3,
  Users,
  ArrowRight,
  CheckCircle,
  Clock,
  Receipt,
  X,
} from "lucide-react";

const CHECK_NOW_INTERVAL_MS = 5000;
const CHECK_NOW_MAX_POLLS = 60;

export default function Dashboard() {
  const { user, refreshUser } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showActivatedToast, setShowActivatedToast] = useState(false);
  const pollStartedRef = useRef(false);

  useEffect(() => {
    if (searchParams.get("subscribed") !== "true") return;
    if (pollStartedRef.current) return;
    pollStartedRef.current = true;

    let polls = 0;
    let cancelled = false;

    const runPoll = async () => {
      polls += 1;
      const res = await paymentsApi.checkNow();
      if (cancelled) return;

      if (res?.subscriptionStatus === SubscriptionStatus.ACTIVE) {
        await refreshUser();
        if (cancelled) return;
        setShowActivatedToast(true);
        router.replace("/dashboard");
        return;
      }

      if (polls >= CHECK_NOW_MAX_POLLS) {
        router.replace("/dashboard");
        return;
      }

      window.setTimeout(runPoll, CHECK_NOW_INTERVAL_MS);
    };

    void runPoll();

    return () => {
      cancelled = true;
    };
  }, [searchParams, refreshUser, router]);

  const modules = [
    {
      id: "certificados",
      title: "Mis Certificados",
      description:
        "Configurá y gestioná tus certificados digitales de ARCA.",
      icon: FileKey2,
      href: "/mis-certificados",
      features: ["Producción", "Gestión automática", "Almacenamiento seguro"],
    },
    {
      id: "facturacion",
      title: "Facturación Electrónica",
      description:
        "Emitir comprobantes electrónicos de forma automática vía WSFEv1.",
      icon: Receipt,
      href: "/facturacion",
      features: ["Emisión automática", "Validación ARCA", "Reportes"],
    },
  ];

  const comingSoon = [
    { id: "stock", title: "Gestión de Stock", icon: BarChart3 },
    { id: "clientes", title: "Gestión de Clientes", icon: Users },
    { id: "configuracion", title: "Configuración", icon: Settings },
  ];

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return "Buenos días";
    if (h < 18) return "Buenas tardes";
    return "Buenas noches";
  };

  if (!user) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 sm:py-8 lg:px-8 animate-pulse">
        <div className="mb-8 sm:mb-10">
          <div className="h-4 w-24 bg-gray-200 rounded mb-2" />
          <div className="h-10 w-52 sm:h-12 sm:w-64 bg-gray-200 rounded" />
        </div>
        <div className="h-3 w-32 bg-gray-200 rounded mb-4" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 mb-8 sm:mb-10">
          {[0, 1].map((i) => (
            <div
              key={i}
              className="bg-white border border-gray-200 rounded-xl p-5 sm:p-6">
              <div className="w-10 h-10 bg-gray-200 rounded-xl mb-4" />
              <div className="h-6 w-40 bg-gray-200 rounded mb-2" />
              <div className="h-4 w-full bg-gray-100 rounded mb-4" />
              <div className="flex gap-2">
                <div className="h-6 w-20 bg-gray-100 rounded-lg" />
                <div className="h-6 w-20 bg-gray-100 rounded-lg" />
              </div>
            </div>
          ))}
        </div>
        <div className="h-3 w-28 bg-gray-200 rounded mb-4" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="bg-white border border-gray-100 rounded-xl p-5 opacity-50">
              <div className="w-9 h-9 bg-gray-200 rounded-lg mb-3" />
              <div className="h-5 w-32 bg-gray-200 rounded mb-2" />
              <div className="h-3 w-20 bg-gray-100 rounded" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <>
      {showActivatedToast && (
        <div
          role="status"
          className="fixed top-6 right-6 z-50 flex items-start gap-3 bg-white border border-emerald-200 shadow-lg rounded-xl p-4 pr-10 max-w-sm animate-in fade-in slide-in-from-top-2">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ background: "rgba(16,185,129,0.12)" }}>
            <CheckCircle size={18} style={{ color: "#10b981" }} />
          </div>
          <div className="pt-0.5">
            <p className="db-sora text-sm font-semibold text-gray-900">
              ¡Bienvenido a Connta!
            </p>
            <p className="db-sora text-xs text-gray-500 mt-0.5">
              Tu suscripción fue activada correctamente.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setShowActivatedToast(false)}
            aria-label="Cerrar"
            className="absolute top-2.5 right-2.5 text-gray-300 hover:text-gray-500 transition-colors">
            <X size={14} />
          </button>
        </div>
      )}
      <div className="db-sora max-w-7xl mx-auto px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        {/* ── Greeting ─────────────────────────────────────────── */}
        <PageHeader
          className="db-anim db-anim-1 mb-8 sm:mb-10"
          eyebrow={greeting()}
          icon={LayoutDashboard}
          title={user.name || "Usuario"}
          description="Accedé rápido a tus módulos principales y seguí el flujo de trabajo desde un solo lugar."
        />

        {/* ── Stats (verified customers) ───────────────────────── */}
        {user.isVerifiedCustomer && (
          <div className="db-anim db-anim-2 grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4 mb-8 sm:mb-10">
            {[
              { label: "Facturas este mes", value: "0" },
              { label: "Clientes activos", value: "0" },
              { label: "Facturado", value: "$0" },
              { label: "Productos", value: "0" },
            ].map((s, i) => (
              <div
                key={i}
                className="bg-white border border-gray-200 rounded-xl p-4 sm:p-5">
                <p className="db-condensed text-2xl sm:text-3xl font-black text-gray-900">
                  {s.value}
                </p>
                <p className="db-sora text-xs text-gray-500 mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        )}

        {/* ── Available modules ─────────────────────────────────── */}
        <p className="db-anim db-anim-2 db-sora text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">
          Módulos disponibles
        </p>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 mb-8 sm:mb-10">
          {modules.map((m, i) => {
            const Icon = m.icon;
            return (
              <div
                key={m.id}
                onClick={() => router.push(m.href)}
                className={`db-module-card db-anim db-anim-${i + 3} bg-white border border-gray-200 rounded-xl p-5 sm:p-6`}>
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{
                      background: "rgba(39,160,201,.1)",
                      color: "#27a0c9",
                    }}>
                    <Icon size={20} />
                  </div>
                  <ArrowRight
                    size={16}
                    className="db-arrow text-gray-300 transition-colors mt-1"
                  />
                </div>
                <h2 className="db-condensed text-xl sm:text-2xl font-bold text-gray-900 mb-1 leading-tight">
                  {m.title}
                </h2>
                <p className="db-sora text-sm text-gray-500 leading-relaxed mb-4">
                  {m.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {m.features.map((f, fi) => (
                    <span
                      key={fi}
                      className="db-sora text-xs font-medium px-2.5 py-1 rounded-lg"
                      style={{
                        background: "rgba(39,160,201,.08)",
                        color: "#1e7a9c",
                      }}>
                      {f}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* ── Coming soon ───────────────────────────────────────── */}
        <p className="db-anim db-anim-4 db-sora text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">
          Próximamente
        </p>
        <div className="db-anim db-anim-5 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {comingSoon.map((m) => {
            const Icon = m.icon;
            return (
              <div
                key={m.id}
                className="bg-white border border-gray-100 rounded-xl p-5 opacity-50">
                <div
                  className="w-9 h-9 rounded-lg flex items-center justify-center mb-3"
                  style={{
                    background: "rgba(100,116,139,.1)",
                    color: "#94a3b8",
                  }}>
                  <Icon size={17} />
                </div>
                <h3 className="db-condensed text-lg sm:text-xl font-bold text-gray-600 mb-2">
                  {m.title}
                </h3>
                <div className="flex items-center gap-1.5">
                  <Clock size={11} className="text-gray-400" />
                  <span className="db-sora text-xs text-gray-400">
                    Próximamente
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
