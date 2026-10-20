"use client";

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorPageProps) {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "#09090b",
        color: "#fff",
        textAlign: "center",
        padding: "24px",
      }}
    >
      <div style={{ fontSize: 64, marginBottom: 20 }}>⚠️</div>
      <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 12 }}>
        Bir Hata Oluştu
      </h1>
      <p style={{ fontSize: 15, color: "#a1a1aa", marginBottom: 24, maxWidth: 360 }}>
        Beklenmedik bir sorun yaşandı. Lütfen tekrar deneyin.
      </p>
      {process.env.NODE_ENV === "development" && error?.message && (
        <pre
          style={{
            background: "#18181b",
            border: "1px solid #27272a",
            borderRadius: 8,
            padding: "12px 16px",
            fontSize: 12,
            color: "#ef4444",
            maxWidth: 480,
            overflow: "auto",
            marginBottom: 24,
            textAlign: "left",
          }}
        >
          {error.message}
        </pre>
      )}
      <button
        onClick={reset}
        style={{
          background: "#6366f1",
          color: "#fff",
          padding: "12px 28px",
          borderRadius: 8,
          fontWeight: 600,
          fontSize: 14,
          border: "none",
          cursor: "pointer",
        }}
      >
        Tekrar Dene
      </button>
    </div>
  );
}
