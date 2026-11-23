import Link from "next/link";

/**
 * Aviso de privacidade acima do botão de envio (FR-023, FR-036c): finalidade, dados coletados,
 * prazo de 6 meses e link para a política.
 */
export function PrivacyNotice({ finalidade, dados }: { finalidade: string; dados: string }) {
  return (
    <div className="max-w-prose border-l-2 border-border-field pl-4 text-small text-text-secondary">
      <p>
        <strong className="text-text-primary">Privacidade.</strong> {finalidade} Coletamos apenas:{" "}
        {dados}. Os dados chegam por e-mail à equipe Novera, não são publicados (exceto o que você
        autorizar) e são excluídos em até 6 meses após a conclusão do atendimento ou da decisão de
        moderação. Você pode pedir a exclusão antes disso pela página de contato. Saiba mais na{" "}
        <Link href="/privacidade" className="text-text-accent underline underline-offset-4">
          política de privacidade
        </Link>
        .
      </p>
    </div>
  );
}
