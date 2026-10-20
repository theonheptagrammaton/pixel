"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import { AdminSidebar } from "@/components/superadmin/AdminSidebar";
import { Spinner } from "@/components/ui/Spinner";
import { SessionUser } from "@/types";
import { UserRole } from "@prisma/client";

const pageTitles: Record<string, string> = {
  "/admin": "Kullanicilar",
  "/admin/users": "Kullanici Detayi",
};

function getPageTitle(pathname: string): string {
  if (pathname.match(/^\/admin\/users\/.+/)) return "Kullanici Detayi";
  for (const [path, title] of Object.entries(pageTitles)) {
    if (pathname === path) return title;
  }
  return "Admin Panel";
}

export default function SuperAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/login");
    } else if (status === "authenticated" && session?.user?.role !== UserRole.SUPER_ADMIN) {
      router.replace("/dashboard");
    }
  }, [status, session, router]);

  if (status === "loading" || status === "unauthenticated") {
    return (
      <div className="min-h-screen bg-zinc-50 flex items-center justify-center">
        <Spinner size="lg" className="text-zinc-400" />
      </div>
    );
  }

  if (session?.user?.role !== UserRole.SUPER_ADMIN) {
    return (
      <div className="min-h-screen bg-zinc-50 flex items-center justify-center">
        <Spinner size="lg" className="text-zinc-400" />
      </div>
    );
  }

  const user = session.user as SessionUser;
  const title = getPageTitle(pathname);

  return (
    <div className="flex h-screen overflow-hidden bg-zinc-50">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/40 md:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed md:static inset-y-0 left-0 z-30
          transform transition-transform duration-200 ease-in-out
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
      >
        <AdminSidebar user={user} onClose={() => setSidebarOpen(false)} />
      </aside>

      {/* Main content */}
      <div className="flex flex-col flex-1 overflow-hidden min-w-0">
        {/* Topbar */}
        <header className="h-16 bg-white border-b border-zinc-200 flex items-center justify-between px-6 shrink-0">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="md:hidden text-zinc-500 hover:text-zinc-700"
              aria-label="Menuyu ac"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <div className="flex items-center gap-3">
              <h1 className="text-base font-semibold text-zinc-900">{title}</h1>
              <span className="text-xs font-semibold text-zinc-500 bg-zinc-100 border border-zinc-200 px-2 py-0.5 rounded-full tracking-wide uppercase">
                Admin
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium text-zinc-900 leading-tight">
                {user.name || user.username}
              </p>
              <p className="text-xs text-zinc-500 leading-tight">{user.email}</p>
            </div>
            <div className="h-9 w-9 rounded-full bg-zinc-200 flex items-center justify-center text-sm font-semibold text-zinc-700 uppercase shrink-0">
              {(user.name || user.username).charAt(0)}
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}
