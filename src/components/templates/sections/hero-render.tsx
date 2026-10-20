"use client";

import { memo, useState, useEffect, useRef, useCallback } from "react";
import { HeroData, SiteGlobalConfig } from "@/types/template";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";

interface Props {
  data: HeroData;
  global: SiteGlobalConfig;
  isPreview?: boolean;
}

const HEIGHT_MAP = { full: "100vh", large: "90vh", medium: "70vh" };

function HeroContent({
  data,
  global,
  visible,
  innerRef,
  invertColors,
}: {
  data: HeroData;
  global: SiteGlobalConfig;
  visible: boolean;
  innerRef: React.RefObject<HTMLElement>;
  invertColors?: boolean;
}) {
  const textAlign = data.alignment;
  const alignItems =
    data.alignment === "left" ? "flex-start" : data.alignment === "right" ? "flex-end" : "center";
  // invertColors=true → white text (dark/colored bg), false → global.colors.text (light bg)
  const useDark = invertColors !== undefined ? invertColors : !!data.backgroundImage;

  return (
    <div
      ref={innerRef as React.RefObject<HTMLDivElement>}
      style={{
        position: "relative",
        zIndex: 2,
        maxWidth: 900,
        width: "100%",
        padding: "80px 24px",
        display: "flex",
        flexDirection: "column",
        alignItems,
        textAlign,
        transition: "opacity 0.8s ease, transform 0.8s ease",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(32px)",
      }}
    >
      {data.subtitle && (
        <span
          style={{
            fontFamily: global.fonts.body,
            fontSize: data.subtitleFontSize || 13,
            fontWeight: 600,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: data.subtitleColor || (useDark ? "rgba(255,255,255,0.8)" : global.colors.accent),
            marginBottom: 16,
          }}
        >
          {data.subtitle}
        </span>
      )}

      <h1
        style={{
          fontFamily: global.fonts.heading,
          fontSize: data.titleFontSize ? data.titleFontSize + "px" : "clamp(2.5rem, 6vw, 5rem)",
          fontWeight: data.titleFontWeight || 800,
          lineHeight: 1.1,
          color: data.titleColor || (useDark ? "#ffffff" : global.colors.text),
          margin: "0 0 24px",
          maxWidth: 800,
        }}
      >
        {data.title}
      </h1>

      {data.description && (
        <p
          style={{
            fontFamily: global.fonts.body,
            fontSize: data.descriptionFontSize ? data.descriptionFontSize + "px" : "clamp(1rem, 1.5vw, 1.2rem)",
            lineHeight: 1.7,
            color: data.descriptionColor || (useDark ? "rgba(255,255,255,0.85)" : global.colors.textLight),
            maxWidth: 600,
            margin: "0 0 40px",
          }}
        >
          {data.description}
        </p>
      )}

      <div style={{ display: "flex", gap: 16, flexWrap: "wrap", justifyContent: alignItems }}>
        {data.ctaText && (
          <a
            href={data.ctaLink || "#"}
            style={{
              display: "inline-block",
              background: global.colors.accent,
              color: "#ffffff",
              fontFamily: global.fonts.body,
              fontWeight: 600,
              fontSize: 15,
              padding: "14px 32px",
              borderRadius: 8,
              textDecoration: "none",
              transition: "transform 0.2s, box-shadow 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.25)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            {data.ctaText}
          </a>
        )}
        {data.secondaryCtaText && (
          <a
            href={data.secondaryCtaLink || "#"}
            style={{
              display: "inline-block",
              background: "transparent",
              color: useDark ? "#ffffff" : global.colors.text,
              fontFamily: global.fonts.body,
              fontWeight: 600,
              fontSize: 15,
              padding: "14px 32px",
              borderRadius: 8,
              textDecoration: "none",
              border: `2px solid ${useDark ? "rgba(255,255,255,0.5)" : global.colors.text}`,
              transition: "border-color 0.2s",
            }}
          >
            {data.secondaryCtaText}
          </a>
        )}
      </div>
    </div>
  );
}

function DefaultHero({ data, global, isPreview }: Props) {
  const { ref, visible } = useScrollAnimation(isPreview);
  const minHeight = HEIGHT_MAP[data.height ?? "large"];

  return (
    <section
      style={{
        position: "relative",
        minHeight,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        background: data.backgroundImage ? "transparent" : global.colors.primary,
      }}
    >
      {data.backgroundImage && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={data.backgroundImage}
          alt={data.title}
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", zIndex: 0 }}
        />
      )}
      {data.backgroundImage && (
        <div style={{ position: "absolute", inset: 0, background: `rgba(0,0,0,${(data.overlayOpacity ?? 40) / 100})`, zIndex: 1 }} />
      )}
      {/* primary-color bg (no image) → white text; image bg → white text too */}
      <HeroContent data={data} global={global} visible={visible} innerRef={ref as React.RefObject<HTMLElement>} invertColors={true} />
    </section>
  );
}

function SplitHero({ data, global, isPreview }: Props) {
  const { ref, visible } = useScrollAnimation(isPreview);
  const minHeight = HEIGHT_MAP[data.height ?? "large"];
  const imageRight = data.splitImagePosition !== "left";

  const textBlock = (
    <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "60px 40px" }}>
      <HeroContent data={data} global={global} visible={visible} innerRef={ref as React.RefObject<HTMLElement>} invertColors={false} />
    </div>
  );

  const imageBlock = (
    <div style={{ flex: 1, position: "relative", minHeight: minHeight === "100vh" ? "100vh" : "50vh" }}>
      {(data.splitImage || data.backgroundImage) && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={data.splitImage || data.backgroundImage}
          alt={data.title}
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
        />
      )}
    </div>
  );

  return (
    <section
      className="sf-hero-split"
      style={{
        display: "flex",
        flexWrap: "wrap",
        minHeight,
        background: global.colors.background,
      }}
    >
      {imageRight ? (
        <>
          {textBlock}
          {imageBlock}
        </>
      ) : (
        <>
          {imageBlock}
          {textBlock}
        </>
      )}
    </section>
  );
}

