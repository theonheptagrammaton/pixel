"use client";

import { memo, CSSProperties } from "react";
import { ServicesData, SiteGlobalConfig, SectionStyle, CardStyle } from "@/types/template";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";
import { SectionTitle } from "../section-title";
import { ImagePlaceholder } from "../image-placeholder";

interface Props {
  data: ServicesData;
  global: SiteGlobalConfig;
  isPreview?: boolean;
  sectionStyle?: SectionStyle;
}

function getCardStyles(cardStyle: CardStyle | undefined, global: SiteGlobalConfig): CSSProperties {
  switch (cardStyle) {
    case "minimal":
      return { background: "transparent", border: "none", borderRadius: 16 };
    case "bordered":
      return { background: global.colors.background, border: `2px solid ${global.colors.primary}`, borderRadius: 16 };
    case "glass":
      return {
        background: "rgba(255,255,255,0.08)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        border: "1px solid rgba(255,255,255,0.15)",
        borderRadius: 16,
      };
    case "gradient":
      return {
        background: `linear-gradient(135deg, ${global.colors.primary}22, ${global.colors.accent}22)`,
        border: "none",
        borderRadius: 16,
      };
    case "shadow":
      return {
        background: global.colors.background,
        border: "none",
        borderRadius: 16,
        boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
      };
    default:
      return { background: global.colors.background, border: `1px solid ${global.colors.surface}`, borderRadius: 16 };
  }
}

export const ServicesRender = memo(function ServicesRender({ data, global, isPreview, sectionStyle }: Props) {
  const { ref, visible } = useScrollAnimation(isPreview);

  const cols = data.columns ?? 3;
  const gridCols = `repeat(${cols}, 1fr)`;

  return (
    <section
      className="sf-section-pad"
      style={{
        background: "transparent",
        padding: "96px 24px",
        fontFamily: global.fonts.body,
      }}
      id="services"
    >
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
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

          {data.layout === "list" ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
              {data.items.map((item, i) => (
                <div
                  key={i}
                  className="sf-services-list-row"
                  style={{
                    display: "grid",
                    gridTemplateColumns: item.image ? "120px 1fr" : "48px 1fr",
                    gap: 24,
                    alignItems: "center",
                    background: global.colors.background,
                    borderRadius: 12,
                    padding: 24,
                  }}
                >
                  {item.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      loading="lazy"
                      src={item.image}
                      alt={item.title}
                      style={{ width: 120, height: 90, objectFit: "cover", borderRadius: 8 }}
                    />
                  ) : (
                    <div
                      style={{
                        width: 48,
                        height: 48,
                        background: global.colors.surface,
                        borderRadius: 10,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 22,
                      }}
                    >
                      {item.icon || "●"}
                    </div>
                  )}
                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <h3 style={{ fontFamily: global.fonts.heading, fontWeight: 600, fontSize: 18, color: global.colors.text, margin: "0 0 6px" }}>
                        {item.title}
                      </h3>
                      {item.price && (
                        <span style={{ color: global.colors.primary, fontWeight: 700, fontSize: 16 }}>
                          {item.price}
                        </span>
                      )}
                    </div>
                    <p style={{ color: global.colors.textLight, fontSize: 14, margin: 0, lineHeight: 1.6 }}>
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div
              className="sf-services-grid"
              style={{
                display: "grid",
                gridTemplateColumns: gridCols,
                gap: 28,
              }}
            >
              {data.items.map((item, i) => (
                <div
                  key={i}
                  style={{
                    ...getCardStyles(sectionStyle?.cardStyle, global),
                    overflow: "hidden",
                    transition: "transform 0.2s, box-shadow 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-4px)";
                    e.currentTarget.style.boxShadow = "0 12px 40px rgba(0,0,0,0.1)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                >
                  {data.layout === "cards" && (
                    item.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        loading="lazy"
                        src={item.image}
                        alt={item.title}
                        style={{ width: "100%", height: 200, objectFit: "cover" }}
                      />
                    ) : (
                      <ImagePlaceholder height={200} label={item.title} />
                    )
                  )}
                  <div style={{ padding: 24 }}>
                    {data.layout !== "cards" && (
                      <div
                        style={{
                          width: 48,
                          height: 48,
                          background: `${global.colors.primary}18`,
                          borderRadius: 12,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: 22,
                          marginBottom: 16,
                        }}
                      >
                        {item.icon || "●"}
                      </div>
                    )}
                    <h3
                      style={{
                        fontFamily: global.fonts.heading,
                        fontWeight: 600,
                        fontSize: 17,
                        color: global.colors.text,
                        margin: "0 0 8px",
                      }}
                    >
                      {item.title}
                    </h3>
                    <p
                      style={{
                        color: global.colors.textLight,
                        fontSize: 14,
                        margin: 0,
                        lineHeight: 1.6,
                      }}
                    >
                      {item.description}
                    </p>
                    {item.price && (
                      <p
                        style={{
                          color: global.colors.primary,
                          fontWeight: 700,
                          fontSize: 15,
                          marginTop: 12,
                          marginBottom: 0,
                        }}
                      >
                        {item.price}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
});
