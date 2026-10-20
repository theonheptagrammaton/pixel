"use client";

import { BlogData, SiteGlobalConfig } from "@/types/template";
import { FieldGroup, Field, TextInput, SelectInput } from "../SectionEditorWrapper";
import { Toggle } from "@/components/ui/Toggle";
import Link from "next/link";

interface Props {
  data: BlogData;
  onChange: (data: BlogData) => void;
  globalConfig: SiteGlobalConfig;
}

export function BlogEditor({ data, onChange }: Props) {
  const u = (patch: Partial<BlogData>) => onChange({ ...data, ...patch });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <FieldGroup label="Icerik">
        <Field label="Baslik">
          <TextInput
            value={data.title}
            onChange={(v) => u({ title: v })}
            placeholder="Blog Yazilarimiz"
          />
        </Field>
        <Field label="Alt Baslik">
          <TextInput
            value={data.subtitle}
            onChange={(v) => u({ subtitle: v })}
            placeholder="Kisa aciklama"
          />
        </Field>
      </FieldGroup>

      <FieldGroup label="Gorunum">
        <Field label="Duzen">
          <SelectInput
            value={data.layout}
            onChange={(v) => u({ layout: v as BlogData["layout"] })}
            options={[
              { value: "grid", label: "Izgara (3 Kolon)" },
              { value: "list", label: "Liste" },
            ]}
          />
        </Field>
        <Field label="Sayfa Basina Yazi">
          <SelectInput
            value={String(data.postsPerPage || 6)}
            onChange={(v) => u({ postsPerPage: parseInt(v, 10) })}
            options={[
              { value: "3", label: "3" },
              { value: "6", label: "6" },
              { value: "9", label: "9" },
              { value: "12", label: "12" },
            ]}
          />
        </Field>
        <Field label="Kategori Filtreleri">
          <Toggle
            checked={data.showCategories ?? true}
            onChange={(v) => u({ showCategories: v })}
            label="Kategorileri goster"
          />
        </Field>
        <Field label="Devamini Oku Butonu">
          <Toggle
            checked={data.showReadMore}
            onChange={(v) => u({ showReadMore: v })}
            label="Butonu goster"
          />
        </Field>
      </FieldGroup>

      {/* Blog management link */}
      <Link
        href="/blog"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
          padding: "14px 16px",
          border: "1px solid #e4e4e7",
          borderRadius: 8,
          background: "#fafafa",
          textDecoration: "none",
          transition: "border-color 0.2s",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = "#a1a1aa";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = "#e4e4e7";
        }}
      >
        <div>
          <p
            style={{
              margin: 0,
              fontSize: 13,
              fontWeight: 600,
              color: "#18181b",
            }}
          >
            Blog Yonetimi
          </p>
          <p
            style={{
              margin: "4px 0 0",
              fontSize: 12,
              color: "#71717a",
            }}
          >
            Blog yazilarinizi dashboard uzerinden yonetin.
          </p>
        </div>
        <svg
          style={{ width: 16, height: 16, color: "#a1a1aa", flexShrink: 0 }}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 5l7 7-7 7"
          />
        </svg>
      </Link>
    </div>
  );
}
