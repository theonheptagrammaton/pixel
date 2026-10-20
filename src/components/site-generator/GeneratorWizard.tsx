"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { SECTORS, SiteGenerationOptions } from "@/lib/ai-site-generator";
import type { HeroVariant, CardStyle } from "@/types/template";

type Step = 1 | 2 | 3 | 4 | 5;

// ─── Preset Palettes ──────────────────────────────────────────────────────────

const PRESET_PALETTES = [
  { id: "sector", label: "Sektöre Özel", colors: null },
  {
    id: "warm",
    label: "Sıcak",
    colors: { primary: "#dc2626", secondary: "#b91c1c", accent: "#f97316", background: "#fffbeb", surface: "#ffffff", text: "#1c1917", textLight: "#78716c" },
  },
  {
    id: "ocean",
    label: "Okyanus",
    colors: { primary: "#0284c7", secondary: "#0369a1", accent: "#38bdf8", background: "#f0f9ff", surface: "#ffffff", text: "#0f172a", textLight: "#64748b" },
  },
  {
    id: "forest",
    label: "Orman",
    colors: { primary: "#15803d", secondary: "#166534", accent: "#4ade80", background: "#f0fdf4", surface: "#ffffff", text: "#0f172a", textLight: "#64748b" },
  },
  {
    id: "midnight",
    label: "Gece",
    colors: { primary: "#6366f1", secondary: "#4f46e5", accent: "#818cf8", background: "#0f0f23", surface: "#1a1a2e", text: "#f1f5f9", textLight: "#94a3b8" },
  },
  {
    id: "rose",
    label: "Gül",
    colors: { primary: "#e11d48", secondary: "#be123c", accent: "#fb7185", background: "#fff1f2", surface: "#ffffff", text: "#1c1917", textLight: "#78716c" },
  },
  {
    id: "slate",
    label: "Kurşuni",
    colors: { primary: "#334155", secondary: "#1e293b", accent: "#64748b", background: "#f8fafc", surface: "#ffffff", text: "#0f172a", textLight: "#64748b" },
  },
  {
    id: "amber",
    label: "Kehribar",
    colors: { primary: "#d97706", secondary: "#b45309", accent: "#fbbf24", background: "#fffbeb", surface: "#ffffff", text: "#1c1917", textLight: "#78716c" },
  },
  {
    id: "obsidian",
    label: "Obsidyen",
    colors: { primary: "#ffffff", secondary: "#a3a3a3", accent: "#e5e5e5", background: "#0a0a0a", surface: "#171717", text: "#f5f5f5", textLight: "#a3a3a3" },
  },
  {
    id: "purple",
    label: "Mor",
    colors: { primary: "#7c3aed", secondary: "#6d28d9", accent: "#a78bfa", background: "#faf5ff", surface: "#ffffff", text: "#1e1b4b", textLight: "#6b7280" },
  },
];

// ─── Preset Font Pairs ────────────────────────────────────────────────────────

const PRESET_FONT_PAIRS = [
  { id: "sector", label: "Sektöre Özel", fonts: null },
  { id: "modern", label: "Modern", fonts: { heading: "Space Grotesk", body: "Inter" } },
  { id: "editorial", label: "Editöryal", fonts: { heading: "Playfair Display", body: "Source Sans 3" } },
  { id: "elegant", label: "Zarif", fonts: { heading: "Cormorant Garamond", body: "Raleway" } },
  { id: "bold", label: "Cesur", fonts: { heading: "Oswald", body: "Inter" } },
  { id: "classic", label: "Klasik", fonts: { heading: "Merriweather", body: "Open Sans" } },
  { id: "warm", label: "Sıcak", fonts: { heading: "Lora", body: "Source Sans 3" } },
  { id: "corporate", label: "Kurumsal", fonts: { heading: "Montserrat", body: "Open Sans" } },
  { id: "friendly", label: "Samimi", fonts: { heading: "Poppins", body: "Inter" } },
];

const HERO_VARIANTS: { id: HeroVariant; label: string }[] = [
  { id: "default", label: "Standart" },
  { id: "split", label: "Bölünmüş" },
  { id: "gradient", label: "Gradient" },
  { id: "video", label: "Video" },
  { id: "slider", label: "Slider" },
];

const CARD_STYLES: { id: CardStyle; label: string }[] = [
  { id: "default", label: "Varsayılan" },
  { id: "minimal", label: "Minimal" },
  { id: "bordered", label: "Kenarlıklı" },
  { id: "glass", label: "Cam" },
  { id: "gradient", label: "Gradient" },
  { id: "shadow", label: "Gölgeli" },
];

