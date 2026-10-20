"use client";

import { useEffect } from "react";
import { SiteConfig } from "@/types/template";
import { loadGoogleFont } from "@/lib/fonts";

import { HeaderRender } from "./sections/header-render";
import { HeroRender } from "./sections/hero-render";
import { AboutRender } from "./sections/about-render";
import { ServicesRender } from "./sections/services-render";
import { GalleryRender } from "./sections/gallery-render";
import { MenuRender } from "./sections/menu-render";
import { TestimonialsRender } from "./sections/testimonials-render";
import { TeamRender } from "./sections/team-render";
import { PricingRender } from "./sections/pricing-render";
import { ContactRender } from "./sections/contact-render";
import { FaqRender } from "./sections/faq-render";
import { CtaRender } from "./sections/cta-render";
import { FooterRender } from "./sections/footer-render";
import { StatsRender } from "./sections/stats-render";
import { BlogRender } from "./sections/blog-render";
import { PartnersRender } from "./sections/partners-render";
import { VideoRender } from "./sections/video-render";
import { SectionWrapper } from "./sections/section-wrapper";
import { WhatsAppButton } from "./whatsapp-button";
import { CookieConsent } from "./cookie-consent";

interface TemplateRendererProps {
  config: SiteConfig;
  pageSlug?: string;
  isPreview?: boolean;
  basePath?: string;
  siteSubdomain?: string;
  siteId?: string;
}

export function TemplateRenderer({ config, pageSlug, isPreview = false, basePath = "", siteSubdomain, siteId }: TemplateRendererProps) {
  const { global } = config;
  // Defensive: migrate legacy configs that have sections[] instead of pages[]
  const pages = (() => {
    if (config.pages) return config.pages;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const raw = config as any;
    if (Array.isArray(raw.sections)) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const contentSections = raw.sections.filter((s: any) => s.type !== "header" && s.type !== "footer");
      return [{ id: "home", name: "Ana Sayfa", slug: "", order: 0, sections: contentSections }];
    }
    return [];
  })();

  useEffect(() => {
    if (global.fonts.heading) loadGoogleFont(global.fonts.heading);
    if (global.fonts.body) loadGoogleFont(global.fonts.body);
  }, [global.fonts.heading, global.fonts.body]);

  // Analytics tracking
  useEffect(() => {
    if (isPreview || !siteSubdomain) return;
    try {
      fetch("/api/public/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          siteSubdomain,
          path: window.location.pathname,
          referrer: document.referrer,
        }),
        keepalive: true,
      });
    } catch {
      // fire-and-forget
    }
  }, [isPreview, siteSubdomain]);

  // Find page by slug; default to first page
  const targetSlug = pageSlug ?? "";
  const page = pages.find((p) => p.slug === targetSlug) ?? pages[0];
  if (!page) return null;

  const visibleSections = [...page.sections]
    .filter((s) => s.isVisible)
    .sort((a, b) => a.order - b.order);

  const baseProps = { global, isPreview, basePath };

  function renderSectionContent(section: (typeof visibleSections)[0]) {
    switch (section.type) {
      case "hero":
        return <HeroRender key={section.id} data={section.data as Parameters<typeof HeroRender>[0]["data"]} {...baseProps} />;
      case "about":
        return <AboutRender key={section.id} data={section.data as Parameters<typeof AboutRender>[0]["data"]} {...baseProps} />;
      case "services":
        return <ServicesRender key={section.id} data={section.data as Parameters<typeof ServicesRender>[0]["data"]} {...baseProps} sectionStyle={section.style} />;
      case "gallery":
        return <GalleryRender key={section.id} data={section.data as Parameters<typeof GalleryRender>[0]["data"]} {...baseProps} />;
      case "menu":
        return <MenuRender key={section.id} data={section.data as Parameters<typeof MenuRender>[0]["data"]} {...baseProps} />;
      case "testimonials":
        return <TestimonialsRender key={section.id} data={section.data as Parameters<typeof TestimonialsRender>[0]["data"]} {...baseProps} sectionStyle={section.style} />;
      case "team":
        return <TeamRender key={section.id} data={section.data as Parameters<typeof TeamRender>[0]["data"]} {...baseProps} />;
      case "pricing":
        return <PricingRender key={section.id} data={section.data as Parameters<typeof PricingRender>[0]["data"]} {...baseProps} sectionStyle={section.style} />;
      case "contact":
        return <ContactRender key={section.id} data={section.data as Parameters<typeof ContactRender>[0]["data"]} {...baseProps} siteSubdomain={siteSubdomain} />;
      case "faq":
        return <FaqRender key={section.id} data={section.data as Parameters<typeof FaqRender>[0]["data"]} {...baseProps} />;
      case "cta":
        return <CtaRender key={section.id} data={section.data as Parameters<typeof CtaRender>[0]["data"]} {...baseProps} />;
      case "stats":
        return <StatsRender key={section.id} data={section.data as Parameters<typeof StatsRender>[0]["data"]} {...baseProps} />;
      case "blog":
        return <BlogRender key={section.id} data={section.data as Parameters<typeof BlogRender>[0]["data"]} {...baseProps} siteSubdomain={siteSubdomain} siteId={siteId} />;
      case "partners":
        return <PartnersRender key={section.id} data={section.data as Parameters<typeof PartnersRender>[0]["data"]} {...baseProps} />;
      case "video":
        return <VideoRender key={section.id} data={section.data as Parameters<typeof VideoRender>[0]["data"]} {...baseProps} />;
      default:
        return null;
    }
  }

  // Non-hero sections for alternating background calculation
  const nonHeroSections = visibleSections.filter((s) => s.type !== "hero");

  function renderSection(section: (typeof visibleSections)[0]) {
    const content = renderSectionContent(section);
    if (!content) return null;
    // Hero manages its own background, skip wrapper for it
    if (section.type === "hero") return content;
    // Alternating default bg: even → background, odd → surface
    const idx = nonHeroSections.indexOf(section);
    const defaultBg = idx % 2 === 0 ? global.colors.background : global.colors.surface;
    return (
      <SectionWrapper key={`sw-${section.id}`} style={section.style} global={global} defaultBg={defaultBg}>
        {content}
      </SectionWrapper>
    );
  }

  return (
    <div
      style={{
        background: global.colors.background,
        color: global.colors.text,
        fontFamily: global.fonts.body,
        minHeight: "100vh",
      }}
    >
      {/* Global header */}
      {global.layout?.header && (
        <HeaderRender data={global.layout.header} global={global} isPreview={isPreview} basePath={basePath} />
      )}

      {/* Page content sections */}
      {visibleSections.map(renderSection)}

      {/* Global footer */}
      {global.layout?.footer && (
        <FooterRender data={global.layout.footer} global={global} isPreview={isPreview} basePath={basePath} />
      )}

      {global.whatsapp?.enabled && global.whatsapp.phoneNumber && (
        <WhatsAppButton phone={global.whatsapp.phoneNumber} message={global.whatsapp.message} />
      )}
      {global.cookieConsent?.enabled && (
        <CookieConsent
          text={global.cookieConsent.text}
          buttonText={global.cookieConsent.buttonText}
          linkUrl={global.cookieConsent.linkUrl}
          linkText={global.cookieConsent.linkText}
          global={global}
        />
      )}
    </div>
  );
}
