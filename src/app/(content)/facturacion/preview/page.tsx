"use client";

import { useEffect, useState, useCallback, useRef, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  FileSpreadsheet,
  Zap,
  AlertTriangle,
  Trash2,
  Loader2,
  Maximize2,
  ChevronDown,
  MapPin,
} from "lucide-react";
import { afipApi } from "@/services/afip";
import type { UploadSessionDetail } from "@/services/afip";
import type { UpdatedInvoicePayload } from "@/services/afip";
import { invalidateUploadHistory } from "@/hooks/useAfipData";
import { FacturacionPreviewSkeleton } from "@/components/facturacion/FacturacionSkeleton";
import { PreviewTable } from "@/components/facturacion/preview/PreviewTable";
import { ProgressBanner } from "@/components/facturacion/preview/ProgressBanner";
import { ResultBanner } from "@/components/facturacion/preview/ResultBanner";
import { GenerateErrorBanner } from "@/components/facturacion/preview/GenerateErrorBanner";
import { FullscreenOverlay } from "@/components/facturacion/preview/FullscreenOverlay";
import { FloatingSaveBar } from "@/components/facturacion/preview/FloatingSaveBar";
import { InvoiceDetailPanel } from "@/components/facturacion/preview/InvoiceDetailPanel";
import { ConfirmModal } from "@/components/facturacion/preview/ConfirmModal";
import { parseDecimalValue } from "@/components/facturacion/preview/tableUtils";
import { useNavigationGuard } from "@/components/providers/NavigationGuardProvider";
import { PageHeader } from "@/components/ui/PageHeader";
import { renderErrorText } from "./renderErrorText";
import type { InvoiceRow } from "./constants";
import { EXPECTED_COLS, SERVICE_DATE_COLS } from "./constants";

/* ── Helpers ────────────────────────────────────────────────── */

export interface ValidationIssue {
  field: string | null;
  code: string;
  message: string;
  severity: "error" | "warning";
}

export interface RowValidation {
  issues: ValidationIssue[];
  hasErrors: boolean;
  autoFilledFields: string[];
}

interface InvoiceRowExtras {
  domicilioReceptor?: string | null;
  razonSocial?: string | null;
  descripcion?: string | null;
  fchServDesde?: string | null;
  fchServHasta?: string | null;
  fchVtoPago?: string | null;
}

interface PreviewBootstrapPayload {
  fileName: string;
  uploadSessionId: string;
  cuit: string;
  environment: "DEV" | "PROD";
  companyName: string | null;
}

interface VisibleValidationRow {
  id: string;
  rowNumber: number;
  hasErrors: boolean;
  issues: ValidationIssue[];
}

interface GroupedValidationIssue {
  severity: "error" | "warning";
  code: string;
  message: string;
  rowNumbers: number[];
}

function formatRowRange(rowNumbers: number[]): string {
  if (rowNumbers.length === 0) return "";

  const ranges: string[] = [];
  let start = rowNumbers[0];
  let end = rowNumbers[0];

  for (let i = 1; i < rowNumbers.length; i++) {
    const current = rowNumbers[i];
    if (current === end + 1) {
      end = current;
      continue;
    }
    ranges.push(start === end ? `${start}` : `${start}-${end}`);
    start = current;
    end = current;
  }

  ranges.push(start === end ? `${start}` : `${start}-${end}`);
  return ranges.join(", ");
}

function formatRowSummary(rowNumbers: number[]): string {
  const label = rowNumbers.length === 1 ? "Fila" : "Filas";
  return `${label}: ${formatRowRange(rowNumbers)}`;
}

function filterRetryRows(
  data: InvoiceRow[],
  detail?: UploadSessionDetail,
  retryFailedOnly?: boolean,
) {
  if (!detail) return data;

  const hasSuccessfulInvoices = detail.invoices.some(
    (invoice) => invoice.status === "SUCCESS",
  );
  const hasRemainingInvoices = detail.invoices.some(
    (invoice) => invoice.status !== "SUCCESS",
  );

  if (!retryFailedOnly && (!hasSuccessfulInvoices || !hasRemainingInvoices)) {
    return data;
  }

  const retryIds = new Set(
    detail.invoices
      .filter((invoice) => invoice.status !== "SUCCESS")
      .map((invoice) => invoice.id),
  );

  return data.filter((row) => retryIds.has(String(row._id ?? "")));
}

const previewCacheKey = (uploadSessionId: string) =>
  `facturacion-preview:${uploadSessionId}`;

function mapUploadInvoices(detail: UploadSessionDetail): InvoiceRow[] {
  return detail.invoices.map((inv) => {
    const extra = inv as typeof inv &
      InvoiceRowExtras & { condicionIvaReceptorId?: number | null };
    return {
      _id: inv.id,
      cbteTipo: inv.cbteTipo,
      concepto: inv.concepto,
      docTipo: inv.docTipo,
      docNro: inv.docNro,
      domicilioReceptor: extra.domicilioReceptor ?? null,
      condicionIvaReceptorId: extra.condicionIvaReceptorId ?? 1,
      razonSocial: extra.razonSocial ?? null,
      impNeto: inv.impNeto,
      alicuotaIva: 21,
      impIva: inv.impIva,
      impOpEx: inv.impOpEx,
      impTotal: inv.impTotal,
      cbteFch: inv.cbteFch,
      fchServDesde: extra.fchServDesde ?? null,
      fchServHasta: extra.fchServHasta ?? null,
      fchVtoPago: extra.fchVtoPago ?? null,
    };
  });
}

function mapUpdatedInvoices(
  updatedInvoices: UpdatedInvoicePayload[],
): InvoiceRow[] {
  return updatedInvoices.map((inv) => ({
    _id: inv.id,
    cbteTipo: inv.cbteTipo,
    concepto: inv.concepto,
    docTipo: inv.docTipo,
    docNro: inv.docNro,
    domicilioReceptor: inv.domicilioReceptor ?? null,
    condicionIvaReceptorId: inv.condicionIvaReceptorId ?? 1,
    razonSocial: inv.razonSocial ?? null,
    descripcion: inv.descripcion ?? null,
    impNeto: inv.impNeto,
    alicuotaIva: 21,
    impIva: inv.impIva,
    impOpEx: inv.impOpEx,
    impTotal: inv.impTotal,
    cbteFch: inv.cbteFch,
    fchServDesde: inv.fchServDesde ?? null,
    fchServHasta: inv.fchServHasta ?? null,
    fchVtoPago: inv.fchVtoPago ?? null,
  }));
}

function getVisibleValidationRows(
  rows: InvoiceRow[],
  validationMap: Map<string, RowValidation>,
): VisibleValidationRow[] {
  return rows
    .map((row, index) => {
      const id = String(row._id ?? "");
      const validation = validationMap.get(id);
      if (!validation || validation.issues.length === 0) return null;
      return {
        id,
        rowNumber: index + 1,
        hasErrors: validation.hasErrors,
        issues: validation.issues,
      };
    })
    .filter((row): row is VisibleValidationRow => row !== null);
}

function groupValidationIssues(
  rows: VisibleValidationRow[],
  severity: "error" | "warning",
): GroupedValidationIssue[] {
  const grouped = new Map<string, GroupedValidationIssue>();

  for (const row of rows) {
    for (const issue of row.issues) {
      if (issue.severity !== severity) continue;
      const key = `${issue.code}::${issue.message}`;
      const existing = grouped.get(key);

      if (existing) {
        existing.rowNumbers.push(row.rowNumber);
        continue;
      }

      grouped.set(key, {
        severity,
        code: issue.code,
        message: issue.message,
        rowNumbers: [row.rowNumber],
      });
    }
  }

  return Array.from(grouped.values()).map((issue) => ({
    ...issue,
    rowNumbers: [...new Set(issue.rowNumbers)].sort((a, b) => a - b),
  }));
}

