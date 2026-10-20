import { requireAuth } from "@/lib/auth-guard";
import { prisma } from "@/lib/prisma";
import { SettingsTabs } from "@/components/settings/SettingsTabs";

export const metadata = { title: "Ayarlar" };

export default async function SettingsPage() {
  const session = await requireAuth();

  const site = await prisma.site.findFirst({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  });

  const template = site
    ? await prisma.template.findUnique({
        where: { id: site.templateId },
        select: { name: true },
      })
    : null;

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-zinc-900">Ayarlar</h2>
        <p className="mt-1 text-sm text-zinc-500">Site ayarlarınızı yönetin.</p>
      </div>
      <SettingsTabs site={site} templateName={template?.name ?? null} />
    </div>
  );
}
