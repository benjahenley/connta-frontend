"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { authService } from "@/services/auth";
import { supabase } from "@/lib/supabase";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  ArrowLeft,
  Mail,
  User,
  Lock,
  CheckCircle,
  RefreshCw,
  Eye,
  EyeOff,
  Copy,
  Check,
} from "lucide-react";

type Direction = "forward" | "back";

const SIGNUP_STORAGE_KEY = "signup_progress";
const OTP_TTL_MS = 60 * 60 * 1000; // 1 hour — matches Supabase default OTP expiry

type SignupProgress = {
  email: string;
  name: string;
  cuit: string;
  otpSentAt: number;
  step: number;
};

function saveProgress(progress: SignupProgress) {
  sessionStorage.setItem(SIGNUP_STORAGE_KEY, JSON.stringify(progress));
}

function clearProgress() {
  sessionStorage.removeItem(SIGNUP_STORAGE_KEY);
}

const PASSWORD_SYMBOLS = "!@#$%^&*()-_=+[]{};:,.?/|";
const PASSWORD_REQUIREMENTS = [
  "12+ caracteres",
  "una mayúscula",
  "una minúscula",
  "un número",
  "un símbolo",
];

function getPasswordChecks(password: string) {
  return {
    length: password.length >= 12,
    upper: /[A-Z]/.test(password),
    lower: /[a-z]/.test(password),
    number: /\d/.test(password),
    symbol: new RegExp(
      `[${PASSWORD_SYMBOLS.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}]`,
    ).test(password),
  };
}

function getPasswordStrength(password: string) {
  const checks = getPasswordChecks(password);
  const passed = Object.values(checks).filter(Boolean).length;

  if (!password) {
    return { score: 0, label: "", color: "#e2e8f0" };
  }
  if (passed <= 1) {
    return { score: 1, label: "Muy débil", color: "#ef4444" };
  }
  if (passed === 2) {
    return { score: 2, label: "Débil", color: "#f97316" };
  }
  if (passed === 3) {
    return { score: 3, label: "Regular", color: "#f59e0b" };
  }
  if (passed === 4) {
    return { score: 4, label: "Fuerte", color: "#22c55e" };
  }
  if (password.length >= 16) {
    return { score: 6, label: "Inhackeable", color: "#0f766e" };
  }
  return { score: 5, label: "Muy fuerte", color: "#10b981" };
}

function generateStrongPassword(length = 18) {
  const upper = "ABCDEFGHJKLMNPQRSTUVWXYZ";
  const lower = "abcdefghijkmnopqrstuvwxyz";
  const numbers = "23456789";
  const symbols = PASSWORD_SYMBOLS;
  const allChars = upper + lower + numbers + symbols;
  const randomIndex = (max: number) => {
    const values = new Uint32Array(1);
    crypto.getRandomValues(values);
    return values[0] % max;
  };
  const requiredChars = [
    upper[randomIndex(upper.length)],
    lower[randomIndex(lower.length)],
    numbers[randomIndex(numbers.length)],
    symbols[randomIndex(symbols.length)],
  ];

  while (requiredChars.length < length) {
    requiredChars.push(allChars[randomIndex(allChars.length)]);
  }

  for (let i = requiredChars.length - 1; i > 0; i -= 1) {
    const j = randomIndex(i + 1);
    [requiredChars[i], requiredChars[j]] = [requiredChars[j], requiredChars[i]];
  }

  return requiredChars.join("");
}

