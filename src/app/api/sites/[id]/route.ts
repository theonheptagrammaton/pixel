export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth-guard";
import { prisma } from "@/lib/prisma";
import { removeDomainFromApplication } from "@/lib/traefik";
import { ApiResponse } from "@/types";

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

    const site = await prisma.site.findUnique({ where: { id: params.id } });
    if (!site) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Site bulunamadi." },
        { status: 404 }
      );
    }

    if (site.userId !== session.user.id) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Bu siteyi silme yetkiniz yok." },
        { status: 403 }
      );
    }

    // Remove custom domain from Traefik before deleting
    if (site.customDomain) {
      try {
        await removeDomainFromApplication(site.customDomain);
      } catch (err) {
        console.error("[DELETE /api/sites/[id]] Traefik remove failed:", err);
      }
    }

    await prisma.site.delete({ where: { id: params.id } });

    return NextResponse.json<ApiResponse>({ success: true, data: null });
  } catch (error) {
    console.error("[DELETE /api/sites/[id]]", error);
    return NextResponse.json<ApiResponse>(
      { success: false, error: "Sunucu hatasi." },
      { status: 500 }
    );
  }
}
