"use client";

import { StatsData, SiteGlobalConfig } from "@/types/template";
import { FieldGroup, Field, TextInput, SelectInput } from "../SectionEditorWrapper";

interface Props {
  data: StatsData;
  onChange: (data: StatsData) => void;
  globalConfig: SiteGlobalConfig;
}

function emptyItem() {
  return { value: "100", label: "Baslik", prefix: "", suffix: "+", description: "" };
}

export function StatsEditor({ data, onChange }: Props) {
  const u = (patch: Partial<StatsData>) => onChange({ ...data, ...patch });

  const updateItem = (i: number, patch: Partial<StatsData["items"][0]>) => {
    const items = data.items.map((it, idx) => (idx === i ? { ...it, ...patch } : it));
    u({ items });
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <FieldGroup label="Genel">
        <Field label="Baslik (Opsiyonel)">
          <TextInput value={data.title ?? ""} onChange={(v) => u({ title: v })} placeholder="Rakamlarla Biz" />
        </Field>
        <Field label="Alt Baslik (Opsiyonel)">
          <TextInput value={data.subtitle ?? ""} onChange={(v) => u({ subtitle: v })} placeholder="Kisa aciklama" />
        </Field>
      </FieldGroup>

      <FieldGroup label="Gorunum">
        <Field label="Duzen">
          <SelectInput
            value={data.layout}
            onChange={(v) => u({ layout: v as StatsData["layout"] })}
            options={[
              { value: "grid", label: "Izgara" },
              { value: "centered", label: "Ortali" },
            ]}
          />
        </Field>
        <Field label="Arka Plan">
          <SelectInput
            value={data.background}
            onChange={(v) => u({ background: v as StatsData["background"] })}
            options={[
              { value: "background", label: "Sayfa Arkaplan" },
              { value: "surface", label: "Yuzeyi" },
              { value: "primary", label: "Ana Renk (Koyu)" },
            ]}
          />
        </Field>
      </FieldGroup>

      <FieldGroup label={`Istatistikler (${data.items.length})`}>
        {data.items.map((item, i) => (
          <div
            key={i}
            style={{
              border: "1px solid #e4e4e7",
              borderRadius: 8,
              padding: "12px 14px",
              background: "#fafafa",
              display: "flex",
              flexDirection: "column",
              gap: 8,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
              <span style={{ fontSize: 11, fontWeight: 600, color: "#71717a", textTransform: "uppercase" }}>
                Istatistik {i + 1}
              </span>
              <button
                onClick={() => u({ items: data.items.filter((_, idx) => idx !== i) })}
                style={{ background: "none", border: "none", cursor: "pointer", color: "#ef4444", fontSize: 14, padding: 0 }}
              >
                ✕
              </button>
            </div>
            <Field label="Deger">
              <TextInput value={item.value} onChange={(v) => updateItem(i, { value: v })} placeholder="100" />
            </Field>
            <Field label="Etiket">
              <TextInput value={item.label} onChange={(v) => updateItem(i, { label: v })} placeholder="Mutlu Musteri" />
            </Field>
            <Field label="On Ek (Opsiyonel)">
              <TextInput value={item.prefix ?? ""} onChange={(v) => updateItem(i, { prefix: v })} placeholder="₺" />
            </Field>
            <Field label="Son Ek (Opsiyonel)">
              <TextInput value={item.suffix ?? ""} onChange={(v) => updateItem(i, { suffix: v })} placeholder="+" />
            </Field>
            <Field label="Aciklama (Opsiyonel)">
              <TextInput value={item.description ?? ""} onChange={(v) => updateItem(i, { description: v })} placeholder="Kisa aciklama" />
            </Field>
          </div>
        ))}
        <button
          onClick={() => u({ items: [...data.items, emptyItem()] })}
          style={{
            width: "100%",
            padding: "8px 0",
            border: "1px dashed #d4d4d8",
            borderRadius: 6,
            background: "none",
            cursor: "pointer",
            fontSize: 12,
            fontWeight: 500,
            color: "#52525b",
          }}
        >
          + Istatistik Ekle
        </button>
      </FieldGroup>
    </div>
  );
}
