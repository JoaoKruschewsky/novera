/**
 * Tipos do conteúdo versionado (specs/001-novera-site-mvp/data-model.md §1).
 * Campos em inglês camelCase; valores enumerados em português.
 * Os tipos são inferidos dos schemas Zod em ./schemas.ts (fonte única da verdade).
 */
import type { z } from "zod";
import type {
  businessInfoSchema,
  compatibilityRecordSchema,
  contentStatusSchema,
  copySchema,
  demoMaterialSchema,
  freeSampleSchema,
  faqItemSchema,
  featureSchema,
  homeContentSchema,
  legalBlockSchema,
  legalPageSchema,
  navItemSchema,
  productSchema,
  publishedReviewSchema,
  routeEntrySchema,
  salesConfigSchema,
  siteContentSchema,
  siteSettingsSchema,
} from "./schemas";

/** `pendente` = não renderizado como fato e bloqueia a publicação oficial. */
export type ContentStatus = z.infer<typeof contentStatusSchema>;
/** Texto com status de aprovação (FR-046: provisório identificável). */
export type Copy = z.infer<typeof copySchema>;
export type Feature = z.infer<typeof featureSchema>;
export type SalesConfig = z.infer<typeof salesConfigSchema>;
export type DemoMaterial = z.infer<typeof demoMaterialSchema>;
export type FreeSample = z.infer<typeof freeSampleSchema>;
export type CompatibilityRecord = z.infer<typeof compatibilityRecordSchema>;
export type Product = z.infer<typeof productSchema>;
export type FaqItem = z.infer<typeof faqItemSchema>;
export type LegalBlock = z.infer<typeof legalBlockSchema>;
export type LegalPage = z.infer<typeof legalPageSchema>;
export type BusinessInfo = z.infer<typeof businessInfoSchema>;
export type PublishedReview = z.infer<typeof publishedReviewSchema>;
export type HomeContent = z.infer<typeof homeContentSchema>;
export type NavItem = z.infer<typeof navItemSchema>;
export type SiteSettings = z.infer<typeof siteSettingsSchema>;
export type RouteEntry = z.infer<typeof routeEntrySchema>;
export type SiteContent = z.infer<typeof siteContentSchema>;
export type LegalKind = LegalPage["kind"];
