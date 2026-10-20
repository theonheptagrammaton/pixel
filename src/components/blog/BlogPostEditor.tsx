"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useToastStore } from "@/stores/toast-store";
import { ImageUpload } from "@/components/ui/ImageUpload";

interface BlogPostEditorProps {
  siteId: string;
  mode: "create" | "edit";
  post?: {
    id: string;
    title: string;
    slug: string;
    content: string;
    excerpt: string;
    coverImage: string;
    category: string;
    author: string;
    readTime: string;
    isPublished: boolean;
  };
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/ğ/g, "g")
    .replace(/ü/g, "u")
    .replace(/ş/g, "s")
    .replace(/ı/g, "i")
    .replace(/ö/g, "o")
    .replace(/ç/g, "c")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function BlogPostEditor({ siteId, mode, post }: BlogPostEditorProps) {
  const router = useRouter();
  const addToast = useToastStore((s) => s.addToast);
  const contentRef = useRef<HTMLTextAreaElement>(null);

  const [title, setTitle] = useState(post?.title || "");
  const [slug, setSlug] = useState(post?.slug || "");
  const [content, setContent] = useState(post?.content || "");
  const [excerpt, setExcerpt] = useState(post?.excerpt || "");
  const [coverImage, setCoverImage] = useState(post?.coverImage || "");
  const [category, setCategory] = useState(post?.category || "");
  const [author, setAuthor] = useState(post?.author || "");
  const [readTime, setReadTime] = useState(post?.readTime || "");
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);
  const [saving, setSaving] = useState<"draft" | "publish" | null>(null);

  function handleTitleChange(val: string) {
    setTitle(val);
    if (!slugManuallyEdited) {
      setSlug(slugify(val));
    }
  }

  function handleSlugChange(val: string) {
    setSlugManuallyEdited(true);
    setSlug(slugify(val));
  }

  function wrapSelection(before: string, after: string) {
    const textarea = contentRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = content.substring(start, end);
    const replacement = before + selected + after;

    const newContent =
      content.substring(0, start) + replacement + content.substring(end);
    setContent(newContent);

    // Restore focus and selection after state update
    requestAnimationFrame(() => {
      textarea.focus();
      textarea.setSelectionRange(
        start + before.length,
        start + before.length + selected.length
      );
    });
  }

  function insertAtCursor(text: string) {
    const textarea = contentRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const newContent =
      content.substring(0, start) + text + content.substring(start);
    setContent(newContent);

    requestAnimationFrame(() => {
      textarea.focus();
      const pos = start + text.length;
      textarea.setSelectionRange(pos, pos);
    });
  }

  const toolbarButtons = [
    {
      label: "B",
      title: "Kalin",
      className: "font-bold",
      action: () => wrapSelection("<strong>", "</strong>"),
    },
    {
      label: "I",
      title: "Italik",
      className: "italic",
      action: () => wrapSelection("<em>", "</em>"),
    },
    {
      label: "H2",
      title: "Baslik 2",
      className: "text-xs font-semibold",
      action: () => wrapSelection("<h2>", "</h2>"),
    },
    {
      label: "H3",
      title: "Baslik 3",
      className: "text-xs font-semibold",
      action: () => wrapSelection("<h3>", "</h3>"),
    },
    {
      label: "Link",
      title: "Baglanti",
      className: "text-xs underline",
      action: () => {
        const textarea = contentRef.current;
        if (!textarea) return;
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const selected = content.substring(start, end);
        if (selected) {
          wrapSelection('<a href="URL">', "</a>");
        } else {
          insertAtCursor('<a href="URL">Baglanti metni</a>');
        }
      },
    },
    {
      label: "UL",
      title: "Sirasiz Liste",
      className: "text-xs",
      action: () => {
        const textarea = contentRef.current;
        if (!textarea) return;
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const selected = content.substring(start, end);
        if (selected) {
          const items = selected
            .split("\n")
            .filter((l) => l.trim())
            .map((l) => `  <li>${l.trim()}</li>`)
            .join("\n");
          const replacement = `<ul>\n${items}\n</ul>`;
          const newContent =
            content.substring(0, start) + replacement + content.substring(end);
          setContent(newContent);
        } else {
          insertAtCursor("<ul>\n  <li></li>\n</ul>");
        }
      },
    },
  ];

  async function handleSave(publish: boolean) {
    if (!title.trim()) {
      addToast("Baslik zorunludur.", "error");
      return;
    }

    const saveType = publish ? "publish" : "draft";
    setSaving(saveType);

    const payload = {
      title: title.trim(),
      slug: slug || slugify(title),
      content,
      excerpt,
      coverImage,
      category,
      author,
      readTime,
      isPublished: publish,
    };

    try {
      let res: Response;
      if (mode === "create") {
        res = await fetch(`/api/sites/${siteId}/blog`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch(`/api/sites/${siteId}/blog/${post!.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }

      const json = await res.json();
      if (json.success) {
        addToast(
          publish ? "Yazi yayinlandi." : "Taslak kaydedildi.",
          "success"
        );
        router.push("/blog");
      } else {
        addToast(json.error || "Kaydedilemedi.", "error");
      }
    } catch {
      addToast("Kaydedilirken hata olustu.", "error");
    } finally {
      setSaving(null);
    }
  }

  const inputCls =
    "w-full px-3 py-2 text-sm border border-zinc-200 rounded-lg bg-white text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-1 focus:ring-zinc-900 focus:border-zinc-900 transition-colors";
  const labelCls = "block text-xs font-medium text-zinc-700 mb-1";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-zinc-900">
          {mode === "create" ? "Yeni Yazi" : "Yaziyi Duzenle"}
        </h2>
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleSave(false)}
            disabled={saving !== null}
            className="px-4 py-2 text-sm font-medium text-zinc-700 bg-zinc-100 border border-zinc-200 rounded-lg hover:bg-zinc-200 transition-colors disabled:opacity-50"
          >
            {saving === "draft" ? (
              <span className="flex items-center gap-2">
                <svg
                  className="h-4 w-4 animate-spin"
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
                Kaydediliyor...
              </span>
            ) : (
              "Taslak Kaydet"
            )}
          </button>
          <button
            onClick={() => handleSave(true)}
            disabled={saving !== null}
            className="px-4 py-2 text-sm font-medium text-white bg-black rounded-lg hover:bg-zinc-800 transition-colors disabled:opacity-50"
          >
            {saving === "publish" ? (
              <span className="flex items-center gap-2">
                <svg
                  className="h-4 w-4 animate-spin"
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
                Yayinlaniyor...
              </span>
            ) : (
              "Yayinla"
            )}
          </button>
        </div>
      </div>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-10 gap-6">
        {/* Left column: Title + Content Editor (70%) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Title */}
          <div className="bg-white border border-zinc-200 rounded-lg p-4">
            <label className={labelCls}>Baslik</label>
            <input
              type="text"
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="Yazi basligini girin..."
              className={inputCls}
            />
            <div className="mt-2">
              <label className="block text-xs text-zinc-400 mb-1">Slug</label>
              <input
                type="text"
                value={slug}
                onChange={(e) => handleSlugChange(e.target.value)}
                placeholder="yazi-slug"
                className="w-full px-3 py-1.5 text-xs border border-zinc-200 rounded bg-zinc-50 text-zinc-600 placeholder-zinc-400 focus:outline-none focus:ring-1 focus:ring-zinc-900 focus:border-zinc-900 transition-colors"
              />
            </div>
          </div>

          {/* Content Editor */}
          <div className="bg-white border border-zinc-200 rounded-lg overflow-hidden">
            <label className="block text-xs font-medium text-zinc-700 px-4 pt-4 pb-2">
              Icerik
            </label>
            {/* Toolbar */}
            <div className="flex items-center gap-1 px-4 pb-2 border-b border-zinc-200">
              {toolbarButtons.map((btn) => (
                <button
                  key={btn.label}
                  type="button"
                  title={btn.title}
                  onClick={btn.action}
                  className={`px-2.5 py-1.5 text-sm border border-zinc-200 rounded hover:bg-zinc-100 text-zinc-700 transition-colors ${btn.className}`}
                >
                  {btn.label}
                </button>
              ))}
            </div>
            {/* Textarea */}
            <textarea
              ref={contentRef}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Yazi icerigini HTML olarak yazin..."
              rows={20}
              className="w-full px-4 py-3 text-sm text-zinc-900 placeholder-zinc-400 resize-y focus:outline-none font-mono leading-relaxed"
            />
          </div>
        </div>

        {/* Right column: Meta fields (30%) */}
        <div className="lg:col-span-3 space-y-4">
          {/* Cover Image */}
          <div className="bg-white border border-zinc-200 rounded-lg p-4">
            <ImageUpload
              value={coverImage}
              onChange={setCoverImage}
              label="Kapak Gorseli"
              hint="Onerilen: 1200x630px"
            />
          </div>

          {/* Excerpt */}
          <div className="bg-white border border-zinc-200 rounded-lg p-4">
            <label className={labelCls}>Ozet</label>
            <textarea
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              placeholder="Kisa ozet yazin..."
              rows={3}
              className={`${inputCls} resize-none`}
            />
          </div>

          {/* Category */}
          <div className="bg-white border border-zinc-200 rounded-lg p-4">
            <label className={labelCls}>Kategori</label>
            <input
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="orn. Teknoloji"
              className={inputCls}
            />
          </div>

          {/* Author */}
          <div className="bg-white border border-zinc-200 rounded-lg p-4">
            <label className={labelCls}>Yazar</label>
            <input
              type="text"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder="Yazar adi"
              className={inputCls}
            />
          </div>

          {/* Read Time */}
          <div className="bg-white border border-zinc-200 rounded-lg p-4">
            <label className={labelCls}>Okuma Suresi</label>
            <input
              type="text"
              value={readTime}
              onChange={(e) => setReadTime(e.target.value)}
              placeholder="orn. 5 dk"
              className={inputCls}
            />
          </div>

          {/* Status info for edit mode */}
          {mode === "edit" && post && (
            <div className="bg-white border border-zinc-200 rounded-lg p-4">
              <label className={labelCls}>Mevcut Durum</label>
              <div className="mt-1">
                {post.isPublished ? (
                  <span className="inline-flex items-center px-2.5 py-1 rounded text-xs font-medium bg-zinc-900 text-white">
                    Yayinda
                  </span>
                ) : (
                  <span className="inline-flex items-center px-2.5 py-1 rounded text-xs font-medium bg-zinc-100 text-zinc-500 border border-zinc-200">
                    Taslak
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
