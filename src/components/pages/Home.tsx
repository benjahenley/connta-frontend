"use client";
import React, { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ShieldCheck,
  ArrowRight,
  Upload,
  Eye,
  CheckCircle2,
} from "lucide-react";
import { useAuth } from "../providers/AuthProvider";
import FooterPublic from "@/components/navigation/FooterPublic";

const stats = [
  { value: "8 hs", label: "menos por semana en carga manual" },
  { value: "1 día", label: "recuperado cada 100 facturas" },
  { value: "90%", label: "menos tiempo operativo repetitivo" },
];

const painSteps = [
  "Abrir planillas y buscar datos cliente por cliente",
  "Copiar importes, CUIT y conceptos manualmente",
  "Entrar a ARCA y emitir comprobantes uno por uno",
  "Hacerle notas de credito a las facturas mal cargadas",
];

const features = [
  {
    title: "Facturación Masiva",
    description:
      "Subí tu planilla Excel o CSV y generamos todas las facturas en ARCA automáticamente. Sin reingreso de datos.",
  },
  {
    title: "Certificados por cliente",
    description:
      "Tené ordenados los certificados de cada CUIT en un solo lugar y elegí cuál usar al facturar, sin vueltas.",
  },
  {
    title: "Multi-CUIT",
    description:
      "Administrá todos tus clientes desde un solo panel. Cambiá entre CUITs con un clic.",
  },
  {
    title: "CAE en Tiempo Real",
    description:
      "Obtené el Código de Autorización de Emisión al instante y descargá los comprobantes automáticamente.",
  },
];

const steps = [
  {
    title: "Subí tu planilla",
    description:
      "Importá tu Excel o CSV con los datos de las facturas. El sistema valida automáticamente.",
    icon: Upload,
  },
  {
    title: "Revisá y confirmá",
    description:
      "Visualizá una tabla editable con todas las facturas. Corregí antes de enviar.",
    icon: Eye,
  },
  {
    title: "ARCA lo hace solo",
    description:
      "Con un clic, enviamos todo a ARCA, obtenemos los CAE y guardamos los comprobantes.",
    icon: CheckCircle2,
  },
];

const faqs = [
  {
    question: "¿Necesito cargar las facturas una por una?",
    answer:
      "No. Connta está pensado para trabajar por lote: subís tu Excel o CSV, revisás los datos en una tabla editable y recién después enviás todo junto a ARCA.",
  },
  {
    question: "¿Qué pasa si mi planilla tiene errores?",
    answer:
      "Antes de emitir, el sistema valida los datos y te muestra qué corregir. Así evitás avanzar con errores de CUIT, importes, fechas o campos obligatorios.",
  },
  {
    question:
      "¿Tengo que generar un certificado por cada cliente al que le facturo?",
    answer:
      "No. El certificado se genera una sola vez por cada CUIT desde el cual emitís facturas, no por cada cliente. Una vez configurado, podés facturarle a todos los clientes que quieras desde ese CUIT.",
  },
  {
    question: "¿Puedo trabajar con varios clientes o CUITs?",
    answer:
      "Depende del plan. Connta permite administrar distintos certificados y operar con más de un cliente o CUIT, pero esa capacidad varía según el nivel que tengas activo.",
  },
  {
    question: "¿Los comprobantes quedan guardados?",
    answer:
      "Sí. Cada emisión queda registrada para que puedas revisar resultados, volver al historial y descargar los comprobantes cuando lo necesites.",
  },
  {
    question: "¿Hace falta tarjeta para probar?",
    answer:
      "No. Podés empezar gratis y probar el flujo con un volumen acotado antes de decidir si querés escalar.",
  },
];

