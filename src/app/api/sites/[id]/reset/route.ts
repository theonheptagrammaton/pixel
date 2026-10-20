export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth-guard";
import { prisma } from "@/lib/prisma";
import { ApiResponse } from "@/types";

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

    const site = await prisma.site.findUnique({
      where: { id: params.id },
    });
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

    const template = await prisma.template.findUnique({
      where: { id: site.templateId },
      select: { defaultConfig: true },
    });

    if (!template) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Sablon bulunamadi." },
        { status: 404 }
      );
    }

    const updated = await prisma.site.update({
      where: { id: params.id },
      data: {
        isPublished: false,
        config: template.defaultConfig as object,
      },
    });

    return NextResponse.json<ApiResponse>({ success: true, data: { site: updated } });
  } catch (error) {
    console.error("[PUT /api/sites/[id]/reset]", error);
    return NextResponse.json<ApiResponse>(
      { success: false, error: "Sunucu hatasi." },
      { status: 500 }
    );
  }
}
