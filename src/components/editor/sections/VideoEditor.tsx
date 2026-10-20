"use client";

import { VideoData, SiteGlobalConfig } from "@/types/template";
import { FieldGroup, Field, TextInput, SelectInput } from "../SectionEditorWrapper";
import { ImageUpload } from "@/components/ui/ImageUpload";
import { Toggle } from "@/components/ui/Toggle";

interface Props {
  data: VideoData;
  onChange: (data: VideoData) => void;
  globalConfig: SiteGlobalConfig;
}

export function VideoEditor({ data, onChange }: Props) {
  const u = (patch: Partial<VideoData>) => onChange({ ...data, ...patch });

  return (
    <div className="space-y-6">
      <FieldGroup label="Icerik">
        <Field label="Baslik">
          <TextInput value={data.title} onChange={(v) => u({ title: v })} placeholder="Video baslik" />
        </Field>
        <Field label="Alt Baslik">
          <TextInput value={data.subtitle || ""} onChange={(v) => u({ subtitle: v })} placeholder="Video aciklama" />
        </Field>
      </FieldGroup>

      <FieldGroup label="Video">
        <Field label="Video URL" hint="YouTube veya Vimeo linki yapistirin">
          <TextInput
            value={data.videoUrl}
            onChange={(v) => u({ videoUrl: v })}
            placeholder="https://www.youtube.com/watch?v=... veya https://vimeo.com/..."
          />
        </Field>
        <ImageUpload
          label="Onizleme Gorseli"
          value={data.thumbnailImage}
          onChange={(v) => u({ thumbnailImage: v })}
          hint="Video baslamadan once gorunecek gorsel (16:9 onerilir)"
        />
        <Field label="Uzerine Yazi (opsiyonel)">
          <TextInput
            value={data.overlayText || ""}
            onChange={(v) => u({ overlayText: v })}
            placeholder="Videoyu izle"
          />
        </Field>
        <Toggle
          checked={data.autoplay}
          onChange={(v) => u({ autoplay: v })}
          label="Otomatik Oynat"
        />
      </FieldGroup>

      <FieldGroup label="Duzen">
        <Field label="Yerlestirme">
          <SelectInput
            value={data.layout}
            onChange={(v) => u({ layout: v as VideoData["layout"] })}
            options={[
              { value: "contained", label: "Sinirli Genislik (900px)" },
              { value: "full-width", label: "Tam Genislik" },
            ]}
          />
        </Field>
      </FieldGroup>
    </div>
  );
}
