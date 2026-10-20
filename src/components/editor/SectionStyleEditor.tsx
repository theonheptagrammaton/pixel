"use client";

import { SectionStyle, AnimationType, CardStyle } from "@/types/template";
import { FieldGroup, Field, SelectInput } from "./SectionEditorWrapper";
import { ColorPicker } from "./ColorPicker";
import { ImageUpload } from "@/components/ui/ImageUpload";
import { RangeSlider } from "@/components/ui/RangeSlider";

interface Props {
  style: SectionStyle;
  onChange: (style: SectionStyle) => void;
  showCardStyle?: boolean;
}

export function SectionStyleEditor({ style, onChange, showCardStyle }: Props) {
  const u = (patch: Partial<SectionStyle>) => onChange({ ...style, ...patch });
  const bg = style.background ?? { type: "color" as const };

  return (
    <div className="space-y-6">
      <FieldGroup label="Arka Plan">
        <Field label="Arka Plan Tipi">
          <SelectInput
            value={bg.type || "color"}
            onChange={(v) =>
              u({
                background: {
                  ...bg,
                  type: v as "color" | "gradient" | "image",
                },
              })
            }
            options={[
              { value: "color", label: "Duz Renk" },
              { value: "gradient", label: "Gradient" },
              { value: "image", label: "Gorsel" },
            ]}
          />
        </Field>

        {bg.type === "color" && (
          <ColorPicker
            label="Arka Plan Rengi"
            value={bg.color ?? "#ffffff"}
            onChange={(v) => u({ background: { ...bg, color: v } })}
          />
        )}

        {bg.type === "gradient" && (
          <>
            <ColorPicker
              label="Baslangic Rengi"
              value={bg.gradient?.from ?? "#000000"}
              onChange={(v) =>
                u({
                  background: {
                    ...bg,
                    gradient: { from: v, to: bg.gradient?.to ?? "#ffffff", angle: bg.gradient?.angle ?? 135 },
                  },
                })
              }
            />
            <ColorPicker
              label="Bitis Rengi"
              value={bg.gradient?.to ?? "#ffffff"}
              onChange={(v) =>
                u({
                  background: {
                    ...bg,
                    gradient: { from: bg.gradient?.from ?? "#000000", to: v, angle: bg.gradient?.angle ?? 135 },
                  },
                })
              }
            />
            <RangeSlider
              label="Gradient Acisi"
              value={bg.gradient?.angle ?? 135}
              onChange={(v) =>
                u({
                  background: {
                    ...bg,
                    gradient: { from: bg.gradient?.from ?? "#000000", to: bg.gradient?.to ?? "#ffffff", angle: v },
                  },
                })
              }
              min={0}
              max={360}
              unit="°"
            />
          </>
        )}

        {bg.type === "image" && (
          <>
            <ImageUpload
              label="Arka Plan Gorseli"
              value={bg.image ?? ""}
              onChange={(v) => u({ background: { ...bg, image: v } })}
              hint="Genis bir gorsel onerilir"
            />
            <RangeSlider
              label="Karanlik Katman"
              value={bg.overlay ?? 0}
              onChange={(v) => u({ background: { ...bg, overlay: v } })}
              min={0}
              max={100}
              unit="%"
            />
          </>
        )}
      </FieldGroup>

      <FieldGroup label="Bosluk (Spacing)">
        <Field label="Ic Bosluk">
          <SelectInput
            value={style.spacing ?? "normal"}
            onChange={(v) => u({ spacing: v as SectionStyle["spacing"] })}
            options={[
              { value: "compact", label: "Kompakt (48px)" },
              { value: "normal", label: "Normal (96px)" },
              { value: "spacious", label: "Genis (144px)" },
            ]}
          />
        </Field>
      </FieldGroup>

      <FieldGroup label="Alt Ayirici (Divider)">
        <Field label="Ayirici Tipi">
          <SelectInput
            value={style.divider ?? "none"}
            onChange={(v) => u({ divider: v as SectionStyle["divider"] })}
            options={[
              { value: "none", label: "Yok" },
              { value: "line", label: "Cizgi" },
              { value: "wave", label: "Dalga" },
              { value: "curve", label: "Egri" },
              { value: "angle", label: "Acili" },
            ]}
          />
        </Field>
      </FieldGroup>

      <FieldGroup label="Renk Override">
        <ColorPicker
          label="Metin Rengi"
          value={style.colorOverride?.text ?? ""}
          onChange={(v) => u({ colorOverride: { ...style.colorOverride, text: v || undefined } })}
        />
        <ColorPicker
          label="Acik Metin Rengi"
          value={style.colorOverride?.textLight ?? ""}
          onChange={(v) => u({ colorOverride: { ...style.colorOverride, textLight: v || undefined } })}
        />
        <ColorPicker
          label="Vurgu Rengi"
          value={style.colorOverride?.accent ?? ""}
          onChange={(v) => u({ colorOverride: { ...style.colorOverride, accent: v || undefined } })}
        />
      </FieldGroup>

      <FieldGroup label="Animasyon">
        <Field label="Animasyon Tipi">
          <SelectInput
            value={style.animation ?? "fade-up"}
            onChange={(v) => u({ animation: v as AnimationType })}
            options={[
              { value: "fade-up", label: "Asagi Yukari (Fade Up)" },
              { value: "fade-in", label: "Belirme (Fade In)" },
              { value: "slide-left", label: "Soldan Kayma" },
              { value: "slide-right", label: "Sagdan Kayma" },
              { value: "scale", label: "Buyume (Scale)" },
              { value: "none", label: "Animasyon Yok" },
            ]}
          />
        </Field>
      </FieldGroup>

      {showCardStyle && (
        <FieldGroup label="Kart Stili">
          <Field label="Kart Gorunumu">
            <SelectInput
              value={style.cardStyle ?? "default"}
              onChange={(v) => u({ cardStyle: v as CardStyle })}
              options={[
                { value: "default", label: "Varsayilan" },
                { value: "minimal", label: "Minimal" },
                { value: "bordered", label: "Cerceveli" },
                { value: "glass", label: "Cam Efekti (Glass)" },
                { value: "gradient", label: "Gradient" },
                { value: "shadow", label: "Golge" },
              ]}
            />
          </Field>
        </FieldGroup>
      )}
    </div>
  );
}
