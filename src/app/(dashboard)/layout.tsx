"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { usePathname, redirect } from "next/navigation";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Topbar } from "@/components/dashboard/Topbar";
import { Spinner } from "@/components/ui/Spinner";
import { SessionUser } from "@/types";

const pageTitles: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/templates": "Sablonlar",
  "/editor": "Site Editor",
  "/blog": "Blog Yazilari",
  "/submissions": "Mesajlar",
  "/analytics": "Analitik",
  "/settings": "Ayarlar",
  "/yardim": "Yardim",
};

function getPageTitle(pathname: string): string {
  for (const [path, title] of Object.entries(pageTitles)) {
    if (pathname === path || pathname.startsWith(path + "/")) {
      return title;
    }
  }
  return "Dashboard";
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-zinc-50 flex items-center justify-center">
        <Spinner size="lg" className="text-zinc-400" />
      </div>
    );
  }

  if (status === "unauthenticated") {
    redirect("/login");
  }

  const user = session!.user as SessionUser;
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

      {/* Sidebar — desktop always visible, mobile drawer */}
      <aside
        className={`
          fixed md:static inset-y-0 left-0 z-30
          transform transition-transform duration-200 ease-in-out
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
      >
        <Sidebar user={user} onClose={() => setSidebarOpen(false)} />
      </aside>

      {/* Main content */}
      <div className="flex flex-col flex-1 overflow-hidden min-w-0">
        <Topbar
          title={title}
          user={user}
          onMenuClick={() => setSidebarOpen(true)}
        />
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}