function deriveColumns(data: InvoiceRow[]) {
  if (data.length === 0) return [];
  const dataKeys = Object.keys(data[0]);
  const ordered = EXPECTED_COLS.filter((c) => dataKeys.includes(c));
  const extra = dataKeys.filter(
    (k) => !EXPECTED_COLS.includes(k) && k !== "ptoVta" && k !== "_id",
  );
  return [...ordered, ...extra];
}

function countEditedCellsInRow(
  originalRow: InvoiceRow | undefined,
  nextRow: InvoiceRow,
): number {
  if (!originalRow) return 0;

  return Object.keys(nextRow).reduce((count, key) => {
    if (key === "_id") return count;
    return String(nextRow[key] ?? "") !== String(originalRow[key] ?? "")
      ? count + 1
      : count;
  }, 0);
}

function normalizeDateDigits(
  value: string | number | null | undefined,
): string | null {
  if (value == null || value === "") return null;
  const digits = String(value).replace(/\D/g, "");
  return /^\d{8}$/.test(digits) ? digits : null;
}

function isServiceConcept(value: string | number | null | undefined): boolean {
  const concepto = Number(value);
  return concepto === 2 || concepto === 3;
}

function getPreviousMonthServiceRange(
  cbteFch: string | number | null | undefined,
): { from: string | null; to: string | null } {
  const normalized = normalizeDateDigits(cbteFch);
  if (!normalized) return { from: null, to: null };

  const year = Number(normalized.slice(0, 4));
  const month = Number(normalized.slice(4, 6)) - 1;
  const previousMonthDate = new Date(year, month - 1, 1);
  const previousYear = previousMonthDate.getFullYear();
  const previousMonth = previousMonthDate.getMonth();
  const lastDay = new Date(previousYear, previousMonth + 1, 0).getDate();
  const mm = String(previousMonth + 1).padStart(2, "0");

  return {
    from: `${previousYear}${mm}01`,
    to: `${previousYear}${mm}${String(lastDay).padStart(2, "0")}`,
  };
}

function applyIvaCalc(
  row: InvoiceRow,
  changedCol: string,
  newValue: string | number,
): InvoiceRow {
  const next = { ...row, [changedCol]: newValue };
  if (
    changedCol !== "impNeto" &&
    changedCol !== "alicuotaIva" &&
    changedCol !== "impOpEx"
  ) {
    return next;
  }
  const impNeto = parseDecimalValue(next.impNeto) ?? 0;
  const alicuota = parseDecimalValue(next.alicuotaIva) ?? 21;
  const impOpEx = parseDecimalValue(next.impOpEx) ?? 0;
  const impIva = Math.round(impNeto * alicuota) / 100;
  const impTotal = Math.round((impNeto + impIva + impOpEx) * 100) / 100;
  return { ...next, impIva, impTotal };
}

function applyConceptRules(
  row: InvoiceRow,
  nextConcepto: string | number | null | undefined,
): InvoiceRow {
  if (!isServiceConcept(nextConcepto)) {
    return {
      ...row,
      concepto: nextConcepto ?? row.concepto,
      fchServDesde: null,
      fchServHasta: null,
      fchVtoPago: null,
    };
  }

  const range = getPreviousMonthServiceRange(row.cbteFch);

  return {
    ...row,
    concepto: nextConcepto ?? row.concepto,
    fchServDesde: range.from,
    fchServHasta: range.to,
  };
}

