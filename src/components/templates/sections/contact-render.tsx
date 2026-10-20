"use client";

import { memo, useRef, useState } from "react";
import { ContactData, SiteGlobalConfig } from "@/types/template";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";
import { SectionTitle } from "../section-title";

interface Props {
  data: ContactData;
  global: SiteGlobalConfig;
  isPreview?: boolean;
  siteSubdomain?: string;
}

export const ContactRender = memo(function ContactRender({ data, global, isPreview, siteSubdomain }: Props) {
  const { ref, visible } = useScrollAnimation(isPreview);
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const inputStyle = {
    width: "100%",
    padding: "12px 16px",
    border: `1px solid ${global.colors.surface}`,
    borderRadius: 8,
    fontFamily: global.fonts.body,
    fontSize: 15,
    color: global.colors.text,
    background: global.colors.background,
    outline: "none",
    boxSizing: "border-box" as const,
  };

  return (
    <section
      className="sf-section-pad"
      style={{
        background: "transparent",
        padding: "96px 24px",
        fontFamily: global.fonts.body,
      }}
      id="contact"
    >
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div
          ref={ref as React.RefObject<HTMLDivElement>}
          style={{
            transition: "opacity 0.7s ease, transform 0.7s ease",
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(28px)",
          }}
        >
          <SectionTitle
            title={data.title}
            subtitle={data.subtitle}
            headingFont={global.fonts.heading}
            bodyFont={global.fonts.body}
            titleColor={global.colors.text}
            subtitleColor={global.colors.textLight}
            accentColor={global.colors.accent}
          />

          <div
            className={data.showMap ? "sf-contact-grid" : undefined}
            style={{
              display: "grid",
              gridTemplateColumns: data.showMap ? "1fr 1fr" : "1fr",
              gap: 48,
              maxWidth: data.showMap ? "100%" : 600,
              margin: data.showMap ? "0" : "0 auto",
            }}
          >
            {/* Form */}
            {data.showForm && (
              <div>
                {submitted ? (
                  <div
                    style={{
                      textAlign: "center",
                      padding: "48px 24px",
                      background: global.colors.surface,
                      borderRadius: 16,
                    }}
                  >
                    <div
                      style={{
                        width: 64,
                        height: 64,
                        background: `${global.colors.accent}22`,
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        margin: "0 auto 16px",
                      }}
                    >
                      <svg style={{ width: 28, height: 28, color: global.colors.accent }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <h3 style={{ fontFamily: global.fonts.heading, fontWeight: 600, fontSize: 20, color: global.colors.text, margin: "0 0 8px" }}>
                      Mesajiniz Alindi!
                    </h3>
                    <p style={{ color: global.colors.textLight, margin: 0 }}>
                      En kisa surede size donecegiz.
                    </p>
                  </div>
                ) : (
                  <form
                    ref={formRef}
                    onSubmit={async (e) => {
                      e.preventDefault();
                      setErrorMsg(null);

                      if (isPreview) {
                        setSubmitted(true);
                        return;
                      }

                      if (!siteSubdomain) {
                        setSubmitted(true);
                        return;
                      }

                      const formData = new FormData(e.currentTarget);
                      const fields: Record<string, string> = {};
                      data.formFields.forEach((field) => {
                        fields[field.name] = (formData.get(field.name) as string) || "";
                      });
                      const honeypot = (formData.get("website") as string) || "";

                      setSending(true);
                      try {
                        const res = await fetch(`/api/public/sites/${siteSubdomain}/contact`, {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({ fields, honeypot }),
                        });
                        if (!res.ok) {
                          const body = await res.json().catch(() => ({}));
                          throw new Error(body.error || "Mesaj gonderilemedi.");
                        }
                        setSubmitted(true);
                      } catch (err) {
                        setErrorMsg(err instanceof Error ? err.message : "Bir hata olustu. Lutfen tekrar deneyin.");
                      } finally {
                        setSending(false);
                      }
                    }}
                    style={{ display: "flex", flexDirection: "column", gap: 16 }}
                  >
                    {/* Honeypot field */}
                    <input
                      name="website"
                      type="text"
                      style={{ position: "absolute", left: "-9999px" }}
                      tabIndex={-1}
                      autoComplete="off"
                    />

                    {data.formFields.map((field, i) => (
                      <div key={i}>
                        <label
                          style={{
                            display: "block",
                            fontSize: 13,
                            fontWeight: 500,
                            color: global.colors.text,
                            marginBottom: 6,
                          }}
                        >
                          {field.label}
                          {field.required && <span style={{ color: global.colors.accent }}> *</span>}
                        </label>
                        {field.type === "textarea" ? (
                          <textarea
                            name={field.name}
                            required={field.required}
                            rows={4}
                            style={{ ...inputStyle, resize: "vertical" }}
                            placeholder={field.label}
                          />
                        ) : field.type === "select" && field.options ? (
                          <select name={field.name} required={field.required} style={inputStyle}>
                            <option value="">Seciniz</option>
                            {field.options.map((opt, oi) => (
                              <option key={oi} value={opt}>{opt}</option>
                            ))}
                          </select>
                        ) : (
                          <input
                            name={field.name}
                            type={field.type === "phone" ? "tel" : field.type}
                            required={field.required}
                            style={inputStyle}
                            placeholder={field.label}
                          />
                        )}
                      </div>
                    ))}

                    {errorMsg && (
                      <div
                        style={{
                          padding: "12px 16px",
                          background: "#fef2f2",
                          border: "1px solid #fecaca",
                          borderRadius: 8,
                          color: "#dc2626",
                          fontSize: 14,
                        }}
                      >
                        {errorMsg}
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={sending}
                      style={{
                        background: global.colors.primary,
                        color: "#ffffff",
                        border: "none",
                        padding: "14px 32px",
                        borderRadius: 8,
                        fontFamily: global.fonts.body,
                        fontWeight: 600,
                        fontSize: 15,
                        cursor: sending ? "not-allowed" : "pointer",
                        marginTop: 8,
                        transition: "opacity 0.2s",
                        opacity: sending ? 0.7 : 1,
                      }}
                      onMouseEnter={(e) => { if (!sending) e.currentTarget.style.opacity = "0.85"; }}
                      onMouseLeave={(e) => { if (!sending) e.currentTarget.style.opacity = "1"; }}
                    >
                      {sending ? "Gonderiliyor..." : "Gonder"}
                    </button>
                  </form>
                )}
              </div>
            )}

            {/* Map or contact info */}
            <div>
              {data.showMap && data.mapEmbedUrl ? (
                <iframe
                  src={data.mapEmbedUrl}
                  width="100%"
                  height="400"
                  style={{ border: "none", borderRadius: 16 }}
                  loading="lazy"
                  title="Konum"
                />
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
                  {global.general.address && (
                    <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
                      <div
                        style={{
                          width: 44,
                          height: 44,
                          background: global.colors.surface,
                          borderRadius: 10,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                        }}
                      >
                        <svg style={{ width: 20, height: 20, color: global.colors.primary }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                        </svg>
                      </div>
                      <div>
                        <p style={{ fontWeight: 600, color: global.colors.text, margin: "0 0 4px" }}>Adres</p>
                        <p style={{ color: global.colors.textLight, margin: 0, lineHeight: 1.6 }}>{global.general.address}</p>
                      </div>
                    </div>
                  )}
                  {global.general.phone && (
                    <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
                      <div
                        style={{
                          width: 44,
                          height: 44,
                          background: global.colors.surface,
                          borderRadius: 10,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                        }}
                      >
                        <svg style={{ width: 20, height: 20, color: global.colors.primary }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                        </svg>
                      </div>
                      <div>
                        <p style={{ fontWeight: 600, color: global.colors.text, margin: "0 0 4px" }}>Telefon</p>
                        <a href={`tel:${global.general.phone}`} style={{ color: global.colors.primary, textDecoration: "none" }}>
                          {global.general.phone}
                        </a>
                      </div>
                    </div>
                  )}
                  {global.general.email && (
                    <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
                      <div
                        style={{
                          width: 44,
                          height: 44,
                          background: global.colors.surface,
                          borderRadius: 10,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                        }}
                      >
                        <svg style={{ width: 20, height: 20, color: global.colors.primary }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                        </svg>
                      </div>
                      <div>
                        <p style={{ fontWeight: 600, color: global.colors.text, margin: "0 0 4px" }}>E-posta</p>
                        <a href={`mailto:${global.general.email}`} style={{ color: global.colors.primary, textDecoration: "none" }}>
                          {global.general.email}
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
});
