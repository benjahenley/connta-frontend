"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Check, X, ArrowRight, Shield, FileText, Headphones } from "lucide-react";
import { PLANS } from "@/data/plans";
import { SubscriptionTier } from "@/types/auth";
import { useAuth } from "@/components/providers/AuthProvider";

const TIER_ORDER = [
  SubscriptionTier.FREE,
  SubscriptionTier.STARTER,
  SubscriptionTier.PROFESSIONAL,
  SubscriptionTier.BUSINESS,
];

const plans = PLANS;

const faqs = [
  {
    q: "¿Puedo cambiar de plan en cualquier momento?",
    a: "Sí. Podés actualizar o bajar de plan cuando lo necesites. El cambio se aplica al siguiente ciclo de facturación.",
  },
  {
    q: "¿Qué pasa si supero el límite de facturas?",
    a: "El sistema te avisará cuando estés por alcanzar el límite. Las facturas adicionales quedarán pendientes hasta que actualices tu plan.",
  },
  {
    q: "¿Los precios incluyen IVA?",
    a: "No. Los precios mostrados son sin IVA. Se agrega el 21% de IVA al momento de facturar según la normativa argentina.",
  },
  {
    q: "¿Necesito certificados ARCA propios?",
    a: "Sí. Cada CUIT requiere su propio certificado digital emitido por ARCA. La plataforma te guía paso a paso en el proceso.",
  },
];

