import type { Feature } from "@/content/types";
import { cn } from "@/lib/cn";

/** Lista editorial de funcionalidades com fios entre os itens; sem cards nem ícones (FR-047). */
export function FeatureList({ features, className }: { features: Feature[]; className?: string }) {
  return (
    <ul className={cn("grid border-t border-border-subtle sm:grid-cols-2 sm:gap-x-10", className)}>
      {features.map((f) => (
        <li key={f.id} className="border-b border-border-subtle py-4">
          <p className="font-semibold text-text-primary">{f.title}</p>
          <p className="mt-1 text-small text-text-secondary">{f.description}</p>
        </li>
      ))}
    </ul>
  );
}
