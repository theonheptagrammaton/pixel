export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth-guard";
import { prisma } from "@/lib/prisma";
import { ApiResponse } from "@/types";

export async function GET() {
  try {
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Oturum acmaniz gerekiyor." },
        { status: 401 }
      );
    }

    const site = await prisma.site.findFirst({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json<ApiResponse>({
      success: true,
      data: { site: site ?? null },
    });
  } catch (error) {
    console.error("[GET /api/sites/my]", error);
    return NextResponse.json<ApiResponse>(
      { success: false, error: "Sunucu hatasi." },
      { status: 500 }
    );
  }
}
