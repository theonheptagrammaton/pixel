import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { SiteConfig } from "@/types/template";

const ROOT_DOMAIN = process.env.NEXT_PUBLIC_ROOT_DOMAIN ?? "localhost:3000";

export async function GET(
  _req: NextRequest,
  { params }: { params: { subdomain: string } }
) {
  const { subdomain } = params;

  const site = await prisma.site.findFirst({
    where: { subdomain, isPublished: true },
    include: { blogPosts: { where: { isPublished: true } } },
  });

  if (!site) {
    return NextResponse.json({ error: "Site bulunamadi" }, { status: 404 });
  }

  const config = site.config as unknown as SiteConfig;
  const protocol = ROOT_DOMAIN.includes("localhost") ? "http" : "https";
  const baseUrl = `${protocol}://${subdomain}.${ROOT_DOMAIN}`;

  const urls: string[] = [];

  // Pages
  if (config?.pages) {
    for (const page of config.pages) {
      const loc = page.slug === "" ? baseUrl : `${baseUrl}/${page.slug}`;
      const priority = page.slug === "" ? "1.0" : "0.8";
      urls.push(
        `  <url>
    <loc>${escapeXml(loc)}</loc>
    <lastmod>${site.updatedAt.toISOString()}</lastmod>
    <priority>${priority}</priority>
  </url>`
      );
    }
  }

  // Blog posts
  if (site.blogPosts) {
    for (const post of site.blogPosts) {
      urls.push(
        `  <url>
    <loc>${escapeXml(`${baseUrl}/blog/${post.slug}`)}</loc>
    <lastmod>${post.updatedAt.toISOString()}</lastmod>
    <priority>0.6</priority>
  </url>`
      );
    }
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join("\n")}
</urlset>`;

  return new NextResponse(xml, {
    headers: { "Content-Type": "application/xml" },
  });
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}
