"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import {
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  X,
  ZoomIn,
  AlertTriangle,
} from "lucide-react";

interface ZoomedImage {
  src: string;
  alt: string;
}

const PRODUCTION_SECTIONS = [
  { id: "habilitar-admin-cert", label: "Habilitar Admin. de Certificados" },
  { id: "obtener-certificado", label: "Subir CSR y descargar certificado" },
  { id: "autorizar-wsfe", label: "Autorizar web service" },
  { id: "registrar-pdv", label: "Registrar Punto de Venta RECE" },
] as const;

export default function HabilitarAdministradorProduccion() {
  const [zoomed, setZoomed] = useState<ZoomedImage | null>(null);
  const [activeSection, setActiveSection] = useState<
    (typeof PRODUCTION_SECTIONS)[number]["id"]
  >(PRODUCTION_SECTIONS[0].id);

  useEffect(() => {
    if (!zoomed) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setZoomed(null);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [zoomed]);

  useEffect(() => {
    document.body.style.overflow = zoomed ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [zoomed]);

  useEffect(() => {
    const handleScroll = () => {
      const trigger = window.scrollY + 220;
      let current: (typeof PRODUCTION_SECTIONS)[number]["id"] =
        PRODUCTION_SECTIONS[0].id;
      for (const section of PRODUCTION_SECTIONS) {
        const el = document.getElementById(section.id);
        if (el) {
          const top = el.getBoundingClientRect().top + window.scrollY;
          if (top <= trigger) current = section.id;
        }
      }
      setActiveSection(current);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@700;900&family=Sora:wght@400;500;600;700&display=swap');

        .g-condensed { font-family: 'Barlow Condensed', ui-sans-serif, system-ui, sans-serif; }
        .g-sora      { font-family: 'Sora', ui-sans-serif, system-ui, sans-serif; }

        .g-img-card {
          box-shadow: 0 2px 16px rgba(39,160,201,.10), 0 1px 3px rgba(0,0,0,.06);
          transition: box-shadow .25s ease, transform .25s ease;
          cursor: zoom-in;
        }
        .g-img-card:hover {
          box-shadow: 0 8px 36px rgba(39,160,201,.18), 0 2px 6px rgba(0,0,0,.08);
          transform: translateY(-2px);
        }

        @keyframes fadeUp {
          from { opacity:0; transform:translateY(16px); }
          to   { opacity:1; transform:translateY(0); }
        }
        .g-anim { opacity:0; animation: fadeUp .55s ease forwards; }
        .g-anim-1 { animation-delay:.05s; }
        .g-anim-2 { animation-delay:.15s; }
        .g-anim-3 { animation-delay:.25s; }
        .g-anim-4 { animation-delay:.35s; }
        .g-anim-5 { animation-delay:.45s; }
        .g-anim-6 { animation-delay:.55s; }

        .g-dot-grid {
          background-image: radial-gradient(circle, #27a0c9 1px, transparent 1px);
          background-size: 22px 22px;
        }

        @keyframes lbFadeIn {
          from { opacity:0; }
          to   { opacity:1; }
        }
        @keyframes lbScaleIn {
          from { opacity:0; transform:scale(.92); }
          to   { opacity:1; transform:scale(1); }
        }
        .lb-backdrop { animation: lbFadeIn .2s ease forwards; }
        .lb-img      { animation: lbScaleIn .22s ease forwards; }

        .g-nav-item { background: transparent; transition: background .15s ease; }
        .g-nav-item:hover { background: rgba(39,160,201,.05) !important; }
        .g-nav-item[data-active="true"] { background: rgba(39,160,201,.08) !important; }
        .g-nav-item .g-nav-num { color: #cbd5e1; transition: color .15s ease; }
        .g-nav-item:hover .g-nav-num,
        .g-nav-item[data-active="true"] .g-nav-num { color: #27a0c9; }
        .g-nav-item .g-nav-label { color: #64748b; transition: color .15s ease; }
        .g-nav-item:hover .g-nav-label,
        .g-nav-item[data-active="true"] .g-nav-label { color: #0f172a; }
      `}</style>

      {zoomed && (
        <div
          className="lb-backdrop fixed inset-0 z-[9999] flex items-center justify-center p-4 md:p-8"
          style={{
            background: "rgba(10,15,25,.88)",
            backdropFilter: "blur(6px)",
          }}
          onClick={() => setZoomed(null)}>
          <button
            className="absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center transition-colors cursor-pointer"
            style={{ background: "rgba(255,255,255,.12)", color: "white" }}
            onClick={() => setZoomed(null)}
            aria-label="Cerrar">
            <X className="h-5 w-5" />
          </button>
          <div
            className="lb-img relative max-w-[92vw] max-h-[88vh]"
            onClick={(e) => e.stopPropagation()}>
            <Image
              src={zoomed.src}
              alt={zoomed.alt}
              width={1600}
              height={1200}
              unoptimized
              className="rounded-xl object-contain max-w-[92vw] max-h-[88vh] w-auto h-auto"
              style={{ boxShadow: "0 24px 80px rgba(0,0,0,.6)" }}
            />
            <p
              className="g-sora text-center text-xs mt-3"
              style={{ color: "rgba(255,255,255,.45)" }}>
              {zoomed.alt} ·{" "}
              <span style={{ color: "rgba(255,255,255,.3)" }}>
                ESC para cerrar
              </span>
            </p>
          </div>
        </div>
      )}

      <div>
        <header className="relative bg-white border-b border-gray-100 py-14 overflow-hidden px-6 md:px-8">
          <div className="relative max-w-7xl mx-auto">
            <PageHeader
              className="g-anim g-anim-1 g-sora"
              backHref="/mis-certificados/guia"
              backLabel="Guías"
              eyebrow="Certificado de Producción · ARCA"
              icon={ShieldCheck}
              title="Habilitá el certificado de producción en ARCA"
              description="Seguí estos pasos para habilitar la Administración de Certificados Digitales, obtener tu certificado de producción y autorizar el web service en ARCA."
            />
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-6 md:px-8 xl:grid xl:grid-cols-[minmax(0,1fr)_240px] xl:gap-12 2xl:grid-cols-[minmax(0,1fr)_300px]">
          <div className="min-w-0 max-w-7xl py-10 space-y-14">
            <div
              className="g-anim g-anim-4 rounded-r-xl px-6 py-5 g-sora"
              style={{
                borderLeft: "4px solid #27a0c9",
                background: "rgba(39,160,201,.05)",
              }}>
              <div className="flex gap-3 items-start">
                <AlertTriangle
                  className="h-5 w-5 flex-shrink-0 mt-0.5"
                  style={{ color: "#27a0c9" }}
                />
                <div>
                  <p className="font-semibold text-gray-800 mb-2">
                    Ambiente de producción — facturas con validez fiscal real
                  </p>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• CUIT + Clave Fiscal con nivel de seguridad 3</li>
                    <li>• Acceso al Administrador de Relaciones habilitado</li>
                    <li>• Tener el CSR generado desde Connta</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Paso 1: Habilitar Administración de Certificados Digitales */}
            <Step
              id="habilitar-admin-cert"
              number="01"
              title="Habilitar Administración de Certificados Digitales"
              accentColor="#27a0c9"
              showConnector
              animClass="g-anim-4">
              <p className="g-sora text-gray-600 leading-relaxed mb-5">
                Ingresá a ARCA con tu CUIT y Clave Fiscal. Luego accedé al{" "}
                <strong className="text-gray-800">
                  &quot;Administrador de Relaciones de Clave Fiscal&quot;
                </strong>{" "}
                y seleccioná el contribuyente que vas a gestionar (si manejás
                uno solo, se selecciona automáticamente).
              </p>
              <StepImage
                src="/afip/guia-cert-prod/paso1-seleccionar-contribuyente.webp"
                alt="Administrador de Relaciones — seleccionar contribuyente"
                onZoom={setZoomed}
              />

              <p className="g-sora text-gray-600 leading-relaxed mt-6 mb-5">
                Hacé clic en{" "}
                <strong className="text-gray-800">
                  &quot;Adherir servicio&quot;
                </strong>{" "}
                y navegá a:
              </p>

              <div className="flex flex-wrap items-center gap-2 mb-6">
                {[
                  "ARCA",
                  "Servicios interactivos",
                  "Administración de Certificados Digitales",
                ].map((item, i, arr) => (
                  <span key={i} className="flex items-center gap-2">
                    <span
                      className="px-3 py-1.5 rounded-lg text-sm font-semibold g-sora"
                      style={{
                        background: "rgba(39,160,201,.1)",
                        color: "#1e7a9c",
                      }}>
                      {item}
                    </span>
                    {i < arr.length - 1 && (
                      <span className="text-gray-300 font-light">›</span>
                    )}
                  </span>
                ))}
              </div>

              <StepImage
                src="/afip/guia-cert-prod/paso1-seleccionar-admin-cert-digitales.webp"
                alt="Seleccionar Administración de Certificados Digitales en el menú"
                onZoom={setZoomed}
              />

              <p className="g-sora text-gray-600 leading-relaxed mt-6 mb-5">
                Revisá los datos y hacé clic en{" "}
                <strong className="text-gray-800">&quot;Confirmar&quot;</strong>{" "}
                para agregar el servicio. Una vez confirmado, la{" "}
                <strong className="text-gray-800">
                  Administración de Certificados Digitales
                </strong>{" "}
                estará disponible en tu escritorio de ARCA.
              </p>

              <StepImage
                src="/afip/guia-cert-prod/paso1-confirmar-agregar-servicio.webp"
                alt="Confirmar incorporación de Administración de Certificados Digitales"
                onZoom={setZoomed}
              />
            </Step>

            {/* Paso 2: Subir CSR y descargar certificado */}
            <Step
              id="obtener-certificado"
              number="02"
              title="Subir el CSR y descargar el certificado"
              accentColor="#27a0c9"
              showConnector
              animClass="g-anim-5">
              <p className="g-sora text-gray-600 leading-relaxed mb-5">
                Desde el escritorio de ARCA, buscá y abrí{" "}
                <strong className="text-gray-800">
                  &quot;Administración de Certificados Digitales&quot;
                </strong>
                .
              </p>

              <StepImage
                src="/afip/guia-cert-prod/paso2-acceder-admin-cert-digitales.webp"
                alt="Buscar Administración de Certificados Digitales en ARCA"
                onZoom={setZoomed}
              />

              <p className="g-sora text-gray-600 leading-relaxed mt-6 mb-5">
                Dentro del servicio vas a ver la lista de alias existentes. Hacé
                clic en{" "}
                <strong className="text-gray-800">
                  &quot;Agregar alias&quot;
                </strong>
                .
              </p>

              <StepImage
                src="/afip/guia-cert-prod/paso2-lista-alias-agregar.webp"
                alt="Lista de alias — botón Agregar alias"
                onZoom={setZoomed}
              />

              <p className="g-sora text-gray-600 leading-relaxed mt-6 mb-3">
                Completá el campo{" "}
                <strong className="text-gray-800">Alias</strong> con el nombre
                que usaste al generar el CSR (solo letras y números), luego hacé
                clic en{" "}
                <strong className="text-gray-800">&quot;Examinar&quot;</strong>{" "}
                para subir el archivo <code>.csr</code> y confirmá con{" "}
                <strong className="text-gray-800">
                  &quot;Agregar alias&quot;
                </strong>
                .
              </p>

              <div
                className="flex items-start gap-3 px-4 py-3 rounded-xl mb-5 g-sora text-sm text-gray-600"
                style={{
                  background: "rgba(39,160,201,.05)",
                  border: "1px solid rgba(39,160,201,.15)",
                }}>
                <AlertTriangle
                  className="h-4 w-4 flex-shrink-0 mt-0.5"
                  style={{ color: "#27a0c9" }}
                />
                El CSR no es el certificado. Es el archivo de solicitud que ARCA
                usa para generar el certificado firmado.
              </div>

              <StepImage
                src="/afip/guia-cert-prod/paso2-subir-csr.webp"
                alt="Formulario para subir el CSR"
                onZoom={setZoomed}
              />

              <p className="g-sora text-gray-600 leading-relaxed mt-6 mb-5">
                De vuelta en la lista, hacé clic en{" "}
                <strong className="text-gray-800">&quot;Ver&quot;</strong> en el
                alias que acabás de crear.
              </p>

              <StepImage
                src="/afip/guia-cert-prod/paso2-lista-alias-ver.webp"
                alt="Lista de alias — clic en Ver"
                onZoom={setZoomed}
              />

              <p className="g-sora text-gray-600 leading-relaxed mt-6 mb-5">
                En el detalle del alias vas a ver el certificado generado con su
                estado <strong className="text-gray-800">VÁLIDO</strong>. Hacé
                clic en el ícono de descarga para guardar el archivo{" "}
                <code>.crt</code>.
              </p>

              <StepImage
                src="/afip/guia-cert-prod/paso2-descargar-certificado.webp"
                alt="Detalle del certificado — descargar"
                onZoom={setZoomed}
              />
            </Step>

            {/* Paso 3: Autorizar Web Service */}
            <Step
              id="autorizar-wsfe"
              number="03"
              title="Autorizar el web service para el certificado"
              accentColor="#27a0c9"
              showConnector
              animClass="g-anim-6">
              <p className="g-sora text-gray-600 leading-relaxed mb-5">
                Volvé al{" "}
                <strong className="text-gray-800">
                  Administrador de Relaciones de Clave Fiscal
                </strong>{" "}
                y seleccioná el mismo contribuyente de antes.
              </p>

              <ol className="g-sora text-gray-600 text-sm space-y-4 mb-6 pl-0">
                <li className="flex gap-3">
                  <span
                    className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
                    style={{
                      background: "rgba(39,160,201,.12)",
                      color: "#1e7a9c",
                    }}>
                    1
                  </span>
                  <span>
                    Hacé clic en{" "}
                    <strong className="text-gray-800">
                      &quot;Nueva Relación&quot;
                    </strong>
                    .
                  </span>
                </li>
                <li className="flex gap-3">
                  <span
                    className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
                    style={{
                      background: "rgba(39,160,201,.12)",
                      color: "#1e7a9c",
                    }}>
                    2
                  </span>
                  <span>
                    En el campo{" "}
                    <strong className="text-gray-800">
                      &quot;Representante&quot;
                    </strong>{" "}
                    elegí{" "}
                    <strong className="text-gray-800">
                      &quot;Computadora&quot;
                    </strong>{" "}
                    (no &quot;Persona&quot;). Esto es porque el que actúa en tu
                    nombre es el software, no una persona física.
                  </span>
                </li>
                <li className="flex gap-3">
                  <span
                    className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
                    style={{
                      background: "rgba(39,160,201,.12)",
                      color: "#1e7a9c",
                    }}>
                    3
                  </span>
                  <span>En el selector de servicio navegá a:</span>
                </li>
              </ol>

              <div className="flex flex-wrap items-center gap-2 mb-3 ml-9">
                {["ARCA", "Web Services", "wsfe"].map((item, i, arr) => (
                  <span key={i} className="flex items-center gap-2">
                    <span
                      className="px-3 py-1.5 rounded-lg text-sm font-semibold g-sora"
                      style={{
                        background: "rgba(39,160,201,.1)",
                        color: "#1e7a9c",
                      }}>
                      {item}
                    </span>
                    {i < arr.length - 1 && (
                      <span className="text-gray-300 font-light">›</span>
                    )}
                  </span>
                ))}
              </div>
              <p className="g-sora text-xs text-gray-400 mb-6 ml-9">
                Puede aparecer como{" "}
                <strong className="text-gray-600">wsfe</strong>,{" "}
                <strong className="text-gray-600">Factura Electrónica</strong> o{" "}
                <strong className="text-gray-600">
                  Facturación Electrónica
                </strong>{" "}
                según el perfil.
              </p>

              <ol
                className="g-sora text-gray-600 text-sm space-y-4 mb-6 pl-0"
                start={4}>
                <li className="flex gap-3">
                  <span
                    className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
                    style={{
                      background: "rgba(39,160,201,.12)",
                      color: "#1e7a9c",
                    }}>
                    4
                  </span>
                  <span>
                    En la lista de certificados, seleccioná el alias que creaste
                    en el paso anterior.
                  </span>
                </li>
                <li className="flex gap-3">
                  <span
                    className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
                    style={{
                      background: "rgba(39,160,201,.12)",
                      color: "#1e7a9c",
                    }}>
                    5
                  </span>
                  <span>
                    Hacé clic en{" "}
                    <strong className="text-gray-800">
                      &quot;Confirmar&quot;
                    </strong>{" "}
                    dos veces (ARCA pide doble confirmación).
                  </span>
                </li>
              </ol>

              <div
                className="flex items-start gap-3 px-4 py-4 rounded-xl mb-6"
                style={{
                  background: "rgba(39,160,201,.06)",
                  border: "1px solid rgba(39,160,201,.18)",
                }}>
                <CheckCircle2
                  className="h-5 w-5 flex-shrink-0 mt-0.5"
                  style={{ color: "#27a0c9" }}
                />
                <div>
                  <p
                    className="g-sora font-semibold text-sm"
                    style={{ color: "#1e7a9c" }}>
                    Listo — el web service está autorizado
                  </p>
                  <p className="g-sora text-xs text-gray-500 mt-1">
                    El certificado queda vinculado al servicio de facturación
                    electrónica. Ahora falta registrar el Punto de Venta.
                  </p>
                </div>
              </div>
            </Step>

            {/* Paso 4: Registrar Punto de Venta RECE */}
            <Step
              id="registrar-pdv"
              number="04"
              title="Registrar el Punto de Venta para facturación electrónica"
              accentColor="#27a0c9"
              showConnector={false}
              animClass="g-anim-6">
              <div
                className="flex items-start gap-3 px-4 py-4 rounded-xl mb-6 g-sora text-sm text-gray-700"
                style={{
                  background: "rgba(245,158,11,.07)",
                  border: "1px solid rgba(245,158,11,.25)",
                }}>
                <AlertTriangle
                  className="h-4 w-4 flex-shrink-0 mt-0.5"
                  style={{ color: "#d97706" }}
                />
                <div>
                  <strong className="text-gray-800 block mb-1">
                    El Punto de Venta de &quot;Comprobante en Línea&quot; no es
                    el mismo
                  </strong>
                  Si ya emitís facturas desde la web de ARCA, eso usa un tipo de
                  PDV diferente (&quot;Comprobante en Línea&quot;). Para usar
                  Connta necesitás un PDV de tipo{" "}
                  <strong className="text-gray-800">RECE</strong> — es un
                  trámite de un minuto.
                </div>
              </div>

              <div
                className="flex items-start gap-3 px-4 py-3 rounded-xl mb-5 g-sora text-sm text-gray-700"
                style={{
                  background: "rgba(39,160,201,.05)",
                  border: "1px solid rgba(39,160,201,.15)",
                }}>
                <AlertTriangle
                  className="h-4 w-4 flex-shrink-0 mt-0.5"
                  style={{ color: "#27a0c9" }}
                />
                <span>
                  <strong className="text-gray-800">
                    No uses &quot;PVE - Gestión de Puntos de Venta&quot;
                  </strong>{" "}
                  — ese servicio es solo para empresas que representás como
                  apoderado. Para tu propio CUIT necesitás el servicio que se
                  describe a continuación.
                </span>
              </div>

              <ol className="g-sora text-gray-600 text-sm space-y-4 mb-6 pl-0">
                <li className="flex gap-3">
                  <span
                    className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
                    style={{
                      background: "rgba(39,160,201,.12)",
                      color: "#1e7a9c",
                    }}>
                    1
                  </span>
                  <span>
                    Desde el escritorio de ARCA, buscá y accedé a{" "}
                    <strong className="text-gray-800">
                      &quot;Administración de Puntos de Venta y Domicilios&quot;
                    </strong>
                    .
                  </span>
                </li>
              </ol>

              <ol className="g-sora text-gray-600 text-sm space-y-4 my-6 pl-0">
                <li className="flex gap-3">
                  <span
                    className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
                    style={{
                      background: "rgba(39,160,201,.12)",
                      color: "#1e7a9c",
                    }}>
                    2
                  </span>
                  <div>
                    <span className="text-gray-600">
                      Si sos <strong className="text-gray-800">empresa</strong>:
                      seleccioná tu CUIT en el selector y continuá al paso 3.
                    </span>
                    <p className="text-gray-600 mt-2">
                      Si sos{" "}
                      <strong className="text-gray-800">
                        persona física y tu CUIT no aparece
                      </strong>{" "}
                      en la lista, primero tenés que delegarte acceso a vos
                      mismo. Hacé esto una sola vez:
                    </p>
                    <ol
                      className="mt-2 space-y-1.5 text-gray-600 pl-4"
                      style={{ listStyleType: "lower-alpha" }}>
                      <li>
                        Andá al{" "}
                        <strong className="text-gray-800">
                          Administrador de Relaciones
                        </strong>{" "}
                        en la barra superior de ARCA.
                      </li>
                      <li>Seleccioná tu propio CUIT como contribuyente.</li>
                      <li>
                        Hacé clic en{" "}
                        <strong className="text-gray-800">
                          &quot;Adherir Servicio&quot;
                        </strong>{" "}
                        y navegá a:{" "}
                        <strong className="text-gray-800">
                          ARCA → Servicios interactivos → Administración de
                          Puntos de Venta y Domicilios
                        </strong>
                        . Confirmá.
                      </li>
                      <li>
                        Volvé a{" "}
                        <strong className="text-gray-800">
                          Administración de Puntos de Venta y Domicilios
                        </strong>{" "}
                        — tu CUIT ya debería aparecer en el selector.
                      </li>
                    </ol>
                  </div>
                </li>
                <li className="flex gap-3">
                  <span
                    className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
                    style={{
                      background: "rgba(39,160,201,.12)",
                      color: "#1e7a9c",
                    }}>
                    3
                  </span>
                  <span>
                    Hacé clic en{" "}
                    <strong className="text-gray-800">
                      &quot;A/B/M Puntos de Venta&quot;
                    </strong>{" "}
                    →{" "}
                    <strong className="text-gray-800">
                      &quot;Agregar&quot;
                    </strong>{" "}
                    y asigná un número (ej:{" "}
                    <strong className="text-gray-800">3</strong> si ya tenés PDV
                    1 y 2).
                  </span>
                </li>
              </ol>

              <StepImage
                src="/afip/guia-cert-prod/paso4-lista-pdv-agregar.png"
                alt="Lista de PDVs existentes — botón Agregar"
                onZoom={setZoomed}
              />

              <ol className="g-sora text-gray-600 text-sm space-y-4 my-6 pl-0">
                <li className="flex gap-3">
                  <span
                    className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
                    style={{
                      background: "rgba(39,160,201,.12)",
                      color: "#1e7a9c",
                    }}>
                    4
                  </span>
                  <span>
                    En el campo{" "}
                    <strong className="text-gray-800">
                      &quot;Sistema&quot;
                    </strong>
                    , seleccioná{" "}
                    <strong className="text-gray-800">
                      &quot;RECE para aplicativo y web services&quot;
                    </strong>
                    . Completá también el campo{" "}
                    <strong className="text-gray-800">&quot;Nuevo domicilio&quot;</strong>{" "}
                    seleccionando tu domicilio fiscal. Guardá — el PDV queda activo de forma inmediata.
                  </span>
                </li>
              </ol>

              <StepImage
                src="/afip/guia-cert-prod/paso4-alta-pdv-rece.png"
                alt="Formulario alta de PDV — Sistema RECE para aplicativo y web services"
                onZoom={setZoomed}
              />

              <div
                className="mt-4 flex items-start gap-3 px-4 py-4 rounded-xl mb-6"
                style={{
                  background: "rgba(39,160,201,.06)",
                  border: "1px solid rgba(39,160,201,.18)",
                }}>
                <CheckCircle2
                  className="h-5 w-5 flex-shrink-0 mt-0.5"
                  style={{ color: "#27a0c9" }}
                />
                <div>
                  <p
                    className="g-sora font-semibold text-sm"
                    style={{ color: "#1e7a9c" }}>
                    Todo listo — podés empezar a facturar
                  </p>
                  <p className="g-sora text-xs text-gray-500 mt-1">
                    En Connta, al hacer clic en &quot;Consultar&quot;
                    en el campo Punto de Venta, vas a ver el PDV que acabás de
                    registrar.
                  </p>
                </div>
              </div>
            </Step>

            {/* CTA final */}
            <div
              className="g-anim g-anim-6 relative rounded-2xl overflow-hidden p-8 md:p-10"
              style={{
                background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
              }}>
              <div
                className="g-dot-grid absolute inset-0 pointer-events-none"
                style={{ opacity: 0.04 }}
              />
              <div
                className="absolute pointer-events-none"
                style={{
                  right: "-60px",
                  top: "-60px",
                  width: "260px",
                  height: "260px",
                  borderRadius: "50%",
                  background:
                    "radial-gradient(circle, rgba(39,160,201,.35) 0%, transparent 70%)",
                }}
              />
              <div
                className="absolute pointer-events-none"
                style={{
                  left: "-30px",
                  bottom: "-30px",
                  width: "180px",
                  height: "180px",
                  borderRadius: "50%",
                  background:
                    "radial-gradient(circle, rgba(39,160,201,.15) 0%, transparent 70%)",
                }}
              />
              <div className="relative">
                <div
                  className="inline-flex items-center gap-2 px-3 py-1 rounded-full g-sora text-xs font-medium mb-5"
                  style={{
                    background: "rgba(255,255,255,.1)",
                    color: "rgba(255,255,255,.65)",
                  }}>
                  Siguiente paso
                </div>
                <h3 className="g-sora text-2xl md:text-3xl font-bold text-white mb-3 leading-snug">
                  Subir el certificado
                  <br />
                  en Connta
                </h3>
                <p
                  className="g-sora text-sm leading-relaxed mb-8 max-w-md"
                  style={{ color: "rgba(255,255,255,.55)" }}>
                  Una vez que descargaste el{" "}
                  <strong style={{ color: "rgba(255,255,255,.8)" }}>
                    certificado firmado (.crt)
                  </strong>{" "}
                  desde ARCA, subilo en la sección de certificados para activar
                  la facturación en producción.
                </p>
                <Link
                  href="/mis-certificados/configurar"
                  className="inline-flex items-center gap-2.5 px-6 py-3 rounded-xl g-sora font-semibold text-sm text-white transition-all duration-200 hover:gap-4 hover:brightness-110"
                  style={{
                    background: "#27a0c9",
                    boxShadow: "0 0 28px rgba(39,160,201,.45)",
                  }}>
                  Ir a Configurar Certificado
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>

          <aside className="hidden xl:block py-10">
            <div className="sticky top-28 rounded-2xl border border-gray-200 bg-white/88 px-5 py-5 backdrop-blur">
              <p className="g-sora text-xs font-semibold uppercase tracking-[0.18em] text-gray-400">
                En esta guía
              </p>
              <nav className="mt-4 space-y-1.5">
                {PRODUCTION_SECTIONS.map((section, index) => {
                  const isActive = section.id === activeSection;

                  return (
                    <a
                      key={section.id}
                      href={`#${section.id}`}
                      data-active={isActive}
                      onClick={() => setActiveSection(section.id)}
                      className="g-nav-item flex items-start gap-3 rounded-xl px-3 py-2.5">
                      <span className="g-condensed g-nav-num text-lg leading-none">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <span className="g-sora g-nav-label text-sm leading-snug">
                        {section.label}
                      </span>
                    </a>
                  );
                })}
              </nav>
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}

interface StepProps {
  id: string;
  number: string;
  title: string;
  accentColor: string;
  showConnector: boolean;
  animClass: string;
  children: React.ReactNode;
}

function Step({
  id,
  number,
  title,
  accentColor,
  showConnector,
  animClass,
  children,
}: StepProps) {
  return (
    <div
      id={id}
      className={`g-anim ${animClass} flex gap-6 md:gap-8`}
      style={{ scrollMarginTop: "120px" }}>
      <div className="flex flex-col items-center flex-shrink-0">
        <div
          className="g-condensed w-14 h-14 md:w-16 md:h-16 rounded-2xl flex items-center justify-center text-white text-xl md:text-2xl font-black flex-shrink-0"
          style={{
            background: `linear-gradient(145deg, ${accentColor} 0%, ${darken(accentColor)} 100%)`,
            boxShadow: `0 4px 20px ${accentColor}44`,
          }}>
          {number}
        </div>
        {showConnector && (
          <div
            className="flex-1 w-px mt-4"
            style={{
              background: `linear-gradient(to bottom, ${accentColor}50, transparent)`,
              minHeight: "40px",
            }}
          />
        )}
      </div>
      <div className="flex-1 min-w-0 pb-2">
        <h2 className="g-sora text-xl md:text-2xl font-bold text-gray-900 mb-4 leading-snug">
          {title}
        </h2>
        {children}
      </div>
    </div>
  );
}

interface StepImageProps {
  src: string;
  alt: string;
  onZoom: (img: ZoomedImage) => void;
}

function StepImage({ src, alt, onZoom }: StepImageProps) {
  const [exists, setExists] = useState(true);

  if (!exists) {
    return (
      <div
        className="rounded-xl flex items-center justify-center py-12"
        style={{
          background: "rgba(39,160,201,.04)",
          border: "2px dashed rgba(39,160,201,.2)",
        }}>
        <p className="g-sora text-sm text-gray-400">
          Captura de pantalla próximamente
        </p>
      </div>
    );
  }

  return (
    <div
      className="g-img-card group relative rounded-xl overflow-hidden border border-gray-100"
      onClick={() => onZoom({ src, alt })}>
      <Image
        src={src}
        alt={alt}
        width={1400}
        height={900}
        className="w-full h-auto object-contain bg-white"
        onError={() => setExists(false)}
      />
      <div
        className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200"
        style={{ background: "rgba(39,160,201,.08)" }}>
        <div
          className="flex items-center gap-2 px-3 py-2 rounded-full g-sora text-xs font-semibold"
          style={{
            background: "rgba(15,23,42,.75)",
            color: "white",
            backdropFilter: "blur(4px)",
          }}>
          <ZoomIn className="h-3.5 w-3.5" />
          Ampliar imagen
        </div>
      </div>
    </div>
  );
}

function darken(hex: string): string {
  const map: Record<string, string> = {
    "#27a0c9": "#1e7a9c",
  };
  return map[hex] ?? hex;
}
