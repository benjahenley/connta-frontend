import { supabase } from "@/lib/supabase";
import { afipApi } from "@/services/afip";
import type {
  AuthUser,
  SubscriptionInfo,
  UsageStats,
  UsageCheck,
  SubscriptionHistoryEntry,
  UpdateSubscriptionDto,
  Environment,
} from "@/types/auth";

export type { AuthUser } from "@/types/auth";

export class BackendUnavailableError extends Error {
  constructor(message = "BACKEND_UNAVAILABLE") {
    super(message);
    this.name = "BackendUnavailableError";
  }
}

function getApiBaseUrl() {
  return process.env.NEXT_PUBLIC_API_URL?.replace(/\/+$/, "") ?? "";
}

class AuthService {
  // Sign in with Supabase Auth
  async signIn(
    email: string,
    password: string
  ): Promise<{ user: AuthUser; access_token: string }> {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw new Error(error.message);
      }

      if (!data.user) {
        throw new Error("No se pudo iniciar sesion");
      }

      // Check if email is verified
      if (!data.user.email_confirmed_at) {
        throw new Error("Por favor, verifica tu email primero");
      }

      const user: AuthUser = {
        id: data.user.id,
        email: data.user.email!,
        name: data.user.user_metadata?.name,
        isVerified: !!data.user.email_confirmed_at,
        isVerifiedCustomer:
          data.user.user_metadata?.isVerifiedCustomer || false,
        isSuperAdmin: false,
      };

