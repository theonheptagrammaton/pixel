export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth-guard";
import { prisma } from "@/lib/prisma";
import { ApiResponse, SiteConfig } from "@/types";

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

    const site = await prisma.site.findUnique({ where: { id: params.id } });
    if (!site) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Site bulunamadi." },
        { status: 404 }
      );
    }

    if (site.userId !== session.user.id) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Bu siteyi duzenleme yetkiniz yok." },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { config } = body as { config: SiteConfig };

    if (!config || typeof config !== "object") {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Gecersiz config formati." },
        { status: 400 }
      );
    }

    const updated = await prisma.site.update({
      where: { id: params.id },
      data: { config: config as object },
    });

    return NextResponse.json<ApiResponse>({ success: true, data: { site: updated } });
  } catch (error) {
    console.error("[PUT /api/sites/[id]/config]", error);
    return NextResponse.json<ApiResponse>(
      { success: false, error: "Sunucu hatasi." },
      { status: 500 }
    );
  }
}
