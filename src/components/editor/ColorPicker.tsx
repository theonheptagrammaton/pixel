"use client";

const PRESETS = [
  "#000000", "#ffffff", "#f4f4f5", "#a1a1aa", "#71717a",
  "#ef4444", "#f97316", "#eab308", "#22c55e", "#3b82f6",
  "#8b5cf6", "#ec4899", "#14b8a6", "#f59e0b", "#6366f1",
];

interface ColorPickerProps {
  label: string;
  value: string;
  onChange: (color: string) => void;
}

export function ColorPicker({ label, value, onChange }: ColorPickerProps) {
  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-medium text-zinc-700">{label}</label>
      <div className="flex items-center gap-2">
        <div className="relative">
          <input
            type="color"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          <div
            className="w-8 h-8 rounded border border-zinc-300 shadow-sm cursor-pointer"
            style={{ backgroundColor: value }}
          />
        </div>
        <input
          type="text"
          value={value}
          onChange={(e) => {
            const v = e.target.value;
            if (/^#[0-9A-Fa-f]{0,6}$/.test(v)) onChange(v);
          }}
          className="w-24 px-2 py-1.5 text-xs border border-zinc-200 rounded font-mono focus:outline-none focus:ring-1 focus:ring-zinc-900"
          maxLength={7}
        />
      </div>
      <div className="flex flex-wrap gap-1">
        {PRESETS.map((preset) => (
          <button
            key={preset}
            type="button"
            onClick={() => onChange(preset)}
            title={preset}
            className={`w-5 h-5 rounded border transition-transform hover:scale-110 ${
              value === preset ? "border-zinc-900 scale-110" : "border-zinc-200"
            }`}
            style={{ backgroundColor: preset }}
          />
        ))}
      </div>
    </div>
  );
}
