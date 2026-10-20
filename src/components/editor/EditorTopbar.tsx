"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { PublishModal } from "./PublishModal";
import { UnpublishModal } from "./UnpublishModal";
import { useEditorStore } from "@/stores/editor-store";

interface EditorTopbarProps {
  isDirty: boolean;
  isSaving: boolean;
  onSave: () => void;
}

export function EditorTopbar({ isDirty, isSaving, onSave }: EditorTopbarProps) {
  const { site, config, setSite, undo, redo, canUndo, canRedo } = useEditorStore();
  const [showPublish, setShowPublish] = useState(false);
  const [showUnpublish, setShowUnpublish] = useState(false);

  if (!site || !config) return null;

  const ROOT_DOMAIN = process.env.NEXT_PUBLIC_ROOT_DOMAIN ?? "localhost:3000";
  const customDomain = site.customDomain && site.domainVerified ? site.customDomain : null;
  const subdomainHost = `${site.subdomain}.${ROOT_DOMAIN.split(":")[0]}`;
  const displayDomain = customDomain ?? subdomainHost;
  const siteUrl = `https://${displayDomain}`;

  return (
    <div className="h-12 bg-white border-b border-zinc-200 flex items-center justify-between px-4 shrink-0">
      {/* Left */}
      <div className="flex items-center gap-3">
        <Link
          href="/dashboard"
          className="text-zinc-400 hover:text-zinc-700 transition-colors"
          aria-label="Dashboard'a don"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <div className="h-4 w-px bg-zinc-200" />
        <div className="flex items-center gap-2">
          <img src="/logo.svg" alt="Pixel" className="h-5 w-5" />
          <span className="text-sm font-semibold text-zinc-900">Pixel</span>
        </div>
        <div className="h-4 w-px bg-zinc-200" />
        <span className="text-sm text-zinc-500">{displayDomain}</span>
        {site.isPublished && (
          <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">
            Yayinda
          </span>
        )}
        {isDirty && (
          <span className="text-xs text-zinc-400 bg-zinc-100 px-2 py-0.5 rounded-full">
            Kaydedilmemis
          </span>
        )}
      </div>

      {/* Right */}
      <div className="flex items-center gap-2">
        {/* Undo/Redo */}
        <button
          onClick={undo}
          disabled={!canUndo()}
          className="p-1.5 rounded text-zinc-500 hover:text-zinc-900 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          title="Geri Al (Ctrl+Z)"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h10a5 5 0 015 5v2M3 10l4-4M3 10l4 4" />
          </svg>
        </button>
        <button
          onClick={redo}
          disabled={!canRedo()}
          className="p-1.5 rounded text-zinc-500 hover:text-zinc-900 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          title="Ileri Al (Ctrl+Shift+Z)"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 10H11a5 5 0 00-5 5v2M21 10l-4-4M21 10l-4 4" />
          </svg>
        </button>
        <div className="h-4 w-px bg-zinc-200" />
        {site.isPublished && (
          <a
            href={siteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-zinc-600 hover:text-zinc-900 font-medium hidden sm:inline"
          >
            Goruntule
          </a>
        )}
        <Button
          variant="secondary"
          size="sm"
          onClick={onSave}
          loading={isSaving}
          disabled={!isDirty || isSaving}
        >
          {isSaving ? "Kaydediliyor" : "Kaydet"}
        </Button>
        {site.isPublished ? (
          <Button variant="secondary" size="sm" onClick={() => setShowUnpublish(true)}>
            Yayindan Kaldir
          </Button>
        ) : (
          <Button variant="primary" size="sm" onClick={() => setShowPublish(true)}>
            Yayina Al
          </Button>
        )}
      </div>

      {showPublish && (
        <PublishModal
          site={site}
          config={config}
          onClose={() => setShowPublish(false)}
          onSuccess={() => {
            setSite({ ...site, isPublished: true });
            setShowPublish(false);
          }}
        />
      )}
      {showUnpublish && (
        <UnpublishModal
          site={site}
          onClose={() => setShowUnpublish(false)}
          onSuccess={() => {
            setSite({ ...site, isPublished: false });
            setShowUnpublish(false);
          }}
        />
      )}
    </div>
  );
}
