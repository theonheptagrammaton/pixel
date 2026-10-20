"use client";

import { memo, useState, useEffect, useCallback } from "react";
import { BlogData, SiteGlobalConfig } from "@/types/template";
import { SectionTitle } from "../section-title";

interface BlogPostItem {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  coverImage: string;
  category: string;
  author: string;
  readTime: string;
  publishedAt: string | null;
  createdAt: string;
}

interface Props {
  data: BlogData;
  global: SiteGlobalConfig;
  isPreview?: boolean;
  basePath?: string;
  siteSubdomain?: string;
  siteId?: string;
}

function blogPostHref(basePath: string, slug: string, siteSubdomain?: string, siteId?: string) {
  // In editor/preview context, link to the public sites route in a new tab
  if (siteId && siteSubdomain) return `/sites/${siteSubdomain}/blog/${slug}`;
  return `${basePath}/blog/${slug}`;
}

export const BlogRender = memo(function BlogRender({
  data,
  global,
  isPreview,
  basePath = "",
  siteSubdomain,
  siteId,
}: Props) {
  const [posts, setPosts] = useState<BlogPostItem[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const postsPerPage = data.postsPerPage || 6;

  const fetchPosts = useCallback(
    async (pageNum: number, category: string, append: boolean) => {
      if (!siteSubdomain && !siteId) return;
      setLoading(true);
      try {
        const params = new URLSearchParams({
          page: String(pageNum),
          limit: String(postsPerPage),
        });
        if (category) params.set("category", category);

        // Use private API when siteId available (editor/preview), public API for published sites
        const apiUrl = siteId
          ? `/api/sites/${siteId}/blog?${params.toString()}`
          : `/api/public/sites/${siteSubdomain}/blog?${params.toString()}`;

        const res = await fetch(apiUrl);
        const json = await res.json();
        if (json.success && json.data) {
          if (append) {
            setPosts((prev) => [...prev, ...json.data.posts]);
          } else {
            setPosts(json.data.posts);
          }
          setTotalPages(json.data.totalPages);
          if (json.data.categories) {
            setCategories(json.data.categories);
          }
        }
      } catch {
        // silently fail
      } finally {
        setLoading(false);
      }
    },
    [siteSubdomain, postsPerPage]
  );

  useEffect(() => {
    if (siteSubdomain || siteId) {
      setPage(1);
      fetchPosts(1, selectedCategory, false);
    }
  }, [siteSubdomain, siteId, selectedCategory, fetchPosts]);

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchPosts(nextPage, selectedCategory, true);
  };

  const handleCategoryChange = (cat: string) => {
    setSelectedCategory(cat);
    setPage(1);
  };

  /* ── Placeholder when no data source available ─────── */
  if (!siteSubdomain && !siteId) {
    const placeholderCount = postsPerPage > 6 ? 6 : postsPerPage;
    return (
      <section
        style={{
          background: "transparent",
          padding: "96px 24px",
          fontFamily: global.fonts.body,
        }}
        id="blog"
      >
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <SectionTitle
            title={data.title}
            subtitle={data.subtitle}
            headingFont={global.fonts.heading}
            bodyFont={global.fonts.body}
            titleColor={global.colors.text}
            subtitleColor={global.colors.textLight}
            accentColor={global.colors.accent}
          />
          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                data.layout === "list" ? "1fr" : "repeat(3, 1fr)",
              gap: 28,
            }}
          >
            {Array.from({ length: placeholderCount }).map((_, i) => (
              <div
                key={i}
                style={{
                  background: global.colors.surface,
                  borderRadius: 16,
                  overflow: "hidden",
                  display: "flex",
                  flexDirection: data.layout === "list" ? "row" : "column",
                }}
              >
                <div
                  style={{
                    background: `${global.colors.textLight}22`,
                    width: data.layout === "list" ? 280 : "100%",
                    height: data.layout === "list" ? "100%" : 200,
                    minHeight: data.layout === "list" ? 160 : undefined,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <svg
                    style={{
                      width: 32,
                      height: 32,
                      color: `${global.colors.textLight}66`,
                    }}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
                    />
                  </svg>
                </div>
                <div
                  style={{
                    padding: "20px 22px 24px",
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                  }}
                >
                  <div
                    style={{
                      width: 60,
                      height: 8,
                      borderRadius: 4,
                      background: `${global.colors.textLight}30`,
                      marginBottom: 12,
                    }}
                  />
                  <div
                    style={{
                      width: "80%",
                      height: 14,
                      borderRadius: 4,
                      background: `${global.colors.textLight}25`,
                      marginBottom: 10,
                    }}
                  />
                  <div
                    style={{
                      width: "100%",
                      height: 10,
                      borderRadius: 4,
                      background: `${global.colors.textLight}18`,
                      marginBottom: 6,
                    }}
                  />
                  <div
                    style={{
                      width: "60%",
                      height: 10,
                      borderRadius: 4,
                      background: `${global.colors.textLight}18`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
          <p
            style={{
              textAlign: "center",
              color: global.colors.textLight,
              fontSize: 13,
              marginTop: 32,
            }}
          >
            Blog yazilari burada gorunecek
          </p>
        </div>
      </section>
    );
  }

  /* ── Live render ───────────────────────────────────── */

  const formatDate = (d: string | null) => {
    if (!d) return "";
    return new Date(d).toLocaleDateString("tr-TR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <section
      style={{
        background: "transparent",
        padding: "96px 24px",
        fontFamily: global.fonts.body,
      }}
      id="blog"
    >
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <SectionTitle
          title={data.title}
          subtitle={data.subtitle}
          headingFont={global.fonts.heading}
          bodyFont={global.fonts.body}
          titleColor={global.colors.text}
          subtitleColor={global.colors.textLight}
          accentColor={global.colors.accent}
        />

        {/* Category filter tabs */}
        {data.showCategories && categories.length > 0 && (
          <div
            style={{
              display: "flex",
              gap: 8,
              flexWrap: "wrap",
              justifyContent: "center",
              marginBottom: 40,
            }}
          >
            <button
              onClick={() => handleCategoryChange("")}
              style={{
                padding: "6px 16px",
                borderRadius: 999,
                border: "none",
                fontSize: 13,
                fontWeight: 500,
                cursor: "pointer",
                fontFamily: global.fonts.body,
                transition: "all 0.2s",
                background:
                  selectedCategory === ""
                    ? global.colors.primary
                    : global.colors.surface,
                color:
                  selectedCategory === "" ? "#ffffff" : global.colors.text,
              }}
            >
              Tumu
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => handleCategoryChange(cat)}
                style={{
                  padding: "6px 16px",
                  borderRadius: 999,
                  border: "none",
                  fontSize: 13,
                  fontWeight: 500,
                  cursor: "pointer",
                  fontFamily: global.fonts.body,
                  transition: "all 0.2s",
                  background:
                    selectedCategory === cat
                      ? global.colors.primary
                      : global.colors.surface,
                  color:
                    selectedCategory === cat
                      ? "#ffffff"
                      : global.colors.text,
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {/* Posts */}
        {posts.length === 0 && !loading ? (
          <p style={{ textAlign: "center", color: global.colors.textLight }}>
            Henuz yazi eklenmedi.
          </p>
        ) : data.layout === "list" ? (
          /* ── List Layout ─────────────────────────────────────── */
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 32,
            }}
          >
            {posts.map((post) => (
              <div
                key={post.id}
                className="sf-blog-list-row"
                style={{
                  display: "grid",
                  gridTemplateColumns: post.coverImage
                    ? "280px 1fr"
                    : "1fr",
                  gap: 32,
                  background: global.colors.surface,
                  borderRadius: 16,
                  overflow: "hidden",
                  transition: "transform 0.2s, box-shadow 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-3px)";
                  e.currentTarget.style.boxShadow =
                    "0 12px 40px rgba(0,0,0,0.1)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                {/* Image */}
                {post.coverImage && (
                  <div style={{ overflow: "hidden" }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      loading="lazy"
                      src={post.coverImage}
                      alt={post.title}
                      style={{
                        width: "100%",
                        height: "100%",
                        minHeight: 200,
                        objectFit: "cover",
                        display: "block",
                        transition: "transform 0.4s",
                      }}
                    />
                  </div>
                )}

                {/* Content */}
                <div
                  style={{
                    padding: post.coverImage
                      ? "28px 28px 28px 0"
                      : "28px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      marginBottom: 12,
                    }}
                  >
                    {post.category && (
                      <span
                        style={{
                          fontSize: 11,
                          fontWeight: 700,
                          letterSpacing: "0.08em",
                          textTransform: "uppercase",
                          color: global.colors.accent,
                          background: `${global.colors.accent}18`,
                          padding: "3px 10px",
                          borderRadius: 999,
                        }}
                      >
                        {post.category}
                      </span>
                    )}
                    <span
                      style={{
                        fontSize: 12,
                        color: global.colors.textLight,
                      }}
                    >
                      {formatDate(post.publishedAt || post.createdAt)}
                    </span>
                  </div>

                  <h3
                    style={{
                      fontFamily: global.fonts.heading,
                      fontWeight: 700,
                      fontSize: "clamp(1.1rem, 1.5vw, 1.3rem)",
                      color: global.colors.text,
                      margin: "0 0 10px",
                      lineHeight: 1.3,
                    }}
                  >
                    {post.title}
                  </h3>

                  <p
                    style={{
                      color: global.colors.textLight,
                      fontSize: 14,
                      lineHeight: 1.7,
                      margin: "0 0 16px",
                      flex: 1,
                    }}
                  >
                    {post.excerpt}
                  </p>

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <span
                      style={{
                        fontSize: 13,
                        color: global.colors.textLight,
                      }}
                    >
                      {post.author}
                      {post.readTime ? ` · ${post.readTime}` : ""}
                    </span>
                    {data.showReadMore && (
                      <a
                        href={blogPostHref(basePath, post.slug, siteSubdomain, siteId)}
                        style={{
                          fontSize: 13,
                          fontWeight: 600,
                          color: global.colors.primary,
                          textDecoration: "none",
                          display: "flex",
                          alignItems: "center",
                          gap: 4,
                        }}
                      >
                        Devamini Oku
                        <svg
                          style={{ width: 14, height: 14 }}
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* ── Grid Layout ─────────────────────────────────────── */
          <div
            className="sf-blog-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 28,
            }}
          >
            {posts.map((post) => (
              <div
                key={post.id}
                style={{
                  background: global.colors.surface,
                  borderRadius: 16,
                  overflow: "hidden",
                  display: "flex",
                  flexDirection: "column",
                  transition: "transform 0.2s, box-shadow 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-4px)";
                  e.currentTarget.style.boxShadow =
                    "0 16px 48px rgba(0,0,0,0.12)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                {/* Image */}
                {post.coverImage ? (
                  <div style={{ overflow: "hidden", flexShrink: 0 }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      loading="lazy"
                      src={post.coverImage}
                      alt={post.title}
                      style={{
                        width: "100%",
                        height: 220,
                        objectFit: "cover",
                        display: "block",
                        transition: "transform 0.4s",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = "scale(1.05)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = "scale(1)";
                      }}
                    />
                  </div>
                ) : (
                  <div
                    style={{
                      height: 220,
                      background: `${global.colors.textLight}15`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <svg
                      style={{
                        width: 28,
                        height: 28,
                        color: `${global.colors.textLight}55`,
                      }}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={1.5}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z"
                      />
                    </svg>
                  </div>
                )}

                {/* Content */}
                <div
                  style={{
                    padding: "20px 22px 24px",
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      marginBottom: 10,
                    }}
                  >
                    {post.category && (
                      <span
                        style={{
                          fontSize: 10,
                          fontWeight: 700,
                          letterSpacing: "0.08em",
                          textTransform: "uppercase",
                          color: global.colors.accent,
                        }}
                      >
                        {post.category}
                      </span>
                    )}
                    <span
                      style={{
                        fontSize: 11,
                        color: global.colors.textLight,
                      }}
                    >
                      {formatDate(post.publishedAt || post.createdAt)}
                    </span>
                  </div>

                  <h3
                    style={{
                      fontFamily: global.fonts.heading,
                      fontWeight: 700,
                      fontSize: 17,
                      color: global.colors.text,
                      margin: "0 0 8px",
                      lineHeight: 1.3,
                    }}
                  >
                    {post.title}
                  </h3>

                  <p
                    style={{
                      color: global.colors.textLight,
                      fontSize: 13,
                      lineHeight: 1.65,
                      margin: "0 0 16px",
                      flex: 1,
                    }}
                  >
                    {post.excerpt}
                  </p>

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      marginTop: "auto",
                    }}
                  >
                    <span
                      style={{
                        fontSize: 12,
                        color: global.colors.textLight,
                      }}
                    >
                      {post.author}
                      {post.readTime ? ` · ${post.readTime}` : ""}
                    </span>
                    {data.showReadMore && (
                      <a
                        href={blogPostHref(basePath, post.slug, siteSubdomain, siteId)}
                        style={{
                          fontSize: 12,
                          fontWeight: 600,
                          color: global.colors.primary,
                          textDecoration: "none",
                        }}
                      >
                        Devamini Oku
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Load more */}
        {page < totalPages && (
          <div style={{ textAlign: "center", marginTop: 40 }}>
            <button
              onClick={handleLoadMore}
              disabled={loading}
              style={{
                padding: "12px 32px",
                background: "transparent",
                border: `2px solid ${global.colors.primary}`,
                borderRadius: 8,
                color: global.colors.primary,
                fontSize: 14,
                fontWeight: 600,
                fontFamily: global.fonts.body,
                cursor: loading ? "not-allowed" : "pointer",
                opacity: loading ? 0.6 : 1,
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => {
                if (!loading) {
                  e.currentTarget.style.background = global.colors.primary;
                  e.currentTarget.style.color = "#ffffff";
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.color = global.colors.primary;
              }}
            >
              {loading ? "Yukleniyor..." : "Daha Fazla Yukle"}
            </button>
          </div>
        )}
      </div>
    </section>
  );
});
