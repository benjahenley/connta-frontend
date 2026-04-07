import { supabase } from "@/lib/supabase";
import { mutate as globalMutate } from "swr";

export interface GenerateCsrPayload {
  cuit: string;
  companyName: string;
  certName: string;
  environment: "DEV" | "PROD";
}

export interface GenerateCsrResponse {
  csrText: string;
  certRecordId: string;
}

export interface ScanExcelPayload {
  file: File;
  cuit: string;
  environment: "DEV" | "PROD";
  certRecordId?: string;
}

export interface CertData {
  id: string;
  certName: string;
  cuit: string;
  companyName: string;
  environment: "DEV" | "PROD";
  status: "ACTIVE" | "EXPIRED" | "PENDING_CERT";
  expiresAt: string | null;
  createdAt: string;
}

export interface ScannedInvoice {
  id: string;
  ptoVta: number | null;
  cbteTipo: number | null;
  concepto: number | null;
  docTipo: number | null;
  docNro: number | null;
  domicilioReceptor?: string | null;
  condicionIvaReceptorId?: number | null;
  razonSocial?: string | null;
  descripcion?: string | null;
  impNeto: number | null;
  impIva: number | null;
  impOpEx: number | null;
  impTotal: number | null;
  cbteFch: string | null;
  fchServDesde?: string | null;
  fchServHasta?: string | null;
  fchVtoPago?: string | null;
  validationIssues?: Array<{
    field: string | null;
    code: string;
    message: string;
    severity: "error" | "warning";
  }>;
  hasErrors?: boolean;
  autoFilledFields?: string[];
}

export interface ScanExcelResponse {
  totalFound: number;
  uploadSessionId: string | null;
}

export interface UploadSessionSummary {
  id: string;
  fileName: string;
  totalRows: number;
  status: "SCANNED" | "GENERATING" | "COMPLETED" | "FAILED";
  cuit: string | null;
  environment: "DEV" | "PROD";
  caeGenerados: number;
  errores: number;
  processedCount: number;
  createdAt: string;
  completedAt: string | null;
}

export interface UploadSessionDetail extends UploadSessionSummary {
  companyName?: string | null;
  invoices: Array<{
    id: string;
    ptoVta: number | null;
    cbteTipo: number | null;
    concepto: number | null;
    docTipo: number | null;
    docNro: number | null;
    domicilioReceptor?: string | null;
    condicionIvaReceptorId?: number | null;
    impNeto: number | null;
    impIva: number | null;
    impOpEx: number | null;
    impTotal: number | null;
    cbteFch: string | null;
    fchServDesde?: string | null;
    fchServHasta?: string | null;
    fchVtoPago?: string | null;
    cae: string | null;
    caeFchVto: string | null;
    cbteNro: number | null;
    razonSocial: string | null;
    descripcion?: string | null;
    status: "PENDING" | "SUCCESS" | "ERROR" | "SKIPPED";
    errorDetail: string | null;
    validationIssues?: string | null;
    autoFilledFields?: string | null;
    hasErrors?: boolean;
  }>;
}

export interface UpdatedInvoicePayload {
  id: string;
  ptoVta: number | null;
  cbteTipo: number | null;
  concepto: number | null;
  docTipo: number | null;
  docNro: number | null;
  domicilioReceptor?: string | null;
  condicionIvaReceptorId?: number | null;
  impNeto: number | null;
  impIva: number | null;
  impOpEx: number | null;
  impTotal: number | null;
  cbteFch: string | null;
  fchServDesde?: string | null;
  fchServHasta?: string | null;
  fchVtoPago?: string | null;
  razonSocial: string | null;
  descripcion?: string | null;
  validationIssues?: string | null;
  autoFilledFields?: string | null;
}

export interface CertAuthorization {
  service: string;
  label: string;
  authorized: boolean;
}

export interface InvoiceVerification {
  match: boolean;
  resultado: string;
  afipData: {
    cae: string;
    caeFchVto: string;
    cbteFch: string;
    impTotal: number;
    impNeto: number;
    impIva: number;
    docTipo: number;
    docNro: string;
  };
}

/* ── Auth helpers ───────────────────────────────────────────────── */

async function getToken(): Promise<string> {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  return session?.access_token || "";
}

async function authHeaders(): Promise<Record<string, string>> {
  return {
    Authorization: `Bearer ${await getToken()}`,
    "Content-Type": "application/json",
  };
}

/* ── SWR key constants (must match useAfipData.ts) ─────────────── */

const KEYS = {
  certs: "certs",
  uploadHistory: "upload-history",
  uploadDetail: (id: string) => `upload-detail:${id}`,
};

