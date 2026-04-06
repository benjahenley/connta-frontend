"use client";

import Link from "next/link";
import { Suspense, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { CheckCircle, ArrowRight, Loader2 } from "lucide-react";
import { PLANS } from "@/data/plans";
import { SubscriptionTier } from "@/types/auth";
import { useAuth } from "@/components/providers/AuthProvider";

const POLL_INTERVAL_MS = 3000;
const MAX_POLLS = 10;

function SuccessContent() {
  const params = useSearchParams();
  const { user, refreshUser } = useAuth();
  const [synced, setSynced] = useState(false);
  const pollCount = useRef(0);

  const externalRef = params.get("external_reference") ?? "";
  const tierStr = externalRef.split(":")[1] as SubscriptionTier | undefined;
  const plan = PLANS.find((p) => p.id === tierStr);

  useEffect(() => {
    // If we already have the expected tier, no need to poll
    if (tierStr && user?.subscriptionTier === tierStr) {
      setSynced(true);
      return;
    }

    // Poll refreshUser until the backend webhook has updated the tier
    const interval = setInterval(async () => {
      pollCount.current += 1;
      const updated = await refreshUser();

      if (
        (tierStr && updated?.subscriptionTier === tierStr) ||
        pollCount.current >= MAX_POLLS
      ) {
        setSynced(true);
        clearInterval(interval);
      }
    }, POLL_INTERVAL_MS);

    return () => clearInterval(interval);
  }, [refreshUser, tierStr, user?.subscriptionTier]);

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-10 max-w-md w-full text-center">
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
          style={{ background: "rgba(16,185,129,0.10)" }}>
          <CheckCircle size={40} style={{ color: "#10b981" }} />
        </div>
        <h1 className="text-2xl font-extrabold text-gray-900 mb-2">
          ¡Pago exitoso!
        </h1>
        <p className="text-gray-500 text-sm mb-1">
          {plan
            ? <>Tu cuenta fue actualizada al plan <strong style={{ color: "#27a0c9" }}>{plan.name}</strong>.</>
            : "Tu suscripción fue activada correctamente."}
        </p>

        {!synced ? (
          <div className="flex items-center justify-center gap-2 text-gray-400 text-xs mb-8">
            <Loader2 size={14} className="animate-spin" />
            Sincronizando tu cuenta...
          </div>
        ) : (
          <p className="text-emerald-500 text-xs font-medium mb-8">
            Tu cuenta está actualizada.
          </p>
        )}

        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold text-white"
          style={{ background: "#27a0c9", boxShadow: "0 4px 14px rgba(39,160,201,0.30)" }}>
          Ir al dashboard
          <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <Suspense>
      <SuccessContent />
    </Suspense>
  );
}
