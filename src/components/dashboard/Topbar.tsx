"use client";

import { SessionUser } from "@/types";

interface TopbarProps {
  title: string;
  user: SessionUser;
  onMenuClick: () => void;
}

export function Topbar({ title, user, onMenuClick }: TopbarProps) {
  return (
    <header className="h-16 bg-white border-b border-zinc-200 flex items-center justify-between px-6 shrink-0">
      <div className="flex items-center gap-4">
        {/* Mobile menu button */}
        <button
          onClick={onMenuClick}
          className="md:hidden text-zinc-500 hover:text-zinc-700 transition-colors"
          aria-label="Menuyu ac"
        >
          <svg
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
        <h1 className="text-base font-semibold text-zinc-900">{title}</h1>
      </div>

      <div className="flex items-center gap-3">
        <div className="text-right hidden sm:block">
          <p className="text-sm font-medium text-zinc-900 leading-tight">
            {user.name || "Kullanici"}
          </p>
        </div>
        <div className="h-9 w-9 rounded-full bg-zinc-200 flex items-center justify-center text-sm font-semibold text-zinc-700 uppercase shrink-0">
          {(user.name || "K").charAt(0)}
        </div>
      </div>
    </header>
  );
}
