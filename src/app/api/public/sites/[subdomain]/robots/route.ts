import { NextRequest, NextResponse } from "next/server";

const ROOT_DOMAIN = process.env.NEXT_PUBLIC_ROOT_DOMAIN ?? "localhost:3000";

export async function GET(
  _req: NextRequest,
  { params }: { params: { subdomain: string } }
) {
  const { subdomain } = params;
  const protocol = ROOT_DOMAIN.includes("localhost") ? "http" : "https";

  const body = `User-agent: *
Allow: /
Sitemap: ${protocol}://${subdomain}.${ROOT_DOMAIN}/sitemap.xml
`;

  return new NextResponse(body, {
    headers: { "Content-Type": "text/plain" },
  });
}
