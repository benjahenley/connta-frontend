"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Mail, MessageCircle, Instagram, ArrowRight, Send, CheckCircle2, AlertCircle } from "lucide-react";

const channels = [
  {
    icon: Mail,
    iconColor: "#27a0c9",
    shadowColor: "rgba(39,160,201,0.18)",
    bg: "#eff9fd",
    title: "Email",
    description: "Respondemos en menos de 24 horas hábiles.",
    value: "contacto@connta.ar",
    href: "mailto:contacto@connta.ar",
    cta: "Enviar email",
  },
  {
    icon: MessageCircle,
    iconColor: "#10b981",
    shadowColor: "rgba(16,185,129,0.18)",
    bg: "#f0fdf4",
    title: "WhatsApp",
    description: "Atención directa con el equipo de soporte.",
    value: "+54 9 15 2739-8316",
    href: "https://wa.me/5491527398316",
    cta: "Abrir chat",
  },
  {
    icon: Instagram,
    iconColor: "#9333ea",
    shadowColor: "rgba(147,51,234,0.18)",
    bg: "#faf5ff",
    title: "Instagram",
    description: "Seguinos para novedades y tips de facturación.",
    value: "@connta_ar",
    href: "https://www.instagram.com/connta_ar",
    cta: "Ver perfil",
  },
];

