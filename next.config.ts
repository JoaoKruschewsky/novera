import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV !== "production";
const TURNSTILE = "https://challenges.cloudflare.com";

// Fixture de conteúdo: só nos builds de teste (scripts/e2e-matrix.mjs), nunca em produção.
const fixture = process.env.NOVERA_CONTENT_FIXTURE;
const fixturePath = fixture
  ? `./tests/fixtures/content/${fixture}.ts`
  : "./src/content/no-fixture.ts";

// CSP sem nonce: as páginas são estáticas (research R-02), então o nonce não se aplica.
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""} ${TURNSTILE}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "media-src 'self'",
  "font-src 'self'",
  `connect-src 'self' ${TURNSTILE}`,
  `frame-src ${TURNSTILE}`,
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  // Só em https: em http://localhost (testes e prévias locais) o WebKit bloquearia CSS e JS.
  ...(process.env.NEXT_PUBLIC_SITE_URL?.startsWith("https://")
    ? ["upgrade-insecure-requests"]
    : []),
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()",
  },
  { key: "X-Frame-Options", value: "DENY" },
];

const nextConfig: NextConfig = {
  distDir: process.env.NEXT_DIST_DIR ?? ".next",
  poweredByHeader: false,
  // Imagens pré-otimizadas por scripts/otimizar-imagens.mjs (research R-15).
  images: { unoptimized: true },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
    resolveAlias: {
      "@content-fixture": fixturePath,
    },
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
