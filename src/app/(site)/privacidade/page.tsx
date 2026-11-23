import { LegalDocument } from "@/components/legal/LegalDocument";
import { getSiteContent } from "@/content";
import { buildPageMetadata } from "@/lib/metadata";

const page = getSiteContent().legal.privacidade;

export const metadata = buildPageMetadata({
  title: page.title,
  description: page.description,
  path: "/privacidade",
});

export default function PrivacidadePage() {
  return <LegalDocument page={page} />;
}
