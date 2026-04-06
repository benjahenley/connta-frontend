import { AlertCircle, CheckCircle2, Clock, XCircle } from "lucide-react";
import type { ComponentType } from "react";
import type { UploadStatus } from "./types";

export const DB_STATUS_MAP = {
  SCANNED: "listo",
  GENERATING: "generando",
  COMPLETED: "completado",
  FAILED: "error",
} as const;

export const STATUS_CFG = {
  procesando: {
    label: "Procesando",
    color: "#f59e0b",
    bg: "rgba(245,158,11,.09)",
    border: "#fcd34d",
    Icon: Clock,
  },
  listo: {
    label: "Listo",
    color: "#27a0c9",
    bg: "rgba(39,160,201,.09)",
    border: "#7dd3fc",
    Icon: AlertCircle,
  },
  generando: {
    label: "Generando CAEs",
    color: "#8b5cf6",
    bg: "rgba(139,92,246,.09)",
    border: "#c4b5fd",
    Icon: Clock,
  },
  completado: {
    label: "Completado",
    color: "#10b981",
    bg: "rgba(16,185,129,.09)",
    border: "#6ee7b7",
    Icon: CheckCircle2,
  },
  error: {
    label: "Error",
    color: "#ef4444",
    bg: "rgba(239,68,68,.09)",
    border: "#fca5a5",
    Icon: XCircle,
  },
} as const satisfies Record<UploadStatus, {
  label: string;
  color: string;
  bg: string;
  border: string;
  Icon: ComponentType<{ className?: string }>;
}>;

export const ENV_CFG = {
  produccion: {
    label: "Producción",
    color: "#0f172a",
    bg: "rgba(15,23,42,.08)",
  },
  homologacion: {
    label: "Homologación",
    color: "#92400e",
    bg: "rgba(245,158,11,.13)",
  },
} as const;

export function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("es-AR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatShortDate(iso: string) {
  return new Date(iso).toLocaleDateString("es-AR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export function formatCuit(cuit: string) {
  if (cuit.length === 11) {
    return `${cuit.slice(0, 2)}-${cuit.slice(2, 10)}-${cuit.slice(10)}`;
  }
  return cuit;
}
