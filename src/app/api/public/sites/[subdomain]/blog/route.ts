export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ApiResponse } from "@/types";

// GET /api/public/sites/[subdomain]/blog — Public published blog posts
export async function GET(
  req: NextRequest,
  { params }: { params: { subdomain: string } }
) {
  try {
    const site = await prisma.site.findUnique({
      where: { subdomain: params.subdomain },
      select: { id: true, isPublished: true },
    });

    if (!site || !site.isPublished) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Site bulunamadi." },
        { status: 404 }
      );
    }

    const { searchParams } = new URL(req.url);
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get("limit") || "9", 10)));
    const category = searchParams.get("category") || undefined;

    const where = {
      siteId: site.id,
      isPublished: true,
      ...(category ? { category } : {}),
    };

    const [posts, total, allCategories] = await Promise.all([
      prisma.blogPost.findMany({
        where,
        orderBy: { publishedAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.blogPost.count({ where }),
      prisma.blogPost.findMany({
        where: { siteId: site.id, isPublished: true, NOT: { category: "" } },
        select: { category: true },
        distinct: ["category"],
        orderBy: { category: "asc" },
      }),
    ]);

    const totalPages = Math.ceil(total / limit);
    const categories = allCategories.map((c) => c.category);

    return NextResponse.json<ApiResponse>({
      success: true,
      data: { posts, total, page, totalPages, categories },
    });
  } catch (error) {
    console.error("[GET /api/public/sites/[subdomain]/blog]", error);
    return NextResponse.json<ApiResponse>(
      { success: false, error: "Sunucu hatasi." },
      { status: 500 }
    );
  }
}