      return {
        user,
        access_token: data.session?.access_token || "",
      };
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : "No se pudo iniciar sesion"
      );
    }
  }

  // Sign out
  async signOut(): Promise<void> {
    const { error } = await supabase.auth.signOut();
    if (error) {
      throw new Error(error.message);
    }
    afipApi.clearCache();
  }

  // Get current user (merges Supabase auth + backend subscription data)
  async getCurrentUser(): Promise<AuthUser | null> {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        return null;
      }

      if (!user.email_confirmed_at) {
        return null;
      }

      const base: AuthUser = {
        id: user.id,
        email: user.email!,
        name: user.user_metadata?.name,
        isVerified: !!user.email_confirmed_at,
        isVerifiedCustomer: user.user_metadata?.isVerifiedCustomer || false,
        isSuperAdmin: false,
      };

      // Enrich with backend data (subscription tier, environment, etc.)
      // If the backend user doesn't exist, the user is NOT fully registered
      try {
        const token = await this.getToken();
        if (token) {
          const apiUrl = getApiBaseUrl();
          if (!apiUrl) {
            throw new BackendUnavailableError();
          }

          const res = await fetch(`${apiUrl}/auth/me`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (res.ok) {
            const backendUser = await res.json();
            base.subscriptionTier = backendUser.subscriptionTier;
            base.subscriptionStatus = backendUser.subscriptionStatus;
            base.currentEnvironment = backendUser.currentEnvironment;
            base.localUserId = backendUser.localUserId;
            base.cuit = backendUser.cuit ?? null;
            base.isSuperAdmin = backendUser.isSuperAdmin ?? false;
          } else if (res.status === 401) {
            // Backend rejected — user not registered in DB
            return null;
          } else {
            throw new BackendUnavailableError();
          }
        }
      } catch (error) {
        if (error instanceof BackendUnavailableError) {
          throw error;
        }
        throw new BackendUnavailableError();
      }

      return base;
    } catch (error) {
      if (error instanceof BackendUnavailableError) {
        throw error;
      }
      return null;
    }
  }

  // Check if user is authenticated
  async checkAuth(): Promise<boolean> {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        return false;
      }

      // Double-check with user data
      const {
        data: { user },
      } = await supabase.auth.getUser();
      const isAuthenticated = !!(user && user.email_confirmed_at);

      return isAuthenticated;
    } catch {
      return false;
    }
  }

  // ── 3-step sign-up flow ──

  // Step 1: send OTP to email (creates user if not exists)
  async sendOtp(email: string): Promise<void> {
    const apiUrl = getApiBaseUrl();
    if (apiUrl) {
      const res = await fetch(`${apiUrl}/user/exists/email/${encodeURIComponent(email)}`);
      if (res.ok) {
        const { exists } = await res.json();
        if (exists) throw new Error("EMAIL_ALREADY_REGISTERED");
      }
    }

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { shouldCreateUser: true },
    });
    if (error) throw new Error(error.message);
  }

  // Step 2: verify 6-digit OTP code
  async verifyEmailOtp(email: string, token: string): Promise<void> {
    const { error } = await supabase.auth.verifyOtp({
      email,
      token,
      type: "email",
    });
    if (error) throw new Error(error.message);
  }

  // Step 3: set name + password, then register in backend DB
  async completeSignUp(name: string, password: string, email: string, cuit: string): Promise<{ message: string; user: AuthUser }> {
    // Set password and name on the verified user
    const { data: updateData, error: updateError } = await supabase.auth.updateUser({
      password,
      data: { name, cuit, isVerifiedCustomer: false },
    });
    if (updateError) {
      if (updateError.message.toLowerCase().includes('should be different')) {
        throw new Error('Esa contraseña ya fue usada. Elegí una contraseña diferente.');
      }
      throw new Error(updateError.message);
    }

    const authUser = updateData.user;
    if (!authUser) throw new Error("No se pudo actualizar el usuario");

    const apiUrl = getApiBaseUrl();
    if (!apiUrl) throw new Error("La URL de la API no esta configurada");

    const response = await fetch(`${apiUrl}/user/create`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ authUserId: authUser.id, name, email, cuit }),
    });

    if (!response.ok) {
      let errorMessage = "No se pudo crear el usuario en la base de datos";
      try {
        const err = await response.json();
        if (err?.message) errorMessage = err.message;
      } catch {}
      throw new Error(errorMessage);
    }

    const user: AuthUser = {
      id: authUser.id,
      email: authUser.email!,
      name,
      cuit,
      isVerified: !!authUser.email_confirmed_at,
      isVerifiedCustomer: false,
      isSuperAdmin: false,
    };

    return { message: "Cuenta creada exitosamente.", user };
  }

  // Resend confirmation email
  async resendConfirmation(email: string): Promise<{ message: string }> {
    try {
      const { error } = await supabase.auth.resend({
        type: "signup",
        email,
      });

      if (error) {
        throw new Error(error.message);
      }

      return { message: "Email de confirmacion enviado correctamente" };
    } catch (error) {
      throw new Error(
        error instanceof Error
          ? error.message
          : "No se pudo reenviar la confirmacion"
      );
    }
  }

  // Get session token for backend API calls
  async getToken(): Promise<string | null> {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      return session?.access_token || null;
    } catch {
      return null;
    }
  }

  // Listen to auth state changes
  onAuthStateChange(callback: (user: AuthUser | null) => void) {
    return supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user?.email_confirmed_at) {
        const user: AuthUser = {
          id: session.user.id,
          email: session.user.email!,
          name: session.user.user_metadata?.name,
          isVerified: !!session.user.email_confirmed_at,
          isVerifiedCustomer:
            session.user.user_metadata?.isVerifiedCustomer || false,
          isSuperAdmin: false,
        };
        callback(user);
      } else {
        callback(null);
      }
    });
  }

  // Call backend API to upgrade to customer (for payment integration)
  async upgradeToCustomer(): Promise<{ message: string }> {
    try {
      console.log("🚀 Starting upgrade to customer...");

      const token = await this.getToken();
      if (!token) {
        console.error("❌ No token found for upgrade");
        throw new Error("No autenticado");
      }

      console.log("🔑 Got token for upgrade, making API call...");

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/upgrade-to-customer`,
        
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("📡 API Response status:", response.status);

      if (!response.ok) {
        const error = await response.json();
        console.error("❌ API Error:", error);
        throw new Error(error.message || "No se pudo actualizar la cuenta");
      }

      const result = await response.json();
      console.log("✅ Upgrade successful:", result);
      return result;
    } catch (error) {
      console.error("❌ Full upgrade error:", error);
      throw new Error(
        error instanceof Error
          ? error.message
          : "No se pudo actualizar la cuenta"
      );
    }
  }

  // ==================== SUBSCRIPTION MANAGEMENT ====================

  /**
   * Get subscription information for current user
   */
  async getSubscriptionInfo(): Promise<SubscriptionInfo> {
    try {
      const token = await this.getToken();
      if (!token) {
        throw new Error("No autenticado");
      }

      const response = await fetch(
        `${getApiBaseUrl()}/auth/subscription/info`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("No se pudo obtener la informacion de la suscripcion");
      }

      return await response.json();
    } catch (error) {
      throw new Error(
        error instanceof Error
          ? error.message
          : "No se pudo obtener la informacion de la suscripcion"
      );
    }
  }

  /**
   * Get subscription history
   */
  async getSubscriptionHistory(): Promise<SubscriptionHistoryEntry[]> {
    try {
      const token = await this.getToken();
      if (!token) {
        throw new Error("No autenticado");
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/subscription/history`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("No se pudo obtener el historial de suscripcion");
      }

      return await response.json();
    } catch (error) {
      throw new Error(
        error instanceof Error
          ? error.message
          : "No se pudo obtener el historial de suscripcion"
      );
    }
  }

  /**
   * Update subscription (Admin only)
   */
  async updateSubscription(
    userId: string,
    updateDto: UpdateSubscriptionDto
  ): Promise<{ message: string }> {
    try {
      const token = await this.getToken();
      if (!token) {
        throw new Error("No autenticado");
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/subscription/update/${userId}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updateDto),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(
          error.message || "No se pudo actualizar la suscripcion"
        );
      }

      return await response.json();
    } catch (error) {
      throw new Error(
        error instanceof Error
          ? error.message
          : "No se pudo actualizar la suscripcion"
      );
    }
  }

  // ==================== ENVIRONMENT MANAGEMENT ====================

  /**
   * Switch between DEV and PROD environments
   */
  async switchEnvironment(
    environment: Environment
  ): Promise<{ message: string; environment: Environment }> {
    try {
      const token = await this.getToken();
      if (!token) {
        throw new Error("No autenticado");
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/environment/switch`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ environment }),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "No se pudo cambiar el entorno");
      }

      return await response.json();
    } catch (error) {
      throw new Error(
        error instanceof Error
          ? error.message
          : "No se pudo cambiar el entorno"
      );
    }
  }

  /**
   * Get current active environment
   */
  async getCurrentEnvironment(): Promise<{ environment: Environment }> {
    try {
      const token = await this.getToken();
      if (!token) {
        throw new Error("No autenticado");
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/environment/current`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("No se pudo obtener el entorno actual");
      }

      return await response.json();
    } catch (error) {
      throw new Error(
        error instanceof Error
          ? error.message
          : "No se pudo obtener el entorno actual"
      );
    }
  }

  // ==================== USAGE TRACKING ====================

  /**
   * Get usage statistics for current month
   */
  async getUsageStats(): Promise<UsageStats> {
    try {
      const token = await this.getToken();
      if (!token) {
        throw new Error("No autenticado");
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/usage/stats`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("No se pudieron obtener las estadisticas de uso");
      }

      return await response.json();
    } catch (error) {
      throw new Error(
        error instanceof Error
          ? error.message
          : "No se pudieron obtener las estadisticas de uso"
      );
    }
  }

  /**
   * Check if user can generate invoices in specific environment
   */
  async checkUsage(environment: Environment): Promise<UsageCheck> {
    try {
      const token = await this.getToken();
      if (!token) {
        throw new Error("No autenticado");
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/usage/check/${environment}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("No se pudo verificar el uso");
      }

      return await response.json();
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : "No se pudo verificar el uso"
      );
    }
  }
}

export const authService = new AuthService();