export default function PricingPage() {
  const { user } = useAuth();
  const router = useRouter();
  const isAuthenticated = !!user;
  const currentTier = user?.subscriptionTier ?? SubscriptionTier.FREE;
  const currentIdx = TIER_ORDER.indexOf(currentTier);

  return (
    <>
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0);    }
        }
        .fade-up { animation: fadeUp 0.55s cubic-bezier(0.22,1,0.36,1) both; }

        .hero-grid {
          background-image:
            linear-gradient(rgba(39,160,201,0.07) 1px, transparent 1px),
            linear-gradient(90deg, rgba(39,160,201,0.07) 1px, transparent 1px);
          background-size: 40px 40px;
        }

        .glow-blue {
          position: absolute;
          width: 480px; height: 480px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(39,160,201,0.18) 0%, transparent 70%);
          pointer-events: none;
        }

        .plan-card {
          transition: transform 0.25s cubic-bezier(0.22,1,0.36,1),
                      box-shadow 0.25s cubic-bezier(0.22,1,0.36,1);
        }
        .plan-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 20px 40px -12px rgba(0,0,0,0.12);
        }
        .plan-card.recommended:hover {
          box-shadow: 0 24px 48px -12px rgba(39,160,201,0.30);
        }
        .plan-card.dark-card:hover {
          box-shadow: 0 24px 48px -12px rgba(15,23,42,0.40);
        }
      `}</style>

      <div className="min-h-screen bg-white">
        {/* ── Hero ───────────────────────────────────────────────── */}
        <section
          className="relative overflow-hidden py-28 px-6 text-center hero-grid"
          style={{ background: "#0f172a" }}>
          {/* glow orbs */}
          <div className="glow-blue" style={{ top: "-120px", left: "10%" }} />
          <div
            className="glow-blue"
            style={{ bottom: "-160px", right: "8%" }}
          />

          <div className="relative z-10 max-w-3xl mx-auto">
            <span
              className="fade-up inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase mb-6 border"
              style={{
                animationDelay: "0ms",
                background: "rgba(39,160,201,0.12)",
                borderColor: "rgba(39,160,201,0.35)",
                color: "#7dd3fc",
              }}>
              <Shield className="w-3.5 h-3.5" />
              Integración certificada ARCA
            </span>

            <h1
              className="fade-up text-5xl md:text-6xl font-extrabold leading-tight text-white mb-5"
              style={{ animationDelay: "80ms", letterSpacing: "-0.025em" }}>
              Planes simples.
              <br />
              <span style={{ color: "#27a0c9" }}>Facturación sin límites.</span>
            </h1>

            <p
              className="fade-up text-lg text-slate-400 max-w-xl mx-auto mb-10"
              style={{ animationDelay: "160ms" }}>
              Elegí el plan que mejor se adapta al tamaño de tu estudio
              contable. Todos los planes incluyen conexión directa con WSFEv1 de
              ARCA.
            </p>

            <div
              className="fade-up flex flex-wrap justify-center gap-6 text-sm text-slate-400"
              style={{ animationDelay: "240ms" }}>
              {[
                { Icon: FileText, text: "CAE en segundos" },
                { Icon: Shield, text: "Certificado digital" },
                { Icon: Headphones, text: "Soporte en español" },
              ].map(({ Icon, text }) => (
                <span key={text} className="flex items-center gap-1.5">
                  <Icon className="w-4 h-4" style={{ color: "#27a0c9" }} />
                  {text}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* ── Pricing Cards ──────────────────────────────────────── */}
        <section className="py-20 px-6" style={{ background: "#f8fafc" }}>
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5 items-stretch">
            {plans.map((plan, i) => {
              const { Icon } = plan;
              const planIdx = plan.id ? TIER_ORDER.indexOf(plan.id) : TIER_ORDER.length;
              const isCurrent = isAuthenticated && !!plan.id && plan.id === currentTier;
              const isDowngrade = isAuthenticated && !plan.contactSales && planIdx < currentIdx;

              return (
                <div
                  key={plan.id ?? plan.name}
                  className={`fade-up plan-card relative flex flex-col rounded-2xl ${
                    plan.recommended || isCurrent
                      ? "recommended border-2 bg-white"
                      : plan.dark
                        ? "dark-card border"
                        : "border bg-white"
                  }`}
                  style={{
                    animationDelay: `${i * 90}ms`,
                    borderColor: isCurrent || plan.recommended
                      ? "#27a0c9"
                      : plan.dark
                        ? "#1e293b"
                        : "#e2e8f0",
                    background: plan.dark ? "#0f172a" : undefined,
                    boxShadow: isCurrent || plan.recommended
                      ? "0 12px 32px -8px rgba(39,160,201,0.20)"
                      : "0 1px 3px rgba(0,0,0,0.06)",
                    opacity: isDowngrade ? 0.4 : 1,
                  }}>
                  {/* Top badge */}
                  {isCurrent ? (
                    <div
                      className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-bold tracking-wide text-white whitespace-nowrap"
                      style={{ background: "#27a0c9" }}>
                      Plan actual
                    </div>
                  ) : plan.recommended && (
                    <div
                      className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-bold tracking-wide text-white whitespace-nowrap"
                      style={{ background: "#27a0c9" }}>
                      Recomendado
                    </div>
                  )}

                  <div className="p-7 flex flex-col flex-1">
                    {/* Plan header */}
                    <div className="flex items-center gap-3 mb-6">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{
                          background: plan.dark
                            ? "rgba(39,160,201,0.15)"
                            : plan.recommended
                              ? "rgba(39,160,201,0.10)"
                              : "rgba(0,0,0,0.04)",
                        }}>
                        <Icon
                          className="w-5 h-5"
                          style={{
                            color:
                              plan.dark || plan.recommended
                                ? "#27a0c9"
                                : "#475569",
                          }}
                        />
                      </div>
                      <span
                        className="text-base font-bold"
                        style={{ color: plan.dark ? "#f8fafc" : "#0f172a" }}>
                        {plan.name}
                      </span>
                    </div>

                    {/* Price */}
                    <div className="mb-6">
                      <div
                        className="text-4xl font-extrabold tracking-tight"
                        style={{
                          color: plan.dark ? "#ffffff" : "#0f172a",
                          fontVariantNumeric: "tabular-nums",
                        }}>
                        {plan.priceDisplay}
                      </div>
                      <div
                        className="text-sm mt-1"
                        style={{ color: plan.dark ? "#94a3b8" : "#64748b" }}>
                        {plan.priceSubtext}
                      </div>
                    </div>

                    {/* Invoice count highlight */}
                    <div
                      className="flex items-baseline gap-1.5 px-4 py-3 rounded-xl mb-6"
                      style={{
                        background: plan.dark
                          ? "rgba(39,160,201,0.10)"
                          : plan.recommended
                            ? "rgba(39,160,201,0.07)"
                            : "rgba(0,0,0,0.03)",
                      }}>
                      <span
                        className="text-lg font-bold"
                        style={{
                          color:
                            plan.dark || plan.recommended
                              ? "#27a0c9"
                              : "#334155",
                        }}>
                        {plan.invoicesDisplay}
                      </span>
                      <span
                        className="text-sm"
                        style={{ color: plan.dark ? "#64748b" : "#94a3b8" }}>
                        {plan.invoicesSubtext}
                      </span>
                    </div>

                    {/* Features */}
                    <ul className="space-y-3 flex-1 mb-8">
                      {plan.features.map((f) => (
                        <li
                          key={f.label}
                          className="flex items-start gap-2.5 text-sm">
                          {f.ok ? (
                            <Check
                              className="w-4 h-4 mt-0.5 flex-shrink-0"
                              style={{ color: "#10b981" }}
                            />
                          ) : (
                            <X
                              className="w-4 h-4 mt-0.5 flex-shrink-0"
                              style={{
                                color: plan.dark ? "#334155" : "#d1d5db",
                              }}
                            />
                          )}
                          <span
                            style={{
                              color: f.ok
                                ? plan.dark
                                  ? "#cbd5e1"
                                  : "#334155"
                                : plan.dark
                                  ? "#475569"
                                  : "#9ca3af",
                            }}>
                            {f.label}
                          </span>
                        </li>
                      ))}
                    </ul>

                    {/* CTA */}
                    {plan.contactSales ? (
                      <a
                        href={plan.href}
                        className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-sm font-semibold transition-all duration-200"
                        style={{ background: "rgba(39,160,201,0.15)", color: "#7dd3fc", border: "1px solid rgba(39,160,201,0.25)" }}>
                        {plan.cta}
                        <ArrowRight className="w-4 h-4" />
                      </a>
                    ) : isAuthenticated ? (
                      isCurrent ? (
                        <div
                          className="w-full py-3 rounded-xl text-sm font-semibold text-center"
                          style={{ background: "rgba(39,160,201,0.08)", color: "#27a0c9" }}>
                          Plan actual
                        </div>
                      ) : isDowngrade ? (
                        <div
                          className="w-full py-3 rounded-xl text-sm font-semibold text-center"
                          style={{ background: "#f1f5f9", color: "#94a3b8" }}>
                          No disponible
                        </div>
                      ) : plan.price === 0 ? (
                        <div
                          className="w-full py-3 rounded-xl text-sm font-semibold text-center"
                          style={{ background: "#f1f5f9", color: "#94a3b8" }}>
                          Ya incluido
                        </div>
                      ) : (
                        <button
                          onClick={() => router.push(`/checkout?plan=${plan.id}`)}
                          className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-sm font-semibold transition-all duration-200"
                          style={
                            plan.recommended
                              ? { background: "#27a0c9", color: "#ffffff", boxShadow: "0 4px 14px rgba(39,160,201,0.35)" }
                              : plan.dark
                                ? { background: "rgba(39,160,201,0.15)", color: "#7dd3fc", border: "1px solid rgba(39,160,201,0.25)" }
                                : { background: "transparent", color: "#27a0c9", border: "1px solid #27a0c9" }
                          }>
                          {plan.cta}
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      )
                    ) : (
                      <Link
                        href={plan.href}
                        className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-sm font-semibold transition-all duration-200"
                        style={
                          plan.recommended
                            ? { background: "#27a0c9", color: "#ffffff", boxShadow: "0 4px 14px rgba(39,160,201,0.35)" }
                            : plan.dark
                              ? { background: "rgba(39,160,201,0.15)", color: "#7dd3fc", border: "1px solid rgba(39,160,201,0.25)" }
                              : { background: "transparent", color: "#27a0c9", border: "1px solid #27a0c9" }
                        }
                        onMouseEnter={(e) => {
                          if (plan.recommended) {
                            (e.currentTarget as HTMLElement).style.background = "#1e7a9c";
                          } else if (plan.dark) {
                            (e.currentTarget as HTMLElement).style.background = "rgba(39,160,201,0.25)";
                          } else {
                            (e.currentTarget as HTMLElement).style.background = "#27a0c9";
                            (e.currentTarget as HTMLElement).style.color = "#ffffff";
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (plan.recommended) {
                            (e.currentTarget as HTMLElement).style.background = "#27a0c9";
                          } else if (plan.dark) {
                            (e.currentTarget as HTMLElement).style.background = "rgba(39,160,201,0.15)";
                            (e.currentTarget as HTMLElement).style.color = "#7dd3fc";
                          } else {
                            (e.currentTarget as HTMLElement).style.background = "transparent";
                            (e.currentTarget as HTMLElement).style.color = "#27a0c9";
                          }
                        }}>
                        {plan.cta}
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* PROD badge note */}
          <p className="text-center text-sm text-slate-400 mt-8">
            Los planes pagos incluyen acceso al ambiente de{" "}
            <span
              className="font-semibold px-1.5 py-0.5 rounded text-xs"
              style={{ background: "rgba(16,185,129,0.1)", color: "#10b981" }}>
              PRODUCCIÓN
            </span>{" "}
            de ARCA. El plan Free solo accede al ambiente de{" "}
            <span
              className="font-semibold px-1.5 py-0.5 rounded text-xs"
              style={{ background: "rgba(245,158,11,0.1)", color: "#f59e0b" }}>
              TEST
            </span>
            .
          </p>
        </section>

        {/* ── Feature Comparison Table ────────────────────────────── */}
        <section className="py-20 px-6 bg-white">
          <div className="max-w-5xl mx-auto">
            <h2
              className="text-3xl font-bold text-center mb-2"
              style={{ color: "#0f172a", letterSpacing: "-0.02em" }}>
              Compará todos los planes
            </h2>
            <p className="text-center text-slate-500 mb-12">
              Todo lo que incluye cada plan, sin letra chica.
            </p>

            <div className="overflow-x-auto rounded-2xl border border-gray-100 shadow-sm">
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ background: "#f8fafc" }}>
                    <th className="text-left px-6 py-4 font-semibold text-slate-500 w-1/4">
                      Funcionalidad
                    </th>
                    {plans.map((p) => (
                      <th
                        key={p.name}
                        className="px-4 py-4 font-bold text-center"
                        style={{
                          color: p.recommended ? "#27a0c9" : "#0f172a",
                        }}>
                        {p.name}
                        {p.recommended && (
                          <span
                            className="block text-xs font-normal mt-0.5"
                            style={{ color: "#27a0c9" }}>
                            ★ Recomendado
                          </span>
                        )}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {[
                    {
                      label: "Facturas por mes",
                      values: ["5", "50", "200", "1.000", "A medida"],
                    },
                    {
                      label: "Precio mensual",
                      values: [
                        "Gratis",
                        "$ 15.000 + IVA",
                        "$ 35.000 + IVA",
                        "$ 75.000 + IVA",
                        "Personalizado",
                      ],
                    },
                    {
                      label: "Ambiente TEST (Homologacion)",
                      values: [true, true, true, true, true],
                    },
                    {
                      label: "Acceso a Produccion ARCA",
                      values: [false, true, true, true, true],
                    },
                    {
                      label: "Almacenamiento de CAE",
                      values: [true, true, true, true, true],
                    },
                    {
                      label: "Historial de comprobantes",
                      values: [true, true, true, true, true],
                    },
                    {
                      label: "Soporte por email",
                      values: [true, true, true, true, true],
                    },
                    {
                      label: "Soporte prioritario",
                      values: [false, false, true, true, true],
                    },
                    {
                      label: "Multi-CUIT",
                      values: [false, false, false, true, true],
                    },
                  ].map((row, ri) => (
                    <tr
                      key={row.label}
                      className="hover:bg-slate-50 transition-colors duration-100"
                      style={{
                        background:
                          ri % 2 === 0 ? "white" : "rgba(248,250,252,0.5)",
                      }}>
                      <td className="px-6 py-4 font-medium text-slate-700">
                        {row.label}
                      </td>
                      {row.values.map((v, vi) => (
                        <td key={vi} className="px-4 py-4 text-center">
                          {typeof v === "boolean" ? (
                            v ? (
                              <Check
                                className="w-5 h-5 mx-auto"
                                style={{ color: "#10b981" }}
                              />
                            ) : (
                              <X
                                className="w-5 h-5 mx-auto"
                                style={{ color: "#d1d5db" }}
                              />
                            )
                          ) : (
                            <span
                              className="font-semibold"
                              style={{
                                color: plans[vi].recommended
                                  ? "#27a0c9"
                                  : "#334155",
                              }}>
                              {v}
                            </span>
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* ── FAQ ─────────────────────────────────────────────────── */}
        <section className="py-20 px-6" style={{ background: "#f8fafc" }}>
          <div className="max-w-3xl mx-auto">
            <h2
              className="text-3xl font-bold text-center mb-2"
              style={{ color: "#0f172a", letterSpacing: "-0.02em" }}>
              Preguntas frecuentes
            </h2>
            <p className="text-center text-slate-500 mb-12">
              Todo lo que necesitás saber antes de empezar.
            </p>

            <div className="space-y-4">
              {faqs.map((faq, i) => (
                <div
                  key={i}
                  className="bg-white rounded-xl border border-gray-100 px-7 py-6 shadow-sm">
                  <h3
                    className="font-semibold mb-2"
                    style={{ color: "#0f172a" }}>
                    {faq.q}
                  </h3>
                  <p className="text-sm text-slate-500 leading-relaxed">
                    {faq.a}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Bottom CTA ──────────────────────────────────────────── */}
        <section
          className="relative overflow-hidden py-24 px-6 text-center hero-grid"
          style={{ background: "#0f172a" }}>
          <div
            className="glow-blue"
            style={{ top: "-80px", left: "50%", transform: "translateX(-50%)" }}
          />
          <div className="relative z-10 max-w-2xl mx-auto">
            <h2
              className="text-4xl font-extrabold text-white mb-4"
              style={{ letterSpacing: "-0.025em" }}>
              ¿Listo para automatizar tu facturación?
            </h2>
            <p className="text-slate-400 mb-8 text-lg">
              Comenzá con el plan Free sin tarjeta de crédito. Actualizá cuando
              lo necesites.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/auth/sign-up"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl text-sm font-bold text-white transition-all duration-200 hover:-translate-y-0.5"
                style={{
                  background: "#27a0c9",
                  boxShadow: "0 8px 24px rgba(39,160,201,0.35)",
                }}>
                Crear cuenta gratis
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/auth/sign-in"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl text-sm font-semibold transition-all duration-200 hover:-translate-y-0.5"
                style={{
                  background: "rgba(255,255,255,0.07)",
                  color: "#cbd5e1",
                  border: "1px solid rgba(255,255,255,0.12)",
                }}>
                Ya tengo cuenta
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
