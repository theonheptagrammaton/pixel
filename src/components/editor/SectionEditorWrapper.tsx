"use client";

interface FieldGroupProps {
  label: string;
  children: React.ReactNode;
  description?: string;
}

export function FieldGroup({ label, children, description }: FieldGroupProps) {
  return (
    <div className="space-y-3">
      <div>
        <h4 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">{label}</h4>
        {description && <p className="text-xs text-zinc-400 mt-0.5">{description}</p>}
      </div>
      {children}
    </div>
  );
}

interface FieldProps {
  label: string;
  children: React.ReactNode;
  hint?: string;
}

export function Field({ label, children, hint }: FieldProps) {
  return (
    <div className="space-y-1">
      <label className="block text-xs font-medium text-zinc-700">{label}</label>
      {children}
      {hint && <p className="text-xs text-zinc-400">{hint}</p>}
    </div>
  );
}

interface TextInputProps {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  multiline?: boolean;
  rows?: number;
}

export function TextInput({ value, onChange, placeholder, multiline, rows = 3 }: TextInputProps) {
  const cls = "w-full px-2.5 py-1.5 text-sm border border-zinc-200 rounded focus:outline-none focus:ring-1 focus:ring-zinc-900 bg-white text-zinc-700 placeholder-zinc-400 resize-none";
  if (multiline) {
    return (
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className={cls}
      />
    );
  }
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={cls}
    />
  );
}

interface SelectInputProps {
  value: string;
  onChange: (v: string) => void;
  options: Array<{ value: string; label: string }>;
}

export function SelectInput({ value, onChange, options }: SelectInputProps) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-2.5 py-1.5 text-sm border border-zinc-200 rounded focus:outline-none focus:ring-1 focus:ring-zinc-900 bg-white text-zinc-700"
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>{opt.label}</option>
      ))}
    </select>
  );
}
