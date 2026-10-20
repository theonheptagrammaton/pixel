"use client";

import { memo } from "react";
import { StatsData, SiteGlobalConfig } from "@/types/template";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";

interface Props {
  data: StatsData;
  global: SiteGlobalConfig;
  isPreview?: boolean;
}

export const StatsRender = memo(function StatsRender({ data, global, isPreview }: Props) {
  const { ref, visible } = useScrollAnimation(isPreview);

  const bg =
    data.background === "primary"
      ? global.colors.primary
      : data.background === "surface"
      ? global.colors.surface
      : global.colors.background;

  const onPrimary = data.background === "primary";
  const textColor = onPrimary ? "#ffffff" : global.colors.text;
  const mutedColor = onPrimary ? "rgba(255,255,255,0.7)" : global.colors.textLight;
  const accentColor = onPrimary ? "rgba(255,255,255,0.25)" : `${global.colors.accent}33`;

  return (
    <section
      className="sf-section-pad"
      style={{
        background: bg,
        padding: "80px 24px",
        fontFamily: global.fonts.body,
      }}
      id="stats"
    >
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        {(data.title || data.subtitle) && (
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            {data.title && (
              <h2
                style={{
                  fontFamily: global.fonts.heading,
                  fontSize: "clamp(1.75rem, 3vw, 2.5rem)",
                  fontWeight: 800,
                  color: textColor,
                  margin: "0 0 12px",
                  letterSpacing: "-0.02em",
                }}
              >
                {data.title}
              </h2>
            )}
            {data.subtitle && (
              <p style={{ fontSize: 16, color: mutedColor, margin: 0 }}>{data.subtitle}</p>
            )}
          </div>
        )}

        <div
          ref={ref as React.RefObject<HTMLDivElement>}
          className="sf-stats-grid"
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(${Math.min(data.items.length, 4)}, 1fr)`,
            gap: 2,
            transition: "opacity 0.7s ease, transform 0.7s ease",
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(28px)",
          }}
        >
          {data.items.map((item, i) => (
            <div
              key={i}
              style={{
                textAlign: "center",
                padding: "40px 24px",
                position: "relative",
              }}
            >
              {/* Divider between items */}
              {i > 0 && (
                <div
                  style={{
                    position: "absolute",
                    left: 0,
                    top: "20%",
                    bottom: "20%",
                    width: 1,
                    background: accentColor,
                  }}
                />
              )}

              {/* Value */}
              <div
                style={{
                  fontFamily: global.fonts.heading,
                  fontSize: "clamp(2.5rem, 5vw, 4rem)",
                  fontWeight: 900,
                  color: onPrimary ? "#ffffff" : global.colors.primary,
                  lineHeight: 1,
                  letterSpacing: "-0.03em",
                  marginBottom: 8,
                  transition: "transform 0.6s ease",
                  transform: visible ? "scale(1)" : "scale(0.8)",
                  transitionDelay: `${i * 100}ms`,
                }}
              >
                {item.prefix && (
                  <span style={{ fontSize: "0.5em", verticalAlign: "super" }}>{item.prefix}</span>
                )}
                {item.value}
                {item.suffix && (
                  <span style={{ fontSize: "0.5em", verticalAlign: "super" }}>{item.suffix}</span>
                )}
              </div>

              {/* Label */}
              <p
                style={{
                  fontFamily: global.fonts.body,
                  fontWeight: 700,
                  fontSize: 15,
                  color: textColor,
                  margin: "0 0 6px",
                  letterSpacing: "0.02em",
                }}
              >
                {item.label}
              </p>

              {/* Description */}
              {item.description && (
                <p
                  style={{
                    fontFamily: global.fonts.body,
                    fontSize: 13,
                    color: mutedColor,
                    margin: 0,
                    lineHeight: 1.5,
                  }}
                >
                  {item.description}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
});
