"use client";

import { memo, useState, useEffect, useRef, useCallback, CSSProperties } from "react";
import { TestimonialsData, SiteGlobalConfig, SectionStyle, CardStyle } from "@/types/template";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";
import { SectionTitle } from "../section-title";

interface Props {
  data: TestimonialsData;
  global: SiteGlobalConfig;
  isPreview?: boolean;
  sectionStyle?: SectionStyle;
}

function getCardStyles(cardStyle: CardStyle | undefined, global: SiteGlobalConfig): CSSProperties {
  switch (cardStyle) {
    case "minimal":
      return { background: "transparent", border: "none", borderRadius: 16 };
    case "bordered":
      return { background: global.colors.background, border: `2px solid ${global.colors.primary}`, borderRadius: 16 };
    case "glass":
      return {
        background: "rgba(255,255,255,0.08)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        border: "1px solid rgba(255,255,255,0.15)",
        borderRadius: 16,
      };
    case "gradient":
      return {
        background: `linear-gradient(135deg, ${global.colors.primary}22, ${global.colors.accent}22)`,
        border: "none",
        borderRadius: 16,
      };
    case "shadow":
      return {
        background: global.colors.background,
        border: "none",
        borderRadius: 16,
        boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
      };
    default:
      return { background: global.colors.background, borderRadius: 16 };
  }
}

