"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { afipApi, type CertData } from "@/services/afip";
import { useAuth } from "@/components/providers/AuthProvider";
import { useUpgrade } from "@/components/providers/UpgradeProvider";
import { useCertificates } from "@/hooks/useAfipData";
import { MisCertificadosSkeleton } from "@/components/mis-certificados/MisCertificadosSkeleton";
import { CertAuthorizationsModal } from "@/components/mis-certificados/CertAuthorizationsModal";
import { PageHeader } from "@/components/ui/PageHeader";
import { SUBSCRIPTION_TIERS, SubscriptionTier } from "@/types/auth";
import {
  Plus,
  BookOpen,
  Shield,
  KeyRound,
  RefreshCw,
  MoreVertical,
  Trash2,
  Lock,
  Sparkles,
  ShieldCheck,
} from "lucide-react";

/* ── Status / Env config ──────────────────────────────────────── */
const STATUS = {
  ACTIVE: { label: "Activo", dot: "#27a0c9" },
  EXPIRED: { label: "Vencido", dot: "#94a3b8" },
  PENDING_CERT: { label: "Pendiente", dot: "#f59e0b" },
} as const;

const ENV = {
  DEV: { label: "Testing" },
  PROD: { label: "Producción" },
} as const;

/* ── Styles ───────────────────────────────────────────────────── */
const STYLES = `
  .mc-condensed { font-family: var(--font-condensed), ui-sans-serif, system-ui, sans-serif; }
  .mc-sora      { font-family: var(--font-sora), ui-sans-serif, system-ui, sans-serif; }

  @keyframes mcFadeUp {
    from { opacity: 0; transform: translateY(10px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .mc-anim   { opacity: 0; animation: mcFadeUp .45s ease forwards; }
  .mc-a1 { animation-delay: .04s; }
  .mc-a2 { animation-delay: .10s; }
  .mc-a3 { animation-delay: .16s; }
  .mc-a4 { animation-delay: .22s; }

  .mc-card {
    transition: box-shadow .2s ease, transform .2s ease, border-color .2s ease;
  }
  .mc-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 28px rgba(39,160,201,.10), 0 2px 6px rgba(0,0,0,.04);
    border-color: #27a0c9 !important;
  }
  .mc-card:hover .mc-detail-arrow { color: #27a0c9; }

  .mc-btn-primary {
    cursor: pointer;
    transition: background .15s ease, box-shadow .15s ease;
  }
  .mc-btn-primary:hover {
    background: #1e8db5 !important;
    box-shadow: 0 4px 16px rgba(39,160,201,.25);
  }
`;

