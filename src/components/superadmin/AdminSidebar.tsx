"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { SessionUser } from "@/types";

interface AdminSidebarProps {
  user: SessionUser;
  onClose?: () => void;
}

const navItems = [
  {
    href: "/admin",
    label: "Kullanicilar",
    icon: (
      <svg
        className="h-4 w-4"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.75}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
        />
      </svg>
    ),
    exact: true,
  },
];

export function AdminSidebar({ user, onClose }: AdminSidebarProps) {
  const pathname = usePathname();

  return (
    <div className="flex flex-col h-full bg-white border-r border-zinc-200 w-64">
      {/* Logo */}
      <div className="flex items-center justify-between h-16 px-5 border-b border-zinc-200 shrink-0">
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <img src="/logo.svg" alt="Pixel" className="h-6 w-6" />
            <span className="text-sm font-bold text-zinc-900 tracking-tight">
              Pixel
            </span>
          </div>
          <span className="text-xs font-semibold text-zinc-500 tracking-widest uppercase mt-0.5 ml-8">
            Super Admin
          </span>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-zinc-600 md:hidden"
            aria-label="Menuyu kapat"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto">
        <ul className="space-y-0.5">
          {navItems.map((item) => {
            const isActive = item.exact
              ? pathname === item.href
              : pathname.startsWith(item.href);
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={onClose}
                  className={`
                    flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors
                    ${isActive
                      ? "bg-zinc-900 text-white"
                      : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
                    }
                  `}
                >
                  {item.icon}
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User */}
      <div className="shrink-0 border-t border-zinc-200 p-3">
        <div className="flex items-center gap-3 px-2 py-2">
          <div className="h-8 w-8 rounded-full bg-zinc-200 flex items-center justify-center text-xs font-semibold text-zinc-700 shrink-0 uppercase">
            {(user.name || user.username).charAt(0)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-zinc-900 truncate">
              {user.name || user.username}
            </p>
            <p className="text-xs text-zinc-500 truncate">{user.email}</p>
          </div>
        </div>
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="mt-1 flex items-center gap-2 w-full px-3 py-2 text-sm text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 rounded-md transition-colors"
        >
          <svg
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.75}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
            />
          </svg>
          Cikis Yap
        </button>
      </div>
    </div>
  );
}