function VideoHero({ data, global, isPreview }: Props) {
  const { ref, visible } = useScrollAnimation(isPreview);
  const minHeight = HEIGHT_MAP[data.height ?? "large"];

  const videoSrc = data.videoUrl || "";
  const isEmbedded = videoSrc.includes("youtube") || videoSrc.includes("vimeo") || videoSrc.includes("youtu.be");

  // Extract YouTube embed ID
  let embedUrl = "";
  if (videoSrc.includes("youtube.com/watch")) {
    const id = new URL(videoSrc).searchParams.get("v");
    if (id) embedUrl = `https://www.youtube.com/embed/${id}?autoplay=1&mute=1&loop=1&playlist=${id}&controls=0&showinfo=0`;
  } else if (videoSrc.includes("youtu.be/")) {
    const id = videoSrc.split("youtu.be/")[1]?.split("?")[0];
    if (id) embedUrl = `https://www.youtube.com/embed/${id}?autoplay=1&mute=1&loop=1&playlist=${id}&controls=0&showinfo=0`;
  } else if (videoSrc.includes("vimeo.com/")) {
    const id = videoSrc.split("vimeo.com/")[1]?.split("?")[0];
    if (id) embedUrl = `https://player.vimeo.com/video/${id}?autoplay=1&muted=1&loop=1&background=1`;
  }

  return (
    <section
      style={{
        position: "relative",
        minHeight,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        background: global.colors.primary,
      }}
    >
      {isEmbedded && embedUrl ? (
        <iframe
          src={embedUrl}
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: "none", objectFit: "cover", zIndex: 0, pointerEvents: "none" }}
          allow="autoplay; encrypted-media"
          title="Hero Video"
        />
      ) : videoSrc ? (
        <video
          src={videoSrc}
          poster={data.videoPoster || undefined}
          autoPlay
          muted
          loop
          playsInline
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", zIndex: 0 }}
        />
      ) : null}
      <div style={{ position: "absolute", inset: 0, background: `rgba(0,0,0,${(data.overlayOpacity ?? 50) / 100})`, zIndex: 1 }} />
      <HeroContent data={data} global={global} visible={visible} innerRef={ref as React.RefObject<HTMLElement>} invertColors />
    </section>
  );
}

