"use client";
import { useState, useEffect, useRef } from "react";
import { StoredSite } from "@/stores/editor-store";

const ROOT_DOMAIN =
  typeof window !== "undefined"
    ? (process.env.NEXT_PUBLIC_ROOT_DOMAIN ?? "localhost:3000")
    : "localhost:3000";

interface SubdomainModalProps {
  site: StoredSite;
  onClose: () => void;
  onSuccess: (newSubdomain: string) => void;
}

export function SubdomainModal({ site, onClose, onSuccess }: SubdomainModalProps) {
  const [subdomain, setSubdomain] = useState(site.subdomain);
  const [available, setAvailable] = useState<boolean | null>(null);
  const [reason, setReason] = useState("");
  const [checking, setChecking] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!subdomain || subdomain === site.subdomain) {
      setAvailable(subdomain === site.subdomain ? true : null);
      setReason("");
      return;
    }
    setChecking(true);
    debounceRef.current = setTimeout(async () => {
      try {
        const res = await fetch(
          `/api/subdomains/check?subdomain=${encodeURIComponent(subdomain)}&excludeSiteId=${site.id}`
        );
        const json = await res.json();
        if (json.success) {
          setAvailable(json.data.available);
          setReason(json.data.reason ?? "");
        }
      } catch {
        setAvailable(false);
        setReason("Kontrol edilemedi.");
      } finally {
        setChecking(false);
      }
    }, 500);
  }, [subdomain, site.id, site.subdomain]);

  async function handleSave() {
    if (!available || loading) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/sites/${site.id}/subdomain`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subdomain }),
      });
      const json = await res.json();
      if (!json.success) {
        setError(json.error ?? "Güncelleme başarısız.");
        return;
      }
      onSuccess(subdomain);
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
          maxWidth: 420,
          boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: "#111" }}>Subdomain Değiştir</h2>
          <button onClick={onClose} style={{ background: "none", border: "none", fontSize: 20, cursor: "pointer", color: "#888" }}>×</button>
        </div>
        <p style={{ fontSize: 13, color: "#888", marginBottom: 16 }}>
          Subdomain değiştirilirse site yayından kaldırılır.
        </p>

        <div style={{ marginBottom: 20 }}>
          <div style={{ display: "flex", alignItems: "center", border: "1.5px solid #e4e4e7", borderRadius: 6, overflow: "hidden" }}>
            <input
              type="text"
              value={subdomain}
              onChange={(e) => setSubdomain(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))}
              style={{ flex: 1, border: "none", outline: "none", padding: "8px 12px", fontSize: 14, color: "#111" }}
              placeholder={site.subdomain}
            />
            <span style={{ padding: "8px 12px", fontSize: 13, color: "#888", background: "#f9f9f9", whiteSpace: "nowrap" }}>
              .{ROOT_DOMAIN}
            </span>
          </div>
          {checking && <p style={{ fontSize: 12, color: "#888", marginTop: 4 }}>Kontrol ediliyor…</p>}
          {!checking && subdomain && available === true && subdomain !== site.subdomain && (
            <p style={{ fontSize: 12, color: "#16a34a", marginTop: 4 }}>✓ Kullanılabilir</p>
          )}
          {!checking && subdomain && available === false && (
            <p style={{ fontSize: 12, color: "#dc2626", marginTop: 4 }}>✗ {reason}</p>
          )}
        </div>

        {error && <p style={{ fontSize: 13, color: "#dc2626", marginBottom: 12 }}>{error}</p>}

        <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
          <button onClick={onClose} style={{ background: "#f4f4f5", color: "#333", border: "none", borderRadius: 6, padding: "8px 18px", fontSize: 14, cursor: "pointer" }}>
            İptal
          </button>
          <button
            onClick={handleSave}
            disabled={!available || loading || subdomain === site.subdomain}
            style={{
              background: available && !loading && subdomain !== site.subdomain ? "#6366f1" : "#d1d5db",
              color: "#fff",
              border: "none",
              borderRadius: 6,
              padding: "8px 18px",
              fontSize: 14,
              fontWeight: 600,
              cursor: available && !loading && subdomain !== site.subdomain ? "pointer" : "not-allowed",
            }}
          >
            {loading ? "Kaydediliyor…" : "Kaydet"}
          </button>
        </div>
      </div>
    </div>
  );
}
