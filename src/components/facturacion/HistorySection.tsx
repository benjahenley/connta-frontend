"use client";

import { useState, useCallback } from "react";
import { createPortal } from "react-dom";
import {
  ChevronRight,
  Download,
  FileSpreadsheet,
  Trash2,
  AlertTriangle,
} from "lucide-react";
import type { UploadSessionSummary } from "@/services/afip";
import { DB_STATUS_MAP, STATUS_CFG, formatDate } from "./helpers";
import type { UploadStatus } from "./types";
import { HistorySkeleton } from "./FacturacionSkeleton";
import styles from "./facturacion.module.css";

interface HistorySectionProps {
  history: UploadSessionSummary[];
  historyLoading: boolean;
  onOpenSession: (record: UploadSessionSummary) => void;
  onHideSession?: (record: UploadSessionSummary) => Promise<void>;
}

export function HistorySection({
  history,
  historyLoading,
  onOpenSession,
  onHideSession,
}: HistorySectionProps) {
  const [confirmTarget, setConfirmTarget] =
    useState<UploadSessionSummary | null>(null);
  const [removingIds, setRemovingIds] = useState<Set<string>>(new Set());

  const handleConfirmHide = useCallback(async () => {
    if (!confirmTarget || !onHideSession) return;
    const record = confirmTarget;
    setConfirmTarget(null);

    // Optimistic: start exit animation immediately
    setRemovingIds((prev) => new Set(prev).add(record.id));

    try {
      await onHideSession(record);
    } catch {
      // Roll back on error
      setRemovingIds((prev) => {
        const next = new Set(prev);
        next.delete(record.id);
        return next;
      });
    }
  }, [confirmTarget, onHideSession]);

  const visibleHistory = history.filter((r) => !removingIds.has(r.id));

  return (
    <div className={`${styles.anim} ${styles.a4}`}>
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between mb-4">
        <h2
          className={`${styles.condensed} text-xl sm:text-2xl font-bold text-gray-900`}>
          Historial de cargas
        </h2>
        <span className={`${styles.sora} text-sm text-gray-400`}>
          {visibleHistory.length}{" "}
          {visibleHistory.length === 1 ? "archivo" : "archivos"}
        </span>
      </div>

      {historyLoading ? (
        <HistorySkeleton />
      ) : visibleHistory.length === 0 ? (
        <div
          className="rounded-2xl p-8 sm:p-12 text-center"
          style={{
            background: "white",
            border: "1px solid #e8ecf0",
          }}>
          <FileSpreadsheet
            className="w-10 h-10 mx-auto mb-3"
            style={{ color: "#d1d5db" }}
          />
          <p className={`${styles.sora} text-sm text-gray-400`}>
            Aún no hay cargas. Subí tu primer archivo arriba.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {visibleHistory.map((record, i) => (
            <HistoryCard
              key={record.id}
              record={record}
              animDelay={i * 0.06}
              onOpen={() => onOpenSession(record)}
              onHide={
                onHideSession
                  ? () => setConfirmTarget(record)
                  : undefined
              }
            />
          ))}
        </div>
      )}

      {/* ── Confirmation modal (portaled to body) ── */}
      {confirmTarget &&
        createPortal(
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
            onClick={() => setConfirmTarget(null)}>
            <div
              className="bg-white rounded-2xl shadow-xl max-w-sm w-full mx-4 p-6"
              onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-red-50">
                  <AlertTriangle className="w-5 h-5 text-red-500" />
                </div>
                <div>
                  <h3
                    className={`${styles.condensed} text-lg font-bold text-gray-900`}>
                    Ocultar carga
                  </h3>
                </div>
              </div>

              <p className={`${styles.sora} text-sm text-gray-600 mb-1`}>
                Se ocultará del historial:
              </p>
              <p
                className={`${styles.sora} text-sm font-semibold text-gray-800 mb-4 truncate`}>
                {confirmTarget.fileName}
              </p>
              <p className={`${styles.sora} text-xs text-gray-400 mb-6`}>
                Los datos se conservan internamente. Esta acción no elimina
                facturas generadas.
              </p>

              <div className="flex gap-3">
                <button
                  onClick={() => setConfirmTarget(null)}
                  className={`${styles.sora} flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors cursor-pointer`}>
                  Cancelar
                </button>
                <button
                  onClick={handleConfirmHide}
                  className={`${styles.sora} flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-red-500 hover:bg-red-600 transition-colors cursor-pointer`}>
                  Ocultar
                </button>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
}

function HistoryCard({
  record,
  animDelay,
  onOpen,
  onHide,
}: {
  record: UploadSessionSummary;
  animDelay: number;
  onOpen: () => void;
  onHide?: () => void;
}) {
  const uiStatus = DB_STATUS_MAP[record.status] as UploadStatus;
  const st = STATUS_CFG[uiStatus];
  const StatusIcon = st.Icon;

  return (
    <div
      className={`${styles.row} ${styles.historyItem} bg-white rounded-2xl overflow-hidden flex`}
      style={{
        border: "1px solid #e8ecf0",
        boxShadow: "0 1px 3px rgba(0,0,0,.04)",
        animationDelay: `${animDelay + 0.3}s`,
      }}>
      <div className="flex flex-col gap-4 px-4 py-4 sm:px-5 sm:flex-row sm:items-center flex-1 min-w-0">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: "rgba(22,163,74,.08)" }}>
            <FileSpreadsheet className="w-4 h-4" style={{ color: "#16a34a" }} />
          </div>
          <div className="min-w-0">
            <p
              className={`${styles.sora} text-sm font-semibold text-gray-800 truncate`}>
              {record.fileName}
            </p>
            <p className={`${styles.sora} text-xs text-gray-400 mt-0.5`}>
              {formatDate(record.createdAt)}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 flex-shrink-0">
          <span
            className={`${styles.sora} inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold`}
            style={{ background: st.bg, color: st.color }}>
            <StatusIcon className="w-3 h-3" />
            {st.label}
          </span>

          <div className="ml-auto flex items-center gap-1 sm:ml-1">
            {uiStatus === "completado" && (
              <button
                title="Descargar reporte"
                className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer">
                <Download className="w-4 h-4" />
              </button>
            )}
            {onHide && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onHide();
                }}
                title="Ocultar del historial"
                className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors cursor-pointer">
                <Trash2 className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={onOpen}
              title="Ver detalle"
              className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