/* ── Page ─────────────────────────────────────────────────────── */
export default function MisCertificados() {
  const router = useRouter();
  const { user } = useAuth();
  const { openUpgradeModal } = useUpgrade();
  const { certs, certsLoading: loading, mutateCerts } = useCertificates();
  const [deleting, setDeleting] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<CertData | null>(null);
  const [authModal, setAuthModal] = useState<CertData | null>(null);

  const tier = user?.subscriptionTier || SubscriptionTier.FREE;
  const tierConfig = SUBSCRIPTION_TIERS[tier];
  const maxCerts = tierConfig.maxCertificates;
  const canAddMore = maxCerts === null || certs.length < maxCerts;

  const handleDelete = (cert: CertData) => {
    setConfirmDelete(cert);
  };

  const confirmDeleteCert = async () => {
    if (!confirmDelete) return;
    const removedId = confirmDelete.id;
    setConfirmDelete(null);
    mutateCerts(
      (prev) => (prev ?? []).filter((c) => c.id !== removedId),
      false,
    );
    try {
      await afipApi.deleteCert(removedId);
    } catch {
      mutateCerts();
    } finally {
      setDeleting(null);
    }
  };

  const active = certs.filter((c) => c.status === "ACTIVE").length;
  const expired = certs.filter((c) => c.status === "EXPIRED").length;
  const pending = certs.filter((c) => c.status === "PENDING_CERT").length;

  return (
    <>
      <style>{STYLES}</style>

      <div className="mc-sora w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* ── Header ─────────────────────────────────────── */}
        <PageHeader
          className="mc-anim mc-a1 mb-8"
          eyebrow="Certificados ARCA"
          icon={Shield}
          title="Mis Certificados"
          description="Gestioná los certificados de cada CUIT y accedé rápido a la configuración o a las guías."
          actions={
            <>
              <Link
                href="/mis-certificados/guia"
                className="mc-sora inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-600 transition-colors hover:border-gray-300 hover:text-gray-900">
                <BookOpen className="h-4 w-4" />
                Guía
              </Link>

              {canAddMore ? (
                <button
                  onClick={() => router.push("/mis-certificados/configurar")}
                  className="mc-btn-primary mc-sora inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold text-white"
                  style={{ background: "#27a0c9" }}>
                  <Plus className="h-4 w-4" />
                  Nuevo certificado
                </button>
              ) : (
                <button
                  onClick={() => openUpgradeModal()}
                  className="mc-sora inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold text-white"
                  style={{
                    background: "linear-gradient(135deg, #f59e0b, #f97316)",
                  }}>
                  <Sparkles className="h-4 w-4" />
                  Upgrade para más CUITs
                </button>
              )}
            </>
          }
        />

        {/* ── Stats row ──────────────────────────────────── */}
        {certs.length > 0 && (
          <>
            <div className="mc-anim mc-a2 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-4">
              <StatCard count={certs.length} label="Total" />
              <StatCard count={active} label="Activos" accent />
              <StatCard count={expired} label="Vencidos" />
              <StatCard count={pending} label="Pendientes" />
            </div>
            {!canAddMore && (
              <div className="mc-anim mc-a2 flex items-center gap-2 mb-8 px-4 py-3 rounded-xl border border-amber-200 bg-amber-50">
                <Lock className="h-4 w-4 text-amber-500 flex-shrink-0" />
                <p className="mc-sora text-sm text-amber-700">
                  Alcanzaste el límite de {maxCerts} certificado
                  {maxCerts === 1 ? "" : "s"} en tu plan{" "}
                  <strong>{tierConfig.name}</strong>.{" "}
                  <button
                    onClick={() => openUpgradeModal()}
                    className="underline font-semibold hover:text-amber-900">
                    Actualizá tu plan
                  </button>{" "}
                  para gestionar más CUITs.
                </p>
              </div>
            )}
            {canAddMore && maxCerts !== null && (
              <p className="mc-anim mc-a2 mc-sora text-xs text-gray-400 mb-8">
                {certs.length} de {maxCerts} certificado
                {maxCerts === 1 ? "" : "s"} usados · Plan {tierConfig.name}
              </p>
            )}
          </>
        )}

        {/* ── Content ────────────────────────────────────── */}
        {loading ? (
          <MisCertificadosSkeleton />
        ) : certs.length === 0 ? (
          <EmptyState
            onConfigure={() => router.push("/mis-certificados/configurar")}
          />
        ) : (
          <div className="mc-anim mc-a3 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {certs.map((cert, i) => (
              <CertCard
                key={cert.id}
                cert={cert}
                animDelay={i * 0.06}
                onDelete={() => handleDelete(cert)}
                onCheckAuthorizations={() => setAuthModal(cert)}
              />
            ))}
          </div>
        )}
        {/* ── Authorizations modal ───────────────────── */}
        {authModal && (
          <CertAuthorizationsModal
            cert={authModal}
            onClose={() => setAuthModal(null)}
          />
        )}

        {/* ── Delete confirmation modal ───────────────── */}
        {confirmDelete && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: "rgba(0,0,0,.4)" }}
            onClick={() => !deleting && setConfirmDelete(null)}>
            <div
              className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl"
              onClick={(e) => e.stopPropagation()}>
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4"
                style={{ background: "rgba(239,68,68,.1)" }}>
                <Trash2 className="w-5 h-5 text-red-500" />
              </div>
              <h3 className="mc-condensed text-xl font-bold text-gray-900 text-center mb-1">
                Eliminar certificado
              </h3>
              <p className="mc-sora text-sm text-gray-500 text-center mb-6">
                ¿Estás seguro de que querés eliminar{" "}
                <strong className="text-gray-700">
                  {confirmDelete.certName}
                </strong>
                ? Esta acción no se puede deshacer.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setConfirmDelete(null)}
                  disabled={!!deleting}
                  className="mc-sora flex-1 px-4 py-2.5 rounded-xl text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors cursor-pointer disabled:opacity-50">
                  Cancelar
                </button>
                <button
                  onClick={confirmDeleteCert}
                  disabled={!!deleting}
                  className="mc-sora flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-red-500 hover:bg-red-600 transition-colors cursor-pointer disabled:opacity-50">
                  {deleting ? "Eliminando..." : "Eliminar"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

/* ── Sub-components ────────────────────────────────────────────── */

function StatCard({
  count,
  label,
  accent,
}: {
  count: number;
  label: string;
  accent?: boolean;
}) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5">
      <p
        className="mc-condensed text-3xl font-black"
        style={{ color: accent ? "#27a0c9" : "#111827" }}>
        {count}
      </p>
      <p className="mc-sora text-xs text-gray-500 mt-1">{label}</p>
    </div>
  );
}

