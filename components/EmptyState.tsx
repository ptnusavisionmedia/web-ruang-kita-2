import type { ReactNode } from "react";
import { IconSearch } from "@/components/icons";

export default function EmptyState({
  title,
  description,
  action,
  icon,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
  icon?: ReactNode;
}) {
  return (
    <div className="relative flex flex-col items-center overflow-hidden rounded-lg border-2 border-dashed border-ink bg-white px-6 py-14 text-center">
      <div className="blueprint absolute inset-0 opacity-60" aria-hidden />
      <div className="float-slow relative flex h-16 w-16 items-center justify-center rounded-md border-2 border-ink bg-brand-50 text-brand-800 shadow-brut-sm">
        {icon ?? <IconSearch size={32} />}
      </div>
      <h3 className="relative mt-5 font-display text-2xl text-ink">{title}</h3>
      {description && <p className="relative mt-1 max-w-sm text-sm text-muted">{description}</p>}
      {action && <div className="relative mt-6">{action}</div>}
    </div>
  );
}
