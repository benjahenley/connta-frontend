"use client";

import Image from "next/image";
import {
  createContext,
  useContext,
  useCallback,
  useEffect,
  useRef,
  useState,
  ReactNode,
} from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  authService,
  BackendUnavailableError,
  type AuthUser,
} from "@/services/auth";
import { afipApi } from "@/services/afip";
import { isPublicRoute } from "@/lib/routes";

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
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [hasResolvedAuth, setHasResolvedAuth] = useState(false);
  const [backendUnavailable, setBackendUnavailable] = useState(false);
  const backendUnavailableRef = useRef(false);
  const router = useRouter();
  const pathname = usePathname();
  const isProtectedRoute = pathname ? !isPublicRoute(pathname) : false;

  const refreshUser = useCallback(async (currentPath?: string) => {
    try {
      setIsRedirecting(false);
      const currentUser = await authService.getCurrentUser();
      backendUnavailableRef.current = false;
      setBackendUnavailable(false);
      setUser(currentUser);
      setIsAuthenticated(!!currentUser);

      // Supabase session exists but no DB user → mid-registration.
      // Redirect to sign-up WITHOUT signing out so the session stays alive
      // and the sign-up page can detect the confirmed OTP and go to step 3.
      if (!currentUser && currentPath !== "/auth/sign-up") {
        const hasSession = await authService.checkAuth();
        if (hasSession) {
          setIsRedirecting(true);
          router.replace("/auth/sign-up");
        }
      }

      return currentUser;
    } catch (error) {
      console.error("Auth refresh failed:", error);
      setUser(null);
      setIsAuthenticated(false);
      if (error instanceof BackendUnavailableError) {
        backendUnavailableRef.current = true;
        setBackendUnavailable(true);
        const targetPath = currentPath ?? pathname;
        if (
          targetPath &&
          !isPublicRoute(targetPath) &&
          targetPath !== "/backend-offline"
        ) {
          setIsRedirecting(true);
          const offlineUrl = new URL("/backend-offline", window.location.origin);
          offlineUrl.searchParams.set("redirectTo", targetPath);
          router.replace(offlineUrl.pathname + offlineUrl.search);
        }
      }
      return null;
    } finally {
      setHasResolvedAuth(true);
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
    refreshUser(pathname).finally(() => setIsLoading(false));
    // Initial auth hydration should run once, not on every route change.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!pathname || !hasResolvedAuth) return;
    if (!isProtectedRoute) {
      setIsRedirecting(false);
      return;
    }
    if (isAuthenticated) {
      setIsRedirecting(false);
      return;
    }
    if (backendUnavailableRef.current || backendUnavailable) {
      setIsRedirecting(false);
      return;
    }

    let cancelled = false;

    const redirectUnauthedUser = async () => {
      const hasSession = await authService.checkAuth();
      if (cancelled) return;

      setIsRedirecting(true);
      if (hasSession && pathname !== "/auth/sign-up") {
        router.replace("/auth/sign-up");
        return;
      }

      const signInUrl = new URL("/auth/sign-in", window.location.origin);
      signInUrl.searchParams.set("redirectTo", pathname);
      router.replace(signInUrl.pathname + signInUrl.search);
    };

    void redirectUnauthedUser();

    return () => {
      cancelled = true;
    };
  }, [
    backendUnavailable,
    hasResolvedAuth,
    isAuthenticated,
    isProtectedRoute,
    pathname,
    router,
  ]);

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
        await refreshUser(pathname);
      }
    });

    return () => subscription.unsubscribe();
  }, [pathname, refreshUser, router]);

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated,
    signOut,
    refreshUser,
  };

  const showProtectedRouteLoader =
    isProtectedRoute && (!hasResolvedAuth || isLoading || isRedirecting || !isAuthenticated);

  return (
    <AuthContext.Provider value={value}>
      {showProtectedRouteLoader ? <AuthScreenLoader /> : children}
    </AuthContext.Provider>
  );
}

function AuthScreenLoader() {
  return (
    <>
      <style>{`
        @keyframes connta-pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(0.96); }
        }

        .connta-logo-pulse {
          animation: connta-pulse 1.6s ease-in-out infinite;
        }
      `}</style>

      <div
        className="fixed inset-0 z-[100] flex items-center justify-center"
        style={{ background: "#080f16" }}
      >
        <div className="connta-logo-pulse">
          <Image
            src="/favicon.svg"
            alt="Connta"
            width={140}
            height={140}
            priority
          />
        </div>
      </div>
    </>
  );
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

  if (requireAdmin && !user?.isSuperAdmin) {
    return (
      fallback || (
        <div className="text-center p-8">
          <h2 className="text-xl font-semibold text-red-600">
            Acceso denegado
          </h2>
          <p className="text-gray-600">
            Esta funcionalidad requiere permisos de administrador.
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
