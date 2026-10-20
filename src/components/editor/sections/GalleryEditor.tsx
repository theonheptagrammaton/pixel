"use client";

import { GalleryData, SiteGlobalConfig } from "@/types/template";
import { FieldGroup, Field, TextInput, SelectInput } from "../SectionEditorWrapper";
import { ImageUpload } from "@/components/ui/ImageUpload";

interface Props {
  data: GalleryData;
  onChange: (data: GalleryData) => void;
  globalConfig: SiteGlobalConfig;
}

type GalleryImage = GalleryData["images"][number];
const emptyImage = (): GalleryImage => ({ url: "", alt: "", caption: "" });

export function GalleryEditor({ data, onChange }: Props) {
  const u = (patch: Partial<GalleryData>) => onChange({ ...data, ...patch });
  const updateImg = (i: number, patch: Partial<GalleryImage>) => {
    u({ images: data.images.map((img, idx) => (idx === i ? { ...img, ...patch } : img)) });
  };

  return (
    <div className="space-y-6">
      <FieldGroup label="Icerik">
        <Field label="Baslik"><TextInput value={data.title} onChange={(v) => u({ title: v })} /></Field>
        <Field label="Alt Baslik"><TextInput value={data.subtitle} onChange={(v) => u({ subtitle: v })} /></Field>
      </FieldGroup>

      <FieldGroup label="Duzen">
        <Field label="Gorunum">
          <SelectInput value={data.layout} onChange={(v) => u({ layout: v as GalleryData["layout"] })}
            options={[{ value: "grid", label: "Izgara" }, { value: "masonry", label: "Masonry" }, { value: "slider", label: "Kaydirici" }]} />
        </Field>
        <Field label="Kolon Sayisi">
          <SelectInput value={String(data.columns)} onChange={(v) => u({ columns: Number(v) as GalleryData["columns"] })}
            options={[{ value: "2", label: "2 Kolon" }, { value: "3", label: "3 Kolon" }, { value: "4", label: "4 Kolon" }]} />
        </Field>
      </FieldGroup>

      <FieldGroup label={`Gorseller (${data.images.length})`}>
        <div className="space-y-3">
          {data.images.map((img, i) => (
            <div key={i} className="border border-zinc-200 rounded-md p-3 bg-zinc-50 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-zinc-500">Gorsel {i + 1}</span>
                <button onClick={() => u({ images: data.images.filter((_, idx) => idx !== i) })} className="text-zinc-400 hover:text-red-500 transition-colors">
                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
              <ImageUpload value={img.url} onChange={(v) => updateImg(i, { url: v })} />
              <Field label="Alt Metni (SEO)"><TextInput value={img.alt} onChange={(v) => updateImg(i, { alt: v })} placeholder="Gorsel aciklamasi" /></Field>
              <Field label="Altyazi (opsiyonel)"><TextInput value={img.caption ?? ""} onChange={(v) => updateImg(i, { caption: v })} /></Field>
            </div>
          ))}
        </div>
        <button onClick={() => u({ images: [...data.images, emptyImage()] })}
          className="w-full py-1.5 text-xs font-medium text-zinc-600 hover:text-zinc-900 border border-dashed border-zinc-300 rounded hover:border-zinc-400 transition-colors">
          + Gorsel Ekle
        </button>
      </FieldGroup>
    </div>
  );
}
