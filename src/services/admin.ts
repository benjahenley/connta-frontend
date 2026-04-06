import { supabase } from "@/lib/supabase";

export interface AdminUser {
  id: number;
  authUserId: string;
  name: string;
  email: string | null;
  cuit: string | null;
  role: "ADMIN" | "USER" | "SUPPORT";
  subscriptionTier: "FREE" | "STARTER" | "PROFESSIONAL" | "BUSINESS";
  subscriptionStatus: "INACTIVE" | "ACTIVE" | "CANCELLED" | "PAST_DUE";
  currentEnvironment: "DEV" | "PROD";
  createdAt: string;
  updatedAt: string;
  _count: {
    afipCerts: number;
    uploadSessions: number;
  };
}

export interface ListUsersResponse {
  users: AdminUser[];
  total: number;
  page: number;
  totalPages: number;
}

async function getToken(): Promise<string> {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  return session?.access_token || "";
}

async function adminFetch<T>(
  path: string,
  options?: RequestInit,
): Promise<T> {
  const token = await getToken();
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.message || `Request failed (${res.status})`);
  }
  return res.json();
}

export interface SubscriptionHistoryEntry {
  id: string;
  userId: number;
  previousTier: string | null;
  newTier: string;
  previousStatus: string | null;
  newStatus: string;
  reason: string | null;
  createdAt: string;
}

export const adminApi = {
  listUsers(page = 1, limit = 20, search?: string): Promise<ListUsersResponse> {
    const params = new URLSearchParams({
      page: String(page),
      limit: String(limit),
    });
    if (search?.trim()) params.set("search", search.trim());
    return adminFetch(`/auth/admin/users?${params}`);
  },

  updateRole(
    userId: number,
    role: "ADMIN" | "USER" | "SUPPORT",
  ): Promise<{ message: string }> {
    return adminFetch(`/auth/admin/users/${userId}/role`, {
      method: "PATCH",
      body: JSON.stringify({ role }),
    });
  },

  updateSubscription(
    userId: number,
    tier: string,
    status: string,
    reason?: string,
  ): Promise<{ message: string }> {
    return adminFetch(`/auth/admin/users/${userId}/subscription`, {
      method: "PATCH",
      body: JSON.stringify({ tier, status, reason }),
    });
  },

  getUserHistory(userId: number): Promise<SubscriptionHistoryEntry[]> {
    return adminFetch(`/auth/admin/users/${userId}/history`);
  },
};
