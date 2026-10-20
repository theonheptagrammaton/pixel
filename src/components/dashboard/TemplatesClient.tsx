"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ConfirmModal } from "@/components/ui/Modal";
import { TEMPLATE_REGISTRY } from "@/lib/template-registry";

interface TemplateItem {
  id: string;
  name: string;
  slug: string;
  description: string;
  thumbnail: string;
  category: string;
}

interface TemplatesClientProps {
  templates: TemplateItem[];
  existingSiteId: string | null;
}

const CATEGORY_LABELS: Record<string, string> = {
  restaurant: "Restoran",
  business: "Kurumsal",
  portfolio: "Portfolyo",
  guzellik: "Güzellik",
  saglik: "Sağlık",
  blog: "Blog",
  otel: "Otel",
  teknoloji: "Teknoloji",
};

// Visual data per template slug
const TEMPLATE_VISUAL_DATA: Record<
  string,
  {
    colors: { primary: string; accent: string; background: string; surface: string; text: string };
    fonts: { heading: string; body: string };
    mood: string;
  }
> = {
  flavor: {
    colors: { primary: "#c2410c", accent: "#ea580c", background: "#fffbf7", surface: "#ffffff", text: "#1c1917" },
    fonts: { heading: "Playfair Display", body: "Inter" },
    mood: "Sıcak & Davetkar",
  },
  vertex: {
    colors: { primary: "#0284c7", accent: "#38bdf8", background: "#f0f9ff", surface: "#ffffff", text: "#0f172a" },
    fonts: { heading: "Montserrat", body: "Open Sans" },
    mood: "Profesyonel",
  },
  showcase: {
    colors: { primary: "#ffffff", accent: "#e5e5e5", background: "#0a0a0a", surface: "#171717", text: "#f5f5f5" },
    fonts: { heading: "Cormorant Garamond", body: "Inter" },
    mood: "Minimal & Koyu",
  },
  bloom: {
    colors: { primary: "#7c3aed", accent: "#a78bfa", background: "#faf5ff", surface: "#ffffff", text: "#1e1b4b" },
    fonts: { heading: "Cormorant Garamond", body: "Raleway" },
    mood: "Zarif & Feminen",
  },
  pulse: {
    colors: { primary: "#dc2626", accent: "#f97316", background: "#0f0f0f", surface: "#1a1a1a", text: "#f5f5f5" },
    fonts: { heading: "Oswald", body: "Inter" },
    mood: "Enerjik & Güçlü",
  },
  craft: {
    colors: { primary: "#171717", accent: "#737373", background: "#ffffff", surface: "#fafafa", text: "#171717" },
    fonts: { heading: "Merriweather", body: "Inter" },
    mood: "Minimal & Okunur",
  },
  zenith: {
    colors: { primary: "#b8860b", accent: "#d4a843", background: "#fefdf5", surface: "#ffffff", text: "#1c1917" },
    fonts: { heading: "Playfair Display", body: "Lora" },
    mood: "Lüks & Sofistike",
  },
  forge: {
    colors: { primary: "#2563eb", accent: "#60a5fa", background: "#0f172a", surface: "#1e293b", text: "#f1f5f9" },
    fonts: { heading: "Space Grotesk", body: "Inter" },
    mood: "Modern & Teknik",
  },
};