function EmptyState({ onConfigure }: { onConfigure: () => void }) {
  return (
    <div className="mc-anim mc-a2 max-w-md mx-auto mt-12 text-center">
      <div
        className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5"
        style={{ background: "rgba(39,160,201,.08)" }}>
        <KeyRound className="h-7 w-7" style={{ color: "#27a0c9" }} />
      </div>

      <h2 className="mc-condensed text-3xl font-bold text-gray-900 mb-2">
        Sin certificados aún
      </h2>
      <p className="mc-sora text-sm text-gray-500 leading-relaxed mb-8 max-w-sm mx-auto">
        Configurá tu primer certificado digital para poder emitir facturas
        electrónicas a través de ARCA.
      </p>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
        <button
          onClick={onConfigure}
          className="mc-btn-primary mc-sora w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm text-white"
          style={{ background: "#27a0c9" }}>
          Configurar
        </button>

        <Link
          href="/mis-certificados/guia"
          className="mc-sora w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-medium text-sm text-gray-600 bg-white border border-gray-200 hover:border-gray-300 hover:text-gray-900 transition-colors">
          Ver guía de configuración
        </Link>
      </div>

      <p className="mc-sora text-xs text-gray-400 mt-8 inline-flex items-center gap-1.5">
        <Shield className="h-3.5 w-3.5" />
        Necesitás habilitar WSASS en ARCA antes de comenzar
      </p>
    </div>
  );
}

