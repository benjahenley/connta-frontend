"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import {
  Receipt,
  ArrowRight,
  Info,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  FileSpreadsheet,
  ShieldAlert,
  FlaskConical,
  Factory,
  Eye,
  Zap,
  AlertCircle,
  BadgeCheck,
  Download,
  FileWarning,
  WifiOff,
  KeyRound,
  Hash,
  CalendarX,
  CalendarCheck2,
  Copy,
} from "lucide-react";

const SECTIONS = [
  { id: "requisitos", label: "Requisitos previos" },
  { id: "elegir-certificado", label: "Elegir certificado" },
  { id: "subir-archivo", label: "Subir el archivo" },
  { id: "revisar-generar", label: "Revisar y generar" },
  { id: "errores-comunes", label: "Errores comunes" },
] as const;

const CBTE_TIPOS = [
  { code: 1, label: "Factura A" },
  { code: 6, label: "Factura B" },
  { code: 11, label: "Factura C" },
  { code: 2, label: "Nota de Débito A" },
  { code: 7, label: "Nota de Débito B" },
  { code: 12, label: "Nota de Débito C" },
  { code: 3, label: "Nota de Crédito A" },
  { code: 8, label: "Nota de Crédito B" },
  { code: 13, label: "Nota de Crédito C" },
  { code: 201, label: "FCE Factura A" },
  { code: 206, label: "FCE Factura B" },
  { code: 211, label: "FCE Factura C" },
];

