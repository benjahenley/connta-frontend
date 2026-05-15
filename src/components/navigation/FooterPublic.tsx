"use client";

import Image from "next/image";
import Link from "next/link";
import { Mail, MessageCircle, MapPin } from "lucide-react";

const InstagramIcon = ({ size = 14 }: { size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

const productLinks = [
  { label: "Funcionalidades", href: "/funcionalidades" },
  { label: "Precios", href: "/pricing" },
];

const companyLinks = [
  { label: "Inicio", href: "/" },
  { label: "Contacto", href: "/contacto" },
];

const accountLinks = [
  { label: "Iniciar sesión", href: "/auth/sign-in" },
  { label: "Crear cuenta", href: "/auth/sign-up" },
];

const contactItems = [
  {
    icon: Mail,
    label: "contacto@connta.ar",
    href: "mailto:contacto@connta.ar",
  },
  {
    icon: MessageCircle,
    label: "+54 9 15 2739-8316",
    href: "https://wa.me/5491527398316",
    external: true,
  },
  {
    icon: InstagramIcon,
    label: "@connta_ar",
    href: "https://www.instagram.com/connta_ar",
    external: true,
  },
];

export default function FooterPublic() {
  return (
    <footer
      className="text-white"
      style={{ background: "#05090e", fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');
        .ft-link {
          color: #94a8b6;
          font-size: 0.875rem;
          transition: color 0.18s ease;
          display: inline-block;
        }
        .ft-link:hover { color: #ffffff; }
        .ft-heading {
          color: #ffffff;
          font-size: 0.75rem;
          font-weight: 600;
          letter-spacing: 0.14em;
          text-transform: uppercase;
        }
        .ft-contact {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          color: #94a8b6;
          font-size: 0.875rem;
          transition: color 0.18s ease;
        }
        .ft-contact:hover { color: #ffffff; }
        .ft-contact .ft-icon {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 32px;
          height: 32px;
          border-radius: 8px;
          background: rgba(39,160,201,0.10);
          color: #7dd3fc;
          flex-shrink: 0;
        }
      `}</style>

      <div className="max-w-7xl mx-auto px-6 pt-14 pb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8">
          {/* Brand */}
          <div className="lg:col-span-4">
            <div className="flex items-center gap-3 mb-4">
              <Image
                src="/favicon.svg"
                alt="Connta"
                width={32}
                height={32}
                className="drop-shadow-sm"
              />
              <span className="font-semibold text-white tracking-tight text-lg">
                Connta
              </span>
            </div>
            <p
              className="text-sm leading-relaxed max-w-xs"
              style={{ color: "#94a8b6" }}>
              Facturación ARCA en lote para estudios contables. Importá tu
              planilla, revisá y emitís CAEs sin reingresar datos.
            </p>
            <div
              className="ft-contact mt-5"
              style={{ cursor: "default" }}>
              <span className="ft-icon">
                <MapPin size={14} />
              </span>
              <span>Buenos Aires, Argentina</span>
            </div>
          </div>

          {/* Producto */}
          <div className="lg:col-span-2">
            <h4 className="ft-heading mb-4">Producto</h4>
            <ul className="space-y-2.5">
              {productLinks.map(({ label, href }) => (
                <li key={label}>
                  <Link href={href} className="ft-link">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Empresa */}
          <div className="lg:col-span-2">
            <h4 className="ft-heading mb-4">Empresa</h4>
            <ul className="space-y-2.5">
              {companyLinks.map(({ label, href }) => (
                <li key={label}>
                  <Link href={href} className="ft-link">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Cuenta */}
          <div className="lg:col-span-2">
            <h4 className="ft-heading mb-4">Cuenta</h4>
            <ul className="space-y-2.5">
              {accountLinks.map(({ label, href }) => (
                <li key={label}>
                  <Link href={href} className="ft-link">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contacto */}
          <div className="lg:col-span-2">
            <h4 className="ft-heading mb-4">Contacto</h4>
            <ul className="space-y-3">
              {contactItems.map(({ icon: Icon, label, href, external }) => (
                <li key={label}>
                  <a
                    href={href}
                    target={external ? "_blank" : undefined}
                    rel={external ? "noopener noreferrer" : undefined}
                    className="ft-contact">
                    <span className="ft-icon">
                      <Icon size={14} />
                    </span>
                    <span>{label}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          className="mt-12 pt-6 border-t flex flex-col sm:flex-row items-center justify-between gap-3"
          style={{ borderColor: "rgba(255,255,255,0.06)" }}>
          <p className="text-xs" style={{ color: "#4a6478" }}>
            © {new Date().getFullYear()} Connta. Todos los derechos reservados.
          </p>
          <p className="text-xs" style={{ color: "#4a6478" }}>
            Hecho en Argentina
          </p>
        </div>
      </div>
    </footer>
  );
}
