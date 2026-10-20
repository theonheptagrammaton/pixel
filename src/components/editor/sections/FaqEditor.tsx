"use client";

import { FaqData, FaqItem, SiteGlobalConfig } from "@/types/template";
import { FieldGroup, Field, TextInput } from "../SectionEditorWrapper";

interface Props {
  data: FaqData;
  onChange: (data: FaqData) => void;
  globalConfig: SiteGlobalConfig;
}

const emptyItem = (): FaqItem => ({ question: "Yeni Soru?", answer: "Cevap buraya gelecek." });

export function FaqEditor({ data, onChange }: Props) {
  const u = (patch: Partial<FaqData>) => onChange({ ...data, ...patch });
  const updateItem = (i: number, patch: Partial<FaqItem>) => {
    u({ items: data.items.map((it, idx) => (idx === i ? { ...it, ...patch } : it)) });
  };

  return (
    <div className="space-y-6">
      <FieldGroup label="Icerik">
        <Field label="Baslik"><TextInput value={data.title} onChange={(v) => u({ title: v })} /></Field>
        <Field label="Alt Baslik"><TextInput value={data.subtitle} onChange={(v) => u({ subtitle: v })} /></Field>
      </FieldGroup>

      <FieldGroup label={`Sorular (${data.items.length})`}>
        <div className="space-y-2">
          {data.items.map((item, i) => (
            <div key={i} className="border border-zinc-200 rounded-md p-3 bg-zinc-50 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-zinc-500">Soru {i + 1}</span>
                <button onClick={() => u({ items: data.items.filter((_, idx) => idx !== i) })} className="text-zinc-400 hover:text-red-500 transition-colors">
                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
              <Field label="Soru"><TextInput value={item.question} onChange={(v) => updateItem(i, { question: v })} /></Field>
              <Field label="Cevap"><TextInput value={item.answer} onChange={(v) => updateItem(i, { answer: v })} multiline rows={3} /></Field>
            </div>
          ))}
        </div>
        <button onClick={() => u({ items: [...data.items, emptyItem()] })}
          className="w-full py-1.5 text-xs font-medium text-zinc-600 hover:text-zinc-900 border border-dashed border-zinc-300 rounded hover:border-zinc-400 transition-colors">
          + Soru Ekle
        </button>
      </FieldGroup>
    </div>
  );
}
