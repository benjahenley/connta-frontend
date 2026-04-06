"use client";

import { RequirePermission } from "@/components/providers/AuthProvider";
import { PageHeader } from "@/components/ui/PageHeader";
import { useRouter } from "next/navigation";
import {
  Users,
  Settings,
  BarChart3,
  ScrollText,
  Wrench,
  ShieldCheck,
  ArrowRight,
  TrendingUp,
  UserCheck,
  AlertTriangle,
} from "lucide-react";

/* ── Placeholder stats — replace with real API calls ─────────── */
const stats = [
  { label: "Usuarios totales", value: "2", icon: Users, delta: null },
  { label: "Activos (30d)", value: "2", icon: UserCheck, delta: "+2" },
  { label: "Facturas emitidas", value: "0", icon: TrendingUp, delta: null },
  { label: "Errores (7d)", value: "0", icon: AlertTriangle, delta: null },
];

const adminModules = [
  {
    id: "usuarios",
    title: "Gestionar Usuarios",
    description: "Cuentas, permisos, planes y estados de suscripcion.",
    icon: Users,
    href: "/admin/usuarios",
  },
  {
    id: "config",
    title: "Configuracion del Sistema",
    description: "Parametros globales, limites de uso y feature flags.",
    icon: Settings,
    href: "#",
  },
  {
    id: "analytics",
    title: "Reportes & Analytics",
    description: "Metricas de uso, ingresos y tendencias de facturacion.",
    icon: BarChart3,
    href: "#",
  },
  {
    id: "arca",
    title: "ARCA / AFIP",
    description:
      "Configuracion global de integracion, certificados raiz y WSDL.",
    icon: ShieldCheck,
    href: "#",
  },
  {
    id: "logs",
    title: "Logs del Sistema",
    description: "Actividad, errores, auditorias y eventos de seguridad.",
    icon: ScrollText,
    href: "#",
  },
  {
    id: "mantenimiento",
    title: "Mantenimiento",
    description: "Backups, migraciones, caches e integridad de datos.",
    icon: Wrench,
    href: "#",
  },
];

export default function AdminPage() {
  const router = useRouter();

  return (
    <RequirePermission requireAdmin>
      <div className="db-sora max-w-7xl mx-auto px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        {/* ── Header ───────────────────────────────────────────── */}
        <PageHeader
          className="db-anim db-anim-1 mb-8 sm:mb-10"
          eyebrow="Panel de administración"
          icon={ShieldCheck}
          title="Administración"
          description="Vista general del sistema. Gestión de usuarios, configuración y monitoreo."
        />

        {/* ── Stats row ────────────────────────────────────────── */}
        <div className="db-anim db-anim-2 grid grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4 mb-8 sm:mb-10">
          {stats.map((s, i) => {
            const Icon = s.icon;
            return (
              <div
                key={i}
                className="bg-white border border-gray-200 rounded-xl p-4 sm:p-5 flex flex-col justify-between">
                <div className="flex items-center justify-between mb-3">
                  <div
                    className="w-9 h-9 rounded-lg flex items-center justify-center"
                    style={{
                      background: "rgba(39,160,201,.08)",
                      color: "#27a0c9",
                    }}>
                    <Icon size={16} />
                  </div>
                  {s.delta && (
                    <span
                      className="text-xs font-semibold px-2 py-0.5 rounded-md"
                      style={{
                        background: "rgba(16,185,129,.1)",
                        color: "#10b981",
                      }}>
                      {s.delta}
                    </span>
                  )}
                </div>
                <p className="db-condensed text-2xl sm:text-3xl font-black text-gray-900">
                  {s.value}
                </p>
                <p className="text-xs text-gray-500 mt-1">{s.label}</p>
              </div>
            );
          })}
        </div>

        {/* ── Module grid ──────────────────────────────────────── */}
        <p className="db-anim db-anim-3 text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">
          Modulos de administracion
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mb-8">
          {adminModules.map((m, i) => {
            const Icon = m.icon;
            return (
              <button
                key={m.id}
                onClick={() => m.href !== "#" && router.push(m.href)}
                className={`db-module-card db-anim db-anim-${Math.min(i + 3, 5)} text-left bg-white border border-gray-200 rounded-xl p-5 sm:p-6 group ${m.href === "#" ? "opacity-50 cursor-not-allowed" : ""}`}>
                <div className="flex items-start justify-between gap-4 mb-4">
                  <Icon
                    size={22}
                    className="text-gray-400 group-hover:text-[#27a0c9] transition-colors flex-shrink-0"
                  />
                  <ArrowRight
                    size={16}
                    className="db-arrow text-gray-300 transition-colors mt-1"
                  />
                </div>
                <h2 className="db-condensed text-xl sm:text-2xl font-bold text-gray-900 mb-1 leading-tight">
                  {m.title}
                </h2>
                <p className="text-sm text-gray-500 leading-relaxed">
                  {m.description}
                </p>
              </button>
            );
          })}
        </div>
      </div>
    </RequirePermission>
  );
}
