import { supabase } from "@/lib/supabase";
import { SubscriptionStatus, SubscriptionTier } from "@/types/auth";

function apiBase() {
  return process.env.NEXT_PUBLIC_API_URL?.replace(/\/+$/, "") ?? "";
}

export interface CheckNowResponse {
  subscriptionStatus: SubscriptionStatus;
  subscriptionTier: SubscriptionTier;
}

export const paymentsApi = {
  async recordCheckoutAttempt(
    tier: SubscriptionTier,
    preapprovalPlanId: string,
  ): Promise<{ id: number } | null> {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    const token = session?.access_token;
    if (!token) return null;

    try {
      const res = await fetch(`${apiBase()}/payments/checkout-attempt`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ tier, preapprovalPlanId }),
      });
      if (!res.ok) return null;
      return res.json();
    } catch {
      return null;
    }
  },

  async checkNow(): Promise<CheckNowResponse | null> {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    const token = session?.access_token;
    if (!token) return null;

    try {
      const res = await fetch(`${apiBase()}/payments/check-now`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (!res.ok) return null;
      return res.json();
    } catch {
      return null;
    }
  },
};
