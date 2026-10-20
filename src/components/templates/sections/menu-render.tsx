"use client";

import { memo, useState } from "react";
import { MenuData, SiteGlobalConfig } from "@/types/template";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";
import { SectionTitle } from "../section-title";
import { ImagePlaceholder } from "../image-placeholder";

interface Props {
  data: MenuData;
  global: SiteGlobalConfig;
  isPreview?: boolean;
}

export const MenuRender = memo(function MenuRender({ data, global, isPreview }: Props) {
  const { ref, visible } = useScrollAnimation(isPreview);
  const [activeCategory, setActiveCategory] = useState(0);

  if (!data.categories || data.categories.length === 0) {
    return (
      <section style={{ background: "transparent", padding: "96px 24px" }} id="menu">
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <SectionTitle
            title={data.title}
            subtitle={data.subtitle}
            headingFont={global.fonts.heading}
            bodyFont={global.fonts.body}
            titleColor={global.colors.text}
            subtitleColor={global.colors.textLight}
            accentColor={global.colors.accent}
          />
          <p style={{ textAlign: "center", color: global.colors.textLight }}>Henuz menu eklenmedi.</p>
        </div>
      </section>
    );
  }

  const activeItems = data.categories[activeCategory]?.items ?? [];

  return (
    <section
      className="sf-section-pad"
      style={{
        background: "transparent",
        padding: "96px 24px",
        fontFamily: global.fonts.body,
      }}
      id="menu"
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

          {/* Category tabs */}
          <div
            style={{
              display: "flex",
              gap: 8,
              justifyContent: "center",
              flexWrap: "wrap",
              marginBottom: 48,
            }}
          >
            {data.categories.map((cat, i) => (
              <button
                key={i}
                onClick={() => setActiveCategory(i)}
                style={{
                  padding: "8px 20px",
                  borderRadius: 100,
                  border: `2px solid ${activeCategory === i ? global.colors.primary : global.colors.surface}`,
                  background: activeCategory === i ? global.colors.primary : "transparent",
                  color: activeCategory === i ? "#ffffff" : global.colors.text,
                  fontFamily: global.fonts.body,
                  fontWeight: 500,
                  fontSize: 14,
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Items */}
          <div
            className={data.layout === "cards" && data.showImages ? "sf-menu-grid" : undefined}
            style={{
              display: "grid",
              gridTemplateColumns:
                data.layout === "cards" && data.showImages
                  ? "repeat(3, 1fr)"
                  : "1fr",
              gap: data.layout === "cards" ? 24 : 0,
            }}
          >
            {activeItems.map((item, i) => (
              data.layout === "cards" ? (
                <div
                  key={i}
                  style={{
                    background: global.colors.surface,
                    borderRadius: 16,
                    overflow: "hidden",
                    border: `1px solid ${global.colors.surface}`,
                  }}
                >
                  {data.showImages && (
                    item.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        loading="lazy"
                        src={item.image}
                        alt={item.name}
                        style={{ width: "100%", height: 200, objectFit: "cover" }}
                      />
                    ) : (
                      <ImagePlaceholder height={200} label={item.name} />
                    )
                  )}
                  <div style={{ padding: 20 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                      <h3 style={{ fontFamily: global.fonts.heading, fontWeight: 600, fontSize: 16, color: global.colors.text, margin: 0 }}>
                        {item.name}
                        {item.badge && (
                          <span
                            style={{
                              display: "inline-block",
                              marginLeft: 8,
                              background: global.colors.accent,
                              color: "#fff",
                              fontSize: 10,
                              fontWeight: 700,
                              padding: "2px 8px",
                              borderRadius: 100,
                              verticalAlign: "middle",
                            }}
                          >
                            {item.badge}
                          </span>
                        )}
                      </h3>
                      <span style={{ color: global.colors.primary, fontWeight: 700, fontSize: 15, marginLeft: 12 }}>
                        {item.price}
                      </span>
                    </div>
                    <p style={{ color: global.colors.textLight, fontSize: 13, margin: 0, lineHeight: 1.5 }}>
                      {item.description}
                    </p>
                  </div>
                </div>
              ) : (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    padding: "20px 0",
                    borderBottom: `1px solid ${global.colors.surface}`,
                    gap: 24,
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
                      <h3 style={{ fontFamily: global.fonts.heading, fontWeight: 600, fontSize: 16, color: global.colors.text, margin: 0 }}>
                        {item.name}
                      </h3>
                      {item.badge && (
                        <span
                          style={{
                            background: global.colors.accent,
                            color: "#fff",
                            fontSize: 10,
                            fontWeight: 700,
                            padding: "2px 8px",
                            borderRadius: 100,
                          }}
                        >
                          {item.badge}
                        </span>
                      )}
                    </div>
                    <p style={{ color: global.colors.textLight, fontSize: 14, margin: 0 }}>
                      {item.description}
                    </p>
                  </div>
                  {data.layout === "detailed" && data.showImages && item.image && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      loading="lazy"
                      src={item.image}
                      alt={item.name}
                      style={{ width: 80, height: 70, objectFit: "cover", borderRadius: 8, flexShrink: 0 }}
                    />
                  )}
                  <div style={{ flexShrink: 0 }}>
                    <span
                      style={{
                        display: "inline-block",
                        color: global.colors.primary,
                        fontWeight: 700,
                        fontSize: 16,
                      }}
                    >
                      {item.price}
                    </span>
                  </div>
                </div>
              )
            ))}
          </div>
        </div>
      </div>
    </section>
  );
});
