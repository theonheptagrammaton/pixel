"use client";

import { SectionType, SiteGlobalConfig } from "@/types/template";

// Placeholder component type used until real section components are built
type SectionComponent = React.ComponentType<{
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any;
  global: SiteGlobalConfig;
}>;

interface TemplateRegistryEntry {
  metadata: {
    name: string;
    description: string;
    category: string;
    thumbnail: string;
    availableSections: SectionType[];
  };
  sections: Partial<Record<SectionType, SectionComponent>>;
}

// Generic placeholder component — renders a labelled block in the preview
function PlaceholderSection({
  data,
  label,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any;
  label: string;
}) {
  return (
    <div className="border-2 border-dashed border-zinc-300 rounded-lg p-8 text-center text-zinc-400 text-sm">
      <p className="font-medium">{label}</p>
      {data?.title && (
        <p className="mt-1 text-xs truncate">{String(data.title)}</p>
      )}
    </div>
  );
}

function makePlaceholder(label: string): SectionComponent {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const Component = ({ data }: { data: any; global: SiteGlobalConfig }) => (
    <PlaceholderSection data={data} label={label} />
  );
  Component.displayName = `Placeholder_${label}`;
  return Component;
}

const sharedSections: Partial<Record<SectionType, SectionComponent>> = {
  hero: makePlaceholder("Ana Gorsel"),
  about: makePlaceholder("Hakkimizda"),
  services: makePlaceholder("Hizmetler"),
  gallery: makePlaceholder("Galeri"),
  menu: makePlaceholder("Menu"),
  testimonials: makePlaceholder("Yorumlar"),
  team: makePlaceholder("Ekip"),
  pricing: makePlaceholder("Fiyatlandirma"),
  contact: makePlaceholder("Iletisim"),
  faq: makePlaceholder("SSS"),
  cta: makePlaceholder("Aksiyon Cagrisi"),
  stats: makePlaceholder("Istatistikler"),
  blog: makePlaceholder("Blog Yazilari"),
};

export const TEMPLATE_REGISTRY: Record<string, TemplateRegistryEntry> = {
  flavor: {
    metadata: {
      name: "Flavor",
      description: "Restoran ve kafe isletmeleri icin sicak, davetkar bir tema.",
      category: "restaurant",
      thumbnail: "/templates/thumbnails/flavor.jpg",
      availableSections: [
        "hero",
        "about",
        "menu",
        "gallery",
        "testimonials",
        "contact",
      ],
    },
    sections: sharedSections,
  },

  vertex: {
    metadata: {
      name: "Vertex",
      description: "Kurumsal ve digital ajanslar icin profesyonel, guven veren bir tema.",
      category: "business",
      thumbnail: "/templates/thumbnails/vertex.jpg",
      availableSections: [
        "hero",
        "about",
        "services",
        "team",
        "pricing",
        "testimonials",
        "cta",
        "contact",
      ],
    },
    sections: sharedSections,
  },

  showcase: {
    metadata: {
      name: "Showcase",
      description: "Yaratici profesyoneller ve sanatcilar icin sade, etkileyici portfolyo temasi.",
      category: "portfolio",
      thumbnail: "/templates/thumbnails/showcase.jpg",
      availableSections: [
        "hero",
        "about",
        "gallery",
        "services",
        "testimonials",
        "contact",
      ],
    },
    sections: sharedSections,
  },

  bloom: {
    metadata: {
      name: "Bloom",
      description: "Guzellik salonu, spa ve wellness isletmeleri icin zarif ve davetkar bir tema.",
      category: "guzellik",
      thumbnail: "/templates/thumbnails/bloom.jpg",
      availableSections: [
        "hero",
        "about",
        "services",
        "gallery",
        "testimonials",
        "pricing",
        "contact",
      ],
    },
    sections: sharedSections,
  },

  pulse: {
    metadata: {
      name: "Pulse",
      description: "Spor salonu, fitness merkezi ve saglik kulubu icin enerjik, guclu bir tema.",
      category: "saglik",
      thumbnail: "/templates/thumbnails/pulse.jpg",
      availableSections: [
        "hero",
        "stats",
        "services",
        "team",
        "testimonials",
        "pricing",
        "cta",
        "contact",
      ],
    },
    sections: sharedSections,
  },

  craft: {
    metadata: {
      name: "Craft",
      description: "Blog yazarlari, icerik ureticileri ve kisisel markalar icin minimal, okunakli bir tema.",
      category: "blog",
      thumbnail: "/templates/thumbnails/craft.jpg",
      availableSections: [
        "hero",
        "about",
        "blog",
        "testimonials",
        "contact",
      ],
    },
    sections: sharedSections,
  },

  zenith: {
    metadata: {
      name: "Zenith",
      description: "Otel, butik otel ve tatil konaklari icin lüks, sofistike bir tema.",
      category: "otel",
      thumbnail: "/templates/thumbnails/zenith.jpg",
      availableSections: [
        "hero",
        "about",
        "gallery",
        "services",
        "pricing",
        "testimonials",
        "contact",
      ],
    },
    sections: sharedSections,
  },

  forge: {
    metadata: {
      name: "Forge",
      description: "Teknoloji girisimleri ve dijital ajanslari icin modern, keskin bir tema.",
      category: "teknoloji",
      thumbnail: "/templates/thumbnails/forge.jpg",
      availableSections: [
        "hero",
        "stats",
        "services",
        "team",
        "pricing",
        "testimonials",
        "cta",
        "contact",
      ],
    },
    sections: sharedSections,
  },
};

export function getTemplateEntry(slug: string): TemplateRegistryEntry | null {
  return TEMPLATE_REGISTRY[slug] ?? null;
}

export function getTemplateSections(
  slug: string
): SectionType[] {
  return TEMPLATE_REGISTRY[slug]?.metadata.availableSections ?? [];
}

export function getSectionComponent(
  templateSlug: string,
  sectionType: SectionType
): SectionComponent | null {
  return TEMPLATE_REGISTRY[templateSlug]?.sections[sectionType] ?? null;
}
