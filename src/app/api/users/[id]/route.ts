export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth-guard";
import { prisma } from "@/lib/prisma";
import { UserRole } from "@prisma/client";
import { ApiResponse } from "@/types";
import { emailForUsername } from "@/lib/user-email";
import bcrypt from "bcryptjs";

function isSuperAdmin(session: Awaited<ReturnType<typeof getSession>>) {
  return session?.user?.role === UserRole.SUPER_ADMIN;
}

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession();
    if (!isSuperAdmin(session)) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Bu islem icin yetkiniz yok." },
        { status: 403 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: params.id },
      include: { sites: true },
    });

    if (!user) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Kullanici bulunamadi." },
        { status: 404 }
      );
    }

    // Exclude hashed password
    const { password: _p, ...safeUser } = user;
    void _p;
    return NextResponse.json<ApiResponse>({ success: true, data: { user: safeUser } });
  } catch (error) {
    console.error("[GET /api/users/[id]]", error);
    return NextResponse.json<ApiResponse>(
      { success: false, error: "Sunucu hatasi." },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession();
    if (!isSuperAdmin(session)) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Bu islem icin yetkiniz yok." },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { username, name, password } = body;

    if (!username) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "username zorunludur." },
        { status: 400 }
      );
    }

    if (!/^[a-z0-9_-]+$/.test(username.toLowerCase())) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Gecersiz kullanici adi formati." },
        { status: 400 }
      );
    }

    // Check username uniqueness excluding this user
    const existing = await prisma.user.findFirst({
      where: {
        AND: [
          { id: { not: params.id } },
          { username: username.toLowerCase() },
        ],
      },
    });

    if (existing) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Bu kullanici adi zaten kullaniliyor." },
        { status: 409 }
      );
    }

    // Build update data
    const updateData: Record<string, unknown> = {
      username: username.toLowerCase(),
      email: emailForUsername(username),
      name: name ?? null,
    };

    if (password && password.length >= 6) {
      updateData.password = await bcrypt.hash(password, 12);
    }

    const updated = await prisma.user.update({
      where: { id: params.id },
      data: updateData,
      select: {
        id: true,
        email: true,
        username: true,
        name: true,
        role: true,
        updatedAt: true,
      },
    });

    return NextResponse.json<ApiResponse>({ success: true, data: { user: updated } });
  } catch (error) {
    console.error("[PUT /api/users/[id]]", error);
    return NextResponse.json<ApiResponse>(
      { success: false, error: "Sunucu hatasi." },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession();
    if (!isSuperAdmin(session)) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Bu islem icin yetkiniz yok." },
        { status: 403 }
      );
    }

    // Prevent self-deletion
    if (session!.user.id === params.id) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Kendi hesabinizi silemezsiniz." },
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

    await prisma.user.delete({ where: { id: params.id } });

    return NextResponse.json<ApiResponse>({
      success: true,
      data: { message: "Kullanici silindi." },
    });
  } catch (error) {
    console.error("[DELETE /api/users/[id]]", error);
    return NextResponse.json<ApiResponse>(
      { success: false, error: "Sunucu hatasi." },
      { status: 500 }
    );
  }
}
