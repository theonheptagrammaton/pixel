"use client";

import { PricingData, PricingPlan, SiteGlobalConfig } from "@/types/template";
import { FieldGroup, Field, TextInput } from "../SectionEditorWrapper";
import { Toggle } from "@/components/ui/Toggle";

interface Props {
  data: PricingData;
  onChange: (data: PricingData) => void;
  globalConfig: SiteGlobalConfig;
}

const emptyPlan = (): PricingPlan => ({
  name: "Yeni Plan",
  price: "0",
  period: "ay",
  description: "Plan aciklamasi",
  features: [],
  isPopular: false,
  ctaText: "Hemen Baslat",
  ctaLink: "#",
});

export function PricingEditor({ data, onChange }: Props) {
  const u = (patch: Partial<PricingData>) => onChange({ ...data, ...patch });
  const updatePlan = (i: number, patch: Partial<PricingPlan>) => {
    u({ plans: data.plans.map((p, idx) => (idx === i ? { ...p, ...patch } : p)) });
  };

  return (
    <div className="space-y-6">
      <FieldGroup label="Icerik">
        <Field label="Baslik"><TextInput value={data.title} onChange={(v) => u({ title: v })} /></Field>
        <Field label="Alt Baslik"><TextInput value={data.subtitle} onChange={(v) => u({ subtitle: v })} /></Field>
      </FieldGroup>

      <FieldGroup label={`Planlar (${data.plans.length})`}>
        <div className="space-y-3">
          {data.plans.map((plan, i) => (
            <div key={i} className="border border-zinc-200 rounded-md p-3 bg-zinc-50 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-zinc-500">Plan {i + 1}</span>
                <button onClick={() => u({ plans: data.plans.filter((_, idx) => idx !== i) })} className="text-zinc-400 hover:text-red-500 transition-colors">
                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
              <Field label="Plan Adi"><TextInput value={plan.name} onChange={(v) => updatePlan(i, { name: v })} /></Field>
              <Field label="Fiyat"><TextInput value={plan.price} onChange={(v) => updatePlan(i, { price: v })} placeholder="99" /></Field>
              <Field label="Donem"><TextInput value={plan.period} onChange={(v) => updatePlan(i, { period: v })} placeholder="ay" /></Field>
              <Field label="Aciklama"><TextInput value={plan.description} onChange={(v) => updatePlan(i, { description: v })} multiline rows={2} /></Field>
              <Field label="CTA Metni"><TextInput value={plan.ctaText} onChange={(v) => updatePlan(i, { ctaText: v })} /></Field>
              <Field label="CTA Linki"><TextInput value={plan.ctaLink} onChange={(v) => updatePlan(i, { ctaLink: v })} /></Field>
              <Toggle label="Populer Plan" checked={plan.isPopular} onChange={(v) => updatePlan(i, { isPopular: v })} />

              <div className="space-y-1">
                <label className="block text-xs font-medium text-zinc-700">Ozellikler</label>
                {plan.features.map((feat, fi) => (
                  <div key={fi} className="flex items-center gap-1.5">
                    <input type="text" value={feat}
                      onChange={(e) => updatePlan(i, { features: plan.features.map((f, fIdx) => (fIdx === fi ? e.target.value : f)) })}
                      className="flex-1 px-2 py-1 text-xs border border-zinc-200 rounded focus:outline-none focus:ring-1 focus:ring-zinc-900 bg-white"
                    />
                    <button onClick={() => updatePlan(i, { features: plan.features.filter((_, fIdx) => fIdx !== fi) })} className="text-zinc-400 hover:text-red-500 transition-colors">
                      <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                  </div>
                ))}
                <button onClick={() => updatePlan(i, { features: [...plan.features, "Yeni Ozellik"] })}
                  className="text-xs text-zinc-500 hover:text-zinc-800 transition-colors">+ Ozellik Ekle</button>
              </div>
            </div>
          ))}
        </div>
        <button onClick={() => u({ plans: [...data.plans, emptyPlan()] })}
          className="w-full py-1.5 text-xs font-medium text-zinc-600 hover:text-zinc-900 border border-dashed border-zinc-300 rounded hover:border-zinc-400 transition-colors">
          + Plan Ekle
        </button>
      </FieldGroup>
    </div>
  );
}
