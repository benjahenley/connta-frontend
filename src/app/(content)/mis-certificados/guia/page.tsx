"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  ShieldCheck,
  Clock,
  BadgeCheck,
  Receipt,
  FileText,
  MapPin,
} from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";

type EnvFilter = "all" | "testing" | "produccion";

interface Guide {
  slug: string;
  title: string;
  description: string;
  tag: string;
  tagColor: string;
  readTime: string;
  icon: React.ElementType;
  /** Which environments this guide applies to. Omit for env-agnostic guides. */
  envs?: ("testing" | "produccion")[];
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
        slug: "habilitar-testing",
        title: "Habilitá el certificado de testing en ARCA",
        description:
          "Activá el servicio WSASS en el Administrador de Relaciones para poder gestionar certificados de homologación.",
        tag: "Homologación",
        tagColor: "#27a0c9",
        readTime: "5 min",
        icon: ShieldCheck,
        envs: ["testing"],
      },
      {
        slug: "habilitar-produccion",
        title: "Habilitá el certificado de producción en ARCA",
        description:
          "Activá WSFEv1 y gestioná tu certificado digital para emitir facturas electrónicas reales en el ambiente de producción.",
        tag: "Producción",
        tagColor: "#27a0c9",
        readTime: "7 min",
        icon: BadgeCheck,
        envs: ["produccion"],
      },
      {
        slug: "habilitar-padron-testing",
        title: "Habilitá la consulta de domicilio fiscal en testing",
        description:
          "Autorizá el servicio de consulta de constancia de inscripción en homologación para que Connta complete automáticamente la dirección fiscal de los receptores durante tus pruebas.",
        tag: "Homologación",
        tagColor: "#27a0c9",
        readTime: "4 min",
        icon: MapPin,
        envs: ["testing"],
      },
      {
        slug: "habilitar-padron-produccion",
        title: "Habilitá la consulta de domicilio fiscal en producción",
        description:
          "Autorizá el servicio de consulta de constancia de inscripción en producción para que Connta complete automáticamente la dirección fiscal de los receptores al emitir comprobantes reales.",
        tag: "Producción",
        tagColor: "#27a0c9",
        readTime: "4 min",
        icon: MapPin,
        envs: ["produccion"],
      },
    ],
  },
  {
    label: "Facturación",
    guides: [
      {
        slug: "facturacion",
        title: "Cómo generar facturas electrónicas en ARCA",
        description:
          "Paso a paso para subir tu archivo de facturas, revisarlo, elegir el punto de venta y obtener los CAEs automáticamente.",
        tag: "WSFEv1",
        tagColor: "#27a0c9",
        readTime: "6 min",
        icon: Receipt,
      },
      {
        slug: "comprobantes-emitidos",
        title: "Consultá tus comprobantes emitidos en ARCA",
        description:
          "Cómo acceder al portal de ARCA para ver, filtrar por período o tipo, y descargar las facturas electrónicas ya autorizadas.",
        tag: "Mis Comprobantes",
        tagColor: "#27a0c9",
        readTime: "3 min",
        icon: FileText,
      },
    ],
  },
];

function filterGuides(guides: Guide[], envFilter: EnvFilter): Guide[] {
  if (envFilter === "all") return guides;
  return guides.filter(
    (g) => !g.envs || g.envs.includes(envFilter),
  );
}

function GuiasIndexContent() {
  const [envFilter, setEnvFilter] = useState<EnvFilter>("all");

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@700;900&family=Sora:wght@400;500;600;700&display=swap');
        .gi-sora { font-family: 'Sora', ui-sans-serif, system-ui, sans-serif; }

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

        {/* Environment filter */}
        <div className="gi-anim gi-a1 mb-8">
          <EnvFilterToggle value={envFilter} onChange={setEnvFilter} />
        </div>

        <div className="space-y-10">
          {CATEGORIES.map((category, ci) => {
            const filtered = filterGuides(category.guides, envFilter);
            if (filtered.length === 0) return null;

            return (
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
                  {filtered.map((guide) => (
                    <GuideCard key={guide.slug} guide={guide} />
                  ))}
                </div>
              </div>
            );
          })}
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

function EnvFilterToggle({
  value,
  onChange,
}: {
  value: EnvFilter;
  onChange: (v: EnvFilter) => void;
}) {
  const options: { key: EnvFilter; label: string }[] = [
    { key: "all", label: "Todas" },
    { key: "testing", label: "Homologación" },
    { key: "produccion", label: "Producción" },
  ];

  return (
    <div
      className="inline-flex rounded-xl p-1 gi-sora"
      style={{ background: "rgba(39,160,201,.08)" }}>
      {options.map((option) => {
        const active = value === option.key;
        return (
          <button
            key={option.key}
            onClick={() => onChange(option.key)}
            className="relative px-4 py-1.5 rounded-lg text-sm font-semibold transition-all cursor-pointer"
            style={{
              background: active ? "white" : "transparent",
              color: active ? "#0f172a" : "#64748b",
              boxShadow: active ? "0 1px 4px rgba(0,0,0,.08)" : "none",
            }}>
            {option.label}
          </button>
        );
      })}
    </div>
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
        style={{ background: `${guide.tagColor}15` }}>
        <Icon size={20} style={{ color: guide.tagColor }} />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1.5 flex-wrap">
          <span
            className="inline-block text-xs font-semibold px-2 py-0.5 rounded-full"
            style={{
              background: `${guide.tagColor}15`,
              color: guide.tagColor,
            }}>
            {guide.tag}
          </span>
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
