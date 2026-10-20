"use client";

import { MenuData, MenuCategory, SiteGlobalConfig } from "@/types/template";
import { FieldGroup, Field, TextInput, SelectInput } from "../SectionEditorWrapper";
import { Toggle } from "@/components/ui/Toggle";
import { ImageUpload } from "@/components/ui/ImageUpload";

interface Props {
  data: MenuData;
  onChange: (data: MenuData) => void;
  globalConfig: SiteGlobalConfig;
}

type MenuItem = MenuCategory["items"][number];
const emptyItem = (): MenuItem => ({ name: "Yeni Urun", description: "", price: "0 TL", image: "", badge: "" });
const emptyCategory = (): MenuCategory => ({ name: "Yeni Kategori", items: [] });

export function MenuEditor({ data, onChange }: Props) {
  const u = (patch: Partial<MenuData>) => onChange({ ...data, ...patch });
  const updateCat = (ci: number, patch: Partial<MenuCategory>) => {
    u({ categories: data.categories.map((c, i) => (i === ci ? { ...c, ...patch } : c)) });
  };
  const updateItem = (ci: number, ii: number, patch: Partial<MenuItem>) => {
    updateCat(ci, { items: data.categories[ci].items.map((it, i) => (i === ii ? { ...it, ...patch } : it)) });
  };

  return (
    <div className="space-y-6">
      <FieldGroup label="Icerik">
        <Field label="Baslik"><TextInput value={data.title} onChange={(v) => u({ title: v })} /></Field>
        <Field label="Alt Baslik"><TextInput value={data.subtitle} onChange={(v) => u({ subtitle: v })} /></Field>
      </FieldGroup>

      <FieldGroup label="Duzen">
        <Field label="Gorunum">
          <SelectInput value={data.layout} onChange={(v) => u({ layout: v as MenuData["layout"] })}
            options={[{ value: "simple", label: "Basit" }, { value: "cards", label: "Kartlar" }, { value: "detailed", label: "Detayli" }]} />
        </Field>
        <Toggle label="Urun Gorselleri Goster" checked={data.showImages} onChange={(v) => u({ showImages: v })} />
      </FieldGroup>

      <FieldGroup label={`Kategoriler (${data.categories.length})`}>
        <div className="space-y-4">
          {data.categories.map((cat, ci) => (
            <div key={ci} className="border border-zinc-200 rounded-md bg-zinc-50 overflow-hidden">
              <div className="flex items-center justify-between px-3 py-2 bg-zinc-100 border-b border-zinc-200">
                <Field label="">
                  <TextInput value={cat.name} onChange={(v) => updateCat(ci, { name: v })} placeholder="Kategori Adi" />
                </Field>
                <button onClick={() => u({ categories: data.categories.filter((_, i) => i !== ci) })} className="ml-2 text-zinc-400 hover:text-red-500 transition-colors shrink-0">
                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
              <div className="p-3 space-y-2">
                {cat.items.map((item, ii) => (
                  <div key={ii} className="border border-zinc-200 rounded p-2 bg-white space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-zinc-500">Urun {ii + 1}</span>
                      <button onClick={() => updateCat(ci, { items: cat.items.filter((_, i) => i !== ii) })} className="text-zinc-400 hover:text-red-500 transition-colors">
                        <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                      </button>
                    </div>
                    <Field label="Urun Adi"><TextInput value={item.name} onChange={(v) => updateItem(ci, ii, { name: v })} /></Field>
                    <Field label="Fiyat"><TextInput value={item.price} onChange={(v) => updateItem(ci, ii, { price: v })} placeholder="25 TL" /></Field>
                    <Field label="Aciklama"><TextInput value={item.description} onChange={(v) => updateItem(ci, ii, { description: v })} multiline rows={2} /></Field>
                    {data.showImages && <ImageUpload value={item.image ?? ""} onChange={(v) => updateItem(ci, ii, { image: v })} />}
                    <Field label="Etiket (opsiyonel)"><TextInput value={item.badge ?? ""} onChange={(v) => updateItem(ci, ii, { badge: v })} placeholder="Yeni, Populer..." /></Field>
                  </div>
                ))}
                <button onClick={() => updateCat(ci, { items: [...cat.items, emptyItem()] })}
                  className="w-full py-1 text-xs text-zinc-500 hover:text-zinc-800 border border-dashed border-zinc-200 rounded transition-colors">
                  + Urun Ekle
                </button>
              </div>
            </div>
          ))}
        </div>
        <button onClick={() => u({ categories: [...data.categories, emptyCategory()] })}
          className="w-full py-1.5 text-xs font-medium text-zinc-600 hover:text-zinc-900 border border-dashed border-zinc-300 rounded hover:border-zinc-400 transition-colors">
          + Kategori Ekle
        </button>
      </FieldGroup>
    </div>
  );
}