export default function SignUpPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState<Direction>("forward");
  const [animKey, setAnimKey] = useState(0);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [cuit, setCuit] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPasswords, setShowPasswords] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [emailTaken, setEmailTaken] = useState(false);
  const [copied, setCopied] = useState(false);

  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  // On mount: guard — check Supabase session first, then sessionStorage fallback.
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user?.email_confirmed_at) {
        // OTP confirmed, session alive → go straight to step 3
        setEmail(session.user.email ?? "");
        setName(session.user.user_metadata?.name ?? "");
        setCuit(session.user.user_metadata?.cuit ?? "");
        setStep(3);
        return;
      }

      // No live session — fall back to sessionStorage for step 2 restore
      try {
        const raw = sessionStorage.getItem(SIGNUP_STORAGE_KEY);
        if (!raw) return;
        const saved: SignupProgress = JSON.parse(raw);
        if (Date.now() - saved.otpSentAt > OTP_TTL_MS) {
          clearProgress();
          return;
        }
        setEmail(saved.email);
        setName(saved.name);
        setCuit(saved.cuit ?? "");
        if (saved.step === 2) {
          setDirection("forward");
          setAnimKey((k) => k + 1);
          setStep(2);
        }
      } catch {
        clearProgress();
      }
    });
  }, []);

  const hasConfirmPassword = confirmPassword.length > 0;
  const passwordsMatch = hasConfirmPassword && password === confirmPassword;
  const passwordChecks = getPasswordChecks(password);
  const passedPasswordChecks =
    Object.values(passwordChecks).filter(Boolean).length;
  const isPasswordStrongEnough = Object.values(passwordChecks).every(Boolean);
  const passwordStrength = getPasswordStrength(password);

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const next = [...otp];
    next[index] = value.slice(-1);
    setOtp(next);
    if (value && index < 5) otpRefs.current[index + 1]?.focus();
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);
    if (!pasted) return;
    const next = [...otp];
    pasted.split("").forEach((ch, i) => {
      next[i] = ch;
    });
    setOtp(next);
    otpRefs.current[Math.min(pasted.length, 5)]?.focus();
  };

  const goTo = (nextStep: number, dir: Direction) => {
    setDirection(dir);
    setAnimKey((k) => k + 1);
    setStep(nextStep);
    setError("");
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setEmailTaken(false);
    try {
      // Check auth.users for this email before doing anything
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      if (apiUrl) {
        const res = await fetch(
          `${apiUrl}/user/otp-status/${encodeURIComponent(email)}`,
        );
        if (res.ok) {
          const { codeSentAt, codeConfirmed } = await res.json();
          const sentRecently =
            codeSentAt &&
            Date.now() - new Date(codeSentAt).getTime() < OTP_TTL_MS;

          if (codeConfirmed) {
            // OTP already confirmed — check if session is alive and go to step 3
            const {
              data: { session },
            } = await supabase.auth.getSession();
            if (session?.user?.email_confirmed_at) {
              goTo(3, "forward");
              return;
            }
          }

          if (sentRecently && !codeConfirmed) {
            // Code was sent recently but not confirmed → go to step 2, skip sending
            saveProgress({
              email,
              name,
              cuit,
              otpSentAt: new Date(codeSentAt).getTime(),
              step: 2,
            });
            goTo(2, "forward");
            return;
          }
        }
      }

      await authService.sendOtp(email);
      saveProgress({ email, name, cuit, otpSentAt: Date.now(), step: 2 });
      goTo(2, "forward");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "";
      if (msg === "EMAIL_ALREADY_REGISTERED") {
        setEmailTaken(true);
      } else {
        setError(msg || "Error al enviar el código");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = otp.join("");
    if (token.length < 6) {
      setError("Ingresá los 6 dígitos del código");
      return;
    }
    setIsLoading(true);
    setError("");
    try {
      await authService.verifyEmailOtp(email, token);
      const existing = sessionStorage.getItem(SIGNUP_STORAGE_KEY);
      if (existing) {
        const saved: SignupProgress = JSON.parse(existing);
        saveProgress({ ...saved, step: 3 });
      }
      goTo(3, "forward");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Código incorrecto");
    } finally {
      setIsLoading(false);
    }
  };

  const handleComplete = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isPasswordStrongEnough) {
      setError(
        `La contraseña debe incluir ${PASSWORD_REQUIREMENTS.join(", ")}`,
      );
      return;
    }
    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }
    setIsLoading(true);
    setError("");
    try {
      await authService.completeSignUp(name, password, email, cuit);
      clearProgress();
      goTo(4, "forward");
      setTimeout(() => router.push("/dashboard"), 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al crear la cuenta");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGeneratePassword = () => {
    const nextPassword = generateStrongPassword();
    setPassword(nextPassword);
    setConfirmPassword(nextPassword);
    setShowPasswords(true);
    setError("");
  };

  const handleCopyPassword = () => {
    if (!password) return;
    navigator.clipboard.writeText(password);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const stepLabels = ["Tus datos", "Verificá tu email", "Creá tu contraseña"];
  const formattedCuit =
    cuit.length === 11
      ? `${cuit.slice(0, 2)}-${cuit.slice(2, 10)}-${cuit.slice(10)}`
      : cuit;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,700;1,9..144,400&family=DM+Sans:wght@400;500;600&display=swap');
        .auth-font-display { font-family: 'Fraunces', serif; }
        .auth-font-body    { font-family: 'DM Sans', sans-serif; }

        .auth-bg {
          background-color: #080f16;
          background-image:
            radial-gradient(ellipse at 80% 40%, rgba(39,160,201,0.18) 0%, transparent 55%),
            radial-gradient(ellipse at 10% 80%, rgba(16,185,129,0.10) 0%, transparent 50%);
        }
        .auth-grid {
          background-image:
            linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px);
          background-size: 64px 64px;
        }

        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(40px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes slideInLeft {
          from { opacity: 0; transform: translateX(-40px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes cardUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes successPop {
          0%   { transform: scale(0.5); opacity: 0; }
          70%  { transform: scale(1.1); }
          100% { transform: scale(1); opacity: 1; }
        }

        .slide-forward { animation: slideInRight 0.38s cubic-bezier(0.25, 0.46, 0.45, 0.94) both; }
        .slide-back    { animation: slideInLeft  0.38s cubic-bezier(0.25, 0.46, 0.45, 0.94) both; }
        .card-enter    { animation: cardUp 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) both; }
        .success-pop   { animation: successPop 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) both; }

        .auth-input {
          display: block;
          width: 100%;
          border-radius: 10px;
          border: 1.5px solid #e2e8f0;
          background: #f8fafc;
          padding: 11px 14px;
          font-size: 0.9rem;
          color: #0f172a;
          transition: all 0.15s ease;
          outline: none;
          font-family: 'DM Sans', sans-serif;
        }
        .auth-input::placeholder { color: #94a3b8; }
        .auth-input:focus {
          background: #fff;
          border-color: #27a0c9;
          box-shadow: 0 0 0 3px rgba(39,160,201,0.12);
        }

        .helper-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          border: 1px solid rgba(39,160,201,0.22);
          border-radius: 9999px;
          background: rgba(39,160,201,0.08);
          color: #1e7a9c;
          padding: 6px 10px;
          font-size: 0.75rem;
          font-weight: 600;
          transition: all 0.15s ease;
        }
        .helper-btn:hover {
          background: rgba(39,160,201,0.14);
          border-color: rgba(39,160,201,0.34);
        }

        .helper-btn.secondary {
          background: transparent;
          color: #6b7280;
          border-color: #dbe3ef;
        }
        .helper-btn.secondary:hover {
          background: #f8fafc;
          border-color: #cbd5e1;
        }

        .password-hint {
          font-size: 0.75rem;
          line-height: 1.45;
          color: #6b7280;
        }

        .otp-grid {
          display: grid;
          grid-template-columns: repeat(6, minmax(0, 1fr));
          gap: 8px;
          width: 100%;
          align-items: stretch;
        }

        .otp-box {
          width: 100%;
          aspect-ratio: 1 / 1;
          min-height: 52px;
          border-radius: 10px;
          border: 1.5px solid #e2e8f0;
          background: #f8fafc;
          font-size: 1.4rem;
          font-weight: 700;
          text-align: center;
          color: #0f172a;
          font-family: 'DM Sans', sans-serif;
          transition: all 0.15s ease;
          outline: none;
          caret-color: #27a0c9;
        }
        .otp-box:focus {
          border-color: #27a0c9;
          background: #fff;
          box-shadow: 0 0 0 3px rgba(39,160,201,0.12);
        }
        .otp-box.filled {
          border-color: #27a0c9;
          background: #eff9fd;
          color: #27a0c9;
        }

        @media (min-width: 640px) {
          .otp-grid { gap: 12px; }
        }

        .auth-btn {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 12px 20px;
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
        .auth-btn:hover:not(:disabled) {
          background: #1e7a9c;
          transform: translateY(-1px);
          box-shadow: 0 6px 20px rgba(39,160,201,0.35);
        }
        .auth-btn:disabled { opacity: 0.6; cursor: not-allowed; }

        .step-dot {
          width: 8px; height: 8px;
          border-radius: 9999px;
          transition: all 0.3s ease;
        }
        .step-dot.active  { width: 24px; background: #27a0c9; }
        .step-dot.done    { background: #10b981; }
        .step-dot.pending { background: #e2e8f0; }
      `}</style>

      <div className="auth-bg auth-font-body min-h-screen flex items-center justify-center px-4 py-12 relative overflow-hidden">
        <div className="auth-grid absolute inset-0 pointer-events-none" />

        <div className="card-enter relative z-10 w-full max-w-md">
          <div
            className="bg-white rounded-2xl px-8 py-10 sm:px-10 sm:py-12"
            style={{ boxShadow: "0 32px 80px rgba(0,0,0,0.4)" }}>
            <div className="flex justify-center mb-6">
              <Link href="/">
                <Image
                  src="/logo-connta.svg"
                  alt="Connta"
                  width={100}
                  height={100}
                />
              </Link>
            </div>

            {step <= 3 && (
              <div className="mb-8">
                <div className="flex items-center justify-center gap-2 mb-3">
                  {[1, 2, 3].map((s) => (
                    <div
                      key={s}
                      className={`step-dot ${s === step ? "active" : s < step ? "done" : "pending"}`}
                    />
                  ))}
                </div>
                <p
                  className="text-center text-xs font-semibold uppercase tracking-widest"
                  style={{ color: "#27a0c9" }}>
                  Paso {step} de 3 — {stepLabels[step - 1]}
                </p>
              </div>
            )}

            {emailTaken && (
              <div className="mb-5 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                Este email ya tiene una cuenta registrada.{" "}
                <button
                  onClick={() => router.push("/auth/sign-in")}
                  className="font-semibold underline underline-offset-4 hover:no-underline">
                  Iniciá sesión acá →
                </button>
              </div>
            )}

            {error && step !== 3 && (
              <div className="mb-5 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            {step === 1 && (
              <div
                key={`step-${animKey}`}
                className={
                  direction === "forward" ? "slide-forward" : "slide-back"
                }>
                <div className="mb-6">
                  <h1 className="auth-font-display text-3xl font-bold text-gray-900 mb-1">
                    Crear cuenta
                  </h1>
                  <p className="text-sm" style={{ color: "#6b7280" }}>
                    Te enviaremos un código a tu email para verificar tu
                    identidad.
                  </p>
                </div>
                <form onSubmit={handleSendOtp} className="space-y-4">
                  <div className="space-y-1.5">
                    <label
                      className="block text-sm font-semibold"
                      style={{ color: "#374151" }}>
                      <span className="flex items-center gap-1.5">
                        <User className="h-3.5 w-3.5" /> Nombre
                      </span>
                    </label>
                    <input
                      type="text"
                      required
                      autoComplete="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Tu nombre completo"
                      className="auth-input"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label
                      className="block text-sm font-semibold"
                      style={{ color: "#374151" }}>
                      <span className="flex items-center gap-1.5">
                        <Mail className="h-3.5 w-3.5" /> Email
                      </span>
                    </label>
                    <input
                      type="email"
                      required
                      autoComplete="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        setEmailTaken(false);
                      }}
                      placeholder="tu@email.com"
                      className="auth-input"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label
                      className="block text-sm font-semibold"
                      style={{ color: "#374151" }}>
                      <span className="flex items-center gap-1.5"># CUIT</span>
                    </label>
                    <input
                      type="text"
                      required
                      inputMode="numeric"
                      value={formattedCuit}
                      onChange={(e) =>
                        setCuit(e.target.value.replace(/\D/g, "").slice(0, 11))
                      }
                      placeholder="20-12345678-9"
                      className="auth-input"
                    />
                  </div>
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isLoading || cuit.length !== 11}
                      className="auth-btn">
                      {isLoading ? (
                        "Enviando código..."
                      ) : (
                        <>
                          Enviar código <ArrowRight className="h-4 w-4" />
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {step === 2 && (
              <div
                key={`step-${animKey}`}
                className={
                  direction === "forward" ? "slide-forward" : "slide-back"
                }>
                <div className="mb-6">
                  <h1 className="auth-font-display text-3xl font-bold text-gray-900 mb-1">
                    Revisá tu email
                  </h1>
                  <p className="text-sm" style={{ color: "#6b7280" }}>
                    Enviamos un código de 6 dígitos a{" "}
                    <span
                      className="font-semibold"
                      style={{ color: "#374151" }}>
                      {email}
                    </span>
                  </p>
                </div>
                <form onSubmit={handleVerifyOtp} className="space-y-6">
                  <div className="otp-grid" onPaste={handleOtpPaste}>
                    {otp.map((digit, i) => (
                      <input
                        key={i}
                        ref={(el) => {
                          otpRefs.current[i] = el;
                        }}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOtpChange(i, e.target.value)}
                        onKeyDown={(e) => handleOtpKeyDown(i, e)}
                        className={`otp-box ${digit ? "filled" : ""}`}
                      />
                    ))}
                  </div>
                  <button
                    type="submit"
                    disabled={isLoading || otp.join("").length < 6}
                    className="auth-btn">
                    {isLoading ? (
                      "Verificando..."
                    ) : (
                      <>
                        Verificar código <ArrowRight className="h-4 w-4" />
                      </>
                    )}
                  </button>
                </form>
                <div className="mt-5 flex items-center justify-between text-sm">
                  <button
                    onClick={() => {
                      clearProgress();
                      goTo(1, "back");
                    }}
                    className="flex items-center gap-1 font-medium hover:underline"
                    style={{ color: "#6b7280" }}>
                    <ArrowLeft className="h-3.5 w-3.5" /> Cambiar email
                  </button>
                  <button
                    onClick={async () => {
                      setError("");
                      await authService.sendOtp(email);
                    }}
                    className="font-semibold hover:underline"
                    style={{ color: "#27a0c9" }}>
                    Reenviar código
                  </button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div
                key={`step-${animKey}`}
                className={
                  direction === "forward" ? "slide-forward" : "slide-back"
                }>
                <div className="mb-6">
                  <h1 className="auth-font-display text-3xl font-bold text-gray-900 mb-1">
                    Creá tu contraseña
                  </h1>
                  <p className="text-sm" style={{ color: "#6b7280" }}>
                    Ya verificamos tu email. Elegí una contraseña segura para tu
                    cuenta.
                  </p>
                </div>
                <form onSubmit={handleComplete} className="space-y-4">
                  <div className="space-y-1.5">
                    <div className="flex items-start justify-between gap-3">
                      <label
                        className="block text-sm font-semibold"
                        style={{ color: "#374151" }}>
                        <span className="flex items-center gap-1.5">
                          <Lock className="h-3.5 w-3.5" /> Contraseña
                        </span>
                      </label>
                      <div className="hidden sm:flex items-center gap-2">
                        <button
                          type="button"
                          onClick={handleGeneratePassword}
                          className="helper-btn">
                          <RefreshCw className="h-3.5 w-3.5" /> Generar segura
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            setShowPasswords((current) => !current)
                          }
                          className="helper-btn secondary">
                          {showPasswords ? (
                            <EyeOff className="h-3.5 w-3.5" />
                          ) : (
                            <Eye className="h-3.5 w-3.5" />
                          )}
                          {showPasswords ? "Ocultar" : "Mostrar"}
                        </button>
                      </div>
                    </div>
                    <div className="relative">
                      <input
                        type={showPasswords ? "text" : "password"}
                        required
                        autoComplete="new-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="12+ caracteres, mayúscula, número y símbolo"
                        className="auth-input"
                        style={{ paddingRight: "2.5rem" }}
                      />
                      <button
                        type="button"
                        onClick={handleCopyPassword}
                        disabled={!password}
                        title={copied ? "Copiado" : "Copiar contraseña"}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 disabled:opacity-30 transition-colors cursor-pointer disabled:cursor-default">
                        {copied ? (
                          <Check
                            className="h-4 w-4"
                            style={{ color: "#10b981" }}
                          />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                    <div className="flex sm:hidden items-center gap-2">
                      <button
                        type="button"
                        onClick={handleGeneratePassword}
                        className="helper-btn">
                        <RefreshCw className="h-3.5 w-3.5" /> Generar segura
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowPasswords((current) => !current)}
                        className="helper-btn secondary">
                        {showPasswords ? (
                          <EyeOff className="h-3.5 w-3.5" />
                        ) : (
                          <Eye className="h-3.5 w-3.5" />
                        )}
                        {showPasswords ? "Ocultar" : "Mostrar"}
                      </button>
                    </div>
                    <p className="password-hint">
                      Requisitos: {PASSWORD_REQUIREMENTS.join(", ")}.
                    </p>
                  </div>
                  <div className="space-y-1.5">
                    <label
                      className="block text-sm font-semibold"
                      style={{ color: "#374151" }}>
                      <span className="flex items-center gap-1.5">
                        <Lock className="h-3.5 w-3.5" /> Confirmar contraseña
                      </span>
                    </label>
                    <input
                      type={showPasswords ? "text" : "password"}
                      required
                      autoComplete="new-password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Repetí la contraseña"
                      className="auth-input"
                    />
                  </div>
                  {password.length > 0 && (
                    <div className="pt-1">
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5, 6].map((lvl) => (
                          <div
                            key={lvl}
                            className="flex-1 h-1 rounded-full transition-all duration-300"
                            style={{
                              background:
                                passwordStrength.score >= lvl
                                  ? passwordStrength.color
                                  : "#e2e8f0",
                            }}
                          />
                        ))}
                        <span
                          className="ml-2 text-xs font-medium"
                          style={{ color: passwordStrength.color }}>
                          {passwordStrength.label}
                        </span>
                      </div>
                      <p className="mt-2 text-xs" style={{ color: "#6b7280" }}>
                        {passedPasswordChecks}/
                        {Object.keys(passwordChecks).length} reglas cumplidas
                      </p>
                      {hasConfirmPassword && (
                        <p
                          className="mt-2 text-xs font-medium"
                          style={{
                            color: passwordsMatch ? "#10b981" : "#dc2626",
                          }}>
                          {passwordsMatch
                            ? "Las contraseñas coinciden"
                            : "Las contraseñas no coinciden"}
                        </p>
                      )}
                    </div>
                  )}
                  {error && (
                    <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
                      {error}
                    </div>
                  )}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={
                        isLoading || !isPasswordStrongEnough || !passwordsMatch
                      }
                      className="auth-btn">
                      {isLoading ? (
                        "Creando cuenta..."
                      ) : (
                        <>
                          Crear cuenta <ArrowRight className="h-4 w-4" />
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {step === 4 && (
              <div className="slide-forward text-center py-4">
                <div className="flex justify-center mb-5">
                  <div
                    className="success-pop h-20 w-20 rounded-full flex items-center justify-center"
                    style={{
                      background: "linear-gradient(135deg, #10b981, #059669)",
                    }}>
                    <CheckCircle className="h-10 w-10 text-white" />
                  </div>
                </div>
                <h2 className="auth-font-display text-3xl font-bold text-gray-900 mb-2">
                  ¡Bienvenido!
                </h2>
                <p className="text-sm mb-1" style={{ color: "#6b7280" }}>
                  Tu cuenta fue creada exitosamente.
                </p>
                <p className="text-xs" style={{ color: "#94a3b8" }}>
                  Redirigiendo al dashboard...
                </p>
              </div>
            )}

            {step <= 3 && (
              <div className="mt-6 text-center">
                <p className="text-sm" style={{ color: "#6b7280" }}>
                  ¿Ya tenés cuenta?{" "}
                  <button
                    onClick={() => router.push("/auth/sign-in")}
                    className="font-semibold underline underline-offset-4 hover:no-underline"
                    style={{ color: "#27a0c9" }}>
                    Iniciá sesión acá
                  </button>
                </p>
              </div>
            )}
          </div>

          <div className="mt-5 text-center">
            <Link
              href="/"
              className="text-sm hover:underline transition-colors"
              style={{ color: "rgba(255,255,255,0.4)" }}>
              ← Volver al inicio
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
