import Link from "next/link";
import type { NavItem } from "@/content/types";
import { Button } from "@/components/ui/Button";
import { Container } from "./Container";
import { MobileNav } from "./MobileNav";

/** Destino do botão "Comprar": a área de compra da home (SC-004: 1 clique de qualquer página). */
export const PURCHASE_HREF = "/#comprar";

/** Cabeçalho global (contracts/rotas-e-componentes.md §2). */
export function SiteHeader({ brandName, items }: { brandName: string; items: NavItem[] }) {
  return (
    <header className="sticky top-0 z-30 border-b border-border-subtle bg-surface-base">
      <Container className="flex min-h-16 items-center justify-between gap-4">
        <Link
          href="/"
          className="inline-flex min-h-11 items-center font-display text-h3 font-medium tracking-tight text-text-primary"
          aria-label={`${brandName}, página inicial`}
        >
          {brandName}
        </Link>
        <nav aria-label="Principal" className="hidden lg:block">
          <ul className="flex items-center gap-8">
            {items.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="inline-flex min-h-11 items-center text-text-secondary transition-colors duration-(--duration-fast) hover:text-text-primary"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="flex items-center gap-2">
          <Button href={PURCHASE_HREF} className="px-4">
            Comprar
          </Button>
          <MobileNav items={items} purchaseHref={PURCHASE_HREF} />
        </div>
      </Container>
    </header>
  );
}
