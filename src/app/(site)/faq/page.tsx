import { ChevronDown } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { TextLink } from "@/components/ui/TextLink";
import { getSiteContent } from "@/content";
import { buildPageMetadata } from "@/lib/metadata";

export const metadata = buildPageMetadata({
  title: "Dúvidas frequentes",
  description:
    "Respostas sobre o Planner Digital 2027: o que é um planner em PDF, aplicativos, escrita, links, entrega e suporte.",
  path: "/faq",
});

/** FAQ (FR-019) com <details>/<summary> nativos: funciona sem JavaScript (research R-06). */
export default function FaqPage() {
  const faq = [...getSiteContent().faq].sort((a, b) => a.order - b.order);
  return (
    <Container className="py-12 md:py-20">
      <h1 className="text-h1">Dúvidas frequentes</h1>
      <div className="mt-10 max-w-3xl border-t border-border-subtle">
        {faq.map((item) => (
          <details key={item.id} id={item.id} className="group border-b border-border-subtle">
            <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-6 py-4 text-h3 font-semibold text-text-primary [&::-webkit-details-marker]:hidden">
              {item.question}
              <ChevronDown
                aria-hidden="true"
                className="size-5 shrink-0 text-text-accent transition-transform duration-(--duration-fast) group-open:rotate-180"
              />
            </summary>
            <p className="max-w-prose pb-6 text-text-secondary">{item.answer.text}</p>
          </details>
        ))}
      </div>
      <p className="mt-10 text-text-secondary">
        Não encontrou o que procurava? <TextLink href="/contato">Fale com a gente</TextLink>.
      </p>
    </Container>
  );
}
