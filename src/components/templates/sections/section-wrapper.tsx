"use client";

import { ReactNode, CSSProperties } from "react";
import { SectionStyle, SiteGlobalConfig } from "@/types/template";

interface Props {
  style?: SectionStyle;
  global: SiteGlobalConfig;
  children: ReactNode;
  className?: string;
  defaultBg?: string;
}

const SPACING_MAP = {
  compact: "48px 24px",
  normal: "96px 24px",
  spacious: "144px 24px",
};

function getDividerSvg(divider: string, color: string): ReactNode {
  const fill = color;
  switch (divider) {
    case "line":
      return (
        <div style={{ width: "100%", height: 1, background: fill, opacity: 0.2 }} />
      );
    case "wave":
      return (
        <svg viewBox="0 0 1200 60" preserveAspectRatio="none" style={{ display: "block", width: "100%", height: 40 }}>
          <path d="M0,30 C200,60 400,0 600,30 C800,60 1000,0 1200,30 L1200,60 L0,60 Z" fill={fill} />
        </svg>
      );
    case "curve":
      return (
        <svg viewBox="0 0 1200 60" preserveAspectRatio="none" style={{ display: "block", width: "100%", height: 40 }}>
          <path d="M0,60 Q600,0 1200,60 Z" fill={fill} />
        </svg>
      );
    case "angle":
      return (
        <svg viewBox="0 0 1200 60" preserveAspectRatio="none" style={{ display: "block", width: "100%", height: 40 }}>
          <polygon points="0,0 1200,60 0,60" fill={fill} />
        </svg>
      );
    default:
      return null;
  }
}

export function SectionWrapper({ style: sectionStyle, global, children, className, defaultBg }: Props) {
  const bg = sectionStyle?.background;
  const containerStyle: CSSProperties = { position: "relative" };

  // Background: custom bg > defaultBg fallback
  if (bg) {
    if (bg.type === "color" && bg.color) {
      containerStyle.background = bg.color;
    } else if (bg.type === "gradient" && bg.gradient) {
      const { from, to, angle } = bg.gradient;
      containerStyle.background = `linear-gradient(${angle}deg, ${from}, ${to})`;
    } else if (bg.type === "image" && bg.image) {
      containerStyle.backgroundImage = `url(${bg.image})`;
      containerStyle.backgroundSize = "cover";
      containerStyle.backgroundPosition = "center";
    }
  } else if (defaultBg) {
    containerStyle.background = defaultBg;
  }

  // Spacing — override padding on child section
  const spacing = sectionStyle?.spacing;
  const paddingOverride = spacing ? SPACING_MAP[spacing] : undefined;

  // Color override via CSS custom properties
  const cssVars: Record<string, string> = {};
  if (sectionStyle?.colorOverride?.text) cssVars["--sf-text"] = sectionStyle.colorOverride.text;
  if (sectionStyle?.colorOverride?.textLight) cssVars["--sf-text-light"] = sectionStyle.colorOverride.textLight;
  if (sectionStyle?.colorOverride?.accent) cssVars["--sf-accent"] = sectionStyle.colorOverride.accent;

  const divider = sectionStyle?.divider;
  const nextBg = global.colors.background;

  return (
    <div style={{ ...containerStyle, ...cssVars } as CSSProperties} className={className}>
      {/* Image overlay */}
      {bg?.type === "image" && bg.overlay !== undefined && bg.overlay > 0 && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: `rgba(0,0,0,${bg.overlay / 100})`,
            pointerEvents: "none",
            zIndex: 0,
          }}
        />
      )}
      <div style={{ position: "relative", zIndex: 1, ...(paddingOverride ? { padding: paddingOverride } : {}) }}>
        {children}
      </div>
      {/* Divider at bottom */}
      {divider && divider !== "none" && (
        <div style={{ position: "relative", marginTop: -1, zIndex: 2 }}>
          {getDividerSvg(divider, nextBg)}
        </div>
      )}
    </div>
  );
}
