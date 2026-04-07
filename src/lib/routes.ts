const PUBLIC_ROUTES = new Set([
  "/",
  "/contacto",
  "/funcionalidades",
  "/pricing",
  "/auth/sign-in",
  "/auth/sign-up",
  "/auth/forgot-password",
  "/auth/reset-password",
  "/backend-offline",
]);

export function isPublicRoute(pathname: string) {
  return PUBLIC_ROUTES.has(pathname) || pathname.startsWith("/auth/");
}

