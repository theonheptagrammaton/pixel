"use client";

import { useState, useCallback, useEffect } from "react";
import { SiteConfig } from "@/types/template";
import { TemplateRenderer } from "./template-renderer";
import { BlogPostPage } from "./blog-post-page";

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

interface PreviewShellProps {
  config: SiteConfig;
  siteId?: string;
  siteSubdomain?: string;
}

export function PreviewShell({ config, siteId, siteSubdomain }: PreviewShellProps) {
  const [pageSlug, setPageSlug] = useState("");
  const [blogPostSlug, setBlogPostSlug] = useState<string | null>(null);
  const [blogPost, setBlogPost] = useState<BlogPostData | null>(null);
  const [blogLoading, setBlogLoading] = useState(false);

  const pages = config.pages ?? [];

  // Fetch blog post when blogPostSlug changes
  useEffect(() => {
    if (!blogPostSlug || !siteId) return;
    setBlogLoading(true);
    fetch(`/api/sites/${siteId}/blog`)
      .then((r) => r.json())
      .then((json) => {
        if (json.success && json.data?.posts) {
          const post = json.data.posts.find(
            (p: BlogPostData) => p.slug === blogPostSlug
          );
          setBlogPost(post || null);
        }
      })
      .catch(() => setBlogPost(null))
      .finally(() => setBlogLoading(false));
  }, [blogPostSlug, siteId]);

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest("a");
      if (!anchor) return;

      const href = anchor.getAttribute("href");
      if (!href) return;

      // Allow external links, anchors, mailto, tel
      if (!href.startsWith("/")) return;
      if (href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:")) return;

      e.preventDefault();
      e.stopPropagation();

      const path = href.replace(/^\//, "").replace(/\/$/, "");

      // Blog post link: /sites/{subdomain}/blog/{slug} or /blog/{slug}
      const blogMatch = path.match(/(?:sites\/[^/]+\/)?blog\/(.+)/);
      if (blogMatch) {
        setBlogPostSlug(blogMatch[1]);
        window.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }

      // Page navigation
      const slug = href === "/" ? "" : path;
      const pageExists = pages.some((p) => p.slug === slug);
      if (pageExists) {
        setBlogPostSlug(null);
        setBlogPost(null);
        setPageSlug(slug);
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    },
    [pages]
  );

  // Show blog post page
  if (blogPostSlug) {
    if (blogLoading) {
      return (
        <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: config.global.colors.background }}>
          <p style={{ color: config.global.colors.textLight, fontFamily: config.global.fonts.body }}>Yukleniyor...</p>
        </div>
      );
    }

    if (!blogPost) {
      return (
        // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
        <div onClick={() => { setBlogPostSlug(null); setBlogPost(null); }} style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: config.global.colors.background, cursor: "pointer" }}>
          <p style={{ color: config.global.colors.textLight, fontFamily: config.global.fonts.body }}>Yazi bulunamadi.</p>
          <p style={{ color: config.global.colors.primary, fontFamily: config.global.fonts.body, fontSize: 14, marginTop: 8 }}>Geri don</p>
        </div>
      );
    }

    return (
      // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
      <div onClick={handleClick}>
        <BlogPostPage
          post={blogPost}
          config={config}
          basePath=""
          onBack={() => { setBlogPostSlug(null); setBlogPost(null); }}
        />
      </div>
    );
  }

  return (
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
    <div onClick={handleClick}>
      <TemplateRenderer config={config} pageSlug={pageSlug} isPreview={false} siteId={siteId} siteSubdomain={siteSubdomain} />
    </div>
  );
}