/* ── Page ────────────────────────────────────────────────────── */
export default function FacturacionPreview() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const retryFailedOnly = searchParams.get("retryFailedOnly") === "1";
  const descripcionRef = useRef<HTMLInputElement | null>(null);
  const [fileName, setFileName] = useState("");
  const [rows, setRows] = useState<InvoiceRow[]>([]);
  const [validationMap, setValidationMap] = useState<
    Map<string, RowValidation>
  >(new Map());
  const originalRowsRef = useRef<InvoiceRow[]>([]);
  const [columns, setColumns] = useState<string[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [uploadSessionId, setUploadSessionId] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [processedCount, setProcessedCount] = useState(0);
  const [generateResult, setGenerateResult] = useState<{
    caeGenerados: number;
    errores: number;
    failedInvoiceError: string | null;
  } | null>(null);
  const [generateError, setGenerateError] = useState<string | null>(null);

  // Config state
  const [cuit, setCuit] = useState("");
  const [environment, setEnvironment] = useState<"DEV" | "PROD">("DEV");
  const [certCompany, setCertCompany] = useState("");
  const [ptoVta, setPtoVta] = useState<number | null>(null);
  const [descripcion, setDescripcion] = useState("");
  const [descripcionError, setDescripcionError] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [detailRowIdx, setDetailRowIdx] = useState<number | null>(null);

  // Deletion / edit tracking
  const [deletedIds, setDeletedIds] = useState<string[]>([]);
  const [restoredIds, setRestoredIds] = useState<Set<string>>(new Set());
  const [editedCount, setEditedCount] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const [showSaveConfirm, setShowSaveConfirm] = useState(false);
  const [showLeaveConfirm, setShowLeaveConfirm] = useState(false);
  const [showGenerateConfirm, setShowGenerateConfirm] = useState(false);
  const [pendingNavigation, setPendingNavigation] = useState<string | null>(
    null,
  );
  const hasUnsavedChanges = deletedIds.length > 0 || editedCount > 0;
  // Ref updated imperatively in callbacks so guardedNavigate always sees latest value,
  // even when React batches blur + click before rendering.
  const dirtyRef = useRef(false);
  const deletedIdsRef = useRef<string[]>([]);
  const editedCountRef = useRef(0);
  const originalRowsByIdRef = useRef<Map<string, InvoiceRow>>(new Map());
  const rowsRef = useRef<InvoiceRow[]>([]);

  const setOriginalRows = useCallback((nextRows: InvoiceRow[]) => {
    originalRowsRef.current = nextRows;
    originalRowsByIdRef.current = new Map(
      nextRows.map((row) => [String(row._id ?? ""), row]),
    );
  }, []);

  const syncEditedCount = useCallback((nextCount: number) => {
    editedCountRef.current = nextCount;
    setEditedCount(nextCount);
    dirtyRef.current = deletedIdsRef.current.length > 0 || nextCount > 0;
  }, []);

  useEffect(() => {
    deletedIdsRef.current = deletedIds;
  }, [deletedIds]);

  useEffect(() => {
    rowsRef.current = rows;
  }, [rows]);

  // Register navigation guard so Sidebar/Navbar links trigger the leave modal
  const { registerGuard } = useNavigationGuard();
  useEffect(() => {
    return registerGuard({
      isDirty: () => dirtyRef.current,
      onBlock: (href) => {
        setPendingNavigation(href);
        setShowLeaveConfirm(true);
      },
    });
  }, [registerGuard]);

  const [isCheckingStatus, setIsCheckingStatus] = useState(false);
  const [isResolvingAddresses, setIsResolvingAddresses] = useState(false);
  const generatingSessionRef = useRef<string | null>(null);
  const autoResolveAddressesTriggeredRef = useRef(false);

  /* ── Manual status check ──────────────────────────────────── */
  const checkStatus = useCallback(async () => {
    const sessionId = generatingSessionRef.current;
    if (!sessionId || isCheckingStatus) return;
    setIsCheckingStatus(true);
    try {
      const detail = await afipApi.pollSessionStatus(sessionId);
      setProcessedCount(detail.processedCount ?? 0);
      if (detail.status === "COMPLETED" || detail.status === "FAILED") {
        setIsGenerating(false);
        generatingSessionRef.current = null;
        invalidateUploadHistory();
        router.push(`/facturacion/historial/${sessionId}`);
      }
    } catch {
      // non-critical
    } finally {
      setIsCheckingStatus(false);
    }
  }, [isCheckingStatus, router]);

  /* ── Data loading ─────────────────────────────────────────── */
  const historyId = searchParams.get("uploadSessionId");

  // Helper to hydrate local state from an UploadSessionDetail
  const hydrateFromDetail = useCallback(
    (detail: UploadSessionDetail) => {
      const data = mapUploadInvoices(detail);
      const visibleRows = filterRetryRows(data, detail, retryFailedOnly);
      setOriginalRows(visibleRows);
      setFileName(detail.fileName);
      setUploadSessionId(detail.id);
      setRows(visibleRows);
      setCuit(detail.cuit ?? "");
      setEnvironment(detail.environment);
      setCertCompany(detail.companyName ?? "");
      setColumns(deriveColumns(visibleRows));
      setLoaded(true);

      // Build validation map from stored JSON strings on each invoice
      const vmap = new Map<string, RowValidation>();
      for (const inv of detail.invoices) {
        let issues: ValidationIssue[] = [];
        let autoFilled: string[] = [];
        try {
          if (inv.validationIssues) issues = JSON.parse(inv.validationIssues);
        } catch {
          /* ignore */
        }
        try {
          if (inv.autoFilledFields)
            autoFilled = JSON.parse(inv.autoFilledFields);
        } catch {
          /* ignore */
        }
        vmap.set(inv.id, {
          issues,
          hasErrors: issues.some((i) => i.severity === "error"),
          autoFilledFields: autoFilled,
        });
      }
      setValidationMap(vmap);

      if (detail.status === "GENERATING") {
        setIsGenerating(true);
        setProcessedCount(detail.processedCount ?? 0);
        generatingSessionRef.current = detail.id;
      } else if (detail.status === "COMPLETED" || detail.status === "FAILED") {
        const failedInv = detail.invoices.find((inv) => inv.status === "ERROR");
        setGenerateResult({
          caeGenerados: detail.caeGenerados,
          errores: detail.errores,
          failedInvoiceError: failedInv?.errorDetail ?? null,
        });
      }
    },
    [retryFailedOnly, setOriginalRows],
  );

  const applySavedInvoices = useCallback(
    (updatedInvoices: UpdatedInvoicePayload[]) => {
      if (updatedInvoices.length === 0) return;

      const updatedRowsById = new Map(
        mapUpdatedInvoices(updatedInvoices).map((row) => [
          String(row._id ?? ""),
          row,
        ]),
      );

      const nextRows = rowsRef.current.map((row) => {
        const id = String(row._id ?? "");
        return updatedRowsById.get(id) ?? row;
      });

      setRows(nextRows);
      setOriginalRows(nextRows);
      setColumns(deriveColumns(nextRows));

      const nextValidationMap = new Map(validationMap);
      for (const invoice of updatedInvoices) {
        let issues: ValidationIssue[] = [];
        let autoFilled: string[] = [];
        try {
          if (invoice.validationIssues)
            issues = JSON.parse(invoice.validationIssues);
        } catch {
          /* ignore */
        }
        try {
          if (invoice.autoFilledFields) {
            autoFilled = JSON.parse(invoice.autoFilledFields);
          }
        } catch {
          /* ignore */
        }
        nextValidationMap.set(invoice.id, {
          issues,
          hasErrors: issues.some((issue) => issue.severity === "error"),
          autoFilledFields: autoFilled,
        });
      }
      setValidationMap(nextValidationMap);
    },
    [setOriginalRows, validationMap],
  );

  const hydrateFromBootstrap = useCallback(
    (bootstrap: PreviewBootstrapPayload) => {
      setFileName(bootstrap.fileName);
      setUploadSessionId(bootstrap.uploadSessionId);
      setCuit(bootstrap.cuit);
      setEnvironment(bootstrap.environment);
      setCertCompany(bootstrap.companyName ?? "");
    },
    [],
  );

  /* ── Resolve missing addresses ────────────────────────────── */
  const handleResolveAddresses = useCallback(async () => {
    if (!uploadSessionId || isResolvingAddresses) return;
    setIsResolvingAddresses(true);
    try {
      const result = await afipApi.resolveAddresses(uploadSessionId);
      const detail = await afipApi.getUploadDetail(uploadSessionId);
      hydrateFromDetail(detail);
      if (result.resolved === 0) {
        const diagnostics = [
          result.attempted != null
            ? `CUITs consultados: ${result.attempted}.`
            : null,
          result.failed != null
            ? `Consultas fallidas: ${result.failed}.`
            : null,
          result.sampleErrors?.[0]
            ? `Primer error: ${result.sampleErrors[0]}`
            : null,
        ]
          .filter(Boolean)
          .join(" ");
        setGenerateError(
          diagnostics ||
            "No se pudo resolver ninguna dirección fiscal con ARCA para esta carga.",
        );
      }
    } catch (e: unknown) {
      const message =
        e instanceof Error
          ? e.message
          : "Error al resolver direcciones fiscales";
      setGenerateError(message);
    } finally {
      setIsResolvingAddresses(false);
    }
  }, [uploadSessionId, isResolvingAddresses, hydrateFromDetail]);

  // Fetch from API on mount — single source of truth
  useEffect(() => {
    if (!historyId) {
      router.replace("/facturacion");
      return;
    }
    const bootstrapRaw = sessionStorage.getItem(previewCacheKey(historyId));
    if (bootstrapRaw) {
      try {
        const bootstrap = JSON.parse(bootstrapRaw) as PreviewBootstrapPayload;
        if (bootstrap.uploadSessionId === historyId) {
          hydrateFromBootstrap(bootstrap);
        }
      } catch {
        sessionStorage.removeItem(previewCacheKey(historyId));
      }
    }
    afipApi
      .getUploadDetail(historyId)
      .then((detail) => {
        hydrateFromDetail(detail);
        sessionStorage.removeItem(previewCacheKey(historyId));
      })
      .catch((e: unknown) => {
        const msg =
          e instanceof Error
            ? e.message
            : "No pudimos encontrar la carga solicitada.";
        setLoadError(msg);
        setLoaded(true);
      });
  }, [historyId, router, hydrateFromBootstrap, hydrateFromDetail]);

  // Set default ptoVta for DEV
  useEffect(() => {
    if (environment === "DEV") setPtoVta(1);
    else setPtoVta(null);
  }, [environment]);

  // Close fullscreen on Esc
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape" && fullscreen) setFullscreen(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [fullscreen]);

  useEffect(() => {
    if (!fullscreen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [fullscreen]);

  // Browser beforeunload guard — warn on reload/close when there are unsaved edits or deletions
  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      if (dirtyRef.current) {
        e.preventDefault();
      }
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, []);

  /* ── Table callbacks ──────────────────────────────────────── */
  const handleCellEdit = useCallback(
    (rowIdx: number, col: string, value: string | number) => {
      // Set ref BEFORE setRows so guardedNavigate sees it immediately,
      // even when React 18 batches blur + click in the same tick.
      dirtyRef.current = true;
      const currentRows = rowsRef.current;
      const currentRow = currentRows[rowIdx];
      if (!currentRow) return;

      let nextRow: InvoiceRow;
      if (col === "concepto") {
        nextRow = applyConceptRules(currentRow, value);
      } else if (
        SERVICE_DATE_COLS.has(col) &&
        !isServiceConcept(currentRow.concepto)
      ) {
        return;
      } else {
        nextRow = applyIvaCalc(currentRow, col, value);
      }

      const originalRow = originalRowsByIdRef.current.get(
        String(currentRow._id ?? ""),
      );
      const prevCount = countEditedCellsInRow(originalRow, currentRow);
      const nextCount = countEditedCellsInRow(originalRow, nextRow);
      syncEditedCount(editedCountRef.current - prevCount + nextCount);

      const nextRows = [...currentRows];
      nextRows[rowIdx] = nextRow;
      rowsRef.current = nextRows;
      setRows(nextRows);
    },
    [syncEditedCount],
  );

  const handleBulkEdit = useCallback(
    (col: string, value: string | number) => {
      dirtyRef.current = true;
      const currentRows = rowsRef.current;
      let nextEditedCount = editedCountRef.current;
      const nextRows = currentRows.map((row) => {
        const originalRow = originalRowsByIdRef.current.get(
          String(row._id ?? ""),
        );
        const prevCount = countEditedCellsInRow(originalRow, row);

        let nextRow: InvoiceRow;
        if (col === "concepto") {
          nextRow = applyConceptRules(row, value);
        } else if (
          SERVICE_DATE_COLS.has(col) &&
          !isServiceConcept(row.concepto)
        ) {
          nextRow = row;
        } else {
          nextRow = applyIvaCalc(row, col, value);
        }

        const nextCount = countEditedCellsInRow(originalRow, nextRow);
        nextEditedCount += nextCount - prevCount;
        return nextRow;
      });
      syncEditedCount(nextEditedCount);
      rowsRef.current = nextRows;
      setRows(nextRows);
    },
    [syncEditedCount],
  );

  const handleDeleteRow = useCallback(
    (idx: number) => {
      const currentRows = rowsRef.current;
      const row = currentRows[idx];
      const rowId = row?._id;
      if (rowId && typeof rowId === "string") {
        setDeletedIds((prev) => [...prev, rowId]);
      }
      const originalRow = originalRowsByIdRef.current.get(
        String(row?._id ?? ""),
      );
      if (row) {
        syncEditedCount(
          Math.max(
            0,
            editedCountRef.current - countEditedCellsInRow(originalRow, row),
          ),
        );
      }
      dirtyRef.current = true;
      const nextRows = currentRows.filter((_, i) => i !== idx);
      rowsRef.current = nextRows;
      setRows(nextRows);
    },
    [syncEditedCount],
  );

  const buildEditedPayload = useCallback(
    (baselineRows: InvoiceRow[], nextRows: InvoiceRow[]) => {
      const baselineById = new Map(
        baselineRows.map((row) => [String(row._id ?? ""), row]),
      );

      const payload: Array<{ id: string; [k: string]: unknown }> = [];

      for (const row of nextRows) {
        const id = String(row._id);
        const baselineRow = baselineById.get(id);
        if (!baselineRow) continue;

        const changed = EXPECTED_COLS.some(
          (key) => String(row[key] ?? "") !== String(baselineRow[key] ?? ""),
        );
        if (!changed) continue;

        const entry: { id: string; [k: string]: unknown } = { id };
        for (const key of EXPECTED_COLS) {
          entry[key] = row[key] ?? null;
        }
        payload.push(entry);
      }

      return payload;
    },
    [],
  );

  /* ── Save / navigate ──────────────────────────────────────── */
  const handleSaveDeletions = async () => {
    if (!uploadSessionId || deletedIds.length === 0) return;
    setIsSaving(true);
    try {
      await afipApi.deleteInvoices(uploadSessionId, deletedIds);
      setDeletedIds([]);
      dirtyRef.current = editedCount > 0;
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : "Error al guardar";
      setGenerateError(message);
    } finally {
      setIsSaving(false);
      setShowSaveConfirm(false);
    }
  };

  const handleSaveEdits = useCallback(async () => {
    if (!uploadSessionId) return;
    const payload = buildEditedPayload(originalRowsRef.current, rows);

    if (payload.length === 0) {
      setOriginalRows([...rows]);
      syncEditedCount(0);
      return;
    }

    setIsSaving(true);

    try {
      const result = await afipApi.updateInvoices(uploadSessionId, payload);
      applySavedInvoices(result.invoices);
      syncEditedCount(0);
    } catch (e: unknown) {
      const message =
        e instanceof Error ? e.message : "Error al guardar cambios";
      setGenerateError(message);
    } finally {
      setIsSaving(false);
    }
  }, [
    applySavedInvoices,
    buildEditedPayload,
    rows,
    setOriginalRows,
    syncEditedCount,
    uploadSessionId,
  ]);

  const handleSaveBarSave = async () => {
    if (deletedIds.length > 0 && editedCount > 0) {
      // Both edits and deletions — save edits first, then confirm deletions
      await handleSaveEdits();
      setShowSaveConfirm(true);
    } else if (deletedIds.length > 0) {
      setShowSaveConfirm(true);
    } else {
      await handleSaveEdits();
    }
  };

  const handleUndo = () => {
    const orig = originalRowsRef.current;
    // Track which rows are being restored so we can flash them
    if (deletedIds.length > 0) {
      const ids = new Set(deletedIds);
      setRestoredIds(ids);
      setTimeout(() => setRestoredIds(new Set()), 1200);
    }
    setRows(orig);
    setColumns(deriveColumns(orig));
    setDeletedIds([]);
    syncEditedCount(0);
  };

  const guardedNavigate = useCallback(
    (href: string) => {
      if (dirtyRef.current) {
        setPendingNavigation(href);
        setShowLeaveConfirm(true);
      } else {
        router.push(href);
      }
    },
    [router],
  );

  const confirmLeave = () => {
    setShowLeaveConfirm(false);
    setDeletedIds([]);
    setEditedCount(0);
    dirtyRef.current = false;
    if (pendingNavigation) {
      router.push(pendingNavigation);
      setPendingNavigation(null);
    }
  };

  /* ── Generation ───────────────────────────────────────────── */
  const hasFailed = !!generateResult && generateResult.errores > 0;
  const canGenerate =
    cuit.replace(/[-\s.]/g, "").length === 11 &&
    ptoVta !== null &&
    !!descripcion.trim() &&
    !isGenerating &&
    (!generateResult || hasFailed);

  const handleGenerar = async () => {
    if (!uploadSessionId || !canGenerate || ptoVta === null) return;

    if (!descripcion.trim()) {
      setDescripcionError(true);
      descripcionRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
      descripcionRef.current?.focus();
      return;
    }

    const cleanCuit = cuit.replace(/[-\s.]/g, "");
    setIsGenerating(true);
    setGenerateError(null);
    setGenerateResult(null);
    setProcessedCount(0);

    try {
      await afipApi.startGeneration(
        uploadSessionId,
        cleanCuit,
        environment,
        ptoVta,
      );
      generatingSessionRef.current = uploadSessionId;
    } catch (e: unknown) {
      const err = e as Error & { preflightFailed?: boolean };
      const message = err.message ?? "Error al iniciar la generación";
      setGenerateError(message);
      setIsGenerating(false);
    }
  };

  const handleRetry = async () => {
    if (!uploadSessionId || !canGenerate || ptoVta === null) return;

    setGenerateError(null);
    setGenerateResult(null);
    setProcessedCount(0);

    try {
      await afipApi.retrySession(uploadSessionId);
      invalidateUploadHistory();
      router.push(
        `/facturacion/preview?uploadSessionId=${uploadSessionId}&retryFailedOnly=1`,
      );
    } catch (e: unknown) {
      const message =
        e instanceof Error ? e.message : "Error al reintentar la generación";
      setGenerateError(message);
    }
  };

  const hasServiceRows = rows.some((r) => r.concepto === 2 || r.concepto === 3);

  // Augment stored validation with date-sensitive checks that must run fresh
  // every render (e.g. fchVtoPago in the past — validity changes over time).
  const liveValidationMap = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const map = new Map<string, RowValidation>();
    for (const row of rows) {
      const raw = validationMap.get(String(row._id ?? "")) ?? {
        issues: [],
        hasErrors: false,
        autoFilledFields: [],
      };
      const stored = {
        ...raw,
        issues: Array.isArray(raw.issues) ? raw.issues : [],
      };
      const extra: ValidationIssue[] = [];
      const vtoPagoStr = row.fchVtoPago != null ? String(row.fchVtoPago) : null;
      if (
        (row.concepto === 2 || row.concepto === 3) &&
        vtoPagoStr &&
        /^\d{8}$/.test(vtoPagoStr)
      ) {
        const vto = new Date(
          Number(vtoPagoStr.slice(0, 4)),
          Number(vtoPagoStr.slice(4, 6)) - 1,
          Number(vtoPagoStr.slice(6, 8)),
        );
        if (vto < today) {
          extra.push({
            field: "fchVtoPago",
            code: "VTO_PAGO_BEFORE_CBTE_FCH",
            message:
              "La fecha de vto. de pago no puede ser anterior a hoy — ARCA rechaza fechas pasadas en comprobantes de servicio",
            severity: "error",
          });
        }
      }
      const issues = [
        ...stored.issues.filter((i) => i.code !== "VTO_PAGO_BEFORE_CBTE_FCH"),
        ...extra,
      ];
      map.set(String(row._id ?? ""), {
        issues,
        hasErrors: issues.some((i) => i.severity === "error"),
        autoFilledFields: stored.autoFilledFields,
      });
    }
    return map;
  }, [rows, validationMap]);

  const visibleValidationRows = useMemo(
    () => getVisibleValidationRows(rows, liveValidationMap),
    [rows, liveValidationMap],
  );
  const rowTones = useMemo(
    () =>
      new Map<string, "error" | "warning">(
        visibleValidationRows.map((row) => [
          row.id,
          row.hasErrors ? "error" : "warning",
        ]),
      ),
    [visibleValidationRows],
  );

  // Validation summary counts derived from validationMap (only for currently visible rows)
  const errorCount = visibleValidationRows.filter(
    (row) => row.hasErrors,
  ).length;
  const warnCount = visibleValidationRows.length - errorCount;

  useEffect(() => {
    autoResolveAddressesTriggeredRef.current = false;
  }, [uploadSessionId]);

  useEffect(() => {
    const hasPendingAddressWarning = visibleValidationRows.some((row) =>
      row.issues.some(
        (issue) => issue.code === "RECEPTOR_FISCAL_ADDRESS_REQUIRED",
      ),
    );

    if (
      !uploadSessionId ||
      !loaded ||
      !hasPendingAddressWarning ||
      isResolvingAddresses ||
      autoResolveAddressesTriggeredRef.current
    ) {
      return;
    }

    autoResolveAddressesTriggeredRef.current = true;
    void handleResolveAddresses();
  }, [
    uploadSessionId,
    loaded,
    visibleValidationRows,
    isResolvingAddresses,
    handleResolveAddresses,
  ]);

  /* ── Render ───────────────────────────────────────────────── */
  return (
    <>
      <style>{`
        .fc-condensed { font-family: var(--font-condensed), ui-sans-serif, system-ui, sans-serif; }
        .fc-sora      { font-family: var(--font-sora), ui-sans-serif, system-ui, sans-serif; }
        @keyframes fcFadeUp {
          from { opacity:0; transform:translateY(12px); }
          to   { opacity:1; transform:translateY(0); }
        }
        .fc-anim { opacity:0; animation: fcFadeUp .5s ease forwards; }
        .fc-a1 { animation-delay:.05s; }
      `}</style>

      {!loaded ? (
        <div className="px-6 md:px-10 py-6 max-w-7xl mx-auto">
          <FacturacionPreviewSkeleton />
        </div>
      ) : loadError ? (
        <LoadError
          error={loadError}
          onBack={() => router.push("/facturacion")}
        />
      ) : rows.length === 0 ? (
        <EmptyState onBack={() => router.push("/facturacion")} />
      ) : (
        <div
          className="fc-sora"
          style={{ background: "#f4f7f9", minHeight: "100%" }}>
          {/* Header */}
          <div className="bg-white border-b border-gray-100 pt-8 pb-6">
            <div className="max-w-7xl mx-auto px-6 md:px-10">
              <PageHeader
                className="fc-anim fc-a1"
                backHref="/facturacion"
                backLabel="Facturación"
                eyebrow="WSFEv1 · ARCA"
                icon={FileSpreadsheet}
                title="Revisar y Generar"
                meta={
                  <div className="flex flex-wrap items-center gap-3">
                    <div className="flex items-center gap-1.5">
                      <FileSpreadsheet className="h-4 w-4 text-green-500" />
                      <span className="text-sm font-medium text-gray-500">
                        {fileName}
                      </span>
                    </div>
                    <span className="text-gray-300">|</span>
                    <span className="text-sm text-gray-400">
                      {rows.length} {rows.length === 1 ? "fila" : "filas"}
                    </span>
                  </div>
                }
              />
            </div>
          </div>

          {/* Table */}
          <div className="px-6 md:px-10 py-8 max-w-7xl mx-auto">
            {visibleValidationRows.length > 0 && (
              <ValidationDetailsPanel
                rows={visibleValidationRows}
                failedInvoiceError={generateResult?.failedInvoiceError ?? null}
                onResolveAddresses={handleResolveAddresses}
                isResolvingAddresses={isResolvingAddresses}
              />
            )}
            <div className="fc-anim fc-a3 mt-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between text-sm text-gray-400 pb-6 pt-4 px-2">
              <span className="hidden sm:inline">
                Hacé click en cualquier celda o encabezado para editar antes de
                generar.
              </span>

              <div className="flex items-center justify-between gap-3">
                <span className="font-medium" style={{ color: "#27a0c9" }}>
                  {rows.length}{" "}
                  {rows.length === 1 ? "factura lista" : "facturas listas"}
                </span>
                <button
                  onClick={() => setFullscreen(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer hover:bg-gray-100 text-gray-500 hover:text-gray-700"
                  style={{ border: "1px solid #e2e8f0" }}>
                  <Maximize2 className="w-3.5 h-3.5" />
                  Pantalla completa
                </button>
              </div>
            </div>

            {errorCount === 0 && warnCount === 0 && rows.length > 0 && (
              <div className="flex items-center gap-2 px-4 py-3 rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-700 text-sm font-medium mb-4">
                <span>Todo listo para generar</span>
              </div>
            )}

            <div
              className="fc-anim fc-a2 bg-white rounded-2xl"
              style={{ border: "1px solid #e8ecf0" }}>
              <div className="fc-scrollbar max-h-[70vh] overflow-auto rounded-2xl">
                <PreviewTable
                  rows={rows}
                  originalRows={originalRowsRef.current}
                  columns={columns}
                  sticky
                  hasServiceRows={hasServiceRows}
                  restoredIds={restoredIds}
                  rowTones={rowTones}
                  isResolvingAddresses={isResolvingAddresses}
                  onCellEdit={handleCellEdit}
                  onBulkEdit={handleBulkEdit}
                  onDeleteRow={handleDeleteRow}
                  onRowClick={setDetailRowIdx}
                />
              </div>
            </div>
          </div>

          {/* Config panel */}
          <div className="px-6 md:px-10 pb-8 max-w-7xl mx-auto">
            <div
              className="fc-anim fc-a4 bg-white rounded-2xl p-6"
              style={{ border: "1px solid #e8ecf0" }}>
              <h3 className="fc-condensed text-lg font-bold text-gray-800 mb-4">
                Configuración de emisión
              </h3>

              <CertContextBanner
                certCompany={certCompany}
                cuit={cuit}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <PtoVentaField
                  ptoVta={ptoVta}
                  cuit={cuit}
                  environment={environment}
                  disabled={isGenerating || (!!generateResult && !hasFailed)}
                  onPtoVtaChange={setPtoVta}
                />
                <DescripcionField
                  ref={descripcionRef}
                  value={descripcion}
                  error={descripcionError}
                  disabled={isGenerating || (!!generateResult && !hasFailed)}
                  onChange={(v) => {
                    setDescripcion(v);
                    if (v.trim()) setDescripcionError(false);
                  }}
                  onFocus={() => descripcionError && setDescripcionError(false)}
                />
              </div>

              {isGenerating && (
                <ProgressBanner
                  processedCount={processedCount}
                  totalCount={rows.length}
                  onCheckStatus={checkStatus}
                  isChecking={isCheckingStatus}
                />
              )}

              {generateResult && (
                <ResultBanner
                  result={generateResult}
                  onBack={() => guardedNavigate("/facturacion")}
                />
              )}

              {generateError && (
                <GenerateErrorBanner
                  error={generateError}
                  onDismiss={() => setGenerateError(null)}
                />
              )}

              <div
                className="mt-5 rounded-2xl border px-5 py-4"
                style={{
                  borderColor: "#fdba74",
                  background:
                    "linear-gradient(135deg, rgba(255,237,213,0.95), rgba(255,247,237,0.98))",
                  boxShadow: "0 18px 40px rgba(249, 115, 22, 0.10)",
                }}>
                <div className="flex items-start gap-3">
                  <div
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl"
                    style={{ background: "rgba(249,115,22,0.14)" }}>
                    <AlertTriangle className="h-5 w-5 text-orange-600" />
                  </div>
                  <div>
                    <p className="fc-condensed text-xl font-bold uppercase tracking-wide text-orange-900">
                      Advertencia antes de emitir
                    </p>
                    <p className="mt-1 text-sm font-medium text-orange-900">
                      Vas a generar comprobantes fiscales reales con los datos
                      cargados en esta tabla.
                    </p>
                    <p className="mt-2 text-sm leading-relaxed text-orange-800">
                      Verificá CUIT, punto de venta, importes, fechas y tipo de
                      comprobante. Una vez emitido, el CAE queda generado y no
                      se puede corregir desde esta pantalla.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-5 flex flex-col items-center sm:items-end gap-1">
                <button
                  onClick={() => {
                    if (hasFailed) {
                      handleRetry();
                    } else if (environment === "PROD") {
                      setShowGenerateConfirm(true);
                    } else {
                      handleGenerar();
                    }
                  }}
                  disabled={
                    !canGenerate ||
                    (!hasFailed && errorCount > 0) ||
                    hasUnsavedChanges
                  }
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-white font-semibold text-sm transition-all hover:brightness-110 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                  style={{ background: "#27a0c9" }}>
                  {isGenerating ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Zap className="w-4 h-4" />
                  )}
                  {isGenerating
                    ? "Generando..."
                    : hasFailed
                      ? "Reintentar"
                      : generateResult
                        ? "Generación completada"
                        : `Generar CAEs (${rows.length})`}
                </button>
                {!hasFailed && errorCount > 0 && (
                  <p className="text-red-500 text-xs">
                    Corregí los {errorCount} errores antes de continuar
                  </p>
                )}
                {!descripcion.trim() && (
                  <p className="text-red-500 text-xs pt-2">
                    Completá la descripción antes de generar
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Fullscreen overlay */}
          {fullscreen && (
            <FullscreenOverlay
              fileName={fileName}
              rowCount={rows.length}
              onClose={() => setFullscreen(false)}>
              <PreviewTable
                rows={rows}
                originalRows={originalRowsRef.current}
                columns={columns}
                sticky
                hasServiceRows={hasServiceRows}
                restoredIds={restoredIds}
                rowTones={rowTones}
                onCellEdit={handleCellEdit}
                onBulkEdit={handleBulkEdit}
                onDeleteRow={handleDeleteRow}
                onRowClick={setDetailRowIdx}
              />
            </FullscreenOverlay>
          )}

          {/* Invoice detail panel */}
          {detailRowIdx !== null && rows[detailRowIdx] && (
            <InvoiceDetailPanel
              row={rows[detailRowIdx]}
              rowIndex={detailRowIdx}
              fullscreen={fullscreen}
              onFieldChange={handleCellEdit}
              onClose={() => setDetailRowIdx(null)}
            />
          )}

          {/* Floating save bar */}
          {hasUnsavedChanges && (
            <FloatingSaveBar
              deletedCount={deletedIds.length}
              editedCount={editedCount}
              isSaving={isSaving}
              onUndo={handleUndo}
              onSave={handleSaveBarSave}
            />
          )}

          {/* Generate confirmation modal (PROD only) */}
          {showGenerateConfirm && (
            <ConfirmModal
              icon={<Zap className="w-6 h-6 text-white" />}
              iconBg="#27a0c9"
              title="Generar CAEs en producción"
              description={
                <>
                  Estás por emitir{" "}
                  <span className="font-semibold text-gray-700">
                    {rows.length} {rows.length === 1 ? "factura" : "facturas"}
                  </span>{" "}
                  en el ambiente de{" "}
                  <span className="font-semibold text-gray-700">
                    producción
                  </span>{" "}
                  de ARCA. Una vez generados, los CAEs no se pueden anular desde
                  esta pantalla.
                </>
              }
              confirmLabel="Sí, generar"
              confirmingLabel="Generando..."
              confirmIcon={<Zap className="w-3.5 h-3.5" />}
              confirmStyle="text-white"
              confirmBg="#27a0c9"
              isLoading={isGenerating}
              onConfirm={() => {
                setShowGenerateConfirm(false);
                handleGenerar();
              }}
              onCancel={() => setShowGenerateConfirm(false)}
            />
          )}

          {/* Save confirmation modal */}
          {showSaveConfirm && (
            <ConfirmModal
              icon={<Trash2 className="w-6 h-6 text-red-500" />}
              iconBg="rgba(239,68,68,.1)"
              title="Confirmar eliminación"
              description={
                <>
                  Se van a eliminar permanentemente{" "}
                  <span className="font-semibold text-gray-700">
                    {deletedIds.length}{" "}
                    {deletedIds.length === 1 ? "factura" : "facturas"}
                  </span>{" "}
                  de esta carga. Esta acción no se puede deshacer.
                </>
              }
              confirmLabel="Sí, eliminar"
              confirmingLabel="Eliminando..."
              confirmIcon={<Trash2 className="w-3.5 h-3.5" />}
              confirmStyle="text-white bg-red-500 hover:bg-red-600"
              isLoading={isSaving}
              onConfirm={handleSaveDeletions}
              onCancel={() => setShowSaveConfirm(false)}
            />
          )}

          {/* Leave confirmation modal */}
          {showLeaveConfirm && (
            <ConfirmModal
              icon={<AlertTriangle className="w-6 h-6 text-amber-500" />}
              iconBg="rgba(245,158,11,.1)"
              title="Cambios sin guardar"
              description={
                <>
                  Eliminaste{" "}
                  <span className="font-semibold text-gray-700">
                    {deletedIds.length}{" "}
                    {deletedIds.length === 1 ? "factura" : "facturas"}
                  </span>{" "}
                  pero no guardaste los cambios. Si salís ahora, las
                  eliminaciones se van a perder.
                </>
              }
              confirmLabel="Salir sin guardar"
              confirmingLabel="Salir sin guardar"
              confirmIcon={null}
              confirmStyle="text-white"
              confirmBg="#27a0c9"
              onConfirm={confirmLeave}
              onCancel={() => {
                setShowLeaveConfirm(false);
                setPendingNavigation(null);
              }}
              cancelLabel="Quedarme"
            />
          )}
        </div>
      )}
    </>
  );
}

/* ── Small inline sub-components ────────────────────────────── */

function LoadError({ error, onBack }: { error: string; onBack: () => void }) {
  return (
    <div className="max-w-7xl mx-auto px-6 md:px-10 py-10">
      <div
        className="bg-white rounded-2xl border p-10 text-center"
        style={{ borderColor: "#fecaca" }}>
        <AlertTriangle className="w-10 h-10 mx-auto mb-4 text-red-500" />
        <h2 className="fc-condensed text-3xl font-bold text-gray-900 mb-2">
          No encontramos esta carga
        </h2>
        <p className="text-sm text-gray-500 max-w-md mx-auto mb-6">{error}</p>
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white cursor-pointer"
          style={{ background: "#27a0c9" }}>
          <ArrowLeft className="w-4 h-4" />
          Volver
        </button>
      </div>
    </div>
  );
}

function EmptyState({ onBack }: { onBack: () => void }) {
  return (
    <div className="fc-sora p-10 text-center">
      <AlertTriangle className="w-10 h-10 mx-auto mb-3 text-amber-400" />
      <p className="text-gray-500 mb-4">
        No se encontraron filas en el archivo.
      </p>
      <button
        onClick={onBack}
        className="text-sm font-medium px-4 py-2 rounded-lg"
        style={{ background: "rgba(39,160,201,.1)", color: "#1e7a9c" }}>
        Volver
      </button>
    </div>
  );
}

function CertContextBanner({
  certCompany,
  cuit,
}: {
  certCompany: string;
  cuit: string;
}) {
  return (
    <div
      className="flex flex-wrap items-center gap-4 px-4 py-3 rounded-xl mb-4"
      style={{
        background: "rgba(39,160,201,.05)",
        border: "1px solid rgba(39,160,201,.12)",
      }}>
      {certCompany && (
        <div className="flex items-center gap-2">
          <span className="fc-sora text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Empresa
          </span>
          <span className="fc-sora text-sm font-semibold text-gray-800">
            {certCompany}
          </span>
        </div>
      )}
      <div className="flex items-center gap-2">
        <span className="fc-sora text-xs font-semibold text-gray-500 uppercase tracking-wider">
          CUIT
        </span>
        <span className="fc-sora text-sm font-mono font-semibold text-gray-800">
          {cuit.length === 11
            ? `${cuit.slice(0, 2)}-${cuit.slice(2, 10)}-${cuit.slice(10)}`
            : cuit}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <span className="fc-sora text-xs font-semibold text-gray-500 uppercase tracking-wider">
          Ambiente
        </span>
        <span
          className="fc-sora px-2 py-0.5 rounded-md text-xs font-bold"
          style={{
            background: "rgba(15,23,42,.08)",
            color: "#0f172a",
          }}>
          Producción
        </span>
      </div>
    </div>
  );
}

function PtoVentaField({
  ptoVta,
  cuit,
  environment,
  disabled,
  onPtoVtaChange,
}: {
  ptoVta: number | null;
  cuit: string;
  environment: "DEV" | "PROD";
  disabled: boolean;
  onPtoVtaChange: (v: number | null) => void;
}) {
  const [ptosVenta, setPtosVenta] = useState<{ nro: number }[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const cleanCuit = cuit.replace(/[-\s.]/g, "");

  const handleConsultar = async () => {
    if (cleanCuit.length !== 11 || disabled) return;
    setIsLoading(true);
    setFetchError(null);
    try {
      const result = await afipApi.getPtosVenta(cleanCuit, environment);
      const active = result.filter((pv) => !pv.bloqueado && !pv.fchBaja);
      setPtosVenta(active);
      if (active.length > 0) onPtoVtaChange(active[0].nro);
    } catch (e: unknown) {
      setFetchError(e instanceof Error ? e.message : "Error al consultar ARCA");
    } finally {
      setIsLoading(false);
    }
  };

  const handleManualInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const digits = e.target.value.replace(/\D/g, "").slice(0, 4);
    if (digits === "") {
      onPtoVtaChange(null);
      return;
    }

    const n = parseInt(digits, 10);
    if (n >= 1 && n <= 9999) onPtoVtaChange(n);
  };

  const manualInput = (
    <input
      type="text"
      inputMode="numeric"
      pattern="[0-9]*"
      maxLength={4}
      placeholder="Ej: 0001"
      value={ptoVta === null ? "" : String(ptoVta).padStart(4, "0")}
      onChange={handleManualInput}
      disabled={disabled}
      className="w-full px-3 py-2.5 text-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-sky-200 focus:border-sky-400 transition-all bg-white disabled:opacity-50"
    />
  );

  // DEV: fixed to 1, no fetch needed
  if (environment === "DEV") {
    return (
      <div>
        <label className="fc-sora block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
          Punto de Venta
        </label>
        {manualInput}
      </div>
    );
  }

  return (
    <div>
      <label className="fc-sora block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
        Punto de Venta
      </label>

      {ptosVenta.length > 0 ? (
        <div className="flex gap-2">
          <div className="relative flex-1">
            <select
              value={ptoVta ?? ""}
              onChange={(e) => onPtoVtaChange(Number(e.target.value))}
              disabled={disabled}
              className="w-full appearance-none px-3 py-2.5 text-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-sky-200 focus:border-sky-400 transition-all bg-white pr-9 disabled:opacity-50">
              {ptosVenta.map((pv) => (
                <option key={pv.nro} value={pv.nro}>
                  {String(pv.nro).padStart(4, "0")}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
          <button
            type="button"
            onClick={() => {
              setPtosVenta([]);
              setFetchError(null);
            }}
            disabled={disabled}
            className="px-3 py-2.5 text-xs rounded-xl border border-gray-200 text-gray-500 hover:bg-gray-50 transition-colors disabled:opacity-50">
            Manual
          </button>
        </div>
      ) : (
        <div className="flex gap-2">
          {manualInput}
          <button
            type="button"
            onClick={handleConsultar}
            disabled={disabled || isLoading || cleanCuit.length !== 11}
            className="flex items-center gap-1.5 px-3 py-2.5 text-xs rounded-xl border border-gray-200 text-gray-500 hover:bg-gray-50 transition-colors disabled:opacity-50 whitespace-nowrap">
            {isLoading ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <MapPin className="w-3.5 h-3.5" />
            )}
            Consultar
          </button>
        </div>
      )}

      {fetchError && (
        <div
          className="mt-2 px-3 py-2 text-xs text-red-500 rounded-xl border border-red-200 bg-red-50/50 break-words"
          title={fetchError}>
          {renderErrorText(fetchError)}
        </div>
      )}
    </div>
  );
}

import { forwardRef } from "react";

const DescripcionField = forwardRef<
  HTMLInputElement,
  {
    value: string;
    error: boolean;
    disabled: boolean;
    onChange: (v: string) => void;
    onFocus: () => void;
  }
>(function DescripcionField(
  { value, error, disabled, onChange, onFocus },
  ref,
) {
  return (
    <div>
      <label
        className="fc-sora block text-xs font-semibold uppercase tracking-wider mb-1.5"
        style={{ color: error ? "#dc2626" : "#6b7280" }}>
        Descripción <span style={{ color: "#dc2626" }}>*</span>
      </label>
      <input
        ref={ref}
        type="text"
        placeholder="Ej: Honorarios profesionales"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className="w-full px-3 py-2.5 text-sm rounded-xl border focus:outline-none focus:ring-2 transition-all bg-white disabled:opacity-50"
        style={{
          borderColor: error ? "#dc2626" : "#e5e7eb",
          boxShadow: error ? "0 0 0 3px rgba(220,38,38,.10)" : undefined,
        }}
        onFocus={onFocus}
      />
      {error ? (
        <p className="text-xs mt-1" style={{ color: "#dc2626" }}>
          La descripción es obligatoria antes de generar.
        </p>
      ) : (
        <p className="text-xs text-gray-400 mt-1">
          Afecta solo a comprobantes sin descripción propia.
        </p>
      )}
    </div>
  );
});

function ValidationDetailsPanel({
  rows,
  failedInvoiceError,
  onResolveAddresses,
  isResolvingAddresses,
}: {
  rows: VisibleValidationRow[];
  failedInvoiceError: string | null;
  onResolveAddresses?: () => void;
  isResolvingAddresses?: boolean;
}) {
  const failedRows = rows.filter((row) => row.hasErrors);
  const groupedErrors = groupValidationIssues(rows, "error");
  const groupedWarnings = groupValidationIssues(rows, "warning");
  const hasErrors = groupedErrors.length > 0;
  const addressWarning = groupedWarnings.find(
    (w) => w.code === "RECEPTOR_FISCAL_ADDRESS_REQUIRED",
  );
  const otherWarnings = groupedWarnings.filter(
    (w) => w.code !== "RECEPTOR_FISCAL_ADDRESS_REQUIRED",
  );

  return (
    <div
      className={`mb-4 rounded-2xl border bg-white ${
        hasErrors
          ? "border-red-200 shadow-[0_18px_50px_-30px_rgba(220,38,38,.45)]"
          : "border-amber-200 shadow-[0_18px_50px_-30px_rgba(217,119,6,.3)]"
      }`}>
      <div
        className={`border-b rounded-t-2xl px-3 py-4 sm:px-5 ${
          hasErrors
            ? "border-red-100 bg-gradient-to-r from-red-50 via-rose-50 to-white"
            : "border-amber-100 bg-gradient-to-r from-amber-50 via-yellow-50 to-white"
        }`}>
        <div className="flex flex-wrap items-center gap-2">
          <p
            className={`fc-sora text-sm font-semibold ${
              hasErrors ? "text-red-700" : "text-amber-700"
            }`}>
            {hasErrors
              ? `${failedRows.length} fila(s) bloqueadas antes de generar`
              : `${groupedWarnings.reduce((s, i) => s + i.rowNumbers.length, 0)} advertencia(s) — podés generar igual`}
          </p>
        </div>
        {hasErrors && (
          <p className="mt-2 text-sm text-red-600">
            Revisá el detalle por fila. Las marcadas en rojo no pasan los tests
            de validación.
          </p>
        )}
        {failedInvoiceError && (
          <p className="mt-3 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            Error de generación más reciente:{" "}
            {renderErrorText(failedInvoiceError)}
          </p>
        )}
      </div>

      <div
        className={`grid gap-4 px-3 py-4 sm:px-5 ${
          hasErrors && groupedWarnings.length > 0
            ? "lg:grid-cols-[minmax(0,1.25fr)_minmax(0,.9fr)]"
            : ""
        }`}>
        {hasErrors && (
          <div className="min-w-0">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.16em] text-red-500">
              Errores
            </p>
            <div className="space-y-3">
              {groupedErrors.map((issue) => (
                <div
                  key={`${issue.code}-${issue.message}`}
                  className="relative rounded-xl border border-red-200 bg-red-50 px-3 py-3 sm:px-4">
                  <span className="absolute right-3 top-3 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-600 px-1.5 text-[10px] font-bold text-white">
                    {issue.rowNumbers.length}
                  </span>
                  <div className="flex flex-wrap items-center gap-2 pr-10">
                    <span className="text-xs font-semibold text-red-600">
                      {formatRowSummary(issue.rowNumbers)}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-red-800">{issue.message}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {(addressWarning || otherWarnings.length > 0) && (
          <div className="min-w-0">
            {hasErrors && (
              <p className="mb-3 text-xs font-bold uppercase tracking-[0.16em] text-amber-500">
                Advertencias
              </p>
            )}
            <div className="space-y-3">
              {addressWarning && (
                <div className="relative rounded-xl border border-amber-200 bg-amber-50 px-3 py-3 sm:px-4">
                  <span className="absolute right-3 top-3 flex h-5 min-w-5 items-center justify-center rounded-full bg-amber-500 px-1.5 text-[10px] font-bold text-white">
                    {addressWarning.rowNumbers.length}
                  </span>
                  <div className="flex flex-wrap items-center gap-2 pr-10">
                    <span className="flex items-center gap-1.5 text-xs font-semibold text-amber-700">
                      <MapPin className="h-3.5 w-3.5" />
                      {formatRowSummary(addressWarning.rowNumbers)}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-amber-900">
                    {isResolvingAddresses
                      ? "Estamos intentando encontrar el domicilio fiscal de estos receptores. Cuando termine la búsqueda, vas a poder revisar o editar cada dirección manualmente."
                      : addressWarning.message}
                  </p>
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    {onResolveAddresses && (
                      <button
                        onClick={onResolveAddresses}
                        disabled={isResolvingAddresses}
                        className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold text-white transition-all hover:brightness-110 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                        style={{ background: "#27a0c9" }}>
                        {isResolvingAddresses ? (
                          <Loader2 className="h-3 w-3 animate-spin" />
                        ) : (
                          <MapPin className="h-3 w-3" />
                        )}
                        {isResolvingAddresses
                          ? "Resolviendo..."
                          : "Resolver direcciones"}
                      </button>
                    )}
                    <a
                      href="/mis-certificados/guia/habilitar-padron-produccion"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-lg border border-amber-300 bg-white px-3 py-1.5 text-xs font-semibold text-amber-800 transition-colors hover:bg-amber-50 cursor-pointer">
                      ¿Cómo habilitar?
                    </a>
                  </div>
                </div>
              )}
              {otherWarnings.map((issue) => (
                <div
                  key={`${issue.code}-${issue.message}`}
                  className="relative rounded-xl border border-amber-200 bg-amber-50 px-3 py-3 sm:px-4">
                  <span className="absolute right-3 top-3 flex h-5 min-w-5 items-center justify-center rounded-full bg-amber-500 px-1.5 text-[10px] font-bold text-white">
                    {issue.rowNumbers.length}
                  </span>
                  <div className="flex flex-wrap items-center gap-2 pr-10">
                    <span className="text-xs font-semibold text-amber-700">
                      {formatRowSummary(issue.rowNumbers)}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-amber-900">{issue.message}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
