"use client";

import {
  createContext,
  useContext,
  useCallback,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { useRouter, usePathname } from "next/navigation";
import { authService, type AuthUser } from "@/services/auth";
import { afipApi } from "@/services/afip";

interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<AuthUser | null>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const refreshUser = useCallback(async () => {
    try {
      const currentUser = await authService.getCurrentUser();
      setUser(currentUser);
      setIsAuthenticated(!!currentUser);

      // Supabase session exists but no DB user → mid-registration.
      // Redirect to sign-up WITHOUT signing out so the session stays alive
      // and the sign-up page can detect the confirmed OTP and go to step 3.
      if (!currentUser && pathname !== "/auth/sign-up") {
        const hasSession = await authService.checkAuth();
        if (hasSession) {
          router.push("/auth/sign-up");
        }
      }

      return currentUser;
    } catch (error) {
      console.error("Auth refresh failed:", error);
      setUser(null);
      setIsAuthenticated(false);
      return null;
    }
  }, [pathname, router]);

  const signOut = async () => {
    try {
      await authService.signOut();
      setUser(null);
      setIsAuthenticated(false);
      router.push("/auth/sign-in");
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

  // Load user on mount — middleware already guarantees we're authenticated
  // on protected routes, so this is just populating context
  useEffect(() => {
    refreshUser().finally(() => setIsLoading(false));
  }, [refreshUser]);

  // Listen to auth state changes from Supabase
  useEffect(() => {
    const {
      data: { subscription },
    } = authService.onAuthStateChange(async (authUser) => {
      if (!authUser) {
        afipApi.clearCache();
        setUser(null);
        setIsAuthenticated(false);
      } else {
        await refreshUser();
      }
    });

    return () => subscription.unsubscribe();
  }, [refreshUser, router]);

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated,
    signOut,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Hook to use the auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

// Higher-order component for protected routes
export function withAuth<T extends object>(Component: React.ComponentType<T>) {
  return function ProtectedComponent(props: T) {
    const { isAuthenticated, isLoading } = useAuth();

    if (isLoading || !isAuthenticated) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="loader-3d"></div>
        </div>
      );
    }

    return <Component {...props} />;
  };
}

// Component for requiring specific permissions
interface RequirePermissionProps {
  children: ReactNode;
  requirePremium?: boolean;
  requireAdmin?: boolean;
  fallback?: ReactNode;
}

export function RequirePermission({
  children,
  requirePremium = false,
  requireAdmin = false,
  fallback,
}: RequirePermissionProps) {
  const { user } = useAuth();
  console.log(user?.isSuperAdmin);
  console.log(requireAdmin);

  if (requireAdmin && !user?.isSuperAdmin) {
    return (
      fallback || (
        <div className="text-center p-8">
          <h2 className="text-xl font-semibold text-red-600">Access Denied</h2>
          <p className="text-gray-600">
            This feature requires admin permissions.
          </p>
        </div>
      )
    );
  }

  if (requirePremium && !user?.isVerifiedCustomer) {
    return (
      fallback || (
        <div className="text-center p-8">
          <h2 className="text-xl font-semibold text-orange-600">
            Plan Premium requerido
          </h2>
          <p className="text-gray-600 mt-1 mb-4">
            Esta funcionalidad requiere un plan de pago.
          </p>
        </div>
      )
    );
  }

  return <>{children}</>;
}
