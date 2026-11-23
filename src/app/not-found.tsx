import type { Metadata } from "next";
import { Container } from "@/components/layout/Container";
import { EditorialRule } from "@/components/layout/EditorialRule";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Página não encontrada",
  description: "O endereço acessado não existe no site da Novera.",
  robots: { index: false, follow: false },
};

/** Página "não encontrada" na identidade Novera, com caminho de volta (FR-043). */
export default function NotFound() {
  return (
    <Container className="py-24 md:py-32">
      <EditorialRule number="404" className="mb-10 max-w-xs" />
      <h1 className="max-w-2xl text-h1">Esta página não foi encontrada.</h1>
      <p className="mt-6 max-w-prose text-lead text-text-secondary">
        O endereço pode ter mudado ou ter sido digitado com algum erro.
      </p>
      <Button href="/" className="mt-10">
        Voltar ao início
      </Button>
    </Container>
  );
}
