"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { authService } from "@/services/auth";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "../providers/AuthProvider";
import { useNavigationGuard } from "@/components/providers/NavigationGuardProvider";
import {
  PanelLeft,
  PanelLeftClose,
  LogOut,
  ChevronDown,
  Hash,
  Crown,
} from "lucide-react";
import { SUBSCRIPTION_TIERS, SubscriptionTier } from "@/types/auth";
import { useUpgrade } from "@/components/providers/UpgradeProvider";

export default function Navbar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const { openUpgradeModal } = useUpgrade();
  const { tryNavigate } = useNavigationGuard();
  const menuRef = useRef<HTMLDivElement>(null);

  // Mirror sidebar: auto-collapse on small/medium screens
  useEffect(() => {
    const update = () => setIsCollapsed(window.innerWidth < 1024);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  // Manual toggle only works on large screens
  useEffect(() => {
    const handleToggle = () => {
      if (window.innerWidth >= 1024) setIsCollapsed((prev) => !prev);
    };
    const handleSetCollapsed = (
      event: Event,
    ) => {
      if (window.innerWidth < 1024) return;
      const nextCollapsed = (event as CustomEvent<boolean>).detail;
      if (typeof nextCollapsed === "boolean") {
        setIsCollapsed(nextCollapsed);
      }
    };
    window.addEventListener("toggleSidebar", handleToggle);
    window.addEventListener("setSidebarCollapsed", handleSetCollapsed);
    return () => {
      window.removeEventListener("toggleSidebar", handleToggle);
      window.removeEventListener("setSidebarCollapsed", handleSetCollapsed);
    };
  }, []);

  // Close dropdown on outside click
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

  const toggleSidebar = () => {
    window.dispatchEvent(new CustomEvent("toggleSidebar"));
  };

  const initials =
    user?.name
      ?.split(" ")
      .map((w) => w[0])
      .slice(0, 2)
      .join("")
      .toUpperCase() || "U";

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,700&family=Sora:wght@400;500;600&display=swap');
        .nb-sora  { font-family: 'Sora', ui-sans-serif, system-ui, sans-serif; }

        @keyframes nbMenuIn {
          from { opacity: 0; transform: translateY(-6px) scale(.98); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        .nb-menu { animation: nbMenuIn .15s ease forwards; }
      `}</style>

      <header className="sticky top-0 w-full h-16 sm:h-14 flex items-center bg-white border-b border-gray-100 flex-shrink-0 z-40">
        {/* Logo zone — mirrors sidebar width */}
        <Link
          href="/"
          onClick={(e) => {
            if (!tryNavigate("/")) e.preventDefault();
          }}
          className={`flex items-center flex-shrink-0 h-full lg:border-r lg:border-gray-100 transition-all duration-300 ${
            isCollapsed ? "w-16 justify-center" : "w-56 px-5 gap-2.5"
          }`}>
          <Image
            src={isCollapsed ? "/favicon.svg" : "/logo-connta-navbar.svg"}
            alt="Connta"
            width={isCollapsed ? 34 : 148}
            height={34}
            className="flex-shrink-0"
          />
        </Link>

        {/* Sidebar toggle — subtle icon, no border box */}
        <button
          onClick={toggleSidebar}
          title={isCollapsed ? "Expandir panel" : "Colapsar panel"}
          className="ml-3 w-8 h-8 hidden lg:flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors flex-shrink-0">
          {isCollapsed ? <PanelLeft size={16} /> : <PanelLeftClose size={16} />}
        </button>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Right: user controls */}
        <div className="flex h-full items-center px-5">
          {isLoading ? (
            <div className="flex items-center gap-2 animate-pulse">
              <div className="w-7 h-7 rounded-full bg-gray-200" />
              <div className="h-4 w-20 bg-gray-200 rounded hidden sm:block" />
            </div>
          ) : user ? (
            <div className="relative" ref={menuRef}>
              {/* Trigger button */}
              <button
                onClick={() => setMenuOpen((o) => !o)}
                className={`nb-sora flex items-center gap-2 px-2 sm:px-2.5 py-1.5 rounded-full border transition-all duration-200 cursor-pointer ${
                  menuOpen
                    ? "bg-[rgba(39,160,201,0.08)] border-[rgba(39,160,201,0.2)]"
                    : "border-transparent hover:bg-gray-50 hover:border-gray-200"
                }`}>
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0"
                  style={{
                    background: "rgba(39,160,201,.12)",
                    color: "#27a0c9",
                  }}>
                  {initials}
                </div>
                <span className="text-sm text-gray-700 hidden sm:block max-w-[180px] truncate">
                  {user.name || "Usuario"}
                </span>
                <ChevronDown
                  size={13}
                  className={`hidden sm:block text-gray-400 transition-transform duration-200 ${
                    menuOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Dropdown */}
              {menuOpen && (
                <div className="nb-menu nb-sora absolute right-0 mt-2 w-60 bg-white rounded-2xl border border-gray-100 shadow-xl shadow-black/[0.07] overflow-hidden z-50">
                  {/* User header */}
                  <div className="px-4 pt-4 pb-3.5 border-b border-gray-50">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0"
                        style={{
                          background: "rgba(39,160,201,.12)",
                          color: "#27a0c9",
                        }}>
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

                  {/* Data rows */}
                  <div className="px-4 py-3 space-y-3 border-b border-gray-50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-gray-400">
                        <Hash size={11} />
                        <span className="text-[10px] uppercase tracking-wider">
                          CUIT
                        </span>
                      </div>
                      <span className="text-xs font-mono text-gray-600">
                        {user.cuit
                          ? user.cuit
                              .replace(/\D/g, "")
                              .replace(/^(\d{2})(\d{8})(\d)$/, "$1-$2-$3")
                          : "—"}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-gray-400">
                        <Crown size={11} />
                        <span className="text-[10px] uppercase tracking-wider">
                          Plan
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        {user.subscriptionTier !== SubscriptionTier.BUSINESS ? (
                          <button
                            onClick={() => {
                              setMenuOpen(false);
                              openUpgradeModal();
                            }}
                            className="text-xs font-semibold px-1.5 py-0.5 rounded-md cursor-pointer transition-colors"
                            style={{
                              background: "rgba(39,160,201,0.1)",
                              color: "#27a0c9",
                            }}>
                            {
                              SUBSCRIPTION_TIERS[
                                user.subscriptionTier || SubscriptionTier.FREE
                              ].name
                            }
                          </button>
                        ) : (
                          <span className="text-xs font-semibold text-gray-600">
                            {SUBSCRIPTION_TIERS[user.subscriptionTier].name}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="py-1.5">
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
                className="px-4 py-1.5 text-sm font-medium text-[#27a0c9] border border-[#27a0c9] rounded-lg hover:bg-[#27a0c9] hover:text-white transition-all">
                Iniciar sesión
              </button>
              <button
                onClick={() => router.push("/auth/sign-up")}
                className="px-4 py-1.5 text-sm font-medium text-white bg-[#27a0c9] rounded-lg hover:bg-[#1e7a9c] transition-all">
                Registrarse
              </button>
            </div>
          )}
        </div>
      </header>
    </>
  );
}