function SliderHero({ data, global, isPreview }: Props) {
  const { ref, visible } = useScrollAnimation(isPreview);
  const [currentSlide, setCurrentSlide] = useState(0);
  const pausedRef = useRef(false);
  const minHeight = HEIGHT_MAP[data.height ?? "large"];
  const slides = data.slides ?? [];
  const total = slides.length;
  const interval = data.slideInterval ?? 5000;

  const goNext = useCallback(() => {
    if (total === 0) return;
    setCurrentSlide((prev) => (prev + 1) % total);
  }, [total]);

  useEffect(() => {
    if (total <= 1) return;
    const timer = setInterval(() => {
      if (!pausedRef.current) goNext();
    }, interval);
    return () => clearInterval(timer);
  }, [total, interval, goNext]);

  if (total === 0) {
    return <DefaultHero data={data} global={global} isPreview={isPreview} />;
  }

  const slide = slides[currentSlide];

  return (
    <section
      style={{
        position: "relative",
        minHeight,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        background: global.colors.primary,
      }}
      onMouseEnter={() => { pausedRef.current = true; }}
      onMouseLeave={() => { pausedRef.current = false; }}
    >
      {slide.backgroundImage && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={currentSlide}
          src={slide.backgroundImage}
          alt={slide.title}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            zIndex: 0,
            transition: "opacity 0.8s ease",
          }}
        />
      )}
      <div style={{ position: "absolute", inset: 0, background: `rgba(0,0,0,${(data.overlayOpacity ?? 40) / 100})`, zIndex: 1 }} />

      <div
        ref={ref as React.RefObject<HTMLDivElement>}
        key={currentSlide}
        style={{
          position: "relative",
          zIndex: 2,
          maxWidth: 900,
          width: "100%",
          padding: "80px 24px",
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          transition: "opacity 0.6s ease",
          opacity: visible ? 1 : 0,
        }}
      >
        <h1
          style={{
            fontFamily: global.fonts.heading,
            fontSize: data.titleFontSize ? data.titleFontSize + "px" : "clamp(2.5rem, 6vw, 5rem)",
            fontWeight: data.titleFontWeight || 800,
            lineHeight: 1.1,
            color: data.titleColor || "#ffffff",
            margin: "0 0 24px",
          }}
        >
          {slide.title}
        </h1>
        {slide.description && (
          <p style={{ fontFamily: global.fonts.body, fontSize: "clamp(1rem, 1.5vw, 1.2rem)", lineHeight: 1.7, color: "rgba(255,255,255,0.85)", maxWidth: 600, margin: "0 0 40px" }}>
            {slide.description}
          </p>
        )}
        {slide.ctaText && (
          <a
            href={slide.ctaLink || "#"}
            style={{
              display: "inline-block",
              background: global.colors.accent,
              color: "#ffffff",
              fontFamily: global.fonts.body,
              fontWeight: 600,
              fontSize: 15,
              padding: "14px 32px",
              borderRadius: 8,
              textDecoration: "none",
            }}
          >
            {slide.ctaText}
          </a>
        )}
      </div>

      {/* Dot indicators */}
      {total > 1 && (
        <div style={{ position: "absolute", bottom: 32, left: "50%", transform: "translateX(-50%)", display: "flex", gap: 8, zIndex: 3 }}>
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentSlide(i)}
              style={{
                width: 12,
                height: 12,
                borderRadius: "50%",
                border: "2px solid rgba(255,255,255,0.6)",
                background: i === currentSlide ? "#ffffff" : "transparent",
                cursor: "pointer",
                padding: 0,
                transition: "background 0.3s ease",
              }}
            />
          ))}
        </div>
      )}
    </section>
  );
}

function GradientHero({ data, global, isPreview }: Props) {
  const { ref, visible } = useScrollAnimation(isPreview);
  const minHeight = HEIGHT_MAP[data.height ?? "large"];
  const from = data.gradientFrom || global.colors.primary;
  const to = data.gradientTo || global.colors.accent;
  const angle = data.gradientAngle ?? 135;

  return (
    <section
      style={{
        position: "relative",
        minHeight,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        background: `linear-gradient(${angle}deg, ${from}, ${to})`,
      }}
    >
      <HeroContent data={data} global={global} visible={visible} innerRef={ref as React.RefObject<HTMLElement>} invertColors />
    </section>
  );
}

export const HeroRender = memo(function HeroRender({ data, global, isPreview }: Props) {
  const variant = data.variant || "default";

  switch (variant) {
    case "split":
      return <SplitHero data={data} global={global} isPreview={isPreview} />;
    case "video":
      return <VideoHero data={data} global={global} isPreview={isPreview} />;
    case "slider":
      return <SliderHero data={data} global={global} isPreview={isPreview} />;
    case "gradient":
      return <GradientHero data={data} global={global} isPreview={isPreview} />;
    default:
      return <DefaultHero data={data} global={global} isPreview={isPreview} />;
  }
});
