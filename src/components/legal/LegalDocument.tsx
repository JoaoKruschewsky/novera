import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { Notice } from "@/components/ui/Notice";
import type { LegalPage } from "@/content/types";
import { formatDatePtBR } from "@/lib/format";

export const DOCUMENTO_EM_PREPARACAO = "Documento em preparação";

/**
 * Página legal (FR-021, FR-022). Com status `pendente`, mostra só o título e o aviso:
 * nenhum texto jurídico inventado é publicado.
 */
export function LegalDocument({ page, children }: { page: LegalPage; children?: React.ReactNode }) {
  return (
    <Container className="py-12 md:py-20">
      <article className="max-w-prose">
        <h1 className="text-h1">{page.title}</h1>
        {page.status === "aprovado" && page.effectiveDate ? (
          <p className="mt-4 text-small text-text-secondary">
            Vigente desde {formatDatePtBR(page.effectiveDate)}.
          </p>
        ) : null}
        <div className="prose-novera mt-10 space-y-5 text-text-secondary">
          {page.status === "pendente" ? (
            <Notice title={DOCUMENTO_EM_PREPARACAO}>
              <p>
                Este documento está sendo redigido e será publicado antes da abertura das vendas. Se
                precisar de alguma informação agora, use a{" "}
                <Link href="/contato" className="text-text-accent">
                  página de contato
                </Link>
                .
              </p>
            </Notice>
          ) : (
            page.body.map((b, i) => {
              if (b.type === "heading") {
                return (
                  <h2 key={i} className="pt-4 text-h3 font-semibold text-text-primary">
                    {b.text}
                  </h2>
                );
              }
              if (b.type === "paragraph") return <p key={i}>{b.text}</p>;
              return (
                <ul key={i} className="list-disc space-y-2 pl-5 marker:text-text-accent">
                  {b.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              );
            })
          )}
          {children}
        </div>
      </article>
    </Container>
  );
}
