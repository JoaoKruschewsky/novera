import { Container } from "@/components/layout/Container";
import { Notice } from "@/components/ui/Notice";
import { getSiteContent } from "@/content";
import { FeedbackForm } from "@/features/envios/components/FeedbackForm";
import { buildPageMetadata } from "@/lib/metadata";

export const metadata = buildPageMetadata({
  title: "Contato e suporte",
  description:
    "Fale com a Novera: dúvidas, suporte, problemas encontrados e sugestões sobre o Planner Digital 2027.",
  path: "/contato",
});

const aprovado = (f: { value: string | null; status: string }) =>
  f.status === "aprovado" ? f.value : null;

/**
 * Contato, suporte e feedback privado (FR-020, FR-024 a FR-026).
 * Sem link para /avaliar (FR-030a): quem perdeu o link pede por aqui.
 */
export default function ContatoPage() {
  const { business } = getSiteContent();
  const email = aprovado(business.contactEmail);
  const horario = aprovado(business.supportHours);
  const prazo = aprovado(business.responseTime);
  return (
    <Container className="py-12 md:py-20">
      <div className="grid gap-14 lg:grid-cols-12">
        <div className="space-y-8 lg:col-span-5">
          <div>
            <h1 className="text-h1">Contato e suporte</h1>
            <p className="mt-6 max-w-prose text-lead text-text-secondary">
              Envie uma dúvida, um pedido de suporte, um problema encontrado ou uma sugestão. A
              mensagem chega só à equipe Novera e nunca é publicada.
            </p>
          </div>
          <section aria-labelledby="canais-titulo" className="space-y-3">
            <h2 id="canais-titulo" className="text-h3 font-semibold">
              Canais
            </h2>
            {email ? (
              <p>
                E-mail:{" "}
                <a
                  href={`mailto:${email}`}
                  className="text-text-accent underline underline-offset-4"
                >
                  {email}
                </a>
              </p>
            ) : (
              <Notice>
                <p>O e-mail de suporte será publicado aqui. Por enquanto, use o formulário.</p>
              </Notice>
            )}
            {horario ? <p className="text-text-secondary">Atendimento: {horario}.</p> : null}
            {prazo ? <p className="text-text-secondary">Prazo de resposta: {prazo}.</p> : null}
          </section>
          <section aria-labelledby="pedidos-titulo" className="space-y-3 text-text-secondary">
            <h2 id="pedidos-titulo" className="text-h3 font-semibold text-text-primary">
              Outros pedidos
            </h2>
            <ul className="list-disc space-y-2 pl-5 marker:text-text-accent">
              <li>Comprou o planner e perdeu o link para avaliar? Peça por aqui que reenviamos.</li>
              <li>
                Quer retirar uma avaliação que você publicou? Peça por aqui; confirmamos a autoria e
                removemos.
              </li>
              <li>Quer que seus dados sejam excluídos antes do prazo de 6 meses? Peça por aqui.</li>
            </ul>
          </section>
        </div>
        <section aria-labelledby="formulario-titulo" className="lg:col-span-7">
          <h2 id="formulario-titulo" className="mb-8 text-h2">
            Enviar mensagem
          </h2>
          <FeedbackForm contactEmail={email} responseTime={prazo} />
        </section>
      </div>
    </Container>
  );
}
