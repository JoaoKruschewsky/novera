import type { MetadataRoute } from "next";
import { SITE_URL } from "@/config/env";
import { getSiteContent } from "@/content";

/** Todas as rotas indexáveis; `/avaliar` fica de fora (FR-030a, FR-048). */
export default function sitemap(): MetadataRoute.Sitemap {
  return getSiteContent()
    .routes.filter((r) => r.indexable)
    .map((r) => ({ url: `${SITE_URL}${r.path === "/" ? "" : r.path}` }));
}
