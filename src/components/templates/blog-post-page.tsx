"use client";

import { useEffect } from "react";
import { SiteConfig } from "@/types/template";
import { loadGoogleFont } from "@/lib/fonts";
import { HeaderRender } from "./sections/header-render";
import { FooterRender } from "./sections/footer-render";

interface BlogPostData {
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  coverImage: string;
  category: string;
  author: string;
  readTime: string;
  publishedAt: string | null;
  createdAt: string;
}

interface Props {
  post: BlogPostData;
  config: SiteConfig;
  basePath?: string;
  onBack?: () => void;
}

export function BlogPostPage({ post, config, basePath = "", onBack }: Props) {
  const { global } = config;

  useEffect(() => {
    if (global.fonts.heading) loadGoogleFont(global.fonts.heading);
    if (global.fonts.body) loadGoogleFont(global.fonts.body);
  }, [global.fonts.heading, global.fonts.body]);

  const dateStr = post.publishedAt || post.createdAt;
  const formattedDate = dateStr
    ? new Date(dateStr).toLocaleDateString("tr-TR", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "";

  const backLink = basePath ? basePath + "/" : "/";

  return (
    <div
      style={{
        background: global.colors.background,
        color: global.colors.text,
        fontFamily: global.fonts.body,
        minHeight: "100vh",
      }}
    >
      {/* Header */}
      {global.layout?.header && (
        <HeaderRender
          data={global.layout.header}
          global={global}
          basePath={basePath}
        />
      )}

      {/* Article */}
      <article
        style={{
          maxWidth: 720,
          margin: "0 auto",
          padding: "48px 24px 64px",
        }}
      >
        {/* Cover image */}
        {post.coverImage && (
          <div style={{ marginBottom: 32 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={post.coverImage}
              alt={post.title}
              style={{
                width: "100%",
                maxHeight: 480,
                objectFit: "cover",
                borderRadius: 12,
                display: "block",
              }}
            />
          </div>
        )}

        {/* Category badge */}
        {post.category && (
          <span
            style={{
              display: "inline-block",
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: global.colors.accent,
              background: `${global.colors.accent}18`,
              padding: "4px 12px",
              borderRadius: 999,
              marginBottom: 16,
            }}
          >
            {post.category}
          </span>
        )}

        {/* Title */}
        <h1
          style={{
            fontFamily: global.fonts.heading,
            fontWeight: 700,
            fontSize: "clamp(1.75rem, 3vw, 2.625rem)",
            lineHeight: 1.25,
            color: global.colors.text,
            margin: "0 0 16px",
          }}
        >
          {post.title}
        </h1>

        {/* Meta line */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            flexWrap: "wrap",
            fontSize: 14,
            color: global.colors.textLight,
            marginBottom: 40,
            paddingBottom: 32,
            borderBottom: `1px solid ${global.colors.surface}`,
          }}
        >
          {post.author && <span>{post.author}</span>}
          {post.author && formattedDate && (
            <span style={{ opacity: 0.5 }}>·</span>
          )}
          {formattedDate && <span>{formattedDate}</span>}
          {post.readTime && (
            <>
              <span style={{ opacity: 0.5 }}>·</span>
              <span>{post.readTime}</span>
            </>
          )}
        </div>

        {/* Content */}
        <div
          className="sf-blog-content"
          dangerouslySetInnerHTML={{
            __html: post.content.includes("<")
              ? post.content
              : post.content
                  .split(/\n\n+/)
                  .map((block) => `<p>${block.replace(/\n/g, "<br>")}</p>`)
                  .join(""),
          }}
        />

        {/* Prose styles via inline style tag */}
        <style>{`
          .sf-blog-content h2 {
            font-family: ${global.fonts.heading};
            font-weight: 700;
            font-size: 1.5rem;
            line-height: 1.3;
            color: ${global.colors.text};
            margin: 40px 0 16px;
          }
          .sf-blog-content h3 {
            font-family: ${global.fonts.heading};
            font-weight: 600;
            font-size: 1.25rem;
            line-height: 1.35;
            color: ${global.colors.text};
            margin: 32px 0 12px;
          }
          .sf-blog-content p {
            font-size: 1.0625rem;
            line-height: 1.75;
            color: ${global.colors.text};
            margin: 0 0 20px;
          }
          .sf-blog-content ul,
          .sf-blog-content ol {
            font-size: 1.0625rem;
            line-height: 1.75;
            color: ${global.colors.text};
            margin: 0 0 20px;
            padding-left: 24px;
          }
          .sf-blog-content li {
            margin-bottom: 8px;
          }
          .sf-blog-content a {
            color: ${global.colors.primary};
            text-decoration: underline;
            text-underline-offset: 2px;
          }
          .sf-blog-content a:hover {
            color: ${global.colors.accent};
          }
          .sf-blog-content strong {
            font-weight: 600;
            color: ${global.colors.text};
          }
          .sf-blog-content em {
            font-style: italic;
          }
          .sf-blog-content blockquote {
            border-left: 3px solid ${global.colors.accent};
            margin: 24px 0;
            padding: 12px 20px;
            color: ${global.colors.textLight};
            font-style: italic;
          }
          .sf-blog-content img {
            max-width: 100%;
            height: auto;
            border-radius: 8px;
            margin: 24px 0;
          }
          .sf-blog-content pre {
            background: ${global.colors.surface};
            padding: 16px 20px;
            border-radius: 8px;
            overflow-x: auto;
            margin: 24px 0;
            font-size: 0.875rem;
            line-height: 1.6;
          }
          .sf-blog-content code {
            background: ${global.colors.surface};
            padding: 2px 6px;
            border-radius: 4px;
            font-size: 0.9em;
          }
          .sf-blog-content pre code {
            background: none;
            padding: 0;
          }
        `}</style>

        {/* Back link */}
        <div
          style={{
            marginTop: 48,
            paddingTop: 32,
            borderTop: `1px solid ${global.colors.surface}`,
          }}
        >
          <a
            href={onBack ? "#" : backLink}
            onClick={onBack ? (e) => { e.preventDefault(); onBack(); } : undefined}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              fontSize: 14,
              fontWeight: 600,
              color: global.colors.primary,
              textDecoration: "none",
              transition: "opacity 0.2s",
              cursor: "pointer",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.7")}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
          >
            <svg
              style={{ width: 16, height: 16 }}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Tum Yazilara Don
          </a>
        </div>
      </article>

      {/* Footer */}
      {global.layout?.footer && (
        <FooterRender
          data={global.layout.footer}
          global={global}
          basePath={basePath}
        />
      )}
    </div>
  );
}
