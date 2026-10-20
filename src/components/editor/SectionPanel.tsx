"use client";

import { useState } from "react";
import { useEditorStore } from "@/stores/editor-store";
import { SectionType } from "@/types/template";
import { getSectionLabel, SECTION_ICON_PATHS } from "@/lib/section-icons";

function SectionIcon({ type }: { type: SectionType }) {
  const path = SECTION_ICON_PATHS[type];
  return (
    <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
      <path strokeLinecap="round" strokeLinejoin="round" d={path} />
    </svg>
  );
}

const CONTENT_SECTIONS: SectionType[] = [
  "hero", "about", "services", "gallery", "menu",
  "testimonials", "team", "pricing", "contact", "faq", "cta", "stats", "blog",
  "partners", "video",
];

export function SectionPanel() {
  const {
    config,
    currentPageId,
    selectedSectionId,
    editingLayout,
    showGlobalSettings,
    setCurrentPage,
    addPage,
    removePage,
    renamePage,
    selectSection,
    setEditingLayout,
    setShowGlobalSettings,
    toggleSectionVisibility,
    addSection,
    removeSection,
    reorderSections,
  } = useEditorStore();

  const [addSectionOpen, setAddSectionOpen] = useState(false);
  const [addPageOpen, setAddPageOpen] = useState(false);
  const [newPageName, setNewPageName] = useState("");
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [dropIndex, setDropIndex] = useState<number | null>(null);
  const [confirmDeleteSectionId, setConfirmDeleteSectionId] = useState<string | null>(null);
  const [confirmDeletePageId, setConfirmDeletePageId] = useState<string | null>(null);
  const [renamingPageId, setRenamingPageId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState("");

  if (!config) return null;

  const pages = [...config.pages].sort((a, b) => a.order - b.order);
  const currentPage = pages.find((p) => p.id === currentPageId) ?? pages[0];
  const sections = currentPage
    ? [...currentPage.sections].sort((a, b) => a.order - b.order)
    : [];
  const existingTypes = new Set(sections.map((s) => s.type));

  function slugify(name: string) {
    return name
      .toLowerCase()
      .replace(/ğ/g, "g").replace(/ü/g, "u").replace(/ş/g, "s")
      .replace(/ı/g, "i").replace(/ö/g, "o").replace(/ç/g, "c")
      .replace(/[^a-z0-9]/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "");
  }

  function handleAddPage() {
    const trimmed = newPageName.trim();
    if (!trimmed) return;
    const slug = slugify(trimmed);
    addPage(trimmed, slug);
    setNewPageName("");
    setAddPageOpen(false);
  }

  function handleRenameConfirm(pageId: string) {
    const trimmed = renameValue.trim();
    if (trimmed) renamePage(pageId, trimmed);
    setRenamingPageId(null);
  }

  return (
    <aside className="w-[270px] shrink-0 bg-zinc-900 border-r border-zinc-800 flex flex-col overflow-hidden">

      {/* ── Pages bar ────────────────────────────────────────── */}
      <div className="shrink-0 border-b border-zinc-800">
        <div className="flex items-center justify-between px-4 py-2.5">
          <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Sayfalar</span>
          <button
            onClick={() => setAddPageOpen((v) => !v)}
            className="text-zinc-400 hover:text-zinc-200 transition-colors"
            title="Sayfa ekle"
          >
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
          </button>
        </div>

        {/* Page tabs */}
        <div className="px-2 pb-2 flex flex-wrap gap-1">
          {pages.map((page) => (
            <div key={page.id} className="relative group/page">
              {renamingPageId === page.id ? (
                <input
                  autoFocus
                  value={renameValue}
                  onChange={(e) => setRenameValue(e.target.value)}
                  onBlur={() => handleRenameConfirm(page.id)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleRenameConfirm(page.id);
                    if (e.key === "Escape") setRenamingPageId(null);
                  }}
                  className="w-24 px-2 py-1 text-xs bg-zinc-700 text-white rounded border border-zinc-500 outline-none"
                />
              ) : (
                <button
                  onClick={() => setCurrentPage(page.id)}
                  onDoubleClick={() => {
                    setRenamingPageId(page.id);
                    setRenameValue(page.name);
                  }}
                  className={`px-2.5 py-1 text-xs rounded font-medium transition-colors ${
                    page.id === currentPage?.id
                      ? "bg-white text-zinc-900"
                      : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-zinc-200"
                  }`}
                  title="Cift tikla ismini degistir"
                >
                  {page.name}
                  {pages.length > 1 && (
                    <span
                      role="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setConfirmDeletePageId(page.id);
                      }}
                      className="ml-1.5 opacity-0 group-hover/page:opacity-100 text-zinc-500 hover:text-red-400 transition-all"
                    >
                      x
                    </span>
                  )}
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Add page input */}
        {addPageOpen && (
          <div className="px-3 pb-3 flex gap-2">
            <input
              autoFocus
              placeholder="Sayfa adi (ör: Hakkimizda)"
              value={newPageName}
              onChange={(e) => setNewPageName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleAddPage();
                if (e.key === "Escape") { setAddPageOpen(false); setNewPageName(""); }
              }}
              className="flex-1 px-2.5 py-1.5 text-xs bg-zinc-800 text-zinc-200 rounded border border-zinc-700 placeholder-zinc-600 outline-none focus:border-zinc-500"
            />
            <button
              onClick={handleAddPage}
              className="px-2.5 py-1.5 text-xs bg-white text-zinc-900 rounded font-medium hover:bg-zinc-100 transition-colors"
            >
              Ekle
            </button>
          </div>
        )}
      </div>

      {/* ── Global header ─────────────────────────────────────── */}
      <div className="shrink-0 px-2 pt-2">
        <button
          onClick={() => setEditingLayout(editingLayout === "header" ? null : "header")}
          className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-md text-xs font-medium transition-colors ${
            editingLayout === "header"
              ? "bg-amber-500 text-white"
              : "text-zinc-500 hover:bg-zinc-800 hover:text-zinc-300"
          }`}
        >
          <svg className="h-3.5 w-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 10h16M4 14h8" />
          </svg>
          Ust Menu
          <span className="ml-auto text-xs opacity-50 font-normal">Tüm sayfalar</span>
        </button>
      </div>

      {/* ── Section list header ────────────────────────────────── */}
      <div className="flex items-center justify-between px-4 py-2 mt-1 shrink-0">
        <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Bolumler</span>
        <button
          onClick={() => setAddSectionOpen((v) => !v)}
          className="text-zinc-500 hover:text-zinc-300 transition-colors"
          title="Bolum ekle"
        >
          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
        </button>
      </div>

      {/* Add section dropdown */}
      {addSectionOpen && (
        <div className="shrink-0 border-b border-zinc-800 bg-zinc-800/50 px-3 py-2">
          <p className="text-xs text-zinc-500 mb-1.5 px-1">Bolum Sec</p>
          <div className="space-y-0.5 max-h-44 overflow-y-auto">
            {CONTENT_SECTIONS.filter((t) => !existingTypes.has(t)).map((type) => (
              <button
                key={type}
                onClick={() => { addSection(type); setAddSectionOpen(false); }}
                className="w-full flex items-center gap-2.5 px-2 py-1.5 text-xs text-zinc-300 hover:bg-zinc-700 hover:text-white rounded transition-colors text-left"
              >
                <SectionIcon type={type} />
                {getSectionLabel(type)}
              </button>
            ))}
            {CONTENT_SECTIONS.filter((t) => !existingTypes.has(t)).length === 0 && (
              <p className="text-xs text-zinc-600 px-2 py-1">Tüm bolumler eklendi.</p>
            )}
          </div>
        </div>
      )}

      {/* Section list */}
      <div className="flex-1 overflow-y-auto py-1">
        {sections.length === 0 ? (
          <div className="px-4 py-6 text-center text-xs text-zinc-600">
            Bu sayfada bolum yok.
            <br />
            Yukaridan ekleyin.
          </div>
        ) : (
          <ul className="px-2 space-y-0.5">
            {sections.map((section, index) => {
              const isSelected = selectedSectionId === section.id;
              return (
                <li
                  key={section.id}
                  draggable
                  onDragStart={(e) => {
                    setDragIndex(index);
                    e.dataTransfer.effectAllowed = "move";
                  }}
                  onDragOver={(e) => {
                    e.preventDefault();
                    e.dataTransfer.dropEffect = "move";
                    setDropIndex(index);
                  }}
                  onDragLeave={() => {
                    setDropIndex((prev) => (prev === index ? null : prev));
                  }}
                  onDrop={(e) => {
                    e.preventDefault();
                    if (dragIndex !== null && dragIndex !== index) {
                      reorderSections(dragIndex, index);
                    }
                    setDragIndex(null);
                    setDropIndex(null);
                  }}
                  onDragEnd={() => {
                    setDragIndex(null);
                    setDropIndex(null);
                  }}
                  style={{ opacity: dragIndex === index ? 0.4 : 1 }}
                  className="relative"
                >
                  {/* Drop indicator line */}
                  {dropIndex === index && dragIndex !== null && dragIndex !== index && (
                    <div className="absolute top-0 left-0 right-0 h-0.5 bg-blue-500 rounded-full" style={{ zIndex: 10 }} />
                  )}
                  <div className={`group flex items-center gap-1 px-2 py-2 rounded-md transition-colors ${isSelected ? "bg-white" : "hover:bg-zinc-800"}`}>
                    {/* Drag handle */}
                    <div className="shrink-0 cursor-grab active:cursor-grabbing mr-0.5" title="Surukle">
                      <svg className={`h-3.5 w-3.5 ${isSelected ? "text-zinc-400" : "text-zinc-600"}`} viewBox="0 0 16 16" fill="currentColor">
                        <circle cx="5" cy="3" r="1.2" />
                        <circle cx="11" cy="3" r="1.2" />
                        <circle cx="5" cy="8" r="1.2" />
                        <circle cx="11" cy="8" r="1.2" />
                        <circle cx="5" cy="13" r="1.2" />
                        <circle cx="11" cy="13" r="1.2" />
                      </svg>
                    </div>

                    {/* Reorder arrows */}
                    <div className="flex flex-col shrink-0">
                      <button
                        onClick={() => reorderSections(index, index - 1)}
                        disabled={index === 0}
                        className={`disabled:opacity-20 disabled:cursor-not-allowed transition-colors ${isSelected ? "text-zinc-400 hover:text-zinc-700" : "text-zinc-600 hover:text-zinc-300"}`}
                      >
                        <svg className="h-2.5 w-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
                        </svg>
                      </button>
                      <button
                        onClick={() => reorderSections(index, index + 1)}
                        disabled={index === sections.length - 1}
                        className={`disabled:opacity-20 disabled:cursor-not-allowed transition-colors ${isSelected ? "text-zinc-400 hover:text-zinc-700" : "text-zinc-600 hover:text-zinc-300"}`}
                      >
                        <svg className="h-2.5 w-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                    </div>

                    {/* Section button */}
                    <button
                      onClick={() => selectSection(isSelected ? null : section.id)}
                      className={`flex-1 flex items-center gap-2 text-left min-w-0 ${isSelected ? "text-zinc-900" : "text-zinc-300 group-hover:text-white"}`}
                    >
                      <SectionIcon type={section.type} />
                      <span className={`flex-1 text-sm font-medium truncate ${!section.isVisible ? "opacity-40" : ""}`}>
                        {getSectionLabel(section.type)}
                      </span>
                    </button>

                    {/* Visibility */}
                    <button
                      onClick={(e) => { e.stopPropagation(); toggleSectionVisibility(section.id); }}
                      className={`shrink-0 transition-all ${isSelected ? "text-zinc-500 hover:text-zinc-700" : "text-zinc-600 hover:text-zinc-400 opacity-0 group-hover:opacity-100"}`}
                    >
                      {section.isVisible ? (
                        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      ) : (
                        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                        </svg>
                      )}
                    </button>

                    {/* Delete */}
                    <button
                      onClick={(e) => { e.stopPropagation(); setConfirmDeleteSectionId(section.id); }}
                      className={`shrink-0 transition-all ${isSelected ? "text-red-400 hover:text-red-600" : "text-zinc-700 hover:text-red-400 opacity-0 group-hover:opacity-100"}`}
                    >
                      <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {/* ── Global footer ─────────────────────────────────────── */}
      <div className="shrink-0 px-2 pb-1">
        <button
          onClick={() => setEditingLayout(editingLayout === "footer" ? null : "footer")}
          className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-md text-xs font-medium transition-colors ${
            editingLayout === "footer"
              ? "bg-amber-500 text-white"
              : "text-zinc-500 hover:bg-zinc-800 hover:text-zinc-300"
          }`}
        >
          <svg className="h-3.5 w-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 10h16M4 14h16M4 18h8" />
          </svg>
          Alt Bilgi
          <span className="ml-auto text-xs opacity-50 font-normal">Tüm sayfalar</span>
        </button>
      </div>

      {/* ── Global settings ───────────────────────────────────── */}
      <div className="shrink-0 border-t border-zinc-800 p-3">
        <button
          onClick={() => setShowGlobalSettings(!showGlobalSettings)}
          className={`w-full flex items-center gap-2.5 px-3 py-2 text-sm rounded-md transition-colors ${
            showGlobalSettings
              ? "bg-white text-zinc-900"
              : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800"
          }`}
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
          </svg>
          Genel Ayarlar
        </button>
      </div>

      {/* ── Delete section modal ─────────────────────────────── */}
      {confirmDeleteSectionId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60" onClick={() => setConfirmDeleteSectionId(null)}>
          <div className="bg-white rounded-xl shadow-2xl p-6 w-72" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-sm font-semibold text-zinc-900 mb-2">Bolumu Sil</h3>
            <p className="text-xs text-zinc-500 mb-4">Bu bolumu silmek istediginizden emin misiniz?</p>
            <div className="flex gap-2">
              <button onClick={() => setConfirmDeleteSectionId(null)} className="flex-1 px-3 py-2 text-xs font-medium text-zinc-600 bg-zinc-100 rounded-lg hover:bg-zinc-200">Iptal</button>
              <button onClick={() => { removeSection(confirmDeleteSectionId); setConfirmDeleteSectionId(null); }} className="flex-1 px-3 py-2 text-xs font-medium text-white bg-red-500 rounded-lg hover:bg-red-600">Sil</button>
            </div>
          </div>
        </div>
      )}

      {/* ── Delete page modal ────────────────────────────────── */}
      {confirmDeletePageId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60" onClick={() => setConfirmDeletePageId(null)}>
          <div className="bg-white rounded-xl shadow-2xl p-6 w-72" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-sm font-semibold text-zinc-900 mb-2">Sayfayi Sil</h3>
            <p className="text-xs text-zinc-500 mb-4">Bu sayfayi ve tum bolumleri silmek istediginizden emin misiniz?</p>
            <div className="flex gap-2">
              <button onClick={() => setConfirmDeletePageId(null)} className="flex-1 px-3 py-2 text-xs font-medium text-zinc-600 bg-zinc-100 rounded-lg hover:bg-zinc-200">Iptal</button>
              <button onClick={() => { removePage(confirmDeletePageId); setConfirmDeletePageId(null); }} className="flex-1 px-3 py-2 text-xs font-medium text-white bg-red-500 rounded-lg hover:bg-red-600">Sil</button>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}
