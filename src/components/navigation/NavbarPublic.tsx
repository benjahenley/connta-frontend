"use client";

import { useRouter, usePathname } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import { useAuth } from "../providers/AuthProvider";
import { Menu, X } from "lucide-react";

export default function NavbarPublic() {
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useAuth();
  const isHome = pathname === "/";
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const mobileRef = useRef<HTMLDivElement>(null);
  const mobilePanelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isHome) return;
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isHome]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const target = e.target as Node;
      const inBurger = mobileRef.current?.contains(target);
      const inPanel = mobilePanelRef.current?.contains(target);
      if (!inBurger && !inPanel) {
        setMobileOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const transparent = isHome && !scrolled && !mobileOpen;

  const navItems: { label: string; href: string }[] = [
    { label: "Inicio", href: "/" },
    { label: "Funcionalidades", href: "/funcionalidades" },
    { label: "Precios", href: "/pricing" },
    { label: "Contacto", href: "/contacto" },
  ];
  if (user) {
    navItems.push({ label: "Perfil", href: "/perfil" });
  }

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
          padding: 7px 14px;
          border-radius: 8px;
          font-size: 0.8125rem;
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
          padding: 7px 14px;
          border-radius: 8px;
          font-size: 0.8125rem;
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
          padding: 7px 14px;
          border-radius: 8px;
          font-size: 0.8125rem;
          font-weight: 600;
          color: #fff;
          background: #27a0c9;
          border: none;
          cursor: pointer;
          transition: all 0.2s ease;
          white-space: nowrap;
        }
        @media (min-width: 640px) {
          .btn-ghost-light, .btn-ghost-dark, .btn-primary-nav {
            padding: 8px 18px;
            font-size: 0.875rem;
          }
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

        .burger-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 38px;
          height: 38px;
          border-radius: 10px;
          cursor: pointer;
          transition: background 0.15s ease, color 0.15s ease;
          background: transparent;
          border: 1px solid transparent;
        }
        .burger-btn-light {
          color: #fff;
          border-color: rgba(255,255,255,0.18);
        }
        .burger-btn-light:hover {
          background: rgba(255,255,255,0.10);
        }
        .burger-btn-dark {
          color: #1f2937;
          border-color: rgba(0,0,0,0.08);
        }
        .burger-btn-dark:hover {
          background: rgba(0,0,0,0.04);
        }

        @keyframes mobileMenuIn {
          from { opacity: 0; transform: translateY(-8px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .mobile-menu-panel {
          animation: mobileMenuIn .18s ease forwards;
          background: #ffffff;
          border-top: 1px solid rgba(0,0,0,0.06);
          box-shadow: 0 12px 28px -10px rgba(15, 23, 42, 0.18);
        }
        .mobile-nav-link {
          display: block;
          padding: 12px 4px;
          font-size: 0.9375rem;
          font-weight: 500;
          color: #334155;
          border-bottom: 1px solid rgba(0,0,0,0.05);
          transition: color 0.15s ease;
        }
        .mobile-nav-link:last-of-type {
          border-bottom: none;
        }
        .mobile-nav-link:hover {
          color: #27a0c9;
        }
        .mobile-nav-link-active {
          color: #27a0c9;
        }
        .mobile-auth-btn-ghost {
          flex: 1;
          padding: 11px 14px;
          border-radius: 10px;
          font-size: 0.875rem;
          font-weight: 600;
          color: #27a0c9;
          border: 1px solid #27a0c9;
          background: transparent;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .mobile-auth-btn-ghost:hover {
          background: rgba(39,160,201,0.08);
        }
        .mobile-auth-btn-primary {
          flex: 1;
          padding: 11px 14px;
          border-radius: 10px;
          font-size: 0.875rem;
          font-weight: 600;
          color: #fff;
          background: #27a0c9;
          border: none;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .mobile-auth-btn-primary:hover {
          background: #1e7a9c;
        }
      `}</style>

      <header className={`navbar-root navbar-font-body ${transparent ? "transparent" : "solid"}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-3">

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
              className={`brand-wordmark hidden sm:block ${
                transparent ? "brand-wordmark-light" : "brand-wordmark-dark"
              }`}
            />
          </Link>

          {/* Nav Items */}
          <nav className="hidden md:flex items-center gap-8">
            {navItems.map(({ label, href }) => (
              <Link
                key={label}
                href={href}
                className={transparent ? "nav-link-light" : `nav-link-dark ${pathname === href ? "nav-link-active-dark" : ""}`}
              >
                {label}
              </Link>
            ))}
          </nav>

          {/* Auth buttons (desktop, logged out only) */}
          {!user && (
            <div className="hidden md:flex items-center gap-2">
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

          {/* Mobile burger */}
          <div className="md:hidden" ref={mobileRef}>
            <button
              aria-label="Abrir menú"
              onClick={() => setMobileOpen((o) => !o)}
              className={`burger-btn ${transparent ? "burger-btn-light" : "burger-btn-dark"}`}>
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>

        </div>

        {/* Mobile dropdown panel */}
        {mobileOpen && (
          <div ref={mobilePanelRef} className="md:hidden mobile-menu-panel">
            <div className="px-5 pt-2 pb-5">
              <nav className="flex flex-col">
                {navItems.map(({ label, href }) => (
                  <Link
                    key={label}
                    href={href}
                    onClick={() => setMobileOpen(false)}
                    className={`mobile-nav-link ${pathname === href ? "mobile-nav-link-active" : ""}`}>
                    {label}
                  </Link>
                ))}
              </nav>

              {!user && (
                <div className="flex items-center gap-3 mt-5">
                  <button
                    onClick={() => {
                      setMobileOpen(false);
                      router.push("/auth/sign-in");
                    }}
                    className="mobile-auth-btn-ghost">
                    Iniciar sesión
                  </button>
                  <button
                    onClick={() => {
                      setMobileOpen(false);
                      router.push("/auth/sign-up");
                    }}
                    className="mobile-auth-btn-primary">
                    Registrarse
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Spacer so content doesn't hide under fixed navbar (only on non-home pages) */}
      {!isHome && <div className="h-14" />}
    </>
  );
}