export default function ContactoPage() {
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

  const [formName, setFormName] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formMessage, setFormMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus("idle");

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: formName, email: formEmail, message: formMessage }),
      });

      if (!res.ok) {
        throw new Error("Request failed");
      }

      setSubmitStatus("success");
      setFormName("");
      setFormEmail("");
      setFormMessage("");
    } catch {
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,600;0,9..144,700;0,9..144,900;1,9..144,400&family=DM+Sans:wght@400;500;600&display=swap');
        .ct-display { font-family: 'Fraunces', serif; }
        .ct-body    { font-family: 'DM Sans', sans-serif; }

        @keyframes ctFadeUp {
          from { opacity: 0; transform: translateY(28px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .ct-au  { animation: ctFadeUp 0.75s ease both; }
        .ct-d1  { animation-delay: 0.10s; }
        .ct-d2  { animation-delay: 0.22s; }
        .ct-d3  { animation-delay: 0.36s; }
        .ct-d4  { animation-delay: 0.50s; }

        [data-reveal] {
          opacity: 0;
          transform: translateY(28px);
          transition: opacity 0.65s ease, transform 0.65s ease;
        }
        [data-reveal].revealed { opacity: 1; transform: translateY(0); }
        [data-reveal][data-delay="1"] { transition-delay: 0.08s; }
        [data-reveal][data-delay="2"] { transition-delay: 0.18s; }
        [data-reveal][data-delay="3"] { transition-delay: 0.28s; }

        .ct-hero-overlay {
          background: linear-gradient(
            160deg,
            rgba(4,20,35,0.85) 0%,
            rgba(10,35,55,0.90) 60%,
            rgba(16,50,70,0.78) 100%
          );
        }
        .ct-grid-lines {
          background-image:
            linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px);
          background-size: 64px 64px;
        }
        .ct-mesh-dark {
          background-color: #080f16;
          background-image:
            radial-gradient(ellipse at 15% 60%, rgba(39,160,201,0.18) 0%, transparent 55%),
            radial-gradient(ellipse at 85% 20%, rgba(16,185,129,0.10) 0%, transparent 50%);
        }

        .ct-channel-card {
          transition: transform 0.25s ease, box-shadow 0.25s ease;
        }
        .ct-channel-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 24px 48px var(--channel-shadow);
        }
        .ct-channel-card:hover .ct-icon { transform: scale(1.1) rotate(-4deg); }
        .ct-icon { transition: transform 0.3s ease; }

        .ct-cta-btn { transition: all 0.2s ease; }
        .ct-cta-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 32px rgba(39,160,201,0.4);
        }
        .ct-number-grad {
          background: linear-gradient(135deg, #27a0c9 0%, #10b981 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .ct-form-input {
          width: 100%;
          padding: 10px 14px;
          border: 1px solid #e5e7eb;
          border-radius: 10px;
          font-size: 14px;
          font-family: 'DM Sans', sans-serif;
          color: #111827;
          background: #f9fafb;
          transition: border-color 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;
          outline: none;
        }
        .ct-form-input:focus {
          border-color: #27a0c9;
          box-shadow: 0 0 0 3px rgba(39,160,201,0.12);
          background: #ffffff;
        }
        .ct-form-input::placeholder { color: #9ca3af; }

        .ct-submit-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 11px 24px;
          border-radius: 10px;
          font-size: 14px;
          font-weight: 600;
          font-family: 'DM Sans', sans-serif;
          color: #ffffff;
          background: #27a0c9;
          border: none;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .ct-submit-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(39,160,201,0.35);
        }
        .ct-submit-btn:disabled {
          opacity: 0.65;
          cursor: not-allowed;
        }
      `}</style>

      <div className="ct-body min-h-screen bg-white text-gray-900 overflow-x-hidden">

        {/* ── HERO ── */}
        <section
          className="relative flex min-h-[52vh] flex-col items-center justify-center px-6 py-24 text-center overflow-hidden"
          style={{
            backgroundImage: "url('/banner-home.webp')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}>
          <div className="ct-hero-overlay absolute inset-0" />
          <div className="ct-grid-lines absolute inset-0" />

          <div className="relative z-10 flex flex-col items-center max-w-3xl mx-auto">
            <Image
              src="/favicon.svg"
              alt="Connta"
              className="ct-au ct-d1 mb-8 drop-shadow-2xl"
              width={64}
              height={64}
            />
            <p className="ct-au ct-d2 text-xs font-bold uppercase tracking-[0.18em] mb-4" style={{ color: "#7dd3fc" }}>
              Contacto
            </p>
            <h1 className="ct-display ct-au ct-d3 text-4xl md:text-6xl font-bold leading-tight text-white mb-5">
              Estamos para{" "}
              <em className="not-italic" style={{ color: "#7dd3fc" }}>ayudarte</em>
            </h1>
            <p className="ct-au ct-d4 max-w-xl text-lg leading-relaxed" style={{ color: "rgba(255,255,255,0.65)" }}>
              Escribinos por email o WhatsApp. Nuestro equipo responde rápido para que no pierdas tiempo.
            </p>
          </div>
        </section>

        {/* ── CHANNELS + FORM ── */}
        <section className="py-24 px-6 bg-white">
          <div className="max-w-5xl mx-auto space-y-6">

            {/* Channel cards — 2 columns */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {channels.map(({ icon: Icon, iconColor, shadowColor, bg, title, description, value, href, cta }, i) => (
                <div
                  key={i}
                  data-reveal
                  data-delay={String(i + 1)}
                  className="ct-channel-card group relative rounded-2xl border bg-white p-8 overflow-hidden"
                  style={{
                    borderColor: "#e5e7eb",
                    ["--channel-shadow" as string]: shadowColor,
                  }}>
                  <div
                    className="absolute top-0 right-0 w-32 h-32 rounded-bl-[64px] opacity-[0.05]"
                    style={{ background: `linear-gradient(135deg, ${iconColor}, #10b981)` }}
                  />

                  <div
                    className="ct-icon mb-5 h-14 w-14 rounded-xl flex items-center justify-center"
                    style={{ background: bg }}>
                    <Icon className="h-7 w-7" style={{ color: iconColor }} />
                  </div>

                  <h3 className="ct-display text-xl font-bold text-gray-900 mb-1">{title}</h3>
                  <p className="text-sm leading-relaxed mb-4" style={{ color: "#6b7280" }}>
                    {description}
                  </p>
                  <p className="text-sm font-semibold mb-5" style={{ color: iconColor }}>
                    {value}
                  </p>

                  <Link
                    href={href}
                    target={href.startsWith("http") ? "_blank" : undefined}
                    rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
                    className="ct-cta-btn inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white"
                    style={{ background: iconColor }}>
                    {cta} <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              ))}
            </div>

            {/* Contact form card — full width */}
            <div
              data-reveal
              data-delay="3"
              className="relative rounded-2xl border bg-white p-8 overflow-hidden"
              style={{ borderColor: "#e5e7eb" }}>
              <div
                className="absolute top-0 right-0 w-48 h-48 rounded-bl-[96px] opacity-[0.04]"
                style={{ background: "linear-gradient(135deg, #27a0c9, #10b981)" }}
              />

              <div className="relative">
                <div className="mb-6 h-14 w-14 rounded-xl flex items-center justify-center" style={{ background: "#eff9fd" }}>
                  <Send className="h-7 w-7" style={{ color: "#27a0c9" }} />
                </div>

                <h3 className="ct-display text-xl font-bold text-gray-900 mb-1">Envianos un mensaje</h3>
                <p className="text-sm leading-relaxed mb-6" style={{ color: "#6b7280" }}>
                  Completá el formulario y te respondemos a la brevedad.
                </p>

                {submitStatus === "success" ? (
                  <div className="flex items-start gap-3 p-4 rounded-xl border" style={{ background: "#f0fdf4", borderColor: "#bbf7d0" }}>
                    <CheckCircle2 className="h-5 w-5 mt-0.5 shrink-0" style={{ color: "#10b981" }} />
                    <p className="text-sm font-medium" style={{ color: "#065f46" }}>
                      ¡Mensaje enviado! Te respondemos pronto.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} noValidate>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                          Nombre
                        </label>
                        <input
                          type="text"
                          className="ct-form-input"
                          placeholder="Tu nombre"
                          value={formName}
                          onChange={(e) => setFormName(e.target.value)}
                          required
                          disabled={isSubmitting}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                          Email
                        </label>
                        <input
                          type="email"
                          className="ct-form-input"
                          placeholder="tu@email.com"
                          value={formEmail}
                          onChange={(e) => setFormEmail(e.target.value)}
                          required
                          disabled={isSubmitting}
                        />
                      </div>
                    </div>

                    <div className="mb-5">
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                        Mensaje
                      </label>
                      <textarea
                        className="ct-form-input"
                        placeholder="¿En qué te podemos ayudar?"
                        rows={4}
                        value={formMessage}
                        onChange={(e) => setFormMessage(e.target.value)}
                        required
                        disabled={isSubmitting}
                        style={{ resize: "vertical", minHeight: "96px" }}
                      />
                    </div>

                    {submitStatus === "error" && (
                      <div className="flex items-start gap-3 p-3 rounded-xl border mb-4" style={{ background: "#fef2f2", borderColor: "#fecaca" }}>
                        <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" style={{ color: "#ef4444" }} />
                        <p className="text-sm" style={{ color: "#991b1b" }}>
                          Hubo un error al enviar. Intentá de nuevo.
                        </p>
                      </div>
                    )}

                    <button type="submit" className="ct-submit-btn" disabled={isSubmitting}>
                      {isSubmitting ? (
                        <>
                          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                          </svg>
                          Enviando...
                        </>
                      ) : (
                        <>
                          Enviar mensaje <Send className="h-4 w-4" />
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>
            </div>

          </div>
        </section>

        {/* ── FAQ MINI ── */}
        <section className="py-20 px-6" style={{ background: "#f8fafc" }}>
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <p data-reveal className="text-xs font-bold uppercase tracking-[0.18em] mb-3" style={{ color: "#27a0c9" }}>
                Preguntas frecuentes
              </p>
              <h2 data-reveal data-delay="1" className="ct-display text-3xl md:text-4xl font-bold text-gray-900">
                Respuestas rápidas
              </h2>
            </div>

            <div className="space-y-4">
              {[
                {
                  q: "¿Cuánto tarda el soporte en responder?",
                  a: "Por email respondemos en menos de 24 horas hábiles. Por WhatsApp la respuesta es generalmente el mismo día.",
                },
                {
                  q: "¿Puedo pedir una demo del sistema?",
                  a: "Sí, escribinos por WhatsApp o email y coordinamos una llamada para mostrarte el flujo completo de facturación.",
                },
                {
                  q: "¿Tienen soporte para configurar los certificados ARCA?",
                  a: "Contamos con guías paso a paso en la plataforma y nuestro equipo puede asistirte en el proceso de alta.",
                },
              ].map(({ q, a }, i) => (
                <div
                  key={i}
                  data-reveal
                  data-delay={String(i + 1)}
                  className="bg-white rounded-2xl border p-6"
                  style={{ borderColor: "#e5e7eb" }}>
                  <h4 className="font-semibold text-gray-900 mb-2">{q}</h4>
                  <p className="text-sm leading-relaxed" style={{ color: "#6b7280" }}>{a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA FOOTER ── */}
        <section className="ct-mesh-dark py-24 px-6 text-center relative overflow-hidden">
          <div
            className="absolute inset-0 opacity-20 pointer-events-none"
            style={{
              backgroundImage: "radial-gradient(ellipse at 50% 80%, rgba(39,160,201,0.5) 0%, transparent 60%)",
            }}
          />
          <div className="relative z-10 max-w-2xl mx-auto">
            <p data-reveal className="text-xs font-bold uppercase tracking-[0.18em] mb-5" style={{ color: "#27a0c9" }}>
              ¿Listo para empezar?
            </p>
            <h2 data-reveal data-delay="1" className="ct-display text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
              Automatizá tu facturación{" "}
              <em className="not-italic" style={{ color: "#7dd3fc" }}>hoy mismo.</em>
            </h2>
            <div data-reveal data-delay="2" className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/auth/sign-up">
                <button className="ct-cta-btn px-8 py-4 rounded-xl text-white font-semibold text-base flex items-center gap-2 shadow-lg" style={{ background: "#27a0c9" }}>
                  Crear cuenta gratuita <ArrowRight className="h-5 w-5" />
                </button>
              </Link>
              <a href="https://wa.me/5491527398316" target="_blank" rel="noopener noreferrer">
                <button className="px-8 py-4 rounded-xl text-white font-semibold text-base border border-white/20 hover:bg-white/10 transition-all duration-200" style={{ background: "rgba(255,255,255,0.08)", backdropFilter: "blur(8px)" }}>
                  Hablar por WhatsApp
                </button>
              </a>
            </div>
          </div>
        </section>

        {/* ── FOOTER ── */}
        <footer className="py-10 px-6 text-center" style={{ background: "#05090e" }}>
          <div className="flex items-center justify-center gap-3 mb-3">
            <Image src="/favicon.svg" alt="Connta" width={26} height={26} />
            <span className="font-semibold text-white tracking-tight">Connta</span>
          </div>
          <p className="text-sm" style={{ color: "#3d5566" }}>
            © {new Date().getFullYear()} Connta. Todos los derechos reservados.
          </p>
        </footer>
      </div>
    </>
  );
}