function MiniMockup({ slug }: { slug: string }) {
  const visual = TEMPLATE_VISUAL_DATA[slug];
  if (!visual) {
    return <div className="w-full h-full bg-gradient-to-br from-zinc-100 to-zinc-200" />;
  }
  const { colors } = visual;
  return (
    <div className="w-full h-full flex flex-col" style={{ background: colors.background }}>
      {/* Navbar strip */}
      <div className="h-[14%] flex items-center px-3" style={{ background: colors.primary }}>
        <div className="w-8 h-1.5 rounded-full" style={{ background: colors.text === "#f5f5f5" || colors.text === "#f1f5f9" ? "rgba(255,255,255,0.7)" : "rgba(255,255,255,0.9)" }} />
        <div className="ml-auto flex gap-1.5">
          {[1, 2, 3].map((i) => (
            <div key={i} className="w-4 h-1 rounded-full" style={{ background: "rgba(255,255,255,0.5)" }} />
          ))}
        </div>
      </div>
      {/* Hero area */}
      <div
        className="flex-1 flex flex-col items-center justify-center gap-1.5"
        style={{ background: `linear-gradient(135deg, ${colors.primary}, ${colors.accent})` }}
      >
        <div className="w-14 h-1.5 rounded-full bg-white/80" />
        <div className="w-20 h-1 rounded-full bg-white/50" />
        <div className="w-8 h-3 rounded mt-1" style={{ background: colors.accent, opacity: 0.8 }} />
      </div>
      {/* Cards area */}
      <div className="h-[30%] flex items-center justify-center gap-2 px-3" style={{ background: colors.surface }}>
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="flex-1 h-[70%] rounded"
            style={{ background: colors.background, border: `1px solid ${colors.accent}30` }}
          />
        ))}
      </div>
    </div>
  );
}