/* ── API class ─────────────────────────────────────────────────── */

class AfipApi {
  clearCache() {
    globalMutate(() => true, undefined, { revalidate: false });
  }

  async listCerts(): Promise<CertData[]> {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/certificates`,
      { headers: await authHeaders() },
    );
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err?.message || "Error al obtener certificados");
    }
    return res.json();
  }

  async scanExcel({
    file,
    cuit,
    environment,
    certRecordId,
  }: ScanExcelPayload): Promise<ScanExcelResponse> {
    const token = await getToken();
    const formData = new FormData();
    formData.append("file", file);
    formData.append("cuit", cuit);
    formData.append("environment", environment);
    if (certRecordId) formData.append("certRecordId", certRecordId);

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/afip/scan-excel`,
      {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      },
    );
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err?.message || "Error al procesar el archivo");
    }
    globalMutate(KEYS.uploadHistory);
    return res.json();
  }

  async getCsr(certRecordId: string): Promise<{ csrText: string; environment: "DEV" | "PROD" }> {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/certificates/${certRecordId}/csr`,
      { headers: await authHeaders() },
    );
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err?.message || "Error al obtener el CSR");
    }
    return res.json();
  }

  async generateCsr(payload: GenerateCsrPayload): Promise<GenerateCsrResponse> {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/certificates/generate-csr`,
      {
        method: "POST",
        headers: await authHeaders(),
        body: JSON.stringify(payload),
      },
    );
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err?.message || "Error al generar el CSR");
    }
    globalMutate(KEYS.certs);
    return res.json();
  }

  async uploadCertText(
    certRecordId: string,
    certPem: string,
  ): Promise<{ success: boolean }> {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/certificates/${certRecordId}/upload-cert-text`,
      {
        method: "POST",
        headers: await authHeaders(),
        body: JSON.stringify({ certPem }),
      },
    );
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err?.message || "Error al subir el certificado");
    }
    globalMutate(KEYS.certs);
    return res.json();
  }

  async getUploadHistory(): Promise<UploadSessionSummary[]> {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/afip/uploads`,
      { headers: await authHeaders() },
    );
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err?.message || "Error al obtener historial");
    }
    return res.json();
  }

  async hideUploadSession(id: string): Promise<void> {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/afip/uploads/${id}`,
      { method: "DELETE", headers: await authHeaders() },
    );
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err?.message || "Error al ocultar la carga");
    }
  }

  async getUploadDetail(id: string): Promise<UploadSessionDetail> {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/afip/uploads/${id}`,
      { headers: await authHeaders() },
    );
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(
        err?.message || "Error al obtener detalle de carga",
      );
    }
    return res.json();
  }

  async getPtosVenta(
    cuit: string,
    environment: "DEV" | "PROD",
  ): Promise<{ nro: number; bloqueado: boolean; fchBaja: string | null }[]> {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/afip/puntos-venta?cuit=${encodeURIComponent(cuit)}&environment=${environment}`,
      { headers: await authHeaders() },
    );
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err?.message || "Error al obtener puntos de venta");
    }
    return res.json();
  }

  async getUltimoAutorizado(
    cuit: string,
    environment: "DEV" | "PROD",
    ptoVta: number,
    cbteTipo: number,
  ): Promise<{ ptoVta: number; cbteTipo: number; cbteNro: number }> {
    const params = new URLSearchParams({
      cuit,
      environment,
      ptoVta: String(ptoVta),
      cbteTipo: String(cbteTipo),
    });
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/afip/ultimo-autorizado?${params}`,
      { headers: await authHeaders() },
    );
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err?.message || "Error al consultar último autorizado");
    }
    return res.json();
  }

  async startGeneration(
    uploadSessionId: string,
    cuit: string,
    environment: "DEV" | "PROD",
    ptoVta: number,
  ): Promise<{ status: string; totalRows: number }> {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/afip/uploads/${uploadSessionId}/generate`,
      {
        method: "POST",
        headers: await authHeaders(),
        body: JSON.stringify({ cuit, environment, ptoVta }),
      },
    );
    if (res.status === 422) {
      const body = await res.json().catch(() => ({}));
      const err = new Error(
        body?.message || "Errores de validación en los comprobantes",
      ) as Error & { preflightFailed?: boolean };
      err.preflightFailed = body?.preflightFailed === true;
      throw err;
    }
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err?.message || "Error al generar facturas");
    }
    globalMutate(KEYS.uploadHistory);
    globalMutate(KEYS.uploadDetail(uploadSessionId));
    return res.json();
  }

  async pollSessionStatus(id: string): Promise<UploadSessionDetail> {
    const token = await getToken();
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/afip/uploads/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      },
    );
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err?.message || "Error al consultar estado");
    }
    return res.json();
  }

  async deleteInvoices(
    uploadSessionId: string,
    invoiceIds: string[],
  ): Promise<{ deleted: number }> {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/afip/uploads/${uploadSessionId}/invoices`,
      {
        method: "DELETE",
        headers: await authHeaders(),
        body: JSON.stringify({ invoiceIds }),
      },
    );
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err?.message || "Error al eliminar facturas");
    }
    globalMutate(KEYS.uploadHistory);
    globalMutate(KEYS.uploadDetail(uploadSessionId));
    return res.json();
  }

  async updateInvoices(
    uploadSessionId: string,
    invoices: Array<{ id: string; [key: string]: unknown }>,
  ): Promise<{ updated: number; invoices: UpdatedInvoicePayload[] }> {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/afip/uploads/${uploadSessionId}/invoices`,
      {
        method: "PATCH",
        headers: await authHeaders(),
        body: JSON.stringify({ invoices }),
      },
    );
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err?.message || "Error al guardar cambios");
    }
    return res.json();
  }

  async resolveAddresses(
    uploadSessionId: string,
  ): Promise<{
    resolved: number;
    total: number;
    attempted?: number;
    failed?: number;
    sampleErrors?: string[];
  }> {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/afip/uploads/${uploadSessionId}/resolve-addresses`,
      {
        method: "POST",
        headers: await authHeaders(),
      },
    );
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(
        err?.message || "Error al resolver direcciones fiscales",
      );
    }
    globalMutate(KEYS.uploadDetail(uploadSessionId));
    return res.json();
  }

  async retrySession(uploadSessionId: string): Promise<UploadSessionDetail> {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/afip/uploads/${uploadSessionId}/retry`,
      { method: "POST", headers: await authHeaders() },
    );
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err?.message || "Error al reintentar la carga");
    }
    globalMutate(KEYS.uploadHistory);
    globalMutate(KEYS.uploadDetail(uploadSessionId));
    return res.json();
  }

  async renameCert(
    certRecordId: string,
    certName: string,
  ): Promise<{ success: boolean }> {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/certificates/${certRecordId}/rename`,
      {
        method: "PATCH",
        headers: await authHeaders(),
        body: JSON.stringify({ certName }),
      },
    );
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err?.message || "Error al renombrar el certificado");
    }
    globalMutate(KEYS.certs);
    return res.json();
  }

  async getCertAuthorizations(certRecordId: string): Promise<CertAuthorization[]> {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/certificates/${certRecordId}/authorizations`,
      { headers: await authHeaders() },
    );
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err?.message || "Error al verificar autorizaciones");
    }
    return res.json();
  }

  async deleteCert(certRecordId: string): Promise<{ success: boolean }> {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/certificates/${certRecordId}`,
      {
        method: "DELETE",
        headers: await authHeaders(),
      },
    );
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err?.message || "Error al eliminar el certificado");
    }
    globalMutate(KEYS.certs);
    return res.json();
  }

  async uploadCert(
    certRecordId: string,
    file: File,
  ): Promise<{ success: boolean }> {
    const token = await getToken();
    const formData = new FormData();
    formData.append("certificate", file);

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/certificates/${certRecordId}/upload-cert`,
      {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      },
    );
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err?.message || "Error al subir el certificado");
    }
    globalMutate(KEYS.certs);
    return res.json();
  }

  async verifyInvoice(invoiceId: string): Promise<InvoiceVerification> {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/afip/invoices/${invoiceId}/verify`,
      { headers: await authHeaders() },
    );
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err?.message || "Error al verificar la factura");
    }
    return res.json();
  }

  async downloadInvoicePdf(invoiceId: string, filename: string): Promise<void> {
    const token = await getToken();
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/afip/invoices/${invoiceId}/pdf`,
      { headers: { Authorization: `Bearer ${token}` } },
    );
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err?.message || "Error al descargar el PDF");
    }
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  async downloadUploadPdfsZip(uploadSessionId: string): Promise<void> {
    const token = await getToken();
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/afip/uploads/${uploadSessionId}/pdfs.zip`,
      { headers: { Authorization: `Bearer ${token}` } },
    );
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err?.message || "Error al descargar el ZIP");
    }

    const blob = await res.blob();
    const contentDisposition = res.headers.get("Content-Disposition") ?? "";
    const filenameMatch = contentDisposition.match(/filename="?([^"]+)"?/i);
    const filename = filenameMatch?.[1] ?? `facturas-${uploadSessionId}.zip`;
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
}

export const afipApi = new AfipApi();
