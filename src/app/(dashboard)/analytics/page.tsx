import { requireAuth } from "@/lib/auth-guard";
import { prisma } from "@/lib/prisma";
import { AnalyticsDashboard } from "@/components/analytics/AnalyticsDashboard";

export const metadata = {
  title: "Analitik",
};

export default async function AnalyticsPage() {
  const session = await requireAuth();

  const site = await prisma.site.findFirst({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    select: { id: true },
  });

  if (!site) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-white border border-zinc-200 rounded-lg p-10 text-center">
          <p className="text-sm font-medium text-zinc-900">Once bir site olusturun</p>
          <p className="text-sm text-zinc-500 mt-1">
            Analitik verilerini gorebilmek icin once bir site olusturmaniz gerekiyor.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <AnalyticsDashboard siteId={site.id} />
    </div>
  );
}
