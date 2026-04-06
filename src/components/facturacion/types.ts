import type { CertData, UploadSessionSummary } from "@/services/afip";

export type FacturacionEnv = "DEV" | "PROD";

export type UploadStatus =
  | "procesando"
  | "listo"
  | "error"
  | "generando"
  | "completado";

export type CertList = CertData[];
export type HistoryList = UploadSessionSummary[];
