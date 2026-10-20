"use client";

import { memo } from "react";
import { AboutData, SiteGlobalConfig } from "@/types/template";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";
import { SectionTitle } from "../section-title";
import { ImagePlaceholder } from "../image-placeholder";

interface Props {
  data: AboutData;
  global: SiteGlobalConfig;
  isPreview?: boolean;
}

export const AboutRender = memo(function AboutRender({ data, global, isPreview }: Props) {
  const { ref, visible } = useScrollAnimation(isPreview);

  const imageFirst = data.layout === "image-left";
  const isTop = data.layout === "image-top";

  return (
    <section
      className="sf-section-pad"
      style={{
        background: "transparent",
        padding: "96px 24px",
        fontFamily: global.fonts.body,
      }}
      id="about"
    >
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        {isTop ? (
          <div
            ref={ref as React.RefObject<HTMLDivElement>}
            style={{
              transition: "opacity 0.7s ease, transform 0.7s ease",
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0)" : "translateY(28px)",
            }}
          >
            <SectionTitle
              title={data.title}
              subtitle={data.subtitle}
              headingFont={global.fonts.heading}
              bodyFont={global.fonts.body}
              titleColor={global.colors.text}
              subtitleColor={global.colors.textLight}
              accentColor={global.colors.accent}
            />
            {data.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                loading="lazy"
                src={data.image}
                alt={data.title}
                style={{
                  width: "100%",
                  maxHeight: 480,
                  objectFit: "cover",
                  borderRadius: 16,
                  marginBottom: 48,
                }}
              />
            ) : (
              <ImagePlaceholder height={360} className="rounded-2xl mb-12" label="Gorsel" />
            )}
            <p style={{ color: global.colors.textLight, lineHeight: 1.8, fontSize: 17, maxWidth: 720, margin: "0 auto", textAlign: "center" }}>
              {data.description}
            </p>
          </div>
        ) : (
          <div
            ref={ref as React.RefObject<HTMLDivElement>}
            className="sf-about-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 72,
              alignItems: "center",
              transition: "opacity 0.7s ease, transform 0.7s ease",
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0)" : "translateY(28px)",
            }}
          >
            {/* Image */}
            <div style={{ order: imageFirst ? 1 : 2 }}>
              {data.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  loading="lazy"
                  src={data.image}
                  alt={data.title}
                  style={{
                    width: "100%",
                    height: 480,
                    objectFit: "cover",
                    borderRadius: 16,
                  }}
                />
              ) : (
                <ImagePlaceholder height={480} label="Gorsel" />
              )}
            </div>

            {/* Text */}
            <div style={{ order: imageFirst ? 2 : 1 }}>
              <div
                style={{
                  width: 40,
                  height: 3,
                  background: global.colors.accent,
                  borderRadius: 2,
                  marginBottom: 16,
                }}
              />
              <h2
                style={{
                  fontFamily: global.fonts.heading,
                  fontSize: "clamp(1.75rem, 2.5vw, 2.25rem)",
                  fontWeight: 700,
                  color: global.colors.text,
                  margin: "0 0 16px",
                  lineHeight: 1.2,
                }}
              >
                {data.title}
              </h2>
              {data.subtitle && (
                <p style={{ color: global.colors.accent, fontWeight: 500, marginBottom: 16, fontSize: 15 }}>
                  {data.subtitle}
                </p>
              )}
              <p style={{ color: global.colors.textLight, lineHeight: 1.8, fontSize: 16, margin: "0 0 32px" }}>
                {data.description}
              </p>

              {data.features && data.features.length > 0 && (
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  {data.features.map((f, i) => (
                    <div key={i} style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
                      <div
                        style={{
                          width: 40,
                          height: 40,
                          borderRadius: 10,
                          background: global.colors.surface,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                          fontSize: 18,
                        }}
                      >
                        {f.icon || "✓"}
                      </div>
                      <div>
                        <p style={{ fontWeight: 600, color: global.colors.text, margin: "0 0 4px" }}>
                          {f.title}
                        </p>
                        <p style={{ color: global.colors.textLight, fontSize: 14, margin: 0 }}>
                          {f.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
});
