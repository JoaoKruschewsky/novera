import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { buttonClasses } from "@/components/ui/Button";
import { publicEnv } from "@/config/env";
import { getSiteContent } from "@/content";
import { cn } from "@/lib/cn";
import { resolveSalesState } from "@/lib/sales";

export const VENDAS_NAO_ABERTAS = "As vendas do Planner 2027 ainda não estão abertas.";

/**
 * CTA de compra ÚNICO do site (FR-015 a FR-018, contracts/rotas-e-componentes.md §3).
 * - `nao-abertas`: texto honesto, sem href externo, preço, desconto ou contador.
 * - `abertas`: link para o checkout oficial, em nova aba (única exceção do site), com aviso
 *   de site externo; preço só se aprovado.
 */
export function PurchaseCta({ variant = "section" }: { variant?: "hero" | "section" }) {
  const { product } = getSiteContent();
  const view = resolveSalesState(product.sales, publicEnv.NEXT_PUBLIC_SALES_OVERRIDE);

  if (view.state === "nao-abertas") {
    return (
      <div className="max-w-prose">
        <p
          className={cn(
            "text-text-primary",
            variant === "hero" ? "text-lead" : "text-h3 font-semibold",
          )}
        >
          {VENDAS_NAO_ABERTAS}
        </p>
        <p className="mt-3 text-text-secondary">
          Tem alguma dúvida?{" "}
          <Link href="/faq" className="text-text-accent underline underline-offset-4">
            Veja as dúvidas frequentes
          </Link>{" "}
          ou{" "}
          <Link href="/contato" className="text-text-accent underline underline-offset-4">
            fale com a gente
          </Link>
          .
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-prose">
      {view.price ? (
        <p className="mb-4 font-display text-h2 text-text-primary">
          <span className="sr-only">Preço: </span>
          {view.price}
        </p>
      ) : null}
      <a
        href={view.checkoutUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={buttonClasses("primary", "w-full sm:w-auto")}
        data-checkout
      >
        Comprar o Planner 2027
        <ArrowUpRight aria-hidden="true" className="size-5" />
        <span className="sr-only"> (abre em nova aba, site externo)</span>
      </a>
      <p className="mt-3 text-small text-text-secondary">
        Pagamento seguro na {view.platformLabel} (site externo). A página abre em nova aba.
      </p>
    </div>
  );
}
