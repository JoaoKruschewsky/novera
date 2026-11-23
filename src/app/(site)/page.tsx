import { BenefitsSection } from "@/components/sections/BenefitsSection";
import { DemoSection } from "@/components/sections/DemoSection";
import { HeroSection } from "@/components/sections/HeroSection";
import { HowItWorksSection } from "@/components/sections/HowItWorksSection";
import { ProductIntroSection } from "@/components/sections/ProductIntroSection";
import { PurchaseSection } from "@/components/sections/PurchaseSection";
import { getSiteContent } from "@/content";
import { ReviewsSection } from "@/features/avaliacoes/ReviewsSection";
import { selectApprovedDemo } from "@/lib/demo";
import { buildPageMetadata } from "@/lib/metadata";

const { home } = getSiteContent();

export const metadata = buildPageMetadata({
  title: home.seo.title,
  description: home.seo.description,
  path: "/",
  absoluteTitle: true,
});

/**
 * Página inicial (FR-002, contrato de rotas §1): marca → produto → demonstração → benefícios →
 * como funciona → avaliações (só com dados) → compra.
 */
export default function HomePage() {
  const { site, product, reviews } = getSiteContent();
  const demo = selectApprovedDemo(product.demo);
  const featured = demo.find((m) => m.kind === "imagem");
  const temAvaliacoes = reviews.length > 0;
  return (
    <>
      <HeroSection brandName={site.brandName} hero={home.hero} featured={featured} />
      <ProductIntroSection product={product} number="01" />
      <DemoSection materials={demo} number="02" />
      <BenefitsSection benefits={home.benefits} number="03" />
      <HowItWorksSection steps={home.howItWorks} number="04" />
      <ReviewsSection reviews={reviews} number="05" />
      <PurchaseSection number={temAvaliacoes ? "06" : "05"} />
    </>
  );
}
