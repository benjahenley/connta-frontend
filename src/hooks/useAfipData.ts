import useSWR, { mutate as globalMutate } from "swr";
import { afipApi } from "@/services/afip";
import type {
  CertData,
  UploadSessionSummary,
  UploadSessionDetail,
} from "@/services/afip";

/* ── SWR Keys ──────────────────────────────────────────────────── */
export const SWR_KEYS = {
  certs: "certs",
  uploadHistory: "upload-history",
  uploadDetail: (id: string) => `upload-detail:${id}`,
  ptosVenta: (cuit: string, env: string) => `ptos-venta:${env}:${cuit}`,
} as const;

/* ── Hooks ─────────────────────────────────────────────────────── */

export function useCertificates() {
  const { data, error, isLoading, mutate } = useSWR<CertData[]>(
    SWR_KEYS.certs,
    () => afipApi.listCerts(),
    {
      revalidateOnFocus: false,
      dedupingInterval: 10_000,
    },
  );

  return {
    certs: data ?? [],
    certsLoading: isLoading,
    certsError: error as Error | undefined,
    mutateCerts: mutate,
  };
}

export function useUploadHistory() {
  const { data, error, isLoading, mutate } = useSWR<UploadSessionSummary[]>(
    SWR_KEYS.uploadHistory,
    () => afipApi.getUploadHistory(),
    {
      revalidateOnFocus: false,
      dedupingInterval: 10_000,
    },
  );

  return {
    history: data ?? [],
    historyLoading: isLoading,
    historyError: error as Error | undefined,
    mutateHistory: mutate,
  };
}

export function useUploadDetail(id: string | null) {
  const { data, error, isLoading, mutate } = useSWR<UploadSessionDetail>(
    id ? SWR_KEYS.uploadDetail(id) : null,
    () => afipApi.getUploadDetail(id!),
    {
      revalidateOnFocus: false,
      dedupingInterval: 10_000,
    },
  );

  return {
    detail: data ?? null,
    detailLoading: isLoading,
    detailError: error as Error | undefined,
    mutateDetail: mutate,
  };
}

export function usePtosVenta(cuit: string, environment: "DEV" | "PROD") {
  const cleanCuit = cuit.replace(/[-\s.]/g, "");
  const shouldFetch = environment !== "DEV" && cleanCuit.length === 11;

  const { data, error, isLoading, mutate } = useSWR(
    shouldFetch ? SWR_KEYS.ptosVenta(cleanCuit, environment) : null,
    () => afipApi.getPtosVenta(cleanCuit, environment),
    {
      revalidateOnFocus: false,
      dedupingInterval: 30_000,
    },
  );

  return {
    ptosVenta: data ?? [],
    ptosLoading: isLoading,
    ptosError: error as Error | undefined,
    mutatePtos: mutate,
  };
}

/* ── Mutation helpers (call after writes) ──────────────────────── */

export function invalidateCerts() {
  return globalMutate(SWR_KEYS.certs);
}

export function invalidateUploadHistory() {
  return globalMutate(SWR_KEYS.uploadHistory, undefined, { revalidate: true });
}

export function invalidateUploadDetail(id: string) {
  return globalMutate(SWR_KEYS.uploadDetail(id));
}
