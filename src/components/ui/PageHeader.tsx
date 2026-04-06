import Link from "next/link";
import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { ArrowLeft } from "lucide-react";

type PageHeaderProps = {
  title: string;
  description?: string;
  eyebrow?: string;
  icon?: LucideIcon;
  actions?: ReactNode;
  meta?: ReactNode;
  backHref?: string;
  backLabel?: string;
  className?: string;
};

export function PageHeader({
  title,
  description,
  eyebrow,
  icon: Icon,
  actions,
  meta,
  backHref,
  backLabel,
  className = "",
}: PageHeaderProps) {
  return (
    <div className={className}>
      {backHref && backLabel ? (
        <Link
          href={backHref}
          className="mb-3 inline-flex items-center gap-1.5 text-xs text-gray-400 transition-colors hover:text-[#27a0c9]">
          <ArrowLeft size={13} />
          {backLabel}
        </Link>
      ) : null}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          {eyebrow ? (
            <div className="mb-3 flex items-center gap-2">
              {Icon ? <Icon size={18} className="text-[#27a0c9]" /> : null}
              <span className="text-xs font-semibold uppercase tracking-wider text-[#27a0c9]">
                {eyebrow}
              </span>
            </div>
          ) : null}

          <h1 className="text-2xl font-bold leading-tight text-gray-900 sm:text-3xl">
            {title}
          </h1>

          {meta ? <div className="mt-2">{meta}</div> : null}

          {description ? (
            <p className="mt-2 max-w-2xl text-sm text-gray-500 sm:text-base">
              {description}
            </p>
          ) : null}
        </div>

        {actions ? <div className="flex items-center gap-2.5">{actions}</div> : null}
      </div>
    </div>
  );
}
