"use client";

import { Suspense } from "react";
import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Clock,
  BadgeCheck,
  Receipt,
  FileText,
  MapPin,
} from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";

interface Guide {
  slug: string;
  title: string;
  description: string;
  readTime: string;
  icon: React.ElementType;
}

interface Category {
  label: string;
  guides: Guide[];
}

const CATEGORIES: Category[] = [
  {
    label: "Autorizaciones",
    guides: [
      {
        slug: "habilitar-produccion",
        title: "Conectá tu cuenta de ARCA con Connta",
        description:
          "Paso a paso para crear el certificado digital que permite a Connta emitir facturas en tu nombre. Solo se hace una vez por cada CUIT desde el cual quisieras facturar.",
        readTime: "7 min",
        icon: BadgeCheck,
      },
      {
        slug: "habilitar-padron-produccion",
        title: "Activá el autocompletado de direcciones",
        description:
          "Permitile a Connta buscar automáticamente la dirección fiscal de tus clientes para que no tengas que cargarlas manual.",
        readTime: "4 min",
        icon: MapPin,
      },
    ],
  },
  {
    label: "Facturación",
    guides: [
      {
        slug: "facturacion",
        title: "Cómo subir y emitir facturas",
        description:
          "Subí tu Excel o CSV con las facturas, revisá los datos en pantalla y generá los CAEs con un click.",
        readTime: "6 min",
        icon: Receipt,
      },
      {
        slug: "comprobantes-emitidos",
        title: "Dónde ver tus facturas ya emitidas",
        description:
          "Cómo acceder al portal de ARCA para buscar, filtrar y descargar los comprobantes que ya generaste.",
        readTime: "3 min",
        icon: FileText,
      },
    ],
  },
];

function GuiasIndexContent() {
  return (
    <>
      <style>{`
        .gi-sora { font-family: var(--font-sora), ui-sans-serif, system-ui, sans-serif; }

        @keyframes giFadeUp {
          from { opacity:0; transform:translateY(12px); }
          to   { opacity:1; transform:translateY(0); }
        }
        .gi-anim { opacity:0; animation: giFadeUp .45s ease forwards; }
        .gi-a1 { animation-delay:.04s; }
        .gi-a2 { animation-delay:.12s; }
        .gi-a3 { animation-delay:.20s; }
        .gi-a4 { animation-delay:.28s; }
        .gi-a5 { animation-delay:.36s; }

        .gi-card {
          transition: box-shadow .2s ease, transform .2s ease, border-color .2s ease;
        }
        .gi-card:hover {
          box-shadow: 0 8px 32px rgba(39,160,201,.12), 0 2px 8px rgba(0,0,0,.06);
          transform: translateY(-2px);
          border-color: rgba(39,160,201,.35);
        }
      `}</style>

      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-10 py-8 sm:py-10 gi-sora">
        <PageHeader
          className="gi-anim gi-a1 mb-6"
          eyebrow="Guías"
          icon={BookOpen}
          title="Centro de ayuda"
          description="Guías paso a paso para configurar y operar la plataforma."
        />

        <div className="space-y-10">
          {CATEGORIES.map((category, ci) => (
            <div key={category.label} className={`gi-anim gi-a${ci + 2}`}>
              <div className="flex items-center gap-3 mb-4">
                <p className="text-xs font-semibold uppercase tracking-[0.15em] text-gray-400">
                  {category.label}
                </p>
                <div
                  className="flex-1 h-px"
                  style={{ background: "#f1f5f9" }}
                />
              </div>
              <div className="space-y-3">
                {category.guides.map((guide) => (
                  <GuideCard key={guide.slug} guide={guide} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default function GuiasIndex() {
  return (
    <Suspense fallback={null}>
      <GuiasIndexContent />
    </Suspense>
  );
}

function GuideCard({ guide }: { guide: Guide }) {
  const Icon = guide.icon;
  return (
    <Link
      href={`/mis-certificados/guia/${guide.slug}`}
      className="gi-card gi-sora group flex items-start gap-4 sm:gap-5 rounded-xl border border-gray-200 bg-white px-5 py-5 sm:px-6 sm:py-5">
      <div
        className="flex-shrink-0 w-11 h-11 rounded-xl flex items-center justify-center mt-0.5"
        style={{ background: "rgba(39,160,201,.1)" }}>
        <Icon size={20} style={{ color: "#27a0c9" }} />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1.5">
          <span className="flex items-center gap-1 text-xs text-gray-400">
            <Clock size={11} />
            {guide.readTime} lectura
          </span>
        </div>

        <h2 className="text-sm sm:text-base font-semibold text-gray-900 leading-snug mb-1">
          {guide.title}
        </h2>
        <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">
          {guide.description}
        </p>
      </div>

      <ArrowRight
        size={16}
        className="flex-shrink-0 text-gray-300 group-hover:text-[#27a0c9] group-hover:translate-x-0.5 transition-all mt-1 self-center"
      />
    </Link>
  );
}
