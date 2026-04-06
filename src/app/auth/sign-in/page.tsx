"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authService } from "@/services/auth";
import Image from "next/image";
import Link from "next/link";

export default function SignInPage() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    try {
      const { access_token } = await authService.signIn(formData.email, formData.password);

      // Verify the user exists in the backend DB before navigating
      const meRes = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/me`,
        { headers: { Authorization: `Bearer ${access_token}` } },
      );

      if (!meRes.ok) {
        // User exists in Supabase but not in our DB — sign them out
        await authService.signOut();
        setError(
          "Tu cuenta no está registrada en el sistema. Por favor, registrate nuevamente.",
        );
        return;
      }

      router.push("/dashboard");
    } catch (err) {
      console.error("Sign in error:", err);
      setError(err instanceof Error ? err.message : "Error al iniciar sesión");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleResendConfirmation = async () => {
    if (!formData.email) { setError("Por favor ingresá tu email"); return; }
    try {
      setIsLoading(true);
      const result = await authService.resendConfirmation(formData.email);
      setError("");
      alert(result.message);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al reenviar confirmación");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,700;1,9..144,400&family=DM+Sans:wght@400;500;600&display=swap');
        .auth-font-display { font-family: 'Fraunces', serif; }
        .auth-font-body    { font-family: 'DM Sans', sans-serif; }

        .auth-bg {
          background-color: #080f16;
          background-image:
            radial-gradient(ellipse at 20% 60%, rgba(39,160,201,0.20) 0%, transparent 55%),
            radial-gradient(ellipse at 80% 15%, rgba(16,185,129,0.10) 0%, transparent 50%);
        }

        .auth-grid {
          background-image:
            linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px);
          background-size: 64px 64px;
        }

        @keyframes authFadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .auth-card {
          animation: authFadeUp 0.55s ease both;
        }

        .auth-input {
          display: block;
          width: 100%;
          border-radius: 10px;
          border: 1px solid #e2e8f0;
          background: #f8fafc;
          padding: 10px 14px;
          font-size: 0.875rem;
          color: #0f172a;
          transition: all 0.15s ease;
          outline: none;
          font-family: 'DM Sans', sans-serif;
        }
        .auth-input::placeholder { color: #94a3b8; }
        .auth-input:focus {
          background: #fff;
          border-color: #27a0c9;
          box-shadow: 0 0 0 3px rgba(39,160,201,0.15);
        }

        .auth-btn-primary {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 11px 20px;
          border-radius: 10px;
          background: #27a0c9;
          color: #fff;
          font-size: 0.9rem;
          font-weight: 600;
          border: none;
          cursor: pointer;
          transition: all 0.2s ease;
          font-family: 'DM Sans', sans-serif;
        }
        .auth-btn-primary:hover:not(:disabled) {
          background: #1e7a9c;
          transform: translateY(-1px);
          box-shadow: 0 6px 20px rgba(39,160,201,0.35);
        }
        .auth-btn-primary:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
      `}</style>

      <div className="auth-bg auth-font-body min-h-screen flex items-center justify-center px-4 py-12 relative overflow-hidden">
        <div className="auth-grid absolute inset-0 pointer-events-none" />

        <div className="auth-card relative z-10 w-full max-w-md">
          {/* Card */}
          <div className="bg-white rounded-2xl shadow-2xl px-8 py-10 sm:px-10 sm:py-12"
            style={{ boxShadow: "0 32px 80px rgba(0,0,0,0.4)" }}>

            {/* Header */}
            <div className="flex flex-col items-center text-center mb-8">
              <Link href="/">
                <Image
                  src="/logo-connta.svg"
                  alt="Connta"
                  width={110}
                  height={110}
                  className="mb-5"
                />
              </Link>
              <h1 className="auth-font-display text-3xl font-bold text-gray-900 mb-2">
                Bienvenido de vuelta
              </h1>
              <p className="text-sm" style={{ color: "#6b7280" }}>
                Accedé a tu cuenta de{" "}
                <span style={{ color: "#27a0c9" }} className="font-medium">Connta</span>
              </p>
            </div>

            {/* Error */}
            {error && (
              <div className="mb-6 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
                <p>{error}</p>
                {error.includes("verify your email") && (
                  <button
                    type="button"
                    onClick={handleResendConfirmation}
                    disabled={isLoading}
                    className="mt-2 text-xs font-semibold underline underline-offset-4 hover:no-underline disabled:opacity-50">
                    Reenviar email de confirmación
                  </button>
                )}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-1.5">
                <label htmlFor="email" className="block text-sm font-semibold" style={{ color: "#374151" }}>
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="tu@email.com"
                  className="auth-input"
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="password" className="block text-sm font-semibold" style={{ color: "#374151" }}>
                  Contraseña
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  autoComplete="current-password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="auth-input"
                />
              </div>

              <div className="pt-2">
                <button type="submit" disabled={isLoading} className="auth-btn-primary">
                  {isLoading ? "Iniciando sesión..." : "Iniciar sesión"}
                </button>
              </div>
            </form>

            {/* Footer */}
            <div className="mt-6 text-center">
              <p className="text-sm" style={{ color: "#6b7280" }}>
                ¿No tenés cuenta?{" "}
                <button
                  type="button"
                  onClick={() => router.push("/auth/sign-up")}
                  className="font-semibold underline underline-offset-4 hover:no-underline"
                  style={{ color: "#27a0c9" }}>
                  Registrate acá
                </button>
              </p>
            </div>
          </div>

          {/* Back link */}
          <div className="mt-5 text-center">
            <Link href="/" className="text-sm hover:underline transition-colors"
              style={{ color: "rgba(255,255,255,0.4)" }}>
              ← Volver al inicio
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
