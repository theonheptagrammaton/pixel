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

// GET /api/sites/[id]/blog/[postId] — Get a single post
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string; postId: string } }
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

    const post = await prisma.blogPost.findFirst({
      where: { id: params.postId, siteId: params.id },
    });

    if (!post) {
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
    console.error("[GET /api/sites/[id]/blog/[postId]]", error);
    return NextResponse.json<ApiResponse>(
      { success: false, error: "Sunucu hatasi." },
      { status: 500 }
    );
  }
}

// PUT /api/sites/[id]/blog/[postId] — Update a post
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string; postId: string } }
) {
  try {
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Oturum acmaniz gerekiyor." },
        { status: 401 }
      );
    }

    const rl = checkRateLimit(`blog-update:${session.user.id}`, 30, 60_000);
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

    const existingPost = await prisma.blogPost.findFirst({
      where: { id: params.postId, siteId: params.id },
    });

    if (!existingPost) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Yazi bulunamadi." },
        { status: 404 }
      );
    }

    const body = await req.json();
    const {
      title,
      slug: rawSlug,
      content,
      excerpt,
      coverImage,
      category,
      author,
      readTime,
      isPublished,
    } = body as {
      title?: string;
      slug?: string;
      content?: string;
      excerpt?: string;
      coverImage?: string;
      category?: string;
      author?: string;
      readTime?: string;
      isPublished?: boolean;
    };

    // Build update data
    const updateData: Record<string, unknown> = {};

    if (title !== undefined) {
      if (!title.trim()) {
        return NextResponse.json<ApiResponse>(
          { success: false, error: "Baslik bos olamaz." },
          { status: 400 }
        );
      }
      updateData.title = title.trim();
    }

    // Handle slug change
    if (rawSlug !== undefined) {
      const newSlug = slugify(rawSlug);
      if (!newSlug) {
        return NextResponse.json<ApiResponse>(
          { success: false, error: "Gecersiz slug." },
          { status: 400 }
        );
      }

      if (newSlug !== existingPost.slug) {
        const conflict = await prisma.blogPost.findUnique({
          where: { siteId_slug: { siteId: params.id, slug: newSlug } },
          select: { id: true },
        });
        if (conflict && conflict.id !== params.postId) {
          return NextResponse.json<ApiResponse>(
            { success: false, error: "Bu slug zaten kullaniliyor." },
            { status: 409 }
          );
        }
        updateData.slug = newSlug;
      }
    }

    if (content !== undefined) updateData.content = content;
    if (excerpt !== undefined) updateData.excerpt = excerpt;
    if (coverImage !== undefined) updateData.coverImage = coverImage;
    if (category !== undefined) updateData.category = category;
    if (author !== undefined) updateData.author = author;
    if (readTime !== undefined) updateData.readTime = readTime;

    // Handle publish state transition
    if (isPublished !== undefined) {
      updateData.isPublished = isPublished;
      if (isPublished && !existingPost.isPublished) {
        updateData.publishedAt = new Date();
      }
    }

    const post = await prisma.blogPost.update({
      where: { id: params.postId },
      data: updateData,
    });

    return NextResponse.json<ApiResponse>({
      success: true,
      data: { post },
    });
  } catch (error) {
    console.error("[PUT /api/sites/[id]/blog/[postId]]", error);
    return NextResponse.json<ApiResponse>(
      { success: false, error: "Sunucu hatasi." },
      { status: 500 }
    );
  }
}

// DELETE /api/sites/[id]/blog/[postId] — Delete a post
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string; postId: string } }
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
        { success: false, error: "Bu yaziyi silme yetkiniz yok." },
        { status: 403 }
      );
    }

    const existingPost = await prisma.blogPost.findFirst({
      where: { id: params.postId, siteId: params.id },
    });

    if (!existingPost) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Yazi bulunamadi." },
        { status: 404 }
      );
    }

    await prisma.blogPost.delete({ where: { id: params.postId } });

    return NextResponse.json<ApiResponse>({ success: true, data: null });
  } catch (error) {
    console.error("[DELETE /api/sites/[id]/blog/[postId]]", error);
    return NextResponse.json<ApiResponse>(
      { success: false, error: "Sunucu hatasi." },
      { status: 500 }
    );
  }
}
