"use client";

interface SectionTitleProps {
  title: string;
  subtitle?: string;
  align?: "left" | "center" | "right";
  headingFont?: string;
  bodyFont?: string;
  titleColor?: string;
  subtitleColor?: string;
  accentColor?: string;
}

export function SectionTitle({
  title,
  subtitle,
  align = "center",
  headingFont,
  bodyFont,
  titleColor = "#18181b",
  subtitleColor = "#71717a",
  accentColor = "#3b82f6",
}: SectionTitleProps) {
  const textAlign = align;

  return (
    <div style={{ textAlign, marginBottom: 48 }}>
      <div
        style={{
          display: "inline-block",
          width: 40,
          height: 3,
          background: accentColor,
          borderRadius: 2,
          marginBottom: 16,
        }}
      />
      <h2
        style={{
          fontFamily: headingFont,
          fontSize: "clamp(1.75rem, 3vw, 2.5rem)",
          fontWeight: 700,
          color: titleColor,
          lineHeight: 1.2,
          margin: 0,
        }}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          style={{
            fontFamily: bodyFont,
            fontSize: "1.0625rem",
            color: subtitleColor,
            marginTop: 12,
            maxWidth: 560,
            lineHeight: 1.6,
            ...(align === "center" ? { marginLeft: "auto", marginRight: "auto" } : {}),
          }}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}
