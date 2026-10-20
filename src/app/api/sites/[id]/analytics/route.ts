import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth-guard";
import { prisma } from "@/lib/prisma";
import { ApiResponse } from "@/types";

interface DailyView {
  date: string;
  views: number;
}

interface PageStat {
  path: string;
  views: number;
}

interface ReferrerStat {
  referrer: string;
  views: number;
}

interface AnalyticsData {
  totalViews: number;
  uniquePaths: number;
  dailyViews: DailyView[];
  topPages: PageStat[];
  topReferrers: ReferrerStat[];
}

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getSession();
  if (!session?.user) {
    return NextResponse.json<ApiResponse>(
      { success: false, error: "Yetkisiz erisim" },
      { status: 401 }
    );
  }

  const site = await prisma.site.findUnique({
    where: { id: params.id },
    select: { id: true, userId: true },
  });

  if (!site) {
    return NextResponse.json<ApiResponse>(
      { success: false, error: "Site bulunamadi" },
      { status: 404 }
    );
  }

  if (site.userId !== session.user.id && session.user.role !== "SUPER_ADMIN") {
    return NextResponse.json<ApiResponse>(
      { success: false, error: "Yetkisiz erisim" },
      { status: 403 }
    );
  }

  const daysParam = parseInt(req.nextUrl.searchParams.get("days") || "7", 10);
  const days = Math.min(Math.max(daysParam, 1), 90);

  const since = new Date();
  since.setDate(since.getDate() - days);
  since.setHours(0, 0, 0, 0);

  const [totalViews, pathGroups, referrerGroups, dailyRaw] = await Promise.all([
    prisma.pageView.count({
      where: { siteId: site.id, createdAt: { gte: since } },
    }),
    prisma.pageView.groupBy({
      by: ["path"],
      where: { siteId: site.id, createdAt: { gte: since } },
      _count: { id: true },
      orderBy: { _count: { id: "desc" } },
      take: 10,
    }),
    prisma.pageView.groupBy({
      by: ["referrer"],
      where: {
        siteId: site.id,
        createdAt: { gte: since },
        referrer: { not: "" },
      },
      _count: { id: true },
      orderBy: { _count: { id: "desc" } },
      take: 10,
    }),
    // For daily views, use raw query to group by date
    prisma.$queryRaw<Array<{ day: Date; count: bigint }>>`
      SELECT DATE("createdAt") as day, COUNT(*)::bigint as count
      FROM "PageView"
      WHERE "siteId" = ${site.id} AND "createdAt" >= ${since}
      GROUP BY DATE("createdAt")
      ORDER BY day ASC
    `,
  ]);

  // Build daily views with zero-fill
  const dailyMap = new Map<string, number>();
  for (let i = 0; i < days; i++) {
    const d = new Date(since);
    d.setDate(d.getDate() + i);
    dailyMap.set(d.toISOString().slice(0, 10), 0);
  }
  for (const row of dailyRaw) {
    const key =
      row.day instanceof Date
        ? row.day.toISOString().slice(0, 10)
        : String(row.day).slice(0, 10);
    dailyMap.set(key, Number(row.count));
  }

  const dailyViews: DailyView[] = Array.from(dailyMap.entries()).map(
    ([date, views]) => ({ date, views })
  );

  const topPages: PageStat[] = pathGroups.map((g) => ({
    path: g.path,
    views: g._count.id,
  }));

  const topReferrers: ReferrerStat[] = referrerGroups.map((g) => ({
    referrer: g.referrer,
    views: g._count.id,
  }));

  const data: AnalyticsData = {
    totalViews,
    uniquePaths: pathGroups.length,
    dailyViews,
    topPages,
    topReferrers,
  };

  return NextResponse.json<ApiResponse<AnalyticsData>>({
    success: true,
    data,
  });
}
