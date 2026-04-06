"use client";
import React, { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  FileSpreadsheet,
  ShieldCheck,
  Users,
  Zap,
  ArrowRight,
  Upload,
  Eye,
  CheckCircle2,
  Clock,
  Award,
} from "lucide-react";
import { useAuth } from "../providers/AuthProvider";

const stats = [
  { value: "50.000+", label: "Facturas generadas" },
  { value: "200+", label: "Estudios contables" },
  { value: "99.9%", label: "Disponibilidad" },
  { value: "3 min", label: "Para emitir 100 facturas" },
];

const features = [
  {
    icon: FileSpreadsheet,
    title: "Facturación Masiva",
    description:
      "Subí tu planilla Excel o CSV y generamos todas las facturas en ARCA automáticamente. Sin reingreso de datos.",
    badge: "WSFEv1",
  },
  {
    icon: ShieldCheck,
    title: "Certificados por cliente",
    description:
      "Tené ordenados los certificados de cada CUIT en un solo lugar y elegí cuál usar al facturar, sin vueltas.",
    badge: "Seguro",
  },
  {
    icon: Users,
    title: "Multi-CUIT",
    description:
      "Administrá todos tus clientes desde un solo panel. Cambiá entre CUITs con un clic.",
    badge: "Para estudios",
  },
  {
    icon: Zap,
    title: "CAE en Tiempo Real",
    description:
      "Obtené el Código de Autorización de Emisión al instante y descargá los comprobantes automáticamente.",
    badge: "Instantáneo",
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
        .badge-pill {
          background: rgba(39,160,201,0.12);
          border: 1px solid rgba(39,160,201,0.30);
          color: #27a0c9;
          border-radius: 9999px;
          padding: 2px 10px;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          flex-shrink: 0;
        }
        .feature-card {
          transition: transform 0.25s ease, box-shadow 0.25s ease;
        }
        .feature-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 24px 48px rgba(39,160,201,0.12);
        }
        .feature-card:hover .f-icon { transform: scale(1.1) rotate(-4deg); }
        .f-icon { transition: transform 0.3s ease; }

        .step-line { background: linear-gradient(90deg, #27a0c9, #10b981); }

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
        {/* ── HERO (load animations) ── */}
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
              Importá tu planilla, revisá, confirmás — y ARCA emite los CAE
              solo. Pensado para estudios contables que no tienen tiempo que
              perder.
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

            <div className="au d6 flex items-center gap-3">
              <div className="flex -space-x-2">
                {["CR", "MG", "PL", "AB"].map((initials, i) => (
                  <div
                    key={i}
                    className="h-9 w-9 rounded-full border-2 border-white/25 flex items-center justify-center text-xs font-bold text-white"
                    style={{
                      background: `hsl(${198 + i * 18}, 55%, ${38 + i * 4}%)`,
                    }}>
                    {initials}
                  </div>
                ))}
              </div>
              <p
                className="text-sm"
                style={{ color: "rgba(255,255,255,0.65)" }}>
                <span className="text-white font-semibold">
                  +200 estudios contables
                </span>{" "}
                ya confían en nosotros
              </p>
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

        {/* ── STATS (scroll reveal) ── */}
        <section className="mesh-dark py-16 px-6">
          <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-10">
            {stats.map((stat, i) => (
              <div
                key={i}
                data-reveal
                data-delay={i + 1}
                className="text-center">
                <div className="font-display text-4xl md:text-5xl font-bold number-grad mb-1">
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
              {features.map((feature, i) => {
                const Icon = feature.icon;
                return (
                  <div
                    key={i}
                    data-reveal
                    data-delay={i + 1}
                    className="feature-card group relative rounded-2xl border bg-white p-8 overflow-hidden"
                    style={{
                      borderColor: "#e5e7eb",
                    }}>
                    <div
                      className="absolute top-0 right-0 w-40 h-40 rounded-bl-[80px] opacity-[0.04]"
                      style={{
                        background: "linear-gradient(135deg, #27a0c9, #10b981)",
                      }}
                    />
                    <div className="flex items-start gap-5">
                      <div
                        className="f-icon flex-shrink-0 h-14 w-14 rounded-xl flex items-center justify-center"
                        style={{
                          background:
                            "linear-gradient(135deg, #eef8fd, #d4f4ea)",
                        }}>
                        <Icon
                          className="h-7 w-7"
                          style={{ color: "#27a0c9" }}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2 flex-wrap">
                          <h3 className="text-xl font-bold text-gray-900">
                            {feature.title}
                          </h3>
                          <span className="badge-pill">{feature.badge}</span>
                        </div>
                        <p
                          className="leading-relaxed"
                          style={{ color: "#6b7280" }}>
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
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
                De la planilla al CAE <br className="hidden md:block" />
                <span style={{ color: "#27a0c9" }}>en 3 pasos</span>
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 relative">
              <div
                className="step-line hidden md:block absolute h-0.5"
                style={{
                  top: "56px",
                  left: "calc(33.33% + 28px)",
                  right: "calc(33.33% + 28px)",
                }}
              />

              {steps.map((step, i) => {
                const Icon = step.icon;
                return (
                  <div
                    key={i}
                    data-reveal
                    data-delay={i + 1}
                    className="flex flex-col items-center text-center">
                    <div className="relative mb-7">
                      <div
                        className="h-28 w-28 rounded-full flex items-center justify-center border-4 border-white shadow-xl"
                        style={{
                          background:
                            "linear-gradient(135deg, #27a0c9, #1e7a9c)",
                        }}>
                        <Icon className="h-10 w-10 text-white" />
                      </div>
                    </div>
                    <h3 className="font-display text-2xl font-bold text-gray-900 mb-3">
                      {i + 1}.&nbsp;
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

        {/* ── TRUST BAR (scroll reveal) ── */}
        <section
          className="py-20 px-6 bg-white border-t"
          style={{ borderColor: "#f1f5f9" }}>
          <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              {
                icon: ShieldCheck,
                iconColor: "#10b981",
                bg: "#f0fdf4",
                title: "Homologado ARCA",
                text: "Integración oficial con los webservices WSFEv1 y WSAA de ARCA.",
              },
              {
                icon: Award,
                iconColor: "#27a0c9",
                bg: "#eff9fd",
                title: "Datos protegidos",
                text: "Certificados encriptados con AES-256. Nunca compartimos tu información.",
              },
              {
                icon: Clock,
                iconColor: "#f59e0b",
                bg: "#fffbeb",
                title: "99.9% uptime",
                text: "Infraestructura robusta para que puedas trabajar cuando lo necesitás.",
              },
            ].map(({ icon: Icon, iconColor, bg, title, text }, i) => (
              <div
                key={i}
                data-reveal
                data-delay={i + 1}
                className="trust-item flex gap-4 items-start">
                <div
                  className="trust-icon-wrap flex-shrink-0 h-12 w-12 rounded-xl flex items-center justify-center"
                  style={{ background: bg }}>
                  <Icon className="h-6 w-6" style={{ color: iconColor }} />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-1">{title}</h4>
                  <p
                    className="text-sm leading-relaxed"
                    style={{ color: "#6b7280" }}>
                    {text}
                  </p>
                </div>
              </div>
            ))}
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
              {user ? (
                <Link href="/dashboard">
                  <button
                    className="cta-btn cta-glow mx-auto px-10 py-5 text-white font-bold text-lg rounded-xl flex items-center gap-3"
                    style={{ background: "#27a0c9" }}>
                    Ir al dashboard <ArrowRight className="h-6 w-6" />
                  </button>
                </Link>
              ) : (
                <>
                  <Link href="/auth/sign-up">
                    <button
                      className="cta-btn cta-glow mx-auto px-10 py-5 text-white font-bold text-lg rounded-xl flex items-center gap-3"
                      style={{ background: "#27a0c9" }}>
                      Crear cuenta gratuita <ArrowRight className="h-6 w-6" />
                    </button>
                  </Link>
                  <p className="mt-6 text-sm" style={{ color: "#4a6b80" }}>
                    ¿Ya tenés cuenta?{" "}
                    <Link
                      href="/auth/sign-in"
                      className="cursor-pointer font-medium hover:underline"
                      style={{ color: "#27a0c9" }}>
                      Iniciá sesión aquí
                    </Link>
                  </p>
                </>
              )}
            </div>
          </div>
        </section>

        {/* ── FOOTER ── */}
        <footer
          className="py-10 px-6 text-center"
          style={{ background: "#05090e" }}>
          <div className="flex items-center justify-center gap-3 mb-3">
            <Image
              src="/favicon.svg"
              alt="Connta"
              width={26}
              height={26}
            />
            <span className="font-semibold text-white tracking-tight">
              Connta
            </span>
          </div>
          <p className="text-sm" style={{ color: "#3d5566" }}>
            © {new Date().getFullYear()} Connta. Todos los derechos
            reservados.
          </p>
        </footer>
      </div>
    </>
  );
}
