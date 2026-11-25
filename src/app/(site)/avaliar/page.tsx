import { Container } from "@/components/layout/Container";
import { getSiteContent } from "@/content";
import { ReviewForm } from "@/features/envios/components/ReviewForm";
import { buildPageMetadata } from "@/lib/metadata";

/** Oculta (FR-030a): noindex, fora do sitemap e sem nenhum link interno. */
export const metadata = buildPageMetadata({
  title: "Avalie o Planner 2027",
  description:
    "Envie sua avaliação do Novera Planner Digital 2027. Publicada só após confirmação da compra e moderação.",
  path: "/avaliar",
  noindex: true,
});

export default function AvaliarPage() {
  const { business } = getSiteContent();
  const email = business.contactEmail.status === "aprovado" ? business.contactEmail.value : null;
  return (
    <Container className="py-12 md:py-20">
      <div className="grid gap-14 lg:grid-cols-12">
        <div className="space-y-6 lg:col-span-5">
          <h1 className="text-h1">Avalie o Planner 2027</h1>
          <div className="max-w-prose space-y-4 text-text-secondary">
            <p className="text-lead">
              Obrigado por usar o planner. Sua opinião ajuda outras pessoas a decidir.
            </p>
            <p>
              Não é preciso criar conta. Antes de publicar, a equipe Novera confirma a compra pelo
              e-mail informado e faz a moderação contra spam, abuso e dados pessoais.
            </p>
            <p>
              Avaliações com nota baixa também são publicadas: só recusamos spam, conteúdo abusivo,
              dados pessoais que não possam ser removidos, texto sem relação com o produto, falta de
              autorização ou compra não confirmada.
            </p>
          </div>
        </div>
        <section aria-labelledby="avaliar-form-titulo" className="lg:col-span-7">
          <h2 id="avaliar-form-titulo" className="mb-8 text-h2">
            Sua avaliação
          </h2>
          <ReviewForm contactEmail={email} />
        </section>
      </div>
    </Container>
  );
}
