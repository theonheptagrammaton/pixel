"use client";

import { useEffect } from "react";
import { GOOGLE_FONTS, loadGoogleFont } from "@/lib/fonts";

interface FontSelectorProps {
  label: string;
  value: string;
  onChange: (font: string) => void;
}

export function FontSelector({ label, value, onChange }: FontSelectorProps) {
  useEffect(() => {
    if (value) loadGoogleFont(value);
  }, [value]);

  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-medium text-zinc-700">{label}</label>
      <select
        value={value}
        onChange={(e) => {
          loadGoogleFont(e.target.value);
          onChange(e.target.value);
        }}
        className="w-full px-2.5 py-1.5 text-sm border border-zinc-200 rounded focus:outline-none focus:ring-1 focus:ring-zinc-900 bg-white text-zinc-700"
        style={{ fontFamily: value }}
      >
        {GOOGLE_FONTS.map((font) => (
          <option key={font} value={font} style={{ fontFamily: font }}>
            {font}
          </option>
        ))}
      </select>
      <p className="text-xs text-zinc-400" style={{ fontFamily: value }}>
        The quick brown fox jumps over the lazy dog.
      </p>
    </div>
  );
}
