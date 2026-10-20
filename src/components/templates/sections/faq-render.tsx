"use client";

import { memo, useState } from "react";
import { FaqData, SiteGlobalConfig } from "@/types/template";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";
import { SectionTitle } from "../section-title";

interface Props {
  data: FaqData;
  global: SiteGlobalConfig;
  isPreview?: boolean;
}

export const FaqRender = memo(function FaqRender({ data, global, isPreview }: Props) {
  const { ref, visible } = useScrollAnimation(isPreview);
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section
      className="sf-section-pad"
      style={{
        background: "transparent",
        padding: "96px 24px",
        fontFamily: global.fonts.body,
      }}
      id="faq"
    >
      <div style={{ maxWidth: 800, margin: "0 auto" }}>
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

          {data.items.length === 0 ? (
            <p style={{ textAlign: "center", color: global.colors.textLight }}>Henuz soru eklenmedi.</p>
          ) : (
            <div>
              {data.items.map((item, i) => (
                <div
                  key={i}
                  style={{
                    borderBottom: `1px solid ${global.colors.surface}`,
                  }}
                >
                  <button
                    onClick={() => setOpenIndex(openIndex === i ? null : i)}
                    style={{
                      width: "100%",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "20px 0",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      textAlign: "left",
                      gap: 16,
                    }}
                  >
                    <span
                      style={{
                        fontFamily: global.fonts.heading,
                        fontWeight: 600,
                        fontSize: 16,
                        color: global.colors.text,
                        lineHeight: 1.4,
                      }}
                    >
                      {item.question}
                    </span>
                    <svg
                      style={{
                        width: 20,
                        height: 20,
                        flexShrink: 0,
                        color: global.colors.textLight,
                        transition: "transform 0.3s",
                        transform: openIndex === i ? "rotate(180deg)" : "rotate(0deg)",
                      }}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {openIndex === i && (
                    <p
                      style={{
                        color: global.colors.textLight,
                        lineHeight: 1.7,
                        fontSize: 15,
                        paddingBottom: 20,
                        margin: 0,
                      }}
                    >
                      {item.answer}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
});
