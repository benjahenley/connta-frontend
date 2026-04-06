"use client";

import { AlertTriangle } from "lucide-react";
import { useAuth } from "@/components/providers/AuthProvider";
import { SubscriptionStatus } from "@/types/auth";

export default function PastDueBanner() {
  const { user } = useAuth();

  if (user?.subscriptionStatus !== SubscriptionStatus.PAST_DUE) return null;

  const endsAt = user.gracePeriodEndsAt ? new Date(user.gracePeriodEndsAt) : null;
  const now = new Date();
  const daysLeft = endsAt
    ? Math.max(0, Math.ceil((endsAt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)))
    : 0;

  return (
    <div className="bg-amber-50 border-b border-amber-200 px-4 py-2.5 flex items-center justify-center gap-2 text-sm">
      <AlertTriangle size={16} className="text-amber-600 shrink-0" />
      <span className="text-amber-800">
        Tu pago no pudo ser procesado.{" "}
        {daysLeft > 0 ? (
          <>
            Tenés <strong>{daysLeft} día{daysLeft !== 1 ? "s" : ""}</strong> para
            regularizar tu suscripción antes de perder acceso a tu plan.
          </>
        ) : (
          <>Tu acceso será suspendido en breve.</>
        )}
      </span>
    </div>
  );
}
