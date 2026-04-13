"use client";

import React, { useState, useCallback, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  Download,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  FileText,
  Loader2,
  FileSpreadsheet,
  X,
  ChevronDown,
  RotateCcw,
} from "lucide-react";
import { afipApi } from "@/services/afip";
import type { InvoiceVerification } from "@/services/afip";
import { useUploadDetail, invalidateUploadHistory } from "@/hooks/useAfipData";
import { FacturacionPreviewSkeleton } from "@/components/facturacion/FacturacionSkeleton";
import { ENV_CFG, formatCuit } from "@/components/facturacion/helpers";
import { PageHeader } from "@/components/ui/PageHeader";
import styles from "@/components/facturacion/facturacion.module.css";

/* ── Label maps (shared with preview page) ────────────────────── */
const CBTE_TIPO_LABELS: Record<number, string> = {
  1: "Factura A",
  2: "Nota Débito A",
  3: "Nota Crédito A",
  6: "Factura B",
  7: "Nota Débito B",
  8: "Nota Crédito B",
  11: "Factura C",
  12: "Nota Débito C",
  13: "Nota Crédito C",
  201: "FCE A",
  206: "FCE B",
  211: "FCE C",
};

/* ── Formatters ───────────────────────────────────────────────── */
function formatCbteNro(ptoVta: number | null, cbteNro: number | null): string {
  if (ptoVta == null || cbteNro == null) return "—";
  const pto = String(ptoVta).padStart(4, "0");
  const nro = String(cbteNro).padStart(8, "0");
  return `${pto}-${nro}`;
}

function formatAfipDate(val: string | null): string {
  if (!val) return "—";
  const s = String(val).replace(/[-/]/g, "");
  if (s.length === 8 && /^\d{8}$/.test(s)) {
    return `${s.slice(6, 8)}/${s.slice(4, 6)}/${s.slice(0, 4)}`;
  }
  return val;
}

