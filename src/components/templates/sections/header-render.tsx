"use client";

import { memo, useState, useEffect } from "react";
import { HeaderData, SiteGlobalConfig } from "@/types/template";
import { SocialIcons } from "../social-icons";

interface Props {
  data: HeaderData;
  global: SiteGlobalConfig;
  isPreview?: boolean;
  basePath?: string;
}

export const HeaderRender = memo(function HeaderRender({ data, global, isPreview, basePath = "" }: Props) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (isPreview || !data.sticky) return;
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isPreview, data.sticky]);

  const isTransparent = data.transparent && !scrolled;
  const bg = isTransparent ? "transparent" : global.colors.background;
  const borderBottom = scrolled ? `1px solid ${global.colors.surface}` : "none";
  const shadow = scrolled ? "0 1px 12px rgba(0,0,0,0.08)" : "none";

  const textColor = isTransparent ? "#ffffff" : global.colors.text;
  const logoColor = isTransparent ? "#ffffff" : global.colors.primary;

  return (
    <header
      style={{
        position: data.sticky ? "sticky" : "relative",
        top: 0,
        zIndex: 100,
        background: bg,
        borderBottom,
        boxShadow: shadow,
        transition: "background 0.3s, box-shadow 0.3s",
        fontFamily: global.fonts.body,
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "0 24px",
          height: 72,
          display: "flex",
          alignItems: "center",
          position: "relative",
          justifyContent: "space-between",
          gap: 32,
        }}
      >
        {/* Logo */}
        {global.general.logo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            loading="lazy"
            src={global.general.logo}
            alt={global.general.businessName}
            style={{ height: 40, objectFit: "contain", position: "relative", zIndex: 2 }}
          />
        ) : (
          <span
            style={{
              fontFamily: global.fonts.heading,
              fontWeight: 700,
              fontSize: 20,
              color: logoColor,
              whiteSpace: "nowrap",
              position: "relative",
              zIndex: 2,
            }}
          >
            {global.general.businessName || "Logo"}
          </span>
        )}

        {/* Nav - desktop */}
        {data.layout === "centered" ? (
          <nav
            className="sf-nav-desktop"
            style={{
              position: "absolute",
              left: "50%",
              transform: "translateX(-50%)",
              display: "flex",
              gap: 32,
              zIndex: 1,
            }}
          >
            {data.menuItems.map((item, i) => (
              <a
                key={i}
                href={basePath + item.link}
                style={{
                  color: textColor,
                  textDecoration: "none",
                  fontSize: 14,
                  fontWeight: 500,
                  opacity: 0.85,
                  transition: "opacity 0.2s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = "0.85")}
              >
                {item.label}
              </a>
            ))}
          </nav>
        ) : (
          <nav className="sf-nav-desktop" style={{ display: "flex", gap: 28, alignItems: "center" }}>
            {data.menuItems.map((item, i) => (
              <a
                key={i}
                href={basePath + item.link}
                style={{
                  color: textColor,
                  textDecoration: "none",
                  fontSize: 14,
                  fontWeight: 500,
                  opacity: 0.85,
                  transition: "opacity 0.2s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = "0.85")}
              >
                {item.label}
              </a>
            ))}
          </nav>
        )}

        {/* Right side — social for split, empty spacer for centered */}
        {data.layout === "split" ? (
          <span className="sf-nav-desktop" style={{ position: "relative", zIndex: 2 }}>
            <SocialIcons links={global.general.socialLinks} color={textColor} size={18} />
          </span>
        ) : data.layout === "centered" ? (
          <span className="sf-nav-desktop" style={{ width: 1 }} />
        ) : null}

        {/* Mobile toggle */}
        <button
          onClick={() => setMobileOpen((v) => !v)}
          className="sf-nav-mobile-btn"
          style={{
            display: "none",
            background: "none",
            border: "none",
            cursor: "pointer",
            color: textColor,
            padding: 4,
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
            zIndex: 2,
          }}
          aria-label="Menu"
        >
          <svg style={{ width: 22, height: 22 }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            {mobileOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div
          style={{
            background: global.colors.background,
            borderTop: `1px solid ${global.colors.surface}`,
            padding: "16px 24px",
          }}
        >
          {data.menuItems.map((item, i) => (
            <a
              key={i}
              href={basePath + item.link}
              onClick={() => setMobileOpen(false)}
              style={{
                display: "block",
                color: global.colors.text,
                textDecoration: "none",
                fontSize: 15,
                fontWeight: 500,
                padding: "10px 0",
                borderBottom: `1px solid ${global.colors.surface}`,
              }}
            >
              {item.label}
            </a>
          ))}
        </div>
      )}
    </header>
  );
});
