"use client";

import { AboutData, SiteGlobalConfig } from "@/types/template";
import { FieldGroup, Field, TextInput, SelectInput } from "../SectionEditorWrapper";
import { ImageUpload } from "@/components/ui/ImageUpload";

interface Props {
  data: AboutData;
  onChange: (data: AboutData) => void;
  globalConfig: SiteGlobalConfig;
}

export function AboutEditor({ data, onChange }: Props) {
  const u = (patch: Partial<AboutData>) => onChange({ ...data, ...patch });

  function updateFeature(i: number, patch: Partial<AboutData["features"][number]>) {
    const features = data.features.map((f, idx) => (idx === i ? { ...f, ...patch } : f));
    u({ features });
  }

  return (
    <div className="space-y-6">
      <FieldGroup label="Icerik">
        <Field label="Baslik">
          <TextInput value={data.title} onChange={(v) => u({ title: v })} />
        </Field>
        <Field label="Alt Baslik">
          <TextInput value={data.subtitle} onChange={(v) => u({ subtitle: v })} />
        </Field>
        <Field label="Aciklama">
          <TextInput value={data.description} onChange={(v) => u({ description: v })} multiline rows={4} />
        </Field>
      </FieldGroup>

      <FieldGroup label="Gorsel">
        <ImageUpload label="Gorsel" value={data.image} onChange={(v) => u({ image: v })} hint="Onerilir: 800x600px" />
      </FieldGroup>

      <FieldGroup label="Duzen">
        <Field label="Gorsel Konumu">
          <SelectInput
            value={data.layout}
            onChange={(v) => u({ layout: v as AboutData["layout"] })}
            options={[
              { value: "image-left", label: "Gorsel Solda" },
              { value: "image-right", label: "Gorsel Sagda" },
              { value: "image-top", label: "Gorsel Ustte" },
            ]}
          />
        </Field>
      </FieldGroup>

      <FieldGroup label={`Ozellikler (${data.features.length})`}>
        <div className="space-y-2">
          {data.features.map((f, i) => (
            <div key={i} className="border border-zinc-200 rounded-md p-3 bg-zinc-50 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-zinc-500">Ozellik {i + 1}</span>
                <button
                  onClick={() => u({ features: data.features.filter((_, idx) => idx !== i) })}
                  className="text-zinc-400 hover:text-red-500 transition-colors"
                >
                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <Field label="Baslik">
                <TextInput value={f.title} onChange={(v) => updateFeature(i, { title: v })} />
              </Field>
              <Field label="Aciklama">
                <TextInput value={f.description} onChange={(v) => updateFeature(i, { description: v })} multiline rows={2} />
              </Field>
              <Field label="Ikon (emoji veya metin)">
                <TextInput value={f.icon} onChange={(v) => updateFeature(i, { icon: v })} placeholder="✓" />
              </Field>
            </div>
          ))}
        </div>
        <button
          onClick={() => u({ features: [...data.features, { icon: "✓", title: "Yeni Ozellik", description: "" }] })}
          className="w-full py-1.5 text-xs font-medium text-zinc-600 hover:text-zinc-900 border border-dashed border-zinc-300 rounded hover:border-zinc-400 transition-colors"
        >
          + Ozellik Ekle
        </button>
      </FieldGroup>
    </div>
  );
}
