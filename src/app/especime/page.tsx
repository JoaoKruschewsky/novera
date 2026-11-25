import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container } from "@/components/layout/Container";
import { EditorialRule } from "@/components/layout/EditorialRule";
import { PaperBand } from "@/components/layout/PaperBand";
import { SectionHeader } from "@/components/layout/SectionHeader";
import { Button } from "@/components/ui/Button";
import { ChoiceGroup } from "@/components/ui/ChoiceGroup";
import { ConsentCheckbox } from "@/components/ui/ConsentCheckbox";
import { Field } from "@/components/ui/Field";
import { ErrorSummary } from "@/components/ui/FormStatus";
import { Notice } from "@/components/ui/Notice";
import { RatingInput } from "@/components/ui/RatingInput";
import { TextArea } from "@/components/ui/TextArea";
import { TextLink } from "@/components/ui/TextLink";
import { contrastRatio, PARES_DE_CONTRASTE } from "@/lib/contrast";
import { EspecimeProduto } from "./EspecimeProduto";

export const metadata: Metadata = {
  title: "Espécime do design system",
  robots: { index: false, follow: false },
};

const CORES = [
  ["graphite", "bg-graphite"],
  ["slate", "bg-slate"],
  ["sage", "bg-sage"],
  ["champagne", "bg-champagne"],
  ["sand", "bg-sand"],
  ["offwhite", "bg-offwhite"],
] as const;

/**
 * Ferramenta de revisão do design system (design-system.md §6.1). Responde só em
 * desenvolvimento; em produção chama notFound(). Não é uma página do site (FR-036e).
 */
export default function EspecimePage() {
  if (process.env.NODE_ENV === "production") notFound();
  return (
    <Container className="space-y-20 py-16">
      <SectionHeader
        as="h1"
        eyebrow="Ferramenta interna"
        title="Espécime do design system"
        lead={<p>Tokens, tipografia e componentes nos seus estados.</p>}
      />

      <section aria-labelledby="cores" className="space-y-6">
        <h2 id="cores" className="text-h2">
          Cores e contraste
        </h2>
        <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {CORES.map(([nome, classe]) => (
            <li key={nome}>
              <div className={`h-20 rounded-md border border-border-subtle ${classe}`} />
              <p className="mt-2 text-small">{nome}</p>
            </li>
          ))}
        </ul>
        <table className="w-full max-w-2xl text-left text-small">
          <caption className="sr-only">Razões de contraste medidas</caption>
          <thead>
            <tr className="border-b border-border-subtle">
              <th scope="col" className="py-2">
                Primeiro plano / fundo
              </th>
              <th scope="col" className="py-2">
                Razão
              </th>
              <th scope="col" className="py-2">
                Mínimo
              </th>
            </tr>
          </thead>
          <tbody>
            {PARES_DE_CONTRASTE.map((p) => (
              <tr key={`${p.fg}-${p.bg}`} className="border-b border-border-subtle">
                <td className="py-2">
                  {p.fg} / {p.bg}
                </td>
                <td className="py-2 tabular-nums">{contrastRatio(p.fg, p.bg).toFixed(2)}:1</td>
                <td className="py-2">
                  {p.min}:1 ({p.uso})
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section aria-labelledby="tipografia" className="space-y-4">
        <h2 id="tipografia" className="text-h2">
          Tipografia
        </h2>
        <p className="font-display text-display">Display — Planejar 2027</p>
        <p className="font-display text-h1">Título de página (h1)</p>
        <p className="font-display text-h2">Título de seção (h2)</p>
        <p className="text-h3 font-semibold">Subtítulo (h3)</p>
        <p className="max-w-prose text-lead text-text-secondary">
          Lead: parágrafo de abertura com medida de leitura limitada a 68 caracteres por linha.
        </p>
        <p className="max-w-prose">
          Corpo: texto corrido em Hanken Grotesk, com acentuação do português — ação, coração, você,
          até.
        </p>
        <p className="text-small text-text-secondary">Pequeno: notas e legendas.</p>
        <p className="eyebrow text-text-accent">Eyebrow em versalete</p>
        <EditorialRule number="01" className="max-w-sm" />
      </section>

      <section aria-labelledby="botoes" className="space-y-6">
        <h2 id="botoes" className="text-h2">
          Botões e links
        </h2>
        <div className="flex flex-wrap items-center gap-4">
          <Button>Primário</Button>
          <Button variant="secondary">Secundário</Button>
          <Button variant="quiet">Discreto</Button>
          <Button disabled>Desabilitado</Button>
          <Button loading>Enviar</Button>
        </div>
        <p>
          <TextLink href="/faq">Link interno</TextLink> ·{" "}
          <TextLink href="https://example.com">Link externo</TextLink>
        </p>
      </section>

      <section aria-labelledby="avisos" className="space-y-6">
        <h2 id="avisos" className="text-h2">
          Avisos
        </h2>
        <Notice title="Documento em preparação">
          <p>Estado pendente sobre grafite.</p>
        </Notice>
        <PaperBand className="p-8">
          <Notice onPaper title="As imagens do produto serão publicadas em breve.">
            <p>Estado sobre a faixa de papel.</p>
          </Notice>
          <div className="mt-6">
            <Button>Foco sobre papel</Button>
          </div>
        </PaperBand>
      </section>

      <section aria-labelledby="campos" className="max-w-2xl space-y-8">
        <h2 id="campos" className="text-h2">
          Campos de formulário
        </h2>
        <ErrorSummary
          title="Revise os campos abaixo:"
          errors={{ "esp-email": "Informe um e-mail válido." }}
          focusKey="especime"
        />
        <Field id="esp-nome" name="esp-nome" label="Campo normal" hint="Texto de ajuda." />
        <Field
          id="esp-email"
          name="esp-email"
          label="Campo com erro"
          error="Informe um e-mail válido."
          defaultValue="nome@"
        />
        <Field id="esp-off" name="esp-off" label="Campo desabilitado" disabled optional />
        <TextArea
          id="esp-texto"
          name="esp-texto"
          label="Área de texto"
          hint="De 10 a 3.000 caracteres."
        />
        <ChoiceGroup
          id="esp-tipo"
          name="esp-tipo"
          legend="Grupo de opções"
          options={[
            { value: "a", label: "Opção A" },
            { value: "b", label: "Opção B" },
          ]}
          defaultValue="a"
        />
        <ConsentCheckbox id="esp-ok" name="esp-ok">
          Caixa de consentimento
        </ConsentCheckbox>
        <ConsentCheckbox
          id="esp-ok2"
          name="esp-ok2"
          errorText="Confirme que leu o aviso de privacidade."
        >
          Consentimento com erro
        </ConsentCheckbox>
        <RatingInput id="esp-nota" name="esp-nota" defaultValue={4} />
        <RatingInput
          id="esp-nota-erro"
          name="esp-nota-erro"
          legend="Nota com erro"
          error="Escolha uma nota de 1 a 5 estrelas."
        />
      </section>

      <EspecimeProduto />
    </Container>
  );
}
