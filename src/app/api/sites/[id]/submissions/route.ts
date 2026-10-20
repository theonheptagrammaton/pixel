export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth-guard";
import { prisma } from "@/lib/prisma";
import { ApiResponse } from "@/types";

async function verifySiteOwnership(siteId: string, userId: string) {
  const site = await prisma.site.findUnique({
    where: { id: siteId },
    select: { id: true, userId: true },
  });

  if (!site) return { error: "Site bulunamadi.", status: 404 };
  if (site.userId !== userId) return { error: "Bu siteye erisim yetkiniz yok.", status: 403 };
  return { site };
}

// GET /api/sites/[id]/submissions — Paginated submissions list
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

    const check = await verifySiteOwnership(params.id, session.user.id);
    if ("error" in check) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: check.error },
        { status: check.status }
      );
    }

    const { searchParams } = new URL(req.url);
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get("limit") || "20", 10)));
    const unreadOnly = searchParams.get("unreadOnly") === "true";

    const where = {
      siteId: params.id,
      ...(unreadOnly ? { isRead: false } : {}),
    };

    const [submissions, total, unreadCount] = await Promise.all([
      prisma.contactSubmission.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.contactSubmission.count({ where }),
      prisma.contactSubmission.count({
        where: { siteId: params.id, isRead: false },
      }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return NextResponse.json<ApiResponse>({
      success: true,
      data: { submissions, total, page, totalPages, unreadCount },
    });
  } catch (error) {
    console.error("[GET /api/sites/[id]/submissions]", error);
    return NextResponse.json<ApiResponse>(
      { success: false, error: "Sunucu hatasi." },
      { status: 500 }
    );
  }
}

// PUT /api/sites/[id]/submissions — Bulk update read status
export async function PUT(
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

    const check = await verifySiteOwnership(params.id, session.user.id);
    if ("error" in check) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: check.error },
        { status: check.status }
      );
    }

    const body = await req.json();
    const { ids, isRead } = body as { ids?: string[]; isRead?: boolean };

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Gecersiz ID listesi." },
        { status: 400 }
      );
    }

    if (typeof isRead !== "boolean") {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "isRead alani zorunludur." },
        { status: 400 }
      );
    }

    await prisma.contactSubmission.updateMany({
      where: {
        id: { in: ids },
        siteId: params.id,
      },
      data: { isRead },
    });

    return NextResponse.json<ApiResponse>({ success: true });
  } catch (error) {
    console.error("[PUT /api/sites/[id]/submissions]", error);
    return NextResponse.json<ApiResponse>(
      { success: false, error: "Sunucu hatasi." },
      { status: 500 }
    );
  }
}

// DELETE /api/sites/[id]/submissions — Bulk delete
export async function DELETE(
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

    const check = await verifySiteOwnership(params.id, session.user.id);
    if ("error" in check) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: check.error },
        { status: check.status }
      );
    }

    const body = await req.json();
    const { ids } = body as { ids?: string[] };

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Gecersiz ID listesi." },
        { status: 400 }
      );
    }

    await prisma.contactSubmission.deleteMany({
      where: {
        id: { in: ids },
        siteId: params.id,
      },
    });

    return NextResponse.json<ApiResponse>({ success: true });
  } catch (error) {
    console.error("[DELETE /api/sites/[id]/submissions]", error);
    return NextResponse.json<ApiResponse>(
      { success: false, error: "Sunucu hatasi." },
      { status: 500 }
    );
  }
}
