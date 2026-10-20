"use client";

import { memo, useState } from "react";
import { VideoData, SiteGlobalConfig } from "@/types/template";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";
import { SectionTitle } from "../section-title";

interface Props {
  data: VideoData;
  global: SiteGlobalConfig;
  isPreview?: boolean;
}

function parseYouTubeId(url: string): string | null {
  const patterns = [
    /youtu\.be\/([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/watch\?v=([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/,
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}

function parseVimeoId(url: string): string | null {
  const match = url.match(/vimeo\.com\/(\d+)/);
  return match ? match[1] : null;
}

export const VideoRender = memo(function VideoRender({ data, global, isPreview }: Props) {
  const { ref, visible } = useScrollAnimation(isPreview);
  const [playing, setPlaying] = useState(false);

  const youtubeId = parseYouTubeId(data.videoUrl || "");
  const vimeoId = !youtubeId ? parseVimeoId(data.videoUrl || "") : null;

  const isContained = data.layout === "contained";

  return (
    <section
      style={{
        background: "transparent",
        padding: "80px 24px",
        fontFamily: global.fonts.body,
      }}
      id="video"
    >
      <div style={{ maxWidth: isContained ? 900 : "100%", margin: "0 auto" }}>
        <div
          ref={ref as React.RefObject<HTMLDivElement>}
          style={{
            transition: "opacity 0.7s ease, transform 0.7s ease",
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(28px)",
          }}
        >
          {(data.title || data.subtitle) && (
            <SectionTitle
              title={data.title}
              subtitle={data.subtitle}
              headingFont={global.fonts.heading}
              bodyFont={global.fonts.body}
              titleColor={global.colors.text}
              subtitleColor={global.colors.textLight}
              accentColor={global.colors.accent}
            />
          )}

          <div
            style={{
              position: "relative",
              width: "100%",
              aspectRatio: "16/9",
              borderRadius: 16,
              overflow: "hidden",
              background: "#000",
            }}
          >
            {playing ? (
              <iframe
                src={
                  youtubeId
                    ? `https://www.youtube.com/embed/${youtubeId}?autoplay=1`
                    : vimeoId
                    ? `https://player.vimeo.com/video/${vimeoId}?autoplay=1`
                    : undefined
                }
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  border: "none",
                }}
                allow="autoplay; fullscreen; picture-in-picture"
                allowFullScreen
                title={data.title || "Video"}
              />
            ) : (
              <div
                style={{
                  position: "relative",
                  width: "100%",
                  height: "100%",
                  cursor: "pointer",
                }}
                onClick={() => {
                  if (youtubeId || vimeoId) setPlaying(true);
                }}
              >
                {/* Thumbnail or dark placeholder */}
                {data.thumbnailImage ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    loading="lazy"
                    src={data.thumbnailImage}
                    alt={data.title || "Video thumbnail"}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                ) : (
                  <div
                    style={{
                      width: "100%",
                      height: "100%",
                      background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
                    }}
                  />
                )}

                {/* Overlay text */}
                {data.overlayText && (
                  <div
                    style={{
                      position: "absolute",
                      top: "50%",
                      left: "50%",
                      transform: "translate(-50%, -50%)",
                      color: "#ffffff",
                      fontFamily: global.fonts.heading,
                      fontWeight: 700,
                      fontSize: "clamp(1.5rem, 3vw, 2.5rem)",
                      textAlign: "center",
                      textShadow: "0 2px 12px rgba(0,0,0,0.5)",
                      pointerEvents: "none",
                      zIndex: 2,
                      maxWidth: "80%",
                    }}
                  >
                    {data.overlayText}
                  </div>
                )}

                {/* Play button */}
                {(youtubeId || vimeoId) && (
                  <div
                    style={{
                      position: "absolute",
                      top: "50%",
                      left: "50%",
                      transform: "translate(-50%, -50%)",
                      zIndex: 3,
                      width: 72,
                      height: 72,
                      borderRadius: "50%",
                      background: "rgba(255,255,255,0.95)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      boxShadow: "0 4px 24px rgba(0,0,0,0.3)",
                      transition: "transform 0.2s ease, box-shadow 0.2s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "translate(-50%, -50%) scale(1.1)";
                      e.currentTarget.style.boxShadow = "0 8px 32px rgba(0,0,0,0.4)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "translate(-50%, -50%) scale(1)";
                      e.currentTarget.style.boxShadow = "0 4px 24px rgba(0,0,0,0.3)";
                    }}
                  >
                    <svg
                      width="28"
                      height="28"
                      viewBox="0 0 24 24"
                      fill={global.colors.primary}
                      style={{ marginLeft: 3 }}
                    >
                      <polygon points="6,3 20,12 6,21" />
                    </svg>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
});
