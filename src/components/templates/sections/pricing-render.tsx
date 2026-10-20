"use client";

import { memo, CSSProperties } from "react";
import { PricingData, SiteGlobalConfig, SectionStyle, CardStyle } from "@/types/template";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";
import { SectionTitle } from "../section-title";

interface Props {
  data: PricingData;
  global: SiteGlobalConfig;
  isPreview?: boolean;
  sectionStyle?: SectionStyle;
}

function getCardStyles(cardStyle: CardStyle | undefined, global: SiteGlobalConfig, isPopular: boolean): CSSProperties {
  if (isPopular) {
    // Popular cards always keep their distinct style
    return {
      background: global.colors.primary,
      borderRadius: 20,
      border: "none",
      transform: "scale(1.03)",
      boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
    };
  }
  switch (cardStyle) {
    case "minimal":
      return { background: "transparent", border: "none", borderRadius: 20 };
    case "bordered":
      return { background: global.colors.background, border: `2px solid ${global.colors.primary}`, borderRadius: 20 };
    case "glass":
      return {
        background: "rgba(255,255,255,0.08)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        border: "1px solid rgba(255,255,255,0.15)",
        borderRadius: 20,
      };
    case "gradient":
      return {
        background: `linear-gradient(135deg, ${global.colors.primary}22, ${global.colors.accent}22)`,
        border: "none",
        borderRadius: 20,
      };
    case "shadow":
      return {
        background: global.colors.background,
        border: "none",
        borderRadius: 20,
        boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
      };
    default:
      return { background: global.colors.background, borderRadius: 20, border: `1px solid ${global.colors.surface}` };
  }
}

export const PricingRender = memo(function PricingRender({ data, global, isPreview, sectionStyle }: Props) {
  const { ref, visible } = useScrollAnimation(isPreview);

  return (
    <section
      className="sf-section-pad"
      style={{
        background: "transparent",
        padding: "96px 24px",
        fontFamily: global.fonts.body,
      }}
      id="pricing"
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

          {data.plans.length === 0 ? (
            <p style={{ textAlign: "center", color: global.colors.textLight }}>Henuz plan eklenmedi.</p>
          ) : (
            <div
              className="sf-pricing-grid"
              style={{
                display: "grid",
                gridTemplateColumns: `repeat(${Math.min(data.plans.length, 3)}, 1fr)`,
                gap: 24,
                alignItems: "start",
              }}
            >
              {data.plans.map((plan, i) => (
                <div
                  key={i}
                  className={plan.isPopular ? "sf-pricing-popular" : undefined}
                  style={{
                    ...getCardStyles(sectionStyle?.cardStyle, global, plan.isPopular),
                    padding: 36,
                    position: "relative",
                  }}
                >
                  {plan.isPopular && (
                    <div
                      style={{
                        position: "absolute",
                        top: -12,
                        left: "50%",
                        transform: "translateX(-50%)",
                        background: global.colors.accent,
                        color: "#fff",
                        fontSize: 11,
                        fontWeight: 700,
                        letterSpacing: "0.08em",
                        textTransform: "uppercase",
                        padding: "4px 16px",
                        borderRadius: 100,
                        whiteSpace: "nowrap",
                      }}
                    >
                      En Populer
                    </div>
                  )}

                  <h3
                    style={{
                      fontFamily: global.fonts.heading,
                      fontWeight: 700,
                      fontSize: 20,
                      color: plan.isPopular ? "#ffffff" : global.colors.text,
                      margin: "0 0 8px",
                    }}
                  >
                    {plan.name}
                  </h3>
                  <p
                    style={{
                      color: plan.isPopular ? "rgba(255,255,255,0.75)" : global.colors.textLight,
                      fontSize: 14,
                      margin: "0 0 24px",
                    }}
                  >
                    {plan.description}
                  </p>

                  <div style={{ marginBottom: 28 }}>
                    <span
                      style={{
                        fontFamily: global.fonts.heading,
                        fontSize: "2.5rem",
                        fontWeight: 800,
                        color: plan.isPopular ? "#ffffff" : global.colors.text,
                      }}
                    >
                      {plan.price}
                    </span>
                    {plan.period && (
                      <span
                        style={{
                          color: plan.isPopular ? "rgba(255,255,255,0.6)" : global.colors.textLight,
                          fontSize: 14,
                          marginLeft: 6,
                        }}
                      >
                        /{plan.period}
                      </span>
                    )}
                  </div>

                  <ul style={{ listStyle: "none", padding: 0, margin: "0 0 32px" }}>
                    {plan.features.map((f, fi) => (
                      <li
                        key={fi}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 10,
                          padding: "8px 0",
                          color: plan.isPopular ? "rgba(255,255,255,0.9)" : global.colors.text,
                          fontSize: 14,
                          borderBottom: `1px solid ${plan.isPopular ? "rgba(255,255,255,0.12)" : global.colors.surface}`,
                        }}
                      >
                        <svg
                          style={{ width: 16, height: 16, flexShrink: 0, color: plan.isPopular ? "#ffffff" : global.colors.accent }}
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2.5}
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                        {f}
                      </li>
                    ))}
                  </ul>

                  <a
                    href={plan.ctaLink || "#"}
                    style={{
                      display: "block",
                      textAlign: "center",
                      padding: "13px 24px",
                      borderRadius: 10,
                      fontWeight: 600,
                      fontSize: 15,
                      textDecoration: "none",
                      background: plan.isPopular ? "#ffffff" : global.colors.primary,
                      color: plan.isPopular ? global.colors.primary : "#ffffff",
                      transition: "opacity 0.2s",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.85")}
                    onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
                  >
                    {plan.ctaText || "Baslat"}
                  </a>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
});
