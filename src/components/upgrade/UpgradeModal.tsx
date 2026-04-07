"use client";

import { useEffect, useRef } from "react";
import { X, Check, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { SubscriptionTier } from "@/types/auth";
import { useAuth } from "@/components/providers/AuthProvider";
import { PLANS, type Plan } from "@/data/plans";

/* ── Props ───────────────────────────────────────────────────────────────── */

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  /** Pre-select a tier to highlight (optional) */
  initialTier?: SubscriptionTier;
}

/* ── Component ───────────────────────────────────────────────────────────── */

export default function UpgradeModal({
  isOpen,
  onClose,
  initialTier,
}: UpgradeModalProps) {
  const { user } = useAuth();
  const router = useRouter();
  const overlayRef = useRef<HTMLDivElement>(null);

  const currentTier = user?.subscriptionTier ?? SubscriptionTier.FREE;

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [isOpen, onClose]);

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSelectPlan = (plan: Plan) => {
    if (plan.contactSales) {
      onClose();
      window.location.href = plan.href;
      return;
    }
    onClose();
    router.push(`/checkout?plan=${plan.id}`);
  };

  return (
    <>
      <style>{`
        @keyframes modalIn {
          from { opacity: 0; transform: scale(0.97) translateY(8px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes overlayIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        .modal-overlay { animation: overlayIn 0.2s ease both; }
        .modal-box     { animation: modalIn 0.25s cubic-bezier(0.22,1,0.36,1) both; }

        .plan-pill {
          transition: transform 0.2s cubic-bezier(0.22,1,0.36,1),
                      box-shadow 0.2s cubic-bezier(0.22,1,0.36,1),
                      border-color 0.15s;
        }
        .plan-pill.selectable:hover {
          transform: translateY(-3px);
          box-shadow: 0 12px 28px -8px rgba(0,0,0,0.12);
        }
        .plan-pill.selectable.rec:hover {
          box-shadow: 0 16px 32px -8px rgba(39,160,201,0.28);
        }
        .plan-pill.selectable.dark-p:hover {
          box-shadow: 0 16px 32px -8px rgba(15,23,42,0.35);
        }
      `}</style>

      {/* Backdrop */}
      <div
        ref={overlayRef}
        className="modal-overlay fixed inset-0 z-50 flex items-center justify-center p-4"
        style={{
          background: "rgba(15,23,42,0.65)",
          backdropFilter: "blur(4px)",
        }}
        onClick={(e) => {
          if (e.target === overlayRef.current) onClose();
        }}>
        {/* Modal box */}
        <div
          className="modal-box relative flex max-h-[90vh] w-full max-w-[1320px] flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
        >
          <PlansStep
            currentTier={currentTier}
            highlightTier={initialTier}
            onSelect={handleSelectPlan}
            onClose={onClose}
          />
        </div>
      </div>
    </>
  );
}

/* ── Plans step ──────────────────────────────────────────────────────────── */

const TIER_ORDER = [
  SubscriptionTier.FREE,
  SubscriptionTier.STARTER,
  SubscriptionTier.PROFESSIONAL,
  SubscriptionTier.BUSINESS,
];