export default function GuiaFacturacion() {
  const [activeSection, setActiveSection] = useState<string>(SECTIONS[0].id);
  const skipScrollRef = useRef(false);
  const [showCbteTipos, setShowCbteTipos] = useState(false);

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
        .g-anim-9 { animation-delay:.85s; }

        .g-dot-grid {
          background-image: radial-gradient(circle, #27a0c9 1px, transparent 1px);
          background-size: 22px 22px;
        }

        .g-err-card {
          border: 1px solid #e8ecf0;
          border-left: 3px solid transparent;
          transition: box-shadow .22s ease, transform .22s ease, border-left-color .18s ease;
        }
        .g-err-card:hover {
          border-left-color: #ef4444;
          box-shadow:
            -3px 8px 28px rgba(239,68,68,.1),
            0 4px 12px rgba(0,0,0,.07),
            0 1px 3px rgba(0,0,0,.05);
          transform: translateY(-2px) translateX(2px);
        }
      `}</style>

      <div>
        {/* ── Header ────────────────────────────────────────── */}
        <header className="relative bg-white border-b border-gray-100 py-14 overflow-hidden px-6 md:px-8">
          <div className="relative max-w-7xl mx-auto">
            <PageHeader
              className="g-anim g-anim-1 g-sora"
              backHref="/mis-certificados/guia"
              backLabel="Guías"
              eyebrow="Facturación Electrónica · WSFEv1"
              icon={Receipt}
              title="Cómo generar facturas electrónicas en ARCA"
              description="Paso a paso para subir tu archivo de facturas, revisarlo y obtener los CAEs automáticamente desde la plataforma."
            />
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-6 md:px-8 xl:grid xl:grid-cols-[minmax(0,1fr)_240px] xl:gap-12">
          <div className="min-w-0 max-w-5xl py-10 space-y-14">

            {/* ── Requisitos ─────────────────────────────────── */}
            <div
              id="requisitos"
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
                  <ul className="text-sm text-gray-600 space-y-1.5">
                    <li>
                      • Al menos un{" "}
                      <strong className="text-gray-800">
                        certificado ARCA activo
                      </strong>{" "}
                      (homologación o producción)
                    </li>
                    <li>
                      • Archivo de facturas en formato{" "}
                      <Code>.xlsx</Code>, <Code>.xls</Code> o{" "}
                      <Code>.csv</Code> (máximo 10 MB)
                    </li>
                    <li>
                      • Punto de venta habilitado en ARCA para{" "}
                      <strong className="text-gray-800">WSFEv1</strong>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* ── Step 1: Elegir certificado ─────────────────── */}
            <Step
              id="elegir-certificado"
              number="01"
              title="Elegí el certificado"
              accentColor="#27a0c9"
              showConnector
              animClass="g-anim-4">
              <p className="g-sora text-gray-600 leading-relaxed mb-5">
                Al ingresar a la sección de Facturación, el primer paso es
                elegir con qué certificado vas a operar. Los certificados están
                organizados en dos ambientes:
              </p>

              <div className="grid sm:grid-cols-2 gap-3 mb-6">
                <div
                  className="rounded-xl p-4 g-sora"
                  style={{
                    background: "rgba(39,160,201,.05)",
                    border: "1px solid rgba(39,160,201,.15)",
                  }}>
                  <div className="flex items-center gap-2 mb-2">
                    <FlaskConical
                      className="h-4 w-4"
                      style={{ color: "#27a0c9" }}
                    />
                    <p className="font-semibold text-sm text-gray-800">
                      Homologación (Testing)
                    </p>
                  </div>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    Las facturas generadas en este ambiente son de prueba y{" "}
                    <strong className="text-gray-700">
                      no tienen validez fiscal
                    </strong>
                    . Usalo para verificar que todo funcione correctamente antes
                    de pasar a producción.
                  </p>
                </div>

                <div
                  className="rounded-xl p-4 g-sora"
                  style={{
                    background: "#f9fafb",
                    border: "1px solid #e5e7eb",
                  }}>
                  <div className="flex items-center gap-2 mb-2">
                    <Factory
                      className="h-4 w-4"
                      style={{ color: "#6b7280" }}
                    />
                    <p className="font-semibold text-sm text-gray-800">
                      Producción
                    </p>
                  </div>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    Las facturas generadas acá son{" "}
                    <strong className="text-gray-700">
                      reales y quedan registradas en ARCA
                    </strong>
                    . Confirmá todos los datos antes de generar.
                  </p>
                </div>
              </div>

              <p className="g-sora text-gray-600 leading-relaxed mb-4">
                Seleccioná la solapa del ambiente y luego hacé click sobre la
                tarjeta del certificado que querés usar. Una vez seleccionado, se
                habilitará la zona de carga del archivo.
              </p>

              <div
                className="flex items-start gap-3 px-4 py-4 rounded-xl"
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
                    ¿No ves ningún certificado?
                  </p>
                  <p className="g-sora text-xs text-gray-500 mt-1 leading-relaxed">
                    Necesitás crear y activar un certificado primero. Seguí la
                    guía de certificados para configurarlo.{" "}
                    <Link
                      href="/mis-certificados/configurar"
                      className="font-semibold hover:underline"
                      style={{ color: "#27a0c9" }}>
                      Ir a Mis Certificados
                      <ArrowRight className="inline h-3.5 w-3.5 ml-1" />
                    </Link>
                  </p>
                </div>
              </div>
            </Step>

            {/* ── Step 2: Subir archivo ──────────────────────── */}
            <Step
              id="subir-archivo"
              number="02"
              title="Subí el archivo de facturas"
              accentColor="#27a0c9"
              showConnector
              animClass="g-anim-5">
              <p className="g-sora text-gray-600 leading-relaxed mb-5">
                Con el certificado seleccionado, arrastrá tu archivo al área de
                carga o hacé clic para buscarlo. El sistema acepta{" "}
                <Code>.xlsx</Code>, <Code>.xls</Code> y <Code>.csv</Code>.
              </p>

              <div
                className="rounded-xl px-5 py-4 mb-6"
                style={{
                  background: "rgba(39,160,201,.04)",
                  border: "1px solid rgba(39,160,201,.15)",
                }}>
                <p className="g-sora text-sm font-semibold text-gray-800 mb-3">
                  Columnas del archivo
                </p>
                <div className="grid sm:grid-cols-2 gap-x-6 gap-y-2">
                  {[
                    { col: "cbteTipo", desc: "Tipo de comprobante (1, 6, 11…)", required: true },
                    { col: "concepto", desc: "Concepto: 1 Productos, 2 Servicios, 3 Ambos", required: false },
                    { col: "docTipo", desc: "Tipo de documento del cliente (80 = CUIT)", required: true },
                    { col: "docNro", desc: "Número de CUIT/DNI del cliente", required: true },
                    { col: "razonSocial", desc: "Nombre o razón social del cliente", required: false },
                    { col: "impNeto", desc: "Importe neto gravado", required: false },
                    { col: "impIva", desc: "Importe de IVA", required: false },
                    { col: "impOpEx", desc: "Importe operaciones exentas", required: false },
                    { col: "impTotal", desc: "Importe total de la factura", required: true },
                    { col: "cbteFch", desc: "Fecha del comprobante", required: true },
                    { col: "fchServDesde", desc: "Inicio período servicio (solo concepto 2/3)", required: false },
                    { col: "fchServHasta", desc: "Fin período servicio (solo concepto 2/3)", required: false },
                    { col: "fchVtoPago", desc: "Vencimiento de pago (solo concepto 2/3)", required: false },
                  ].map(({ col, desc, required }) => (
                    <div key={col} className="flex items-start gap-2">
                      <Code>{col}</Code>
                      <span className="g-sora text-xs text-gray-500 leading-relaxed">
                        {desc}
                        {required && (
                          <span
                            className="ml-1 font-semibold"
                            style={{ color: "#27a0c9" }}>
                            *
                          </span>
                        )}
                      </span>
                    </div>
                  ))}
                </div>
                <p className="g-sora text-xs text-gray-400 mt-3">
                  <span style={{ color: "#27a0c9" }}>*</span> Campos
                  obligatorios para todas las facturas. Consultá los{" "}
                  <button
                    type="button"
                    onClick={() => setShowCbteTipos(true)}
                    className="font-bold underline underline-offset-2 cursor-pointer hover:no-underline"
                    style={{ color: "#27a0c9" }}>
                    códigos de comprobante
                  </button>{" "}
                  disponibles.
                </p>
              </div>

              <div
                className="flex items-center gap-3 px-4 py-3.5 rounded-xl mb-4 g-sora"
                style={{
                  background: "rgba(39,160,201,.06)",
                  border: "1px solid rgba(39,160,201,.15)",
                }}>
                <Download
                  className="h-4 w-4 flex-shrink-0"
                  style={{ color: "#27a0c9" }}
                />
                <p className="text-sm text-gray-600">
                  ¿No tenés el archivo armado?{" "}
                  <a
                    href="/plantilla-facturas.csv"
                    download="plantilla-facturas.csv"
                    className="font-semibold hover:underline"
                    style={{ color: "#27a0c9" }}>
                    Descargá la plantilla CSV con todas las columnas
                  </a>
                  .
                </p>
              </div>

              <div
                className="flex items-start gap-3 px-4 py-4 rounded-xl"
                style={{
                  background: "rgba(39,160,201,.06)",
                  border: "1px solid rgba(39,160,201,.15)",
                }}>
                <CalendarCheck2
                  className="h-5 w-5 flex-shrink-0 mt-0.5"
                  style={{ color: "#27a0c9" }}
                />
                <div className="g-sora">
                  <p
                    className="font-semibold text-sm"
                    style={{ color: "#1e7a9c" }}>
                    Formatos de fecha flexibles
                  </p>
                  <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                    El sistema detecta automáticamente múltiples formatos:{" "}
                    <Code>15/03/2026</Code>, <Code>2026-03-15</Code>,{" "}
                    <Code>20260315</Code>, <Code>Mar-26</Code>,{" "}
                    <Code>15-Mar</Code>, <Code>15/03</Code> (asume año actual).
                    Podés mezclar formatos en distintas filas.
                  </p>
                </div>
              </div>
            </Step>

            {/* ── Step 3: Revisar y generar ──────────────────── */}
            <Step
              id="revisar-generar"
              number="03"
              title="Revisá y generá los CAEs"
              accentColor="#27a0c9"
              showConnector={false}
              animClass="g-anim-6">
              <p className="g-sora text-gray-600 leading-relaxed mb-5">
                Después de cargar el archivo, el sistema lo analiza y te lleva a
                la pantalla de revisión. Desde ahí podés editar filas, eliminar
                las que no correspondan y finalmente generar los CAEs.
              </p>

              <div className="space-y-4 mb-6">
                {[
                  {
                    icon: Eye,
                    color: "#27a0c9",
                    title: "Revisá cada fila",
                    desc: "La tabla muestra todas las facturas del archivo. Las celdas resaltadas indican datos faltantes u obligatorios. Podés editar cualquier celda haciendo doble clic.",
                  },
                  {
                    icon: Hash,
                    color: "#27a0c9",
                    title: "Elegí el punto de venta",
                    desc: "Seleccioná el punto de venta (PtoVta) habilitado en ARCA para WSFEv1. Todos los comprobantes del lote se generarán bajo ese PtoVta.",
                  },
                  {
                    icon: Zap,
                    color: "#27a0c9",
                    title: "Generá los CAEs",
                    desc: 'Hacé clic en "Generar Facturas". El sistema envía cada fila a ARCA en secuencia y muestra el progreso en tiempo real. Al finalizar, cada fila muestra su CAE asignado o el error correspondiente.',
                  },
                ].map(({ icon: Icon, color, title, desc }) => (
                  <div
                    key={title}
                    className="flex items-start gap-4 rounded-xl px-4 py-4 g-sora"
                    style={{
                      background: `${color}08`,
                      border: `1px solid ${color}20`,
                    }}>
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ background: `${color}15` }}>
                      <Icon className="h-4 w-4" style={{ color }} />
                    </div>
                    <div>
                      <p className="font-semibold text-sm text-gray-800">
                        {title}
                      </p>
                      <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                        {desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div
                className="flex items-start gap-3 px-4 py-4 rounded-xl"
                style={{
                  background: "rgba(39,160,201,.06)",
                  border: "1px solid rgba(39,160,201,.18)",
                }}>
                <CheckCircle2
                  className="h-5 w-5 flex-shrink-0 mt-0.5"
                  style={{ color: "#27a0c9" }}
                />
                <div className="g-sora">
                  <p
                    className="font-semibold text-sm"
                    style={{ color: "#1e7a9c" }}>
                    Los CAEs se guardan automáticamente
                  </p>
                  <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                    Cada CAE generado queda registrado en el historial de cargas.
                    Podés volver a consultarlo en cualquier momento desde la
                    pantalla principal de Facturación.
                  </p>
                </div>
              </div>
            </Step>

            {/* ── Errores comunes ────────────────────────────── */}
            <div
              id="errores-comunes"
              className="g-anim g-anim-7"
              style={{ scrollMarginTop: "120px" }}>
              <div className="flex items-center gap-3 mb-6">
                <div
                  className="g-condensed w-10 h-10 rounded-xl flex items-center justify-center text-white text-base font-black flex-shrink-0"
                  style={{
                    background:
                      "linear-gradient(145deg, #27a0c9 0%, #1e7a9c 100%)",
                    boxShadow: "0 4px 16px rgba(39,160,201,.3)",
                  }}>
                  <XCircle className="h-5 w-5" />
                </div>
                <h2 className="g-sora text-xl md:text-2xl font-bold text-gray-900 leading-snug">
                  Errores comunes
                </h2>
              </div>

              <p className="g-sora text-gray-500 text-sm leading-relaxed mb-8">
                Si algo sale mal, el sistema te muestra el mensaje de error.
                Estos son los más frecuentes y cómo resolverlos.
              </p>

              <div className="space-y-3">
                <ErrorCard
                  icon={ShieldAlert}
                  tag="Certificados">
                  <p className="font-semibold text-gray-800 mb-1">No tenés certificados activos</p>
                  <p>
                    Aparece al ingresar si no hay ningún certificado con estado{" "}
                    <Code>ACTIVE</Code> en tu cuenta. Creá uno en{" "}
                    <Link
                      href="/mis-certificados/configurar"
                      className="font-semibold hover:underline"
                      style={{ color: "#27a0c9" }}>
                      Mis Certificados
                    </Link>{" "}
                    y subí el <Code>.crt</Code> firmado por ARCA.
                  </p>
                </ErrorCard>

                <ErrorCard
                  icon={FileWarning}
                  tag="Carga de archivo">
                  <p className="font-semibold text-gray-800 mb-1">Error al analizar el archivo</p>
                  <p>
                    El sistema no pudo leer el archivo: está vacío, el formato
                    no es <Code>.xlsx</Code>/<Code>.xls</Code>/<Code>.csv</Code>,
                    o está corrompido o con contraseña. Revisá que se abra
                    correctamente en Excel y tenga al menos una fila de datos.
                  </p>
                </ErrorCard>

                <ErrorCard
                  icon={FileSpreadsheet}
                  tag="Formato de archivo">
                  <p className="font-semibold text-gray-800 mb-1">Columnas faltantes o con nombre incorrecto</p>
                  <p>
                    Los encabezados obligatorios (<Code>cbteTipo</Code>,{" "}
                    <Code>docTipo</Code>, <Code>docNro</Code>,{" "}
                    <Code>impTotal</Code>, <Code>cbteFch</Code>) deben
                    coincidir exactamente (respetan mayúsculas). Usá la plantilla
                    CSV como referencia.
                  </p>
                </ErrorCard>

                <ErrorCard
                  icon={CalendarX}
                  tag="Datos de fila">
                  <p className="font-semibold text-gray-800 mb-1">Fecha inválida en una fila</p>
                  <p>
                    Todas las fechas deben ser texto en formato{" "}
                    <Code>YYYYMMDD</Code> (ej: <Code>20260315</Code>). Si la
                    columna está en formato &quot;Fecha&quot; de Excel, convertila a
                    texto antes de guardar.
                  </p>
                </ErrorCard>

                <ErrorCard
                  icon={Hash}
                  tag="Configuración ARCA">
                  <p className="font-semibold text-gray-800 mb-1">Punto de venta no válido o bloqueado</p>
                  <p>
                    ARCA rechazó el PtoVta porque no está habilitado, está
                    bloqueado, o no tiene asignado el tipo de emisión{" "}
                    <strong className="text-gray-700">CAE</strong>. Verificá en
                    ARCA que esté activo para Factura Electrónica bajo el mismo
                    CUIT del certificado.
                  </p>
                </ErrorCard>

                <ErrorCard
                  icon={Copy}
                  tag="Error ARCA">
                  <p className="font-semibold text-gray-800 mb-1">Comprobante ya autorizado (duplicado)</p>
                  <p>
                    ARCA detectó un comprobante con el mismo número en ese
                    PtoVta. Revisá el historial de cargas — si ya tiene CAE
                    asignado, no hay que regenerarlo. Para anularlo contactá a
                    tu asesor.
                  </p>
                </ErrorCard>

                <ErrorCard
                  icon={KeyRound}
                  tag="Certificados">
                  <p className="font-semibold text-gray-800 mb-1">Certificado vencido o no autorizado</p>
                  <p>
                    WSAA rechazó el token porque el certificado venció o no
                    tiene autorización para <Code>wsfe</Code>. Verificá la
                    fecha de vencimiento en{" "}
                    <Link
                      href="/mis-certificados"
                      className="font-semibold hover:underline"
                      style={{ color: "#27a0c9" }}>
                      Mis Certificados
                    </Link>
                    . Si venció, generá un nuevo CSR y subí el certificado
                    renovado. Si está vigente, revisá la autorización en WSASS.
                  </p>
                </ErrorCard>

                <ErrorCard
                  icon={WifiOff}
                  tag="Conectividad">
                  <p className="font-semibold text-gray-800 mb-1">Error de conexión con ARCA / Timeout</p>
                  <p>
                    Los servidores de ARCA no respondieron a tiempo. Ocurre por
                    mantenimientos o alta demanda (especialmente a fin de mes).
                    Esperá unos minutos y reintentá — las filas con error quedan
                    marcadas en la tabla de revisión.
                  </p>
                </ErrorCard>

                <ErrorCard
                  icon={AlertCircle}
                  tag="Respuesta ARCA">
                  <p className="font-semibold text-gray-800 mb-1">Observaciones en el CAE (código 10XXX)</p>
                  <p>
                    ARCA emitió el CAE pero adjuntó observaciones. El
                    comprobante es válido, pero hay inconsistencias menores:
                    CUIT del cliente no registrado en ARCA, importe de IVA
                    incorrecto, o condición impositiva no verificada.
                  </p>
                </ErrorCard>
              </div>

              {/* ── WhatsApp fallback ─────────────────────────── */}
              <div
                className="mt-6 flex items-center justify-between gap-4 rounded-xl px-5 py-4 g-sora"
                style={{
                  background: "#f9fafb",
                  border: "1px solid #e8ecf0",
                }}>
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ background: "#e8f5e9" }}>
                    <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current" style={{ color: "#25d366" }}>
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-800">
                      ¿Seguís sin poder resolverlo?
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      Escribinos y te ayudamos en minutos.
                    </p>
                  </div>
                </div>
                <a
                  href="https://wa.me/541127398316"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-shrink-0 inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold text-white transition-all hover:brightness-110 active:scale-95"
                  style={{ background: "#25d366" }}>
                  Escribir por WhatsApp
                </a>
              </div>
            </div>

            {/* ── CTA final ─────────────────────────────────── */}
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
                  Listo para facturar
                </div>
                <h3 className="g-sora text-2xl md:text-3xl font-bold text-white mb-3 leading-snug">
                  Empezá con
                  <br />
                  Homologación primero
                </h3>
                <p
                  className="g-sora text-sm leading-relaxed mb-8 max-w-md"
                  style={{ color: "rgba(255,255,255,.55)" }}>
                  Antes de emitir facturas reales, probá el flujo completo en el
                  ambiente de{" "}
                  <strong style={{ color: "rgba(255,255,255,.8)" }}>
                    testing (homologación)
                  </strong>{" "}
                  para asegurarte de que todo funcione correctamente.
                </p>
                <div className="flex flex-wrap gap-3">
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
                  <Link
                    href="/mis-certificados/guia/habilitar-testing"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl g-sora font-semibold text-sm transition-all duration-200 hover:brightness-110"
                    style={{
                      background: "rgba(255,255,255,.1)",
                      color: "rgba(255,255,255,.75)",
                    }}>
                    <BadgeCheck className="h-4 w-4" />
                    Configurar certificado testing
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* ── Sticky sidebar ────────────────────────────────── */}
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

              <div
                className="mt-6 pt-5"
                style={{ borderTop: "1px solid #f1f5f9" }}>
                <p className="g-sora text-xs text-gray-400 mb-3">
                  ¿Problemas con el certificado?
                </p>
                <Link
                  href="/mis-certificados/guia"
                  className="g-sora inline-flex items-center gap-1.5 text-xs font-semibold hover:underline"
                  style={{ color: "#27a0c9" }}>
                  Ver todas las guías
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* ── CbteTipo modal ──────────────────────────────────── */}
      {showCbteTipos && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(15,23,42,.5)", backdropFilter: "blur(4px)" }}
          onClick={() => setShowCbteTipos(false)}>
          <div
            className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden"
            onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-5 pt-5 pb-3">
              <h3 className="g-sora text-sm font-bold text-gray-900">
                Códigos de comprobante
              </h3>
              <button
                onClick={() => setShowCbteTipos(false)}
                className="p-1 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer">
                <XCircle className="w-4 h-4" />
              </button>
            </div>
            <div className="px-5 pb-5">
              <p className="g-sora text-xs text-gray-400 mb-3">
                Podés usar el código numérico o el nombre en tu archivo.
              </p>
              <div className="grid grid-cols-2 gap-x-4 gap-y-1.5">
                {CBTE_TIPOS.map(({ code, label }) => (
                  <div key={code} className="flex items-center gap-2">
                    <span
                      className="g-sora text-xs font-bold tabular-nums w-7 text-right"
                      style={{ color: "#27a0c9" }}>
                      {code}
                    </span>
                    <span className="g-sora text-xs text-gray-600">{label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

/* ── Helper components ──────────────────────────────────────── */

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

interface ErrorCardProps {
  icon: React.ElementType;
  tag: string;
  children: React.ReactNode;
}

function ErrorCard({ icon: Icon, tag, children }: ErrorCardProps) {
  return (
    <div className="g-err-card rounded-xl bg-white overflow-hidden">
      <div className="flex items-start gap-4 px-5 py-4">
        <div
          className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
          style={{ background: "rgba(239,68,68,.12)" }}>
          <Icon className="h-4 w-4" style={{ color: "#ef4444" }} />
        </div>
        <div className="flex-1 min-w-0">
          <span
            className="g-sora text-xs font-semibold px-2 py-0.5 rounded-full mb-2 inline-block"
            style={{ background: "rgba(239,68,68,.12)", color: "#dc2626" }}>
            {tag}
          </span>
          <div className="g-sora text-xs text-gray-500 leading-relaxed space-y-1">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

function Code({ children }: { children: React.ReactNode }) {
  return (
    <code
      className="px-1.5 py-0.5 rounded text-xs font-mono"
      style={{ background: "rgba(39,160,201,.1)", color: "#1e7a9c" }}>
      {children}
    </code>
  );
}

function darken(hex: string): string {
  const map: Record<string, string> = {
    "#27a0c9": "#1e7a9c",
  };
  return map[hex] ?? hex;
}
