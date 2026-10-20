"use client";

interface ArrayFieldProps<T> {
  label: string;
  items: T[];
  onAdd: () => void;
  onRemove: (index: number) => void;
  onUpdate: (index: number, updated: T) => void;
  renderItem: (item: T, index: number, update: (updated: T) => void) => React.ReactNode;
  addLabel?: string;
  emptyMessage?: string;
}

export function ArrayField<T>({
  label,
  items,
  onAdd,
  onRemove,
  renderItem,
  addLabel = "Ekle",
  emptyMessage = "Henuz eleman yok.",
}: ArrayFieldProps<T>) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">{label}</span>
        <button
          type="button"
          onClick={onAdd}
          className="flex items-center gap-1 text-xs text-zinc-600 hover:text-zinc-900 font-medium transition-colors"
        >
          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          {addLabel}
        </button>
      </div>

      {items.length === 0 ? (
        <p className="text-xs text-zinc-400 py-3 text-center border border-dashed border-zinc-200 rounded">{emptyMessage}</p>
      ) : (
        <div className="space-y-2">
          {items.map((item, i) => (
            <div key={i} className="relative border border-zinc-200 rounded-md p-3 bg-zinc-50 space-y-2">
              <button
                type="button"
                onClick={() => onRemove(i)}
                className="absolute top-2 right-2 text-zinc-400 hover:text-red-500 transition-colors"
                aria-label="Kaldir"
              >
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              {renderItem(item, i, (updated) => {
                // handled by parent via onUpdate
                void updated;
              })}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
