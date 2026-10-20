export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth-guard";
import { prisma } from "@/lib/prisma";
import { ApiResponse } from "@/types";

export async function GET() {
  try {
    const session = await getSession();
    if (!session?.user || session.user.role !== "SUPER_ADMIN") {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Bu islem icin yetkiniz yok." },
        { status: 403 }
      );
    }

    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const [totalUsers, totalSites, publishedSites, newUsersThisWeek] =
      await Promise.all([
        prisma.user.count(),
        prisma.site.count(),
        prisma.site.count({ where: { isPublished: true } }),
        prisma.user.count({ where: { createdAt: { gte: oneWeekAgo } } }),
      ]);

    return NextResponse.json<ApiResponse>({
      success: true,
      data: { totalUsers, totalSites, publishedSites, newUsersThisWeek },
    });
  } catch (error) {
    console.error("[GET /api/admin/stats]", error);
    return NextResponse.json<ApiResponse>(
      { success: false, error: "Sunucu hatasi." },
      { status: 500 }
    );
  }
}
