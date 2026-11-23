import { LegalDocument } from "@/components/legal/LegalDocument";
import { Notice } from "@/components/ui/Notice";
import { getSiteContent } from "@/content";
import type { BusinessInfo } from "@/content/types";
import { buildPageMetadata } from "@/lib/metadata";

const { legal, business } = getSiteContent();
const page = legal["informacoes-comerciais"];

export const metadata = buildPageMetadata({
  title: page.title,
  description: page.description,
  path: "/informacoes-comerciais",
});

const ROTULOS: Record<keyof BusinessInfo, string> = {
  legalName: "Razão social",
  taxId: "CNPJ",
  contactEmail: "E-mail de suporte",
  supportHours: "Horário de atendimento",
  responseTime: "Prazo de resposta",
};

/** Informações comerciais: só os dados da empresa aprovados (P-04, P-05); nada inventado. */
export default function InformacoesComerciaisPage() {
  const campos = (Object.keys(ROTULOS) as Array<keyof BusinessInfo>).filter(
    (k) => business[k].status === "aprovado" && business[k].value,
  );
  return (
    <LegalDocument page={page}>
      <section aria-labelledby="dados-empresa" className="pt-8">
        <h2 id="dados-empresa" className="text-h3 font-semibold text-text-primary">
          Dados da empresa
        </h2>
        {campos.length > 0 ? (
          <dl className="mt-4 grid gap-3">
            {campos.map((k) => (
              <div key={k}>
                <dt className="text-small text-text-secondary">{ROTULOS[k]}</dt>
                <dd className="text-text-primary">{business[k].value}</dd>
              </div>
            ))}
          </dl>
        ) : (
          <Notice className="mt-4">
            <p>Os dados da empresa serão publicados aqui antes da abertura das vendas.</p>
          </Notice>
        )}
      </section>
    </LegalDocument>
  );
}
