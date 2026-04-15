"use client";

import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  FileSpreadsheet,
  Shield,
  Users,
  ArrowRight,
  BookOpen,
  Bell,
  LayoutDashboard,
  Banknote,
  Brain,
  FileText,
  Download,
  Sparkles,
} from "lucide-react";

export default function FuncionalidadesPage() {
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
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,600;0,9..144,700;0,9..144,900;1,9..144,400&family=DM+Sans:wght@400;500;600&display=swap');

        .fn-display { font-family: 'Fraunces', serif; }
        .fn-body    { font-family: 'DM Sans', sans-serif; }

        @keyframes fnFadeUp {
          from { opacity: 0; transform: translateY(28px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .fn-au   { animation: fnFadeUp 0.75s ease both; }
        .fn-d1   { animation-delay: 0.08s; }
        .fn-d2   { animation-delay: 0.20s; }
        .fn-d3   { animation-delay: 0.34s; }
        .fn-d4   { animation-delay: 0.48s; }
        .fn-d5   { animation-delay: 0.62s; }

        [data-reveal] {
          opacity: 0;
          transform: translateY(28px);
          transition: opacity 0.65s ease, transform 0.65s ease;
        }
        [data-reveal].revealed {
          opacity: 1;
          transform: translateY(0);
        }
        [data-reveal][data-delay="1"] { transition-delay: 0.06s; }
        [data-reveal][data-delay="2"] { transition-delay: 0.16s; }
        [data-reveal][data-delay="3"] { transition-delay: 0.26s; }
        [data-reveal][data-delay="4"] { transition-delay: 0.36s; }

        .fn-hero-overlay {
          background: linear-gradient(
            160deg,
            rgba(4,20,35,0.88) 0%,
            rgba(10,35,55,0.92) 60%,
            rgba(16,50,70,0.80) 100%
          );
        }
        .fn-grid {
          background-image:
            linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px);
          background-size: 64px 64px;
        }

        .fn-feat-card {
          transition: box-shadow .25s ease, transform .25s ease, border-color .25s ease;
        }
        .fn-feat-card:hover {
          box-shadow: 0 12px 40px rgba(39,160,201,.14), 0 2px 8px rgba(0,0,0,.06);
          transform: translateY(-3px);
          border-color: rgba(39,160,201,.35);
        }

        .fn-phase-card {
          transition: box-shadow .25s ease, transform .25s ease;
        }
        .fn-phase-card:hover {
          box-shadow: 0 8px 32px rgba(0,0,0,.08);
          transform: translateY(-2px);
        }

        .fn-btn-primary {
          transition: background .2s ease, transform .2s ease, box-shadow .2s ease;
        }
        .fn-btn-primary:hover {
          background: #1e7a9c !important;
          transform: translateY(-1px);
          box-shadow: 0 6px 20px rgba(39,160,201,.4);
        }

        .fn-btn-ghost {
          transition: background .2s ease, transform .2s ease;
        }
        .fn-btn-ghost:hover {
          background: rgba(255,255,255,.12) !important;
          transform: translateY(-1px);
        }
      `}</style>

      <div className="fn-body">
        {/* ── HERO ──────────────────────────────────────────────── */}
        <section
          className="relative min-h-[86vh] flex items-center overflow-hidden"
          style={{ background: "#080f16" }}>
          <div className="fn-grid absolute inset-0" />
          <div className="fn-hero-overlay absolute inset-0" />

          <div className="relative z-10 w-full max-w-5xl mx-auto px-6 md:px-10 py-28 flex flex-col items-center text-center">
            <h1 className="fn-au fn-d2 fn-display text-5xl md:text-7xl font-black text-white leading-[1.05] mb-6">
              El estudio contable
              <br />
              <span style={{ color: "#7dd3ee" }}>que trabaja solo.</span>
            </h1>

            <p className="fn-au fn-d3 fn-body text-lg md:text-xl text-white/60 max-w-2xl leading-relaxed mb-10">
              Connta automatiza cada etapa del flujo contable — desde la
              facturación hasta las declaraciones juradas. Vos enfocate en tus
              clientes.
            </p>

            <div className="fn-au fn-d4 flex flex-col sm:flex-row items-center gap-3">
              <Link
                href="/auth/sign-up"
                className="fn-btn-primary inline-flex items-center gap-2 px-7 py-3.5 rounded-xl text-sm font-semibold text-white"
                style={{ background: "#27a0c9" }}>
                Empezar gratis
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/pricing"
                className="fn-btn-ghost inline-flex items-center gap-2 px-7 py-3.5 rounded-xl text-sm font-semibold text-white/80"
                style={{
                  background: "rgba(255,255,255,.07)",
                  border: "1px solid rgba(255,255,255,.14)",
                }}>
                Ver precios
              </Link>
            </div>
          </div>
        </section>

        {/* ── DISPONIBLE HOY ────────────────────────────────────── */}
        <section className="py-24 bg-white px-6 md:px-10">
          <div className="max-w-6xl mx-auto">
            <div data-reveal className="text-center mb-14">
              <p
                className="fn-body text-xs font-semibold uppercase tracking-[0.18em] mb-3"
                style={{ color: "#27a0c9" }}>
                Disponible hoy
              </p>
              <h2 className="fn-display text-4xl md:text-5xl font-black text-gray-900 leading-tight">
                Todo lo que necesitás
                <br />
                <span style={{ color: "#27a0c9" }}>
                  para facturar en escala.
                </span>
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  icon: FileSpreadsheet,
                  title: "Facturación Masiva",
                  desc: "Subí tu Excel y emitimos todas las facturas en ARCA en minutos, con CAE instantáneo por WSFEv1. Sin reingreso de datos.",
                  badge: "En vivo",
                  badgeColor: "#10b981",
                  badgeBg: "rgba(16,185,129,.1)",
                  delay: "1",
                },
                {
                  icon: Shield,
                  title: "Gestión de Certificados",
                  desc: "Organizá los certificados digitales de cada CUIT en un solo lugar y elegí cuál usar al facturar, sin vueltas.",
                  badge: "En vivo",
                  badgeColor: "#10b981",
                  badgeBg: "rgba(16,185,129,.1)",
                  delay: "2",
                },
                {
                  icon: Download,
                  title: "Historial y Descarga PDF",
                  desc: "Revisá los comprobantes emitidos, consultá errores y descargá el PDF de cada factura desde el historial.",
                  badge: "En vivo",
                  badgeColor: "#10b981",
                  badgeBg: "rgba(16,185,129,.1)",
                  delay: "3",
                },
              ].map(
                ({
                  icon: Icon,
                  title,
                  desc,
                  badge,
                  badgeColor,
                  badgeBg,
                  delay,
                }) => (
                  <div
                    key={title}
                    data-reveal
                    data-delay={delay}
                    className="fn-feat-card rounded-2xl bg-white p-7"
                    style={{ border: "1px solid #e5e7eb" }}>
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center mb-5"
                      style={{ background: "rgba(39,160,201,.1)" }}>
                      <Icon className="w-6 h-6" style={{ color: "#27a0c9" }} />
                    </div>
                    <div className="flex items-center gap-2 mb-3">
                      <h3 className="fn-display text-xl font-bold text-gray-900">
                        {title}
                      </h3>
                      <span
                        className="fn-body text-[10px] font-semibold px-2 py-0.5 rounded-full"
                        style={{ background: badgeBg, color: badgeColor }}>
                        {badge}
                      </span>
                    </div>
                    <p className="fn-body text-sm text-gray-500 leading-relaxed">
                      {desc}
                    </p>
                  </div>
                ),
              )}
            </div>
          </div>
        </section>

        {/* ── ROADMAP ───────────────────────────────────────────── */}
        <section
          className="py-24 px-6 md:px-10"
          style={{ background: "#f8fafc" }}>
          <div className="max-w-6xl mx-auto">
            <div data-reveal className="text-center mb-16">
              <p
                className="fn-body text-xs font-semibold uppercase tracking-[0.18em] mb-3"
                style={{ color: "#27a0c9" }}>
                Lo que viene
              </p>
              <h2 className="fn-display text-4xl md:text-5xl font-black text-gray-900 leading-tight mb-4">
                Automatización total,
                <br />
                fase por fase.
              </h2>
              <p className="fn-body text-gray-500 text-lg max-w-xl mx-auto leading-relaxed">
                Estamos construyendo la plataforma contable más completa de
                Argentina. Este es el camino.
              </p>
              <a
                href="https://wa.me/5491527398316?text=Hola%2C%20soy%20contador%2Fa%20y%20me%20gustar%C3%ADa%20sugerir%20algo%20para%20Connta"
                target="_blank"
                rel="noopener noreferrer"
                className="fn-body inline-flex items-center gap-2 mt-6 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:-translate-y-0.5"
                style={{
                  background: "#25D366",
                  boxShadow: "0 4px 14px rgba(37,211,102,.35)",
                }}>
                <svg
                  viewBox="0 0 24 24"
                  className="w-4 h-4 fill-current flex-shrink-0"
                  xmlns="http://www.w3.org/2000/svg">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                  <path d="M12 0C5.373 0 0 5.373 0 12c0 2.122.554 4.118 1.528 5.855L.057 23.882a.5.5 0 0 0 .61.61l6.087-1.464A11.945 11.945 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 0 1-5.016-1.377l-.36-.214-3.732.897.93-3.647-.235-.376A9.818 9.818 0 1 1 12 21.818z" />
                </svg>
                ¿Sos contador? Contanos qué necesitás automatizar
              </a>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
              {[
                {
                  phase: "Fase 1",
                  period: "Q2 2026",
                  title: "Base contable",
                  active: true,
                  items: [
                    {
                      icon: BookOpen,
                      text: "Libro IVA Digital automático generado desde tus facturas emitidas",
                    },
                    {
                      icon: Download,
                      text: "Importación de facturas recibidas desde ARCA",
                    },
                    {
                      icon: FileText,
                      text: "Historial de comprobantes con filtros avanzados",
                    },
                  ],
                  delay: "1",
                },
                {
                  phase: "Fase 2",
                  period: "Q3 2026",
                  title: "Declaraciones",
                  active: false,
                  items: [
                    {
                      icon: FileText,
                      text: "Pre-carga automática de DDJJ de IVA",
                    },
                    {
                      icon: Bell,
                      text: "Alertas de vencimientos fiscales y provisionales",
                    },
                    {
                      icon: Shield,
                      text: "Integración con SIAP / Mis Aplicaciones Web ARCA",
                    },
                  ],
                  delay: "2",
                },
                {
                  phase: "Fase 3",
                  period: "Q4 2026",
                  title: "Gestión del estudio",
                  active: false,
                  items: [
                    {
                      icon: Users,
                      text: "Portal del cliente: cada cliente ve sus propios comprobantes",
                    },
                    {
                      icon: Bell,
                      text: "Recordatorios automáticos de cobro y pago",
                    },
                    {
                      icon: LayoutDashboard,
                      text: "Dashboard de rentabilidad por cliente",
                    },
                  ],
                  delay: "3",
                },
                {
                  phase: "Fase 4",
                  period: "2027",
                  title: "Automatización total",
                  active: false,
                  future: true,
                  items: [
                    {
                      icon: Banknote,
                      text: "Conciliación bancaria automática",
                    },
                    {
                      icon: FileSpreadsheet,
                      text: "Integración con Tango, Bejerman y Colppy",
                    },
                    {
                      icon: Brain,
                      text: "IA para clasificación de gastos y cuentas contables",
                    },
                  ],
                  delay: "4",
                },
              ].map(
                ({ phase, period, title, active, future, items, delay }) => (
                  <div
                    key={phase}
                    data-reveal
                    data-delay={delay}
                    className="fn-phase-card rounded-2xl p-6 bg-white"
                    style={{
                      border: future
                        ? "1.5px dashed #d1d5db"
                        : active
                          ? "1.5px solid rgba(39,160,201,.4)"
                          : "1px solid #e5e7eb",
                      boxShadow: active
                        ? "0 0 0 4px rgba(39,160,201,.06)"
                        : undefined,
                    }}>
                    {/* Header */}
                    <div className="mb-5">
                      <div className="flex items-center justify-between mb-2">
                        <span
                          className="fn-body text-[10px] font-bold uppercase tracking-widest"
                          style={{
                            color: active
                              ? "#27a0c9"
                              : future
                                ? "#9ca3af"
                                : "#6b7280",
                          }}>
                          {phase}
                        </span>
                        <span
                          className="fn-body text-[10px] font-semibold px-2 py-0.5 rounded-full"
                          style={{
                            background: active
                              ? "rgba(39,160,201,.1)"
                              : future
                                ? "rgba(156,163,175,.1)"
                                : "rgba(107,114,128,.08)",
                            color: active
                              ? "#27a0c9"
                              : future
                                ? "#9ca3af"
                                : "#6b7280",
                          }}>
                          {period}
                        </span>
                      </div>
                      <h3
                        className="fn-display text-xl font-black"
                        style={{ color: future ? "#9ca3af" : "#0f172a" }}>
                        {title}
                      </h3>
                      {active && (
                        <div className="flex items-center gap-1.5 mt-2">
                          <span className="w-2 h-2 rounded-full bg-[#27a0c9] animate-pulse" />
                          <span
                            className="fn-body text-xs font-medium"
                            style={{ color: "#27a0c9" }}>
                            En construcción
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Items */}
                    <ul className="space-y-3">
                      {items.map(({ icon: Icon, text }) => (
                        <li key={text} className="flex items-start gap-2.5">
                          <div
                            className="w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0 mt-0.5"
                            style={{
                              background: active
                                ? "rgba(39,160,201,.1)"
                                : future
                                  ? "rgba(156,163,175,.1)"
                                  : "rgba(107,114,128,.08)",
                            }}>
                            <Icon
                              className="w-3.5 h-3.5"
                              style={{
                                color: active
                                  ? "#27a0c9"
                                  : future
                                    ? "#9ca3af"
                                    : "#6b7280",
                              }}
                            />
                          </div>
                          <span
                            className="fn-body text-sm leading-snug"
                            style={{ color: future ? "#9ca3af" : "#374151" }}>
                            {text}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ),
              )}
            </div>
          </div>
        </section>

        {/* ── CTA FINAL ─────────────────────────────────────────── */}
        <section className="py-28 px-6 md:px-10 bg-white">
          <div
            data-reveal
            className="max-w-6xl mx-auto overflow-hidden rounded-[2rem] border border-[#d7e7ef] bg-[#f7fbfd] shadow-[0_24px_70px_rgba(15,23,42,0.08)]">
            <div className="grid grid-cols-1 lg:grid-cols-[1.08fr_0.92fr] items-stretch">
              <div className="relative min-h-[280px] lg:min-h-[520px]">
                <Image
                  src="/banner.jpg"
                  alt="Estudio contable con planillas, calculadora y reportes financieros"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 55vw"
                />
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(90deg, rgba(8,15,22,0.04) 0%, rgba(8,15,22,0.02) 48%, rgba(247,251,253,0.12) 100%)",
                  }}
                />
              </div>

              <div className="flex items-center">
                <div className="w-full px-8 py-12 text-center lg:px-14 lg:py-16 lg:text-left">
                  <h2 className="fn-display text-4xl md:text-5xl font-black text-gray-900 leading-tight mb-5">
                    Empezá a automatizar
                    <br />
                    <span style={{ color: "#27a0c9" }}>tu estudio hoy.</span>
                  </h2>
                  <p className="fn-body text-gray-500 text-lg mb-10 max-w-xl mx-auto lg:mx-0">
                    Gratis hasta 5 facturas por mes. Sin tarjeta de crédito.
                  </p>
                  <Link
                    href="/auth/sign-up"
                    className="fn-btn-primary inline-flex items-center gap-2 px-8 py-4 rounded-xl text-base font-semibold text-white"
                    style={{ background: "#27a0c9" }}>
                    Crear cuenta gratis
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
