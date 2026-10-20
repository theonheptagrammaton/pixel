export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth-guard";
import { prisma } from "@/lib/prisma";
import { ApiResponse } from "@/types";

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Oturum acmaniz gerekiyor." },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { name, phone } = body as { name?: string; phone?: string };

    if (!name?.trim()) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Ad Soyad zorunludur." },
        { status: 400 }
      );
    }

    if (!phone?.trim()) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Telefon numarasi zorunludur." },
        { status: 400 }
      );
    }

    const user = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        name: name.trim(),
        phone: phone.trim(),
        onboarded: true,
      },
      select: {
        id: true,
        email: true,
        username: true,
        name: true,
        role: true,
        onboarded: true,
      },
    });

    return NextResponse.json<ApiResponse>({ success: true, data: { user } });
  } catch (error) {
    console.error("[POST /api/onboarding]", error);
    return NextResponse.json<ApiResponse>(
      { success: false, error: "Sunucu hatasi." },
      { status: 500 }
    );
  }
}
