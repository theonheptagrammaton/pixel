import { requireAuth } from "@/lib/auth-guard";
import { prisma } from "@/lib/prisma";
import { TemplatesClient } from "@/components/dashboard/TemplatesClient";

export const metadata = {
  title: "Sablonlar",
};

export default async function TemplatesPage() {
  const session = await requireAuth();

  const [templates, existingSite] = await Promise.all([
    prisma.template.findMany({
      where: { isActive: true },
      orderBy: { createdAt: "asc" },
    }),
    prisma.site.findFirst({
      where: { userId: session.user.id },
    }),
  ]);

  return (
    <TemplatesClient
      templates={templates.map((t) => ({
        id: t.id,
        name: t.name,
        slug: t.slug,
        description: t.description,
        thumbnail: t.thumbnail,
        category: t.category,
      }))}
      existingSiteId={existingSite?.id ?? null}
    />
  );
}
