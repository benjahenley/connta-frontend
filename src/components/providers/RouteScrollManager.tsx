"use client";

import { useEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";

export function RouteScrollManager() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const skipNextScrollRef = useRef(true);

  useEffect(() => {
    const handlePopState = () => {
      skipNextScrollRef.current = true;
    };

    window.history.scrollRestoration = "auto";
    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  useEffect(() => {
    if (skipNextScrollRef.current) {
      skipNextScrollRef.current = false;
      return;
    }

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    window.scrollTo({
      top: 0,
      left: 0,
      behavior: prefersReducedMotion ? "auto" : "smooth",
    });
  }, [pathname, searchParams]);

  return null;
}
