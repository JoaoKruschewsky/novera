/** Primeiro elemento focável: pula para o conteúdo principal (FR-040). */
export function SkipLink() {
  return (
    <a
      href="#conteudo"
      className="sr-only z-50 rounded-sm bg-accent px-4 py-3 font-semibold text-on-accent focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
    >
      Pular para o conteúdo
    </a>
  );
}
