"use client";

import { ContactData, SiteGlobalConfig } from "@/types/template";
import { FieldGroup, Field, TextInput, SelectInput } from "../SectionEditorWrapper";
import { Toggle } from "@/components/ui/Toggle";

interface Props {
  data: ContactData;
  onChange: (data: ContactData) => void;
  globalConfig: SiteGlobalConfig;
}

type FormField = ContactData["formFields"][number];
const emptyField = (): FormField => ({ name: `field_${Date.now()}`, type: "text", label: "Yeni Alan", required: false });

export function ContactEditor({ data, onChange }: Props) {
  const u = (patch: Partial<ContactData>) => onChange({ ...data, ...patch });
  const updateField = (i: number, patch: Partial<FormField>) => {
    u({ formFields: data.formFields.map((f, idx) => (idx === i ? { ...f, ...patch } : f)) });
  };

  return (
    <div className="space-y-6">
      <FieldGroup label="Icerik">
        <Field label="Baslik"><TextInput value={data.title} onChange={(v) => u({ title: v })} /></Field>
        <Field label="Alt Baslik"><TextInput value={data.subtitle} onChange={(v) => u({ subtitle: v })} /></Field>
      </FieldGroup>

      <FieldGroup label="Gorunum Ayarlari">
        <Toggle label="Form Goster" checked={data.showForm} onChange={(v) => u({ showForm: v })} />
        <Toggle label="Harita Goster" checked={data.showMap} onChange={(v) => u({ showMap: v })} />
        {data.showMap && (
          <Field label="Harita Embed URL">
            <TextInput value={data.mapEmbedUrl ?? ""} onChange={(v) => u({ mapEmbedUrl: v })} placeholder="https://maps.google.com/maps?..." />
          </Field>
        )}
      </FieldGroup>

      {data.showForm && (
        <FieldGroup label={`Form Alanlari (${data.formFields.length})`}>
          <div className="space-y-2">
            {data.formFields.map((field, i) => (
              <div key={i} className="border border-zinc-200 rounded-md p-3 bg-zinc-50 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-zinc-500">Alan {i + 1}</span>
                  <button onClick={() => u({ formFields: data.formFields.filter((_, idx) => idx !== i) })} className="text-zinc-400 hover:text-red-500 transition-colors">
                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
                </div>
                <Field label="Etiket"><TextInput value={field.label} onChange={(v) => updateField(i, { label: v })} /></Field>
                <Field label="Alan Tipi">
                  <SelectInput value={field.type} onChange={(v) => updateField(i, { type: v as FormField["type"] })}
                    options={[
                      { value: "text", label: "Metin" },
                      { value: "email", label: "Email" },
                      { value: "phone", label: "Telefon" },
                      { value: "textarea", label: "Uzun Metin" },
                      { value: "select", label: "Secim" },
                    ]} />
                </Field>
                <Toggle label="Zorunlu Alan" checked={field.required} onChange={(v) => updateField(i, { required: v })} />
              </div>
            ))}
          </div>
          <button onClick={() => u({ formFields: [...data.formFields, emptyField()] })}
            className="w-full py-1.5 text-xs font-medium text-zinc-600 hover:text-zinc-900 border border-dashed border-zinc-300 rounded hover:border-zinc-400 transition-colors">
            + Alan Ekle
          </button>
        </FieldGroup>
      )}
    </div>
  );
}
