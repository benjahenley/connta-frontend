import Link from "next/link";
import { ArrowRight, BadgeCheck, ShieldAlert } from "lucide-react";
import styles from "./facturacion.module.css";

export function NoCertificatesState() {
  return (
    <div className={`${styles.anim} ${styles.a2}`}>
      <div
        className="rounded-2xl p-8 sm:p-10 text-center"
        style={{
          background: "white",
          border: "1px solid #fde68a",
        }}>
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5"
          style={{ background: "rgba(245,158,11,.1)" }}>
          <ShieldAlert className="w-8 h-8" style={{ color: "#f59e0b" }} />
        </div>
        <h2 className={`${styles.condensed} text-xl sm:text-2xl font-bold text-gray-900 mb-2`}>
          No tenés certificados activos
        </h2>
        <p className={`${styles.sora} text-sm text-gray-500 max-w-md mx-auto mb-6 leading-relaxed`}>
          Para generar facturas electrónicas necesitás al menos un certificado
          ARCA activo. Creá uno desde la sección de certificados y después volvé
          acá.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/mis-certificados/configurar"
            className="inline-flex w-full sm:w-auto justify-center items-center gap-2 px-5 py-2.5 rounded-xl text-white font-semibold text-sm transition-all hover:brightness-110"
            style={{ background: "#27a0c9" }}>
            <BadgeCheck className="w-4 h-4" />
            Crear certificado
          </Link>
          <Link
            href="/mis-certificados"
            className="inline-flex w-full sm:w-auto justify-center items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors"
            style={{ background: "rgba(0,0,0,.04)" }}>
            Ver mis certificados
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
