"use client";

import { useEditorStore } from "@/stores/editor-store";
import { getSectionLabel, SECTION_ICON_PATHS } from "@/lib/section-icons";
import { SectionType, HeaderData, FooterData } from "@/types/template";
import { SectionFormRouter } from "./SectionFormRouter";
import { GlobalSettingsEditor } from "./GlobalSettingsEditor";
import { HeaderEditor } from "./sections/HeaderEditor";
import { FooterEditor } from "./sections/FooterEditor";

function SectionIcon({ type }: { type: SectionType }) {
  const path = SECTION_ICON_PATHS[type];
  return (
    <svg className="h-4 w-4 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
      <path strokeLinecap="round" strokeLinejoin="round" d={path} />
    </svg>
  );
}

export function EditPanel() {
  const {
    config,
    currentPageId,
    selectedSectionId,
    editingLayout,
    showGlobalSettings,
    updateSectionData,
    updateSectionStyle,
    updateLayout,
  } = useEditorStore();

  // Find selected section from current page
  const currentPage = config?.pages.find((p) => p.id === currentPageId);
  const selectedSection = currentPage?.sections.find((s) => s.id === selectedSectionId);

  // Global settings view
  if (showGlobalSettings) {
    return (
      <main className="flex-1 overflow-y-auto bg-white border-r border-zinc-200">
        <GlobalSettingsEditor />
      </main>
    );
  }

  // Header editor
  if (editingLayout === "header" && config && config.global.layout?.header) {
    return (
      <main className="flex-1 overflow-y-auto bg-white border-r border-zinc-200">
        <div className="flex flex-col h-full">
          <div className="flex items-center gap-2.5 px-6 py-4 border-b border-zinc-100 shrink-0">
            <svg className="h-4 w-4 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 10h16M4 14h8" />
            </svg>
            <div>
              <p className="text-sm font-semibold text-zinc-900">Üst Menü</p>
              <p className="text-xs text-zinc-400">Tüm sayfalarda gösterilir</p>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-6">
            <HeaderEditor
              data={config.global.layout.header}
              onChange={(data) => updateLayout({ header: data as Partial<HeaderData> })}
              globalConfig={config.global}
            />
          </div>
        </div>
      </main>
    );
  }

  // Footer editor
  if (editingLayout === "footer" && config && config.global.layout?.footer) {
    return (
      <main className="flex-1 overflow-y-auto bg-white border-r border-zinc-200">
        <div className="flex flex-col h-full">
          <div className="flex items-center gap-2.5 px-6 py-4 border-b border-zinc-100 shrink-0">
            <svg className="h-4 w-4 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 10h16M4 14h16M4 18h8" />
            </svg>
            <div>
              <p className="text-sm font-semibold text-zinc-900">Alt Bilgi</p>
              <p className="text-xs text-zinc-400">Tüm sayfalarda gösterilir</p>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-6">
            <FooterEditor
              data={config.global.layout.footer}
              onChange={(data) => updateLayout({ footer: data as Partial<FooterData> })}
              globalConfig={config.global}
            />
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 overflow-y-auto bg-white border-r border-zinc-200">
      {!selectedSection ? (
        <div className="flex flex-col items-center justify-center h-full text-center px-8">
          <div className="w-12 h-12 rounded-full bg-zinc-100 flex items-center justify-center mb-4">
            <svg className="h-5 w-5 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
          </div>
          <p className="text-sm font-medium text-zinc-600">Sol panelden bir bolum secin</p>
          <p className="mt-1 text-xs text-zinc-400">veya Üst Menü / Alt Bilgi duzenleyin</p>
        </div>
      ) : (
        <div className="flex flex-col h-full">
          <div className="flex items-center gap-2.5 px-6 py-4 border-b border-zinc-100 shrink-0">
            <SectionIcon type={selectedSection.type} />
            <div>
              <p className="text-sm font-semibold text-zinc-900">{getSectionLabel(selectedSection.type)}</p>
              <p className="text-xs text-zinc-400">ID: {selectedSection.id}</p>
            </div>
            <div className="ml-auto">
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                selectedSection.isVisible ? "bg-green-50 text-green-700" : "bg-zinc-100 text-zinc-500"
              }`}>
                {selectedSection.isVisible ? "Görünür" : "Gizli"}
              </span>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-6">
            {config && (
              <SectionFormRouter
                section={selectedSection}
                globalConfig={config.global}
                onUpdate={(data) => updateSectionData(selectedSection.id, data)}
                onStyleUpdate={(style) => updateSectionStyle(selectedSection.id, style)}
              />
            )}
          </div>
        </div>
      )}
    </main>
  );
}
