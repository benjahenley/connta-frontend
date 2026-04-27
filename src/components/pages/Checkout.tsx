"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Check, ArrowLeft, Shield, ExternalLink } from "lucide-react";
import { PLANS } from "@/data/plans";
import { SubscriptionTier } from "@/types/auth";
import { useAuth } from "@/components/providers/AuthProvider";
import { paymentsApi } from "@/services/payments";

const PAID_TIERS: SubscriptionTier[] = [
  SubscriptionTier.STARTER,
  SubscriptionTier.PROFESSIONAL,
  SubscriptionTier.BUSINESS,
];

export default function CheckoutPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user, isLoading } = useAuth();

  const tierParam = searchParams.get("plan")?.toUpperCase() as SubscriptionTier | null;
  const isPaidTier = (tier: string | null | undefined): tier is SubscriptionTier =>
    !!tier && PAID_TIERS.includes(tier as SubscriptionTier);
  const plan = PLANS.find(
    (p) => p.id === tierParam && isPaidTier(p.id) && p.mpCheckoutUrl
  );

  // Block until auth is resolved — without user.id we can't attach external_reference
  // to the MP checkout URL, which breaks the webhook → user mapping on the backend.
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="loader-3d" />
      </div>
    );
  }

  const checkoutHref = plan?.mpCheckoutUrl && user?.id
    ? `${plan.mpCheckoutUrl}&external_reference=${encodeURIComponent(user.id)}`
    : null;

  const preapprovalPlanId = (() => {
    if (!plan?.mpCheckoutUrl) return null;
    try {
      return new URL(plan.mpCheckoutUrl).searchParams.get("preapproval_plan_id");
    } catch {
      return null;
    }
  })();

  const handleSubscribe = () => {
    if (!checkoutHref || !plan || !preapprovalPlanId) return;

    // window.open must run synchronously inside the click handler, otherwise
    // mobile browsers block it as a non-user-initiated popup.
    const popup = window.open(checkoutHref, "_blank", "noopener,noreferrer");

    // keepalive lets this POST survive a same-tab navigation. The original tab
    // is NOT preemptively redirected — MP's back_url handles the return path.
    void paymentsApi.recordCheckoutAttempt(
      plan.id as SubscriptionTier,
      preapprovalPlanId,
    );

    if (!popup) {
      window.location.href = checkoutHref;
    }
  };

  if (!plan || !checkoutHref) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center p-8">
          <p className="text-slate-500 mb-4">Plan no válido.</p>
          <button
            onClick={() => router.push("/dashboard")}
            className="text-sm font-semibold"
            style={{ color: "#27a0c9" }}>
            Volver al inicio
          </button>
        </div>
      </div>
    );
  }

  const { Icon } = plan;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-6 py-4 flex items-center gap-4">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 transition-colors">
          <ArrowLeft size={16} />
          Volver
        </button>
        <span className="text-sm font-semibold text-gray-900">Checkout</span>
      </div>

      {/* Body */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">

          {/* Plan card */}
          <div
            className="bg-white rounded-2xl border-2 p-6 mb-5 shadow-sm"
            style={{
              borderColor: plan.recommended
                ? "#27a0c9"
                : plan.dark
                  ? "#1e293b"
                  : "#e2e8f0",
              background: plan.dark ? "#0f172a" : "white",
            }}>
            <div className="flex items-center gap-3 mb-4">
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{
                  background: plan.dark
                    ? "rgba(39,160,201,0.15)"
                    : "rgba(39,160,201,0.10)",
                }}>
                <Icon size={20} style={{ color: "#27a0c9" }} />
              </div>
              <div>
                <div
                  className="font-bold text-base"
                  style={{ color: plan.dark ? "white" : "#0f172a" }}>
                  {plan.name}
                </div>
                <div className="text-xs" style={{ color: plan.dark ? "#94a3b8" : "#64748b" }}>
                  {plan.invoicesDisplay} {plan.invoicesSubtext}
                </div>
              </div>
            </div>

            <div className="mb-5">
              <span
                className="text-3xl font-extrabold"
                style={{ color: plan.dark ? "white" : "#0f172a" }}>
                {plan.priceDisplay}
              </span>
              <span
                className="text-sm ml-1.5"
                style={{ color: plan.dark ? "#94a3b8" : "#64748b" }}>
                {plan.priceSubtext}
              </span>
            </div>

            <ul className="space-y-2">
              {plan.features
                .filter((f) => f.ok)
                .map((f) => (
                  <li key={f.label} className="flex items-center gap-2.5 text-sm">
                    <div
                      className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ background: "rgba(16,185,129,0.12)" }}>
                      <Check size={11} style={{ color: "#10b981" }} />
                    </div>
                    <span style={{ color: plan.dark ? "#cbd5e1" : "#334155" }}>
                      {f.label}
                    </span>
                  </li>
                ))}
            </ul>
          </div>

          {/* CTA — records checkout attempt, then opens MP in new tab */}
          <button
            onClick={handleSubscribe}
            className="flex items-center justify-center gap-2.5 w-full py-4 rounded-xl text-sm font-bold text-white transition-all duration-200 hover:opacity-90 active:scale-[0.98]"
            style={{
              background: "linear-gradient(135deg, #009ee3 0%, #0077b6 100%)",
              boxShadow: "0 4px 18px rgba(0,158,227,0.35)",
            }}>
            <div
              className="w-5 h-5 rounded-full flex items-center justify-center text-white font-black"
              style={{ background: "rgba(255,255,255,0.25)", fontSize: "9px" }}>
              MP
            </div>
            Suscribirme con Mercado Pago
            <ExternalLink size={13} className="opacity-70" />
          </button>

          {/* Trust line */}
          <div className="flex items-center justify-center gap-2 mt-4 text-xs text-gray-400">
            <Shield size={12} style={{ color: "#27a0c9" }} />
            Suscripción mensual · Podés cancelar en cualquier momento.
          </div>
        </div>
      </div>
    </div>
  );
}
