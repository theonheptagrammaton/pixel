"use client";

import { memo, useState } from "react";
import { PartnersData, SiteGlobalConfig } from "@/types/template";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";
import { SectionTitle } from "../section-title";

interface Props {
  data: PartnersData;
  global: SiteGlobalConfig;
  isPreview?: boolean;
}

function PartnerLogo({
  name,
  logo,
  grayscale,
}: {
  name: string;
  logo: string;
  grayscale: boolean;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      loading="lazy"
      src={logo}
      alt={name}
      style={{
        height: 60,
        objectFit: "contain",
        maxWidth: "100%",
        filter: grayscale && !hovered ? "grayscale(1) opacity(0.6)" : "grayscale(0) opacity(1)",
        transition: "filter 0.3s ease",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    />
  );
}

export const PartnersRender = memo(function PartnersRender({ data, global, isPreview }: Props) {
  const { ref, visible } = useScrollAnimation(isPreview);

  return (
    <section
      style={{
        background: "transparent",
        padding: "80px 24px",
        fontFamily: global.fonts.body,
      }}
      id="partners"
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

          {(!data.items || data.items.length === 0) ? (
            <p
              style={{
                textAlign: "center",
                color: global.colors.textLight,
                fontSize: 14,
                fontStyle: "italic",
              }}
            >
              Henuz partner eklenmedi.
            </p>
          ) : data.layout === "carousel" ? (
            <div
              style={{
                display: "flex",
                gap: 32,
                overflowX: "auto",
                scrollSnapType: "x mandatory",
                paddingBottom: 8,
              }}
            >
              {data.items.map((partner, i) => {
                const content = (
                  <div
                    key={i}
                    style={{
                      scrollSnapAlign: "start",
                      minWidth: 180,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    {partner.logo ? (
                      <PartnerLogo
                        name={partner.name}
                        logo={partner.logo}
                        grayscale={data.grayscale}
                      />
                    ) : (
                      <span style={{ color: global.colors.textLight, fontSize: 14 }}>
                        {partner.name}
                      </span>
                    )}
                  </div>
                );

                if (partner.url) {
                  return (
                    <a
                      key={i}
                      href={partner.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ textDecoration: "none" }}
                    >
                      {content}
                    </a>
                  );
                }
                return content;
              })}
            </div>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: `repeat(${data.columns || 4}, 1fr)`,
                gap: 32,
                alignItems: "center",
                justifyItems: "center",
              }}
            >
              {data.items.map((partner, i) => {
                const logoEl = partner.logo ? (
                  <PartnerLogo
                    name={partner.name}
                    logo={partner.logo}
                    grayscale={data.grayscale}
                  />
                ) : (
                  <span style={{ color: global.colors.textLight, fontSize: 14 }}>
                    {partner.name}
                  </span>
                );

                if (partner.url) {
                  return (
                    <a
                      key={i}
                      href={partner.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        textDecoration: "none",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {logoEl}
                    </a>
                  );
                }

                return (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {logoEl}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  );
});