function StarRating({ rating, color }: { rating: number; color: string }) {
  return (
    <div style={{ display: "flex", gap: 3 }}>
      {[1, 2, 3, 4, 5].map((s) => (
        <svg
          key={s}
          style={{ width: 16, height: 16 }}
          viewBox="0 0 24 24"
          fill={s <= rating ? color : "none"}
          stroke={color}
          strokeWidth={1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
          />
        </svg>
      ))}
    </div>
  );
}

function LargeStarRating({ rating, color }: { rating: number; color: string }) {
  return (
    <div style={{ display: "flex", gap: 4, justifyContent: "center" }}>
      {[1, 2, 3, 4, 5].map((s) => (
        <svg
          key={s}
          style={{ width: 22, height: 22 }}
          viewBox="0 0 24 24"
          fill={s <= rating ? color : "none"}
          stroke={color}
          strokeWidth={1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
          />
        </svg>
      ))}
    </div>
  );
}

export const TestimonialsRender = memo(function TestimonialsRender({ data, global, isPreview, sectionStyle }: Props) {
  const { ref, visible } = useScrollAnimation(isPreview);
  const [currentIndex, setCurrentIndex] = useState(0);
  const pausedRef = useRef(false);

  const total = data.items.length;

  const goNext = useCallback(() => {
    if (total === 0) return;
    setCurrentIndex((prev) => (prev + 1) % total);
  }, [total]);

  const goPrev = useCallback(() => {
    if (total === 0) return;
    setCurrentIndex((prev) => (prev - 1 + total) % total);
  }, [total]);

  useEffect(() => {
    if (data.layout !== "slider" || total <= 1) return;
    const interval = setInterval(() => {
      if (!pausedRef.current) goNext();
    }, 5000);
    return () => clearInterval(interval);
  }, [data.layout, total, goNext]);

  function renderSlider() {
    if (total === 0) {
      return <p style={{ textAlign: "center", color: global.colors.textLight }}>Henuz yorum eklenmedi.</p>;
    }

    const item = data.items[currentIndex];

    return (
      <div
        style={{ position: "relative", maxWidth: 680, margin: "0 auto" }}
        onMouseEnter={() => { pausedRef.current = true; }}
        onMouseLeave={() => { pausedRef.current = false; }}
      >
        {/* Content with fade transition */}
        <div
          key={currentIndex}
          style={{
            textAlign: "center",
            padding: "32px 48px",
            opacity: 1,
            transform: "translateY(0)",
            transition: "opacity 0.5s ease, transform 0.5s ease",
          }}
        >
          {/* Stars */}
          <div style={{ marginBottom: 20 }}>
            <LargeStarRating rating={item.rating} color={global.colors.accent} />
          </div>

          {/* Quote */}
          <p
            style={{
              color: global.colors.text,
              fontSize: 20,
              lineHeight: 1.8,
              fontStyle: "italic",
              margin: "0 0 28px",
            }}
          >
            &ldquo;{item.content}&rdquo;
          </p>

          {/* Avatar + Name + Role */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 14 }}>
            {item.avatar ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                loading="lazy"
                src={item.avatar}
                alt={item.name}
                style={{ width: 52, height: 52, borderRadius: "50%", objectFit: "cover" }}
              />
            ) : (
              <div
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: "50%",
                  background: global.colors.primary,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#fff",
                  fontWeight: 600,
                  fontSize: 20,
                }}
              >
                {item.name[0]}
              </div>
            )}
            <div style={{ textAlign: "left" }}>
              <p style={{ fontWeight: 600, color: global.colors.text, margin: 0, fontSize: 16 }}>{item.name}</p>
              {item.role && (
                <p style={{ color: global.colors.textLight, fontSize: 14, margin: 0 }}>{item.role}</p>
              )}
            </div>
          </div>
        </div>

        {/* Left arrow */}
        {total > 1 && (
          <button
            onClick={goPrev}
            style={{
              position: "absolute",
              left: -16,
              top: "50%",
              transform: "translateY(-50%)",
              width: 40,
              height: 40,
              borderRadius: "50%",
              background: global.colors.surface,
              border: "none",
              color: global.colors.text,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "background 0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = global.colors.accent)}
            onMouseLeave={(e) => (e.currentTarget.style.background = global.colors.surface)}
          >
            <svg width={18} height={18} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        )}

        {/* Right arrow */}
        {total > 1 && (
          <button
            onClick={goNext}
            style={{
              position: "absolute",
              right: -16,
              top: "50%",
              transform: "translateY(-50%)",
              width: 40,
              height: 40,
              borderRadius: "50%",
              background: global.colors.surface,
              border: "none",
              color: global.colors.text,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "background 0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = global.colors.accent)}
            onMouseLeave={(e) => (e.currentTarget.style.background = global.colors.surface)}
          >
            <svg width={18} height={18} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        )}

        {/* Dot indicators */}
        {total > 1 && (
          <div style={{ display: "flex", justifyContent: "center", gap: 8, marginTop: 8 }}>
            {data.items.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentIndex(i)}
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: "50%",
                  border: "none",
                  background: i === currentIndex ? global.colors.accent : global.colors.surface,
                  cursor: "pointer",
                  padding: 0,
                  transition: "background 0.3s ease",
                }}
              />
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <section
      className="sf-section-pad"
      style={{
        background: "transparent",
        padding: "96px 24px",
        fontFamily: global.fonts.body,
      }}
      id="testimonials"
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

          {data.items.length === 0 ? (
            <p style={{ textAlign: "center", color: global.colors.textLight }}>Henuz yorum eklenmedi.</p>
          ) : data.layout === "slider" ? (
            renderSlider()
          ) : data.layout === "stacked" ? (
            <div style={{ maxWidth: 680, margin: "0 auto", display: "flex", flexDirection: "column", gap: 28 }}>
              {data.items.map((item, i) => (
                <div
                  key={i}
                  style={{
                    ...getCardStyles(sectionStyle?.cardStyle, global),
                    padding: 32,
                    borderLeft: `4px solid ${global.colors.accent}`,
                  }}
                >
                  <StarRating rating={item.rating} color={global.colors.accent} />
                  <p
                    style={{
                      color: global.colors.text,
                      fontSize: 16,
                      lineHeight: 1.7,
                      margin: "16px 0",
                      fontStyle: "italic",
                    }}
                  >
                    &ldquo;{item.content}&rdquo;
                  </p>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    {item.avatar ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        loading="lazy"
                        src={item.avatar}
                        alt={item.name}
                        style={{ width: 44, height: 44, borderRadius: "50%", objectFit: "cover" }}
                      />
                    ) : (
                      <div
                        style={{
                          width: 44,
                          height: 44,
                          borderRadius: "50%",
                          background: global.colors.primary,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "#fff",
                          fontWeight: 600,
                        }}
                      >
                        {item.name[0]}
                      </div>
                    )}
                    <div>
                      <p style={{ fontWeight: 600, color: global.colors.text, margin: 0 }}>{item.name}</p>
                      {item.role && (
                        <p style={{ color: global.colors.textLight, fontSize: 13, margin: 0 }}>{item.role}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div
              className="sf-testimonials-grid"
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: 24,
              }}
            >
              {data.items.map((item, i) => (
                <div
                  key={i}
                  style={{
                    ...getCardStyles(sectionStyle?.cardStyle, global),
                    padding: 28,
                    display: "flex",
                    flexDirection: "column",
                    gap: 16,
                  }}
                >
                  <StarRating rating={item.rating} color={global.colors.accent} />
                  <p
                    style={{
                      color: global.colors.text,
                      fontSize: 15,
                      lineHeight: 1.7,
                      flex: 1,
                      fontStyle: "italic",
                    }}
                  >
                    &ldquo;{item.content}&rdquo;
                  </p>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    {item.avatar ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        loading="lazy"
                        src={item.avatar}
                        alt={item.name}
                        style={{ width: 40, height: 40, borderRadius: "50%", objectFit: "cover" }}
                      />
                    ) : (
                      <div
                        style={{
                          width: 40,
                          height: 40,
                          borderRadius: "50%",
                          background: global.colors.primary,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "#fff",
                          fontWeight: 600,
                          fontSize: 16,
                        }}
                      >
                        {item.name[0]}
                      </div>
                    )}
                    <div>
                      <p style={{ fontWeight: 600, color: global.colors.text, margin: 0, fontSize: 14 }}>
                        {item.name}
                      </p>
                      {item.role && (
                        <p style={{ color: global.colors.textLight, fontSize: 12, margin: 0 }}>
                          {item.role}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
});
