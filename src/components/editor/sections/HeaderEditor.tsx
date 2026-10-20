"use client";

import { HeaderData, SiteGlobalConfig } from "@/types/template";
import { FieldGroup, Field, TextInput, SelectInput } from "../SectionEditorWrapper";
import { Toggle } from "@/components/ui/Toggle";
import { useEditorStore } from "@/stores/editor-store";

interface Props {
  data: HeaderData;
  onChange: (data: HeaderData) => void;
  globalConfig: SiteGlobalConfig;
}

type MenuItem = HeaderData["menuItems"][number];

export function HeaderEditor({ data, onChange }: Props) {
  const { config } = useEditorStore();
  const pages = config?.pages ?? [];

  const u = (patch: Partial<HeaderData>) => onChange({ ...data, ...patch });
  const updateItem = (i: number, patch: Partial<MenuItem>) => {
    u({ menuItems: data.menuItems.map((it, idx) => (idx === i ? { ...it, ...patch } : it)) });
  };

  const addPageToMenu = (pageSlug: string, pageName: string) => {
    const link = pageSlug === "" ? "/" : `/${pageSlug}`;
    const already = data.menuItems.some((it) => it.link === link);
    if (already) return;
    u({ menuItems: [...data.menuItems, { label: pageName, link }] });
  };

  return (
    <div className="space-y-6">
      <FieldGroup label="Duzen">
        <Field label="Header Stili">
          <SelectInput value={data.layout} onChange={(v) => u({ layout: v as HeaderData["layout"] })}
            options={[
              { value: "left-aligned", label: "Sola Hizali" },
              { value: "centered", label: "Ortalanmis" },
              { value: "split", label: "Bolunmus" },
            ]} />
        </Field>
        <Toggle label="Sabit Header (Sticky)" checked={data.sticky} onChange={(v) => u({ sticky: v })} />
        <Toggle label="Seffaf Header" checked={data.transparent} onChange={(v) => u({ transparent: v })} />
      </FieldGroup>

      {/* Site pages quick-add */}
      {pages.length > 0 && (
        <FieldGroup label="Sitenizin Sayfalari">
          <p className="text-xs text-zinc-400 mb-2">
            Butona tikklayarak sayfayi menu ogeleri listesine ekleyin.
          </p>
          <div className="flex flex-wrap gap-1.5">
            {[...pages].sort((a, b) => a.order - b.order).map((page) => {
              const link = page.slug === "" ? "/" : `/${page.slug}`;
              const alreadyAdded = data.menuItems.some((it) => it.link === link);
              return (
                <button
                  key={page.id}
                  onClick={() => addPageToMenu(page.slug, page.name)}
                  disabled={alreadyAdded}
                  className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium border transition-colors ${
                    alreadyAdded
                      ? "border-zinc-200 text-zinc-300 bg-zinc-50 cursor-default"
                      : "border-zinc-300 text-zinc-600 hover:border-zinc-500 hover:text-zinc-900 hover:bg-zinc-50"
                  }`}
                >
                  {page.name}
                  <span className="font-mono text-zinc-400">{link}</span>
                  {alreadyAdded ? (
                    <svg className="h-3 w-3 text-zinc-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                    </svg>
                  )}
                </button>
              );
            })}
          </div>
        </FieldGroup>
      )}

      <FieldGroup label={`Menu Ogeleri (${data.menuItems.length})`}>
        <div className="space-y-2">
          {data.menuItems.map((item, i) => (
            <div key={i} className="flex items-center gap-2 border border-zinc-200 rounded p-2 bg-zinc-50">
              <div className="flex-1 space-y-1.5">
                <Field label="Etiket"><TextInput value={item.label} onChange={(v) => updateItem(i, { label: v })} /></Field>
                <Field label="Link">
                  <TextInput
                    value={item.link}
                    onChange={(v) => updateItem(i, { link: v })}
                    placeholder="/ veya /sayfa-adi veya #bolum"
                  />
                </Field>
              </div>
              <button onClick={() => u({ menuItems: data.menuItems.filter((_, idx) => idx !== i) })} className="text-zinc-400 hover:text-red-500 transition-colors self-start mt-1 shrink-0">
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
          ))}
        </div>
        <button onClick={() => u({ menuItems: [...data.menuItems, { label: "Yeni Sayfa", link: "/" }] })}
          className="w-full py-1.5 text-xs font-medium text-zinc-600 hover:text-zinc-900 border border-dashed border-zinc-300 rounded hover:border-zinc-400 transition-colors">
          + Bosluk Ogesi Ekle
        </button>
      </FieldGroup>
    </div>
  );
}
