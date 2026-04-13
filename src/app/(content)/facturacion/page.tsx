"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type {
  CertData,
  UploadSessionSummary,
} from "@/services/afip";
import { afipApi } from "@/services/afip";
import { useCertificates, useUploadHistory } from "@/hooks/useAfipData";
import { CertificateStep } from "@/components/facturacion/CertificateStep";
import { FacturacionHeader } from "@/components/facturacion/FacturacionHeader";
import { FacturacionContentSkeleton } from "@/components/facturacion/FacturacionSkeleton";
import { HistorySection } from "@/components/facturacion/HistorySection";
import { NoCertificatesState } from "@/components/facturacion/NoCertificatesState";
import { UploadStep } from "@/components/facturacion/UploadStep";
import styles from "@/components/facturacion/facturacion.module.css";

const previewCacheKey = (uploadSessionId: string) =>
  `facturacion-preview:${uploadSessionId}`;

interface PreviewBootstrapPayload {
  fileName: string;
  uploadSessionId: string;
  cuit: string;
  environment: "DEV" | "PROD";
  companyName: string | null;
}

export default function Facturacion() {
  const router = useRouter();
  const pasteInputRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isDragging, setIsDragging] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [scanError, setScanError] = useState<string | null>(null);
  const [isPasteMode, setIsPasteMode] = useState(false);

  const { certs, certsLoading } = useCertificates();
  const { history, historyLoading, mutateHistory } = useUploadHistory();

  const [selectedCert, setSelectedCert] = useState<CertData | null>(null);
  const [initialCertSet, setInitialCertSet] = useState(false);

  const activeCerts = certs.filter((c) => c.status === "ACTIVE");
  const hasActiveCerts = activeCerts.length > 0;

  // Set initial cert selection once certs load
  useEffect(() => {
    if (initialCertSet || activeCerts.length === 0) return;
    setSelectedCert(activeCerts[0]);
    setInitialCertSet(true);
  }, [activeCerts, initialCertSet]);

  const handleFile = useCallback(
    async (file: File) => {
      if (!selectedCert) return;

      setScanError(null);
      setIsScanning(true);
      setIsPasteMode(false);

      try {
        const { uploadSessionId } = await afipApi.scanExcel({
          file,
          certRecordId: selectedCert.id,
          cuit: selectedCert.cuit,
          environment: selectedCert.environment,
        });
        if (!uploadSessionId) {
          throw new Error("No se pudo crear la sesión de carga");
        }
        const bootstrapPayload: PreviewBootstrapPayload = {
          fileName: file.name,
          uploadSessionId,
          cuit: selectedCert.cuit,
          environment: selectedCert.environment,
          companyName: selectedCert.companyName ?? null,
        };
        sessionStorage.setItem(
          previewCacheKey(uploadSessionId),
          JSON.stringify(bootstrapPayload),
        );
        window.dispatchEvent(
          new CustomEvent("setSidebarCollapsed", { detail: true }),
        );
        router.push(`/facturacion/preview?uploadSessionId=${encodeURIComponent(uploadSessionId)}`);
      } catch (e: unknown) {
        const message =
          e instanceof Error ? e.message : "Error al analizar el archivo";
        setScanError(message);
        setIsScanning(false);
      }
    },
    [router, selectedCert],
  );

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    if (isScanning || !selectedCert) return;
    e.preventDefault();
    setIsDragging(true);
  };

  const buildFileFromClipboardText = useCallback((text: string) => {
    const normalized = text.trim();
    if (!normalized) return null;

    const lines = normalized.split("\n");
    if (lines.length < 2) return null;

    const hasTabs = lines[0].includes("\t");
    const hasCommas = lines[0].includes(",");
    if (!hasTabs && !hasCommas) return null;

    const csv = hasTabs
      ? lines
          .map((line) =>
            line
              .split("\t")
              .map((cell) => {
                const trimmed = cell.trim();
                return trimmed.includes(",") || trimmed.includes('"')
                  ? `"${trimmed.replace(/"/g, '""')}"`
                  : trimmed;
              })
              .join(","),
          )
          .join("\n")
      : normalized;

    const blob = new Blob([csv], { type: "text/csv" });
    return new File([blob], "pegado-desde-portapapeles.csv", {
      type: "text/csv",
    });
  }, []);

  const handlePaste = useCallback(
    (e: ClipboardEvent) => {
      if (!selectedCert || isScanning) return;
      const target = e.target;
      if (
        target instanceof HTMLElement &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable)
      ) {
        return;
      }

      const text = e.clipboardData?.getData("text/plain");
      if (!text) return;

      const file = buildFileFromClipboardText(text);
      if (!file) return;

      e.preventDefault();
      handleFile(file);
    },
    [buildFileFromClipboardText, handleFile, isScanning, selectedCert],
  );

  useEffect(() => {
    document.addEventListener("paste", handlePaste);
    return () => document.removeEventListener("paste", handlePaste);
  }, [handlePaste]);

  useEffect(() => {
    if (!isPasteMode || isScanning) return;
    pasteInputRef.current?.focus();
  }, [isPasteMode, isScanning]);

  const handleHideSession = async (record: UploadSessionSummary) => {
    await afipApi.hideUploadSession(record.id);
    mutateHistory();
  };

  const handleOpenSession = (record: UploadSessionSummary) => {
    if (record.status === "COMPLETED" || record.status === "FAILED") {
      router.push(`/facturacion/historial/${encodeURIComponent(record.id)}`);
    } else {
      router.push(`/facturacion/preview?uploadSessionId=${encodeURIComponent(record.id)}`);
    }
  };

  return (
    <div
      className={styles.sora}
      style={{ background: "#f4f7f9", minHeight: "100%" }}>
      <FacturacionHeader />

      <div className="px-4 py-6 space-y-6 sm:px-6 sm:py-8 sm:space-y-8 md:px-8 lg:px-10 max-w-7xl mx-auto">
        {certsLoading ? (
          <FacturacionContentSkeleton />
        ) : !hasActiveCerts ? (
          <NoCertificatesState />
        ) : (
          <>
            <CertificateStep
              certs={activeCerts}
              selectedCert={selectedCert}
              onSelectCert={setSelectedCert}
            />

            <UploadStep
              selectedCert={selectedCert}
              isDragging={isDragging}
              isScanning={isScanning}
              isPasteMode={isPasteMode}
              scanError={scanError}
              pasteInputRef={pasteInputRef}
              fileInputRef={fileInputRef}
              onDragOver={handleDragOver}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              onClickZone={() => {
                if (!isScanning && selectedCert && !isPasteMode) {
                  fileInputRef.current?.click();
                }
              }}
              onEnterPasteMode={() => {
                if (!isScanning && selectedCert) {
                  setIsPasteMode(true);
                }
              }}
              onExitPasteMode={() => setIsPasteMode(false)}
              onFileSelect={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFile(file);
                e.target.value = "";
              }}
              onPasteIntoInput={(e) => {
                if (isScanning || !selectedCert) return;

                const text = e.clipboardData.getData("text/plain");
                const file = buildFileFromClipboardText(text);
                if (!file) return;

                e.preventDefault();
                e.stopPropagation();
                handleFile(file);
              }}
            />

            <HistorySection
              history={history}
              historyLoading={historyLoading}
              onOpenSession={handleOpenSession}
              onHideSession={handleHideSession}
            />
          </>
        )}
      </div>
    </div>
  );
}
