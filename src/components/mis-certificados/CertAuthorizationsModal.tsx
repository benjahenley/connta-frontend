"use client";

import useSWR from "swr";
import Link from "next/link";
import {
  X,
  CheckCircle2,
  XCircle,
  Loader2,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";
import {
  afipApi,
  type CertData,
  type CertAuthorization,
} from "@/services/afip";

interface Props {
  cert: CertData;
  onClose: () => void;
}

export function CertAuthorizationsModal({ cert, onClose }: Props) {
  const {
    data: authorizations,
    error,
    isLoading: loading,
  } = useSWR<CertAuthorization[]>(
    `cert-authorizations:${cert.id}`,
    () => afipApi.getCertAuthorizations(cert.id),
    {
      revalidateOnFocus: false,
      dedupingInterval: 10 * 60 * 1000,
    },
  );

  const formatCuit = (cuit: string) => {
    const c = cuit.replace(/\D/g, "");
    if (c.length === 11)
      return `${c.slice(0, 2)}-${c.slice(2, 10)}-${c.slice(10)}`;
    return cuit;
  };

  const serviceAction = (service: string) => {
    if (service === "ws_sr_constancia_inscripcion") {
      return {
        href:
          cert.environment === "PROD"
            ? "/mis-certificados/guia/habilitar-padron-produccion"
            : "/mis-certificados/guia/habilitar-padron-testing",
        label: "Cómo habilitar",
      };
    }

    return {
      href: "/contacto",
      label: "Me interesa",
    };
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(15,23,42,.55)", backdropFilter: "blur(4px)" }}
      onClick={onClose}>
      <div
        className="bg-white rounded-2xl w-full max-w-sm overflow-hidden"
        style={{ boxShadow: "0 25px 60px rgba(0,0,0,.2)" }}
        onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="px-6 pt-6 pb-4">
          <div className="flex items-start justify-between gap-3 mb-1">
            <div className="flex items-start gap-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: "rgba(39,160,201,.1)" }}>
                <ShieldCheck className="w-5 h-5" style={{ color: "#27a0c9" }} />
              </div>
              <div>
                <h3 className="mc-condensed text-xl font-bold text-gray-900 leading-tight">
                  Servicios habilitados
                </h3>
                <p className="mc-sora text-xs text-gray-400 mt-0.5">
                  {formatCuit(cert.cuit)} ·{" "}
                  {cert.environment === "PROD" ? "Producción" : "Homologación"}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-300 hover:text-gray-500 transition-colors cursor-pointer flex-shrink-0 -mt-0.5">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="px-6 pb-6">
          {loading ? (
            <div className="flex flex-col items-center justify-center gap-2 py-10 text-gray-400">
              <Loader2
                className="w-5 h-5 animate-spin"
                style={{ color: "#27a0c9" }}
              />
              <span className="mc-sora text-sm">Consultando con ARCA...</span>
            </div>
          ) : error ? (
            <div className="py-8 text-center">
              <XCircle className="w-8 h-8 text-red-400 mx-auto mb-3" />
              <p className="mc-sora text-sm text-red-500 leading-relaxed">
                {error.message}
              </p>
            </div>
          ) : (
            <>
              <ul className="space-y-2">
                {authorizations?.map(({ service, label, authorized }) => {
                  const action = serviceAction(service);

                  return (
                    <li
                      key={service}
                      className="flex items-center justify-between gap-3 px-4 py-3 rounded-xl"
                      style={{ background: "#f8fafc" }}>
                      <div className="min-w-0">
                        <p className="mc-sora text-sm font-medium text-gray-700 leading-snug">
                          {label}
                        </p>
                        <p className="mc-sora text-xs font-mono text-gray-400 mt-0.5">
                          {service}
                        </p>
                      </div>
                      {authorized ? (
                        <span
                          className="mc-sora inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-lg flex-shrink-0"
                          style={{
                            background: "rgba(16,185,129,.1)",
                            color: "#065f46",
                          }}>
                          <CheckCircle2 className="w-3 h-3" />
                          Habilitado
                        </span>
                      ) : (
                        <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                          <span
                            className="mc-sora inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-lg"
                            style={{
                              background: "rgba(239,68,68,.08)",
                              color: "#b91c1c",
                            }}>
                            <XCircle className="w-3 h-3" />
                            Sin acceso
                          </span>
                          <Link
                            href={action.href}
                            onClick={onClose}
                            className="mc-sora inline-flex items-center gap-1 text-xs font-medium transition-colors"
                            style={{ color: "#27a0c9" }}>
                            {action.label}
                            <ArrowRight className="w-3 h-3" />
                          </Link>
                        </div>
                      )}
                    </li>
                  );
                })}
              </ul>

              <p className="mc-sora text-xs text-gray-400 mt-4 leading-relaxed text-center">
                ¿Necesitás un servicio que no está habilitado?{" "}
                <Link
                  href="/contacto"
                  onClick={onClose}
                  className="font-medium underline underline-offset-2 hover:text-gray-600 transition-colors"
                  style={{ color: "#27a0c9" }}>
                  Contactanos
                </Link>{" "}
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
