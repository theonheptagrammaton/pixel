import { create } from "zustand";
import {
  SiteConfig,
  SiteGlobalConfig,
  SiteSection,
  SitePage,
  SectionType,
  SectionStyle,
  HeaderData,
  FooterData,
} from "@/types/template";

export interface StoredSite {
  id: string;
  subdomain: string;
  customDomain: string | null;
  domainVerified: boolean;
  templateId: string;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

interface EditorState {
  site: StoredSite | null;
  config: SiteConfig | null;
  currentPageId: string | null;
  selectedSectionId: string | null;
  editingLayout: "header" | "footer" | null;
  showGlobalSettings: boolean;
  isDirty: boolean;
  isSaving: boolean;
  previewDevice: "desktop" | "tablet" | "mobile";
  previewPageSlug: string;

  // Undo/Redo
  history: string[];
  historyIndex: number;

  // Init
  setSite: (site: StoredSite) => void;
  setConfig: (config: SiteConfig) => void;

  // Page management
  setCurrentPage: (pageId: string) => void;
  addPage: (name: string, slug: string) => void;
  removePage: (pageId: string) => void;
  renamePage: (pageId: string, name: string) => void;

  // Section management (within current page)
  selectSection: (sectionId: string | null) => void;
  updateSectionData: (sectionId: string, data: Partial<SiteSection["data"]>) => void;
  updateSectionStyle: (sectionId: string, style: SectionStyle) => void;
  toggleSectionVisibility: (sectionId: string) => void;
  reorderSections: (fromIndex: number, toIndex: number) => void;
  addSection: (type: SectionType, afterIndex?: number) => void;
  removeSection: (sectionId: string) => void;

  // Global layout (header/footer)
  setEditingLayout: (which: "header" | "footer" | null) => void;
  updateLayout: (updates: { header?: Partial<HeaderData>; footer?: Partial<FooterData> }) => void;

  // Global config
  setShowGlobalSettings: (show: boolean) => void;
  updateGlobalConfig: (updates: Partial<SiteGlobalConfig>) => void;

  // Preview
  setPreviewDevice: (device: "desktop" | "tablet" | "mobile") => void;
  setPreviewPageSlug: (slug: string) => void;

  // Undo/Redo
  pushHistory: () => void;
  undo: () => void;
  redo: () => void;
  canUndo: () => boolean;
  canRedo: () => boolean;

