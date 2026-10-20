"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export function OnboardingWizard() {
  const router = useRouter();
  const { update: updateSession } = useSession();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit() {
    if (!name.trim()) {
      setError("Ad Soyad zorunludur.");
      return;
    }
    if (!phone.trim()) {
      setError("Telefon numarasi zorunludur.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone }),
      });
      const json = await res.json();
      if (!json.success) {
        setError(json.error ?? "Islem basarisiz.");
        return;
      }
      await updateSession();
      router.push("/dashboard");
      router.refresh();
    } catch {
      setError("Sunucu hatasi. Lutfen tekrar deneyin.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "#fafafa",
        padding: "24px",
      }}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: 16,
          padding: "36px 40px",
          width: "100%",
          maxWidth: 480,
          border: "1px solid #e4e4e7",
        }}
      >
        <h2 style={{ fontSize: 22, fontWeight: 700, color: "#111", marginBottom: 8 }}>
          Profilinizi Tamamlayin
        </h2>
        <p style={{ fontSize: 14, color: "#888", marginBottom: 24 }}>
          Hesabinizi kullanmaya baslamak icin bilgilerinizi girin.
        </p>

        <div style={{ marginBottom: 16 }}>
          <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#444", marginBottom: 6 }}>
            Ad Soyad <span style={{ color: "#dc2626" }}>*</span>
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Adinizi ve soyadinizi girin"
            style={{
              width: "100%",
              border: "1.5px solid #e4e4e7",
              borderRadius: 8,
              padding: "10px 14px",
              fontSize: 14,
              outline: "none",
              boxSizing: "border-box",
              color: "#111",
            }}
          />
        </div>

        <div style={{ marginBottom: 24 }}>
          <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#444", marginBottom: 6 }}>
            Telefon Numarasi <span style={{ color: "#dc2626" }}>*</span>
          </label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="05XX XXX XX XX"
            style={{
              width: "100%",
              border: "1.5px solid #e4e4e7",
              borderRadius: 8,
              padding: "10px 14px",
              fontSize: 14,
              outline: "none",
              boxSizing: "border-box",
              color: "#111",
            }}
          />
        </div>

        {error && (
          <p style={{ fontSize: 13, color: "#dc2626", marginBottom: 12 }}>{error}</p>
        )}

        <button
          onClick={handleSubmit}
          disabled={loading || !name.trim() || !phone.trim()}
          style={{
            background: !loading && name.trim() && phone.trim() ? "#18181b" : "#d1d5db",
            color: "#fff",
            border: "none",
            borderRadius: 8,
            padding: "12px 20px",
            fontSize: 14,
            fontWeight: 700,
            cursor: !loading && name.trim() && phone.trim() ? "pointer" : "not-allowed",
            width: "100%",
          }}
        >
          {loading ? "Kaydediliyor..." : "Kaydet ve Devam Et"}
        </button>
      </div>
    </div>
  );
}
