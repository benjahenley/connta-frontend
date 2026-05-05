"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

export default function AppError({ error }: { error: Error & { digest?: string } }) {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    console.error("Unhandled app error:", error);
    const errorUrl = new URL("/server-error", window.location.origin);
    if (pathname && pathname !== "/server-error") {
      errorUrl.searchParams.set("redirectTo", pathname);
    }
    router.replace(errorUrl.pathname + errorUrl.search);
  }, [error, pathname, router]);

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-16">
      <div className="mx-auto flex min-h-[70vh] max-w-2xl items-center justify-center">
        <div className="w-full rounded-[28px] border border-slate-200 bg-white p-8 shadow-[0_24px_80px_rgba(15,23,42,0.08)] sm:p-10">
          <div className="mb-6 inline-flex rounded-full border border-red-200 bg-red-50 px-3 py-1 text-sm font-semibold text-red-700">
            Error del servidor
          </div>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
            Redirigiendo...
          </h1>
        </div>
      </div>
    </main>
  );
}
