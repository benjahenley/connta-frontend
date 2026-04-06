"use client";

import {
  createContext,
  useCallback,
  useContext,
  useRef,
  type ReactNode,
} from "react";

interface Guard {
  /** Returns true when navigation should be blocked */
  isDirty: () => boolean;
  /** Called with the target href so the page can show its own confirm modal */
  onBlock: (href: string) => void;
}

interface NavigationGuardContextValue {
  /** Register a navigation guard. Returns an unregister function. */
  registerGuard: (guard: Guard) => () => void;
  /**
   * Attempt navigation. If a guard blocks it, the guard's onBlock callback is
   * invoked and the function returns false. Otherwise returns true (caller
   * should proceed with navigation).
   */
  tryNavigate: (href: string) => boolean;
}

const NavigationGuardContext = createContext<NavigationGuardContextValue>({
  registerGuard: () => () => {},
  tryNavigate: () => true,
});

export function NavigationGuardProvider({ children }: { children: ReactNode }) {
  const guardRef = useRef<Guard | null>(null);

  const registerGuard = useCallback((guard: Guard) => {
    guardRef.current = guard;
    return () => {
      guardRef.current = null;
    };
  }, []);

  const tryNavigate = useCallback((href: string): boolean => {
    const guard = guardRef.current;
    if (guard && guard.isDirty()) {
      guard.onBlock(href);
      return false;
    }
    return true;
  }, []);

  return (
    <NavigationGuardContext.Provider value={{ registerGuard, tryNavigate }}>
      {children}
    </NavigationGuardContext.Provider>
  );
}

export function useNavigationGuard() {
  return useContext(NavigationGuardContext);
}
