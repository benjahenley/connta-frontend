"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import {
  Info,
  CheckCircle2,
  ArrowRight,
  MapPin,
  AlertTriangle,
  ShieldPlus,
  X,
  ZoomIn,
} from "lucide-react";

interface ZoomedImage {
  src: string;
  alt: string;
}

type Env = "testing" | "produccion";

interface PadronGuideProps {
  initialEnv?: Env;
  showToggle?: boolean;
}

const TESTING_SECTIONS = [
  { id: "ingresar-wsass", label: "Ingresar a WSASS" },
  { id: "crear-autorizacion", label: "Crear autorización" },
  { id: "verificar-autorizacion", label: "Verificar autorización" },
  { id: "verificar-direcciones", label: "Verificar en Connta" },
] as const;

const PROD_SECTIONS = [
  { id: "ingresar-administrador", label: "Ingresar al Administrador" },
  { id: "nueva-relacion", label: "Crear nueva relación" },
  { id: "confirmar-relacion", label: "Confirmar relación" },
  { id: "verificar-direcciones", label: "Verificar en Connta" },
] as const;

export default function PadronGuide({
  initialEnv = "testing",
  showToggle = true,
}: PadronGuideProps) {
  const [zoomed, setZoomed] = useState<ZoomedImage | null>(null);
  const [env, setEnv] = useState<Env>(initialEnv);
  const sections = env === "testing" ? TESTING_SECTIONS : PROD_SECTIONS;
  const [activeSection, setActiveSection] = useState<string>(sections[0].id);

  // Reset active section when switching env
  useEffect(() => {
    const s = env === "testing" ? TESTING_SECTIONS : PROD_SECTIONS;
    setActiveSection(s[0].id);
  }, [env]);

  useEffect(() => {
    setEnv(initialEnv);
  }, [initialEnv]);

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

  const skipScrollRef = useRef(false);

  const handleNavClick = (sectionId: string) => {
    setActiveSection(sectionId);
    skipScrollRef.current = true;
    setTimeout(() => {
      skipScrollRef.current = false;
    }, 800);
  };

  useEffect(() => {
    const currentSections =
      env === "testing" ? TESTING_SECTIONS : PROD_SECTIONS;
    const elements = currentSections
      .map((section) => document.getElementById(section.id))
      .filter((element): element is HTMLElement => element !== null);

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
  }, [env]);

  return (
    <>
      <style>{`
        .g-condensed { font-family: var(--font-condensed), ui-sans-serif, system-ui, sans-serif; }
        .g-sora      { font-family: var(--font-sora), ui-sans-serif, system-ui, sans-serif; }

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
              eyebrow={
                env === "testing"
                  ? "Padrón de Contribuyentes · Homologación"
                  : "Padrón de Contribuyentes · Producción"
              }
              icon={MapPin}
              title={
                env === "testing"
                  ? "Habilitá la consulta de domicilio fiscal en testing"
                  : "Habilitá la consulta de domicilio fiscal en producción"
              }
              description={
                env === "testing"
                  ? "Seguí estos pasos para autorizar el servicio de consulta de constancia de inscripción en homologación y que Connta pueda completar automáticamente la dirección fiscal de los receptores durante tus pruebas."
                  : "Seguí estos pasos para autorizar el servicio de consulta de constancia de inscripción en producción y que Connta pueda completar automáticamente la dirección fiscal de los receptores al emitir comprobantes reales."
              }
            />

            {showToggle && (
              <div className="g-anim g-anim-2 mt-6">
                <EnvToggle value={env} onChange={setEnv} />
              </div>
            )}
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-6 md:px-8 xl:grid xl:grid-cols-[minmax(0,1fr)_280px] xl:gap-12">
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
                    ¿Por qué necesito esto?
                  </p>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>
                      • Al cargar tu planilla, Connta intenta obtener el
                      domicilio fiscal de cada receptor usando su CUIT
                    </li>
                    <li>
                      • Si tu certificado no tiene autorizado el servicio de
                      padrón, las direcciones quedarán vacías
                    </li>
                    <li>
                      • El comprobante se genera igual, pero sin domicilio en el
                      PDF
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {env === "testing" ? (
              <TestingSteps onZoom={setZoomed} />
            ) : (
              <ProductionSteps onZoom={setZoomed} />
            )}

            {/* Step: Verify in Connta — shared */}
            <Step
              id="verificar-direcciones"
              number="04"
              title="Volver a Connta y resolver las direcciones"
              accentColor="#27a0c9"
              showConnector={false}
              animClass="g-anim-8">
              <p className="g-sora text-gray-600 leading-relaxed mb-5">
                Una vez habilitado el servicio en ARCA, volvé a la pantalla de
                previsualización de tu planilla en Connta. Vas a ver un botón{" "}
                <strong className="text-gray-800">
                  &quot;Resolver direcciones&quot;
                </strong>{" "}
                que re-consulta el domicilio fiscal de todas las CUITs sin
                dirección — sin necesidad de volver a cargar el archivo.
              </p>

              <div
                className="flex items-start gap-3 px-4 py-4 rounded-xl mb-6"
                style={{
                  background: "rgba(16,185,129,.06)",
                  border: "1px solid rgba(16,185,129,.18)",
                }}>
                <CheckCircle2
                  className="h-5 w-5 flex-shrink-0 mt-0.5"
                  style={{ color: "#10b981" }}
                />
                <div>
                  <p
                    className="g-sora font-semibold text-sm"
                    style={{ color: "#065f46" }}>
                    No necesitás volver a subir la planilla
                  </p>
                  <p className="g-sora text-xs text-gray-500 mt-1">
                    Connta re-consulta las direcciones faltantes directamente
                    desde ARCA y actualiza los comprobantes automáticamente.
                  </p>
                </div>
              </div>

              <StepImage
                src="/afip/guia-padron-resolver-direcciones.png"
                alt="Botón Resolver direcciones en la previsualización"
                onZoom={setZoomed}
              />
            </Step>

            {/* CTA footer */}
            <div
              className="g-anim g-anim-9 relative rounded-2xl overflow-hidden p-8 md:p-10"
              style={{
                background:
                  "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
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
                  Listo
                </div>
                <h3 className="g-sora text-2xl md:text-3xl font-bold text-white mb-3 leading-snug">
                  Direcciones habilitadas
                </h3>
                <p
                  className="g-sora text-sm leading-relaxed mb-8 max-w-md"
                  style={{ color: "rgba(255,255,255,.55)" }}>
                  A partir de ahora, cada vez que cargues una planilla Connta va
                  a resolver automáticamente el domicilio fiscal de cada
                  receptor.
                </p>
                <Link
                  href="/facturacion"
                  className="inline-flex items-center gap-2.5 px-6 py-3 rounded-xl g-sora font-semibold text-sm text-white transition-all duration-200 hover:gap-4 hover:brightness-110"
                  style={{
                    background: "#27a0c9",
                    boxShadow: "0 0 28px rgba(39,160,201,.45)",
                  }}>
                  Ir a Facturación
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <aside className="hidden xl:block py-10">
            <div className="sticky top-28 rounded-2xl border border-gray-200 bg-white/88 px-5 py-5 backdrop-blur">
              <p className="g-sora text-xs font-semibold uppercase tracking-[0.18em] text-gray-400">
                En esta guía
              </p>
              <nav className="mt-4 space-y-1.5">
                {sections.map((section, index) => {
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

/* ── Environment toggle ─────────────────────────────────────── */

function EnvToggle({
  value,
  onChange,
}: {
  value: Env;
  onChange: (v: Env) => void;
}) {
  return (
    <div
      className="inline-flex rounded-xl p-1 g-sora"
      style={{ background: "rgba(39,160,201,.08)" }}>
      {(["testing", "produccion"] as const).map((option) => {
        const active = value === option;
        return (
          <button
            key={option}
            onClick={() => onChange(option)}
            className="relative px-5 py-2 rounded-lg text-sm font-semibold transition-all cursor-pointer"
            style={{
              background: active ? "white" : "transparent",
              color: active ? "#0f172a" : "#64748b",
              boxShadow: active ? "0 1px 4px rgba(0,0,0,.08)" : "none",
            }}>
            {option === "testing" ? "Homologación" : "Producción"}
          </button>
        );
      })}
    </div>
  );
}

/* ── Testing steps ──────────────────────────────────────────── */

function TestingSteps({ onZoom }: { onZoom: (img: ZoomedImage) => void }) {
  return (
    <>
      <Step
        id="ingresar-wsass"
        number="01"
        title="Ingresar a WSASS de Homologación"
        accentColor="#27a0c9"
        showConnector
        animClass="g-anim-4">
        <p className="g-sora text-gray-600 leading-relaxed mb-6">
          Ingresá a ARCA con tu CUIT y Clave Fiscal. Desde tu escritorio,
          abrí{" "}
          <strong className="text-gray-800">
            &quot;WSASS - Autogestión Certificados Homologación&quot;
          </strong>
          .
        </p>

        <div
          className="flex items-start gap-3 px-4 py-4 rounded-xl mb-6"
          style={{
            background: "rgba(39,160,201,.06)",
            border: "1px solid rgba(39,160,201,.18)",
          }}>
          <Info
            className="h-5 w-5 flex-shrink-0 mt-0.5"
            style={{ color: "#27a0c9" }}
          />
          <div>
            <p
              className="g-sora font-semibold text-sm"
              style={{ color: "#1e7a9c" }}>
              ¿No ves WSASS en tu escritorio?
            </p>
            <p className="g-sora text-xs text-gray-500 mt-1">
              Primero necesitás habilitar el servicio WSASS.{" "}
              <Link
                href="/mis-certificados/guia/habilitar-produccion"
                className="font-semibold hover:underline"
                style={{ color: "#27a0c9" }}>
                Ver cómo habilitarlo
                <ArrowRight className="inline h-3 w-3 ml-0.5" />
              </Link>
            </p>
          </div>
        </div>

        <StepImage
          src="/afip/guia-wsass-autogestion.png"
          alt="WSASS - Autogestión Certificados Homologación"
          onZoom={onZoom}
        />
      </Step>

      <Step
        id="crear-autorizacion"
        number="02"
        title="Crear autorización para ws_sr_constancia_inscripcion"
        accentColor="#27a0c9"
        showConnector
        animClass="g-anim-5">
        <p className="g-sora text-gray-600 leading-relaxed mb-5">
          Dentro de WSASS, hacé clic en{" "}
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
                  Campo 1 — &quot;Nombre simbólico del DN a autorizar&quot;
                </p>
                <p className="text-gray-500 mt-0.5">
                  Seleccioná el certificado que ya tenés configurado en Connta.
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
                  Ingresá tu CUIT (el mismo con el que generaste el
                  certificado).
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
                  <strong className="text-gray-800">
                    ws_sr_constancia_inscripcion
                  </strong>
                  .
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
          .
        </p>

        <StepImage
          src="/afip/guia-wsass-crear-autorizacion.png"
          alt="Formulario Crear autorización a servicio en WSASS"
          onZoom={onZoom}
        />

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
              Significa que el servicio ya está habilitado para tu certificado.
              Podés ir directamente al paso siguiente.
            </p>
          </div>
        </div>
      </Step>

      <Step
        id="verificar-autorizacion"
        number="03"
        title="Verificar que la autorización se creó"
        accentColor="#27a0c9"
        showConnector
        animClass="g-anim-6">
        <p className="g-sora text-gray-600 leading-relaxed mb-5">
          Verificá que{" "}
          <strong className="text-gray-800">
            ws_sr_constancia_inscripcion
          </strong>{" "}
          aparezca en la sección{" "}
          <strong className="text-gray-800">
            &quot;Autorizaciones&quot;
          </strong>{" "}
          de WSASS.
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
              Autorización creada
            </p>
            <p className="g-sora text-xs text-gray-500 mt-1">
              Si ves <strong>ws_sr_constancia_inscripcion</strong> en la lista,
              tu certificado de testing ya puede consultar el padrón de ARCA.
            </p>
          </div>
        </div>

        <StepImage
          src="/afip/guia-wsass-autorizaciones-lista.png"
          alt="Lista de Autorizaciones en WSASS"
          onZoom={onZoom}
        />
      </Step>
    </>
  );
}

/* ── Production steps ───────────────────────────────────────── */

function ProductionSteps({
  onZoom,
}: {
  onZoom: (img: ZoomedImage) => void;
}) {
  return (
    <>
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
          . Si administrás relaciones de otros contribuyentes, elegí a quién
          gestionar.
        </p>
        <StepImage
          src="/afip/arca-habilitar-testing.webp"
          alt="Administrador de Relaciones de Clave Fiscal"
          onZoom={onZoom}
        />
      </Step>

      <Step
        id="nueva-relacion"
        number="02"
        title="Crear nueva relación para el servicio de padrón"
        accentColor="#27a0c9"
        showConnector
        animClass="g-anim-5">
        <p className="g-sora text-gray-600 leading-relaxed mb-5">
          Hacé clic en{" "}
          <strong className="text-gray-800">
            &quot;Nueva Relación&quot;
          </strong>{" "}
          y completá los campos:
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
              2
            </span>
            <span>En el selector de servicio navegá a:</span>
          </li>
        </ol>

        <div className="flex flex-wrap items-center gap-2 mb-3 ml-9">
          {[
            "ARCA",
            "Web Services",
            "Consulta de constancia de inscripción",
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

        <ol
          className="g-sora text-gray-600 text-sm space-y-4 mb-6 pl-0 mt-6"
          start={3}>
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
              En la lista de certificados, seleccioná el alias de tu
              certificado de producción.
            </span>
          </li>
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
              Hacé clic en{" "}
              <strong className="text-gray-800">
                &quot;Confirmar&quot;
              </strong>{" "}
              dos veces (ARCA pide doble confirmación).
            </span>
          </li>
        </ol>

        <StepImage
          src="/afip/guia-padron-prod-nueva-relacion.png"
          alt="Nueva Relación — Consulta de constancia de inscripción"
          onZoom={onZoom}
        />

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
              ¿Ves el error &quot;La relación ya existe&quot;?
            </p>
            <p className="g-sora text-xs text-gray-500 mt-1">
              Significa que el servicio ya está habilitado para tu certificado.
              Podés ir directamente al paso siguiente.
            </p>
          </div>
        </div>
      </Step>

      <Step
        id="confirmar-relacion"
        number="03"
        title="Verificar que la relación se creó"
        accentColor="#27a0c9"
        showConnector
        animClass="g-anim-6">
        <p className="g-sora text-gray-600 leading-relaxed mb-5">
          Verificá que la relación con{" "}
          <strong className="text-gray-800">
            Consulta de constancia de inscripción
          </strong>{" "}
          aparezca en tu lista de relaciones activas.
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
              Relación creada
            </p>
            <p className="g-sora text-xs text-gray-500 mt-1">
              Si ves la relación en la lista, tu certificado de producción ya
              puede consultar el padrón de ARCA.
            </p>
          </div>
        </div>

        <StepImage
          src="/afip/guia-padron-prod-relacion-creada.png"
          alt="Relación Consulta de constancia de inscripción creada"
          onZoom={onZoom}
        />
      </Step>
    </>
  );
}

/* ── Shared components ──────────────────────────────────────── */

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
