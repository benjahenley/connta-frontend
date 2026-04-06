"use client";

import { useRouter, usePathname } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import { useAuth } from "../providers/AuthProvider";
import { LogOut, ChevronDown, Hash, Crown } from "lucide-react";
import { SUBSCRIPTION_TIERS, SubscriptionTier } from "@/types/auth";

const formatCuit = (cuit: string) =>
  cuit.length === 11 ? `${cuit.slice(0, 2)}-${cuit.slice(2, 10)}-${cuit.slice(10)}` : cuit;
import { authService } from "@/services/auth";

export default function NavbarPublic() {
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useAuth();
  const isHome = pathname === "/";
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isHome) return;
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isHome]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleSignOut = async () => {
    try {
      await authService.signOut();
      router.push("/auth/sign-in");
    } catch (e) {
      console.error(e);
    }
  };

  const initials =
    user?.name
      ?.split(" ")
      .map((w) => w[0])
      .slice(0, 2)
      .join("")
      .toUpperCase() || "U";

  const transparent = isHome && !scrolled;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,700;1,9..144,400&family=DM+Sans:wght@400;500;600&display=swap');
        .navbar-font-body { font-family: 'DM Sans', sans-serif; }

        .navbar-root {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 50;
          transition: background 0.3s ease, box-shadow 0.3s ease, backdrop-filter 0.3s ease;
        }
        .navbar-root.solid {
          background: rgba(255,255,255,0.97);
          box-shadow: 0 1px 0 rgba(0,0,0,0.06);
          backdrop-filter: blur(12px);
        }
        .navbar-root.transparent {
          background: rgba(4,20,35,0.25);
          backdrop-filter: blur(10px);
          border-bottom: 1px solid rgba(255,255,255,0.08);
        }

        .nav-link-light {
          color: rgba(255,255,255,0.75);
          font-size: 0.875rem;
          font-weight: 500;
          transition: color 0.2s ease;
          white-space: nowrap;
        }
        .nav-link-light:hover { color: #fff; }

        .nav-link-dark {
          color: #374151;
          font-size: 0.875rem;
          font-weight: 500;
          transition: color 0.2s ease;
          white-space: nowrap;
        }
        .nav-link-dark:hover { color: #27a0c9; }

        .nav-link-active-dark {
          color: #27a0c9 !important;
        }

        .brand-wordmark {
          transition: filter 0.25s ease, opacity 0.25s ease;
        }

        .brand-wordmark-light {
          filter: brightness(0) invert(1);
          opacity: 0.96;
        }

        .brand-wordmark-dark {
          filter: none;
          opacity: 1;
        }

        .btn-ghost-light {
          padding: 8px 18px;
          border-radius: 8px;
          font-size: 0.875rem;
          font-weight: 600;
          color: rgba(255,255,255,0.85);
          border: 1px solid rgba(255,255,255,0.22);
          background: transparent;
          cursor: pointer;
          transition: all 0.2s ease;
          white-space: nowrap;
        }
        .btn-ghost-light:hover {
          background: rgba(255,255,255,0.12);
          color: #fff;
        }

        .btn-ghost-dark {
          padding: 8px 18px;
          border-radius: 8px;
          font-size: 0.875rem;
          font-weight: 600;
          color: #27a0c9;
          border: 1px solid #27a0c9;
          background: transparent;
          cursor: pointer;
          transition: all 0.2s ease;
          white-space: nowrap;
        }
        .btn-ghost-dark:hover {
          background: #27a0c9;
          color: #fff;
        }

        .btn-primary-nav {
          padding: 8px 18px;
          border-radius: 8px;
          font-size: 0.875rem;
          font-weight: 600;
          color: #fff;
          background: #27a0c9;
          border: none;
          cursor: pointer;
          transition: all 0.2s ease;
          white-space: nowrap;
        }
        .btn-primary-nav:hover {
          background: #1e7a9c;
          transform: translateY(-1px);
          box-shadow: 0 4px 16px rgba(39,160,201,0.35);
        }

        @keyframes nbMenuIn {
          from { opacity: 0; transform: translateY(-6px) scale(.98); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>

      <header className={`navbar-root navbar-font-body ${transparent ? "transparent" : "solid"}`}>
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">

          {/* Logo + Brand */}
          <Link href="/" className="flex items-center gap-3.5 flex-shrink-0">
            <Image
              src="/favicon.svg"
              alt="Logo"
              width={30}
              height={30}
              className="drop-shadow-sm flex-shrink-0"
            />
            <Image
              src="/CONNTA.svg"
              alt="Connta"
              width={122}
              height={22}
              className={`brand-wordmark ${
                transparent ? "brand-wordmark-light" : "brand-wordmark-dark"
              }`}
            />
          </Link>

          {/* Nav Items */}
          <nav className="hidden md:flex items-center gap-8">
            {[
              { label: "Inicio", href: "/" },
              { label: "Funcionalidades", href: "/funcionalidades" },
              { label: "Precios", href: "/pricing" },
              { label: "Contacto", href: "/contacto" },
            ].map(({ label, href }) => (
              <Link
                key={label}
                href={href}
                className={transparent ? "nav-link-light" : `nav-link-dark ${pathname === href ? "nav-link-active-dark" : ""}`}
              >
                {label}
              </Link>
            ))}
          </nav>

          {/* Auth / User */}
          {user ? (
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setMenuOpen((o) => !o)}
                className="flex items-center gap-2 px-2 py-1.5 rounded-lg transition-colors"
                style={{ fontFamily: "'DM Sans', sans-serif" }}>
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0"
                  style={{ background: "rgba(39,160,201,.15)", color: "#27a0c9" }}>
                  {initials}
                </div>
                <span className={`text-sm font-medium hidden sm:block max-w-[120px] truncate ${transparent ? "text-white" : "text-gray-700"}`}>
                  {user.name || "Usuario"}
                </span>
                <ChevronDown
                  size={13}
                  className={`transition-transform duration-200 ${menuOpen ? "rotate-180" : ""} ${transparent ? "text-white/60" : "text-gray-400"}`}
                />
              </button>

              {menuOpen && (
                <div className="absolute right-0 mt-2 w-60 bg-white rounded-2xl border border-gray-100 shadow-xl shadow-black/[0.07] overflow-hidden z-50"
                  style={{ animation: "nbMenuIn .15s ease forwards", fontFamily: "'DM Sans', sans-serif" }}>
                  <div className="px-4 pt-4 pb-3.5 border-b border-gray-50">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0"
                        style={{ background: "rgba(39,160,201,.12)", color: "#27a0c9" }}>
                        {initials}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-gray-900 truncate leading-snug">
                          {user.name || "Usuario"}
                        </p>
                        <p className="text-xs text-gray-400 truncate mt-0.5">
                          {user.email || ""}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="px-4 py-3 space-y-3 border-b border-gray-50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-gray-400">
                        <Hash size={11} />
                        <span className="text-[10px] uppercase tracking-wider">CUIT</span>
                      </div>
                      <span className="text-xs font-mono text-gray-600">
                        {user.cuit ? formatCuit(user.cuit.replace(/\D/g, "")) : "—"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-gray-400">
                        <Crown size={11} />
                        <span className="text-[10px] uppercase tracking-wider">Plan</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-semibold text-gray-600">
                          {SUBSCRIPTION_TIERS[user.subscriptionTier || SubscriptionTier.FREE].name}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="py-1.5">
                    <button
                      onClick={() => router.push("/dashboard")}
                      className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-500 hover:bg-gray-50 hover:text-gray-800 transition-colors">
                      Ir al dashboard
                    </button>
                    <button
                      onClick={handleSignOut}
                      className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-500 hover:bg-gray-50 hover:text-gray-800 transition-colors">
                      <LogOut size={13} className="text-gray-400" />
                      Cerrar sesión
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => router.push("/auth/sign-in")}
                className={transparent ? "btn-ghost-light" : "btn-ghost-dark"}
              >
                Iniciar sesión
              </button>
              <button
                onClick={() => router.push("/auth/sign-up")}
                className="btn-primary-nav"
              >
                Registrarse
              </button>
            </div>
          )}

        </div>
      </header>

      {/* Spacer so content doesn't hide under fixed navbar (only on non-home pages) */}
      {!isHome && <div className="h-14" />}
    </>
  );
}
