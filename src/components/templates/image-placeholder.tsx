"use client";

interface ImagePlaceholderProps {
  width?: string | number;
  height?: string | number;
  className?: string;
  label?: string;
}

export function ImagePlaceholder({
  width = "100%",
  height = 240,
  className = "",
  label = "Gorsel",
}: ImagePlaceholderProps) {
  return (
    <div
      className={className}
      style={{
        width,
        height,
        background: "linear-gradient(135deg, #e5e7eb 0%, #d1d5db 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        gap: 8,
      }}
    >
      <svg
        style={{ width: 32, height: 32, color: "#9ca3af" }}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.5}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
        />
      </svg>
      <span style={{ fontSize: 12, color: "#9ca3af" }}>{label}</span>
    </div>
  );
}
