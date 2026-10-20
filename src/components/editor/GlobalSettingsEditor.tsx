"use client";

import { useState } from "react";
import { useEditorStore } from "@/stores/editor-store";
import { SiteGlobalConfig } from "@/types/template";
import { Tabs } from "@/components/ui/Tabs";
import { ColorPicker } from "./ColorPicker";
import { FontSelector } from "./FontSelector";
import { Field, TextInput } from "./SectionEditorWrapper";
import { ImageUpload } from "@/components/ui/ImageUpload";
import { Toggle } from "@/components/ui/Toggle";

const TABS = [
  { key: "general", label: "Isletme Bilgileri" },
  { key: "colors", label: "Renkler" },
  { key: "fonts", label: "Fontlar" },
  { key: "seo", label: "SEO" },
  { key: "whatsapp", label: "WhatsApp" },
  { key: "cookie", label: "Cerez Bildirimi" },
];

export function GlobalSettingsEditor() {
  const { config, updateGlobalConfig } = useEditorStore();
  const [activeTab, setActiveTab] = useState("general");

  if (!config) return null;
  const g = config.global;
  const u = (patch: Partial<SiteGlobalConfig>) => updateGlobalConfig(patch);

  return (
    <div className="flex flex-col h-full">
      <div className="px-6 py-4 border-b border-zinc-100 shrink-0">
        <p className="text-sm font-semibold text-zinc-900">Genel Ayarlar</p>
        <p className="text-xs text-zinc-400 mt-0.5">Site genelinde gecerli ayarlar</p>
      </div>

      <Tabs tabs={TABS} active={activeTab} onChange={setActiveTab} />

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {activeTab === "general" && (
          <>
            <Field label="Isletme Adi">
              <TextInput value={g.general.businessName} onChange={(v) => u({ general: { ...g.general, businessName: v } })} placeholder="Sirket Adi" />
            </Field>
            <ImageUpload label="Logo" value={g.general.logo} onChange={(v) => u({ general: { ...g.general, logo: v } })} hint="Transparan PNG onerilir" />
            <Field label="Telefon">
              <TextInput value={g.general.phone} onChange={(v) => u({ general: { ...g.general, phone: v } })} placeholder="+90 555 000 00 00" />
            </Field>
            <Field label="Email">
              <TextInput value={g.general.email} onChange={(v) => u({ general: { ...g.general, email: v } })} placeholder="info@sirket.com" />
            </Field>
            <Field label="Adres">
              <TextInput value={g.general.address} onChange={(v) => u({ general: { ...g.general, address: v } })} placeholder="Mahalle, Ilce, Sehir" multiline rows={2} />
            </Field>
            <div className="space-y-2">
              <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Sosyal Medya</span>
              <Field label="Instagram">
                <TextInput value={g.general.socialLinks.instagram ?? ""} onChange={(v) => u({ general: { ...g.general, socialLinks: { ...g.general.socialLinks, instagram: v } } })} placeholder="https://instagram.com/..." />
              </Field>
              <Field label="Facebook">
                <TextInput value={g.general.socialLinks.facebook ?? ""} onChange={(v) => u({ general: { ...g.general, socialLinks: { ...g.general.socialLinks, facebook: v } } })} placeholder="https://facebook.com/..." />
              </Field>
              <Field label="Twitter / X">
                <TextInput value={g.general.socialLinks.twitter ?? ""} onChange={(v) => u({ general: { ...g.general, socialLinks: { ...g.general.socialLinks, twitter: v } } })} placeholder="https://twitter.com/..." />
              </Field>
              <Field label="LinkedIn">
                <TextInput value={g.general.socialLinks.linkedin ?? ""} onChange={(v) => u({ general: { ...g.general, socialLinks: { ...g.general.socialLinks, linkedin: v } } })} placeholder="https://linkedin.com/in/..." />
              </Field>
              <Field label="YouTube">
                <TextInput value={g.general.socialLinks.youtube ?? ""} onChange={(v) => u({ general: { ...g.general, socialLinks: { ...g.general.socialLinks, youtube: v } } })} placeholder="https://youtube.com/..." />
              </Field>
              <Field label="TikTok">
                <TextInput value={g.general.socialLinks.tiktok ?? ""} onChange={(v) => u({ general: { ...g.general, socialLinks: { ...g.general.socialLinks, tiktok: v } } })} placeholder="https://tiktok.com/@..." />
              </Field>
            </div>
          </>
        )}

        {activeTab === "colors" && (
          <>
            <ColorPicker label="Birincil Renk" value={g.colors.primary} onChange={(v) => u({ colors: { ...g.colors, primary: v } })} />
            <ColorPicker label="Ikincil Renk" value={g.colors.secondary} onChange={(v) => u({ colors: { ...g.colors, secondary: v } })} />
            <ColorPicker label="Vurgu Rengi" value={g.colors.accent} onChange={(v) => u({ colors: { ...g.colors, accent: v } })} />
            <ColorPicker label="Arka Plan" value={g.colors.background} onChange={(v) => u({ colors: { ...g.colors, background: v } })} />
            <ColorPicker label="Yuzeyi" value={g.colors.surface} onChange={(v) => u({ colors: { ...g.colors, surface: v } })} />
            <ColorPicker label="Metin" value={g.colors.text} onChange={(v) => u({ colors: { ...g.colors, text: v } })} />
            <ColorPicker label="Acik Metin" value={g.colors.textLight} onChange={(v) => u({ colors: { ...g.colors, textLight: v } })} />
          </>
        )}

        {activeTab === "fonts" && (
          <>
            <FontSelector label="Baslik Fontu" value={g.fonts.heading} onChange={(v) => u({ fonts: { ...g.fonts, heading: v } })} />
            <FontSelector label="Govde Metin Fontu" value={g.fonts.body} onChange={(v) => u({ fonts: { ...g.fonts, body: v } })} />
          </>
        )}

        {activeTab === "seo" && (
          <>
            <Field label="Site Basligi">
              <TextInput value={g.seo.title} onChange={(v) => u({ seo: { ...g.seo, title: v } })} placeholder="Sirketinizin Adi | Ana Sayfa" />
            </Field>
            <Field label="Meta Aciklamasi">
              <TextInput value={g.seo.description} onChange={(v) => u({ seo: { ...g.seo, description: v } })} placeholder="160 karakteri gecmeyin" multiline rows={3} />
            </Field>
            <Field label="Anahtar Kelimeler (virgul ile ayirin)">
              <TextInput value={g.seo.keywords.join(", ")} onChange={(v) => u({ seo: { ...g.seo, keywords: v.split(",").map((k) => k.trim()).filter(Boolean) } })} placeholder="restoran, istanbul, pizza" />
            </Field>
            <ImageUpload label="OG Gorseli (Sosyal Medya Onizlemesi)" value={g.seo.ogImage} onChange={(v) => u({ seo: { ...g.seo, ogImage: v } })} hint="1200x630px onerilir" />
            <ImageUpload label="Favicon" value={g.seo.favicon} onChange={(v) => u({ seo: { ...g.seo, favicon: v } })} hint="32x32px PNG veya ICO" />
            <div className="space-y-2 pt-4 border-t border-zinc-100">
              <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Gelismis SEO</span>
              <Field label="OG Baslik Override" hint="Bos birakilirsa site basligi kullanilir">
                <TextInput value={g.seo.ogTitle ?? ""} onChange={(v) => u({ seo: { ...g.seo, ogTitle: v || undefined } })} placeholder="Sosyal medya icin ozel baslik" />
              </Field>
              <Field label="OG Aciklama Override" hint="Bos birakilirsa meta aciklamasi kullanilir">
                <TextInput value={g.seo.ogDescription ?? ""} onChange={(v) => u({ seo: { ...g.seo, ogDescription: v || undefined } })} placeholder="Sosyal medya icin ozel aciklama" multiline rows={2} />
              </Field>
              <Field label="Twitter Handle" hint="Ornegin: @kullaniciadi">
                <TextInput value={g.seo.twitterHandle ?? ""} onChange={(v) => u({ seo: { ...g.seo, twitterHandle: v || undefined } })} placeholder="@username" />
              </Field>
              <Field label="Google Search Console Dogrulama" hint="Google Search Console meta tag degeri">
                <TextInput value={g.seo.googleVerification ?? ""} onChange={(v) => u({ seo: { ...g.seo, googleVerification: v || undefined } })} placeholder="Google dogrulama kodu" />
              </Field>
            </div>
          </>
        )}

        {activeTab === "whatsapp" && (
          <>
            <Toggle
              checked={g.whatsapp?.enabled ?? false}
              onChange={() =>
                u({
                  whatsapp: {
                    ...g.whatsapp,
                    enabled: !g.whatsapp?.enabled,
                    phoneNumber: g.whatsapp?.phoneNumber ?? "",
                    message: g.whatsapp?.message ?? "",
                  },
                })
              }
              label="WhatsApp Butonu Aktif"
            />
            <Field label="Telefon Numarasi">
              <TextInput
                value={g.whatsapp?.phoneNumber ?? ""}
                onChange={(v) =>
                  u({
                    whatsapp: {
                      ...g.whatsapp,
                      enabled: g.whatsapp?.enabled ?? false,
                      phoneNumber: v,
                      message: g.whatsapp?.message ?? "",
                    },
                  })
                }
                placeholder="+905551234567"
              />
              <p className="text-xs text-zinc-400 mt-1">+90 ile baslayan numara</p>
            </Field>
            <Field label="Varsayilan Mesaj">
              <TextInput
                value={g.whatsapp?.message ?? ""}
                onChange={(v) =>
                  u({
                    whatsapp: {
                      ...g.whatsapp,
                      enabled: g.whatsapp?.enabled ?? false,
                      phoneNumber: g.whatsapp?.phoneNumber ?? "",
                      message: v,
                    },
                  })
                }
                placeholder="Merhaba, bilgi almak istiyorum."
              />
            </Field>
          </>
        )}

        {activeTab === "cookie" && (
          <>
            <Toggle
              checked={g.cookieConsent?.enabled ?? false}
              onChange={() =>
                u({
                  cookieConsent: {
                    ...g.cookieConsent,
                    enabled: !g.cookieConsent?.enabled,
                    text: g.cookieConsent?.text ?? "",
                    buttonText: g.cookieConsent?.buttonText ?? "Kabul Et",
                  },
                })
              }
              label="Cerez Bildirimi Aktif"
            />
            <Field label="Bildirim Metni">
              <TextInput
                value={g.cookieConsent?.text ?? ""}
                onChange={(v) =>
                  u({
                    cookieConsent: {
                      ...g.cookieConsent,
                      enabled: g.cookieConsent?.enabled ?? false,
                      text: v,
                      buttonText: g.cookieConsent?.buttonText ?? "Kabul Et",
                    },
                  })
                }
                placeholder="Bu site cerezleri kullanmaktadir."
                multiline
                rows={3}
              />
            </Field>
            <Field label="Buton Metni">
              <TextInput
                value={g.cookieConsent?.buttonText ?? ""}
                onChange={(v) =>
                  u({
                    cookieConsent: {
                      ...g.cookieConsent,
                      enabled: g.cookieConsent?.enabled ?? false,
                      text: g.cookieConsent?.text ?? "",
                      buttonText: v,
                    },
                  })
                }
                placeholder="Kabul Et"
              />
            </Field>
            <Field label="Politika Linki">
              <TextInput
                value={g.cookieConsent?.linkUrl ?? ""}
                onChange={(v) =>
                  u({
                    cookieConsent: {
                      ...g.cookieConsent,
                      enabled: g.cookieConsent?.enabled ?? false,
                      text: g.cookieConsent?.text ?? "",
                      buttonText: g.cookieConsent?.buttonText ?? "Kabul Et",
                      linkUrl: v,
                    },
                  })
                }
                placeholder="https://..."
              />
            </Field>
            <Field label="Link Metni">
              <TextInput
                value={g.cookieConsent?.linkText ?? ""}
                onChange={(v) =>
                  u({
                    cookieConsent: {
                      ...g.cookieConsent,
                      enabled: g.cookieConsent?.enabled ?? false,
                      text: g.cookieConsent?.text ?? "",
                      buttonText: g.cookieConsent?.buttonText ?? "Kabul Et",
                      linkText: v,
                    },
                  })
                }
                placeholder="KVKK Politikasi"
              />
            </Field>
          </>
        )}
      </div>
    </div>
  );
}
