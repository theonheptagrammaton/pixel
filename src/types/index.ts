import { UserRole } from "@prisma/client";

export type { UserRole };

// Re-export all template types as the canonical SiteConfig
export type {
  SiteConfig,
  SiteSection,
  SiteGlobalConfig,
  SectionType,
  HeroData,
  AboutData,
  ServicesData,
  GalleryData,
  MenuData,
  TestimonialsData,
  TeamData,
  PricingData,
  ContactData,
  FaqData,
  CtaData,
  HeaderData,
  FooterData,
  SectionDataMap,
  TemplateDefinition,
} from "./template";

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface SessionUser {
  id: string;
  email: string;
  username: string;
  name?: string | null;
  role: UserRole;
}

export interface UserWithSiteCount {
  id: string;
  email: string;
  username: string;
  name: string | null;
  role: UserRole;
  onboarded: boolean;
  createdAt: Date;
  updatedAt: Date;
  _count: {
    sites: number;
  };
}
