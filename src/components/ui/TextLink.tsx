import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

interface TextLinkProps {
  href: string;
  children: ReactNode;
  className?: string;
}

const classes =
  "text-text-accent underline decoration-1 underline-offset-4 transition-[text-decoration-thickness] duration-(--duration-fast) hover:decoration-2";

/**
 * Link de texto (design-system §4). Externo: ícone + "(abre site externo)" para leitores de tela,
 * abrindo na MESMA aba (contrato de rotas §3: só o checkout abre em nova aba).
 */
export function TextLink({ href, children, className }: TextLinkProps) {
  const externo = /^https?:\/\//.test(href);
  if (externo) {
    return (
      <a href={href} className={cn(classes, "inline-flex items-baseline gap-0.5", className)}>
        {children}
        <ArrowUpRight aria-hidden="true" className="size-[0.9em] self-center" />
        <span className="sr-only"> (abre site externo)</span>
      </a>
    );
  }
  return (
    <Link href={href} className={cn(classes, className)}>
      {children}
    </Link>
  );
}