  // Persist
  saveConfig: () => Promise<void>;
  setDirty: (dirty: boolean) => void;
  reset: () => void;
}

function generateId(prefix: string): string {
  return `${prefix}-${Math.random().toString(36).slice(2, 9)}`;
}

function defaultSectionData(type: SectionType): SiteSection["data"] {
  const defaults: Record<SectionType, SiteSection["data"]> = {
    hero: {
      title: "Baslik Buraya Gelecek",
      subtitle: "Alt Baslik",
      description: "Kisa aciklama metni buraya gelecek.",
      backgroundImage: "",
      ctaText: "Hemen Baslat",
      ctaLink: "/iletisim",
      alignment: "center",
      overlayOpacity: 40,
      height: "full",
    },
    about: {
      title: "Hakkimizda",
      subtitle: "",
      description: "Sirketimiz hakkinda kisaca bilgi.",
      image: "",
      features: [],
      layout: "image-right",
    },
    services: {
      title: "Hizmetlerimiz",
      subtitle: "",
      items: [],
      layout: "grid",
      columns: 3,
    },
    gallery: {
      title: "Galeri",
      subtitle: "",
      images: [],
      layout: "grid",
      columns: 3,
    },
    menu: {
      title: "Menumuzu Kesfedin",
      subtitle: "",
      categories: [],
      layout: "simple",
      showImages: false,
    },
    testimonials: {
      title: "Musterilerimiz Ne Diyor?",
      subtitle: "",
      items: [],
      layout: "grid",
    },
    team: {
      title: "Ekibimiz",
      subtitle: "",
      members: [],
      layout: "grid",
    },
    pricing: {
      title: "Fiyatlandirma",
      subtitle: "",
      plans: [],
    },
    contact: {
      title: "Iletisim",
      subtitle: "Bizimle iletisime gecin.",
      showMap: false,
      showForm: true,
      formFields: [
        { name: "name", type: "text", label: "Adiniz", required: true },
        { name: "email", type: "email", label: "Email", required: true },
        { name: "message", type: "textarea", label: "Mesajiniz", required: true },
      ],
    },
    faq: {
      title: "Sikca Sorulan Sorular",
      subtitle: "",
      items: [],
    },
    cta: {
      title: "Harekete Gecin",
      description: "Hemen baslayin ve farki gorün.",
      buttonText: "Baslayalim",
      buttonLink: "/iletisim",
    },
    stats: {
      items: [
        { value: "100", suffix: "+", label: "Musteri" },
        { value: "5", suffix: " Yil", label: "Deneyim" },
      ],
      layout: "grid",
      background: "primary",
    },
    blog: {
      title: "Blog",
      subtitle: "",
      layout: "grid",
      showReadMore: true,
      postsPerPage: 6,
      showCategories: true,
    },
    partners: {
      title: "Partnerlerimiz",
      subtitle: "Birlikte calistigimiz markalar",
      items: [],
      layout: "grid",
      grayscale: true,
      columns: 4,
    },
    video: {
      title: "",
      subtitle: "",
      videoUrl: "",
      thumbnailImage: "",
      overlayText: "",
      autoplay: false,
      layout: "contained",
    },
  };
  return defaults[type];
}

function getCurrentPageSections(config: SiteConfig, currentPageId: string): SiteSection[] {
  return config.pages.find((p) => p.id === currentPageId)?.sections ?? [];
}

function updatePageSections(
  pages: SitePage[],
  pageId: string,
  updater: (sections: SiteSection[]) => SiteSection[]
): SitePage[] {
  return pages.map((p) =>
    p.id === pageId ? { ...p, sections: updater(p.sections) } : p
  );
}

const MAX_HISTORY = 30;

export const useEditorStore = create<EditorState>((set, get) => ({
  site: null,
  config: null,
  currentPageId: null,
  selectedSectionId: null,
  editingLayout: null,
  showGlobalSettings: false,
  isDirty: false,
  isSaving: false,
  previewDevice: "desktop",
  previewPageSlug: "",
  history: [],
  historyIndex: -1,

  pushHistory: () => {
    const { config, history, historyIndex } = get();
    if (!config) return;
    const snapshot = JSON.stringify(config);
    // Truncate any redo entries
    const truncated = history.slice(0, historyIndex + 1);
    truncated.push(snapshot);
    // Limit to MAX_HISTORY
    if (truncated.length > MAX_HISTORY) truncated.shift();
    set({ history: truncated, historyIndex: truncated.length - 1 });
  },

  undo: () => {
    const { history, historyIndex, config } = get();
    if (historyIndex < 0 || !config) return;
    // If we're at the end and haven't saved current state, save it first
    if (historyIndex === history.length - 1) {
      const snapshot = JSON.stringify(config);
      const newHistory = [...history, snapshot];
      if (newHistory.length > MAX_HISTORY + 1) newHistory.shift();
      const parsed = JSON.parse(history[historyIndex]) as SiteConfig;
      set({ config: parsed, isDirty: true, history: newHistory, historyIndex: historyIndex });
      return;
    }
    if (historyIndex <= 0) return;
    const newIndex = historyIndex - 1;
    const parsed = JSON.parse(history[newIndex]) as SiteConfig;
    set({ config: parsed, isDirty: true, historyIndex: newIndex });
  },

  redo: () => {
    const { history, historyIndex } = get();
    if (historyIndex >= history.length - 1) return;
    const newIndex = historyIndex + 1;
    const parsed = JSON.parse(history[newIndex]) as SiteConfig;
    set({ config: parsed, isDirty: true, historyIndex: newIndex });
  },

  canUndo: () => {
    const { historyIndex } = get();
    return historyIndex >= 0;
  },

  canRedo: () => {
    const { history, historyIndex } = get();
    return historyIndex < history.length - 1;
  },

  setSite: (site) => set({ site }),

  setConfig: (rawConfig) => {
    // Migrate legacy configs to multi-page format with global layout
    const config: SiteConfig = (() => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const raw = rawConfig as any;
      const global = raw.global ?? {};

      // Ensure global.layout exists (added in multi-page migration)
      const layout = global.layout ?? {
        header: {
          layout: "left-aligned",
          sticky: true,
          transparent: false,
          menuItems: [
            { label: "Ana Sayfa", link: "/" },
            { label: "Hizmetler", link: "/hizmetler" },
            { label: "Iletisim", link: "/iletisim" },
          ],
        },
        footer: {
          layout: "simple",
          copyright: `© ${new Date().getFullYear()} ${global.general?.businessName ?? ""}`,
          showSocialLinks: true,
          showNewsletter: false,
        },
      };

      // Ensure all required global sub-objects have defaults
      const defaultGeneral = {
        businessName: "", tagline: "", logo: "", phone: "", email: "", address: "",
        socialLinks: { instagram: "", twitter: "", facebook: "", linkedin: "", youtube: "", tiktok: "" },
      };
      const defaultColors = {
        primary: "#2563eb", secondary: "#1e40af", accent: "#f59e0b",
        background: "#ffffff", surface: "#f9fafb", text: "#111827", textLight: "#6b7280",
      };
      const defaultFonts = { heading: "Inter", body: "Inter" };
      const defaultSeo = { title: "", description: "", ogImage: "", favicon: "", keywords: [] as string[] };

      const mergedGeneral = { ...defaultGeneral, ...(global.general ?? {}), socialLinks: { ...defaultGeneral.socialLinks, ...(global.general?.socialLinks ?? {}) } };
      const migratedGlobal = {
        ...global,
        general: mergedGeneral,
        colors: { ...defaultColors, ...(global.colors ?? {}) },
        fonts: { ...defaultFonts, ...(global.fonts ?? {}) },
        seo: { ...defaultSeo, ...(global.seo ?? {}) },
        layout,
      };

      if (!raw.pages && Array.isArray(raw.sections)) {
        // Extract header/footer sections into global.layout if not already set
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const headerSection = raw.sections.find((s: any) => s.type === "header");
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const footerSection = raw.sections.find((s: any) => s.type === "footer");
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const contentSections = raw.sections.filter((s: any) => s.type !== "header" && s.type !== "footer");

        const resolvedLayout = {
          header: headerSection?.data ?? layout.header,
          footer: footerSection?.data ?? layout.footer,
        };

        return {
          global: { ...migratedGlobal, layout: resolvedLayout },
          pages: [{
            id: generateId("page"),
            name: "Ana Sayfa",
            slug: "",
            order: 0,
            sections: contentSections,
          }],
        } as SiteConfig;
      }

      // Even if pages exist, ensure global.layout is present
      return { ...rawConfig, global: migratedGlobal };
    })();

    // Ensure pages array exists with at least one page
    if (!Array.isArray(config.pages) || config.pages.length === 0) {
      config.pages = [{
        id: generateId("page"),
        name: "Ana Sayfa",
        slug: "",
        order: 0,
        sections: [],
      }];
    }

    const firstPageId = config.pages[0]?.id ?? null;
    const firstSlug = config.pages[0]?.slug ?? "";
    set({
      config,
      isDirty: false,
      currentPageId: firstPageId,
      previewPageSlug: firstSlug,
    });
  },

  setCurrentPage: (pageId) => {
    const { config } = get();
    const page = config?.pages.find((p) => p.id === pageId);
    set({
      currentPageId: pageId,
      selectedSectionId: null,
      editingLayout: null,
      showGlobalSettings: false,
      previewPageSlug: page?.slug ?? "",
    });
  },

  addPage: (name, slug) => {
    get().pushHistory();
    set((state) => {
      if (!state.config) return state;
      const newPage: SitePage = {
        id: generateId("page"),
        name,
        slug,
        order: state.config.pages.length,
        sections: [],
      };
      const pages = [...state.config.pages, newPage];
      return {
        config: { ...state.config, pages },
        currentPageId: newPage.id,
        selectedSectionId: null,
        editingLayout: null,
        previewPageSlug: slug,
        isDirty: true,
      };
    });
  },

  removePage: (pageId) => {
    get().pushHistory();
    set((state) => {
      if (!state.config) return state;
      if (state.config.pages.length <= 1) return state; // keep at least 1
      const pages = state.config.pages
        .filter((p) => p.id !== pageId)
        .map((p, i) => ({ ...p, order: i }));
      const newCurrentId = state.currentPageId === pageId ? pages[0]?.id ?? null : state.currentPageId;
      const newSlug = pages.find((p) => p.id === newCurrentId)?.slug ?? "";
      return {
        config: { ...state.config, pages },
        currentPageId: newCurrentId,
        selectedSectionId: null,
        previewPageSlug: newSlug,
        isDirty: true,
      };
    });
  },

  renamePage: (pageId, name) => {
    get().pushHistory();
    set((state) => {
      if (!state.config) return state;
      const pages = state.config.pages.map((p) =>
        p.id === pageId ? { ...p, name } : p
      );
      return { config: { ...state.config, pages }, isDirty: true };
    });
  },

  selectSection: (sectionId) =>
    set({ selectedSectionId: sectionId, editingLayout: null, showGlobalSettings: false }),

  updateSectionData: (sectionId, data) => {
    get().pushHistory();
    set((state) => {
      if (!state.config || !state.currentPageId) return state;
      const pages = updatePageSections(state.config.pages, state.currentPageId, (sections) =>
        sections.map((s) =>
          s.id === sectionId ? ({ ...s, data: { ...s.data, ...data } } as SiteSection) : s
        )
      );
      return { config: { ...state.config, pages }, isDirty: true };
    });
  },

  updateSectionStyle: (sectionId, style) => {
    get().pushHistory();
    set((state) => {
      if (!state.config || !state.currentPageId) return state;
      const pages = updatePageSections(state.config.pages, state.currentPageId, (sections) =>
        sections.map((s) =>
          s.id === sectionId ? { ...s, style } : s
        )
      );
      return { config: { ...state.config, pages }, isDirty: true };
    });
  },

  toggleSectionVisibility: (sectionId) => {
    get().pushHistory();
    set((state) => {
      if (!state.config || !state.currentPageId) return state;
      const pages = updatePageSections(state.config.pages, state.currentPageId, (sections) =>
        sections.map((s) =>
          s.id === sectionId ? ({ ...s, isVisible: !s.isVisible } as SiteSection) : s
        )
      );
      return { config: { ...state.config, pages }, isDirty: true };
    });
  },

  reorderSections: (fromIndex, toIndex) => {
    get().pushHistory();
    set((state) => {
      if (!state.config || !state.currentPageId) return state;
      const pages = updatePageSections(state.config.pages, state.currentPageId, (sections) => {
        const arr = [...sections];
        const [moved] = arr.splice(fromIndex, 1);
        arr.splice(toIndex, 0, moved);
        return arr.map((s, i) => ({ ...s, order: i }));
      });
      return { config: { ...state.config, pages }, isDirty: true };
    });
  },

  addSection: (type, afterIndex) => {
    get().pushHistory();
    set((state) => {
      if (!state.config || !state.currentPageId) return state;
      const currentSections = getCurrentPageSections(state.config, state.currentPageId);
      const newSection: SiteSection = {
        id: generateId(type),
        type,
        data: defaultSectionData(type),
        isVisible: true,
        order: currentSections.length,
      };
      const pages = updatePageSections(state.config.pages, state.currentPageId, (sections) => {
        const arr = [...sections];
        const insertAt = afterIndex !== undefined ? afterIndex + 1 : arr.length;
        arr.splice(insertAt, 0, newSection);
        return arr.map((s, i) => ({ ...s, order: i }));
      });
      return { config: { ...state.config, pages }, isDirty: true };
    });
  },

  removeSection: (sectionId) => {
    get().pushHistory();
    set((state) => {
      if (!state.config || !state.currentPageId) return state;
      const pages = updatePageSections(state.config.pages, state.currentPageId, (sections) =>
        sections.filter((s) => s.id !== sectionId).map((s, i) => ({ ...s, order: i }))
      );
      return {
        config: { ...state.config, pages },
        selectedSectionId:
          state.selectedSectionId === sectionId ? null : state.selectedSectionId,
        isDirty: true,
      };
    });
  },

  setEditingLayout: (which) =>
    set({ editingLayout: which, selectedSectionId: null, showGlobalSettings: false }),

  updateLayout: (updates) => {
    get().pushHistory();
    set((state) => {
      if (!state.config) return state;
      const currentLayout = state.config.global.layout;
      return {
        config: {
          ...state.config,
          global: {
            ...state.config.global,
            layout: {
              header: updates.header ? { ...currentLayout.header, ...updates.header } : currentLayout.header,
              footer: updates.footer ? { ...currentLayout.footer, ...updates.footer } : currentLayout.footer,
            },
          },
        },
        isDirty: true,
      };
    });
  },

  setShowGlobalSettings: (show) =>
    set({ showGlobalSettings: show, selectedSectionId: null, editingLayout: null }),

  updateGlobalConfig: (updates) => {
    get().pushHistory();
    set((state) => {
      if (!state.config) return state;
      return {
        config: { ...state.config, global: { ...state.config.global, ...updates } },
        isDirty: true,
      };
    });
  },

  setPreviewDevice: (device) => set({ previewDevice: device }),

  setPreviewPageSlug: (slug) => set({ previewPageSlug: slug }),

  saveConfig: async () => {
    const { site, config } = get();
    if (!site || !config) return;
    set({ isSaving: true });
    try {
      const res = await fetch(`/api/sites/${site.id}/config`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ config }),
      });
      if (res.ok) set({ isDirty: false });
    } finally {
      set({ isSaving: false });
    }
  },

  setDirty: (dirty) => set({ isDirty: dirty }),

  reset: () =>
    set({
      site: null,
      config: null,
      currentPageId: null,
      selectedSectionId: null,
      editingLayout: null,
      showGlobalSettings: false,
      isDirty: false,
      isSaving: false,
      previewDevice: "desktop",
      previewPageSlug: "",
      history: [],
      historyIndex: -1,
    }),
}));