function CertCard({
  cert,
  animDelay,
  onDelete,
  onCheckAuthorizations,
}: {
  cert: CertData;
  animDelay: number;
  onDelete: () => void;
  onCheckAuthorizations: () => void;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const status = STATUS[cert.status];
  const env = ENV[cert.environment];

  const formatCuit = (cuit: string) => {
    const c = cuit.replace(/\D/g, "");
    if (c.length === 11)
      return `${c.slice(0, 2)}-${c.slice(2, 10)}-${c.slice(10)}`;
    return cuit;
  };

  const formatDate = (dateStr?: string | null) =>
    dateStr
      ? new Date(dateStr).toLocaleDateString("es-AR", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        })
      : "—";

  return (
    <div
      className="mc-card bg-white border border-gray-200 rounded-xl overflow-hidden"
      style={{
        animation: `mcFadeUp .45s ease ${animDelay + 0.18}s forwards`,
        opacity: 0,
      }}>
      <div className="p-5">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-start gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: "rgba(39,160,201,.08)" }}>
              <Shield className="h-5 w-5" style={{ color: "#27a0c9" }} />
            </div>
            <div className="min-w-0">
              <p className="mc-condensed text-lg font-bold text-gray-900 leading-tight">
                {cert.companyName || cert.certName}
              </p>
              <p className="mc-sora text-xs text-gray-400 mt-0.5">
                {cert.certName}
              </p>
            </div>
          </div>

          <span className="mc-sora inline-flex items-center gap-1.5 text-xs font-medium text-gray-500 flex-shrink-0">
            <span
              className="w-1.5 h-1.5 rounded-full flex-shrink-0"
              style={{ background: status.dot }}
            />
            {status.label}
          </span>
        </div>

        {/* Badges row */}
        <div className="flex items-center gap-2 mb-4">
          <span
            className="mc-sora text-xs font-mono font-medium px-2.5 py-1 rounded-lg"
            style={{ background: "#f1f5f9", color: "#475569" }}>
            {formatCuit(cert.cuit)}
          </span>
          <span
            className="mc-sora text-xs font-medium px-2.5 py-1 rounded-lg"
            style={{
              background:
                cert.environment === "PROD"
                  ? "rgba(16,185,129,.08)"
                  : "rgba(245,158,11,.08)",
              color: cert.environment === "PROD" ? "#065f46" : "#92400e",
            }}>
            {env.label}
          </span>
        </div>

        {/* Footer */}
        <div
          className="flex items-center justify-between pt-4"
          style={{ borderTop: "1px solid #f1f5f9" }}>
          <div className="flex items-center gap-5">
            <div>
              <p className="mc-sora text-[10px] uppercase tracking-wider text-gray-400 mb-0.5">
                Creado
              </p>
              <p className="mc-sora text-sm font-medium text-gray-700">
                {formatDate(cert.createdAt)}
              </p>
            </div>
            <div>
              <p className="mc-sora text-[10px] uppercase tracking-wider text-gray-400 mb-0.5">
                Vencimiento
              </p>
              <p className="mc-sora text-sm font-medium text-gray-700">
                {formatDate(cert.expiresAt)}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {cert.status === "PENDING_CERT" && (
              <Link
                href={`/mis-certificados/configurar?resume=${cert.id}`}
                className="mc-sora inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors"
                style={{
                  background: "rgba(39,160,201,.08)",
                  color: "#27a0c9",
                }}>
                <RefreshCw className="h-3 w-3" />
                Completar
              </Link>
            )}

            <div className="relative">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                onBlur={() => setTimeout(() => setMenuOpen(false), 150)}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-300 hover:text-gray-600 hover:bg-gray-50 transition-colors flex-shrink-0 cursor-pointer"
                aria-label="Opciones">
                <MoreVertical className="h-4 w-4 rotate-90" />
              </button>
              {menuOpen && (
                <div
                  className="absolute right-0 bottom-9 z-10 bg-white rounded-xl shadow-lg border border-gray-200 py-1 min-w-[160px]"
                  style={{ boxShadow: "0 8px 30px rgba(0,0,0,.12)" }}>
                  {cert.status === "ACTIVE" && (
                    <button
                      onMouseDown={(e) => {
                        e.preventDefault();
                        setMenuOpen(false);
                        onCheckAuthorizations();
                      }}
                      className="mc-sora w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer">
                      <ShieldCheck
                        className="w-3.5 h-3.5"
                        style={{ color: "#27a0c9" }}
                      />
                      Servicios
                    </button>
                  )}
                  <button
                    onMouseDown={(e) => {
                      e.preventDefault();
                      setMenuOpen(false);
                      onDelete();
                    }}
                    className="mc-sora w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors cursor-pointer">
                    <Trash2 className="w-3.5 h-3.5" />
                    Eliminar
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
