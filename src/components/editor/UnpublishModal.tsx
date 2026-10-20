"use client";
import { useState } from "react";
import { StoredSite } from "@/stores/editor-store";

interface UnpublishModalProps {
  site: StoredSite;
  onClose: () => void;
  onSuccess: () => void;
}

export function UnpublishModal({ site, onClose, onSuccess }: UnpublishModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleUnpublish() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/sites/${site.id}/publish`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "unpublish" }),
      });
      const json = await res.json();
      if (!json.success) {
        setError(json.error ?? "İşlem başarısız.");
        return;
      }
      onSuccess();
    } catch {
      setError("Sunucu hatası.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 50,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "rgba(0,0,0,0.5)",
      }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: 12,
          padding: "28px 32px",
          width: "100%",
          maxWidth: 400,
          boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
        }}
      >
        <h2 style={{ fontSize: 18, fontWeight: 700, color: "#111", marginBottom: 12 }}>
          Yayından Kaldır
        </h2>
        <p style={{ fontSize: 14, color: "#555", marginBottom: 20 }}>
          <strong>{site.subdomain}</strong> adresindeki siteniz yayından kaldırılacak.
          Ziyaretçiler siteyi göremez.
        </p>
        {error && <p style={{ fontSize: 13, color: "#dc2626", marginBottom: 12 }}>{error}</p>}
        <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
          <button
            onClick={onClose}
            style={{ background: "#f4f4f5", color: "#333", border: "none", borderRadius: 6, padding: "8px 18px", fontSize: 14, cursor: "pointer" }}
          >
            İptal
          </button>
          <button
            onClick={handleUnpublish}
            disabled={loading}
            style={{
              background: loading ? "#d1d5db" : "#dc2626",
              color: "#fff",
              border: "none",
              borderRadius: 6,
              padding: "8px 18px",
              fontSize: 14,
              fontWeight: 600,
              cursor: loading ? "not-allowed" : "pointer",
            }}
          >
            {loading ? "İşleniyor…" : "Yayından Kaldır"}
          </button>
        </div>
      </div>
    </div>
  );
}
