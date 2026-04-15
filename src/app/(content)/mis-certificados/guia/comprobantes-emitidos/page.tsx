"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import {
  FileText,
  Info,
  Search,
  Download,
  Eye,
  Filter,
  CheckCircle2,
  ExternalLink,
  ListFilter,
  CalendarDays,
  Hash,
  AlertTriangle,
} from "lucide-react";

const SECTIONS = [
  { id: "acceder-arca", label: "Acceder a ARCA" },
  { id: "mis-comprobantes", label: "Ir a Mis Comprobantes" },
  { id: "filtrar-buscar", label: "Filtrar y buscar" },
  { id: "ver-descargar", label: "Ver y descargar" },
] as const;

export default function GuiaComprobantesEmitidos() {
  const [activeSection, setActiveSection] = useState<
    (typeof SECTIONS)[number]["id"]
  >(SECTIONS[0].id);

  useEffect(() => {
    const handleScroll = () => {
      const trigger = window.scrollY + 220;
      let current: (typeof SECTIONS)[number]["id"] = SECTIONS[0].id;
      for (const section of SECTIONS) {
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

        .g-nav-item { background: transparent; transition: background .15s ease; }
        .g-nav-item:hover { background: rgba(39,160,201,.05) !important; }
        .g-nav-item[data-active="true"] { background: rgba(39,160,201,.08) !important; }
        .g-nav-item .g-nav-num { color: #cbd5e1; transition: color .15s ease; }
        .g-nav-item:hover .g-nav-num,
        .g-nav-item[data-active="true"] .g-nav-num { color: #27a0c9; }
        .g-nav-item .g-nav-label { color: #64748b; transition: color .15s ease; }
        .g-nav-item:hover .g-nav-label,
        .g-nav-item[data-active="true"] .g-nav-label { color: #0f172a; }

        .g-dot-grid {
          background-image: radial-gradient(circle, #27a0c9 1px, transparent 1px);
          background-size: 22px 22px;
        }
      `}</style>

      <div>
        <header className="relative bg-white border-b border-gray-100 py-14 overflow-hidden px-6 md:px-8">
          <div className="relative max-w-7xl mx-auto">
            <PageHeader
              className="g-anim g-anim-1 g-sora"
              backHref="/mis-certificados/guia"
              backLabel="Guías"
              eyebrow="ARCA · Mis Comprobantes"
              icon={FileText}
              title="Consultá tus comprobantes emitidos en ARCA"
              description="Cómo acceder al portal de ARCA para ver, filtrar y descargar las facturas electrónicas que ya fueron autorizadas."
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
                    Antes de empezar vas a necesitar
                  </p>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>
                      • <strong className="text-gray-800">CUIT y Clave Fiscal</strong> nivel 2 o superior
                    </li>
                    <li>
                      • Al menos un <strong className="text-gray-800">comprobante emitido</strong> desde Connta (o desde cualquier medio electrónico)
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Paso 1: Acceder a ARCA */}
            <Step
              id="acceder-arca"
              number="01"
              title="Acceder al portal de ARCA"
              accentColor="#27a0c9"
              showConnector
              animClass="g-anim-4">
              <p className="g-sora text-gray-600 leading-relaxed mb-5">
                Ingresá al portal de ARCA con tu CUIT y Clave Fiscal. Si manejás
                múltiples representados, acordate de seleccionar el CUIT correcto
                en el selector de contribuyente antes de continuar.
              </p>

              <a
                href="https://auth.afip.gob.ar/contribuyente_/login.xhtml"
                target="_blank"
                rel="noopener noreferrer"
                className="g-sora inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all"
                style={{
                  background: "rgba(39,160,201,.1)",
                  color: "#27a0c9",
                }}>
                <ExternalLink className="w-4 h-4" />
                Ir a ARCA (auth.afip.gob.ar)
              </a>
            </Step>

            {/* Paso 2: Mis Comprobantes */}
            <Step
              id="mis-comprobantes"
              number="02"
              title="Ir a Mis Comprobantes"
              accentColor="#27a0c9"
              showConnector
              animClass="g-anim-5">
              <p className="g-sora text-gray-600 leading-relaxed mb-5">
                Una vez dentro del portal, seguí estos pasos para llegar a la
                sección de comprobantes emitidos:
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
                    En el home de ARCA, usá el buscador superior o navegá a{" "}
                    <strong className="text-gray-800">
                      &quot;Servicios Habilitados&quot;
                    </strong>
                    . Escribí{" "}
                    <strong className="text-gray-800">
                      &quot;Mis Comprobantes&quot;
                    </strong>{" "}
                    y hacé clic en el resultado.
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
                    Dentro del servicio verás dos pestañas:{" "}
                    <strong className="text-gray-800">
                      &quot;Comprobantes Recibidos&quot;
                    </strong>{" "}
                    y{" "}
                    <strong className="text-gray-800">
                      &quot;Comprobantes Emitidos&quot;
                    </strong>
                    . Seleccioná la segunda.
                  </span>
                </li>
              </ol>

              <div
                className="flex items-start gap-3 px-4 py-3 rounded-xl g-sora text-sm text-gray-700"
                style={{
                  background: "rgba(39,160,201,.05)",
                  border: "1px solid rgba(39,160,201,.2)",
                }}>
                <Info
                  className="w-4 h-4 flex-shrink-0 mt-0.5"
                  style={{ color: "#27a0c9" }}
                />
                <p className="text-gray-600 leading-relaxed">
                  Los comprobantes pueden tardar unos minutos en aparecer dentro
                  de{" "}
                  <strong className="text-gray-800">Mis Comprobantes</strong>.
                  Si recién emitiste una factura, esperá un poco y volvé a
                  consultar.
                </p>
              </div>
            </Step>

            {/* Paso 3: Filtrar y buscar */}
            <Step
              id="filtrar-buscar"
              number="03"
              title="Filtrar y buscar comprobantes"
              accentColor="#27a0c9"
              showConnector
              animClass="g-anim-6">
              <p className="g-sora text-gray-600 leading-relaxed mb-5">
                El portal ofrece varios filtros para encontrar comprobantes
                específicos. Podés combinarlos para acotar los resultados.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                {[
                  {
                    icon: CalendarDays,
                    label: "Período",
                    desc: "Seleccioná mes y año de emisión. El portal muestra hasta 12 meses hacia atrás por defecto.",
                  },
                  {
                    icon: ListFilter,
                    label: "Tipo de comprobante",
                    desc: "Filtrá por Factura A / B / C, Nota de Crédito, Nota de Débito, FCE, etc.",
                  },
                  {
                    icon: Hash,
                    label: "Punto de venta",
                    desc: "Si tenés múltiples puntos de venta, podés filtrar por uno en particular.",
                  },
                  {
                    icon: Filter,
                    label: "Número de comprobante",
                    desc: "Ingresá el número exacto (ej. 00000001) para encontrar un comprobante puntual.",
                  },
                ].map(({ icon: Icon, label, desc }) => (
                  <div
                    key={label}
                    className="rounded-xl p-4 bg-white flex items-start gap-3 g-sora"
                    style={{ border: "1px solid #e8ecf0" }}>
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ background: "rgba(39,160,201,.08)" }}>
                      <Icon
                        className="w-4 h-4"
                        style={{ color: "#27a0c9" }}
                      />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-800 mb-0.5">
                        {label}
                      </p>
                      <p className="text-xs text-gray-500 leading-relaxed">
                        {desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div
                className="flex items-start gap-3 px-4 py-4 rounded-xl g-sora text-sm"
                style={{
                  background: "rgba(39,160,201,.05)",
                  border: "1px solid rgba(39,160,201,.2)",
                }}>
                <Search
                  className="w-4 h-4 mt-0.5 flex-shrink-0"
                  style={{ color: "#27a0c9" }}
                />
                <div className="text-gray-600 leading-relaxed space-y-1">
                  <p className="font-semibold text-gray-800">
                    Tip: buscá por CAE
                  </p>
                  <p>
                    Si tenés el CAE de una factura (lo podés ver en el historial
                    de esta plataforma), podés pegarlo en el campo de búsqueda
                    del portal para encontrar el comprobante exacto.
                  </p>
                </div>
              </div>
            </Step>

            {/* Paso 4: Ver y descargar */}
            <Step
              id="ver-descargar"
              number="04"
              title="Ver detalle y descargar PDF"
              accentColor="#27a0c9"
              showConnector={false}
              animClass="g-anim-6">
              <p className="g-sora text-gray-600 leading-relaxed mb-5">
                Una vez que encontrés el comprobante en la lista, tenés dos
                opciones:
              </p>

              <div className="space-y-3 mb-6">
                <div
                  className="rounded-xl p-5 bg-white flex items-start gap-4 g-sora"
                  style={{ border: "1px solid #e8ecf0" }}>
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ background: "rgba(39,160,201,.1)" }}>
                    <Eye className="w-4 h-4" style={{ color: "#27a0c9" }} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-800 mb-1">
                      Ver detalle
                    </p>
                    <p className="text-sm text-gray-500 leading-relaxed">
                      Hacé clic en el número de comprobante para ver todos los
                      datos: receptor, importes, IVA, condición de venta, CAE y
                      fecha de vencimiento del CAE.
                    </p>
                  </div>
                </div>

                <div
                  className="rounded-xl p-5 bg-white flex items-start gap-4 g-sora"
                  style={{ border: "1px solid #e8ecf0" }}>
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ background: "rgba(16,185,129,.1)" }}>
                    <Download
                      className="w-4 h-4"
                      style={{ color: "#10b981" }}
                    />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-800 mb-1">
                      Descargar PDF
                    </p>
                    <p className="text-sm text-gray-500 leading-relaxed">
                      Desde el detalle del comprobante, usá el botón{" "}
                      <strong className="text-gray-700">
                        &quot;Imprimir / Exportar PDF&quot;
                      </strong>{" "}
                      para guardar o enviar la factura. Este PDF es el documento
                      oficial con el código de barras del CAE.
                    </p>
                  </div>
                </div>
              </div>

              <div
                className="flex items-start gap-3 px-4 py-4 rounded-xl g-sora text-sm"
                style={{
                  background: "rgba(16,185,129,.05)",
                  border: "1px solid rgba(16,185,129,.2)",
                }}>
                <CheckCircle2
                  className="w-4 h-4 mt-0.5 flex-shrink-0"
                  style={{ color: "#10b981" }}
                />
                <div className="text-gray-600 leading-relaxed space-y-1">
                  <p className="font-semibold text-gray-800">
                    También podés descargar desde Connta
                  </p>
                  <p>
                    En el{" "}
                    <Link
                      href="/facturacion"
                      className="font-medium underline underline-offset-2"
                      style={{ color: "#10b981" }}>
                      historial de facturación
                    </Link>{" "}
                    podés descargar el PDF de cada comprobante, o un ZIP con
                    todos los de una sesión, sin necesidad de ingresar a ARCA.
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
                  Tip
                </div>
                <h3 className="g-sora text-2xl md:text-3xl font-bold text-white mb-3 leading-snug">
                  Evitate el viaje a ARCA
                </h3>
                <p
                  className="g-sora text-sm leading-relaxed mb-8 max-w-md"
                  style={{ color: "rgba(255,255,255,.55)" }}>
                  Desde el{" "}
                  <strong style={{ color: "rgba(255,255,255,.8)" }}>
                    historial de Connta
                  </strong>{" "}
                  podés descargar los PDFs de los comprobantes y verificarlos
                  con ARCA sin salir de la plataforma.
                </p>
                <Link
                  href="/facturacion"
                  className="inline-flex items-center gap-2.5 px-6 py-3 rounded-xl g-sora font-semibold text-sm text-white transition-all duration-200 hover:gap-4 hover:brightness-110"
                  style={{
                    background: "#27a0c9",
                    boxShadow: "0 0 28px rgba(39,160,201,.45)",
                  }}>
                  Ir a Facturación
                  <ExternalLink className="h-4 w-4" />
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
                {SECTIONS.map((section, index) => {
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

function darken(hex: string): string {
  const map: Record<string, string> = {
    "#27a0c9": "#1e7a9c",
  };
  return map[hex] ?? hex;
}
