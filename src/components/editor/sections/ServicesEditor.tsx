"use client";

import { ServicesData, ServiceItem, SiteGlobalConfig } from "@/types/template";
import { FieldGroup, Field, TextInput, SelectInput } from "../SectionEditorWrapper";
import { ImageUpload } from "@/components/ui/ImageUpload";

interface Props {
  data: ServicesData;
  onChange: (data: ServicesData) => void;
  globalConfig: SiteGlobalConfig;
}

const emptyItem = (): ServiceItem => ({ icon: "", title: "Yeni Hizmet", description: "", image: "", price: "" });

export function ServicesEditor({ data, onChange }: Props) {
  const u = (patch: Partial<ServicesData>) => onChange({ ...data, ...patch });
  const updateItem = (i: number, patch: Partial<ServiceItem>) => {
    u({ items: data.items.map((it, idx) => (idx === i ? { ...it, ...patch } : it)) });
  };

  return (
    <div className="space-y-6">
      <FieldGroup label="Icerik">
        <Field label="Baslik"><TextInput value={data.title} onChange={(v) => u({ title: v })} /></Field>
        <Field label="Alt Baslik"><TextInput value={data.subtitle} onChange={(v) => u({ subtitle: v })} /></Field>
      </FieldGroup>

      <FieldGroup label="Duzen">
        <Field label="Gorunum">
          <SelectInput value={data.layout} onChange={(v) => u({ layout: v as ServicesData["layout"] })}
            options={[{ value: "grid", label: "Izgara" }, { value: "list", label: "Liste" }, { value: "cards", label: "Kartlar" }]} />
        </Field>
        <Field label="Kolon Sayisi">
          <SelectInput value={String(data.columns)} onChange={(v) => u({ columns: Number(v) as ServicesData["columns"] })}
            options={[{ value: "2", label: "2 Kolon" }, { value: "3", label: "3 Kolon" }, { value: "4", label: "4 Kolon" }]} />
        </Field>
      </FieldGroup>

      <FieldGroup label={`Hizmetler (${data.items.length})`}>
        <div className="space-y-3">
          {data.items.map((item, i) => (
            <div key={i} className="border border-zinc-200 rounded-md p-3 bg-zinc-50 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-zinc-500">Hizmet {i + 1}</span>
                <button onClick={() => u({ items: data.items.filter((_, idx) => idx !== i) })} className="text-zinc-400 hover:text-red-500 transition-colors">
                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
              <Field label="Baslik"><TextInput value={item.title} onChange={(v) => updateItem(i, { title: v })} /></Field>
              <Field label="Aciklama"><TextInput value={item.description} onChange={(v) => updateItem(i, { description: v })} multiline rows={2} /></Field>
              <Field label="Fiyat (opsiyonel)"><TextInput value={item.price ?? ""} onChange={(v) => updateItem(i, { price: v })} placeholder="99 TL" /></Field>
              <ImageUpload label="Gorsel" value={item.image} onChange={(v) => updateItem(i, { image: v })} />
            </div>
          ))}
        </div>
        <button onClick={() => u({ items: [...data.items, emptyItem()] })}
          className="w-full py-1.5 text-xs font-medium text-zinc-600 hover:text-zinc-900 border border-dashed border-zinc-300 rounded hover:border-zinc-400 transition-colors">
          + Hizmet Ekle
        </button>
      </FieldGroup>
    </div>
  );
}
