"use client";

import { HeroData, HeroSlide, SiteGlobalConfig } from "@/types/template";
import { FieldGroup, Field, TextInput, SelectInput } from "../SectionEditorWrapper";
import { ImageUpload } from "@/components/ui/ImageUpload";
import { RangeSlider } from "@/components/ui/RangeSlider";
import { ColorPicker } from "../ColorPicker";

interface Props {
  data: HeroData;
  onChange: (data: HeroData) => void;
  globalConfig: SiteGlobalConfig;
}

export function HeroEditor({ data, onChange }: Props) {
  const u = (patch: Partial<HeroData>) => onChange({ ...data, ...patch });
  const variant = data.variant || "default";

  const updateSlide = (index: number, patch: Partial<HeroSlide>) => {
    const slides = [...(data.slides ?? [])];
    slides[index] = { ...slides[index], ...patch };
    u({ slides });
  };

  const addSlide = () => {
    const slides = [...(data.slides ?? []), { title: "Yeni Slayt", description: "", backgroundImage: "" }];
    u({ slides });
  };

  const removeSlide = (index: number) => {
    const slides = (data.slides ?? []).filter((_, i) => i !== index);
    u({ slides });
  };

  return (
    <div className="space-y-6">
      <FieldGroup label="Hero Varyanti">
        <Field label="Varyant">
          <SelectInput
            value={variant}
            onChange={(v) => u({ variant: v as HeroData["variant"] })}
            options={[
              { value: "default", label: "Varsayilan (Tam Ekran)" },
              { value: "split", label: "Bolunmus (Split)" },
              { value: "video", label: "Video Arka Plan" },
              { value: "slider", label: "Slayt (Slider)" },
              { value: "gradient", label: "Gradient" },
            ]}
          />
        </Field>
        <Field label="Yukseklik">
          <SelectInput
            value={data.height ?? "large"}
            onChange={(v) => u({ height: v as HeroData["height"] })}
            options={[
              { value: "full", label: "Tam Ekran (100vh)" },
              { value: "large", label: "Buyuk (90vh)" },
              { value: "medium", label: "Orta (70vh)" },
            ]}
          />
        </Field>
      </FieldGroup>

      {variant !== "slider" && (
        <FieldGroup label="Icerik">
          <Field label="Baslik">
            <TextInput value={data.title} onChange={(v) => u({ title: v })} placeholder="Ana baslik" />
          </Field>
          <Field label="Alt Baslik">
            <TextInput value={data.subtitle} onChange={(v) => u({ subtitle: v })} placeholder="Alt baslik" />
          </Field>
          <Field label="Aciklama">
            <TextInput value={data.description} onChange={(v) => u({ description: v })} placeholder="Kisa aciklama" multiline rows={3} />
          </Field>
        </FieldGroup>
      )}

      <FieldGroup label="Metin Stilleri">
        <ColorPicker
          label="Baslik Rengi"
          value={data.titleColor ?? "#ffffff"}
          onChange={(v) => u({ titleColor: v })}
        />
        <RangeSlider
          label="Baslik Boyutu"
          value={data.titleFontSize ?? 64}
          onChange={(v) => u({ titleFontSize: v })}
          min={24}
          max={120}
          unit="px"
        />
        <Field label="Baslik Kalinligi">
          <SelectInput
            value={String(data.titleFontWeight ?? 800)}
            onChange={(v) => u({ titleFontWeight: Number(v) })}
            options={[
              { value: "400", label: "Normal (400)" },
              { value: "500", label: "Medium (500)" },
              { value: "600", label: "Semi Bold (600)" },
              { value: "700", label: "Bold (700)" },
              { value: "800", label: "Extra Bold (800)" },
              { value: "900", label: "Black (900)" },
            ]}
          />
        </Field>
        <ColorPicker
          label="Alt Baslik Rengi"
          value={data.subtitleColor ?? "#ffffff"}
          onChange={(v) => u({ subtitleColor: v })}
        />
        <RangeSlider
          label="Alt Baslik Boyutu"
          value={data.subtitleFontSize ?? 13}
          onChange={(v) => u({ subtitleFontSize: v })}
          min={10}
          max={32}
          unit="px"
        />
        <ColorPicker
          label="Aciklama Rengi"
          value={data.descriptionColor ?? "#ffffff"}
          onChange={(v) => u({ descriptionColor: v })}
        />
        <RangeSlider
          label="Aciklama Boyutu"
          value={data.descriptionFontSize ?? 18}
          onChange={(v) => u({ descriptionFontSize: v })}
          min={12}
          max={36}
          unit="px"
        />
      </FieldGroup>

      {variant !== "slider" && (
        <FieldGroup label="CTA Butonlari">
          <Field label="Birincil Buton Metni">
            <TextInput value={data.ctaText} onChange={(v) => u({ ctaText: v })} placeholder="Hemen Baslat" />
          </Field>
          <Field label="Birincil Buton Linki">
            <TextInput value={data.ctaLink} onChange={(v) => u({ ctaLink: v })} placeholder="#contact" />
          </Field>
          <Field label="Ikincil Buton Metni (opsiyonel)">
            <TextInput value={data.secondaryCtaText ?? ""} onChange={(v) => u({ secondaryCtaText: v })} placeholder="Daha Fazla" />
          </Field>
          <Field label="Ikincil Buton Linki">
            <TextInput value={data.secondaryCtaLink ?? ""} onChange={(v) => u({ secondaryCtaLink: v })} placeholder="#about" />
          </Field>
        </FieldGroup>
      )}

      {/* Default variant: background image */}
      {variant === "default" && (
        <FieldGroup label="Gorsel">
          <ImageUpload
            label="Arka Plan Gorseli"
            value={data.backgroundImage}
            onChange={(v) => u({ backgroundImage: v })}
            hint="Onerilir: 1920x1080px, JPG veya WebP"
          />
          <RangeSlider
            label="Karanlik Katman Opaklik"
            value={data.overlayOpacity}
            onChange={(v) => u({ overlayOpacity: v })}
            min={0}
            max={100}
            unit="%"
          />
        </FieldGroup>
      )}

      {/* Split variant */}
      {variant === "split" && (
        <FieldGroup label="Split Ayarlari">
          <ImageUpload
            label="Yan Gorsel"
            value={data.splitImage ?? ""}
            onChange={(v) => u({ splitImage: v })}
            hint="Onerilir: 1080x1080px"
          />
          <Field label="Gorsel Konumu">
            <SelectInput
              value={data.splitImagePosition ?? "right"}
              onChange={(v) => u({ splitImagePosition: v as "left" | "right" })}
              options={[
                { value: "left", label: "Sol" },
                { value: "right", label: "Sag" },
              ]}
            />
          </Field>
        </FieldGroup>
      )}

      {/* Video variant */}
      {variant === "video" && (
        <FieldGroup label="Video Ayarlari">
          <Field label="Video URL">
            <TextInput value={data.videoUrl ?? ""} onChange={(v) => u({ videoUrl: v })} placeholder="YouTube, Vimeo veya MP4 URL" />
          </Field>
          <ImageUpload
            label="Video Poster (opsiyonel)"
            value={data.videoPoster ?? ""}
            onChange={(v) => u({ videoPoster: v })}
            hint="Video yuklenirken gosterilecek gorsel"
          />
          <RangeSlider
            label="Karanlik Katman Opaklik"
            value={data.overlayOpacity}
            onChange={(v) => u({ overlayOpacity: v })}
            min={0}
            max={100}
            unit="%"
          />
        </FieldGroup>
      )}

      {/* Slider variant */}
      {variant === "slider" && (
        <FieldGroup label="Slaytlar">
          <RangeSlider
            label="Gecis Suresi"
            value={data.slideInterval ?? 5000}
            onChange={(v) => u({ slideInterval: v })}
            min={2000}
            max={10000}
            unit="ms"
          />
          <RangeSlider
            label="Karanlik Katman Opaklik"
            value={data.overlayOpacity}
            onChange={(v) => u({ overlayOpacity: v })}
            min={0}
            max={100}
            unit="%"
          />
          {(data.slides ?? []).map((slide, i) => (
            <div key={i} className="p-3 border border-zinc-200 rounded-lg space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs font-semibold text-zinc-500">Slayt {i + 1}</span>
                <button
                  onClick={() => removeSlide(i)}
                  className="text-xs text-red-500 hover:text-red-700"
                >
                  Sil
                </button>
              </div>
              <Field label="Baslik">
                <TextInput value={slide.title} onChange={(v) => updateSlide(i, { title: v })} placeholder="Slayt basligi" />
              </Field>
              <Field label="Aciklama">
                <TextInput value={slide.description} onChange={(v) => updateSlide(i, { description: v })} placeholder="Slayt aciklamasi" />
              </Field>
              <ImageUpload
                label="Arka Plan Gorseli"
                value={slide.backgroundImage}
                onChange={(v) => updateSlide(i, { backgroundImage: v })}
              />
              <Field label="CTA Metni (opsiyonel)">
                <TextInput value={slide.ctaText ?? ""} onChange={(v) => updateSlide(i, { ctaText: v })} placeholder="Buton metni" />
              </Field>
              <Field label="CTA Linki">
                <TextInput value={slide.ctaLink ?? ""} onChange={(v) => updateSlide(i, { ctaLink: v })} placeholder="#contact" />
              </Field>
            </div>
          ))}
          <button
            onClick={addSlide}
            className="w-full py-2 text-sm font-medium text-zinc-600 border border-dashed border-zinc-300 rounded-lg hover:bg-zinc-50"
          >
            + Slayt Ekle
          </button>
        </FieldGroup>
      )}

      {/* Gradient variant */}
      {variant === "gradient" && (
        <FieldGroup label="Gradient Ayarlari">
          <ColorPicker
            label="Baslangic Rengi"
            value={data.gradientFrom ?? "#000000"}
            onChange={(v) => u({ gradientFrom: v })}
          />
          <ColorPicker
            label="Bitis Rengi"
            value={data.gradientTo ?? "#ffffff"}
            onChange={(v) => u({ gradientTo: v })}
          />
          <RangeSlider
            label="Gradient Acisi"
            value={data.gradientAngle ?? 135}
            onChange={(v) => u({ gradientAngle: v })}
            min={0}
            max={360}
            unit="°"
          />
        </FieldGroup>
      )}

      <FieldGroup label="Duzen">
        <Field label="Hizalama">
          <SelectInput
            value={data.alignment}
            onChange={(v) => u({ alignment: v as HeroData["alignment"] })}
            options={[
              { value: "left", label: "Sola Hizali" },
              { value: "center", label: "Ortali" },
              { value: "right", label: "Saga Hizali" },
            ]}
          />
        </Field>
      </FieldGroup>
    </div>
  );
}
