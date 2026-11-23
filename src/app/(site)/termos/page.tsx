import { LegalDocument } from "@/components/legal/LegalDocument";
import { getSiteContent } from "@/content";
import { buildPageMetadata } from "@/lib/metadata";

const page = getSiteContent().legal.termos;

export const metadata = buildPageMetadata({
  title: page.title,
  description: page.description,
  path: "/termos",
});

export default function TermosPage() {
  return <LegalDocument page={page} />;
}
