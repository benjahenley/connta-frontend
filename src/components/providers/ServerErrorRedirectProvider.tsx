"use client";

import { useEffect, type ReactNode } from "react";

let fetchPatched = false;
let redirectingToServerError = false;

function getApiOrigin() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!apiUrl) return null;

  try {
    return new URL(apiUrl).origin;
  } catch {
    return null;
  }
}

function isBackendResponse(response: Response, apiOrigin: string | null) {
  if (!apiOrigin) return false;

  try {
    return new URL(response.url).origin === apiOrigin;
  } catch {
    return false;
  }
}

function redirectToServerError() {
  if (redirectingToServerError || window.location.pathname === "/server-error") {
    return;
  }

  redirectingToServerError = true;
  const errorUrl = new URL("/server-error", window.location.origin);
  errorUrl.searchParams.set(
    "redirectTo",
    window.location.pathname + window.location.search,
  );
  window.location.assign(errorUrl.pathname + errorUrl.search);
}

export function ServerErrorRedirectProvider({
  children,
}: {
  children: ReactNode;
}) {
  useEffect(() => {
    if (fetchPatched) return;

    const apiOrigin = getApiOrigin();
    const originalFetch = window.fetch.bind(window);
    fetchPatched = true;

    window.fetch = async (...args) => {
      const response = await originalFetch(...args);

      if (response.status >= 500 && isBackendResponse(response, apiOrigin)) {
        redirectToServerError();
      }

      return response;
    };
  }, []);

  return children;
}
