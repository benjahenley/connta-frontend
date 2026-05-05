"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";
import {
  AlertTriangle,
  FileImage,
  Loader2,
  Move,
  RotateCcw,
  Trash2,
  Upload,
} from "lucide-react";
import { afipApi, type InvoiceBrandingStatus } from "@/services/afip";
import { PageHeader } from "@/components/ui/PageHeader";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

const MAX_LOGO_SIZE = 1024 * 1024;
const ACCEPTED_LOGO_TYPES = ["image/png", "image/jpeg"];
const LOGO_FRAME_WIDTH = 280;
const LOGO_FRAME_HEIGHT = 75;

type LogoPosition = { x: number; y: number };

function clampLogoPosition(value: number) {
  return Math.max(-100, Math.min(100, Math.round(value)));
}

function positionFromStatus(status: InvoiceBrandingStatus): LogoPosition {
  return {
    x: clampLogoPosition(status.logoPositionX ?? 0),
    y: clampLogoPosition(status.logoPositionY ?? 0),
  };
}

export default function ConfiguracionFacturaPage() {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const previewUrlRef = useRef<string | null>(null);
  const logoUrlRef = useRef<string | null>(null);
  const dragStartRef = useRef<{
    pointerId: number;
    startX: number;
    startY: number;
    position: LogoPosition;
  } | null>(null);
  const draftPositionRef = useRef<LogoPosition>({ x: 0, y: 0 });

  const [status, setStatus] = useState<InvoiceBrandingStatus | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [logoPosition, setLogoPosition] = useState<LogoPosition>({ x: 0, y: 0 });
  const [draftPosition, setDraftPosition] = useState<LogoPosition>({
    x: 0,
    y: 0,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savingPosition, setSavingPosition] = useState(false);
  const [removing, setRemoving] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const setLogoObjectUrl = useCallback((url: string | null) => {
    if (logoUrlRef.current) URL.revokeObjectURL(logoUrlRef.current);
    logoUrlRef.current = url;
    setLogoUrl(url);
  }, []);

  const setLogoDraft = useCallback((position: LogoPosition) => {
    draftPositionRef.current = position;
    setDraftPosition(position);
  }, []);

  const applyLogoPosition = useCallback(
    (position: LogoPosition) => {
      setLogoPosition(position);
      setLogoDraft(position);
    },
    [setLogoDraft],
  );

  const refreshPreview = useCallback(async () => {
    const url = await afipApi.getInvoiceBrandingPreviewUrl();
    if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current);
    previewUrlRef.current = url;
    setPreviewUrl(url);
  }, []);

  const refreshLogoImage = useCallback(
    async (hasLogo: boolean) => {
      if (!hasLogo) {
        setLogoObjectUrl(null);
        return;
      }

      const url = await afipApi.getInvoiceLogoObjectUrl();
      setLogoObjectUrl(url);
    },
    [setLogoObjectUrl],
  );

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const branding = await afipApi.getInvoiceBranding();
      setStatus(branding);
      applyLogoPosition(positionFromStatus(branding));
      await refreshLogoImage(branding.hasLogo);
      await refreshPreview();
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  }, [applyLogoPosition, refreshLogoImage, refreshPreview]);

  useEffect(() => {
    load();
    return () => {
      if (previewUrlRef.current) {
        URL.revokeObjectURL(previewUrlRef.current);
        previewUrlRef.current = null;
      }
      if (logoUrlRef.current) {
        URL.revokeObjectURL(logoUrlRef.current);
        logoUrlRef.current = null;
      }
    };
  }, [load]);

  const handleFile = async (file: File | undefined) => {
    if (!file) return;
    setError(null);

    if (!ACCEPTED_LOGO_TYPES.includes(file.type)) {
      setError("El logo debe estar en formato PNG o JPG/JPEG.");
      return;
    }

    if (file.size > MAX_LOGO_SIZE) {
      setError("El logo no puede superar 1 MB.");
      return;
    }

    setSaving(true);
    try {
      const updated = await afipApi.uploadInvoiceLogo(file);
      setStatus(updated);
      applyLogoPosition(positionFromStatus(updated));
      await refreshLogoImage(updated.hasLogo);
      await refreshPreview();
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setSaving(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const handleRemove = async () => {
    setError(null);
    setRemoving(true);
    try {
      const updated = await afipApi.deleteInvoiceLogo();
      setStatus(updated);
      applyLogoPosition({ x: 0, y: 0 });
      setLogoObjectUrl(null);
      await refreshPreview();
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setRemoving(false);
    }
  };

  const persistLogoPosition = async (position: LogoPosition) => {
    if (!status?.hasLogo) return;

    setError(null);
    setSavingPosition(true);
    try {
      const updated = await afipApi.updateInvoiceLogoPosition(
        position.x,
        position.y,
      );
      const nextPosition = positionFromStatus(updated);
      setStatus(updated);
      applyLogoPosition(nextPosition);
      await refreshPreview();
    } catch (err) {
      setLogoDraft(logoPosition);
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setSavingPosition(false);
    }
  };

  const handleLogoPointerDown = (
    event: ReactPointerEvent<HTMLDivElement>,
  ) => {
    if (!status?.hasLogo || !logoUrl || savingPosition) return;

    event.currentTarget.setPointerCapture(event.pointerId);
    dragStartRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      position: draftPositionRef.current,
    };
    setDragging(true);
  };

  const handleLogoPointerMove = (
    event: ReactPointerEvent<HTMLDivElement>,
  ) => {
    const start = dragStartRef.current;
    if (!start || start.pointerId !== event.pointerId) return;

    setLogoDraft({
      x: clampLogoPosition(
        start.position.x +
          ((event.clientX - start.startX) / (LOGO_FRAME_WIDTH / 2)) * 100,
      ),
      y: clampLogoPosition(
        start.position.y +
          ((event.clientY - start.startY) / (LOGO_FRAME_HEIGHT / 2)) * 100,
      ),
    });
  };

  const handleLogoPointerUp = async (
    event: ReactPointerEvent<HTMLDivElement>,
  ) => {
    const start = dragStartRef.current;
    if (!start || start.pointerId !== event.pointerId) return;

    event.currentTarget.releasePointerCapture(event.pointerId);
    dragStartRef.current = null;
    setDragging(false);
    await persistLogoPosition(draftPositionRef.current);
  };

  const handleLogoPointerCancel = (
    event: ReactPointerEvent<HTMLDivElement>,
  ) => {
    const start = dragStartRef.current;
    if (!start || start.pointerId !== event.pointerId) return;

    event.currentTarget.releasePointerCapture(event.pointerId);
    dragStartRef.current = null;
    setDragging(false);
    setLogoDraft(logoPosition);
  };

  const handleResetPosition = async () => {
    const centered = { x: 0, y: 0 };
    setLogoDraft(centered);
    await persistLogoPosition(centered);
  };

  const logoOffsetX = (draftPosition.x / 100) * (LOGO_FRAME_WIDTH / 2);
  const logoOffsetY = (draftPosition.y / 100) * (LOGO_FRAME_HEIGHT / 2);

  return (
    <div className="min-h-full bg-[#f4f7f9]">
      <div className="w-full border-b border-[#e8ecf0] bg-white">
        <div className="mx-auto max-w-7xl px-6 py-5 md:px-8 lg:px-10">
          <PageHeader
            backHref="/facturacion"
            backLabel="Facturación"
            eyebrow="Configuración"
            icon={FileImage}
            title="Logo de factura"
            description="Subí el logo que querés mostrar en el pie de tus PDFs de factura."
          />
        </div>
      </div>

      <div className="mx-auto grid max-w-7xl gap-6 px-6 py-8 md:px-8 lg:grid-cols-[360px_1fr] lg:px-10">
        <section className="rounded-2xl border border-[#e8ecf0] bg-white p-5 shadow-sm">
          <div className="mb-5">
            <h2 className="text-lg font-bold text-gray-900">Logo</h2>
            <p className="mt-1 text-sm text-gray-500">
              Se guarda de forma privada y se aplica a nuevas descargas de PDF.
            </p>
          </div>

          <Alert className="mb-5 border-amber-200 bg-amber-50 text-amber-950">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Formatos permitidos</AlertTitle>
            <AlertDescription>
              Usá PNG o JPG/JPEG, máximo 1 MB.
            </AlertDescription>
          </Alert>

          {status?.hasLogo ? (
            <>
              <div className="mb-5 rounded-xl border border-gray-200 bg-gray-50 p-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                  Logo actual
                </p>
                <p className="mt-1 truncate text-sm font-semibold text-gray-800">
                  {status.logoOriginalName ?? "logo de factura"}
                </p>
                {status.updatedAt ? (
                  <p className="mt-1 text-xs text-gray-500">
                    Actualizado el{" "}
                    {new Date(status.updatedAt).toLocaleDateString("es-AR")}
                  </p>
                ) : null}
              </div>

              <div className="mb-5">
                <div className="mb-2 flex items-center justify-between gap-3">
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                    Área del logo
                  </p>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleResetPosition}
                    disabled={savingPosition || removing || saving}
                    className="h-8 gap-1.5 px-2.5 text-xs"
                  >
                    {savingPosition ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <RotateCcw className="h-3.5 w-3.5" />
                    )}
                    Centrar
                  </Button>
                </div>

                <div
                  role="presentation"
                  onPointerDown={handleLogoPointerDown}
                  onPointerMove={handleLogoPointerMove}
                  onPointerUp={handleLogoPointerUp}
                  onPointerCancel={handleLogoPointerCancel}
                  className={`relative overflow-hidden rounded-lg border-2 border-dashed bg-white ${
                    dragging
                      ? "cursor-grabbing border-[#27a0c9]"
                      : "cursor-grab border-[#27a0c9]/60"
                  }`}
                  style={{
                    width: LOGO_FRAME_WIDTH,
                    height: LOGO_FRAME_HEIGHT,
                    touchAction: "none",
                  }}
                >
                  <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(45deg,rgba(39,160,201,0.06)_25%,transparent_25%,transparent_50%,rgba(39,160,201,0.06)_50%,rgba(39,160,201,0.06)_75%,transparent_75%,transparent)] bg-[length:16px_16px]" />
                  {logoUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={logoUrl}
                      alt=""
                      className="pointer-events-none absolute left-0 top-1/2 select-none object-contain"
                      style={{
                        maxWidth: LOGO_FRAME_WIDTH,
                        maxHeight: LOGO_FRAME_HEIGHT,
                        transform: `translate(${logoOffsetX}px, ${logoOffsetY}px) translateY(-50%)`,
                      }}
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                      <Loader2 className="h-4 w-4 animate-spin" />
                    </div>
                  )}
                  <div className="pointer-events-none absolute bottom-2 right-2 rounded-md border border-[#27a0c9]/25 bg-white/85 p-1 text-[#27a0c9] shadow-sm">
                    <Move className="h-4 w-4" />
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="mb-5 rounded-xl border border-dashed border-gray-300 bg-gray-50 p-4 text-sm text-gray-500">
              Todavía no cargaste un logo.
            </div>
          )}

          {error ? (
            <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </div>
          ) : null}

          <input
            ref={inputRef}
            type="file"
            accept="image/png,image/jpeg"
            className="hidden"
            onChange={(event) => handleFile(event.target.files?.[0])}
          />

          <div className="flex flex-col gap-3">
            <Button
              type="button"
              onClick={() => inputRef.current?.click()}
              disabled={saving || removing || savingPosition}
              className="bg-[#27a0c9] text-white hover:bg-[#1f8eb3]"
            >
              {saving ? <Loader2 className="animate-spin" /> : <Upload />}
              {saving ? "Subiendo..." : "Subir logo"}
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={handleRemove}
              disabled={!status?.hasLogo || saving || removing || savingPosition}
            >
              {removing ? <Loader2 className="animate-spin" /> : <Trash2 />}
              {removing ? "Eliminando..." : "Eliminar logo"}
            </Button>
          </div>
        </section>

        <section className="min-h-[720px] overflow-hidden rounded-2xl border border-[#e8ecf0] bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-[#e8ecf0] px-5 py-4">
            <div>
              <h2 className="text-lg font-bold text-gray-900">Vista previa</h2>
              <p className="text-sm text-gray-500">
                Revisá cómo queda el logo en el sector del QR y CAE.
              </p>
            </div>
          </div>

          {loading ? (
            <div className="flex h-[680px] items-center justify-center text-sm text-gray-500">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generando vista previa...
            </div>
          ) : previewUrl ? (
            <iframe
              src={previewUrl}
              title="Vista previa de factura con logo"
              className="h-[720px] w-full bg-gray-100"
            />
          ) : (
            <div className="flex h-[680px] items-center justify-center px-6 text-center text-sm text-gray-500">
              No se pudo generar la vista previa.
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