function PlansStep({
  currentTier,
  highlightTier,
  onSelect,
  onClose,
}: {
  currentTier: SubscriptionTier;
  highlightTier?: SubscriptionTier;
  onSelect: (p: Plan) => void;
  onClose: () => void;
}) {
  const currentIdx = TIER_ORDER.indexOf(currentTier);

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
      {/* Header */}
      <div
        className="sticky top-0 z-10 flex items-center justify-between px-8 py-5 border-b border-gray-100"
        style={{ background: "white" }}>
        <div>
          <h2 className="text-xl font-bold text-gray-900">Actualizar plan</h2>
          <p className="text-sm text-gray-400 mt-0.5">
            Plan actual:{" "}
            <span className="font-semibold" style={{ color: "#27a0c9" }}>
              {currentTier}
            </span>
          </p>
        </div>
        <button
          onClick={onClose}
          className="w-9 h-9 rounded-xl flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-colors">
          <X size={18} className="cursor-pointer" />
        </button>
      </div>

      {/* Cards */}
      <div className="min-h-0 flex-1 overflow-y-auto px-5 pb-6 pt-5 sm:px-6 sm:pb-7 sm:pt-6">
        <div className="overflow-x-auto overflow-y-visible px-1 pb-3 pt-4">
          <div className="flex min-w-max items-stretch gap-4">
          {PLANS.map((plan) => {
            const planIdx = plan.id ? TIER_ORDER.indexOf(plan.id) : TIER_ORDER.length;
            const isCurrent = !!plan.id && plan.id === currentTier;
            const isDowngrade = !plan.contactSales && planIdx < currentIdx;
            const isSelectable = plan.contactSales || (!isCurrent && !isDowngrade && plan.price > 0);
            const isHighlighted = !!plan.id && plan.id === highlightTier;
            const { Icon } = plan;

            return (
              <div
                key={plan.id ?? plan.name}
                onClick={() => isSelectable && onSelect(plan)}
                className={`plan-pill relative flex w-[248px] min-w-[248px] flex-col rounded-xl border-2 ${
                  isSelectable ? "selectable cursor-pointer" : ""
                } ${plan.recommended ? "rec" : ""} ${plan.dark ? "dark-p" : ""} ${
                  isCurrent ? "ring-2 ring-offset-1" : ""
                }`}
                style={{
                  borderColor: isCurrent
                    ? "#27a0c9"
                    : plan.recommended || isHighlighted
                      ? "#27a0c9"
                      : plan.dark
                        ? "#1e293b"
                        : "#e2e8f0",
                  background: plan.dark ? "#0f172a" : "white",
                  opacity: isDowngrade ? 0.4 : 1,
                  boxShadow:
                    plan.recommended || isHighlighted
                      ? "0 8px 24px -6px rgba(39,160,201,0.18)"
                      : "0 1px 3px rgba(0,0,0,0.05)",
                }}>
                {/* Badges */}
                {isCurrent && (
                  <div
                    className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full text-xs font-bold text-white whitespace-nowrap"
                    style={{ background: "#27a0c9" }}>
                    Plan actual
                  </div>
                )}
                {plan.recommended && !isCurrent && (
                  <div
                    className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full text-xs font-bold text-white whitespace-nowrap"
                    style={{ background: "#27a0c9" }}>
                    Recomendado
                  </div>
                )}

                <div className="p-5 flex flex-col flex-1">
                  {/* Plan icon + name */}
                  <div className="flex items-center gap-2.5 mb-4">
                    <div
                      className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{
                        background: plan.dark
                          ? "rgba(39,160,201,0.15)"
                          : plan.recommended
                            ? "rgba(39,160,201,0.10)"
                            : "rgba(0,0,0,0.04)",
                      }}>
                      <Icon
                        size={16}
                        style={{
                          color:
                            plan.dark || plan.recommended
                              ? "#27a0c9"
                              : "#64748b",
                        }}
                      />
                    </div>
                    <span
                      className="text-sm font-bold"
                      style={{ color: plan.dark ? "#f8fafc" : "#0f172a" }}>
                      {plan.name}
                    </span>
                  </div>

                  {/* Price */}
                  <div className="mb-4">
                    <div
                      className="text-2xl font-extrabold tracking-tight"
                      style={{ color: plan.dark ? "white" : "#0f172a" }}>
                      {plan.priceDisplay}
                    </div>
                    <div
                      className="text-xs mt-0.5"
                      style={{ color: plan.dark ? "#94a3b8" : "#64748b" }}>
                      {plan.priceSubtext}
                    </div>
                  </div>

                  {/* Invoice count */}
                  <div
                    className="px-3 py-2 rounded-lg mb-4 text-xs font-semibold"
                    style={{
                      background: plan.dark
                        ? "rgba(39,160,201,0.10)"
                        : plan.recommended
                          ? "rgba(39,160,201,0.07)"
                          : "rgba(0,0,0,0.03)",
                      color:
                        plan.dark || plan.recommended ? "#27a0c9" : "#475569",
                    }}>
                    {plan.invoicesDisplay} {plan.invoicesSubtext}
                  </div>

                  {/* Features */}
                  <ul className="space-y-2 flex-1 mb-5">
                    {plan.features.map((f) => (
                      <li
                        key={f.label}
                        className="flex items-start gap-2 text-xs">
                        {f.ok ? (
                          <Check
                            size={13}
                            className="mt-0.5 flex-shrink-0"
                            style={{ color: "#10b981" }}
                          />
                        ) : (
                          <X
                            size={13}
                            className="mt-0.5 flex-shrink-0"
                            style={{ color: plan.dark ? "#334155" : "#d1d5db" }}
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
                  {isCurrent ? (
                    <div
                      className="w-full py-2.5 rounded-xl text-xs font-semibold text-center"
                      style={{
                        background: "rgba(39,160,201,0.08)",
                        color: "#27a0c9",
                      }}>
                      Plan actual
                    </div>
                  ) : isDowngrade ? (
                    <div
                      className="w-full py-2.5 rounded-xl text-xs font-semibold text-center"
                      style={{ background: "#f1f5f9", color: "#94a3b8" }}>
                      No disponible
                    </div>
                  ) : plan.contactSales ? (
                    <button
                      className="cursor-pointer flex items-center justify-center gap-1.5 w-full py-2.5 rounded-xl text-xs font-semibold transition-all duration-150"
                      style={{
                        background: "rgba(39,160,201,0.15)",
                        color: "#7dd3fc",
                        border: "1px solid rgba(39,160,201,0.25)",
                      }}>
                      {plan.cta}
                      <ArrowRight size={12} />
                    </button>
                  ) : plan.price === 0 ? (
                    <div
                      className="w-full py-2.5 rounded-xl text-xs font-semibold text-center"
                      style={{ background: "#f1f5f9", color: "#94a3b8" }}>
                      Ya incluido
                    </div>
                  ) : (
                    <button
                      className="cursor-pointer flex items-center justify-center gap-1.5 w-full py-2.5 rounded-xl text-xs font-semibold transition-all duration-150"
                      style={
                        plan.recommended
                          ? { background: "#27a0c9", color: "white" }
                          : plan.dark
                            ? {
                                background: "rgba(39,160,201,0.15)",
                                color: "#7dd3fc",
                                border: "1px solid rgba(39,160,201,0.25)",
                              }
                            : {
                                background: "transparent",
                                color: "#27a0c9",
                                border: "1px solid #27a0c9",
                              }
                      }>
                      Elegir plan
                      <ArrowRight size={12} />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
          </div>
        </div>

        {/* Footer note */}
        <p className="text-center text-xs text-gray-400 mt-6">
          Los planes pagos incluyen acceso al ambiente de{" "}
          <span
            className="font-semibold px-1.5 py-0.5 rounded"
            style={{ color: "#27a0c9" }}>
            PRODUCCIÓN
          </span>{" "}
          de ARCA. Podés cambiar de plan en cualquier momento.
        </p>
      </div>
    </div>
  );
}
