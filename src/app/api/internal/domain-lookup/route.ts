export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const domain = req.nextUrl.searchParams.get("domain");
  if (!domain) {
    return NextResponse.json({ site: null });
  }

  try {
    const site = await prisma.site.findUnique({
      where: { customDomain: domain },
      select: { subdomain: true, isPublished: true, domainVerified: true },
    });
    return NextResponse.json({ site });
  } catch {
    return NextResponse.json({ site: null });
  }
}
