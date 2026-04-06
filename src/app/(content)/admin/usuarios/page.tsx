"use client";

import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import { RequirePermission } from "@/components/providers/AuthProvider";
import { useAuth } from "@/components/providers/AuthProvider";
import { adminApi, type AdminUser, type SubscriptionHistoryEntry } from "@/services/admin";
import { PageHeader } from "@/components/ui/PageHeader";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  Shield,
  User,
  Headset,
  MoreVertical,
  Users,
  History,
  X,
  ArrowRight as ArrowRightIcon,
} from "lucide-react";

/* ── Constants ─────────────────────────────────────────────── */

const ROLES = ["ADMIN", "USER", "SUPPORT"] as const;
const TIERS = ["FREE", "STARTER", "PROFESSIONAL", "BUSINESS"] as const;
const STATUSES = ["ACTIVE", "INACTIVE", "CANCELLED", "PAST_DUE"] as const;

const ROLE_BADGE: Record<string, { bg: string; text: string; icon: typeof Shield }> = {
  ADMIN: { bg: "rgba(239,68,68,.1)", text: "#dc2626", icon: Shield },
  USER: { bg: "rgba(100,116,139,.08)", text: "#64748b", icon: User },
  SUPPORT: { bg: "rgba(99,102,241,.1)", text: "#6366f1", icon: Headset },
};

const TIER_BADGE: Record<string, { bg: string; text: string }> = {
  FREE: { bg: "rgba(100,116,139,.08)", text: "#64748b" },
  STARTER: { bg: "rgba(39,160,201,.1)", text: "#1e7a9c" },
  PROFESSIONAL: { bg: "rgba(99,102,241,.1)", text: "#6366f1" },
  BUSINESS: { bg: "rgba(16,185,129,.1)", text: "#059669" },
};

const STATUS_DOT: Record<string, string> = {
  ACTIVE: "#10b981",
  INACTIVE: "#94a3b8",
  CANCELLED: "#ef4444",
  PAST_DUE: "#f59e0b",
};

const PAGE_SIZE = 15;

/* ── Component ─────────────────────────────────────────────── */

