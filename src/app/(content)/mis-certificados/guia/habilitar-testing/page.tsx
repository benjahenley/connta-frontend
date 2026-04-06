"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import {
  Info,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  AlertTriangle,
  FileKey,
  ShieldPlus,
  X,
  ZoomIn,
} from "lucide-react";

interface ZoomedImage {
  src: string;
  alt: string;
}

const TESTING_SECTIONS = [
  { id: "ingresar-administrador", label: "Ingresar al Administrador" },
  { id: "adherir-wsass", label: "Adherir WSASS" },
  { id: "confirmar-acceso", label: "Confirmar acceso" },
  { id: "crear-certificado", label: "Crear certificado" },
  { id: "autorizar-wsfe", label: "Autorizar wsfe" },
] as const;

export default function HabilitarAdministradorTesting() {
  const [zoomed, setZoomed] = useState<ZoomedImage | null>(null);
  const [activeSection, setActiveSection] = useState<string>(
    TESTING_SECTIONS[0].id,
  );

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

  // Track whether a click-initiated scroll is in progress
  const skipScrollRef = useRef(false);

  const handleNavClick = (sectionId: string) => {
    setActiveSection(sectionId);
    // Suppress scroll handler during the click-initiated scroll
    skipScrollRef.current = true;
    setTimeout(() => {
      skipScrollRef.current = false;
    }, 800); // enough time for smooth scroll to finish
  };

  useEffect(() => {
    const elements = TESTING_SECTIONS.map((section) =>
      document.getElementById(section.id),
    ).filter((element): element is HTMLElement => element !== null);

    if (elements.length === 0) return;

    const TRIGGER_OFFSET = 140;

    const updateActiveSection = () => {
      if (skipScrollRef.current) return;

      let currentId = elements[0].id;
      for (const el of elements) {
        if (el.getBoundingClientRect().top <= TRIGGER_OFFSET) {
          currentId = el.id;
        }
      }
      setActiveSection(currentId);
    };

    updateActiveSection();
    window.addEventListener("scroll", updateActiveSection, { passive: true });

    return () => window.removeEventListener("scroll", updateActiveSection);
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
        .g-anim-7 { animation-delay:.65s; }
        .g-anim-8 { animation-delay:.75s; }
        .g-anim-9 { animation-delay:.85s; }

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
              eyebrow="Certificado de Homologación · ARCA"
              icon={ShieldCheck}
              title="Habilitá el certificado de testing en ARCA"
              description="Seguí estos pasos para activar el servicio WSASS y poder gestionar certificados de homologación desde tu cuenta ARCA."
            />
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-6 md:px-8 xl:grid xl:grid-cols-[minmax(0,1fr)_240px] xl:gap-12">
          <div className="min-w-0 max-w-5xl py-10 space-y-14">
            <div
              id="requisitos-previos"
              className="g-anim g-anim-4 rounded-r-xl px-6 py-5 g-sora"
              style={{
                scrollMarginTop: "120px",
                borderLeft: "4px solid #27a0c9",
                background: "rgba(39,160,201,.05)",
              }}>
              <div className="flex gap-3 items-start">
                <Info
                  className="h-5 w-5 flex-shrink-0 mt-0.5"
                  style={{ color: "#27a0c9" }}
                />
                <div>
                  <p className="font-semibold text-gray-800 mb-2">
                    Requisitos previos
                  </p>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• CUIT + Clave Fiscal activos</li>
                    <li>
                      • Nivel de seguridad habilitado para el Administrador de
                      Relaciones
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <Step
              id="ingresar-administrador"
              number="01"
              title="Ingresar al Administrador de Relaciones"
              accentColor="#27a0c9"
              showConnector
              animClass="g-anim-4">
              <p className="g-sora text-gray-600 leading-relaxed mb-6">
                Ingresá a ARCA con tu CUIT y Clave Fiscal. Luego seleccioná{" "}
                <strong className="text-gray-800">
                  &quot;Administrador de Relaciones de Clave Fiscal&quot;
                </strong>
                . Si administrás relaciones de otros contribuyentes, elegí a
                quién gestionar.
              </p>
              <StepImage
                src="/afip/arca-habilitar-testing.webp"
                alt="Administrador de Relaciones de Clave Fiscal"
                onZoom={setZoomed}
              />
            </Step>

            <Step
              id="adherir-wsass"
              number="02"
              title="Adherir el servicio WSASS de Homologación"
              accentColor="#27a0c9"
              showConnector
              animClass="g-anim-5">
              <p className="g-sora text-gray-600 leading-relaxed mb-5">
                Dentro del Administrador de Relaciones, navegá a:
              </p>

              <div className="flex flex-wrap items-center gap-2 mb-6">
                {[
                  "ARCA",
                  "Servicios interactivos",
                  "WSASS - Autogestión Certificados Homologación",
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

              <p className="g-sora text-gray-600 leading-relaxed mb-6">
                Este servicio te permitirá gestionar certificados de
                testing/homologación.
              </p>

              <div className="space-y-4">
                <StepImage
                  src="/afip/arca-habilitar-testing-2.webp"
                  alt="Adherir servicio WSASS"
                  onZoom={setZoomed}
                />
                <StepImage
                  src="/afip/arca-habilitar-testing-3.webp"
                  alt="Seleccionar WSASS - Autogestión Certificados Homologación"
                  onZoom={setZoomed}
                />
              </div>

              <div
                className="flex items-start gap-3 px-4 py-4 rounded-xl mt-6"
                style={{
                  background: "rgba(39,160,201,.06)",
                  border: "1px solid rgba(39,160,201,.18)",
                }}>
                <AlertTriangle
                  className="h-5 w-5 flex-shrink-0 mt-0.5"
                  style={{ color: "#27a0c9" }}
                />
                <div>
                  <p
                    className="g-sora font-semibold text-sm"
                    style={{ color: "#1e7a9c" }}>
                    ¿Ves el error &quot;La autorización ya existe&quot;?
                  </p>
                  <p className="g-sora text-xs text-gray-500 mt-1">
                    Significa que el servicio WSASS ya está habilitado en tu
                    cuenta. Podés saltar este paso e ir directamente al servicio
                    desde tu escritorio de ARCA.
                  </p>
                </div>
              </div>
            </Step>

            <Step
              id="confirmar-acceso"
              number="03"
              title="Confirmar acceso y verificar en el escritorio"
              accentColor="#27a0c9"
              showConnector
              animClass="g-anim-6">
              <p className="g-sora text-gray-600 leading-relaxed mb-5">
                Revisá los datos y hacé clic en{" "}
                <strong className="text-gray-800">&quot;Confirmar&quot;</strong>{" "}
                para completar la adhesión. Luego volvé al buscador de servicios
                de ARCA y verificá que aparezca el servicio.
              </p>

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
                    WSASS - Autogestión Certificados Homologación
                  </p>
                  <p className="g-sora text-xs text-gray-500 mt-1">
                    Si ves esta app en tu escritorio de ARCA, este paso ya está
                    completo.
                  </p>
                </div>
              </div>

              <StepImage
                src="/afip/arca-habilitar-testing-4.webp"
                alt="WSASS visible en ARCA"
                onZoom={setZoomed}
              />
            </Step>

            <Step
              id="crear-certificado"
              number="04"
              title="Crear el certificado en WSASS"
              accentColor="#27a0c9"
              showConnector
              animClass="g-anim-7">
              <p className="g-sora text-gray-600 leading-relaxed mb-5">
                Desde tu escritorio de ARCA, abrí{" "}
                <strong className="text-gray-800">
                  &quot;WSASS - Autogestión Certificados Homologación&quot;
                </strong>
                . Dentro del servicio, hacé clic en{" "}
                <strong className="text-gray-800">
                  &quot;Nuevo Certificado&quot;
                </strong>
                .
              </p>

              <div
                className="flex items-center gap-3 px-4 py-3.5 rounded-xl mb-6 g-sora"
                style={{
                  background: "rgba(39,160,201,.06)",
                  border: "1px solid rgba(39,160,201,.15)",
                }}>
                <Info
                  className="h-4 w-4 flex-shrink-0"
                  style={{ color: "#27a0c9" }}
                />
                <p className="text-sm text-gray-600">
                  ¿Todavía no tenés el CSR?{" "}
                  <Link
                    href="/mis-certificados/configurar"
                    className="font-semibold hover:underline"
                    style={{ color: "#27a0c9" }}>
                    Generalo desde acá
                    <ArrowRight className="inline h-3.5 w-3.5 ml-1" />
                  </Link>
                </p>
              </div>

              <div
                className="rounded-xl px-5 py-4 mb-6"
                style={{
                  background: "rgba(39,160,201,.04)",
                  border: "1px solid rgba(39,160,201,.15)",
                }}>
                <div className="space-y-3 g-sora text-sm">
                  <div className="flex items-start gap-3">
                    <FileKey
                      className="h-4 w-4 flex-shrink-0 mt-0.5"
                      style={{ color: "#27a0c9" }}
                    />
                    <div>
                      <p className="font-semibold text-gray-800">
                        Campo 1 — &quot;Nombre simbólico del DN&quot;
                      </p>
                      <p className="text-gray-500 mt-0.5">
                        Ingresá el nombre del certificado. Usá el mismo nombre
                        (CN) que elegiste al generar el CSR en Connta.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <FileKey
                      className="h-4 w-4 flex-shrink-0 mt-0.5"
                      style={{ color: "#27a0c9" }}
                    />
                    <div>
                      <p className="font-semibold text-gray-800">
                        Campo 2 — &quot;Solicitud del certificado en formato
                        PKCS#10&quot;
                      </p>
                      <p className="text-gray-500 mt-0.5">
                        Pegá el contenido completo del CSR que copiaste desde
                        Connta (empieza con{" "}
                        <code
                          className="px-1.5 py-0.5 rounded text-xs"
                          style={{
                            background: "rgba(39,160,201,.1)",
                            color: "#1e7a9c",
                          }}>
                          -----BEGIN CERTIFICATE REQUEST-----
                        </code>
                        ).
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <p className="g-sora text-gray-600 leading-relaxed mb-6">
                Hacé clic en{" "}
                <strong className="text-gray-800">
                  &quot;Crear DN y obtener certificado&quot;
                </strong>
                . El certificado aparecerá debajo del formulario — copialo o
                descargalo y guardalo en tu computadora.
              </p>

              <StepImage
                src="/afip/guia-wsass-nuevo-certificado.png"
                alt="Crear certificado en WSASS — Nuevo Certificado"
                onZoom={setZoomed}
              />
              <StepImage
                src="/afip/guia-wsass-crear-certificado.png"
                alt="Crear DN y obtener certificado"
                onZoom={setZoomed}
              />
            </Step>

            <Step
              id="autorizar-wsfe"
              number="05"
              title="Autorizar el certificado para wsfe"
              accentColor="#27a0c9"
              showConnector={false}
              animClass="g-anim-8">
              <p className="g-sora text-gray-600 leading-relaxed mb-5">
                Todavía dentro de WSASS, hacé clic en{" "}
                <strong className="text-gray-800">
                  &quot;Crear autorización a servicio&quot;
                </strong>{" "}
                y completá los campos:
              </p>

              <div
                className="rounded-xl px-5 py-4 mb-6"
                style={{
                  background: "rgba(39,160,201,.04)",
                  border: "1px solid rgba(39,160,201,.15)",
                }}>
                <div className="space-y-3 g-sora text-sm">
                  <div className="flex items-start gap-3">
                    <ShieldPlus
                      className="h-4 w-4 flex-shrink-0 mt-0.5"
                      style={{ color: "#27a0c9" }}
                    />
                    <div>
                      <p className="font-semibold text-gray-800">
                        Campo 1 — &quot;Nombre simbólico del DN a
                        autorizar&quot;
                      </p>
                      <p className="text-gray-500 mt-0.5">
                        Seleccioná el certificado que acabás de crear en el paso
                        anterior.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <ShieldPlus
                      className="h-4 w-4 flex-shrink-0 mt-0.5"
                      style={{ color: "#27a0c9" }}
                    />
                    <div>
                      <p className="font-semibold text-gray-800">
                        Campo 3 — &quot;CUIT representado&quot;
                      </p>
                      <p className="text-gray-500 mt-0.5">
                        Ingresá el CUIT para el cual querés usar el web service.
                        En testing te recomendamos usar tu propio CUIT.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <ShieldPlus
                      className="h-4 w-4 flex-shrink-0 mt-0.5"
                      style={{ color: "#27a0c9" }}
                    />
                    <div>
                      <p className="font-semibold text-gray-800">
                        Campo 5 — &quot;Servicio al que desea acceder&quot;
                      </p>
                      <p className="text-gray-500 mt-0.5">
                        Seleccioná{" "}
                        <strong className="text-gray-800">wsfe</strong> (Factura
                        Electrónica).
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <p className="g-sora text-gray-600 leading-relaxed mb-6">
                Hacé clic en{" "}
                <strong className="text-gray-800">
                  &quot;Crear autorización de acceso&quot;
                </strong>
                . Verificá que aparezca en la sección{" "}
                <strong className="text-gray-800">
                  &quot;Autorizaciones&quot;
                </strong>
                .
              </p>

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
                    Certificado autorizado para wsfe
                  </p>
                  <p className="g-sora text-xs text-gray-500 mt-1">
                    Si ves la autorización en la lista, tu certificado de
                    testing ya está listo para usar.
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <StepImage
                  src="/afip/guia-wsass-crear-autorizacion.png"
                  alt="Formulario Crear autorización a servicio en WSASS"
                  onZoom={setZoomed}
                />
                <StepImage
                  src="/afip/guia-wsass-autorizacion-creada.png"
                  alt="Autorización wsfe creada exitosamente"
                  onZoom={setZoomed}
                />
                <StepImage
                  src="/afip/guia-wsass-autorizaciones-lista.png"
                  alt="Lista de Autorizaciones en WSASS"
                  onZoom={setZoomed}
                />
              </div>
            </Step>

            <div
              className="g-anim g-anim-9 relative rounded-2xl overflow-hidden p-8 md:p-10"
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
                    "radial-gradient(circle, rgba(39,160,201,.18) 0%, transparent 70%)",
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
                  Subir el certificado en
                  <br />
                  Connta
                </h3>
                <p
                  className="g-sora text-sm leading-relaxed mb-8 max-w-md"
                  style={{ color: "rgba(255,255,255,.55)" }}>
                  Ya tenés el{" "}
                  <strong style={{ color: "rgba(255,255,255,.8)" }}>
                    certificado firmado (.crt)
                  </strong>{" "}
                  de ARCA. Ahora subilo en Connta para activar la
                  facturación de testing.
                </p>
                <Link
                  href="/mis-certificados/configurar"
                  className="inline-flex items-center gap-2.5 px-6 py-3 rounded-xl g-sora font-semibold text-sm text-white transition-all duration-200 hover:gap-4 hover:brightness-110"
                  style={{
                    background: "#27a0c9",
                    boxShadow: "0 0 28px rgba(39,160,201,.45)",
                  }}>
                  Ir a Subir Certificado
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
                {TESTING_SECTIONS.map((section, index) => {
                  const isActive = section.id === activeSection;

                  return (
                    <a
                      key={section.id}
                      href={`#${section.id}`}
                      onClick={() => handleNavClick(section.id)}
                      className="group flex items-start gap-3 rounded-xl px-3 py-2.5 transition-colors"
                      style={{
                        background: isActive
                          ? "rgba(39,160,201,.08)"
                          : "transparent",
                      }}>
                      <span
                        className="g-condensed text-lg leading-none"
                        style={{ color: isActive ? "#27a0c9" : "#cbd5e1" }}>
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <span
                        className="g-sora text-sm leading-snug transition-colors"
                        style={{ color: isActive ? "#0f172a" : "#64748b" }}>
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