function formatPrice(val: number | null): string {
  if (val == null) return "—";
  return `$ ${val.toLocaleString("es-AR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function formatDocReceptor(
  docTipo: number | null,
  docNro: number | null,
): string {
  if (docNro == null) return "—";
  const nroStr = String(docNro);
  // Format CUIT/CUIL with dashes when 11 digits
  const formatted =
    (docTipo === 80 || docTipo === 86) &&
    nroStr.replace(/\D/g, "").length === 11
      ? formatCuit(nroStr.replace(/\D/g, ""))
      : nroStr;
  return formatted;
}

function formatSessionDate(iso: string) {
  return new Date(iso).toLocaleDateString("es-AR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/* ── Invoice status badge ─────────────────────────────────────── */
const INVOICE_STATUS_CFG = {
  SUCCESS: {
    label: "Exitoso",
    color: "#10b981",
    bg: "rgba(16,185,129,.1)",
    Icon: CheckCircle2,
  },
  ERROR: {
    label: "Error",
    color: "#ef4444",
    bg: "rgba(239,68,68,.1)",
    Icon: XCircle,
  },
  PENDING: {
    label: "Pendiente",
    color: "#f59e0b",
    bg: "rgba(245,158,11,.1)",
    Icon: AlertTriangle,
  },
  SKIPPED: {
    label: "Omitido",
    color: "#6b7280",
    bg: "rgba(107,114,128,.1)",
    Icon: AlertTriangle,
  },
} as const;

type InvoiceStatus = keyof typeof INVOICE_STATUS_CFG;

/* ── Verification modal ───────────────────────────────────────── */
interface VerificationModalProps {
  invoiceId: string;
  onClose: () => void;
}

function VerificationModal({ invoiceId, onClose }: VerificationModalProps) {
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState<InvoiceVerification | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Fetch on mount
  useEffect(() => {
    let cancelled = false;
    afipApi
      .verifyInvoice(invoiceId)
      .then((data) => {
        if (!cancelled) {
          setResult(data);
          setLoading(false);
        }
      })
      .catch((err: Error) => {
        if (!cancelled) {
          setError(err.message);
          setLoading(false);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [invoiceId]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.45)" }}
      onClick={onClose}>
      <div
        className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden"
        style={{ border: "1px solid #e8ecf0" }}
        onClick={(e) => e.stopPropagation()}>
        {/* Modal header */}
        <div
          className="flex items-center justify-between px-5 py-4 border-b"
          style={{ borderColor: "#e8ecf0" }}>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4" style={{ color: "#27a0c9" }} />
            <span
              className={`${styles.condensed} font-bold text-gray-900 text-lg`}>
              Verificacion ARCA
            </span>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal body */}
        <div className="p-5">
          {loading && (
            <div className="flex items-center justify-center gap-2 py-8 text-gray-400">
              <Loader2
                className="w-5 h-5 animate-spin"
                style={{ color: "#27a0c9" }}
              />
              <span className={`${styles.sora} text-sm`}>
                Consultando ARCA...
              </span>
            </div>
          )}

          {error && !loading && (
            <div
              className="rounded-xl p-4 flex items-start gap-3"
              style={{
                background: "rgba(239,68,68,.07)",
                border: "1px solid rgba(239,68,68,.2)",
              }}>
              <XCircle
                className="w-4 h-4 mt-0.5 flex-shrink-0"
                style={{ color: "#ef4444" }}
              />
              <p className={`${styles.sora} text-sm text-red-700`}>{error}</p>
            </div>
          )}

          {result && !loading && (
            <div className="space-y-4">
              {/* Match banner */}
              <div
                className="rounded-xl p-3 flex items-center gap-3"
                style={{
                  background: result.match
                    ? "rgba(16,185,129,.08)"
                    : "rgba(239,68,68,.08)",
                  border: `1px solid ${result.match ? "rgba(16,185,129,.25)" : "rgba(239,68,68,.25)"}`,
                }}>
                {result.match ? (
                  <CheckCircle2
                    className="w-5 h-5 flex-shrink-0"
                    style={{ color: "#10b981" }}
                  />
                ) : (
                  <XCircle
                    className="w-5 h-5 flex-shrink-0"
                    style={{ color: "#ef4444" }}
                  />
                )}
                <div>
                  <p
                    className={`${styles.sora} text-sm font-semibold`}
                    style={{ color: result.match ? "#10b981" : "#ef4444" }}>
                    {result.match
                      ? "Factura verificada"
                      : "Discrepancia detectada"}
                  </p>
                  <p className={`${styles.sora} text-xs text-gray-500 mt-0.5`}>
                    {result.resultado}
                  </p>
                </div>
              </div>

              {/* ARCA data grid */}
              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: "CAE", value: result.afipData.cae },
                  {
                    label: "Vto. CAE",
                    value: formatAfipDate(result.afipData.caeFchVto),
                  },
                  {
                    label: "Fecha",
                    value: formatAfipDate(result.afipData.cbteFch),
                  },
                  {
                    label: "Total",
                    value: formatPrice(result.afipData.impTotal),
                  },
                  {
                    label: "Neto",
                    value: formatPrice(result.afipData.impNeto),
                  },
                  { label: "IVA", value: formatPrice(result.afipData.impIva) },
                ].map(({ label, value }) => (
                  <div
                    key={label}
                    className="rounded-xl p-3"
                    style={{
                      background: "#f4f7f9",
                      border: "1px solid #e8ecf0",
                    }}>
                    <p
                      className={`${styles.sora} text-[10px] uppercase tracking-wide text-gray-400 mb-1`}>
                      {label}
                    </p>
                    <p
                      className={`${styles.sora} text-sm font-semibold text-gray-800 break-all`}>
                      {value}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── Main page ────────────────────────────────────────────────── */
export default function HistorialDetailPage() {
  const router = useRouter();
  const params = useParams();
  const sessionId = typeof params.id === "string" ? params.id : "";

  const { detail, detailLoading, detailError } = useUploadDetail(
    sessionId || null,
  );

  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [downloadingAll, setDownloadingAll] = useState(false);
  const [verifyingId, setVerifyingId] = useState<string | null>(null);
  const [allInvoicesExpanded, setAllInvoicesExpanded] = useState(false);
  const [retrying, setRetrying] = useState(false);
  const isFailed = detail?.status === "FAILED";

  /* ── Handlers ───────────────────────────────────────────────── */
  const handleDownloadPdf = useCallback(
    async (invoiceId: string, filename: string) => {
      setDownloadingId(invoiceId);
      try {
        await afipApi.downloadInvoicePdf(invoiceId, filename);
      } catch (err) {
        console.error("Error al descargar PDF:", err);
      } finally {
        setDownloadingId(null);
      }
    },
    [],
  );

  const handleDownloadAll = useCallback(async () => {
    if (!detail || !sessionId) return;
    setDownloadingAll(true);
    try {
      await afipApi.downloadUploadPdfsZip(sessionId);
    } catch (err) {
      console.error("Error al descargar el ZIP:", err);
    } finally {
      setDownloadingAll(false);
    }
  }, [detail, sessionId]);

  const handleRetry = useCallback(async () => {
    if (!sessionId || retrying) return;
    setRetrying(true);
    try {
      await afipApi.retrySession(sessionId);
      invalidateUploadHistory();
      router.push(
        `/facturacion/preview?uploadSessionId=${sessionId}&retryFailedOnly=1`,
      );
    } finally {
      setRetrying(false);
    }
  }, [sessionId, retrying, router]);

  /* ── Derived stats ──────────────────────────────────────────── */
  const stats = detail
    ? {
        total: detail.invoices.length,
        success: detail.invoices.filter((i) => i.status === "SUCCESS").length,
        error: detail.invoices.filter((i) => i.status === "ERROR").length,
        pending: detail.invoices.filter(
          (i) => i.status === "PENDING" || i.status === "SKIPPED",
        ).length,
      }
    : null;

  const envCfg = ENV_CFG.produccion;

  // Which invoices to show in the primary table
  const primaryInvoices = isFailed
    ? detail!.invoices.filter((i) => i.status === "ERROR")
    : (detail?.invoices ?? []);
  const secondaryInvoices = isFailed
    ? detail!.invoices.filter(
        (invoice) =>
          !primaryInvoices.some((primary) => primary.id === invoice.id),
      )
    : [];

  /* ── Render ─────────────────────────────────────────────────── */
  return (
    <div
      className={styles.sora}
      style={{ background: "#f4f7f9", minHeight: "100%" }}>
      {/* Sticky page header */}
      <div
        className="w-full bg-white"
        style={{ borderBottom: "1px solid #e8ecf0" }}>
        <div className="px-6 md:px-8 lg:px-10 py-5 max-w-7xl mx-auto">
          <PageHeader
            className={`${styles.anim} ${styles.a1}`}
            backHref="/facturacion"
            backLabel="Facturación"
            eyebrow="Historial"
            icon={FileText}
            title="Detalle de carga"
            description={detail?.fileName}
            actions={
              <>
              {/* Reintentar button — only for FAILED sessions */}
              {detail && isFailed && (
                <button
                  onClick={handleRetry}
                  disabled={retrying}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer disabled:opacity-60"
                  style={{
                    background: "#27a0c9",
                    color: "white",
                  }}>
                  {retrying ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <RotateCcw className="w-4 h-4" />
                  )}
                  {retrying ? "Reintentando..." : "Reintentar"}
                </button>
              )}

              {/* Descargar todos — only when there are successes */}
              {detail && stats && stats.success > 0 && (
                <button
                  onClick={handleDownloadAll}
                  disabled={downloadingAll}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer disabled:opacity-60"
                  style={{
                    background: "#27a0c9",
                    color: "white",
                  }}>
                  {downloadingAll ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Download className="w-4 h-4" />
                  )}
                  {downloadingAll ? "Preparando ZIP..." : "Descargar ZIP"}
                </button>
              )}
              </>
            }
          />
        </div>
      </div>

      <div className="px-6 md:px-8 lg:px-10 py-8 space-y-6 max-w-7xl mx-auto">
        {/* Loading state */}
        {detailLoading && <FacturacionPreviewSkeleton />}

        {/* Error state */}
        {detailError && !detailLoading && (
          <div
            className="rounded-2xl p-10 text-center bg-white"
            style={{ border: "1px solid #e8ecf0" }}>
            <XCircle
              className="w-10 h-10 mx-auto mb-3"
              style={{ color: "#ef4444" }}
            />
            <p
              className={`${styles.sora} text-sm font-semibold text-gray-700 mb-1`}>
              No se pudo cargar el detalle
            </p>
            <p className={`${styles.sora} text-xs text-gray-400`}>
              {detailError.message}
            </p>
          </div>
        )}

        {/* Content */}
        {detail && stats && !detailLoading && (
          <>
            {/* Session info card */}
            <div
              className={`${styles.anim} ${styles.a2} rounded-2xl bg-white overflow-hidden`}
              style={{
                border: "1px solid #e8ecf0",
                boxShadow: "0 1px 3px rgba(0,0,0,.04)",
              }}>
              <div
                className="px-5 py-4 border-b flex items-center gap-2"
                style={{ borderColor: "#e8ecf0" }}>
                <FileSpreadsheet
                  className="w-4 h-4"
                  style={{ color: "#27a0c9" }}
                />
                <span
                  className={`${styles.condensed} font-bold text-gray-900 text-lg`}>
                  Informacion de sesion
                </span>
              </div>

              <div className="px-5 py-4">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-5">
                  <div>
                    <p
                      className={`${styles.sora} text-[10px] uppercase tracking-wide text-gray-400 mb-1`}>
                      Archivo
                    </p>
                    <p
                      className={`${styles.sora} text-sm font-semibold text-gray-800 truncate`}>
                      {detail.fileName}
                    </p>
                  </div>
                  <div>
                    <p
                      className={`${styles.sora} text-[10px] uppercase tracking-wide text-gray-400 mb-1`}>
                      Fecha de carga
                    </p>
                    <p
                      className={`${styles.sora} text-sm font-semibold text-gray-800`}>
                      {formatSessionDate(detail.createdAt)}
                    </p>
                  </div>
                  <div>
                    <p
                      className={`${styles.sora} text-[10px] uppercase tracking-wide text-gray-400 mb-1`}>
                      CUIT
                    </p>
                    <p
                      className={`${styles.sora} text-sm font-semibold text-gray-800`}>
                      {detail.cuit ? formatCuit(detail.cuit) : "—"}
                    </p>
                  </div>
                  <div>
                    <p
                      className={`${styles.sora} text-[10px] uppercase tracking-wide text-gray-400 mb-1`}>
                      Entorno
                    </p>
                    <span
                      className={`${styles.sora} inline-block px-2.5 py-1 rounded-lg text-xs font-semibold`}
                      style={{ background: envCfg.bg, color: envCfg.color }}>
                      {envCfg.label}
                    </span>
                  </div>
                </div>

                {/* Stats row */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <StatCard
                    label="Total"
                    value={stats.total}
                    color="#27a0c9"
                    bg="rgba(39,160,201,.08)"
                  />
                  <StatCard
                    label="Exitosas"
                    value={stats.success}
                    color="#10b981"
                    bg="rgba(16,185,129,.08)"
                  />
                  <StatCard
                    label="Errores"
                    value={stats.error}
                    color="#ef4444"
                    bg="rgba(239,68,68,.08)"
                  />
                  <StatCard
                    label="Pendientes"
                    value={stats.pending}
                    color="#f59e0b"
                    bg="rgba(245,158,11,.08)"
                  />
                </div>
              </div>
            </div>

            {/* Invoice table card */}
            <div
              className={`${styles.anim} ${styles.a3} rounded-2xl bg-white overflow-hidden`}
              style={{
                border: "1px solid #e8ecf0",
                boxShadow: "0 1px 3px rgba(0,0,0,.04)",
              }}>
              <div
                className="px-5 py-4 border-b flex items-center justify-between"
                style={{ borderColor: "#e8ecf0" }}>
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4" style={{ color: "#27a0c9" }} />
                  <span
                    className={`${styles.condensed} font-bold text-gray-900 text-lg`}>
                    {isFailed ? "Facturas con error" : "Facturas"}
                  </span>
                </div>
                <span className={`${styles.sora} text-xs text-gray-400`}>
                  {isFailed
                    ? `${primaryInvoices.length} ${primaryInvoices.length === 1 ? "factura" : "facturas"} con error`
                    : `${stats.total} ${stats.total === 1 ? "factura" : "facturas"}`}
                </span>
              </div>

              {/* Primary table (errors only when FAILED, all otherwise) */}
              <InvoiceTable
                invoices={primaryInvoices}
                downloadingId={downloadingId}
                onDownloadPdf={handleDownloadPdf}
                onVerify={setVerifyingId}
                isFailed={isFailed}
              />

              {primaryInvoices.length === 0 && (
                <div className="text-center py-12">
                  <FileText
                    className="w-8 h-8 mx-auto mb-3"
                    style={{ color: "#d1d5db" }}
                  />
                  <p className={`${styles.sora} text-sm text-gray-400`}>
                    No hay facturas en esta sesion.
                  </p>
                </div>
              )}

              {/* Collapsible "all invoices" section — only for FAILED sessions */}
              {isFailed && secondaryInvoices.length > 0 && (
                <div style={{ borderTop: "1px solid #e8ecf0" }}>
                  <button
                    onClick={() => setAllInvoicesExpanded((v) => !v)}
                    className="w-full flex items-center justify-between px-5 py-3 text-left transition-colors hover:bg-gray-50 cursor-pointer"
                    style={{ background: "transparent" }}>
                    <span
                      className={`${styles.sora} text-sm font-semibold text-gray-600`}>
                      Ver resto de las facturas ({secondaryInvoices.length})
                    </span>
                    <ChevronDown
                      className="w-4 h-4 text-gray-400 transition-transform duration-200"
                      style={{
                        transform: allInvoicesExpanded
                          ? "rotate(180deg)"
                          : "rotate(0deg)",
                      }}
                    />
                  </button>

                  {allInvoicesExpanded && (
                    <div style={{ borderTop: "1px solid #f1f5f9" }}>
                      <InvoiceTable
                        invoices={secondaryInvoices}
                        downloadingId={downloadingId}
                        onDownloadPdf={handleDownloadPdf}
                        onVerify={setVerifyingId}
                        isFailed={isFailed}
                        showHeader={false}
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* Verification modal */}
      {verifyingId && (
        <VerificationModal
          invoiceId={verifyingId}
          onClose={() => setVerifyingId(null)}
        />
      )}
    </div>
  );
}

/* ── Invoice table (extracted to avoid duplication) ──────────── */
interface InvoiceTableProps {
  invoices: Array<{
    id: string;
    ptoVta: number | null;
    cbteTipo: number | null;
    concepto: number | null;
    docTipo: number | null;
    docNro: number | null;
    impNeto: number | null;
    impIva: number | null;
    impOpEx: number | null;
    impTotal: number | null;
    cbteFch: string | null;
    cae: string | null;
    caeFchVto: string | null;
    cbteNro: number | null;
    razonSocial: string | null;
    status: "PENDING" | "SUCCESS" | "ERROR" | "SKIPPED";
    errorDetail: string | null;
  }>;
  downloadingId: string | null;
  onDownloadPdf: (id: string, filename: string) => void;
  onVerify: (id: string) => void;
  isFailed: boolean;
  showHeader?: boolean;
}

function InvoiceTable({
  invoices,
  downloadingId,
  onDownloadPdf,
  onVerify,
  isFailed,
  showHeader = true,
}: InvoiceTableProps) {
  void isFailed;
  if (invoices.length === 0) return null;

  return (
    <div className="max-h-[70vh] overflow-auto">
      <table className="w-full min-w-[1060px]">
        {showHeader && (
          <thead className="sticky top-0 z-10">
            <tr
              style={{
                borderBottom: "1px solid #e8ecf0",
                background: "#f8fafc",
              }}>
              {[
                "#",
                "Tipo",
                "Nro Comprobante",
                "Fecha",
                "Razón Social",
                "Receptor",
                "Total",
                "CAE",
                "Estado",
                "Acciones",
              ].map((col) => (
                <th
                  key={col}
                  className={`${styles.sora} px-4 py-3 text-left text-[10px] uppercase tracking-wide font-semibold text-gray-400`}>
                  {col}
                </th>
              ))}
            </tr>
          </thead>
        )}
        <tbody>
          {invoices.map((inv, idx) => {
            const statusCfg =
              INVOICE_STATUS_CFG[inv.status as InvoiceStatus] ??
              INVOICE_STATUS_CFG.PENDING;
            const StatusIcon = statusCfg.Icon;
            const isSuccess = inv.status === "SUCCESS";
            const filename = `factura-${formatCbteNro(inv.ptoVta, inv.cbteNro)}.pdf`;

            const isError = inv.status === "ERROR";

            return (
              <React.Fragment key={inv.id}>
                <tr
                  className={`${styles.row}`}
                  style={{
                    borderBottom:
                      isError && inv.errorDetail ? "none" : "1px solid #f1f5f9",
                  }}>
                  {/* # */}
                  <td
                    className={`${styles.sora} px-4 py-3 text-sm text-gray-400 font-medium`}>
                    {idx + 1}
                  </td>

                  {/* Tipo */}
                  <td
                    className={`${styles.sora} px-4 py-3 text-sm text-gray-700`}>
                    {inv.cbteTipo != null
                      ? (CBTE_TIPO_LABELS[inv.cbteTipo] ?? String(inv.cbteTipo))
                      : "—"}
                  </td>

                  {/* Nro Comprobante */}
                  <td
                    className={`${styles.sora} px-4 py-3 text-sm font-mono text-gray-800`}>
                    {formatCbteNro(inv.ptoVta, inv.cbteNro)}
                  </td>

                  {/* Fecha */}
                  <td
                    className={`${styles.sora} px-4 py-3 text-sm text-gray-700`}>
                    {formatAfipDate(inv.cbteFch)}
                  </td>

                  {/* Razón Social */}
                  <td
                    className={`${styles.sora} px-4 py-3 text-sm text-gray-700 max-w-[160px] truncate`}>
                    {inv.razonSocial ?? "—"}
                  </td>

                  {/* Receptor */}
                  <td
                    className={`${styles.sora} px-4 py-3 text-sm text-gray-700 whitespace-nowrap`}>
                    {formatDocReceptor(inv.docTipo, inv.docNro)}
                  </td>

                  {/* Total */}
                  <td
                    className={`${styles.sora} px-4 py-3 text-sm font-semibold text-gray-800 whitespace-nowrap`}>
                    {formatPrice(inv.impTotal)}
                  </td>

                  {/* CAE */}
                  <td
                    className={`${styles.sora} px-4 py-3 text-xs font-mono text-gray-600`}>
                    {inv.cae ?? "—"}
                  </td>

                  {/* Estado badge — plain span, never clickable */}
                  <td className="px-4 py-3">
                    <span
                      className="inline-flex items-center justify-center w-7 h-7 rounded-full"
                      style={{
                        background: statusCfg.bg,
                        color: statusCfg.color,
                      }}
                      title={statusCfg.label}>
                      <StatusIcon className="w-3.5 h-3.5" />
                    </span>
                  </td>

                  {/* Acciones */}
                  <td className="px-4 py-3">
                    {isSuccess && (
                      <div className="flex items-center gap-1">
                        {/* Download PDF */}
                        <button
                          title="Descargar PDF"
                          onClick={() => onDownloadPdf(inv.id, filename)}
                          disabled={downloadingId === inv.id}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer disabled:opacity-60"
                          style={{
                            background: "rgba(39,160,201,.09)",
                            color: "#27a0c9",
                          }}>
                          {downloadingId === inv.id ? (
                            <Loader2 className="w-3 h-3 animate-spin" />
                          ) : (
                            <Download className="w-3 h-3" />
                          )}
                          PDF
                        </button>

                        {/* Verify */}
                        <button
                          title="Verificar en ARCA"
                          onClick={() => onVerify(inv.id)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer"
                          style={{
                            background: "rgba(16,185,129,.09)",
                            color: "#10b981",
                          }}>
                          <ShieldCheck className="w-3 h-3" />
                          Verificar
                        </button>
                      </div>
                    )}
                  </td>
                </tr>

                {/* Error detail sub-row */}
                {isError && inv.errorDetail && (
                  <tr style={{ borderBottom: "1px solid #f1f5f9" }}>
                    <td colSpan={10} className="px-4 pb-3 pt-0">
                      <div
                        className="flex items-start gap-2 rounded-lg px-3 py-2"
                        style={{
                          background: "rgba(239,68,68,.06)",
                          border: "1px solid rgba(239,68,68,.18)",
                        }}>
                        <XCircle
                          className="w-3.5 h-3.5 mt-0.5 flex-shrink-0"
                          style={{ color: "#ef4444" }}
                        />
                        <p
                          className={`${styles.sora} text-xs text-red-700 leading-relaxed whitespace-pre-wrap break-words`}>
                          {inv.errorDetail}
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

/* ── Sub-components ───────────────────────────────────────────── */
function StatCard({
  label,
  value,
  color,
  bg,
}: {
  label: string;
  value: number;
  color: string;
  bg: string;
}) {
  return (
    <div
      className="rounded-xl p-3 text-center"
      style={{ background: bg, border: `1px solid ${color}20` }}>
      <p
        className={`${styles.condensed} text-2xl font-black leading-none`}
        style={{ color }}>
        {value}
      </p>
      <p
        className={`${styles.sora} text-[10px] uppercase tracking-wide text-gray-500 mt-1`}>
        {label}
      </p>
    </div>
  );
}
