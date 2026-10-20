export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth-guard";
import { prisma } from "@/lib/prisma";
import { checkRateLimit, rateLimitResponse } from "@/lib/rate-limit";
import { ApiResponse } from "@/types";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/ğ/g, "g")
    .replace(/ü/g, "u")
    .replace(/ş/g, "s")
    .replace(/ı/g, "i")
    .replace(/ö/g, "o")
    .replace(/ç/g, "c")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

// GET /api/sites/[id]/blog — Paginated blog post list (includes drafts)
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Oturum acmaniz gerekiyor." },
        { status: 401 }
      );
    }

    const site = await prisma.site.findUnique({
      where: { id: params.id },
      select: { id: true, userId: true },
    });

    if (!site) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Site bulunamadi." },
        { status: 404 }
      );
    }

    if (site.userId !== session.user.id) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Bu siteye erisim yetkiniz yok." },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(req.url);
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get("limit") || "10", 10)));
    const category = searchParams.get("category") || undefined;

    const where = {
      siteId: params.id,
      ...(category ? { category } : {}),
    };

    const [posts, total, allCategories] = await Promise.all([
      prisma.blogPost.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.blogPost.count({ where }),
      prisma.blogPost.findMany({
        where: { siteId: params.id, NOT: { category: "" } },
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
    console.error("[GET /api/sites/[id]/blog]", error);
    return NextResponse.json<ApiResponse>(
      { success: false, error: "Sunucu hatasi." },
      { status: 500 }
    );
  }
}

// POST /api/sites/[id]/blog — Create a new blog post
export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Oturum acmaniz gerekiyor." },
        { status: 401 }
      );
    }

    const rl = checkRateLimit(`blog-create:${session.user.id}`, 20, 60_000);
    if (!rl.allowed) return rateLimitResponse(rl.resetAt);

    const site = await prisma.site.findUnique({
      where: { id: params.id },
      select: { id: true, userId: true },
    });

    if (!site) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Site bulunamadi." },
        { status: 404 }
      );
    }

    if (site.userId !== session.user.id) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Bu siteye erisim yetkiniz yok." },
        { status: 403 }
      );
    }

    const body = await req.json();
    const {
      title,
      content,
      excerpt,
      coverImage,
      category,
      author,
      readTime,
      isPublished,
    } = body as {
      title?: string;
      content?: string;
      excerpt?: string;
      coverImage?: string;
      category?: string;
      author?: string;
      readTime?: string;
      isPublished?: boolean;
    };

    if (!title?.trim()) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Baslik zorunludur." },
        { status: 400 }
      );
    }

    // Generate slug and ensure uniqueness for this site
    let baseSlug = slugify(title);
    if (!baseSlug) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Basliktan gecerli bir slug olusturulamadi." },
        { status: 400 }
      );
    }

    let slug = baseSlug;
    let suffix = 1;
    while (true) {
      const existing = await prisma.blogPost.findUnique({
        where: { siteId_slug: { siteId: params.id, slug } },
        select: { id: true },
      });
      if (!existing) break;
      slug = `${baseSlug}-${suffix}`;
      suffix++;
    }

    const post = await prisma.blogPost.create({
      data: {
        siteId: params.id,
        title: title.trim(),
        slug,
        content: content || "",
        excerpt: excerpt || "",
        coverImage: coverImage || "",
        category: category || "",
        author: author || "",
        readTime: readTime || "",
        isPublished: isPublished ?? false,
        publishedAt: isPublished ? new Date() : null,
      },
    });

    return NextResponse.json<ApiResponse>(
      { success: true, data: { post } },
      { status: 201 }
    );
  } catch (error) {
    console.error("[POST /api/sites/[id]/blog]", error);
    return NextResponse.json<ApiResponse>(
      { success: false, error: "Sunucu hatasi." },
      { status: 500 }
    );
  }
}
