import type { RouteEntry } from "./types";

/**
 * Registro das rotas públicas (contracts/rotas-e-componentes.md §1).
 * Usado pelo sitemap, pelo robots e pelos testes e2e, que cobrem automaticamente cada rota.
 * `/avaliar` é oculta: não indexável, fora do sitemap e sem links internos (FR-030a).
 */
export const routes: RouteEntry[] = [
  { path: "/", indexable: true },
  { path: "/planner-2027", indexable: true },
  { path: "/faq", indexable: true },
  { path: "/contato", indexable: true },
  { path: "/privacidade", indexable: true },
  { path: "/termos", indexable: true },
  { path: "/informacoes-comerciais", indexable: true },
  { path: "/avaliar", indexable: false },
];
