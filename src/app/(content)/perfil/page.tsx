"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/providers/AuthProvider";
import { PageHeader } from "@/components/ui/PageHeader";
import { authService } from "@/services/auth";
import { SUBSCRIPTION_TIERS, SubscriptionTier } from "@/types/auth";
import {
  User as UserIcon,
  Mail,
  Hash,
  Crown,
  LogOut,
  Trash2,
  AlertTriangle,
  Loader2,
} from "lucide-react";

const CONFIRMATION_PHRASE = "ELIMINAR";

const formatCuit = (cuit?: string | null) => {
  if (!cuit) return "—";
  const digits = cuit.replace(/\D/g, "");
  return digits.length === 11
    ? `${digits.slice(0, 2)}-${digits.slice(2, 10)}-${digits.slice(10)}`
    : cuit;
};

export default function PerfilPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [signingOut, setSigningOut] = useState(false);
  const [confirmInput, setConfirmInput] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const handleSignOut = async () => {
    setSigningOut(true);
    try {
      await authService.signOut();
      router.push("/auth/sign-in");
    } catch (e) {
      console.error(e);
      setSigningOut(false);
    }
  };

  const handleDelete = async () => {
    if (confirmInput !== CONFIRMATION_PHRASE) return;
    setDeleting(true);
    setDeleteError(null);
    try {
      await authService.deleteAccount(CONFIRMATION_PHRASE);
      router.push("/");
    } catch (e) {
      setDeleteError(e instanceof Error ? e.message : "No se pudo eliminar la cuenta");
      setDeleting(false);
    }
  };

  const tierName = SUBSCRIPTION_TIERS[user?.subscriptionTier || SubscriptionTier.FREE].name;
  const initials =
    user?.name
      ?.split(" ")
      .map((w) => w[0])
      .slice(0, 2)
      .join("")
      .toUpperCase() || "U";

  const canDelete = confirmInput === CONFIRMATION_PHRASE && !deleting;

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6 sm:py-8 max-w-4xl mx-auto w-full">
      <PageHeader
        eyebrow="Cuenta"
        title="Perfil"
        description="Información de tu cuenta y opciones de gestión."
        icon={UserIcon}
      />

      {/* User card */}
      <div className="mt-8 bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
        <div className="px-5 py-5 sm:px-6 sm:py-6 border-b border-gray-100 flex items-center gap-4">
          <div
            className="w-14 h-14 rounded-full flex items-center justify-center text-base font-semibold flex-shrink-0"
            style={{ background: "rgba(39,160,201,.12)", color: "#27a0c9" }}>
            {initials}
          </div>
          <div className="min-w-0">
            <p className="text-base font-semibold text-gray-900 truncate">
              {user?.name || "Usuario"}
            </p>
            <p className="text-sm text-gray-500 truncate">{user?.email || "—"}</p>
          </div>
        </div>

        <dl className="divide-y divide-gray-100">
          <InfoRow icon={Mail} label="Email" value={user?.email || "—"} />
          <InfoRow icon={Hash} label="CUIT" value={formatCuit(user?.cuit)} mono />
          <InfoRow icon={Crown} label="Plan" value={tierName} />
        </dl>
      </div>

      {/* Sign out */}
      <div className="mt-6 bg-white border border-gray-100 rounded-2xl shadow-sm px-5 py-4 sm:px-6 sm:py-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-gray-900">Cerrar sesión</p>
          <p className="text-xs text-gray-500 mt-0.5">
            Salir de tu cuenta en este dispositivo.
          </p>
        </div>
        <button
          onClick={handleSignOut}
          disabled={signingOut}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-60">
          {signingOut ? (
            <Loader2 size={14} className="animate-spin" />
          ) : (
            <LogOut size={14} />
          )}
          Cerrar sesión
        </button>
      </div>

      {/* Danger zone */}
      <div
        className="mt-6 rounded-2xl overflow-hidden border"
        style={{ borderColor: "#fecaca", background: "#fff7f7" }}>
        <div className="px-5 py-4 sm:px-6 sm:py-5 border-b" style={{ borderColor: "#fecaca" }}>
          <div className="flex items-start gap-3">
            <div
              className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ background: "rgba(220,38,38,0.10)", color: "#dc2626" }}>
              <AlertTriangle size={16} />
            </div>
            <div>
              <p className="text-sm font-semibold" style={{ color: "#991b1b" }}>
                Zona peligrosa
              </p>
              <p className="text-xs mt-0.5" style={{ color: "#7f1d1d" }}>
                Eliminar tu cuenta borra permanentemente tus certificados, facturas,
                historial y configuración. Esta acción es irreversible y el CUIT no
                podrá usarse nuevamente para crear otra cuenta.
              </p>
            </div>
          </div>
        </div>

        <div className="px-5 py-5 sm:px-6 sm:py-6 space-y-3">
          <label className="block">
            <span className="text-xs font-medium text-gray-600">
              Para confirmar, escribí{" "}
              <span className="font-mono font-semibold text-gray-900">
                {CONFIRMATION_PHRASE}
              </span>{" "}
              abajo.
            </span>
            <input
              type="text"
              value={confirmInput}
              onChange={(e) => setConfirmInput(e.target.value)}
              placeholder={CONFIRMATION_PHRASE}
              autoComplete="off"
              className="mt-1.5 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-mono focus:border-red-400 focus:outline-none focus:ring-2 focus:ring-red-100"
            />
          </label>

          {deleteError ? (
            <p className="text-xs" style={{ color: "#b91c1c" }}>
              {deleteError}
            </p>
          ) : null}

          <button
            onClick={handleDelete}
            disabled={!canDelete}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ background: canDelete ? "#dc2626" : "#fca5a5" }}>
            {deleting ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              <Trash2 size={14} />
            )}
            Eliminar cuenta
          </button>
        </div>
      </div>
    </div>
  );
}

type InfoRowProps = {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  label: string;
  value: string;
  mono?: boolean;
};

function InfoRow({ icon: Icon, label, value, mono }: InfoRowProps) {
  return (
    <div className="px-5 sm:px-6 py-3.5 flex items-center justify-between gap-4">
      <div className="flex items-center gap-2 text-gray-500">
        <Icon size={14} className="text-gray-400" />
        <span className="text-xs uppercase tracking-wider font-medium">{label}</span>
      </div>
      <span
        className={`text-sm text-gray-800 truncate ${mono ? "font-mono" : "font-medium"}`}>
        {value}
      </span>
    </div>
  );
}
