"use client";

import { useEffect, useCallback } from "react";
import { useEditorStore, StoredSite } from "@/stores/editor-store";
import { useToastStore } from "@/stores/toast-store";
import { SiteConfig } from "@/types/template";
import { SectionPanel } from "./SectionPanel";
import { EditPanel } from "./EditPanel";
import { PreviewPanel } from "./PreviewPanel";
import { EditorTopbar } from "./EditorTopbar";

interface EditorShellProps {
  site: StoredSite;
  initialConfig: SiteConfig;
}

export function EditorShell({ site, initialConfig }: EditorShellProps) {
  const { config, setSite, setConfig, isDirty, isSaving, saveConfig, undo, redo } = useEditorStore();
  const { addToast } = useToastStore();

  // Load site and config into store on mount
  useEffect(() => {
    setSite(site);
    setConfig(initialConfig);
  }, [site, initialConfig, setSite, setConfig]);

  // Warn on unsaved changes
  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [isDirty]);

  const handleSave = useCallback(async () => {
    await saveConfig();
    addToast("Degisiklikler kaydedildi.", "success");
  }, [saveConfig, addToast]);

  // Ctrl+S shortcut + Undo/Redo
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "s") {
        e.preventDefault();
        handleSave();
      }
      // Undo/Redo — skip when focused on input/textarea
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === "Z") {
        e.preventDefault();
        redo();
      } else if ((e.ctrlKey || e.metaKey) && e.key === "z") {
        e.preventDefault();
        undo();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [handleSave, undo, redo]);

  // Wait for store to be hydrated before rendering child components
  if (!config) {
    return (
      <div className="-m-6 flex items-center justify-center bg-zinc-50" style={{ height: "calc(100vh - 4rem)" }}>
        <div className="text-sm text-zinc-400">Yukleniyor...</div>
      </div>
    );
  }

  return (
    // -m-6 negates the dashboard layout's p-6 so the editor fills the viewport
    <div className="-m-6 flex flex-col bg-zinc-50" style={{ height: "calc(100vh - 4rem)" }}>
      <EditorTopbar
        isDirty={isDirty}
        isSaving={isSaving}
        onSave={handleSave}
      />
      <div className="flex flex-1 overflow-hidden">
        <SectionPanel />
        <EditPanel />
        <PreviewPanel subdomain={site.subdomain} />
      </div>
    </div>
  );
}
