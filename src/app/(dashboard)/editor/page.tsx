import { requireAuth } from "@/lib/auth-guard";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { EditorShell } from "@/components/editor/EditorShell";
import EditorMobileGuard from "@/components/editor/EditorMobileGuard";
import type { SiteConfig } from "@/types/template";

export const metadata = {
  title: "Editor",
};

export default async function EditorPage() {
  const session = await requireAuth();

  const site = await prisma.site.findFirst({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  });

  if (!site) {
    return (
      <div className="max-w-md mx-auto mt-24 text-center">
        <div className="bg-white border border-zinc-200 rounded-lg p-8">
          <h3 className="text-lg font-semibold text-zinc-900 mb-2">Henuz bir siteniz yok</h3>
          <p className="text-sm text-zinc-500 mb-6">Editoru kullanabilmek icin once bir sablon secip sitenizi olusturmaniz gerekiyor.</p>
          <Link href="/templates" className="inline-flex items-center justify-center bg-zinc-900 text-white text-sm font-medium px-5 py-2.5 rounded-md hover:bg-zinc-800 transition-colors">
            Sablon Sec
          </Link>
        </div>
      </div>
    );
  }

  return (
    <EditorMobileGuard>
      <EditorShell
        site={{
          id: site.id,
          subdomain: site.subdomain,
          customDomain: site.customDomain,
          domainVerified: site.domainVerified,
          templateId: site.templateId,
          isPublished: site.isPublished,
          createdAt: site.createdAt.toISOString(),
          updatedAt: site.updatedAt.toISOString(),
        }}
        initialConfig={site.config as unknown as SiteConfig}
      />
    </EditorMobileGuard>
  );
}
