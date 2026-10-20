export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { checkRateLimit, rateLimitResponse } from "@/lib/rate-limit";
import { ApiResponse } from "@/types";

// POST /api/public/sites/[subdomain]/contact — Public contact form submission
export async function POST(
  req: NextRequest,
  { params }: { params: { subdomain: string } }
) {
  try {
    const body = await req.json();
    const { fields, honeypot } = body as {
      fields?: Record<string, string>;
      honeypot?: string;
    };

    // Honeypot trap — return 200 silently to confuse spam bots
    if (honeypot) {
      return NextResponse.json<ApiResponse>({ success: true });
    }

    if (!fields || typeof fields !== "object" || Object.keys(fields).length === 0) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Form alanlari bos olamaz." },
        { status: 400 }
      );
    }

    const site = await prisma.site.findUnique({
      where: { subdomain: params.subdomain },
      select: { id: true, isPublished: true },
    });

    if (!site || !site.isPublished) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Site bulunamadi." },
        { status: 404 }
      );
    }

    // Rate limit: 3 submissions per minute per IP per site
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
    const rl = checkRateLimit(`contact:${ip}:${site.id}`, 3, 60_000);
    if (!rl.allowed) {
      return rateLimitResponse(rl.resetAt);
    }

    await prisma.contactSubmission.create({
      data: {
        siteId: site.id,
        data: fields,
        ipAddress: ip,
      },
    });

    return NextResponse.json<ApiResponse>({ success: true });
  } catch (error) {
    console.error("[POST /api/public/sites/[subdomain]/contact]", error);
    return NextResponse.json<ApiResponse>(
      { success: false, error: "Sunucu hatasi." },
      { status: 500 }
    );
  }
}
