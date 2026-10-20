export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ApiResponse } from "@/types";

// GET /api/public/sites/[subdomain]/blog/[slug] — Single published post by slug
export async function GET(
  req: NextRequest,
  { params }: { params: { subdomain: string; slug: string } }
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

    const post = await prisma.blogPost.findUnique({
      where: {
        siteId_slug: { siteId: site.id, slug: params.slug },
      },
    });

    if (!post || !post.isPublished) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Yazi bulunamadi." },
        { status: 404 }
      );
    }

    return NextResponse.json<ApiResponse>({
      success: true,
      data: { post },
    });
  } catch (error) {
    console.error("[GET /api/public/sites/[subdomain]/blog/[slug]]", error);
    return NextResponse.json<ApiResponse>(
      { success: false, error: "Sunucu hatasi." },
      { status: 500 }
    );
  }
}