export default function HomePage() {
  const { user } = useAuth();

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    window.scrollTo({
      top: 0,
      left: 0,
      behavior: prefersReducedMotion ? "auto" : "smooth",
    });
  }, []);

  useEffect(() => {
    const els = document.querySelectorAll("[data-reveal]");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("revealed");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 },
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,600;0,9..144,700;0,9..144,900;1,9..144,400;1,9..144,600&family=DM+Sans:wght@400;500;600&display=swap');

        .font-display { font-family: 'Fraunces', serif; }
        .font-body    { font-family: 'DM Sans', sans-serif; }

        /* ── Hero load animations (fire immediately) ── */
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(28px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse-dot {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%      { opacity: 0.6; transform: scale(1.3); }
        }
        @keyframes bob {
          0%, 100% { transform: translateY(0) translateX(-50%); }
          50%      { transform: translateY(6px) translateX(-50%); }
        }

        .au   { animation: fadeUp 0.75s ease both; }
        .d1   { animation-delay: 0.1s; }
        .d2   { animation-delay: 0.22s; }
        .d3   { animation-delay: 0.36s; }
        .d4   { animation-delay: 0.5s; }
        .d5   { animation-delay: 0.64s; }
        .d6   { animation-delay: 0.78s; }

        /* ── Scroll reveal ── */
        [data-reveal] {
          opacity: 0;
          transform: translateY(28px);
          transition: opacity 0.65s ease, transform 0.65s ease;
        }
        [data-reveal].revealed {
          opacity: 1;
          transform: translateY(0);
        }
        [data-reveal][data-delay="1"] { transition-delay: 0.08s; }
        [data-reveal][data-delay="2"] { transition-delay: 0.18s; }
        [data-reveal][data-delay="3"] { transition-delay: 0.28s; }
        [data-reveal][data-delay="4"] { transition-delay: 0.38s; }

        /* ── Layout ── */
        .hero-overlay {
          background: linear-gradient(
            160deg,
            rgba(4,20,35,0.82) 0%,
            rgba(10,35,55,0.88) 60%,
            rgba(16,50,70,0.75) 100%
          );
        }
        .grid-lines {
          background-image:
            linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px);
          background-size: 64px 64px;
        }
        .mesh-dark {
          background-color: #080f16;
          background-image:
            radial-gradient(ellipse at 15% 60%, rgba(39,160,201,0.18) 0%, transparent 55%),
            radial-gradient(ellipse at 85% 20%, rgba(16,185,129,0.10) 0%, transparent 50%);
        }

        /* ── Components ── */
        .feature-card {
          transition: transform 0.25s ease, box-shadow 0.25s ease;
        }
        .feature-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 24px 48px rgba(39,160,201,0.12);
        }
        .feature-card:hover .f-icon { transform: scale(1.1) rotate(-4deg); }
        .f-icon { transition: transform 0.3s ease; }

        .number-grad {
          background: linear-gradient(135deg, #27a0c9 0%, #10b981 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .cta-btn { transition: all 0.2s ease; cursor: pointer; }
        .cta-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 32px rgba(39,160,201,0.4);
        }
        .cta-glow { box-shadow: 0 0 48px rgba(39,160,201,0.35); }

        .scroll-bob {
          position: absolute;
          bottom: 32px;
          left: 50%;
          transform: translateX(-50%);
          animation: bob 2s ease-in-out infinite;
        }
        .dot-pulse { animation: pulse-dot 2s ease-in-out infinite; }

        .trust-icon-wrap { transition: transform 0.2s ease; }
        .trust-item:hover .trust-icon-wrap { transform: scale(1.08); }
      `}</style>

      <div className="font-body min-h-screen bg-white text-gray-900 overflow-x-hidden">
        {/* ── HERO (original banner) ── */}
        <section
          className="relative flex min-h-screen flex-col items-center justify-center px-6 py-24 text-center overflow-hidden"
          style={{
            backgroundImage: "url('/banner-home.webp')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}>
          <div className="hero-overlay absolute inset-0" />
          <div className="grid-lines absolute inset-0" />

          <div className="relative z-10 flex flex-col items-center max-w-4xl mx-auto">
            <Image
              src="/favicon.svg"
              alt="Connta"
              className="au d2 mb-8 drop-shadow-2xl"
              width={76}
              height={76}
            />

            <h1 className="font-display au d3 text-5xl md:text-[4.5rem] font-bold leading-[1.06] text-white mb-6">
              Facturación ARCA
              <br />
              <em className="not-italic" style={{ color: "#7dd3fc" }}>
                sin esfuerzo.
              </em>
            </h1>

            <p
              className="au d4 max-w-2xl text-lg md:text-xl mb-10 leading-relaxed"
              style={{ color: "rgba(255,255,255,0.68)" }}>
              Importá tu planilla, revisá, confirmás y ARCA emite los CAE en
              lote. Pensado para estudios contables que ya no quieren trabajar
              factura por factura.
            </p>

            <div className="au d5 flex flex-col sm:flex-row gap-4 mb-14">
              {user ? (
                <Link href="/dashboard">
                  <button
                    className="cta-btn px-8 py-4 rounded-xl text-white font-semibold text-base flex items-center gap-2 shadow-lg"
                    style={{ background: "#27a0c9" }}>
                    Ir al dashboard <ArrowRight className="h-5 w-5" />
                  </button>
                </Link>
              ) : (
                <>
                  <Link href="/auth/sign-up">
                    <button
                      className="cta-btn px-8 py-4 rounded-xl text-white font-semibold text-base flex items-center gap-2 shadow-lg"
                      style={{ background: "#27a0c9" }}>
                      Empezar gratis <ArrowRight className="h-5 w-5" />
                    </button>
                  </Link>
                  <Link href="/auth/sign-in">
                    <button
                      className="cursor-pointer px-8 py-4 rounded-xl text-white font-semibold text-base border border-white/20 hover:bg-white/10 transition-all duration-200"
                      style={{
                        background: "rgba(255,255,255,0.08)",
                        backdropFilter: "blur(8px)",
                      }}>
                      Iniciar sesión
                    </button>
                  </Link>
                </>
              )}
            </div>
          </div>

          <div className="scroll-bob">
            <div className="w-6 h-10 border-2 border-white/25 rounded-full flex items-start justify-center pt-2">
              <div
                className="w-1 h-3 rounded-full"
                style={{ background: "rgba(255,255,255,0.5)" }}
              />
            </div>
          </div>
        </section>

        {/* ── HERO (story-first) ── */}
        <section
          className="relative overflow-hidden px-6 py-18 md:px-10 md:py-24"
          style={{ background: "#f8fbfd" }}>
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(circle at top left, rgba(39,160,201,0.10), transparent 34%), radial-gradient(circle at bottom right, rgba(16,185,129,0.08), transparent 28%)",
            }}
          />

          <div className="max-w-7xl mx-auto relative z-10 grid items-center gap-10 lg:grid-cols-[1.08fr_0.92fr]">
            <div className="relative au d2 overflow-hidden rounded-[2rem] border border-[#dce9ef] shadow-[0_30px_90px_rgba(15,23,42,0.12)] min-h-[320px] lg:min-h-[620px]">
              <Image
                src="/manual-invoice-pain.png"
                alt="Carga manual de planillas contables con calculadora y reportes"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 54vw"
                priority
              />
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(180deg, rgba(8,15,22,0.10) 0%, rgba(8,15,22,0.30) 100%)",
                }}
              />
              <div className="absolute left-5 right-5 bottom-5 rounded-2xl border border-white/20 bg-[#08151fcc] px-5 py-4 backdrop-blur-md">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#7dd3fc] mb-2">
                  Él es Juan
                </p>
                <p className="text-sm md:text-base leading-relaxed text-white/80">
                  Cada mes dedica más de 8 horas semanales a cargar manualmente
                  las 127 facturas del estudio. El proceso lo obliga a extender
                  su jornada para cumplir con los vencimientos.
                </p>
              </div>
            </div>

            <div className="lg:pl-4">
              <h1 className="font-display au d3 mt-6 text-5xl md:text-[4.6rem] font-bold leading-[1.02] text-[#101828]">
                Cargar facturas
                <br />
                <span style={{ color: "#27a0c9" }}>una por una </span>
                no escala.
              </h1>

              <p
                className="au d4 mt-6 max-w-xl text-lg md:text-xl leading-relaxed"
                style={{ color: "#526071" }}>
                Si tu estudio todavía entra a ARCA comprobante por comprobante,
                el problema no es la demanda: es el trabajo manual. Connta toma
                tu planilla, te deja revisar todo en una tabla y emite en lote
                sin reingresar datos.
              </p>

              <div className="au d5 mt-8 flex flex-col sm:flex-row gap-4">
                {user ? (
                  <Link href="/dashboard">
                    <button
                      className="cta-btn px-8 py-4 rounded-xl text-white font-semibold text-base flex items-center gap-2 shadow-lg"
                      style={{ background: "#27a0c9" }}>
                      Ir al dashboard <ArrowRight className="h-5 w-5" />
                    </button>
                  </Link>
                ) : (
                  <>
                    <Link href="/auth/sign-up">
                      <button
                        className="cta-btn px-8 py-4 rounded-xl text-white font-semibold text-base flex items-center gap-2 shadow-lg"
                        style={{ background: "#27a0c9" }}>
                        Probar con 5 facturas gratis{" "}
                        <ArrowRight className="h-5 w-5" />
                      </button>
                    </Link>
                    <Link href="/funcionalidades">
                      <button
                        className="cursor-pointer px-8 py-4 rounded-xl text-[#0f172a] font-semibold text-base border transition-all duration-200 hover:bg-slate-50"
                        style={{
                          borderColor: "#d7e7ef",
                          background: "rgba(255,255,255,0.85)",
                        }}>
                        Ver cómo funciona
                      </button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* ── BRIDGE ── */}
        <section className="py-20 px-6 md:px-10 bg-white">
          <div className="max-w-6xl mx-auto grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
            <div>
              <h2
                data-reveal
                data-delay="1"
                className="font-display text-4xl md:text-5xl font-bold text-gray-900 mb-5 leading-tight">
                Cada hora que hoy se va en carga manual
                <br />
                <span style={{ color: "#27a0c9" }}>
                  mañana la podrías usar para crecer.
                </span>
              </h2>
              <p
                data-reveal
                data-delay="2"
                className="text-lg max-w-xl"
                style={{ color: "#6b7280" }}>
                Menos tiempo copiando datos significa más tiempo para revisar,
                responder a clientes, ordenar vencimientos y sumar cuentas sin
                agrandar el cuello de botella operativo.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {painSteps.map((step, i) => (
                <div
                  key={step}
                  data-reveal
                  data-delay={i + 1}
                  className="rounded-2xl border p-5"
                  style={{
                    borderColor: "#e6eef3",
                    background: "#f8fbfd",
                  }}>
                  <div
                    className="font-display text-3xl mb-3"
                    style={{ color: "rgba(39,160,201,0.30)" }}>
                    0{i + 1}
                  </div>
                  <p
                    className="text-base leading-relaxed"
                    style={{ color: "#334155" }}>
                    {step}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── SAVINGS BANNER ── */}
        <section className="mesh-dark py-16 px-6">
          <div className="max-w-5xl mx-auto">
            <div className="mb-12 text-center">
              <p
                data-reveal
                className="text-xs font-bold uppercase tracking-[0.18em] mb-3"
                style={{ color: "#7dd3fc" }}>
                Lo que perdés hoy
              </p>
              <h2
                data-reveal
                data-delay="1"
                className="font-display text-4xl md:text-5xl font-bold text-white mb-4">
                Facturar a mano
                <br />
                <span style={{ color: "#7dd3fc" }}>tiene un precio.</span>
              </h2>
              <p
                data-reveal
                data-delay="2"
                className="text-lg max-w-3xl mx-auto"
                style={{ color: "#6b8fa8" }}>
                No es solo tiempo operativo. Es foco que se pierde, capacidad
                que no escala y horas que tu estudio deja de usar en tareas de
                más valor.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
            {stats.map((stat, i) => (
              <div
                key={i}
                data-reveal
                data-delay={i + 1}
                className="px-2 text-center overflow-visible">
                <div className="font-display text-4xl md:text-5xl font-bold leading-[1.12] number-grad mb-1">
                  {stat.value}
                </div>
                <div
                  className="text-sm font-medium"
                  style={{ color: "#6b8fa8" }}>
                  {stat.label}
                </div>
              </div>
            ))}
            </div>
          </div>
        </section>

        {/* ── FEATURES (scroll reveal) ── */}
        <section id="funcionalidades" className="py-24 px-6 bg-white">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <p
                data-reveal
                className="text-xs font-bold uppercase tracking-[0.18em] mb-3"
                style={{ color: "#27a0c9" }}>
                Funcionalidades
              </p>
              <h2
                data-reveal
                data-delay="1"
                className="font-display text-4xl md:text-5xl font-bold text-gray-900 mb-5">
                Todo lo que necesitás
                <br />
                <span style={{ color: "#27a0c9" }}>en un solo lugar</span>
              </h2>
              <p
                data-reveal
                data-delay="2"
                className="text-lg max-w-xl mx-auto"
                style={{ color: "#6b7280" }}>
                Diseñado específicamente para la operatoria con ARCA. Sin
                funciones que no usás.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {features.map((feature, i) => (
                <div
                  key={i}
                  data-reveal
                  data-delay={i + 1}
                  className="feature-card group relative rounded-2xl border bg-white p-8 pl-10 overflow-hidden"
                  style={{
                    borderColor: "#e5e7eb",
                  }}>
                  <div
                    className="absolute left-0 top-6 bottom-6 w-1 rounded-r-full"
                    style={{
                      background:
                        "linear-gradient(180deg, #27a0c9 0%, #10b981 100%)",
                    }}
                  />
                  <div
                    className="absolute top-0 right-0 w-40 h-40 rounded-bl-[80px] opacity-[0.04]"
                    style={{
                      background: "linear-gradient(135deg, #27a0c9, #10b981)",
                    }}
                  />
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">
                    {feature.title}
                  </h3>
                  <p
                    className="leading-relaxed"
                    style={{ color: "#6b7280" }}>
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── HOW IT WORKS (scroll reveal) ── */}
        <section className="py-24 px-6" style={{ background: "#f8fafc" }}>
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16">
              <p
                data-reveal
                className="text-xs font-bold uppercase tracking-[0.18em] mb-3"
                style={{ color: "#27a0c9" }}>
                Cómo funciona
              </p>
              <h2
                data-reveal
                data-delay="1"
                className="font-display text-4xl md:text-5xl font-bold text-gray-900">
                De la carga manual
                <br className="hidden md:block" />
                al CAE en lote
                <br className="hidden md:block" />
                <span style={{ color: "#27a0c9" }}>en 3 pasos</span>
              </h2>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-3 md:gap-8">
              {steps.map((step, i) => {
                const Icon = step.icon;
                return (
                  <div
                    key={i}
                    data-reveal
                    data-delay={i + 1}
                    className="relative flex h-full flex-col items-center rounded-[2rem] border bg-white px-7 pb-8 pt-12 text-center shadow-[0_18px_40px_rgba(15,23,42,0.06)]"
                    style={{ borderColor: "#e6eef3" }}>
                    <div
                      className="absolute left-1/2 top-0 inline-flex -translate-x-1/2 -translate-y-1/2 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] shadow-sm"
                      style={{
                        color: "#1e7a9c",
                        background: "#eaf7fc",
                        border: "1px solid rgba(39,160,201,0.14)",
                      }}>
                      Paso 0{i + 1}
                    </div>
                    <div className="relative mb-7">
                      <div
                        className="h-28 w-28 rounded-full flex items-center justify-center border-4 border-white shadow-xl"
                        style={{
                          background:
                            i === steps.length - 1
                              ? "linear-gradient(135deg, #10b981, #047857)"
                              : "linear-gradient(135deg, #27a0c9, #1e7a9c)",
                        }}>
                        <Icon className="h-10 w-10 text-white" />
                      </div>
                    </div>
                    <h3 className="font-display text-2xl font-bold text-gray-900 mb-3">
                      {step.title}
                    </h3>
                    <p
                      className="max-w-xs leading-relaxed"
                      style={{ color: "#6b7280" }}>
                      {step.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── FAQ ── */}
        <section className="py-24 px-6 bg-white">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-14">
              <p
                data-reveal
                className="text-xs font-bold uppercase tracking-[0.18em] mb-3"
                style={{ color: "#27a0c9" }}>
                Preguntas frecuentes
              </p>
              <h2
                data-reveal
                data-delay="1"
                className="font-display text-4xl md:text-5xl font-bold text-gray-900 mb-5">
                Lo que normalmente preguntan
                <br />
                <span style={{ color: "#27a0c9" }}>antes de empezar</span>
              </h2>
              <p
                data-reveal
                data-delay="2"
                className="text-lg max-w-2xl mx-auto"
                style={{ color: "#6b7280" }}>
                Respuestas cortas para entender rápido cómo funciona Connta en
                la operatoria diaria del estudio.
              </p>
            </div>

            <div className="space-y-4">
              {faqs.map((faq, i) => (
                <div
                  key={faq.question}
                  data-reveal
                  data-delay={(i % 4) + 1}
                  className="rounded-2xl border p-6 md:p-7"
                  style={{
                    borderColor: "#e5e7eb",
                    background: "#fbfdff",
                  }}>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {faq.question}
                  </h3>
                  <p
                    className="text-base leading-relaxed"
                    style={{ color: "#6b7280" }}>
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── SECURITY CALLOUT (scroll reveal) ── */}
        <section
          className="py-20 px-6 bg-white border-t"
          style={{ borderColor: "#f1f5f9" }}>
          <div className="max-w-4xl mx-auto">
            <div
              data-reveal
              className="relative overflow-hidden rounded-[2rem] border px-8 py-9 md:px-10 md:py-10"
              style={{
                borderColor: "#dbeaf1",
                background:
                  "linear-gradient(135deg, #f7fcff 0%, #eef8fd 55%, #f7fcff 100%)",
                boxShadow: "0 24px 60px rgba(15,23,42,0.06)",
              }}>
              <div
                className="absolute right-0 top-0 h-40 w-40 rounded-full opacity-60"
                style={{
                  background:
                    "radial-gradient(circle, rgba(39,160,201,0.14) 0%, rgba(39,160,201,0) 70%)",
                }}
              />

              <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:gap-8">
                <div
                  className="flex h-[4.5rem] w-[4.5rem] shrink-0 items-center justify-center rounded-2xl"
                  style={{
                    background: "linear-gradient(135deg, #e8faf3, #eef8fd)",
                    boxShadow: "inset 0 0 0 1px rgba(39,160,201,0.08)",
                  }}>
                  <ShieldCheck
                    className="h-8 w-8"
                    style={{ color: "#10b981" }}
                  />
                </div>

                <div className="flex-1">
                  <p
                    className="mb-2 text-xs font-bold uppercase tracking-[0.18em]"
                    style={{ color: "#27a0c9" }}>
                    Seguridad
                  </p>
                  <h3 className="font-display text-3xl md:text-4xl font-bold text-gray-900 mb-3 leading-tight">
                    Datos protegidos
                  </h3>
                  <p
                    className="max-w-2xl text-base md:text-lg leading-relaxed"
                    style={{ color: "#526071" }}>
                    Tus certificados y la información operativa del estudio se
                    resguardan de forma segura. Certificados encriptados con
                    AES-256. Nunca compartimos tu información.
                  </p>
                  <div className="mt-5 flex flex-wrap gap-2">
                    {["AES-256", "Privacidad", "Resguardo seguro"].map(
                      (item) => (
                        <span
                          key={item}
                          className="rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em]"
                          style={{
                            color: "#1e7a9c",
                            background: "rgba(39,160,201,0.08)",
                            border: "1px solid rgba(39,160,201,0.12)",
                          }}>
                          {item}
                        </span>
                      ),
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── CTA (scroll reveal) ── */}
        <section className="mesh-dark py-28 px-6 text-center relative overflow-hidden">
          <div
            className="absolute inset-0 opacity-20 pointer-events-none"
            style={{
              backgroundImage:
                "radial-gradient(ellipse at 50% 80%, rgba(39,160,201,0.5) 0%, transparent 60%)",
            }}
          />
          <div className="relative z-10 max-w-3xl mx-auto">
            <p
              data-reveal
              className="text-xs font-bold uppercase tracking-[0.18em] mb-5"
              style={{ color: "#27a0c9" }}>
              Empezá hoy
            </p>
            <h2
              data-reveal
              data-delay="1"
              className="font-display text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Tu estudio contable,
              <br />
              <em className="not-italic" style={{ color: "#7dd3fc" }}>
                en modo automático.
              </em>
            </h2>
            <p
              data-reveal
              data-delay="2"
              className="text-xl mb-10 max-w-xl mx-auto"
              style={{ color: "#6b8fa8" }}>
              Unite a los estudios que ya dejaron de perder horas ingresando
              facturas. Sin tarjeta de crédito requerida.
            </p>
            <div data-reveal data-delay="3">
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                {user ? (
                  <Link href="/dashboard">
                    <button
                      className="cta-btn cta-glow px-10 py-5 text-white font-bold text-lg rounded-xl flex items-center gap-3"
                      style={{ background: "#27a0c9" }}>
                      Ir al dashboard <ArrowRight className="h-6 w-6" />
                    </button>
                  </Link>
                ) : (
                  <Link href="/auth/sign-up">
                    <button
                      className="cta-btn cta-glow px-10 py-5 text-white font-bold text-lg rounded-xl flex items-center gap-3"
                      style={{ background: "#27a0c9" }}>
                      Crear cuenta gratuita <ArrowRight className="h-6 w-6" />
                    </button>
                  </Link>
                )}

                <a
                  href="https://wa.me/5491527398316?text=Hola%2C%20me%20gustar%C3%ADa%20agendar%20una%20demo%20de%20Connta"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="cta-btn px-8 py-5 font-semibold text-base rounded-xl flex items-center gap-2.5 border"
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    borderColor: "rgba(125,211,252,0.25)",
                    color: "#e2e8f0",
                  }}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="h-5 w-5"
                    style={{ color: "#25d366" }}>
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                  </svg>
                  Hablar con soporte
                </a>
              </div>

              {!user && (
                <p className="mt-6 text-sm" style={{ color: "#4a6b80" }}>
                  ¿Ya tenés cuenta?{" "}
                  <Link
                    href="/auth/sign-in"
                    className="cursor-pointer font-medium hover:underline"
                    style={{ color: "#27a0c9" }}>
                    Iniciá sesión aquí
                  </Link>
                </p>
              )}
            </div>
          </div>
        </section>

        {/* ── FOOTER ── */}
        <FooterPublic />
      </div>
    </>
  );
}
