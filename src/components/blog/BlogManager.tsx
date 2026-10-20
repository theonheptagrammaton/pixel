"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useToastStore } from "@/stores/toast-store";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  category: string;
  isPublished: boolean;
  createdAt: string;
}

interface BlogManagerProps {
  siteId: string;
}

export function BlogManager({ siteId }: BlogManagerProps) {
  const router = useRouter();
  const addToast = useToastStore((s) => s.addToast);

  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/sites/${siteId}/blog?page=${page}&limit=10`);
      const json = await res.json();
      if (json.success) {
        setPosts(json.data.posts);
        setTotalPages(json.data.totalPages);
        setTotal(json.data.total);
      } else {
        addToast(json.error || "Yazilar yuklenemedi.", "error");
      }
    } catch {
      addToast("Yazilar yuklenirken hata olustu.", "error");
    } finally {
      setLoading(false);
    }
  }, [siteId, page, addToast]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  async function handleDelete(postId: string, title: string) {
    const confirmed = window.confirm(
      `"${title}" yazisini silmek istediginize emin misiniz? Bu islem geri alinamaz.`
    );
    if (!confirmed) return;

    setDeleting(postId);
    try {
      const res = await fetch(`/api/sites/${siteId}/blog/${postId}`, {
        method: "DELETE",
      });
      const json = await res.json();
      if (json.success) {
        addToast("Yazi basariyla silindi.", "success");
        fetchPosts();
      } else {
        addToast(json.error || "Yazi silinemedi.", "error");
      }
    } catch {
      addToast("Yazi silinirken hata olustu.", "error");
    } finally {
      setDeleting(null);
    }
  }

  function formatDate(dateStr: string): string {
    const d = new Date(dateStr);
    return d.toLocaleDateString("tr-TR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  }

  function truncate(text: string, max: number): string {
    if (text.length <= max) return text;
    return text.slice(0, max) + "...";
  }

  // Empty state
  if (!loading && posts.length === 0 && page === 1) {
    return (
      <div className="bg-white border border-zinc-200 rounded-lg p-12 text-center">
        <div className="mx-auto mb-4">
          <svg
            className="h-12 w-12 text-zinc-300 mx-auto"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
            />
          </svg>
        </div>
        <p className="text-zinc-500 text-sm mb-4">Henuz blog yazisi yok.</p>
        <Link
          href="/blog/new"
          className="inline-flex items-center gap-2 px-4 py-2 bg-black text-white text-sm font-medium rounded-lg hover:bg-zinc-800 transition-colors"
        >
          Ilk Yazinizi Olusturun
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-zinc-900">Blog Yazilari</h2>
          <p className="text-sm text-zinc-500 mt-0.5">
            Toplam {total} yazi
          </p>
        </div>
        <Link
          href="/blog/new"
          className="inline-flex items-center gap-2 px-4 py-2 bg-black text-white text-sm font-medium rounded-lg hover:bg-zinc-800 transition-colors"
        >
          <svg
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Yeni Yazi
        </Link>
      </div>

      {/* Table */}
      <div className="bg-white border border-zinc-200 rounded-lg overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <svg
              className="h-6 w-6 text-zinc-400 animate-spin"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8H4z"
              />
            </svg>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-200 bg-zinc-50">
                <th className="text-left px-4 py-3 font-medium text-zinc-600">
                  Baslik
                </th>
                <th className="text-left px-4 py-3 font-medium text-zinc-600 hidden sm:table-cell">
                  Kategori
                </th>
                <th className="text-left px-4 py-3 font-medium text-zinc-600">
                  Durum
                </th>
                <th className="text-left px-4 py-3 font-medium text-zinc-600 hidden md:table-cell">
                  Tarih
                </th>
                <th className="text-right px-4 py-3 font-medium text-zinc-600">
                  Islemler
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {posts.map((post) => (
                <tr
                  key={post.id}
                  className="hover:bg-zinc-50 transition-colors cursor-pointer"
                  onClick={() => router.push(`/blog/${post.id}`)}
                >
                  <td className="px-4 py-3 text-zinc-900 font-medium">
                    {truncate(post.title, 50)}
                  </td>
                  <td className="px-4 py-3 hidden sm:table-cell">
                    {post.category ? (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-zinc-100 text-zinc-700 border border-zinc-200">
                        {post.category}
                      </span>
                    ) : (
                      <span className="text-zinc-400 text-xs">--</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {post.isPublished ? (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-zinc-900 text-white">
                        Yayinda
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-zinc-100 text-zinc-500 border border-zinc-200">
                        Taslak
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-zinc-500 hidden md:table-cell">
                    {formatDate(post.createdAt)}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(post.id, post.title);
                      }}
                      disabled={deleting === post.id}
                      className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 rounded transition-colors disabled:opacity-50"
                    >
                      {deleting === post.id ? (
                        <svg
                          className="h-3.5 w-3.5 animate-spin"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8v8H4z"
                          />
                        </svg>
                      ) : (
                        <svg
                          className="h-3.5 w-3.5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={1.75}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      )}
                      Sil
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-zinc-200 bg-zinc-50">
            <p className="text-xs text-zinc-500">
              Sayfa {page} / {totalPages}
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="px-3 py-1.5 text-xs font-medium text-zinc-600 bg-white border border-zinc-200 rounded hover:bg-zinc-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Onceki
              </button>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
                className="px-3 py-1.5 text-xs font-medium text-zinc-600 bg-white border border-zinc-200 rounded hover:bg-zinc-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Sonraki
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
