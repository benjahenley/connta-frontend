"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/components/providers/AuthProvider";
import { type ReactNode, useEffect, useState } from "react";
import { sidebarItems } from "@/data/sidebarItems";
import { useNavigationGuard } from "@/components/providers/NavigationGuardProvider";

type BottomNavItem = {
  href: string;
  children?: { href: string }[];
  icon: ReactNode;
  name: string;
  requireAdmin?: boolean;
};

export default function BottomNav() {
  const pathname = usePathname();
  const { user } = useAuth();
  const { tryNavigate } = useNavigationGuard();
  const [pendingPath, setPendingPath] = useState<string | null>(null);
  const items = sidebarItems as BottomNavItem[];

  useEffect(() => {
    setPendingPath(null);
  }, [pathname]);

  const activePath = pendingPath ?? pathname;

  const visibleItems = items.filter((item) => {
    if (item.requireAdmin && !user?.isSuperAdmin) return false;
    return true;
  });

  return (
    <nav className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-100 shadow-[0_-4px_16px_rgba(0,0,0,0.06)] flex items-center justify-around h-18 px-2">
      {visibleItems.map((item) => {
        const isActive =
          activePath === item.href ||
          item.children?.some((c) => activePath === c.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={(e) => {
              if (!tryNavigate(item.href)) {
                e.preventDefault();
                return;
              }
              setPendingPath(item.href);
            }}
            className={`flex flex-col items-center gap-2 flex-1 py-2 rounded-xl transition-all duration-150 ${
              isActive ? "text-[#27a0c9]" : "text-gray-400 hover:text-gray-600"
            }`}>
            <span className="flex-shrink-0">{item.icon}</span>
            <span className="text-[12px] font-medium leading-none">
              {item.name}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
