"use client";

import { useEffect, useState } from "react";
import { SiteGlobalConfig } from "@/types/template";

interface Props {
  text: string;
  buttonText: string;
  linkUrl?: string;
  linkText?: string;
  global: SiteGlobalConfig;
}

export function CookieConsent({ text, buttonText, linkUrl, linkText, global }: Props) {
  const [visible, setVisible] = useState(false);
  const [accepted, setAccepted] = useState(true);

  useEffect(() => {
    const consent = localStorage.getItem("sf-cookie-consent");
    if (consent === "accepted") {
      setAccepted(true);
      return;
    }
    setAccepted(false);
    // Delay showing the banner for smooth slide-up
    const timer = setTimeout(() => setVisible(true), 300);
    return () => clearTimeout(timer);
  }, []);

  const handleAccept = () => {
    localStorage.setItem("sf-cookie-consent", "accepted");
    setVisible(false);
    setTimeout(() => setAccepted(true), 400);
  };

  if (accepted) return null;

  return (
    <div
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 9980,
        background: global.colors.text,
        color: "#ffffff",
        padding: "16px 24px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 16,
        flexWrap: "wrap",
        fontFamily: global.fonts.body,
        fontSize: 14,
        lineHeight: 1.5,
        transition: "transform 0.4s ease, opacity 0.4s ease",
        transform: visible ? "translateY(0)" : "translateY(100%)",
        opacity: visible ? 1 : 0,
        boxShadow: "0 -4px 24px rgba(0,0,0,0.15)",
      }}
    >
      <p style={{ margin: 0, flex: 1, minWidth: 200 }}>
        {text}
        {linkUrl && linkText && (
          <>
            {" "}
            <a
              href={linkUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: global.colors.accent,
                textDecoration: "underline",
              }}
            >
              {linkText}
            </a>
          </>
        )}
      </p>
      <button
        type="button"
        onClick={handleAccept}
        style={{
          background: global.colors.accent,
          color: "#ffffff",
          border: "none",
          padding: "10px 24px",
          borderRadius: 6,
          fontFamily: global.fonts.body,
          fontWeight: 600,
          fontSize: 14,
          cursor: "pointer",
          whiteSpace: "nowrap",
          transition: "opacity 0.2s",
          flexShrink: 0,
        }}
        onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.85")}
        onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
      >
        {buttonText}
      </button>
    </div>
  );
}
