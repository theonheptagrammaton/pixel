"use client";

import { useState } from "react";
import { SiteSection, SiteGlobalConfig, SectionType, SectionStyle } from "@/types/template";
import { SectionStyleEditor } from "./SectionStyleEditor";
import { HeroEditor } from "./sections/HeroEditor";
import { AboutEditor } from "./sections/AboutEditor";
import { ServicesEditor } from "./sections/ServicesEditor";
import { GalleryEditor } from "./sections/GalleryEditor";
import { MenuEditor } from "./sections/MenuEditor";
import { TestimonialsEditor } from "./sections/TestimonialsEditor";
import { TeamEditor } from "./sections/TeamEditor";
import { PricingEditor } from "./sections/PricingEditor";
import { ContactEditor } from "./sections/ContactEditor";
import { FaqEditor } from "./sections/FaqEditor";
import { CtaEditor } from "./sections/CtaEditor";
import { StatsEditor } from "./sections/StatsEditor";
import { BlogEditor } from "./sections/BlogEditor";
import { PartnersEditor } from "./sections/PartnersEditor";
import { VideoEditor } from "./sections/VideoEditor";

interface Props {
  section: SiteSection;
  globalConfig: SiteGlobalConfig;
  onUpdate: (data: SiteSection["data"]) => void;
  onStyleUpdate?: (style: SectionStyle) => void;
}

const CARD_SECTIONS: SectionType[] = ["services", "testimonials", "pricing"];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const EDITORS: Record<SectionType, React.ComponentType<{ data: any; onChange: (d: any) => void; globalConfig: SiteGlobalConfig }>> = {
  hero: HeroEditor,
  about: AboutEditor,
  services: ServicesEditor,
  gallery: GalleryEditor,
  menu: MenuEditor,
  testimonials: TestimonialsEditor,
  team: TeamEditor,
  pricing: PricingEditor,
  contact: ContactEditor,
  faq: FaqEditor,
  cta: CtaEditor,
  stats: StatsEditor,
  blog: BlogEditor,
  partners: PartnersEditor,
  video: VideoEditor,
};

export function SectionFormRouter({ section, globalConfig, onUpdate, onStyleUpdate }: Props) {
  const [tab, setTab] = useState<"content" | "style">("content");
  const Editor = EDITORS[section.type];

  if (!Editor) {
    return (
      <div className="p-6 text-sm text-zinc-400">
        Bu bolum tipi icin editor bulunamadi: {section.type}
      </div>
    );
  }

  // Hero manages its own background; skip style tab for hero
  if (section.type === "hero" || !onStyleUpdate) {
    return <Editor data={section.data} onChange={onUpdate} globalConfig={globalConfig} />;
  }

  return (
    <div>
      <div className="flex border-b border-zinc-100 mb-4">
        <button
          onClick={() => setTab("content")}
          className={`px-4 py-2 text-xs font-semibold transition-colors ${
            tab === "content"
              ? "text-zinc-900 border-b-2 border-zinc-900"
              : "text-zinc-400 hover:text-zinc-600"
          }`}
        >
          Icerik
        </button>
        <button
          onClick={() => setTab("style")}
          className={`px-4 py-2 text-xs font-semibold transition-colors ${
            tab === "style"
              ? "text-zinc-900 border-b-2 border-zinc-900"
              : "text-zinc-400 hover:text-zinc-600"
          }`}
        >
          Stil
        </button>
      </div>

      {tab === "content" ? (
        <Editor data={section.data} onChange={onUpdate} globalConfig={globalConfig} />
      ) : (
        <SectionStyleEditor
          style={section.style ?? {}}
          onChange={onStyleUpdate}
          showCardStyle={CARD_SECTIONS.includes(section.type)}
        />
      )}
    </div>
  );
}
