import type { Metadata, Viewport } from "next";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SkipLink } from "@/components/layout/SkipLink";
import { SITE_URL } from "@/config/env";
import { getSiteContent } from "@/content";
import { OG_IMAGE } from "@/lib/metadata";
import { hankenGrotesk, newsreader } from "./fonts";
import "@/styles/globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: "Novera", template: "%s · Novera" },
  description:
    "Produtos digitais da Novera para organizar o dia a dia com simplicidade e elegância.",
  applicationName: "Novera",
  openGraph: { siteName: "Novera", locale: "pt_BR", type: "website", images: [OG_IMAGE] },
};

export const viewport: Viewport = {
  themeColor: "#252B32",
  colorScheme: "dark",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  const { site, business } = getSiteContent();
  return (
    <html lang="pt-BR" className={`${newsreader.variable} ${hankenGrotesk.variable}`}>
      <body>
        <SkipLink />
        <SiteHeader brandName={site.brandName} items={site.nav} />
        <main id="conteudo" tabIndex={-1} className="flex-1 outline-none">
          {children}
        </main>
        <SiteFooter brandName={site.brandName} items={site.footer} business={business} />
      </body>
    </html>
  );
}