export function TemplatesClient({
  templates,
  existingSiteId,
}: TemplatesClientProps) {
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateItem | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const categories = ["all", ...Array.from(new Set(templates.map((t) => t.category)))];

  const filtered =
    activeCategory === "all"
      ? templates
      : templates.filter((t) => t.category === activeCategory);

  function getCategoryLabel(cat: string) {
    if (cat === "all") return "Tümü";
    return CATEGORY_LABELS[cat] ?? cat;
  }

  function getSectionCount(slug: string): number {
    return TEMPLATE_REGISTRY[slug]?.metadata.availableSections.length ?? 0;
  }

  async function handleConfirmSelect() {
    if (!selectedTemplate) return;
    setError("");
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/sites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ templateId: selectedTemplate.id }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setError(data.error || "Bir hata oluştu.");
        setSelectedTemplate(null);
        return;
      }
      router.push("/editor");
      router.refresh();
    } catch {
      setError("Bir hata oluştu. Lütfen tekrar deneyin.");
      setSelectedTemplate(null);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Quick Start */}
      <div className="border-2 border-black rounded-lg p-6 bg-white">
        <h2 className="text-xl font-bold text-black mb-1">Hızlı Başlangıç</h2>
        <p className="text-sm text-zinc-500 mb-4">
          Renk, font, bölüm ve stil seçimleriyle sitenizi saniyeler içinde oluşturun
        </p>
        <button
          onClick={() => router.push("/generate")}
          className="px-6 py-2.5 bg-black text-white text-sm font-medium rounded-lg hover:bg-zinc-800 transition-colors"
        >
          Siteyi Oluştur
        </button>
      </div>

      {/* Separator */}
      <div className="flex items-center gap-4">
        <div className="flex-1 h-px bg-zinc-200" />
        <span className="text-sm text-zinc-400">veya bir şablon seçin</span>
        <div className="flex-1 h-px bg-zinc-200" />
      </div>

      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-zinc-900">Şablon Seç</h2>
        <p className="mt-1 text-sm text-zinc-500">
          Siteniz için bir şablon seçin. İstediğiniz zaman değiştirebilirsiniz.
        </p>
      </div>

      {/* Existing site warning */}
      {existingSiteId && (
        <div className="border border-zinc-300 bg-zinc-50 rounded-lg px-5 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <p className="text-sm text-zinc-700">
            <span className="font-medium">Zaten bir siteniz var.</span> Yeni şablon
            seçerseniz mevcut içerik sıfırlanacaktır.
          </p>
          <div className="flex items-center gap-2 shrink-0">
            <Link href="/editor">
              <Button variant="secondary" size="sm">
                Editöre Git
              </Button>
            </Link>
          </div>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="border border-red-200 bg-red-50 rounded-lg px-4 py-3">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {/* Category tabs */}
      <div className="flex items-center gap-1 overflow-x-auto border-b border-zinc-200">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2.5 text-sm font-medium transition-colors border-b-2 -mb-px whitespace-nowrap ${
              activeCategory === cat
                ? "border-zinc-900 text-zinc-900"
                : "border-transparent text-zinc-500 hover:text-zinc-700"
            }`}
          >
            {getCategoryLabel(cat)}
          </button>
        ))}
      </div>

      {/* Template grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 text-zinc-400 text-sm">
          Bu kategoride şablon bulunamadı.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((template) => {
            const visual = TEMPLATE_VISUAL_DATA[template.slug];
            const sectionCount = getSectionCount(template.slug);

            return (
              <div
                key={template.id}
                className="bg-white border border-zinc-200 rounded-lg overflow-hidden hover:border-zinc-400 hover:shadow-sm transition-all"
              >
                {/* Mini mockup thumbnail */}
                <div className="aspect-video overflow-hidden">
                  <MiniMockup slug={template.slug} />
                </div>

                {/* Card body */}
                <div className="p-4 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="text-sm font-semibold text-zinc-900">{template.name}</h3>
                      {visual && (
                        <span className="text-[10px] text-zinc-400 font-medium">{visual.mood}</span>
                      )}
                    </div>
                    <Badge variant="default" size="sm">
                      {CATEGORY_LABELS[template.category] ?? template.category}
                    </Badge>
                  </div>

                  <p className="text-xs text-zinc-500 leading-relaxed line-clamp-2">
                    {template.description}
                  </p>

                  {/* Style info */}
                  {visual && (
                    <div className="flex items-center gap-3">
                      {/* Color swatches */}
                      <div className="flex -space-x-1">
                        {[visual.colors.primary, visual.colors.accent, visual.colors.background, visual.colors.surface].map((c, i) => (
                          <div
                            key={i}
                            className="w-5 h-5 rounded-full border-2 border-white"
                            style={{ backgroundColor: c, zIndex: 4 - i }}
                            title={c}
                          />
                        ))}
                      </div>
                      {/* Font names */}
                      <span className="text-[10px] text-zinc-400 truncate">
                        {visual.fonts.heading} / {visual.fonts.body}
                      </span>
                    </div>
                  )}

                  {sectionCount > 0 && (
                    <p className="text-xs text-zinc-400">
                      {sectionCount} bölüm destekleniyor
                    </p>
                  )}

                  <div className="flex gap-2 pt-1">
                    <button
                      onClick={() => window.open(`/preview?template=${template.slug}&demo=true`, "_blank")}
                      className="flex-1 text-xs font-medium border border-zinc-300 text-zinc-700 px-3 py-2 rounded-md hover:border-zinc-500 hover:bg-zinc-50 transition-colors"
                    >
                      Önizle
                    </button>
                    <button
                      onClick={() => setSelectedTemplate(template)}
                      className="flex-1 text-sm font-medium bg-black text-white px-3 py-2 rounded-md hover:bg-zinc-800 transition-colors"
                    >
                      Bu Şablonu Seç
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Confirmation modal */}
      <ConfirmModal
        isOpen={selectedTemplate !== null}
        onClose={() => {
          if (!isSubmitting) setSelectedTemplate(null);
        }}
        onConfirm={handleConfirmSelect}
        title="Şablonu Seç"
        message={
          selectedTemplate
            ? existingSiteId
              ? `"${selectedTemplate.name}" şablonunu seçmek istediğinize emin misiniz? Mevcut site içeriği sıfırlanacaktır.`
              : `"${selectedTemplate.name}" şablonunu seçmek istediğinize emin misiniz? Site içeriğini daha sonra düzenleyebilirsiniz.`
            : ""
        }
        confirmLabel="Evet, Seç"
        confirmVariant="primary"
        loading={isSubmitting}
      />
    </div>
  );
}
