export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth-guard";
import { ApiResponse } from "@/types";
import { emailForUsername } from "@/lib/user-email";

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.user || session.user.role !== "SUPER_ADMIN") {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Bu islem icin yetkiniz yok." },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { username, password, name } = body;

    // Validation
    if (!username || !password) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "username ve password zorunludur." },
        { status: 400 }
      );
    }

    if (username.length < 3) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Kullanici adi en az 3 karakter olmalidir." },
        { status: 400 }
      );
    }

    if (!/^[a-z0-9_-]+$/.test(username.toLowerCase())) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: "Kullanici adi sadece kucuk harf, rakam, - ve _ icermelidir.",
        },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Sifre en az 6 karakter olmalidir." },
        { status: 400 }
      );
    }

    // Check username uniqueness
    const existing = await prisma.user.findFirst({
      where: { username: username.toLowerCase() },
    });

    if (existing) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Bu kullanici adi zaten kullaniliyor." },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        username: username.toLowerCase(),
        email: emailForUsername(username),
        password: hashedPassword,
        name: name?.trim() || null,
        onboarded: false,
      },
      select: {
        id: true,
        email: true,
        username: true,
        name: true,
      },
    });

    return NextResponse.json<ApiResponse>(
      { success: true, data: { user } },
      { status: 201 }
    );
  } catch (error) {
    console.error("[POST /api/auth/register]", error);
    return NextResponse.json<ApiResponse>(
      { success: false, error: "Sunucu hatasi. Lutfen tekrar deneyin." },
      { status: 500 }
    );
  }
}
