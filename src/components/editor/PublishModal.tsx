"use client";
import { useState } from "react";
import { Confetti } from "@/components/ui/confetti";
import { SiteConfig } from "@/types";
import { StoredSite } from "@/stores/editor-store";

const ROOT_DOMAIN = process.env.NEXT_PUBLIC_ROOT_DOMAIN ?? "localhost:3000";

interface PublishModalProps {
  site: StoredSite;
  config: SiteConfig;
  onClose: () => void;
  onSuccess: (publishedUrl: string) => void;
}

interface CheckItem {
  label: string;
  ok: boolean;
}

export function PublishModal({ site, config, onClose, onSuccess }: PublishModalProps) {
  const [showConfetti, setShowConfetti] = useState(false);
  const [published, setPublished] = useState(false);
  const [publishedUrl, setPublishedUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const businessName = config?.global?.general?.businessName?.trim() ?? "";
  const seoTitle = config?.global?.seo?.title?.trim() ?? "";
  const visibleSections = (config?.pages ?? []).flatMap((p) => p.sections ?? []).filter((s) => s.isVisible);
  const hasDomain = !!site.customDomain && site.domainVerified;
  const subdomainUrl = `https://${site.subdomain}.${ROOT_DOMAIN.split(":")[0]}`;

  const checks: CheckItem[] = [
    { label: "Isletme adi girildi", ok: businessName.length > 0 },
    { label: "SEO basligi girildi", ok: seoTitle.length > 0 },
    { label: "En az 1 gorunen bolum var", ok: visibleSections.length > 0 },
  ];

  const allOk = checks.every((c) => c.ok);

  async function handlePublish() {
    if (!allOk || loading) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/sites/${site.id}/publish`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "publish" }),
      });
      const json = await res.json();
      if (!json.success) {
        setError(json.error ?? "Yayinlama basarisiz.");
        return;
      }
      const url = json.data?.publishedUrl ?? (hasDomain ? `https://${site.customDomain}` : subdomainUrl);
      setPublishedUrl(url);
      setPublished(true);
      setShowConfetti(true);
      onSuccess(url);
    } catch {
      setError("Sunucu hatasi. Lutfen tekrar deneyin.");
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
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {showConfetti && <Confetti />}
      <div
        style={{
          background: "#fff",
          borderRadius: 12,
          padding: "28px 32px",
          width: "100%",
          maxWidth: 480,
          boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
        }}
      >
        {published ? (
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>🎉</div>
            <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 8, color: "#111" }}>
              Siteniz Yayinda!
            </h2>
            <p style={{ fontSize: 14, color: "#555", marginBottom: 20 }}>
              Siteniz su adreste yayinlandi:
            </p>
            <a
              href={publishedUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-block",
                background: "#f4f4f5",
                borderRadius: 6,
                padding: "8px 16px",
                fontSize: 14,
                fontWeight: 600,
                color: "#6366f1",
                marginBottom: 24,
                wordBreak: "break-all",
                textDecoration: "none",
              }}
            >
              {publishedUrl}
            </a>
            <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
              <a
                href={publishedUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  background: "#6366f1",
                  color: "#fff",
                  border: "none",
                  borderRadius: 6,
                  padding: "8px 18px",
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: "pointer",
                  textDecoration: "none",
                }}
              >
                Siteyi Goruntule
              </a>
              <button
                onClick={onClose}
                style={{
                  background: "#f4f4f5",
                  color: "#333",
                  border: "none",
                  borderRadius: 6,
                  padding: "8px 18px",
                  fontSize: 14,
                  cursor: "pointer",
                }}
              >
                Kapat
              </button>
            </div>
          </div>
        ) : (
          <>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
              <h2 style={{ fontSize: 18, fontWeight: 700, color: "#111" }}>Yayina Al</h2>
              <button onClick={onClose} style={{ background: "none", border: "none", fontSize: 20, cursor: "pointer", color: "#888" }}>x</button>
            </div>

            {/* Domain info */}
            <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 8, padding: "12px 16px", marginBottom: 20 }}>
              <p style={{ fontSize: 13, color: "#166534", fontWeight: 600, marginBottom: 2 }}>
                {hasDomain ? site.customDomain : `${site.subdomain}.${ROOT_DOMAIN.split(":")[0]}`}
              </p>
              {!hasDomain && (
                <p style={{ fontSize: 12, color: "#555" }}>
                  Ozel domain baglamak icin Ayarlar &gt; Domain sayfasini kullanabilirsiniz.
                </p>
              )}
            </div>

            {/* Checklist */}
            <div style={{ background: "#f9f9fb", borderRadius: 8, padding: "12px 16px", marginBottom: 20 }}>
              {checks.map((c) => (
                <div key={c.label} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6, fontSize: 13 }}>
                  <span style={{ color: c.ok ? "#16a34a" : "#9ca3af", fontWeight: 700, fontSize: 15 }}>
                    {c.ok ? "✓" : "○"}
                  </span>
                  <span style={{ color: c.ok ? "#111" : "#9ca3af" }}>{c.label}</span>
                </div>
              ))}
            </div>

            {error && (
              <p style={{ fontSize: 13, color: "#dc2626", marginBottom: 12 }}>{error}</p>
            )}

            <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
              <button
                onClick={onClose}
                style={{ background: "#f4f4f5", color: "#333", border: "none", borderRadius: 6, padding: "8px 18px", fontSize: 14, cursor: "pointer" }}
              >
                Iptal
              </button>
              <button
                onClick={handlePublish}
                disabled={!allOk || loading}
                style={{
                  background: allOk && !loading ? "#16a34a" : "#d1d5db",
                  color: "#fff",
                  border: "none",
                  borderRadius: 6,
                  padding: "8px 18px",
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: allOk && !loading ? "pointer" : "not-allowed",
                }}
              >
                {loading ? "Yayinlaniyor..." : "Yayina Al"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
