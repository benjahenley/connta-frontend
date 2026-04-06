"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/components/providers/AuthProvider";
import { useUpgrade } from "@/components/providers/UpgradeProvider";
import { useNavigationGuard } from "@/components/providers/NavigationGuardProvider";
import { type ReactNode, useState, useEffect } from "react";
import { sidebarItems } from "@/data/sidebarItems";
import { ChevronDown, Rocket, Crown } from "lucide-react";
import { SubscriptionTier, SUBSCRIPTION_TIERS } from "@/types/auth";

type SidebarItem = {
  name: string;
  href: string;
  icon: ReactNode;
  children?: SidebarItem[];
  requireAdmin?: boolean;
  requirePremium?: boolean;
  requireAuth?: boolean;
  requireTier?: SubscriptionTier;
};

export default function Sidebar() {
  const pathname = usePathname();
  const { user } = useAuth();
  const { openUpgradeModal } = useUpgrade();
  const { tryNavigate } = useNavigationGuard();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [pendingPath, setPendingPath] = useState<string | null>(null);
  const items = sidebarItems as SidebarItem[];

  // Auto-collapse on small/medium screens; auto-expand on large screens
  useEffect(() => {
    const update = () => {
      setIsCollapsed(window.innerWidth < 1024);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  // Manual toggle only works on large screens
  useEffect(() => {
    const handleToggle = () => {
      if (window.innerWidth >= 1024) setIsCollapsed((prev) => !prev);
    };
    window.addEventListener("toggleSidebar", handleToggle);
    return () => window.removeEventListener("toggleSidebar", handleToggle);
  }, []);

  const TIER_ORDER = [SubscriptionTier.FREE, SubscriptionTier.STARTER, SubscriptionTier.PROFESSIONAL, SubscriptionTier.BUSINESS];

  useEffect(() => {
    setPendingPath(null);
  }, [pathname]);

  const canAccess = (item: SidebarItem) => {
    if (item.requireAdmin && !user?.isSuperAdmin) return false;
    if (item.requirePremium && !user?.isVerifiedCustomer) return false;
    if (item.requireAuth && !user) return false;
    if (item.requireTier) {
      const userTier = user?.subscriptionTier || SubscriptionTier.FREE;
      if (TIER_ORDER.indexOf(userTier) < TIER_ORDER.indexOf(item.requireTier)) return false;
    }
    return true;
  };

  const shouldShowItem = (item: SidebarItem) => {
    if (item.requireAdmin && !user?.isSuperAdmin) return false;
    return true;
  };

  const activePath = pendingPath ?? pathname;
  const isActive = (href: string) => activePath === href;
  const isParentActive = (item: SidebarItem) =>
    activePath === item.href ||
    item.children?.some((c) => activePath === c.href);

  return (
      <aside
        className={`hidden sm:flex sticky top-14 self-start h-[calc(100vh-3.5rem)] bg-white shadow-sm border-r border-gray-100 transition-all duration-300 overflow-x-hidden flex-col flex-shrink-0 ${
          isCollapsed ? "w-16 overflow-y-hidden" : "w-56 overflow-y-auto"
        }`}>
      <div className={`flex-1 overflow-hidden relative ${isCollapsed ? "flex flex-col justify-center -mt-16" : ""}`}>
        <nav
          className="flex flex-col"
          style={!isCollapsed ? { paddingTop: "1.25rem" } : undefined}>
        {items.filter(shouldShowItem).map((item) => {
          const accessible = canAccess(item);
          const parentActive = isParentActive(item);
          const hasChildren = item.children && item.children.length > 0;
          const children = item.children ?? [];
          const showChildren = !isCollapsed && hasChildren;

          return (
            <div key={item.href}>
              {/* Parent item */}
              <div className={isCollapsed ? "" : "px-2"}>
                <Link
                  href={accessible ? item.href : "#"}
                  onClick={(e) => {
                    if (!accessible) { e.preventDefault(); return; }
                    if (!tryNavigate(item.href)) {
                      e.preventDefault();
                      return;
                    }
                    setPendingPath(item.href);
                  }}
                  title={isCollapsed ? item.name : undefined}
                  className={`flex items-center gap-3 py-2.5 rounded-lg mb-0.5 text-sm font-medium transition-all duration-150 ${
                    parentActive
                      ? "bg-[#27a0c9]/10 text-[#27a0c9]"
                      : accessible
                        ? "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                        : "text-gray-300 cursor-not-allowed"
                  } ${isCollapsed ? "justify-center w-full" : "px-3"}`}>
                  <span
                    className={`flex-shrink-0 ${parentActive ? "text-[#27a0c9]" : ""}`}>
                    {item.icon}
                  </span>
                  {!isCollapsed && (
                    <>
                      <span className="flex-1 truncate">{item.name}</span>
                      {hasChildren && (
                        <ChevronDown
                          size={13}
                          className={`flex-shrink-0 transition-transform duration-200 text-gray-400 ${
                            parentActive ? "rotate-180" : ""
                          }`}
                        />
                      )}
                    </>
                  )}
                </Link>
              </div>

              {/* Children — slide in/out */}
              {showChildren && (
                <div
                  className={`overflow-hidden transition-all duration-200 ${
                    parentActive ? "max-h-40 opacity-100" : "max-h-0 opacity-0"
                  }`}>
                  {children.map((child) => {
                    const childAccessible = canAccess(child);
                    return (
                      <div key={child.href} className="pl-5 pr-2">
                        <Link
                          href={childAccessible ? child.href : "#"}
                          onClick={(e) => {
                            if (!childAccessible) { e.preventDefault(); return; }
                            if (!tryNavigate(child.href)) {
                              e.preventDefault();
                              return;
                            }
                            setPendingPath(child.href);
                          }}
                          className={`flex items-center gap-2.5 px-3 py-2 rounded-lg mb-0.5 text-sm transition-all duration-150 ${
                            isActive(child.href)
                              ? "bg-[#27a0c9]/10 text-[#27a0c9] font-medium"
                              : childAccessible
                                ? "text-gray-500 hover:bg-gray-50 hover:text-gray-800"
                                : "text-gray-300 cursor-not-allowed"
                          }`}>
                          <span className="flex-shrink-0">{child.icon}</span>
                          <span className="truncate">{child.name}</span>
                        </Link>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
        </nav>
      </div>

      {/* ── Upgrade prompt ─────────────────────────────────────────── */}
      {user && (
        <div className={`px-2 pb-4 mt-auto ${isCollapsed ? "flex justify-center" : ""}`}>
          {!isCollapsed ? (
            /* Expanded: full card */
            (!user.subscriptionTier || user.subscriptionTier === SubscriptionTier.FREE) ? (
              <button
                onClick={() => openUpgradeModal(SubscriptionTier.STARTER)}
                className="w-full text-left rounded-xl p-3 transition-all duration-150 group"
                style={{
                  background: "rgba(39,160,201,0.06)",
                  border: "1.5px solid rgba(39,160,201,0.18)",
                }}>
                <div className="flex items-center gap-2 mb-1.5">
                  <div
                    className="w-6 h-6 rounded-lg flex items-center justify-center"
                    style={{ background: "rgba(39,160,201,0.15)" }}>
                    <Rocket size={12} style={{ color: "#27a0c9" }} />
                  </div>
                  <span className="text-xs font-bold" style={{ color: "#0f172a" }}>
                    Plan Free
                  </span>
                </div>
                <p className="text-xs text-gray-500 mb-2 leading-snug">
                  Pasá a Starter para acceder a Producción.
                </p>
                <div
                  className="flex items-center gap-1 text-xs font-semibold group-hover:gap-2 transition-all duration-150"
                  style={{ color: "#27a0c9" }}>
                  Actualizar plan
                  <Rocket size={11} />
                </div>
              </button>
            ) : (
              /* Already paid: show current plan badge */
              <button
                onClick={() => openUpgradeModal(SubscriptionTier.STARTER)}
                className="w-full text-left rounded-xl p-3 transition-all duration-150 group cursor-pointer"
                style={{ background: "rgba(16,185,129,0.05)", border: "1.5px solid rgba(16,185,129,0.18)" }}>
                <div className="flex items-center gap-2 mb-1">
                  <div
                    className="w-6 h-6 rounded-lg flex items-center justify-center"
                    style={{ background: "rgba(16,185,129,0.15)" }}>
                    <Crown size={11} style={{ color: "#10b981" }} />
                  </div>
                  <span className="text-xs font-bold" style={{ color: "#065f46" }}>
                    {SUBSCRIPTION_TIERS[user.subscriptionTier].name}
                  </span>
                </div>
              </button>
            )
          ) : (
            /* Collapsed: icon button — always visible */
            <button
              onClick={() => openUpgradeModal(SubscriptionTier.STARTER)}
              title="Ver planes"
              className="w-10 h-10 rounded-xl flex items-center justify-center transition-colors"
              style={
                !user.subscriptionTier || user.subscriptionTier === SubscriptionTier.FREE
                  ? { background: "rgba(39,160,201,0.1)", color: "#27a0c9" }
                  : { background: "rgba(16,185,129,0.1)", color: "#10b981" }
              }>
              {!user.subscriptionTier || user.subscriptionTier === SubscriptionTier.FREE
                ? <Rocket size={16} />
                : <Crown size={15} />
              }
            </button>
          )}
        </div>
      )}
    </aside>
  );
}
