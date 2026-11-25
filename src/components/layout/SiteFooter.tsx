import Link from "next/link";
import type { BusinessInfo, NavItem } from "@/content/types";
import { Container } from "./Container";

/**
 * Rodapé (US5-6, FR-020, FR-021). Dados da empresa e e-mail de suporte só quando o campo
 * estiver `aprovado`: nunca com valor inventado (FR-022).
 */
export function SiteFooter({
  brandName,
  items,
  business,
}: {
  brandName: string;
  items: NavItem[];
  business: BusinessInfo;
}) {
  const email = business.contactEmail.status === "aprovado" ? business.contactEmail.value : null;
  const razao = business.legalName.status === "aprovado" ? business.legalName.value : null;
  const cnpj = business.taxId.status === "aprovado" ? business.taxId.value : null;
  return (
    <footer className="mt-auto bg-surface-footer text-text-secondary">
      <Container className="grid gap-10 py-14 md:grid-cols-[1fr_auto]">
        <div className="space-y-3">
          <p className="font-display text-h3 text-text-primary">{brandName}</p>
          {email ? (
            <p>
              Suporte:{" "}
              <a href={`mailto:${email}`} className="text-text-accent underline underline-offset-4">
                {email}
              </a>
            </p>
          ) : null}
          {razao || cnpj ? (
            <p className="text-small">
              {[razao, cnpj ? `CNPJ ${cnpj}` : null].filter(Boolean).join(" · ")}
            </p>
          ) : null}
        </div>
        <nav aria-label="Rodapé">
          <ul className="grid gap-x-10 gap-y-1 sm:grid-cols-2">
            {items.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="inline-flex min-h-11 items-center hover:text-text-primary"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </Container>
    </footer>
  );
}
