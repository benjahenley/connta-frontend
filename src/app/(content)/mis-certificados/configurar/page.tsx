"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { PageHeader } from "@/components/ui/PageHeader";
import {
  AlertTriangle,
  CheckCircle2,
  ClipboardCopy,
  Download,
  FileKey2,
  Hash,
  Info,
  Loader2,
  Lock,
  Shield,
  Upload,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";
import { afipApi } from "@/services/afip";
import { useAuth } from "@/components/providers/AuthProvider";
import { useUpgrade } from "@/components/providers/UpgradeProvider";
import { SubscriptionTier } from "@/types/auth";

const onlyDigits = (v: string) => v.replace(/\D/g, "");

const formatCuitInput = (value: string) => {
  const d = onlyDigits(value);
  if (!d.length) return "";
  if (d.length <= 2) return d;
  if (d.length <= 10) return `${d.slice(0, 2)}-${d.slice(2)}`;
  return `${d.slice(0, 2)}-${d.slice(2, 10)}-${d.slice(10, 11)}`;
};

const schema = z.object({
  cuit: z
    .string()
    .min(11, "El CUIT debe tener 11 dígitos")
    .refine((v) => /^\d{11}$/.test(onlyDigits(v)), "Ingresá 11 números"),
  companyName: z.string().min(3, "Ingresá el nombre de la empresa o persona"),
  certName: z
    .string()
    .min(3, "Al menos 3 caracteres")
    .regex(/^[A-Za-z0-9]+$/, "Solo letras y números, sin espacios"),
  environment: z.enum(["DEV", "PROD"]),
});

type FormValues = z.infer<typeof schema>;

function StepIndicator({ step }: { step: 1 | 2 | 3 }) {
  const steps = [
    { n: 1, label: "Datos del certificado" },
    { n: 2, label: "Copiar CSR en ARCA" },
    { n: 3, label: "Subir certificado" },
  ];
  return (
    <div className="mb-8">
      <div className="flex items-center sm:hidden mb-2">
        {steps.map((s, i) => {
          const done = step > s.n;
          const active = step === s.n;
          return (
            <React.Fragment key={s.n}>
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold border-2 flex-shrink-0 transition-all ${
                  done
                    ? "bg-[#27a0c9] border-[#27a0c9] text-white"
                    : active
                      ? "border-[#27a0c9] text-[#27a0c9] bg-white"
                      : "border-gray-200 text-gray-400 bg-white"
                }`}>
                {done ? <CheckCircle2 size={13} /> : s.n}
              </div>
              {i < steps.length - 1 && (
                <div
                  className={`flex-1 h-px mx-2 ${
                    step > s.n ? "bg-[#27a0c9]" : "bg-gray-200"
                  }`}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
      <p className="text-xs text-gray-500 sm:hidden">
        Paso {step} de {steps.length}:{" "}
        <span className="font-medium text-gray-700">
          {steps[step - 1].label}
        </span>
      </p>

      <div className="hidden sm:flex items-center">
        {steps.map((s, i) => {
          const done = step > s.n;
          const active = step === s.n;
          return (
            <React.Fragment key={s.n}>
              <div className="flex items-center gap-2 flex-shrink-0">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold border-2 transition-all ${
                    done
                      ? "bg-[#27a0c9] border-[#27a0c9] text-white"
                      : active
                        ? "border-[#27a0c9] text-[#27a0c9] bg-white"
                        : "border-gray-200 text-gray-400 bg-white"
                  }`}>
                  {done ? <CheckCircle2 size={14} /> : s.n}
                </div>
                <span
                  className={`text-sm ${
                    active
                      ? "text-gray-900 font-medium"
                      : done
                        ? "text-[#27a0c9]"
                        : "text-gray-400"
                  }`}>
                  {s.label}
                </span>
              </div>
              {i < steps.length - 1 && (
                <div
                  className={`flex-1 h-px mx-3 ${
                    step > s.n ? "bg-[#27a0c9]" : "bg-gray-200"
                  }`}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}

function Field({
  label,
  icon: Icon,
  tooltip,
  error,
  children,
}: {
  label: string;
  icon: React.ElementType;
  tooltip?: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid gap-1.5">
      <Label className="flex items-center gap-1.5 text-sm font-medium text-gray-700">
        <Icon size={14} className="text-gray-400" />
        {label}
        {tooltip && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Info size={13} className="text-gray-400 cursor-help" />
            </TooltipTrigger>
            <TooltipContent className="max-w-xs text-xs">
              {tooltip}
            </TooltipContent>
          </Tooltip>
        )}
      </Label>
      {children}
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}

export default function ConfigurarCertificado() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const { openUpgradeModal } = useUpgrade();
  const canUseProd = user?.subscriptionTier !== SubscriptionTier.FREE;

  const [resumeLoading, setResumeLoading] = useState(() => !!searchParams.get("resume"));
  const [serverError, setServerError] = useState<string | null>(null);
  const [csrText, setCsrText] = useState<string | null>(null);
  const [certRecordId, setCertRecordId] = useState<string | null>(null);
  const [submittedEnv, setSubmittedEnv] = useState<"DEV" | "PROD" | null>(null);
  const [copied, setCopied] = useState(false);

  const [showUpload, setShowUpload] = useState(false);
  const [uploadMode, setUploadMode] = useState<"paste" | "file">("paste");
  const [certPemText, setCertPemText] = useState("");
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { environment: "DEV" },
    mode: "onChange",
  });

  const cuit = watch("cuit");
  const companyName = watch("companyName");
  const certName = watch("certName");
  const formattedCuit = useMemo(() => formatCuitInput(cuit || ""), [cuit]);

  const isFormValid = useMemo(
    () =>
      onlyDigits(cuit || "").length === 11 &&
      (companyName || "").length >= 3 &&
      /^[A-Za-z0-9]{3,}$/.test(certName || ""),
    [cuit, companyName, certName],
  );

  const currentStep: 1 | 2 | 3 = !csrText ? 1 : !showUpload ? 2 : 3;

  useEffect(() => {
    const resumeId = searchParams.get("resume");
    if (!resumeId) return;
    afipApi.getCsr(resumeId).then(({ csrText, environment }) => {
      setCsrText(csrText);
      setCertRecordId(resumeId);
      setSubmittedEnv(environment);
    }).catch(() => {
      // cert not found or not pending — fall through to step 1
    }).finally(() => {
      setResumeLoading(false);
    });
  }, [searchParams]);

  const onSubmit = async (values: FormValues) => {
    setServerError(null);
    try {
      const result = await afipApi.generateCsr({
        cuit: onlyDigits(values.cuit),
        companyName: values.companyName,
        certName: values.certName,
        environment: values.environment,
      });
      setCsrText(result.csrText);
      setCertRecordId(result.certRecordId);
      setSubmittedEnv(values.environment);
    } catch (err: unknown) {
      setServerError(err instanceof Error ? err.message : "Ocurrió un error inesperado");
    }
  };

  const handleCopy = async () => {
    if (!csrText) return;
    await navigator.clipboard.writeText(csrText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadCsr = () => {
    if (!csrText) return;
    const blob = new Blob([csrText], { type: "application/pkcs10" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `csr-produccion.csr`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleUpload = async () => {
    if (!certRecordId) return;
    const hasInput = uploadMode === "paste" ? certPemText.trim() : uploadFile;
    if (!hasInput) return;
    setUploadError(null);
    setUploading(true);
    try {
      if (uploadMode === "paste") {
        await afipApi.uploadCertText(certRecordId, certPemText);
      } else {
        await afipApi.uploadCert(certRecordId, uploadFile!);
      }
      router.push("/mis-certificados");
    } catch (err: unknown) {
      setUploadError(err instanceof Error ? err.message : "Error al subir el certificado");
    } finally {
      setUploading(false);
    }
  };

  if (resumeLoading) {
    return (
      <div className="w-full max-w-2xl mx-auto px-4 sm:px-6 py-6 sm:py-10 animate-pulse">
        <div className="mb-6">
          <div className="h-5 w-48 bg-gray-200 rounded mb-2" />
          <div className="h-4 w-72 bg-gray-100 rounded" />
        </div>
        {/* Step indicator skeleton */}
        <div className="flex items-center mb-8">
          {[1, 2, 3].map((n, i) => (
            <React.Fragment key={n}>
              <div className="flex items-center gap-2 flex-shrink-0">
                <div className="w-7 h-7 rounded-full bg-gray-200" />
                <div className="h-4 w-24 bg-gray-100 rounded hidden sm:block" />
              </div>
              {i < 2 && <div className="flex-1 h-px mx-3 bg-gray-100" />}
            </React.Fragment>
          ))}
        </div>
        {/* Card skeleton */}
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-100">
            <div className="h-5 w-40 bg-gray-200 rounded mb-2" />
            <div className="h-4 w-64 bg-gray-100 rounded" />
          </div>
          <div className="px-6 py-5 grid gap-5">
            <div className="h-10 bg-gray-100 rounded-lg" />
            <div className="h-10 bg-gray-100 rounded-lg" />
            <div className="h-10 bg-gray-100 rounded-lg" />
          </div>
          <div className="flex justify-end px-6 py-4 border-t border-gray-100 bg-gray-50">
            <div className="h-9 w-32 bg-gray-200 rounded-lg" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <TooltipProvider>
      <div className="w-full max-w-2xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
        <PageHeader
          className="mb-6"
          eyebrow="Certificados ARCA"
          icon={Shield}
          title="Configurar certificado"
          description="Generá el CSR, registralo en ARCA y subí el certificado firmado."
        />

        <StepIndicator step={currentStep} />

        {!csrText && (
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-100">
              <h2 className="text-base font-semibold text-gray-900">
                Datos del certificado
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Completá los campos para generar la solicitud de firma (CSR) que
                luego pegás en ARCA.
              </p>
            </div>

            <div className="mx-6 mt-5 flex items-start gap-3 rounded-lg bg-[#27a0c9]/8 border border-[#27a0c9]/20 px-4 py-3">
              <Info size={15} className="text-[#27a0c9] mt-0.5 flex-shrink-0" />
              <p className="text-sm text-gray-700">
                Antes de continuar, habilitá los servicios necesarios en ARCA.{" "}
                <Link
                  href="/mis-certificados/guia/habilitar-produccion"
                  className="text-[#27a0c9] font-medium underline underline-offset-2">
                  Ver guía paso a paso →
                </Link>
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} noValidate>
              <div className="px-6 py-5 grid gap-5">
                <input type="hidden" value="PROD" {...register("environment")} />

                <Field
                  label="CUIT del titular"
                  icon={Hash}
                  tooltip="En testing usá tu propio CUIT para evitar confusiones."
                  error={errors.cuit?.message}>
                  <Input
                    inputMode="numeric"
                    placeholder="20-11111111-2"
                    value={formattedCuit}
                    onChange={(e) =>
                      setValue("cuit", onlyDigits(e.target.value).slice(0, 11))
                    }
                    className="font-mono"
                  />
                </Field>

                <Field
                  label="Nombre de la empresa o persona"
                  icon={Shield}
                  tooltip='Campo "O" (Organization) del CSR. Usá el nombre del titular del CUIT.'
                  error={errors.companyName?.message}>
                  <Input
                    placeholder="Mi Empresa SRL / Juan Pérez"
                    {...register("companyName")}
                  />
                </Field>

                <Field
                  label="Nombre del certificado (CN)"
                  icon={FileKey2}
                  tooltip="Identificador en ARCA. Solo letras y números, sin espacios."
                  error={errors.certName?.message}>
                  <Input
                    placeholder="CertTest1"
                    {...register("certName")}
                    className="font-mono"
                  />
                </Field>

                {serverError && (
                  <div className="flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3">
                    <AlertTriangle
                      size={15}
                      className="text-red-500 mt-0.5 flex-shrink-0"
                    />
                    <div>
                      <p className="text-sm font-medium text-red-700">
                        No pudimos generar el CSR
                      </p>
                      <p className="text-sm text-red-600 mt-0.5">
                        {serverError}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 bg-gray-50">
                <button
                  type="button"
                  onClick={() => router.push("/mis-certificados")}
                  className="text-sm text-gray-500 hover:text-gray-700 transition-colors flex items-center gap-1.5">
                  <ArrowLeft size={14} />
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !isFormValid}
                  className="inline-flex items-center gap-2 px-5 py-2 rounded-lg bg-[#27a0c9] text-white text-sm font-medium hover:bg-[#1e7a9c] disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
                  {isSubmitting ? (
                    <>
                      <Loader2 size={14} className="animate-spin" />
                      Generando...
                    </>
                  ) : (
                    <>
                      Generar CSR
                      <ArrowRight size={14} />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}

        {csrText && !showUpload && (
          <div className="space-y-4">
            <div className="flex items-start gap-3 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3">
              <CheckCircle2
                size={15}
                className="text-emerald-600 mt-0.5 flex-shrink-0"
              />
              <div>
                <p className="text-sm font-medium text-emerald-800">
                  CSR generado correctamente
                </p>
                <p className="text-sm text-emerald-700 mt-0.5">
                  Copiá el texto y pegalo en <strong>ARCA → WSASS</strong>{" "}
                  (testing) o <strong>WSAS</strong> (producción) para obtener el
                  certificado firmado.
                </p>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
              <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100">
                <span className="text-sm font-medium text-gray-700">
                  Texto del CSR
                </span>
                <div className="flex items-center gap-2">
                  {submittedEnv === "PROD" && (
                    <button
                      onClick={handleDownloadCsr}
                      className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-md border border-gray-200 text-gray-600 hover:border-[#27a0c9] hover:text-[#27a0c9] transition-all">
                      <Download size={12} />
                      Descargar .csr
                    </button>
                  )}
                  <button
                    onClick={handleCopy}
                    className={`inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-md border transition-all ${
                      copied
                        ? "border-emerald-300 bg-emerald-50 text-emerald-700"
                        : "border-gray-200 text-gray-600 hover:border-[#27a0c9] hover:text-[#27a0c9]"
                    }`}>
                    {copied ? (
                      <>
                        <CheckCircle2 size={12} />
                        Copiado
                      </>
                    ) : (
                      <>
                        <ClipboardCopy size={12} />
                        Copiar
                      </>
                    )}
                  </button>
                </div>
              </div>
              <div className="p-4 bg-gray-50">
                <textarea
                  readOnly
                  value={csrText}
                  rows={10}
                  className="w-full bg-transparent font-mono text-xs text-gray-700 resize-none focus:outline-none leading-relaxed"
                />
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setShowUpload(true)}
                className="inline-flex items-center gap-2 px-5 py-2 rounded-lg bg-[#27a0c9] text-white text-sm font-medium hover:bg-[#1e7a9c] transition-colors">
                Ya obtuve el certificado
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        )}

        {csrText && showUpload && (
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-100">
              <h2 className="text-base font-semibold text-gray-900">
                Cargar certificado firmado
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Pegá el texto del certificado que te devolvió ARCA, o subí el
                archivo{" "}
                <code className="text-xs bg-gray-100 px-1 py-0.5 rounded">
                  .crt
                </code>
                .
              </p>
            </div>

            <div className="px-6 pt-4">
              <div className="flex gap-1 p-1 bg-gray-100 rounded-lg w-fit">
                <button
                  type="button"
                  onClick={() => {
                    setUploadMode("paste");
                    setUploadError(null);
                  }}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                    uploadMode === "paste"
                      ? "bg-white text-gray-900 shadow-sm"
                      : "text-gray-500 hover:text-gray-700"
                  }`}>
                  Pegar texto
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setUploadMode("file");
                    setUploadError(null);
                  }}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                    uploadMode === "file"
                      ? "bg-white text-gray-900 shadow-sm"
                      : "text-gray-500 hover:text-gray-700"
                  }`}>
                  Subir archivo
                </button>
              </div>
            </div>

            <div className="px-6 py-5 grid gap-4">
              {uploadMode === "paste" ? (
                <div className="grid gap-2">
                  <label className="text-sm font-medium text-gray-700">
                    Texto del certificado (PEM)
                  </label>
                  <textarea
                    value={certPemText}
                    onChange={(e) => {
                      setCertPemText(e.target.value);
                      setUploadError(null);
                    }}
                    placeholder={
                      "-----BEGIN CERTIFICATE-----\nMIID...\n-----END CERTIFICATE-----"
                    }
                    rows={10}
                    className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 font-mono text-xs text-gray-700 resize-none focus:outline-none focus:ring-2 focus:ring-[#27a0c9]/30 focus:border-[#27a0c9] leading-relaxed placeholder:text-gray-300"
                  />
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className={`w-full flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed py-10 transition-colors ${
                    uploadFile
                      ? "border-[#27a0c9] bg-[#27a0c9]/5"
                      : "border-gray-200 hover:border-[#27a0c9]/50 hover:bg-gray-50"
                  }`}>
                  {uploadFile ? (
                    <>
                      <CheckCircle2 size={28} className="text-[#27a0c9]" />
                      <p className="text-sm font-medium text-gray-900">
                        {uploadFile.name}
                      </p>
                      <p className="text-xs text-gray-400">
                        Clic para cambiar el archivo
                      </p>
                    </>
                  ) : (
                    <>
                      <Upload size={28} className="text-gray-300" />
                      <p className="text-sm text-gray-500">
                        Clic para seleccionar el certificado
                      </p>
                      <p className="text-xs text-gray-400">
                        Formatos aceptados: .crt, .pem
                      </p>
                    </>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".crt,.pem"
                    className="hidden"
                    onChange={(e) => {
                      setUploadError(null);
                      setUploadFile(e.target.files?.[0] ?? null);
                    }}
                  />
                </button>
              )}

              {uploadError && (
                <div className="flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3">
                  <AlertTriangle
                    size={15}
                    className="text-red-500 mt-0.5 flex-shrink-0"
                  />
                  <p className="text-sm text-red-600">{uploadError}</p>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 bg-gray-50">
              <button
                type="button"
                onClick={() => setShowUpload(false)}
                className="text-sm text-gray-500 hover:text-gray-700 transition-colors flex items-center gap-1.5">
                <ArrowLeft size={14} />
                Atrás
              </button>
              <button
                disabled={
                  uploading ||
                  (uploadMode === "paste" ? !certPemText.trim() : !uploadFile)
                }
                onClick={handleUpload}
                className="inline-flex items-center gap-2 px-5 py-2 rounded-lg bg-[#27a0c9] text-white text-sm font-medium hover:bg-[#1e7a9c] disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
                {uploading ? (
                  <>
                    <Loader2 size={14} className="animate-spin" />
                    Subiendo...
                  </>
                ) : (
                  <>
                    Activar certificado
                    <CheckCircle2 size={14} />
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </TooltipProvider>
  );
}
