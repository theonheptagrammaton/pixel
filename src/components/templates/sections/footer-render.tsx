"use client";

import { memo, useState } from "react";
import { FooterData, SiteGlobalConfig } from "@/types/template";
import { SocialIcons } from "../social-icons";

interface Props {
  data: FooterData;
  global: SiteGlobalConfig;
  isPreview?: boolean;
  basePath?: string;
}

// Returns relative luminance [0..1] for a hex color
function hexLuminance(hex: string): number {
  const c = hex.replace("#", "");
  const r = parseInt(c.substring(0, 2), 16) / 255;
  const g = parseInt(c.substring(2, 4), 16) / 255;
  const b = parseInt(c.substring(4, 6), 16) / 255;
  const toLinear = (v: number) => (v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4));
  return 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);
}

export const FooterRender = memo(function FooterRender({ data, global, basePath = "" }: Props) {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const footerBg = data.backgroundColor || global.colors.text;
  // Auto-detect: light bg → dark text, dark bg → white text
  const isLight = footerBg.startsWith("#") && hexLuminance(footerBg) > 0.35;
  const textColor = isLight ? global.colors.text : "#ffffff";
  const mutedColor = isLight ? global.colors.textLight : "rgba(255,255,255,0.5)";

  return (
    <>
    <footer
      style={{
        background: footerBg,
        padding: data.layout === "minimal" ? "32px 24px 48px" : "64px 24px 48px",
        fontFamily: global.fonts.body,
      }}
      id="footer"
    >
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        {data.layout === "columns" && data.columns && data.columns.length > 0 ? (
          <>
            <div
              className="sf-footer-grid"
              style={{
                display: "grid",
                gridTemplateColumns: `2fr ${data.columns.map(() => "1fr").join(" ")}`,
                gap: 48,
                paddingBottom: 48,
                borderBottom: "1px solid rgba(255,255,255,0.1)",
                marginBottom: 32,
              }}
            >
              {/* Brand column */}
              <div>
                {global.general.logo ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    loading="lazy"
                    src={global.general.logo}
                    alt={global.general.businessName}
                    style={{ height: 36, objectFit: "contain", filter: "brightness(0) invert(1)", marginBottom: 16 }}
                  />
                ) : (
                  <p
                    style={{
                      fontFamily: global.fonts.heading,
                      fontWeight: 700,
                      fontSize: 20,
                      color: textColor,
                      margin: "0 0 16px",
                    }}
                  >
                    {global.general.businessName}
                  </p>
                )}
                {global.general.address && (
                  <p style={{ color: mutedColor, fontSize: 14, lineHeight: 1.6, marginBottom: 16 }}>
                    {global.general.address}
                  </p>
                )}
                {data.showSocialLinks && (
                  <SocialIcons links={global.general.socialLinks} color={mutedColor} size={18} />
                )}
              </div>

              {/* Link columns */}
              {data.columns.map((col, i) => (
                <div key={i}>
                  <h4 style={{ fontFamily: global.fonts.heading, fontWeight: 600, fontSize: 14, color: textColor, margin: "0 0 16px", letterSpacing: "0.04em", textTransform: "uppercase" }}>
                    {col.title}
                  </h4>
                  <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 10 }}>
                    {col.links.map((link, li) => (
                      <li key={li}>
                        <a
                          href={link.link.startsWith("/") ? basePath + link.link : link.link}
                          style={{ color: mutedColor, textDecoration: "none", fontSize: 14, transition: "color 0.2s" }}
                          onMouseEnter={(e) => (e.currentTarget.style.color = textColor)}
                          onMouseLeave={(e) => (e.currentTarget.style.color = mutedColor)}
                        >
                          {link.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {/* Newsletter */}
            {data.showNewsletter && (
              <div style={{ marginBottom: 32 }}>
                <h4 style={{ fontFamily: global.fonts.heading, fontWeight: 600, fontSize: 16, color: textColor, margin: "0 0 12px" }}>
                  Bultene Abone Ol
                </h4>
                {subscribed ? (
                  <p style={{ color: global.colors.accent, fontSize: 14 }}>Abone oldunuz!</p>
                ) : (
                  <form
                    onSubmit={(e) => { e.preventDefault(); setSubscribed(true); }}
                    style={{ display: "flex", gap: 8, maxWidth: 400 }}
                  >
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="E-posta adresiniz"
                      required
                      style={{
                        flex: 1,
                        padding: "10px 14px",
                        background: "rgba(255,255,255,0.1)",
                        border: "1px solid rgba(255,255,255,0.15)",
                        borderRadius: 6,
                        color: textColor,
                        fontFamily: global.fonts.body,
                        fontSize: 14,
                        outline: "none",
                      }}
                    />
                    <button
                      type="submit"
                      style={{
                        background: global.colors.accent,
                        color: "#fff",
                        border: "none",
                        padding: "10px 20px",
                        borderRadius: 6,
                        fontFamily: global.fonts.body,
                        fontWeight: 600,
                        fontSize: 14,
                        cursor: "pointer",
                        whiteSpace: "nowrap",
                      }}
                    >
                      Abone Ol
                    </button>
                  </form>
                )}
              </div>
            )}

            <p style={{ color: mutedColor, fontSize: 13, margin: 0 }}>{data.copyright}</p>
          </>
        ) : data.layout === "minimal" ? (
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
            <p style={{ color: mutedColor, fontSize: 13, margin: 0 }}>{data.copyright}</p>
            {data.showSocialLinks && (
              <SocialIcons links={global.general.socialLinks} color={mutedColor} size={17} />
            )}
          </div>
        ) : (
          /* Simple layout */
          <div style={{ textAlign: "center" }}>
            <p
              style={{
                fontFamily: global.fonts.heading,
                fontWeight: 700,
                fontSize: 22,
                color: textColor,
                margin: "0 0 20px",
              }}
            >
              {global.general.businessName}
            </p>
            {data.showSocialLinks && (
              <div style={{ display: "flex", justifyContent: "center", marginBottom: 24 }}>
                <SocialIcons links={global.general.socialLinks} color={mutedColor} size={19} />
              </div>
            )}
            <p style={{ color: mutedColor, fontSize: 13, margin: 0 }}>{data.copyright}</p>
          </div>
        )}
      </div>

    </footer>

      {/* Powered by Eray Pişkin — mandatory, sticky banner, cannot be removed */}
      <div
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 9999,
          background: "rgba(0,0,0,0.85)",
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
          borderTop: "1px solid rgba(255,255,255,0.06)",
          padding: "8px 16px",
          textAlign: "center",
        }}
      >
        <a
          href="https://eraypiskin.com"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            color: "rgba(255,255,255,0.45)",
            textDecoration: "none",
            fontSize: 11,
            fontFamily: global.fonts.body,
            letterSpacing: "0.02em",
            transition: "color 0.2s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.75)")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.45)")}
        >
          Powered by <span style={{ fontWeight: 600 }}>Eray Pişkin</span>
        </a>
      </div>
    </>
  );
});