function AdminUsuariosContent() {
  const { user: currentUser } = useAuth();

  const [users, setUsers] = useState<AdminUser[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Action menu
  const [menuUserId, setMenuUserId] = useState<number | null>(null);
  const [menuPos, setMenuPos] = useState<{ top: number; left: number }>({ top: 0, left: 0 });
  const menuRef = useRef<HTMLDivElement>(null);

  // Confirmation dialog
  const [confirm, setConfirm] = useState<{
    userId: number;
    action: string;
    label: string;
    exec: () => Promise<void>;
  } | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  // History panel
  const [historyUser, setHistoryUser] = useState<AdminUser | null>(null);
  const [historyEntries, setHistoryEntries] = useState<SubscriptionHistoryEntry[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);

  /* ── Fetch ──────────────────────────────────────────────── */

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await adminApi.listUsers(page, PAGE_SIZE, search);
      setUsers(data.users);
      setTotal(data.total);
      setTotalPages(data.totalPages);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Error loading users");
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Debounced search
  const searchTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const handleSearch = (value: string) => {
    setSearch(value);
    setPage(1);
    if (searchTimeout.current) clearTimeout(searchTimeout.current);
    searchTimeout.current = setTimeout(() => {
      // fetchUsers is triggered by the dependency change
    }, 300);
  };

  // Close menu on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuUserId(null);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  /* ── Actions ────────────────────────────────────────────── */

  const requestConfirm = (
    userId: number,
    action: string,
    label: string,
    exec: () => Promise<void>,
  ) => {
    setMenuUserId(null);
    setConfirm({ userId, action, label, exec });
  };

  const executeConfirm = async () => {
    if (!confirm) return;
    setActionLoading(true);
    try {
      await confirm.exec();
      await fetchUsers();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Action failed");
    } finally {
      setActionLoading(false);
      setConfirm(null);
    }
  };

  const handleRoleChange = (u: AdminUser, role: typeof ROLES[number]) => {
    requestConfirm(
      u.id,
      `role-${role}`,
      `Cambiar rol de "${u.name}" a ${role}?`,
      async () => {
        await adminApi.updateRole(u.id, role);
      },
    );
  };

  const handleTierChange = (u: AdminUser, tier: typeof TIERS[number]) => {
    requestConfirm(
      u.id,
      `tier-${tier}`,
      `Cambiar plan de "${u.name}" a ${tier}?`,
      async () => {
        await adminApi.updateSubscription(
          u.id,
          tier,
          u.subscriptionStatus,
          "admin_manual",
        );
      },
    );
  };

  const handleStatusChange = (u: AdminUser, status: typeof STATUSES[number]) => {
    requestConfirm(
      u.id,
      `status-${status}`,
      `Cambiar estado de "${u.name}" a ${status}?`,
      async () => {
        await adminApi.updateSubscription(
          u.id,
          u.subscriptionTier,
          status,
          "admin_manual",
        );
      },
    );
  };

  const openHistory = async (u: AdminUser) => {
    setMenuUserId(null);
    setHistoryUser(u);
    setHistoryLoading(true);
    try {
      const entries = await adminApi.getUserHistory(u.id);
      setHistoryEntries(entries);
    } catch {
      setHistoryEntries([]);
    } finally {
      setHistoryLoading(false);
    }
  };

  /* ── Formatting helpers ─────────────────────────────────── */

  const formatCuit = (cuit: string | null) => {
    if (!cuit) return "—";
    const clean = cuit.replace(/\D/g, "");
    return clean.replace(/^(\d{2})(\d{8})(\d)$/, "$1-$2-$3");
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("es-AR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatDateTime = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString("es-AR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }) + " " + d.toLocaleTimeString("es-AR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  /* ── Render ─────────────────────────────────────────────── */

  return (
    <RequirePermission requireAdmin>
      <div className="db-sora max-w-7xl mx-auto px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        {/* Header */}
        <PageHeader
          className="db-anim db-anim-1 mb-6 sm:mb-8"
          backHref="/admin"
          backLabel="Admin"
          eyebrow="Administración"
          icon={Users}
          title="Usuarios"
          description={`${total} usuario${total !== 1 ? "s" : ""} registrado${total !== 1 ? "s" : ""}.`}
        />

        {/* Search bar */}
        <div className="db-anim db-anim-2 mb-5">
          <div className="relative max-w-md">
            <Search
              size={15}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
            />
            <input
              type="text"
              placeholder="Buscar por nombre, email o CUIT..."
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 text-sm bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#27a0c9]/30 focus:border-[#27a0c9] transition-all"
            />
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-4 px-4 py-3 text-sm text-red-700 bg-red-50 border border-red-100 rounded-xl">
            {error}
          </div>
        )}

        {/* Table */}
        <div className="db-anim db-anim-3 bg-white border border-gray-200 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-left">
                  <th className="px-4 py-3 font-semibold text-gray-500 text-xs uppercase tracking-wider">
                    Usuario
                  </th>
                  <th className="px-4 py-3 font-semibold text-gray-500 text-xs uppercase tracking-wider hidden md:table-cell">
                    CUIT
                  </th>
                  <th className="px-4 py-3 font-semibold text-gray-500 text-xs uppercase tracking-wider">
                    Rol
                  </th>
                  <th className="px-4 py-3 font-semibold text-gray-500 text-xs uppercase tracking-wider hidden sm:table-cell">
                    Plan
                  </th>
                  <th className="px-4 py-3 font-semibold text-gray-500 text-xs uppercase tracking-wider hidden lg:table-cell">
                    Estado
                  </th>
                  <th className="px-4 py-3 font-semibold text-gray-500 text-xs uppercase tracking-wider hidden xl:table-cell">
                    Certs / Sesiones
                  </th>
                  <th className="px-4 py-3 font-semibold text-gray-500 text-xs uppercase tracking-wider hidden lg:table-cell">
                    Registro
                  </th>
                  <th className="px-4 py-3 w-12" />
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i} className="border-b border-gray-50 animate-pulse">
                      <td className="px-4 py-3.5">
                        <div className="h-4 w-32 bg-gray-100 rounded" />
                        <div className="h-3 w-44 bg-gray-50 rounded mt-1.5" />
                      </td>
                      <td className="px-4 py-3.5 hidden md:table-cell">
                        <div className="h-4 w-24 bg-gray-100 rounded" />
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="h-5 w-16 bg-gray-100 rounded-md" />
                      </td>
                      <td className="px-4 py-3.5 hidden sm:table-cell">
                        <div className="h-5 w-20 bg-gray-100 rounded-md" />
                      </td>
                      <td className="px-4 py-3.5 hidden lg:table-cell">
                        <div className="h-4 w-14 bg-gray-100 rounded" />
                      </td>
                      <td className="px-4 py-3.5 hidden xl:table-cell">
                        <div className="h-4 w-16 bg-gray-100 rounded" />
                      </td>
                      <td className="px-4 py-3.5 hidden lg:table-cell">
                        <div className="h-4 w-20 bg-gray-100 rounded" />
                      </td>
                      <td className="px-4 py-3.5" />
                    </tr>
                  ))
                ) : users.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-4 py-12 text-center text-gray-400">
                      {search ? "Sin resultados para esta busqueda" : "No hay usuarios"}
                    </td>
                  </tr>
                ) : (
                  users.map((u) => {
                    const roleBadge = ROLE_BADGE[u.role] || ROLE_BADGE.USER;
                    const RoleIcon = roleBadge.icon;
                    const tierBadge = TIER_BADGE[u.subscriptionTier] || TIER_BADGE.FREE;
                    const statusColor = STATUS_DOT[u.subscriptionStatus] || STATUS_DOT.INACTIVE;
                    const isSelf = u.id === currentUser?.localUserId;

                    return (
                      <tr
                        key={u.id}
                        className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors"
                      >
                        {/* User info */}
                        <td className="px-4 py-3.5">
                          <div className="flex items-center gap-3">
                            <div
                              className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0"
                              style={{ background: "rgba(39,160,201,.1)", color: "#27a0c9" }}
                            >
                              {u.name
                                .split(" ")
                                .map((w) => w[0])
                                .slice(0, 2)
                                .join("")
                                .toUpperCase()}
                            </div>
                            <div className="min-w-0">
                              <p className="font-medium text-gray-900 truncate leading-snug">
                                {u.name}
                                {isSelf && (
                                  <span className="ml-1.5 text-[10px] font-semibold text-[#27a0c9]">
                                    (vos)
                                  </span>
                                )}
                              </p>
                              <p className="text-xs text-gray-400 truncate">{u.email || "—"}</p>
                            </div>
                          </div>
                        </td>

                        {/* CUIT */}
                        <td className="px-4 py-3.5 hidden md:table-cell">
                          <span className="font-mono text-xs text-gray-600">
                            {formatCuit(u.cuit)}
                          </span>
                        </td>

                        {/* Role */}
                        <td className="px-4 py-3.5">
                          <span
                            className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-md"
                            style={{ background: roleBadge.bg, color: roleBadge.text }}
                          >
                            <RoleIcon size={11} />
                            {u.role}
                          </span>
                        </td>

                        {/* Tier */}
                        <td className="px-4 py-3.5 hidden sm:table-cell">
                          <span
                            className="text-xs font-semibold px-2 py-1 rounded-md"
                            style={{ background: tierBadge.bg, color: tierBadge.text }}
                          >
                            {u.subscriptionTier}
                          </span>
                        </td>

                        {/* Status */}
                        <td className="px-4 py-3.5 hidden lg:table-cell">
                          <div className="flex items-center gap-1.5">
                            <span
                              className="w-2 h-2 rounded-full flex-shrink-0"
                              style={{ background: statusColor }}
                            />
                            <span className="text-xs text-gray-600">
                              {u.subscriptionStatus}
                            </span>
                          </div>
                        </td>

                        {/* Counts */}
                        <td className="px-4 py-3.5 hidden xl:table-cell">
                          <span className="text-xs text-gray-500">
                            {u._count.afipCerts} / {u._count.uploadSessions}
                          </span>
                        </td>

                        {/* Created */}
                        <td className="px-4 py-3.5 hidden lg:table-cell">
                          <span className="text-xs text-gray-500">
                            {formatDate(u.createdAt)}
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="px-4 py-3.5">
                          <button
                            onClick={(e) => {
                              const rect = e.currentTarget.getBoundingClientRect();
                              setMenuPos({ top: rect.bottom + 4, left: rect.right - 208 });
                              setMenuUserId(menuUserId === u.id ? null : u.id);
                            }}
                            className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
                          >
                            <MoreVertical size={15} />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100">
              <p className="text-xs text-gray-500">
                Pagina {page} de {totalPages}
              </p>
              <div className="flex gap-1">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page <= 1}
                  className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <ChevronLeft size={15} />
                </button>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page >= totalPages}
                  className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <ChevronRight size={15} />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Action menu (rendered outside table to avoid overflow clipping) */}
        {menuUserId !== null && (() => {
          const u = users.find((u) => u.id === menuUserId);
          if (!u) return null;
          const isSelf = u.id === currentUser?.localUserId;
          return (
            <>
              <div className="fixed inset-0 z-[90]" onClick={() => setMenuUserId(null)} />
              <div
                ref={menuRef}
                className="fixed z-[91] w-52 bg-white rounded-xl border border-gray-100 shadow-xl shadow-black/[0.07] overflow-hidden"
                style={{ top: menuPos.top, left: menuPos.left, animation: "nbMenuIn .15s ease forwards" }}
              >
                {/* Role */}
                <div className="px-3 pt-3 pb-1.5">
                  <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
                    Cambiar rol
                  </p>
                  <div className="flex gap-1">
                    {ROLES.map((r) => (
                      <button
                        key={r}
                        disabled={u.role === r || isSelf}
                        onClick={() => handleRoleChange(u, r)}
                        className={`text-[11px] font-medium px-2 py-1 rounded-md transition-colors ${
                          u.role === r
                            ? "bg-gray-100 text-gray-400 cursor-default"
                            : isSelf
                              ? "text-gray-300 cursor-not-allowed"
                              : "text-gray-600 hover:bg-gray-100"
                        }`}
                      >
                        {r}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mx-3 my-1.5 h-px bg-gray-50" />

                {/* Tier */}
                <div className="px-3 pb-1.5">
                  <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
                    Cambiar plan
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {TIERS.map((t) => (
                      <button
                        key={t}
                        disabled={u.subscriptionTier === t}
                        onClick={() => handleTierChange(u, t)}
                        className={`text-[11px] font-medium px-2 py-1 rounded-md transition-colors ${
                          u.subscriptionTier === t
                            ? "bg-gray-100 text-gray-400 cursor-default"
                            : "text-gray-600 hover:bg-gray-100"
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mx-3 my-1.5 h-px bg-gray-50" />

                {/* Status */}
                <div className="px-3 pb-1.5">
                  <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
                    Estado suscripcion
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {STATUSES.map((s) => (
                      <button
                        key={s}
                        disabled={u.subscriptionStatus === s}
                        onClick={() => handleStatusChange(u, s)}
                        className={`text-[11px] font-medium px-2 py-1 rounded-md transition-colors ${
                          u.subscriptionStatus === s
                            ? "bg-gray-100 text-gray-400 cursor-default"
                            : "text-gray-600 hover:bg-gray-100"
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mx-3 my-1.5 h-px bg-gray-50" />

                {/* History */}
                <div className="px-1.5 pb-1.5">
                  <button
                    onClick={() => openHistory(u)}
                    className="w-full flex items-center gap-2 px-2 py-2 text-xs font-medium text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    <History size={13} className="text-gray-400" />
                    Ver historial de pagos
                  </button>
                </div>
              </div>
            </>
          );
        })()}

        {/* Confirmation dialog */}
        {confirm && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/30 backdrop-blur-sm">
            <div
              className="bg-white rounded-2xl border border-gray-100 shadow-2xl w-full max-w-sm mx-4 p-6"
              style={{ animation: "nbMenuIn .15s ease forwards" }}
            >
              <h3 className="db-condensed text-xl font-bold text-gray-900 mb-2">
                Confirmar accion
              </h3>
              <p className="text-sm text-gray-600 mb-6">{confirm.label}</p>
              <div className="flex gap-3">
                <button
                  onClick={() => setConfirm(null)}
                  disabled={actionLoading}
                  className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors disabled:opacity-50"
                >
                  Cancelar
                </button>
                <button
                  onClick={executeConfirm}
                  disabled={actionLoading}
                  className="flex-1 px-4 py-2.5 text-sm font-medium text-white rounded-xl transition-colors disabled:opacity-50"
                  style={{ background: "#27a0c9" }}
                >
                  {actionLoading ? "Aplicando..." : "Confirmar"}
                </button>
              </div>
            </div>
          </div>
        )}
        {/* History slide-over panel */}
        {historyUser && (
          <div className="fixed inset-0 z-[100] flex justify-end">
            <div
              className="absolute inset-0 bg-black/20 backdrop-blur-sm"
              onClick={() => setHistoryUser(null)}
            />
            <div
              className="relative w-full max-w-md bg-white shadow-2xl border-l border-gray-100 flex flex-col"
              style={{ animation: "slideInRight .2s ease forwards" }}
            >
              <style>{`
                @keyframes slideInRight {
                  from { transform: translateX(100%); }
                  to { transform: translateX(0); }
                }
              `}</style>

              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                <div className="min-w-0">
                  <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-0.5">
                    Historial de pagos
                  </p>
                  <p className="text-sm font-semibold text-gray-900 truncate">
                    {historyUser.name}
                  </p>
                </div>
                <button
                  onClick={() => setHistoryUser(null)}
                  className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors flex-shrink-0"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Current status summary */}
              <div className="px-6 py-4 border-b border-gray-50 bg-gray-50/50">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Plan</span>
                    <span
                      className="text-xs font-semibold px-2 py-0.5 rounded-md"
                      style={{
                        background: (TIER_BADGE[historyUser.subscriptionTier] || TIER_BADGE.FREE).bg,
                        color: (TIER_BADGE[historyUser.subscriptionTier] || TIER_BADGE.FREE).text,
                      }}
                    >
                      {historyUser.subscriptionTier}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Estado</span>
                    <div className="flex items-center gap-1">
                      <span
                        className="w-2 h-2 rounded-full"
                        style={{ background: STATUS_DOT[historyUser.subscriptionStatus] || STATUS_DOT.INACTIVE }}
                      />
                      <span className="text-xs text-gray-600">{historyUser.subscriptionStatus}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Timeline */}
              <div className="flex-1 overflow-y-auto px-6 py-4">
                {historyLoading ? (
                  <div className="space-y-4">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <div key={i} className="animate-pulse">
                        <div className="h-3 w-28 bg-gray-100 rounded mb-2" />
                        <div className="h-4 w-full bg-gray-50 rounded" />
                      </div>
                    ))}
                  </div>
                ) : historyEntries.length === 0 ? (
                  <div className="text-center py-12">
                    <History size={24} className="mx-auto text-gray-300 mb-3" />
                    <p className="text-sm text-gray-400">Sin historial de cambios</p>
                  </div>
                ) : (
                  <div className="relative">
                    {/* Timeline line */}
                    <div className="absolute left-[5px] top-2 bottom-2 w-px bg-gray-100" />

                    <div className="space-y-5">
                      {historyEntries.map((entry) => {
                        const tierChanged = entry.previousTier !== entry.newTier;
                        const statusChanged = entry.previousStatus !== entry.newStatus;

                        return (
                          <div key={entry.id} className="relative pl-6">
                            {/* Dot */}
                            <div
                              className="absolute left-0 top-1.5 w-[11px] h-[11px] rounded-full border-2 border-white"
                              style={{
                                background: tierChanged
                                  ? (TIER_BADGE[entry.newTier] || TIER_BADGE.FREE).text
                                  : STATUS_DOT[entry.newStatus] || "#94a3b8",
                              }}
                            />

                            {/* Content */}
                            <p className="text-[11px] text-gray-400 mb-1">
                              {formatDateTime(entry.createdAt)}
                            </p>

                            <div className="bg-gray-50 rounded-lg px-3 py-2.5 space-y-1.5">
                              {tierChanged && (
                                <div className="flex items-center gap-1.5 text-xs">
                                  <span className="text-gray-500">Plan:</span>
                                  <span
                                    className="font-semibold px-1.5 py-0.5 rounded"
                                    style={{
                                      background: (TIER_BADGE[entry.previousTier || "FREE"] || TIER_BADGE.FREE).bg,
                                      color: (TIER_BADGE[entry.previousTier || "FREE"] || TIER_BADGE.FREE).text,
                                    }}
                                  >
                                    {entry.previousTier || "—"}
                                  </span>
                                  <ArrowRightIcon size={11} className="text-gray-300" />
                                  <span
                                    className="font-semibold px-1.5 py-0.5 rounded"
                                    style={{
                                      background: (TIER_BADGE[entry.newTier] || TIER_BADGE.FREE).bg,
                                      color: (TIER_BADGE[entry.newTier] || TIER_BADGE.FREE).text,
                                    }}
                                  >
                                    {entry.newTier}
                                  </span>
                                </div>
                              )}

                              {statusChanged && (
                                <div className="flex items-center gap-1.5 text-xs">
                                  <span className="text-gray-500">Estado:</span>
                                  <span className="text-gray-600">{entry.previousStatus || "—"}</span>
                                  <ArrowRightIcon size={11} className="text-gray-300" />
                                  <div className="flex items-center gap-1">
                                    <span
                                      className="w-1.5 h-1.5 rounded-full"
                                      style={{ background: STATUS_DOT[entry.newStatus] || "#94a3b8" }}
                                    />
                                    <span className="text-gray-700 font-medium">{entry.newStatus}</span>
                                  </div>
                                </div>
                              )}

                              {entry.reason && (
                                <p className="text-[11px] text-gray-400 mt-1">
                                  {entry.reason}
                                </p>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </RequirePermission>
  );
}

export default function AdminUsuarios() {
  return (
    <Suspense fallback={null}>
      <AdminUsuariosContent />
    </Suspense>
  );
}
