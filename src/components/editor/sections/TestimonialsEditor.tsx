"use client";

import { TestimonialsData, TestimonialItem, SiteGlobalConfig } from "@/types/template";
import { FieldGroup, Field, TextInput, SelectInput } from "../SectionEditorWrapper";
import { ImageUpload } from "@/components/ui/ImageUpload";

interface Props {
  data: TestimonialsData;
  onChange: (data: TestimonialsData) => void;
  globalConfig: SiteGlobalConfig;
}

const emptyItem = (): TestimonialItem => ({ name: "Musteri Adi", role: "Unvan", avatar: "", content: "Yorum metni buraya gelecek.", rating: 5 });

export function TestimonialsEditor({ data, onChange }: Props) {
  const u = (patch: Partial<TestimonialsData>) => onChange({ ...data, ...patch });
  const updateItem = (i: number, patch: Partial<TestimonialItem>) => {
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
          <SelectInput value={data.layout} onChange={(v) => u({ layout: v as TestimonialsData["layout"] })}
            options={[{ value: "grid", label: "Izgara" }, { value: "slider", label: "Kaydirici" }, { value: "stacked", label: "Istifli" }]} />
        </Field>
      </FieldGroup>

      <FieldGroup label={`Yorumlar (${data.items.length})`}>
        <div className="space-y-3">
          {data.items.map((item, i) => (
            <div key={i} className="border border-zinc-200 rounded-md p-3 bg-zinc-50 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-zinc-500">Yorum {i + 1}</span>
                <button onClick={() => u({ items: data.items.filter((_, idx) => idx !== i) })} className="text-zinc-400 hover:text-red-500 transition-colors">
                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
              <Field label="Ad Soyad"><TextInput value={item.name} onChange={(v) => updateItem(i, { name: v })} /></Field>
              <Field label="Unvan / Rol"><TextInput value={item.role} onChange={(v) => updateItem(i, { role: v })} placeholder="CEO, Musteri..." /></Field>
              <Field label="Yorum">
                <TextInput value={item.content} onChange={(v) => updateItem(i, { content: v })} multiline rows={3} />
              </Field>
              <Field label="Puan (1-5)">
                <SelectInput value={String(item.rating)} onChange={(v) => updateItem(i, { rating: Number(v) })}
                  options={[1,2,3,4,5].map((n) => ({ value: String(n), label: `${n} Yildiz` }))} />
              </Field>
              <ImageUpload label="Profil Fotografi" value={item.avatar} onChange={(v) => updateItem(i, { avatar: v })} hint="100x100px onerilir" />
            </div>
          ))}
        </div>
        <button onClick={() => u({ items: [...data.items, emptyItem()] })}
          className="w-full py-1.5 text-xs font-medium text-zinc-600 hover:text-zinc-900 border border-dashed border-zinc-300 rounded hover:border-zinc-400 transition-colors">
          + Yorum Ekle
        </button>
      </FieldGroup>
    </div>
  );
}
