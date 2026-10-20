"use client";

import { memo } from "react";
import { CtaData, SiteGlobalConfig } from "@/types/template";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";

interface Props {
  data: CtaData;
  global: SiteGlobalConfig;
  isPreview?: boolean;
}

export const CtaRender = memo(function CtaRender({ data, global, isPreview }: Props) {
  const { ref, visible } = useScrollAnimation(isPreview);

  const bgColor = data.backgroundColor || global.colors.primary;

  return (
    <section
      className="sf-section-pad"
      style={{
        position: "relative",
        overflow: "hidden",
        background: bgColor,
        padding: "96px 24px",
        fontFamily: global.fonts.body,
        textAlign: "center",
      }}
      id="cta"
    >
      {data.backgroundImage && (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            loading="lazy"
            src={data.backgroundImage}
            alt=""
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              zIndex: 0,
            }}
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "rgba(0,0,0,0.55)",
              zIndex: 1,
            }}
          />
        </>
      )}

      <div
        ref={ref as React.RefObject<HTMLDivElement>}
        style={{
          position: "relative",
          zIndex: 2,
          maxWidth: 700,
          margin: "0 auto",
          transition: "opacity 0.7s ease, transform 0.7s ease",
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(28px)",
        }}
      >
        <h2
          style={{
            fontFamily: global.fonts.heading,
            fontSize: "clamp(2rem, 3.5vw, 3rem)",
            fontWeight: 800,
            color: "#ffffff",
            margin: "0 0 20px",
            lineHeight: 1.15,
          }}
        >
          {data.title}
        </h2>
        {data.description && (
          <p
            style={{
              fontSize: "1.0625rem",
              lineHeight: 1.7,
              color: "rgba(255,255,255,0.85)",
              margin: "0 0 40px",
              maxWidth: 560,
              marginLeft: "auto",
              marginRight: "auto",
            }}
          >
            {data.description}
          </p>
        )}
        <a
          href={data.buttonLink || "#"}
          style={{
            display: "inline-block",
            background: "#ffffff",
            color: bgColor,
            fontWeight: 700,
            fontSize: 15,
            padding: "15px 40px",
            borderRadius: 8,
            textDecoration: "none",
            transition: "transform 0.2s, box-shadow 0.2s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-2px)";
            e.currentTarget.style.boxShadow = "0 10px 30px rgba(0,0,0,0.2)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "none";
          }}
        >
          {data.buttonText}
        </a>
      </div>
    </section>
  );
});
