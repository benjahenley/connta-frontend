"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
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
} from "lucide-react";

const SECTIONS = [
  { id: "acceder-arca", label: "Acceder a ARCA" },
  { id: "mis-comprobantes", label: "Mis Comprobantes" },
  { id: "filtrar-buscar", label: "Filtrar y buscar" },
  { id: "ver-descargar", label: "Ver y descargar" },
] as const;

export default function GuiaComprobantesEmitidos() {
  const [activeSection, setActiveSection] = useState<string>(SECTIONS[0].id);
  const skipScrollRef = useRef(false);

  const handleNavClick = (sectionId: string) => {
    setActiveSection(sectionId);
    skipScrollRef.current = true;
    setTimeout(() => {
      skipScrollRef.current = false;
    }, 800);
  };

  useEffect(() => {
    const elements = SECTIONS.map((s) =>
      document.getElementById(s.id),
    ).filter((el): el is HTMLElement => el !== null);

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

        .g-step-card {
          border: 1px solid #e8ecf0;
          transition: box-shadow .22s ease, transform .22s ease;
        }
        .g-step-card:hover {
          box-shadow: 0 6px 24px rgba(39,160,201,.1), 0 2px 8px rgba(0,0,0,.06);
          transform: translateY(-1px);
        }

        .g-toc-link {
          transition: color .15s ease, border-left-color .15s ease;
        }
        .g-toc-link:hover {
          color: #27a0c9;
        }
      `}</style>

      <div>
        {/* ── Header ───────────────────────────────────────── */}
        <header className="relative bg-white border-b border-gray-100 py-14 overflow-hidden px-6 md:px-8">
          <div className="relative max-w-7xl mx-auto">
            <PageHeader
              className="g-anim g-anim-1 g-sora"
              backHref="/mis-certificados/guia"
              backLabel="Guías"
              eyebrow="ARCA · Mis Comprobantes"
              icon={FileText}
              title="Consultá tus comprobantes emitidos en ARCA"
              description="Cómo acceder al portal de ARCA para ver, filtrar y descargar las facturas electrónicas que ya fueron autorizadas por ARCA."
            />
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-6 md:px-8 xl:grid xl:grid-cols-[minmax(0,1fr)_240px] xl:gap-12">
          <div className="min-w-0 max-w-5xl py-10 space-y-14">

            {/* ── 1. Acceder a ARCA ──────────────────────────── */}
            <section id="acceder-arca" style={{ scrollMarginTop: "120px" }}>
              <div className="g-anim g-anim-4 flex items-center gap-3 mb-6">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: "rgba(39,160,201,.12)" }}>
                  <span
                    className="g-condensed text-xl font-black"
                    style={{ color: "#27a0c9" }}>
                    1
                  </span>
                </div>
                <h2 className="g-condensed text-3xl font-black text-gray-900">
                  Acceder a ARCA
                </h2>
              </div>

              <div className="space-y-4 g-sora">
                <div className="g-anim g-anim-4 g-step-card rounded-xl p-5 bg-white">
                  <p className="text-sm text-gray-600 leading-relaxed mb-4">
                    Ingresá al portal de ARCA con tu CUIT y clave fiscal nivel 2 o superior.
                  </p>
                  <a
                    href="https://auth.afip.gob.ar/contribuyente_/login.xhtml"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all"
                    style={{ background: "rgba(39,160,201,.1)", color: "#27a0c9" }}>
                    <ExternalLink className="w-4 h-4" />
                    Ir a ARCA (auth.afip.gob.ar)
                  </a>
                </div>

                <div
                  className="g-anim g-anim-5 rounded-xl px-5 py-4 g-sora text-sm"
                  style={{
                    background: "rgba(39,160,201,.05)",
                    border: "1px solid rgba(39,160,201,.2)",
                  }}>
                  <div className="flex items-start gap-2">
                    <Info className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: "#27a0c9" }} />
                    <p className="text-gray-600 leading-relaxed">
                      Si tu empresa tiene múltiples representados, asegurate de seleccionar
                      el CUIT correcto en el selector de contribuyente antes de continuar.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* ── 2. Mis Comprobantes ────────────────────────── */}
            <section id="mis-comprobantes" style={{ scrollMarginTop: "120px" }}>
              <div className="g-anim g-anim-4 flex items-center gap-3 mb-6">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: "rgba(39,160,201,.12)" }}>
                  <span
                    className="g-condensed text-xl font-black"
                    style={{ color: "#27a0c9" }}>
                    2
                  </span>
                </div>
                <h2 className="g-condensed text-3xl font-black text-gray-900">
                  Ir a Mis Comprobantes
                </h2>
              </div>

              <div className="space-y-4 g-sora">
                <p className="g-anim g-anim-4 text-sm text-gray-600 leading-relaxed">
                  Una vez dentro del portal, seguí estos pasos para llegar a los comprobantes emitidos:
                </p>

                {[
                  {
                    step: "A",
                    title: 'Buscá "Mis Comprobantes" en el buscador de servicios',
                    desc: 'En el home de ARCA, usá el buscador superior o navegá a "Servicios Habilitados". Escribí "Mis Comprobantes" y hacé clic en el resultado.',
                  },
                  {
                    step: "B",
                    title: 'Seleccioná "Comprobantes Emitidos"',
                    desc: 'Dentro del servicio, verás dos pestañas: "Comprobantes Recibidos" y "Comprobantes Emitidos". Seleccioná la opción "Comprobantes Emitidos".',
                  },
                ].map((item, i) => (
                  <div
                    key={item.step}
                    className={`g-anim g-anim-${i + 5} g-step-card rounded-xl p-5 bg-white flex items-start gap-4`}>
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 text-sm font-bold"
                      style={{ background: "rgba(39,160,201,.1)", color: "#27a0c9" }}>
                      {item.step}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-800 mb-1">{item.title}</p>
                      <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* ── 3. Filtrar y buscar ────────────────────────── */}
            <section id="filtrar-buscar" style={{ scrollMarginTop: "120px" }}>
              <div className="g-anim g-anim-4 flex items-center gap-3 mb-6">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: "rgba(39,160,201,.12)" }}>
                  <span
                    className="g-condensed text-xl font-black"
                    style={{ color: "#27a0c9" }}>
                    3
                  </span>
                </div>
                <h2 className="g-condensed text-3xl font-black text-gray-900">
                  Filtrar y buscar comprobantes
                </h2>
              </div>

              <div className="space-y-4 g-sora">
                <p className="g-anim g-anim-4 text-sm text-gray-600 leading-relaxed">
                  El portal ofrece varios filtros para encontrar comprobantes específicos.
                  Podés combinarlos para acotar los resultados.
                </p>

                <div className="g-anim g-anim-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
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
                      className="g-step-card rounded-xl p-4 bg-white flex items-start gap-3">
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                        style={{ background: "rgba(39,160,201,.08)" }}>
                        <Icon className="w-4 h-4" style={{ color: "#27a0c9" }} />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-800 mb-0.5">{label}</p>
                        <p className="text-xs text-gray-500 leading-relaxed">{desc}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div
                  className="g-anim g-anim-6 rounded-xl px-5 py-4 g-sora text-sm"
                  style={{
                    background: "rgba(39,160,201,.05)",
                    border: "1px solid rgba(39,160,201,.2)",
                  }}>
                  <div className="flex items-start gap-2">
                    <Search className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: "#27a0c9" }} />
                    <div className="text-gray-600 leading-relaxed space-y-1">
                      <p className="font-semibold text-gray-800">Tip: buscá por CAE</p>
                      <p>
                        Si tenés el CAE de una factura (lo podés ver en el historial de esta plataforma),
                        podés pegarlo en el campo de búsqueda del portal para encontrar el comprobante exacto.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* ── 4. Ver y descargar ─────────────────────────── */}
            <section id="ver-descargar" style={{ scrollMarginTop: "120px" }}>
              <div className="g-anim g-anim-4 flex items-center gap-3 mb-6">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: "rgba(39,160,201,.12)" }}>
                  <span
                    className="g-condensed text-xl font-black"
                    style={{ color: "#27a0c9" }}>
                    4
                  </span>
                </div>
                <h2 className="g-condensed text-3xl font-black text-gray-900">
                  Ver y descargar
                </h2>
              </div>

              <div className="space-y-4 g-sora">
                <p className="g-anim g-anim-4 text-sm text-gray-600 leading-relaxed">
                  Una vez que encontrés el comprobante en la lista, tenés dos opciones:
                </p>

                <div className="g-anim g-anim-5 space-y-3">
                  <div className="g-step-card rounded-xl p-5 bg-white flex items-start gap-4">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ background: "rgba(39,160,201,.1)" }}>
                      <Eye className="w-4 h-4" style={{ color: "#27a0c9" }} />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-800 mb-1">Ver detalle</p>
                      <p className="text-sm text-gray-500 leading-relaxed">
                        Hacé clic en el número de comprobante para ver todos los datos: receptor,
                        importes, IVA, condición de venta, CAE y fecha de vencimiento del CAE.
                      </p>
                    </div>
                  </div>

                  <div className="g-step-card rounded-xl p-5 bg-white flex items-start gap-4">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ background: "rgba(16,185,129,.1)" }}>
                      <Download className="w-4 h-4" style={{ color: "#10b981" }} />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-800 mb-1">Descargar PDF</p>
                      <p className="text-sm text-gray-500 leading-relaxed">
                        Desde el detalle del comprobante, usá el botón{" "}
                        <span className="font-medium text-gray-700">&quot;Imprimir / Exportar PDF&quot;</span>{" "}
                        para guardar o enviar la factura. Este PDF es el documento oficial con el
                        código de barras del CAE.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Tip: also download from this platform */}
                <div
                  className="g-anim g-anim-6 rounded-xl px-5 py-4 g-sora text-sm"
                  style={{
                    background: "rgba(16,185,129,.05)",
                    border: "1px solid rgba(16,185,129,.2)",
                  }}>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: "#10b981" }} />
                    <div className="text-gray-600 leading-relaxed space-y-1">
                      <p className="font-semibold text-gray-800">También podés descargar desde esta plataforma</p>
                      <p>
                        En el{" "}
                        <Link
                          href="/facturacion"
                          className="font-medium underline underline-offset-2"
                          style={{ color: "#10b981" }}>
                          historial de facturación
                        </Link>
                        , podés descargar el PDF de cada comprobante o el ZIP con todos los
                        comprobantes de una sesión, sin necesidad de ingresar a ARCA.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

          </div>

          {/* ── Sticky ToC ─────────────────────────────────── */}
          <aside className="hidden xl:block py-10">
            <div
              className="sticky top-24 g-sora rounded-2xl p-5 space-y-1"
              style={{ border: "1px solid #e8ecf0", background: "#f8fafc" }}>
              <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 mb-3">
                En esta guía
              </p>
              {SECTIONS.map((section) => (
                <a
                  key={section.id}
                  href={`#${section.id}`}
                  onClick={() => handleNavClick(section.id)}
                  className="g-toc-link flex items-center gap-2 py-1.5 pl-3 text-sm rounded-lg transition-colors"
                  style={{
                    borderLeft: `2px solid ${activeSection === section.id ? "#27a0c9" : "transparent"}`,
                    color: activeSection === section.id ? "#27a0c9" : "#6b7280",
                    fontWeight: activeSection === section.id ? 600 : 400,
                  }}>
                  {section.label}
                </a>
              ))}
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}
