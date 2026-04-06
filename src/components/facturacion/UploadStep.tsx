import type { RefObject } from "react";
import { ArrowLeft, CloudUpload, Sparkles } from "lucide-react";
import type { CertData } from "@/services/afip";
import { formatCuit } from "./helpers";
import styles from "./facturacion.module.css";

interface UploadStepProps {
  selectedCert: CertData | null;
  isDragging: boolean;
  isScanning: boolean;
  isPasteMode: boolean;
  scanError: string | null;
  pasteInputRef: RefObject<HTMLTextAreaElement | null>;
  fileInputRef: RefObject<HTMLInputElement | null>;
  onDragOver: (e: React.DragEvent) => void;
  onDragLeave: () => void;
  onDrop: (e: React.DragEvent) => void;
  onClickZone: () => void;
  onEnterPasteMode: () => void;
  onExitPasteMode: () => void;
  onFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onPasteIntoInput: (e: React.ClipboardEvent<HTMLTextAreaElement>) => void;
}

export function UploadStep({
  selectedCert,
  isDragging,
  isScanning,
  isPasteMode,
  scanError,
  pasteInputRef,
  fileInputRef,
  onDragOver,
  onDragLeave,
  onDrop,
  onClickZone,
  onEnterPasteMode,
  onExitPasteMode,
  onFileSelect,
  onPasteIntoInput,
}: UploadStepProps) {
  const pasteInputClasses =
    "flex min-h-32 w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm resize-none";

  return (
    <div className={`${styles.anim} ${styles.a3}`}>
      <div className="flex items-center gap-3 mb-4">
        <div
          className={`${styles.condensed} w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold`}
          style={{
            background: selectedCert ? "#27a0c9" : "#d1d5db",
            color: "white",
          }}>
          2
        </div>
        <h2
          className={`${styles.condensed} text-xl sm:text-2xl font-bold ${selectedCert ? "text-gray-900" : "text-gray-300"}`}>
          Subí el archivo de facturas
        </h2>
        {selectedCert && (
          <span
            className={`${styles.sora} ml-auto hidden sm:inline-flex text-xs font-medium px-3 py-1 rounded-full`}
            style={{
              background: "rgba(39,160,201,.1)",
              color: "#1e7a9c",
            }}>
            {selectedCert.companyName} · CUIT {formatCuit(selectedCert.cuit)}
          </span>
        )}
      </div>

      <div
        className={`relative rounded-2xl transition-opacity duration-300 ${!selectedCert ? "opacity-40 pointer-events-none" : ""}`}>
        <div
          className={`${styles.zone} ${isDragging ? styles.zoneActive : ""} relative rounded-2xl px-4 py-8 sm:p-12 text-center ${isScanning ? "" : "cursor-pointer"}`}
          style={{ background: "white", border: "none" }}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={isScanning || !selectedCert ? undefined : onDrop}
          onClick={onClickZone}>
          <input
            ref={fileInputRef}
            type="file"
            accept=".xlsx,.xls,.csv"
            className="hidden"
            onChange={onFileSelect}
          />
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none"
            style={{ borderRadius: "1rem" }}>
            <rect
              x="2"
              y="2"
              width="calc(100% - 4px)"
              height="calc(100% - 4px)"
              rx="14"
              ry="14"
              fill="none"
              strokeWidth="2"
              strokeDasharray="8 6"
              className={
                isDragging || isScanning ? styles.dashActive : styles.dashIdle
              }
            />
          </svg>

          <div className="flex flex-col items-center gap-4 sm:gap-5 relative">
            {selectedCert && (
              <div
                className={`${styles.sora} inline-flex sm:hidden max-w-full rounded-full px-3 py-1 text-[11px] font-medium`}
                style={{
                  background: "rgba(39,160,201,.1)",
                  color: "#1e7a9c",
                }}>
                <span className="truncate">
                  {selectedCert.companyName} · CUIT{" "}
                  {formatCuit(selectedCert.cuit)}
                </span>
              </div>
            )}
            <div className="relative">
              <div
                className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center transition-all duration-300 ${isDragging || isScanning ? "scale-110" : ""}`}
                style={{
                  background: isScanning
                    ? "rgba(39,160,201,.12)"
                    : isDragging
                      ? "rgba(39,160,201,.12)"
                      : "rgba(39,160,201,.07)",
                }}>
                {isScanning ? (
                  <Sparkles
                    className="w-7 h-7 sm:w-9 sm:h-9 transition-colors duration-300"
                    style={{ color: "#27a0c9" }}
                  />
                ) : (
                  <CloudUpload
                    className="w-7 h-7 sm:w-9 sm:h-9 transition-colors duration-300"
                    style={{ color: isDragging ? "#27a0c9" : "#93c5da" }}
                  />
                )}
              </div>
              {(isDragging || isScanning) && (
                <div
                  className={`${styles.zoneGlow} absolute inset-0 rounded-2xl pointer-events-none`}
                  style={{
                    boxShadow: "0 0 0 8px rgba(39,160,201,.15)",
                  }}
                />
              )}
            </div>

            <div>
              {isScanning ? (
                <>
                  <p
                    className={`${styles.sora} text-base font-semibold`}
                    style={{ color: "#27a0c9" }}>
                    Analizando archivo...
                  </p>
                  <p
                    className={`${styles.sora} text-sm text-gray-400 mt-1 leading-relaxed`}>
                    Leyendo el Excel y extrayendo las facturas
                  </p>
                </>
              ) : (
                <>
                  <p
                    className={`${styles.sora} text-base font-semibold text-gray-700`}>
                    {isDragging
                      ? "Soltá el archivo acá"
                      : isPasteMode
                        ? "Pegá el contenido de la tabla"
                        : "Subí tu archivo de facturas"}
                  </p>
                  <p
                    className={`${styles.sora} text-sm text-gray-400 mt-1 leading-relaxed`}>
                    {isPasteMode ? (
                      <>
                        Hacé foco en el campo y{" "}
                        <span
                          style={{ color: "#27a0c9" }}
                          className="font-medium">
                          pegá contenido con Ctrl+V
                        </span>
                      </>
                    ) : (
                      <>
                        Arrastrá y soltá o{" "}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onEnterPasteMode();
                          }}
                          style={{ color: "#27a0c9" }}
                          className="font-medium hover:underline">
                          hacé click para pegar una tabla con Ctrl+V
                        </button>
                      </>
                    )}
                  </p>
                </>
              )}
            </div>

            {!isScanning && isPasteMode && (
              <div
                className="w-full max-w-2xl"
                onClick={(e) => e.stopPropagation()}>
                <textarea
                  ref={pasteInputRef}
                  rows={5}
                  className={pasteInputClasses}
                  placeholder="Pegá contenido"
                  onPaste={onPasteIntoInput}
                  disabled={!selectedCert}
                />
                <button
                  type="button"
                  onClick={onExitPasteMode}
                  className={`${styles.sora} mt-3 inline-flex items-center gap-1.5 text-xs font-medium hover:underline`}
                  style={{ color: "#27a0c9" }}>
                  <ArrowLeft className="w-3.5 h-3.5" />
                  Volver a subir archivo
                </button>
              </div>
            )}

            {!isScanning && (
              <div className="flex flex-col items-center gap-3">
                <div className="flex flex-wrap items-center justify-center gap-2">
                  {[".xlsx", ".xls", ".csv"].map((ext) => (
                    <span
                      key={ext}
                      className={`${styles.sora} px-2.5 py-1 rounded-lg text-xs font-semibold`}
                      style={{
                        background: "rgba(39,160,201,.08)",
                        color: "#1e7a9c",
                      }}>
                      {ext}
                    </span>
                  ))}
                  <span className={`${styles.sora} text-xs text-gray-400`}>
                    · hasta 10 MB
                  </span>
                </div>
              </div>
            )}

            {scanError && (
              <div
                className="w-full max-w-md px-4 py-3 rounded-xl text-sm"
                style={{
                  background: "rgba(239,68,68,.08)",
                  color: "#dc2626",
                }}>
                {scanError}
              </div>
            )}
          </div>
        </div>
      </div>
      {!isScanning && (
        <div className="mt-3 flex justify-center">
          <a
            href="/plantilla-facturas.csv"
            download="plantilla-facturas.csv"
            className={`${styles.sora} text-center text-xs font-medium hover:underline`}
            style={{ color: "#27a0c9" }}>
            Descargar plantilla con columnas recomendadas
          </a>
        </div>
      )}
    </div>
  );
}
