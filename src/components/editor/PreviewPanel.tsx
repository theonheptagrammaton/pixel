"use client";

import { useState, useEffect } from "react";
import { useEditorStore } from "@/stores/editor-store";
import { TemplateRenderer } from "@/components/templates/template-renderer";
import { BlogPostPage } from "@/components/templates/blog-post-page";
import { SiteConfig } from "@/types/template";

interface PreviewPanelProps {
  subdomain: string;
}

const DEVICE_CONFIGS = {
  desktop: { width: 1200, label: "Masaustu" },
  tablet: { width: 768, label: "Tablet" },
  mobile: { width: 390, label: "Mobil" },
} as const;

export function PreviewPanel({ subdomain }: PreviewPanelProps) {
  const { previewDevice, setPreviewDevice, previewPageSlug, setPreviewPageSlug, config, site } = useEditorStore();
  const [blogPostSlug, setBlogPostSlug] = useState<string | null>(null);
  const [isHidden, setIsHidden] = useState(false);

  if (isHidden) {
    return (
      <div className="w-10 shrink-0 bg-zinc-50 border-l border-zinc-200 flex flex-col items-center py-3">
        <button onClick={() => setIsHidden(false)} className="text-zinc-400 hover:text-zinc-700 transition-colors">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div className="mt-4">
          <span style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }} className="text-xs text-zinc-400 font-medium select-none">
            Onizleme
          </span>
        </div>
      </div>
    );
  }

  const pages = config ? [...config.pages].sort((a, b) => a.order - b.order) : [];

  return (
    <aside className="w-[480px] shrink-0 bg-zinc-100 border-l border-zinc-200 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-zinc-200 bg-white shrink-0">
        <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Canli Onizleme</span>

        {/* Device toggle */}
        <div className="flex items-center gap-0.5 bg-zinc-100 rounded-md p-0.5">
          {(["desktop", "tablet", "mobile"] as const).map((d) => (
            <button
              key={d}
              onClick={() => setPreviewDevice(d)}
              className={`px-2 py-1 text-xs rounded transition-colors ${
                previewDevice === d ? "bg-white text-zinc-900 shadow-sm font-medium" : "text-zinc-500 hover:text-zinc-700"
              }`}
              title={DEVICE_CONFIGS[d].label}
            >
              {d === "desktop" && (
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              )}
              {d === "tablet" && (
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 18h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              )}
              {d === "mobile" && (
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              )}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1">
          <a
            href={`/preview?subdomain=${subdomain}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-zinc-400 hover:text-zinc-700 transition-colors p-1 rounded"
            title="Tam ekranda ac"
          >
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
          <button onClick={() => setIsHidden(true)} className="text-zinc-400 hover:text-zinc-700 transition-colors p-1 rounded" title="Gizle">
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Page tabs */}
      {pages.length > 1 && (
        <div className="flex items-center gap-1 px-3 py-1.5 border-b border-zinc-200 bg-white overflow-x-auto shrink-0">
          {pages.map((page) => (
            <button
              key={page.id}
              onClick={() => setPreviewPageSlug(page.slug)}
              className={`px-2.5 py-1 text-xs rounded font-medium whitespace-nowrap transition-colors ${
                previewPageSlug === page.slug
                  ? "bg-zinc-900 text-white"
                  : "text-zinc-500 hover:bg-zinc-100 hover:text-zinc-700"
              }`}
            >
              {page.name}
            </button>
          ))}
        </div>
      )}

      {/* Preview area */}
      <div className="flex-1 overflow-auto flex items-start justify-center p-4 bg-zinc-100">
        {config ? (
          <PreviewFrame config={config} device={previewDevice} pageSlug={previewPageSlug} siteId={site?.id} blogPostSlug={blogPostSlug} setBlogPostSlug={setBlogPostSlug} />
        ) : (
          <div className="flex items-center justify-center h-32 text-zinc-400 text-xs">Yukleniyor...</div>
        )}
      </div>
    </aside>
  );
}

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

function PreviewFrame({
  config,
  device,
  pageSlug,
  siteId,
  blogPostSlug,
  setBlogPostSlug,
}: {
  config: SiteConfig;
  device: "desktop" | "tablet" | "mobile";
  pageSlug: string;
  siteId?: string;
  blogPostSlug: string | null;
  setBlogPostSlug: (slug: string | null) => void;
}) {
  const { setPreviewPageSlug } = useEditorStore();
  const [blogPost, setBlogPost] = useState<BlogPostData | null>(null);
  const deviceWidth = DEVICE_CONFIGS[device].width;
  const containerWidth = 448;
  const scale = Math.min(1, containerWidth / deviceWidth);
  const scaledHeight = Math.round(800 * scale);

  // Fetch blog post
  useEffect(() => {
    if (!blogPostSlug || !siteId) { setBlogPost(null); return; }
    fetch(`/api/sites/${siteId}/blog`)
      .then((r) => r.json())
      .then((json) => {
        if (json.success && json.data?.posts) {
          const p = json.data.posts.find((x: BlogPostData) => x.slug === blogPostSlug);
          setBlogPost(p || null);
        }
      })
      .catch(() => setBlogPost(null));
  }, [blogPostSlug, siteId]);

  // Handle clicks on the overlay
  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const overlay = e.currentTarget;
    overlay.style.display = "none";
    const el = document.elementFromPoint(e.clientX, e.clientY);
    overlay.style.display = "";

    if (!el) return;

    const anchor = el.closest("a");
    if (!anchor) return;

    const href = anchor.getAttribute("href");
    if (!href || href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:")) return;

    // Blog post link
    const blogMatch = href.match(/(?:sites\/[^/]+\/)?blog\/(.+)/);
    if (blogMatch) {
      setBlogPostSlug(blogMatch[1]);
      return;
    }

    if (href.startsWith("/")) {
      const slug = href === "/" ? "" : href.slice(1);
      const pageExists = config.pages?.some((p) => p.slug === slug);
      if (pageExists) {
        setBlogPostSlug(null);
        setPreviewPageSlug(slug);
      }
    }
  };

  return (
    <div
      style={{
        width: containerWidth,
        height: scaledHeight + 32,
        overflow: "hidden",
        position: "relative",
        borderRadius: device === "mobile" ? 24 : 8,
        boxShadow:
          device === "mobile"
            ? "0 0 0 8px #18181b, 0 20px 60px rgba(0,0,0,0.4)"
            : "0 4px 24px rgba(0,0,0,0.15)",
        background: "#ffffff",
      }}
    >
      <div
        style={{
          transformOrigin: "top left",
          transform: `scale(${scale})`,
          width: deviceWidth,
          minHeight: Math.round(scaledHeight / scale),
          overflow: "hidden",
        }}
      >
        {blogPostSlug && blogPost ? (
          <BlogPostPage
            post={blogPost}
            config={config}
            basePath=""
            onBack={() => setBlogPostSlug(null)}
          />
        ) : (
          <TemplateRenderer config={config} pageSlug={pageSlug} isPreview siteId={siteId} />
        )}
      </div>

      {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */}
      <div
        onClick={handleOverlayClick}
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 10,
          cursor: "default",
        }}
      />
    </div>
  );
}