const SPACING_OPTIONS = [
  { id: "compact" as const, label: "Dar" },
  { id: "normal" as const, label: "Normal" },
  { id: "spacious" as const, label: "Geniş" },
];

const STEP_LABELS = ["Bilgiler", "Stil", "Sayfalar", "Önizleme", "Tamamlandı"];

export default function GeneratorWizard() {
  const router = useRouter();
  const [step, setStep] = useState<Step>(1);
  const [businessName, setBusinessName] = useState("");
  const [sectorId, setSectorId] = useState<string | null>(null);
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Step 2 state
  const [paletteId, setPaletteId] = useState("sector");
  const [fontPairId, setFontPairId] = useState("sector");
  const [heroVariant, setHeroVariant] = useState<HeroVariant>("default");
  const [cardStyle, setCardStyle] = useState<CardStyle>("default");
  const [spacing, setSpacing] = useState<"compact" | "normal" | "spacious">("normal");

  // Step 3 state — page/section selections
  const [pageSelections, setPageSelections] = useState<Record<string, { enabled: boolean; sections: string[] }>>({});

  const selectedSector = SECTORS.find((s) => s.id === sectorId);

  // Get effective palette
  const effectivePalette = paletteId === "sector"
    ? selectedSector?.colorPalette
    : PRESET_PALETTES.find((p) => p.id === paletteId)?.colors ?? selectedSector?.colorPalette;

  // Get effective fonts
  const effectiveFonts = fontPairId === "sector"
    ? selectedSector?.fonts
    : PRESET_FONT_PAIRS.find((f) => f.id === fontPairId)?.fonts ?? selectedSector?.fonts;

  function initPageSelections() {
    if (!selectedSector) return;
    const selections: Record<string, { enabled: boolean; sections: string[] }> = {};
    selectedSector.pages.forEach((p) => {
      selections[p.slug] = { enabled: true, sections: [...p.sectionTypes] };
    });
    setPageSelections(selections);
  }

  function togglePage(slug: string) {
    if (slug === "/") return; // Ana Sayfa locked
    setPageSelections((prev) => ({
      ...prev,
      [slug]: { ...prev[slug], enabled: !prev[slug].enabled },
    }));
  }

  function toggleSection(pageSlug: string, sectionType: string) {
    if (sectionType === "hero") return; // Hero locked
    setPageSelections((prev) => {
      const current = prev[pageSlug];
      const sections = current.sections.includes(sectionType)
        ? current.sections.filter((s) => s !== sectionType)
        : [...current.sections, sectionType];
      return { ...prev, [pageSlug]: { ...current, sections } };
    });
  }

  function goToStep2() {
    if (!businessName.trim() || !sectorId) return;
    setStep(2);
  }

  function goToStep3() {
    initPageSelections();
    setStep(3);
  }

  function goToStep4() {
    setStep(4);
  }

  async function handleGenerate() {
    if (!businessName.trim() || !sectorId) return;
    setLoading(true);
    setError("");

    // Build options
    const options: SiteGenerationOptions = {};

    if (paletteId !== "sector") {
      const palette = PRESET_PALETTES.find((p) => p.id === paletteId);
      if (palette?.colors) options.colorPalette = palette.colors;
    }
    if (fontPairId !== "sector") {
      const fontPair = PRESET_FONT_PAIRS.find((f) => f.id === fontPairId);
      if (fontPair?.fonts) options.fonts = fontPair.fonts;
    }
    if (heroVariant !== "default") options.heroVariant = heroVariant;
    if (cardStyle !== "default") options.cardStyle = cardStyle;
    if (spacing !== "normal") options.spacing = spacing;

    // Build page overrides
    const enabledPages = Object.entries(pageSelections).filter(([, v]) => v.enabled);
    if (enabledPages.length > 0) {
      options.pageOverrides = enabledPages.map(([slug, v]) => ({
        slug,
        sectionTypes: v.sections,
      }));
    }

    try {
      const res = await fetch("/api/sites/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          businessName: businessName.trim(),
          sectorId,
          description: description.trim() || undefined,
          options: Object.keys(options).length > 0 ? options : undefined,
        }),
      });
      const data = await res.json();
      if (!data.success) {
        setError(data.error || "Bir hata oluştu.");
        setLoading(false);
        return;
      }
      setStep(5);
    } catch {
      setError("Sunucu hatası. Tekrar deneyin.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-white flex flex-col items-center px-4 py-12">
      {/* Step Indicator */}
      <div className="flex items-center gap-0 mb-12">
        {[1, 2, 3, 4, 5].map((s, i) => (
          <div key={s} className="flex items-center">
            <div className="flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold border-2 transition-colors ${
                  step >= s
                    ? "bg-black text-white border-black"
                    : "bg-white text-gray-400 border-gray-300"
                }`}
              >
                {step > s ? (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  s
                )}
              </div>
              <span className={`text-[10px] mt-1 ${step >= s ? "text-black" : "text-gray-400"}`}>
                {STEP_LABELS[i]}
              </span>
            </div>
            {i < 4 && (
              <div className={`w-10 sm:w-16 h-0.5 mb-4 ${step > s ? "bg-black" : "bg-gray-300"}`} />
            )}
          </div>
        ))}
      </div>

      <div className="w-full max-w-2xl">
        {/* ─── Step 1: Business Info ─── */}
        {step === 1 && (
          <div>
            <h1 className="text-2xl font-bold text-black mb-1">İşletme Bilgileri</h1>
            <p className="text-gray-500 mb-8">İşletmeniz hakkında temel bilgileri girin</p>

            <label className="block text-sm font-medium text-black mb-2">İşletme Adınız *</label>
            <input
              type="text"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              placeholder="Örneğin: Lezzet Durağı"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-black placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-black focus:border-black mb-8"
            />

            <label className="block text-sm font-medium text-black mb-3">Sektör Seçin *</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8">
              {SECTORS.map((sector) => (
                <button
                  key={sector.id}
                  onClick={() => setSectorId(sector.id)}
                  className={`p-4 rounded-lg border-2 text-left transition-all ${
                    sectorId === sector.id
                      ? "border-black bg-black text-white"
                      : "border-gray-200 bg-white text-black hover:border-gray-400"
                  }`}
                >
                  <span className="text-sm font-medium">{sector.label}</span>
                </button>
              ))}
            </div>

            <label className="block text-sm font-medium text-black mb-2">Kısa Açıklama (opsiyonel)</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="İşletmenizi kısa bir cümleyle tanıtın..."
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-black placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-black focus:border-black resize-none mb-8"
            />

            <button
              onClick={goToStep2}
              disabled={!businessName.trim() || !sectorId}
              className="w-full py-3 bg-black text-white font-medium rounded-lg hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              Devam Et
            </button>
          </div>
        )}

        {/* ─── Step 2: Style Selection ─── */}
        {step === 2 && (
          <div>
            <h1 className="text-2xl font-bold text-black mb-1">Stil Seçimi</h1>
            <p className="text-gray-500 mb-8">Sitenizin görünümünü özelleştirin</p>

            {/* Color Palette */}
            <label className="block text-sm font-medium text-black mb-3">Renk Paleti</label>
            <div className="flex gap-3 overflow-x-auto pb-3 mb-6 -mx-1 px-1">
              {PRESET_PALETTES.map((palette) => {
                const colors = palette.colors ?? selectedSector?.colorPalette;
                return (
                  <button
                    key={palette.id}
                    onClick={() => setPaletteId(palette.id)}
                    className={`flex-shrink-0 p-3 rounded-lg border-2 transition-all ${
                      paletteId === palette.id ? "border-black" : "border-gray-200 hover:border-gray-400"
                    }`}
                  >
                    <div className="flex gap-1 mb-2">
                      {colors && [colors.primary, colors.accent, colors.background, colors.surface, colors.text].map((c, i) => (
                        <div key={i} className="w-5 h-5 rounded-full border border-gray-200" style={{ backgroundColor: c }} />
                      ))}
                    </div>
                    <span className="text-xs font-medium text-black whitespace-nowrap">{palette.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Font Pairs */}
            <label className="block text-sm font-medium text-black mb-3">Font Çifti</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
              {PRESET_FONT_PAIRS.map((pair) => {
                const fonts = pair.fonts ?? selectedSector?.fonts;
                return (
                  <button
                    key={pair.id}
                    onClick={() => setFontPairId(pair.id)}
                    className={`p-3 rounded-lg border-2 text-left transition-all ${
                      fontPairId === pair.id ? "border-black" : "border-gray-200 hover:border-gray-400"
                    }`}
                  >
                    <span className="text-xs text-gray-500">{pair.label}</span>
                    {fonts && (
                      <div className="mt-1">
                        <p className="text-sm font-semibold text-black truncate">{fonts.heading}</p>
                        <p className="text-xs text-gray-500 truncate">{fonts.body}</p>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Hero Variant */}
            <label className="block text-sm font-medium text-black mb-3">Hero Varyantı</label>
            <div className="flex gap-3 mb-6 flex-wrap">
              {HERO_VARIANTS.map((v) => (
                <button
                  key={v.id}
                  onClick={() => setHeroVariant(v.id)}
                  className={`px-4 py-2 rounded-lg border-2 text-sm font-medium transition-all ${
                    heroVariant === v.id
                      ? "border-black bg-black text-white"
                      : "border-gray-200 text-black hover:border-gray-400"
                  }`}
                >
                  {v.label}
                </button>
              ))}
            </div>

            {/* Card Style */}
            <label className="block text-sm font-medium text-black mb-3">Kart Stili</label>
            <div className="grid grid-cols-3 gap-3 mb-6">
              {CARD_STYLES.map((cs) => (
                <button
                  key={cs.id}
                  onClick={() => setCardStyle(cs.id)}
                  className={`p-3 rounded-lg border-2 text-center transition-all ${
                    cardStyle === cs.id
                      ? "border-black bg-black text-white"
                      : "border-gray-200 text-black hover:border-gray-400"
                  }`}
                >
                  <span className="text-sm font-medium">{cs.label}</span>
                </button>
              ))}
            </div>

            {/* Spacing */}
            <label className="block text-sm font-medium text-black mb-3">Boşluk</label>
            <div className="flex gap-3 mb-8">
              {SPACING_OPTIONS.map((sp) => (
                <button
                  key={sp.id}
                  onClick={() => setSpacing(sp.id)}
                  className={`flex-1 py-2.5 rounded-lg border-2 text-sm font-medium transition-all ${
                    spacing === sp.id
                      ? "border-black bg-black text-white"
                      : "border-gray-200 text-black hover:border-gray-400"
                  }`}
                >
                  {sp.label}
                </button>
              ))}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setStep(1)}
                className="flex-1 py-3 bg-white text-black font-medium rounded-lg border-2 border-gray-300 hover:border-black transition-colors"
              >
                Geri Dön
              </button>
              <button
                onClick={goToStep3}
                className="flex-1 py-3 bg-black text-white font-medium rounded-lg hover:bg-gray-800 transition-colors"
              >
                Devam Et
              </button>
            </div>
          </div>
        )}

        {/* ─── Step 3: Pages & Sections ─── */}
        {step === 3 && selectedSector && (
          <div>
            <h1 className="text-2xl font-bold text-black mb-1">Sayfalar ve Bölümler</h1>
            <p className="text-gray-500 mb-8">Hangi sayfaları ve bölümleri istediğinizi seçin</p>

            <div className="space-y-4 mb-8">
              {selectedSector.pages.map((pageDef) => {
                const sel = pageSelections[pageDef.slug];
                if (!sel) return null;
                const isHome = pageDef.slug === "/";
                return (
                  <div key={pageDef.slug} className={`border-2 rounded-lg overflow-hidden transition-colors ${sel.enabled ? "border-black" : "border-gray-200 opacity-60"}`}>
                    {/* Page header */}
                    <div className="flex items-center gap-3 px-4 py-3 bg-gray-50">
                      <button
                        onClick={() => togglePage(pageDef.slug)}
                        disabled={isHome}
                        className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                          sel.enabled ? "bg-black border-black" : "bg-white border-gray-300"
                        } ${isHome ? "cursor-not-allowed" : "cursor-pointer"}`}
                      >
                        {sel.enabled && (
                          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </button>
                      <span className="text-sm font-semibold text-black">{pageDef.name}</span>
                      {isHome && <span className="text-[10px] bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full">Zorunlu</span>}
                    </div>

                    {/* Section checkboxes */}
                    {sel.enabled && (
                      <div className="px-4 py-3 flex flex-wrap gap-2">
                        {pageDef.sectionTypes.map((sType) => {
                          const isHero = sType === "hero";
                          const isChecked = sel.sections.includes(sType);
                          return (
                            <button
                              key={sType}
                              onClick={() => toggleSection(pageDef.slug, sType)}
                              disabled={isHero}
                              className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                                isChecked
                                  ? "bg-black text-white border-black"
                                  : "bg-white text-gray-500 border-gray-300 hover:border-gray-500"
                              } ${isHero ? "cursor-not-allowed opacity-70" : ""}`}
                            >
                              {sType}
                              {isHero && " (zorunlu)"}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setStep(2)}
                className="flex-1 py-3 bg-white text-black font-medium rounded-lg border-2 border-gray-300 hover:border-black transition-colors"
              >
                Geri Dön
              </button>
              <button
                onClick={goToStep4}
                className="flex-1 py-3 bg-black text-white font-medium rounded-lg hover:bg-gray-800 transition-colors"
              >
                Devam Et
              </button>
            </div>
          </div>
        )}

        {/* ─── Step 4: Preview & Confirm ─── */}
        {step === 4 && selectedSector && (
          <div>
            <h1 className="text-2xl font-bold text-black mb-1">Önizleme</h1>
            <p className="text-gray-500 mb-8">Seçimlerinizi kontrol edin</p>

            <div className="bg-gray-50 rounded-lg p-6 mb-8 space-y-5">
              {/* Business info */}
              <div>
                <span className="text-xs text-gray-500 uppercase tracking-wider">İşletme</span>
                <p className="text-lg font-semibold text-black">{businessName}</p>
                <p className="text-sm text-gray-500">{selectedSector.label}</p>
              </div>

              {description && (
                <div>
                  <span className="text-xs text-gray-500 uppercase tracking-wider">Açıklama</span>
                  <p className="text-sm text-black">{description}</p>
                </div>
              )}

              {/* Palette */}
              <div>
                <span className="text-xs text-gray-500 uppercase tracking-wider">Renk Paleti</span>
                <div className="flex gap-2 mt-1.5">
                  {effectivePalette && [
                    effectivePalette.primary,
                    effectivePalette.secondary,
                    effectivePalette.accent,
                    effectivePalette.background,
                    effectivePalette.surface,
                  ].map((color, i) => (
                    <div key={i} className="w-8 h-8 rounded-full border border-gray-200" style={{ backgroundColor: color }} title={color} />
                  ))}
                </div>
              </div>

              {/* Fonts */}
              <div>
                <span className="text-xs text-gray-500 uppercase tracking-wider">Fontlar</span>
                {effectiveFonts && (
                  <p className="text-sm text-black">{effectiveFonts.heading} / {effectiveFonts.body}</p>
                )}
              </div>

              {/* Style choices */}
              <div className="flex gap-6 flex-wrap">
                <div>
                  <span className="text-xs text-gray-500 uppercase tracking-wider">Hero</span>
                  <p className="text-sm text-black font-medium">{HERO_VARIANTS.find((v) => v.id === heroVariant)?.label}</p>
                </div>
                <div>
                  <span className="text-xs text-gray-500 uppercase tracking-wider">Kart Stili</span>
                  <p className="text-sm text-black font-medium">{CARD_STYLES.find((c) => c.id === cardStyle)?.label}</p>
                </div>
                <div>
                  <span className="text-xs text-gray-500 uppercase tracking-wider">Boşluk</span>
                  <p className="text-sm text-black font-medium">{SPACING_OPTIONS.find((s) => s.id === spacing)?.label}</p>
                </div>
              </div>

              {/* Pages summary */}
              <div>
                <span className="text-xs text-gray-500 uppercase tracking-wider">Sayfalar</span>
                <div className="flex flex-wrap gap-2 mt-1.5">
                  {Object.entries(pageSelections)
                    .filter(([, v]) => v.enabled)
                    .map(([slug]) => {
                      const page = selectedSector.pages.find((p) => p.slug === slug);
                      return (
                        <span key={slug} className="px-3 py-1 bg-black text-white text-xs rounded-full font-medium">
                          {page?.name ?? slug}
                        </span>
                      );
                    })}
                </div>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-4 mb-6">
                {error}
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => setStep(3)}
                disabled={loading}
                className="flex-1 py-3 bg-white text-black font-medium rounded-lg border-2 border-gray-300 hover:border-black transition-colors disabled:opacity-50"
              >
                Geri Dön
              </button>
              <button
                onClick={handleGenerate}
                disabled={loading}
                className="flex-1 py-3 bg-black text-white font-medium rounded-lg hover:bg-gray-800 disabled:bg-gray-400 transition-colors flex items-center justify-center gap-2"
              >
                {loading && (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                )}
                {loading ? "Oluşturuluyor..." : "Siteyi Oluştur"}
              </button>
            </div>
          </div>
        )}

        {/* ─── Step 5: Completed ─── */}
        {step === 5 && (
          <div className="text-center">
            <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-black mb-2">
              {businessName} siteniz oluşturuldu!
            </h1>
            <p className="text-gray-500 mb-8">
              Sitenizi düzenlemek için editörü açın veya dashboard&apos;a dönün.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => router.push("/editor")}
                className="px-8 py-3 bg-black text-white font-medium rounded-lg hover:bg-gray-800 transition-colors"
              >
                Editörü Aç
              </button>
              <button
                onClick={() => router.push("/dashboard")}
                className="px-8 py-3 bg-white text-black font-medium rounded-lg border-2 border-gray-300 hover:border-black transition-colors"
              >
                Dashboard&apos;a Dön
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
