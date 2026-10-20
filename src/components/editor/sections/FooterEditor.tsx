"use client";

import { FooterData, SiteGlobalConfig } from "@/types/template";
import { FieldGroup, Field, TextInput, SelectInput } from "../SectionEditorWrapper";
import { Toggle } from "@/components/ui/Toggle";

interface Props {
  data: FooterData;
  onChange: (data: FooterData) => void;
  globalConfig: SiteGlobalConfig;
}

type FooterColumn = NonNullable<FooterData["columns"]>[number];
type FooterLink = FooterColumn["links"][number];

export function FooterEditor({ data, onChange, globalConfig }: Props) {
  const u = (patch: Partial<FooterData>) => onChange({ ...data, ...patch });
  const columns = data.columns ?? [];

  const updateColumn = (ci: number, patch: Partial<FooterColumn>) => {
    u({ columns: columns.map((c, i) => (i === ci ? { ...c, ...patch } : c)) });
  };

  const updateLink = (ci: number, li: number, patch: Partial<FooterLink>) => {
    updateColumn(ci, { links: columns[ci].links.map((l, i) => (i === li ? { ...l, ...patch } : l)) });
  };

  const bgPresets = [
    { label: "Varsayılan (Koyu)", value: globalConfig.colors.text },
    { label: "Ana Renk", value: globalConfig.colors.primary },
    { label: "Arka Plan", value: globalConfig.colors.background },
    { label: "Yüzey", value: globalConfig.colors.surface },
    { label: "Vurgu", value: globalConfig.colors.accent },
  ];

  return (
    <div className="space-y-6">
      <FieldGroup label="Arka Plan Rengi">
        {/* Preset swatches */}
        <div className="flex flex-wrap gap-2 mb-2">
          {bgPresets.map((preset) => (
            <button
              key={preset.label}
              onClick={() => u({ backgroundColor: preset.value })}
              title={preset.label}
              className={`w-8 h-8 rounded-full border-2 transition-all ${
                (data.backgroundColor || globalConfig.colors.text) === preset.value
                  ? "border-zinc-900 scale-110"
                  : "border-zinc-300 hover:border-zinc-500"
              }`}
              style={{ backgroundColor: preset.value }}
            />
          ))}
        </div>
        {/* Custom color picker */}
        <Field label="Özel Renk">
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={data.backgroundColor || globalConfig.colors.text}
              onChange={(e) => u({ backgroundColor: e.target.value })}
              className="w-8 h-8 rounded cursor-pointer border border-zinc-200"
            />
            <input
              type="text"
              value={data.backgroundColor || globalConfig.colors.text}
              onChange={(e) => u({ backgroundColor: e.target.value })}
              className="flex-1 px-2 py-1.5 text-xs border border-zinc-200 rounded focus:outline-none focus:ring-1 focus:ring-zinc-900 font-mono"
            />
          </div>
        </Field>
      </FieldGroup>
      <FieldGroup label="Genel">
        <Field label="Duzen">
          <SelectInput value={data.layout} onChange={(v) => u({ layout: v as FooterData["layout"] })}
            options={[{ value: "simple", label: "Basit" }, { value: "columns", label: "Kolonlu" }, { value: "minimal", label: "Minimal" }]} />
        </Field>
        <Field label="Telif Hakki Metni">
          <TextInput value={data.copyright} onChange={(v) => u({ copyright: v })} />
        </Field>
        <Toggle label="Sosyal Medya Linklerini Goster" checked={data.showSocialLinks} onChange={(v) => u({ showSocialLinks: v })} />
        <Toggle label="Bulten Aboneligi Goster" checked={data.showNewsletter} onChange={(v) => u({ showNewsletter: v })} />
      </FieldGroup>

      {data.layout === "columns" && (
        <FieldGroup label={`Kolonlar (${columns.length})`}>
          <div className="space-y-3">
            {columns.map((col, ci) => (
              <div key={ci} className="border border-zinc-200 rounded-md p-3 bg-zinc-50 space-y-2">
                <div className="flex items-center justify-between">
                  <Field label="Kolon Basligi">
                    <TextInput value={col.title} onChange={(v) => updateColumn(ci, { title: v })} />
                  </Field>
                  <button onClick={() => u({ columns: columns.filter((_, i) => i !== ci) })} className="ml-2 shrink-0 text-zinc-400 hover:text-red-500 transition-colors self-start mt-1">
                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
                </div>
                <div className="space-y-1.5">
                  {col.links.map((link, li) => (
                    <div key={li} className="flex items-center gap-1.5">
                      <input type="text" value={link.label} onChange={(e) => updateLink(ci, li, { label: e.target.value })} placeholder="Metin" className="flex-1 px-2 py-1 text-xs border border-zinc-200 rounded focus:outline-none focus:ring-1 focus:ring-zinc-900 bg-white" />
                      <input type="text" value={link.link} onChange={(e) => updateLink(ci, li, { link: e.target.value })} placeholder="URL" className="flex-1 px-2 py-1 text-xs border border-zinc-200 rounded focus:outline-none focus:ring-1 focus:ring-zinc-900 bg-white" />
                      <button onClick={() => updateColumn(ci, { links: col.links.filter((_, i) => i !== li) })} className="text-zinc-400 hover:text-red-500 transition-colors">
                        <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                      </button>
                    </div>
                  ))}
                  <button onClick={() => updateColumn(ci, { links: [...col.links, { label: "Yeni Link", link: "#" }] })}
                    className="text-xs text-zinc-500 hover:text-zinc-800 transition-colors">+ Link Ekle</button>
                </div>
              </div>
            ))}
          </div>
          <button onClick={() => u({ columns: [...columns, { title: "Yeni Kolon", links: [] }] })}
            className="w-full py-1.5 text-xs font-medium text-zinc-600 hover:text-zinc-900 border border-dashed border-zinc-300 rounded hover:border-zinc-400 transition-colors">
            + Kolon Ekle
          </button>
        </FieldGroup>
      )}
    </div>
  );
}
