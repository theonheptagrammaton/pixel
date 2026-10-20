import { ReactNode } from "react";

interface TableProps {
  children: ReactNode;
  className?: string;
}

interface TableHeadProps {
  children: ReactNode;
}

interface TableBodyProps {
  children: ReactNode;
}

interface ThProps {
  children: ReactNode;
  className?: string;
  sortable?: boolean;
  onSort?: () => void;
}

interface TdProps {
  children: ReactNode;
  className?: string;
}

interface TrProps {
  children: ReactNode;
  className?: string;
}

export function Table({ children, className = "" }: TableProps) {
  return (
    <div className={`w-full overflow-x-auto ${className}`}>
      <table className="w-full text-sm text-left">{children}</table>
    </div>
  );
}

export function TableHead({ children }: TableHeadProps) {
  return (
    <thead className="text-xs text-zinc-500 uppercase tracking-wider bg-zinc-50 border-b border-zinc-200">
      {children}
    </thead>
  );
}

export function TableBody({ children }: TableBodyProps) {
  return <tbody className="divide-y divide-zinc-100">{children}</tbody>;
}

export function Th({ children, className = "", sortable, onSort }: ThProps) {
  return (
    <th
      className={`px-4 py-3 font-medium whitespace-nowrap ${sortable ? "cursor-pointer select-none hover:text-zinc-700" : ""} ${className}`}
      onClick={sortable ? onSort : undefined}
    >
      <div className="flex items-center gap-1">
        {children}
        {sortable && (
          <svg
            className="h-3.5 w-3.5 text-zinc-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
            />
          </svg>
        )}
      </div>
    </th>
  );
}

export function Td({ children, className = "" }: TdProps) {
  return (
    <td className={`px-4 py-3 text-zinc-700 ${className}`}>{children}</td>
  );
}

export function Tr({ children, className = "" }: TrProps) {
  return (
    <tr className={`hover:bg-zinc-50 transition-colors ${className}`}>
      {children}
    </tr>
  );
}
