"use client";

import { useEffect, useState } from "react";
import { Pause, Play, RefreshCw } from "lucide-react";
import { afipApi } from "@/services/afip";

export default function FacturaPreviewPage() {
  const [type, setType] = useState<"A" | "B" | "C">("A");
  const [longDescription, setLongDescription] = useState(false);
  const [refreshKey, setRefreshKey] = useState(Date.now());
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!autoRefresh) return;

    const id = window.setInterval(() => {
      setRefreshKey(Date.now());
    }, 1500);

    return () => window.clearInterval(id);
  }, [autoRefresh, type, longDescription]);

  useEffect(() => {
    let active = true;
    let objectUrl: string | null = null;

    setError(null);
    afipApi
      .getDevInvoicePdfPreviewUrl({ type, longDescription })
      .then((url) => {
        objectUrl = url;
        if (active) setPreviewUrl(url);
      })
      .catch((err) => {
        if (active) setError(err instanceof Error ? err.message : String(err));
      });

    return () => {
      active = false;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [type, longDescription, refreshKey]);

  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-100">
      <div className="flex min-h-screen flex-col">
        <header className="flex flex-wrap items-center gap-3 border-b border-neutral-800 bg-neutral-950 px-4 py-3">
          <div className="mr-auto">
            <h1 className="text-base font-semibold">Factura PDF preview</h1>
            <p className="text-xs text-neutral-400">
              Edit backend/src/afip/invoice-pdf.service.ts and refresh.
            </p>
          </div>

          <div className="flex overflow-hidden rounded-md border border-neutral-700">
            {(["A", "B", "C"] as const).map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => {
                  setType(item);
                  setRefreshKey(Date.now());
                }}
                className={`h-9 min-w-10 px-3 text-sm font-medium ${
                  type === item
                    ? "bg-white text-neutral-950"
                    : "bg-neutral-900 text-neutral-300 hover:bg-neutral-800"
                }`}
              >
                {item}
              </button>
            ))}
          </div>

          <label className="flex h-9 items-center gap-2 rounded-md border border-neutral-700 bg-neutral-900 px-3 text-sm text-neutral-200">
            <input
              type="checkbox"
              checked={longDescription}
              onChange={(event) => {
                setLongDescription(event.target.checked);
                setRefreshKey(Date.now());
              }}
              className="h-4 w-4"
            />
            Long text
          </label>

          <button
            type="button"
            onClick={() => setAutoRefresh((value) => !value)}
            className="inline-flex h-9 items-center gap-2 rounded-md border border-neutral-700 bg-neutral-900 px-3 text-sm text-neutral-100 hover:bg-neutral-800"
          >
            {autoRefresh ? <Pause size={16} /> : <Play size={16} />}
            {autoRefresh ? "Auto" : "Auto"}
          </button>

          <button
            type="button"
            onClick={() => setRefreshKey(Date.now())}
            className="inline-flex h-9 items-center gap-2 rounded-md bg-blue-500 px-3 text-sm font-medium text-white hover:bg-blue-400"
          >
            <RefreshCw size={16} />
            Refresh
          </button>
        </header>

        {error ? (
          <div className="flex min-h-0 flex-1 items-center justify-center bg-neutral-900 px-6 text-center text-sm text-red-200">
            {error}
          </div>
        ) : previewUrl ? (
          <iframe
            key={previewUrl}
            src={previewUrl}
            title="Factura PDF preview"
            className="min-h-0 flex-1 bg-neutral-800"
          />
        ) : (
          <div className="flex min-h-0 flex-1 items-center justify-center bg-neutral-900 text-sm text-neutral-400">
            Generando preview...
          </div>
        )}
      </div>
    </main>
  );
}
