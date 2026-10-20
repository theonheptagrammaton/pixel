export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth-guard";
import { prisma } from "@/lib/prisma";
import { UserRole } from "@prisma/client";
import bcrypt from "bcryptjs";
import { ApiResponse } from "@/types";

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession();

    if (!session?.user || session.user.role !== UserRole.SUPER_ADMIN) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Bu islem icin yetkiniz yok." },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { password } = body;

    if (!password || password.length < 6) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Sifre en az 6 karakter olmalidir." },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({ where: { id: params.id } });
    if (!user) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Kullanici bulunamadi." },
        { status: 404 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    await prisma.user.update({
      where: { id: params.id },
      data: { password: hashedPassword },
    });

    return NextResponse.json<ApiResponse>({
      success: true,
      data: { message: "Sifre guncellendi." },
    });
  } catch (error) {
    console.error("[PUT /api/users/[id]/password]", error);
    return NextResponse.json<ApiResponse>(
      { success: false, error: "Sunucu hatasi." },
      { status: 500 }
    );
  }
}
