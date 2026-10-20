"use client";

import Link from "next/link";

export default function MobileEditorWarning() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "#fafafa",
        fontFamily: "'Inter', 'Helvetica Neue', -apple-system, sans-serif",
        padding: "24px",
        position: "relative",
      }}
    >
      <div style={{ textAlign: "center", maxWidth: 480 }}>
        <p
          style={{
            fontSize: "clamp(64px, 18vw, 120px)",
            fontWeight: 200,
            lineHeight: 0.85,
            color: "#e4e4e7",
            margin: 0,
            letterSpacing: "-0.04em",
            userSelect: "none",
          }}
        >
          Editor
        </p>

        <div
          style={{
            width: 48,
            height: 1,
            background: "#d4d4d8",
            margin: "24px auto",
          }}
        />

        <h1
          style={{
            fontSize: 18,
            fontWeight: 300,
            color: "#18181b",
            margin: "0 0 12px",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
          }}
        >
          Masaüstü Gerekiyor
        </h1>

        <p
          style={{
            fontSize: 14,
            fontWeight: 300,
            color: "#a1a1aa",
            lineHeight: 1.7,
            margin: "0 0 40px",
          }}
        >
          Editor sayfası sadece masaüstünde çalışır. Lütfen masaüstüne geçin ve tekrar deneyin.
        </p>

        <Link
          href="/dashboard"
          style={{
            display: "inline-block",
            color: "#18181b",
            textDecoration: "none",
            padding: "12px 32px",
            border: "1px solid #d4d4d8",
            borderRadius: 0,
            fontWeight: 300,
            fontSize: 13,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            transition: "all 0.3s ease",
          }}
        >
          Geri Dön
        </Link>
      </div>

      <div
        style={{
          position: "absolute",
          bottom: 32,
          left: "50%",
          transform: "translateX(-50%)",
          textAlign: "center",
        }}
      >
        <a
          href="https://eraypiskin.com"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            color: "#c4c4c8",
            textDecoration: "none",
            fontSize: 11,
            fontWeight: 300,
            letterSpacing: "0.06em",
            transition: "color 0.2s",
          }}
        >
          Powered by <span style={{ fontWeight: 500 }}>Eray Pişkin</span>
        </a>
      </div>
    </div>
  );
}
