"use client";

import { memo } from "react";
import { TeamData, SiteGlobalConfig } from "@/types/template";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";
import { SectionTitle } from "../section-title";
import { ImagePlaceholder } from "../image-placeholder";
import { SocialIcons } from "../social-icons";

interface Props {
  data: TeamData;
  global: SiteGlobalConfig;
  isPreview?: boolean;
}

export const TeamRender = memo(function TeamRender({ data, global, isPreview }: Props) {
  const { ref, visible } = useScrollAnimation(isPreview);

  return (
    <section
      className="sf-section-pad"
      style={{
        background: "transparent",
        padding: "96px 24px",
        fontFamily: global.fonts.body,
      }}
      id="team"
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

          {data.members.length === 0 ? (
            <p style={{ textAlign: "center", color: global.colors.textLight }}>Henuz ekip uyesi eklenmedi.</p>
          ) : data.layout === "list" ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
              {data.members.map((member, i) => (
                <div
                  key={i}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "100px 1fr",
                    gap: 24,
                    alignItems: "center",
                    padding: 24,
                    background: global.colors.surface,
                    borderRadius: 12,
                  }}
                >
                  {member.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      loading="lazy"
                      src={member.image}
                      alt={member.name}
                      style={{ width: 100, height: 100, borderRadius: "50%", objectFit: "cover" }}
                    />
                  ) : (
                    <div
                      style={{
                        width: 100,
                        height: 100,
                        borderRadius: "50%",
                        background: global.colors.primary,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#fff",
                        fontSize: 32,
                        fontWeight: 700,
                      }}
                    >
                      {member.name[0]}
                    </div>
                  )}
                  <div>
                    <h3 style={{ fontFamily: global.fonts.heading, fontWeight: 700, fontSize: 18, color: global.colors.text, margin: "0 0 4px" }}>
                      {member.name}
                    </h3>
                    <p style={{ color: global.colors.accent, fontWeight: 500, fontSize: 14, margin: "0 0 8px" }}>
                      {member.role}
                    </p>
                    {member.bio && (
                      <p style={{ color: global.colors.textLight, fontSize: 14, margin: "0 0 12px", lineHeight: 1.6 }}>
                        {member.bio}
                      </p>
                    )}
                    {member.socialLinks && (
                      <SocialIcons links={member.socialLinks} color={global.colors.textLight} size={16} />
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div
              className="sf-team-grid"
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(4, 1fr)",
                gap: 28,
              }}
            >
              {data.members.map((member, i) => (
                <div
                  key={i}
                  style={{
                    textAlign: "center",
                    padding: 24,
                    background: global.colors.surface,
                    borderRadius: 16,
                  }}
                >
                  {member.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      loading="lazy"
                      src={member.image}
                      alt={member.name}
                      style={{ width: 100, height: 100, borderRadius: "50%", objectFit: "cover", margin: "0 auto 16px" }}
                    />
                  ) : (
                    <div
                      style={{
                        width: 100,
                        height: 100,
                        borderRadius: "50%",
                        background: global.colors.primary,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#fff",
                        fontSize: 32,
                        fontWeight: 700,
                        margin: "0 auto 16px",
                      }}
                    >
                      {member.name[0]}
                    </div>
                  )}
                  <h3 style={{ fontFamily: global.fonts.heading, fontWeight: 700, fontSize: 17, color: global.colors.text, margin: "0 0 4px" }}>
                    {member.name}
                  </h3>
                  <p style={{ color: global.colors.accent, fontWeight: 500, fontSize: 13, margin: "0 0 10px" }}>
                    {member.role}
                  </p>
                  {member.bio && (
                    <p style={{ color: global.colors.textLight, fontSize: 13, margin: "0 0 12px", lineHeight: 1.6 }}>
                      {member.bio}
                    </p>
                  )}
                  {member.socialLinks && (
                    <div style={{ display: "flex", justifyContent: "center" }}>
                      <SocialIcons links={member.socialLinks} color={global.colors.textLight} size={15} />
                    </div>
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
