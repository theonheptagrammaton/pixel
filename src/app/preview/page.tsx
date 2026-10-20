export const dynamic = "force-dynamic";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { SiteConfig } from "@/types/template";
import { PreviewShell } from "@/components/templates/preview-shell";
import { generateSiteConfig, SECTORS } from "@/lib/ai-site-generator";

interface PreviewPageProps {
  searchParams: { subdomain?: string; siteId?: string; template?: string; demo?: string };
}

export default async function PreviewPage({ searchParams }: PreviewPageProps) {
  const { subdomain, siteId, template: templateSlug, demo } = searchParams;

  // ── Template demo mode (no auth required) ────────────────────────────────
  if (templateSlug && demo === "true") {
    const sector = SECTORS.find((s) => s.templateSlug === templateSlug) ?? SECTORS[0];
    const config = generateSiteConfig("Demo İşletme", sector.id) as SiteConfig;
    return (
      <main>
        <PreviewShell config={config} siteId="" siteSubdomain="" />
      </main>
    );
  }

  // ── Authenticated site preview ────────────────────────────────────────────
  const session = await getServerSession(authOptions);
  if (!session) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh", fontFamily: "system-ui" }}>
        <p style={{ color: "#71717a" }}>Önizleme için giriş yapmanız gerekiyor.</p>
      </div>
    );
  }

  const site = await prisma.site.findFirst({
    where: siteId
      ? { id: siteId }
      : subdomain
      ? { subdomain }
      : undefined,
  });

  if (!site) notFound();

  // Allow site owner or super admin
  if (site.userId !== session.user.id && session.user.role !== "SUPER_ADMIN") {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh", fontFamily: "system-ui" }}>
        <p style={{ color: "#71717a" }}>Bu siteyi görüntüleme yetkiniz yok.</p>
      </div>
    );
  }

  const config = site.config as unknown as SiteConfig;

  return (
    <main>
      <PreviewShell config={config} siteId={site.id} siteSubdomain={site.subdomain} />
    </main>
  );
}
