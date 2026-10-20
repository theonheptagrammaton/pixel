"use client";

import { PartnersData, PartnerItem } from "@/types/template";
import { SiteGlobalConfig } from "@/types/template";
import { FieldGroup, Field, TextInput, SelectInput } from "../SectionEditorWrapper";
import { Toggle } from "@/components/ui/Toggle";
import { ImageUpload } from "@/components/ui/ImageUpload";
import { ArrayField } from "../ArrayField";

interface Props {
  data: PartnersData;
  onChange: (data: PartnersData) => void;
  globalConfig: SiteGlobalConfig;
}

export function PartnersEditor({ data, onChange }: Props) {
  const u = (patch: Partial<PartnersData>) => onChange({ ...data, ...patch });

  const updateItem = (index: number, patch: Partial<PartnerItem>) => {
    const items = [...data.items];
    items[index] = { ...items[index], ...patch };
    u({ items });
  };

  const addItem = () => {
    u({
      items: [
        ...data.items,
        { name: "", logo: "", url: "" },
      ],
    });
  };

  const removeItem = (index: number) => {
    const items = data.items.filter((_, i) => i !== index);
    u({ items });
  };

  return (
    <div className="space-y-6">
      <FieldGroup label="Icerik">
        <Field label="Baslik">
          <TextInput value={data.title} onChange={(v) => u({ title: v })} placeholder="Partnerlerimiz" />
        </Field>
        <Field label="Alt Baslik">
          <TextInput value={data.subtitle || ""} onChange={(v) => u({ subtitle: v })} placeholder="Birlikte calistigimiz markalar" />
        </Field>
      </FieldGroup>

      <FieldGroup label="Gorunum">
        <Field label="Yerlestirme">
          <SelectInput
            value={data.layout}
            onChange={(v) => u({ layout: v as PartnersData["layout"] })}
            options={[
              { value: "grid", label: "Grid" },
              { value: "carousel", label: "Yatay Kaydirma" },
            ]}
          />
        </Field>
        <Field label="Sutun Sayisi">
          <SelectInput
            value={String(data.columns)}
            onChange={(v) => u({ columns: Number(v) as PartnersData["columns"] })}
            options={[
              { value: "3", label: "3 Sutun" },
              { value: "4", label: "4 Sutun" },
              { value: "5", label: "5 Sutun" },
              { value: "6", label: "6 Sutun" },
            ]}
          />
        </Field>
        <Toggle
          checked={data.grayscale}
          onChange={(v) => u({ grayscale: v })}
          label="Gri Tonlama (hover ile renkli)"
        />
      </FieldGroup>

      <ArrayField<PartnerItem>
        label="Partnerler"
        items={data.items}
        onAdd={addItem}
        onRemove={removeItem}
        onUpdate={(index, updated) => {
          const items = [...data.items];
          items[index] = updated;
          u({ items });
        }}
        addLabel="Partner Ekle"
        emptyMessage="Henuz partner eklenmedi."
        renderItem={(item, index) => (
          <div className="space-y-2">
            <Field label="Partner Adi">
              <TextInput
                value={item.name}
                onChange={(v) => updateItem(index, { name: v })}
                placeholder="Partner adi"
              />
            </Field>
            <ImageUpload
              label="Logo"
              value={item.logo}
              onChange={(v) => updateItem(index, { logo: v })}
              hint="Seffaf PNG onerilir"
            />
            <Field label="Web Sitesi (opsiyonel)">
              <TextInput
                value={item.url || ""}
                onChange={(v) => updateItem(index, { url: v })}
                placeholder="https://..."
              />
            </Field>
          </div>
        )}
      />
    </div>
  );
}
