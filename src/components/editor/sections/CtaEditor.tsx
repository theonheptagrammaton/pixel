"use client";

import { CtaData, SiteGlobalConfig } from "@/types/template";
import { FieldGroup, Field, TextInput } from "../SectionEditorWrapper";
import { ImageUpload } from "@/components/ui/ImageUpload";
import { ColorPicker } from "../ColorPicker";

interface Props {
  data: CtaData;
  onChange: (data: CtaData) => void;
  globalConfig: SiteGlobalConfig;
}

export function CtaEditor({ data, onChange }: Props) {
  const u = (patch: Partial<CtaData>) => onChange({ ...data, ...patch });

  return (
    <div className="space-y-6">
      <FieldGroup label="Icerik">
        <Field label="Baslik"><TextInput value={data.title} onChange={(v) => u({ title: v })} /></Field>
        <Field label="Aciklama"><TextInput value={data.description} onChange={(v) => u({ description: v })} multiline rows={3} /></Field>
        <Field label="Buton Metni"><TextInput value={data.buttonText} onChange={(v) => u({ buttonText: v })} /></Field>
        <Field label="Buton Linki"><TextInput value={data.buttonLink} onChange={(v) => u({ buttonLink: v })} placeholder="#contact" /></Field>
      </FieldGroup>

      <FieldGroup label="Arka Plan">
        <ImageUpload label="Arka Plan Gorseli" value={data.backgroundImage ?? ""} onChange={(v) => u({ backgroundImage: v })} />
        <ColorPicker label="Arka Plan Rengi" value={data.backgroundColor ?? "#000000"} onChange={(v) => u({ backgroundColor: v })} />
      </FieldGroup>
    </div>
  );
}
