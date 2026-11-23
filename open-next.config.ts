// Configuração do adaptador OpenNext para Cloudflare Workers (research R-03).
// Sem cache incremental em R2: todas as páginas são estáticas (R-02) e servidas como assets;
// o Worker só executa as Server Actions dos formulários.
import { defineCloudflareConfig } from "@opennextjs/cloudflare";

export default defineCloudflareConfig({});
