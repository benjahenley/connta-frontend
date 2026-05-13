"use client";

import Link from "next/link";
import { Sparkles, Clock } from "lucide-react";
import { useAuth } from "@/components/providers/AuthProvider";
import { SubscriptionTier } from "@/types/auth";

export default function TrialBanner() {
  const { user } = useAuth();

  if (!user?.trialEndsAt) return null;
  if (user.subscriptionTier !== SubscriptionTier.BUSINESS) return null;

  const endsAt = new Date(user.trialEndsAt);
  const now = new Date();
  const msLeft = endsAt.getTime() - now.getTime();
  const daysLeft = Math.ceil(msLeft / (1000 * 60 * 60 * 24));

  if (daysLeft <= 0) {
    return (
      <div className="bg-rose-50 border-b border-rose-200 px-4 py-2.5 flex items-center justify-center gap-2 text-sm">
        <Clock size={16} className="text-rose-600 shrink-0" />
        <span className="text-rose-800">
          Tu prueba gratis terminó.{" "}
          <Link href="/pricing" className="font-semibold underline hover:no-underline">
            Suscribite para mantener el acceso completo
          </Link>
          .
        </span>
      </div>
    );
  }

  const isUrgent = daysLeft <= 7;
  const tone = isUrgent
    ? "bg-amber-50 border-amber-200 text-amber-800"
    : "bg-sky-50 border-sky-200 text-sky-800";
  const iconColor = isUrgent ? "text-amber-600" : "text-sky-600";

  return (
    <div className={`${tone} border-b px-4 py-2.5 flex items-center justify-center gap-2 text-sm`}>
      <Sparkles size={16} className={`${iconColor} shrink-0`} />
      <span>
        Estás en tu prueba gratis de Business.{" "}
        <strong>
          {daysLeft} día{daysLeft !== 1 ? "s" : ""} restante
          {daysLeft !== 1 ? "s" : ""}
        </strong>
        .{" "}
        <Link href="/pricing" className="font-semibold underline hover:no-underline">
          Ver planes
        </Link>
      </span>
    </div>
  );
}
