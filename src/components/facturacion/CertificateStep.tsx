import Link from "next/link";
import { AlertCircle, BadgeCheck, Building2, CheckCircle2, Factory, FlaskConical, ShieldAlert } from "lucide-react";
import type { CertData } from "@/services/afip";
import { formatCuit, formatShortDate } from "./helpers";
import styles from "./facturacion.module.css";

interface CertificateStepProps {
  selectedEnv: "DEV" | "PROD";
  onSelectEnv: (env: "DEV" | "PROD") => void;
  devCerts: CertData[];
  prodCerts: CertData[];
  certsForEnv: CertData[];
  selectedCert: CertData | null;
  onSelectCert: (cert: CertData) => void;
}

export function CertificateStep({
  selectedEnv,
  onSelectEnv,
  devCerts,
  prodCerts,
  certsForEnv,
  selectedCert,
  onSelectCert,
}: CertificateStepProps) {
  return (
    <div className={`${styles.anim} ${styles.a2}`}>
      <div className="flex items-center gap-3 mb-4">
        <div
          className={`${styles.condensed} w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white`}
          style={{ background: "#27a0c9" }}>
          1
        </div>
        <h2 className={`${styles.condensed} text-xl sm:text-2xl font-bold text-gray-900`}>
          Elegí el certificado
        </h2>
      </div>

      <div className="bg-white rounded-2xl overflow-hidden" style={{ border: "1px solid #e8ecf0" }}>
        <div className="flex flex-col sm:flex-row border-b" style={{ borderColor: "#e8ecf0" }}>
          <button
            onClick={() => onSelectEnv("DEV")}
            className={`${styles.envTab} ${selectedEnv === "DEV" ? styles.envTabActive : ""} ${styles.sora} flex items-center justify-between sm:justify-start gap-2 px-4 sm:px-6 py-3.5 sm:py-4 text-sm font-semibold transition-colors ${
              selectedEnv === "DEV" ? "text-gray-900" : "text-gray-400 hover:text-gray-600"
            }`}>
            <span className="flex min-w-0 items-center gap-2">
              <FlaskConical className="w-4 h-4 flex-shrink-0" />
              <span className="truncate">Homologación (Testing)</span>
            </span>
            {devCerts.length > 0 && (
              <span
                className="px-2 py-0.5 rounded-full text-xs font-bold"
                style={{
                  background:
                    selectedEnv === "DEV" ? "rgba(39,160,201,.12)" : "rgba(0,0,0,.05)",
                  color: selectedEnv === "DEV" ? "#1e7a9c" : "#9ca3af",
                }}>
                {devCerts.length}
              </span>
            )}
          </button>
          <button
            onClick={() => onSelectEnv("PROD")}
            className={`${styles.envTab} ${selectedEnv === "PROD" ? styles.envTabActive : ""} ${styles.sora} flex items-center justify-between sm:justify-start gap-2 px-4 sm:px-6 py-3.5 sm:py-4 text-sm font-semibold transition-colors ${
              selectedEnv === "PROD" ? "text-gray-900" : "text-gray-400 hover:text-gray-600"
            }`}>
            <span className="flex min-w-0 items-center gap-2">
              <Factory className="w-4 h-4 flex-shrink-0" />
              <span className="truncate">Producción</span>
            </span>
            {prodCerts.length > 0 && (
              <span
                className="px-2 py-0.5 rounded-full text-xs font-bold"
                style={{
                  background:
                    selectedEnv === "PROD" ? "rgba(39,160,201,.12)" : "rgba(0,0,0,.05)",
                  color: selectedEnv === "PROD" ? "#1e7a9c" : "#9ca3af",
                }}>
                {prodCerts.length}
              </span>
            )}
          </button>
        </div>

        <div className="p-4 sm:p-5">
          {selectedEnv === "PROD" && (
            <div
              className="flex items-start gap-2.5 px-4 py-3 rounded-xl mb-4 text-sm"
              style={{
                background: "rgba(239,68,68,.06)",
                color: "#dc2626",
                border: "1px solid rgba(239,68,68,.12)",
              }}>
              <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span>
                <strong>Ambiente de producción.</strong> Las facturas generadas acá son reales y quedan registradas en ARCA.
              </span>
            </div>
          )}

          {certsForEnv.length === 0 ? (
            <div className="text-center py-8 sm:py-10">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3" style={{ background: "rgba(0,0,0,.04)" }}>
                <ShieldAlert className="w-5 h-5 text-gray-300" />
              </div>
              <p className={`${styles.sora} text-sm text-gray-400 mb-3`}>
                No tenés certificados activos de {selectedEnv === "DEV" ? "homologación" : "producción"}.
              </p>
              <Link
                href="/mis-certificados/configurar"
                className={`${styles.sora} inline-flex items-center gap-1.5 text-sm font-medium hover:underline`}
                style={{ color: "#27a0c9" }}>
                <BadgeCheck className="w-3.5 h-3.5" />
                Crear certificado de {selectedEnv === "DEV" ? "testing" : "producción"}
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {certsForEnv.map((cert) => (
                <CertCard
                  key={cert.id}
                  cert={cert}
                  isSelected={selectedCert?.id === cert.id}
                  onSelect={() => onSelectCert(cert)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function CertCard({
  cert,
  isSelected,
  onSelect,
}: {
  cert: CertData;
  isSelected: boolean;
  onSelect: () => void;
}) {
  return (
    <div
      onClick={onSelect}
      className={`${styles.certCard} ${isSelected ? styles.certCardSelected : ""} rounded-xl p-4`}
      style={{
        background: isSelected ? "rgba(39,160,201,.03)" : "white",
        border: `1.5px solid ${isSelected ? "#27a0c9" : "#e8ecf0"}`,
      }}>
      <div className="flex items-start justify-between mb-3">
        <div
          className="w-9 h-9 rounded-lg flex items-center justify-center"
          style={{ background: isSelected ? "rgba(39,160,201,.12)" : "rgba(0,0,0,.04)" }}>
          <Building2 className="w-4 h-4" style={{ color: isSelected ? "#27a0c9" : "#9ca3af" }} />
        </div>
        {isSelected && (
          <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ background: "#27a0c9" }}>
            <CheckCircle2 className="w-4 h-4 text-white" />
          </div>
        )}
      </div>
      <p className={`${styles.sora} text-sm font-semibold text-gray-800 break-words`}>
        {cert.companyName || cert.certName}
      </p>
      <p className={`${styles.sora} text-xs mt-1 font-mono break-all`} style={{ color: "#6b7280" }}>
        CUIT {formatCuit(cert.cuit)}
      </p>
      <div className="flex flex-wrap items-center gap-1.5 mt-2.5">
        <div className="w-1.5 h-1.5 rounded-full" style={{ background: "#10b981" }} />
        <span className={`${styles.sora} text-xs text-gray-400`}>Activo</span>
        {cert.expiresAt && (
          <>
            <span className={`${styles.sora} text-xs text-gray-300 ml-1`}>·</span>
            <span className={`${styles.sora} text-xs text-gray-400 ml-1`}>
              Vence {formatShortDate(cert.expiresAt)}
            </span>
          </>
        )}
      </div>
    </div>
  );
}
