"use client";

import { memo, useState, useRef, useEffect, useCallback } from "react";
import { GalleryData, SiteGlobalConfig } from "@/types/template";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";
import { SectionTitle } from "../section-title";
import { Lightbox } from "../lightbox";
import { ImagePlaceholder } from "../image-placeholder";

interface Props {
  data: GalleryData;
  global: SiteGlobalConfig;
  isPreview?: boolean;
}

export const GalleryRender = memo(function GalleryRender({ data, global, isPreview }: Props) {
  const { ref, visible } = useScrollAnimation(isPreview);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeSlide, setActiveSlide] = useState(0);

  const cols = data.columns ?? 3;

  const handleScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const scrollLeft = el.scrollLeft;
    const itemWidth = el.scrollWidth / (data.images?.length || 1);
    const index = Math.round(scrollLeft / itemWidth);
    setActiveSlide(index);
  }, [data.images?.length]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el || data.layout !== "slider") return;
    el.addEventListener("scroll", handleScroll, { passive: true });
    return () => el.removeEventListener("scroll", handleScroll);
  }, [data.layout, handleScroll]);

  const scrollTo = (direction: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    const amount = el.clientWidth * 0.8;
    el.scrollBy({ left: direction === "left" ? -amount : amount, behavior: "smooth" });
  };

  const imageHover = (e: React.MouseEvent, scale: string) => {
    const el = e.currentTarget.querySelector("img") as HTMLImageElement | null;
    if (el) el.style.transform = `scale(${scale})`;
  };

  function renderGrid() {
    return (
      <div
        className="sf-gallery-grid"
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${cols}, 1fr)`,
          gap: 16,
        }}
      >
        {data.images.map((img, i) => (
          <div
            key={i}
            style={{
              overflow: "hidden",
              borderRadius: 12,
              cursor: "pointer",
              position: "relative",
            }}
            onClick={() => setLightboxIndex(i)}
            onMouseEnter={(e) => imageHover(e, "1.06")}
            onMouseLeave={(e) => imageHover(e, "1")}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              loading="lazy"
              src={img.url}
              alt={img.alt}
              style={{
                width: "100%",
                height: 260,
                objectFit: "cover",
                display: "block",
                transition: "transform 0.4s ease",
              }}
            />
            {img.caption && (
              <div
                style={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  right: 0,
                  padding: "24px 16px 12px",
                  background: "linear-gradient(transparent, rgba(0,0,0,0.6))",
                  color: "#fff",
                  fontSize: 13,
                }}
              >
                {img.caption}
              </div>
            )}
          </div>
        ))}
      </div>
    );
  }

  function renderMasonry() {
    return (
      <div
        style={{
          columnCount: cols,
          columnGap: 16,
        }}
      >
        {data.images.map((img, i) => (
          <div
            key={i}
            style={{
              breakInside: "avoid",
              marginBottom: 16,
              overflow: "hidden",
              borderRadius: 12,
              cursor: "pointer",
              position: "relative",
            }}
            onClick={() => setLightboxIndex(i)}
            onMouseEnter={(e) => imageHover(e, "1.06")}
            onMouseLeave={(e) => imageHover(e, "1")}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              loading="lazy"
              src={img.url}
              alt={img.alt}
              style={{
                width: "100%",
                display: "block",
                transition: "transform 0.4s ease",
              }}
            />
            {img.caption && (
              <div
                style={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  right: 0,
                  padding: "24px 16px 12px",
                  background: "linear-gradient(transparent, rgba(0,0,0,0.6))",
                  color: "#fff",
                  fontSize: 13,
                }}
              >
                {img.caption}
              </div>
            )}
          </div>
        ))}
      </div>
    );
  }

  function renderSlider() {
    const total = data.images.length;
    return (
      <div style={{ position: "relative" }}>
        {/* Scroll container */}
        <div
          ref={scrollRef}
          style={{
            display: "flex",
            gap: 16,
            overflowX: "auto",
            scrollSnapType: "x mandatory",
            scrollBehavior: "smooth",
            WebkitOverflowScrolling: "touch",
            msOverflowStyle: "none",
            scrollbarWidth: "none",
          }}
        >
          <style>{`.sf-gallery-slider::-webkit-scrollbar { display: none; }`}</style>
          {data.images.map((img, i) => (
            <div
              key={i}
              className="sf-gallery-slider"
              style={{
                scrollSnapAlign: "start",
                minWidth: "80%",
                flexShrink: 0,
                height: 400,
                overflow: "hidden",
                borderRadius: 12,
                cursor: "pointer",
                position: "relative",
              }}
              onClick={() => setLightboxIndex(i)}
              onMouseEnter={(e) => imageHover(e, "1.06")}
              onMouseLeave={(e) => imageHover(e, "1")}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                loading="lazy"
                src={img.url}
                alt={img.alt}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  display: "block",
                  transition: "transform 0.4s ease",
                }}
              />
              {img.caption && (
                <div
                  style={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    padding: "24px 16px 12px",
                    background: "linear-gradient(transparent, rgba(0,0,0,0.6))",
                    color: "#fff",
                    fontSize: 13,
                  }}
                >
                  {img.caption}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Left arrow */}
        <button
          onClick={() => scrollTo("left")}
          style={{
            position: "absolute",
            left: 12,
            top: "50%",
            transform: "translateY(-50%)",
            width: 44,
            height: 44,
            borderRadius: "50%",
            background: "rgba(0,0,0,0.5)",
            border: "none",
            color: "#fff",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 2,
            transition: "background 0.2s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(0,0,0,0.7)")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(0,0,0,0.5)")}
        >
          <svg width={20} height={20} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* Right arrow */}
        <button
          onClick={() => scrollTo("right")}
          style={{
            position: "absolute",
            right: 12,
            top: "50%",
            transform: "translateY(-50%)",
            width: 44,
            height: 44,
            borderRadius: "50%",
            background: "rgba(0,0,0,0.5)",
            border: "none",
            color: "#fff",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 2,
            transition: "background 0.2s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(0,0,0,0.7)")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(0,0,0,0.5)")}
        >
          <svg width={20} height={20} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>

        {/* Dot indicators */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: 8,
            marginTop: 16,
          }}
        >
          {Array.from({ length: total }).map((_, i) => (
            <button
              key={i}
              onClick={() => {
                const el = scrollRef.current;
                if (!el) return;
                const itemWidth = el.scrollWidth / total;
                el.scrollTo({ left: itemWidth * i, behavior: "smooth" });
              }}
              style={{
                width: activeSlide === i ? 24 : 10,
                height: 10,
                borderRadius: 5,
                border: "none",
                background: activeSlide === i ? global.colors.accent : global.colors.surface,
                cursor: "pointer",
                transition: "all 0.3s ease",
                padding: 0,
              }}
            />
          ))}
        </div>
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
      id="gallery"
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

          {data.images && data.images.length > 0 ? (
            data.layout === "masonry"
              ? renderMasonry()
              : data.layout === "slider"
                ? renderSlider()
                : renderGrid()
          ) : (
            <ImagePlaceholder height={320} label="Galeri gorselleriniz burada gorünecek" />
          )}
        </div>
      </div>

      {lightboxIndex !== null && data.images && (
        <Lightbox
          images={data.images}
          currentIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onNext={() =>
            setLightboxIndex((i) =>
              i !== null ? (i + 1) % data.images.length : null
            )
          }
          onPrev={() =>
            setLightboxIndex((i) =>
              i !== null ? (i - 1 + data.images.length) % data.images.length : null
            )
          }
        />
      )}
    </section>
  );
});
