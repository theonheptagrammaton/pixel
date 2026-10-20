import { notFound } from "next/navigation";
import { headers } from "next/headers";
import { Metadata } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { SiteConfig, FaqData } from "@/types/template";
import { TemplateRenderer } from "@/components/templates/template-renderer";
import { BlogPostPage } from "@/components/templates/blog-post-page";

interface SitePageProps {
  params: { slug: string[] };
}

async function getSite(subdomain: string, allowUnpublished = false) {
  if (!subdomain) return null;
  if (allowUnpublished) {
    return prisma.site.findFirst({ where: { subdomain } });
  }
  return prisma.site.findFirst({ where: { subdomain, isPublished: true } });
}

function getCanonicalUrl(
  site: { customDomain?: string | null; domainVerified?: boolean | null; subdomain: string },
  pageSlug: string,
  protocol: string
) {
  const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN ?? "localhost:3000";
  if (site.customDomain && site.domainVerified) {
    return `https://${site.customDomain}${pageSlug ? `/${pageSlug}` : ""}`;
  }
  return `${protocol}://${site.subdomain}.${rootDomain}${pageSlug ? `/${pageSlug}` : ""}`;
}

export async function generateMetadata({ params }: SitePageProps): Promise<Metadata> {
  const subdomain = params.slug[0];
  const pageSlug = params.slug.slice(1).join("/") || "";

  const site = await getSite(subdomain);
  if (!site) return { title: "Site Bulunamadi" };

  const config = site.config as unknown as SiteConfig;
  const globalSeo = config?.global?.seo;
  const businessName = config?.global?.general?.businessName || subdomain;
  const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN ?? "localhost:3000";
  const protocol = rootDomain.includes("localhost") ? "http" : "https";
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const siteRecord = site as any;

  const canonicalUrl = getCanonicalUrl(
    { customDomain: siteRecord.customDomain, domainVerified: siteRecord.domainVerified, subdomain },
    pageSlug,
    protocol
  );

  // Blog post metadata
  if (pageSlug.startsWith("blog/") && pageSlug.split("/").length === 2) {
    const postSlug = pageSlug.split("/")[1];
    const blogPost = await prisma.blogPost.findFirst({
      where: { siteId: site.id, slug: postSlug, isPublished: true },
    });
    if (!blogPost) return { title: "Yazi Bulunamadi" };

    const postTitle = blogPost.title;
    const postDescription = blogPost.excerpt || globalSeo?.description || "";
    const postImage = blogPost.coverImage || globalSeo?.ogImage || "";

    return {
      title: postTitle,
      description: postDescription,
      alternates: { canonical: canonicalUrl },
      openGraph: {
        title: postTitle,
        description: postDescription,
        url: canonicalUrl,
        siteName: businessName,
        type: "article",
        locale: "tr_TR",
        images: postImage ? [{ url: postImage, width: 1200, height: 630 }] : [],
        ...(blogPost.publishedAt && {
          publishedTime: blogPost.publishedAt.toISOString(),
        }),
        ...(blogPost.author && { authors: [blogPost.author] }),
      },
      twitter: {
        card: "summary_large_image",
        title: postTitle,
        description: postDescription,
        images: postImage ? [postImage] : [],
        ...(globalSeo?.twitterHandle && { creator: globalSeo.twitterHandle }),
      },
      icons: globalSeo?.favicon ? { icon: globalSeo.favicon } : undefined,
      robots: { index: true, follow: true },
    };
  }

  // Normal page metadata
  const page = config?.pages?.find((p) => p.slug === pageSlug) ?? config?.pages?.[0];
  const title = page?.seo?.title || globalSeo?.title || businessName;
  const description = page?.seo?.description || globalSeo?.description || "";
  const ogImage = page?.seo?.ogImage || globalSeo?.ogImage || "";
  const ogTitle = globalSeo?.ogTitle || title;
  const ogDescription = globalSeo?.ogDescription || description;
  const pageCanonical = page?.seo?.canonicalUrl || canonicalUrl;

  return {
    title,
    description,
    keywords: globalSeo?.keywords?.join(", "),
    alternates: { canonical: pageCanonical },
    openGraph: {
      title: ogTitle,
      description: ogDescription,
      url: pageCanonical,
      siteName: businessName,
      type: "website",
      locale: "tr_TR",
      images: ogImage ? [{ url: ogImage, width: 1200, height: 630 }] : [],
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle,
      description: ogDescription,
      images: ogImage ? [ogImage] : [],
      ...(globalSeo?.twitterHandle && { creator: globalSeo.twitterHandle }),
    },
    icons: globalSeo?.favicon ? { icon: globalSeo.favicon } : undefined,
    robots: { index: true, follow: true },
    ...(globalSeo?.googleVerification && {
      verification: { google: globalSeo.googleVerification },
    }),
  };
}

export default async function SitePage({ params }: SitePageProps) {
  const subdomain = params.slug[0];
  const pageSlug = params.slug.slice(1).join("/") || "";

  // Check if logged-in user is the site owner — allow viewing unpublished sites
  const session = await getServerSession(authOptions);
  const isOwnerOrAdmin = !!session?.user;

  let site = await getSite(subdomain);
  // If site not found (unpublished), check if user is owner
  if (!site && isOwnerOrAdmin) {
    site = await getSite(subdomain, true);
    if (site && site.userId !== session!.user.id && session!.user.role !== "SUPER_ADMIN") {
      site = null;
    }
  }
  if (!site) notFound();

  const config = site.config as unknown as SiteConfig;
  const canViewDrafts = isOwnerOrAdmin && (site.userId === session!.user.id || session!.user.role === "SUPER_ADMIN");

  // When accessed via subdomain rewrite, links like /menu work natively.
  // When accessed directly as /sites/{subdomain}, prefix all internal links.
  const headersList = await headers();
  const isSubdomainRewrite = headersList.get("x-subdomain-rewrite") === "1";
  const basePath = isSubdomainRewrite ? "" : `/sites/${subdomain}`;

  const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN ?? "localhost:3000";
  const protocol = rootDomain.includes("localhost") ? "http" : "https";
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const siteRecord = site as any;
  const canonicalUrl = getCanonicalUrl(
    { customDomain: siteRecord.customDomain, domainVerified: siteRecord.domainVerified, subdomain },
    pageSlug,
    protocol
  );
  const siteBaseUrl = getCanonicalUrl(
    { customDomain: siteRecord.customDomain, domainVerified: siteRecord.domainVerified, subdomain },
    "",
    protocol
  );

  // Blog post routing: /blog/{post-slug}
  if (pageSlug.startsWith("blog/") && pageSlug.split("/").length === 2) {
    const postSlug = pageSlug.split("/")[1];
    const blogPost = await prisma.blogPost.findFirst({
      where: {
        siteId: site.id,
        slug: postSlug,
        // Owner can view draft posts too
        ...(canViewDrafts ? {} : { isPublished: true }),
      },
    });
    if (!blogPost) notFound();

    const blogPostJsonLd = {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      headline: blogPost.title,
      description: blogPost.excerpt,
      image: blogPost.coverImage || undefined,
      datePublished: blogPost.publishedAt?.toISOString() ?? blogPost.createdAt.toISOString(),
      author: blogPost.author ? { "@type": "Person", name: blogPost.author } : undefined,
    };

    const breadcrumbJsonLd = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Ana Sayfa", item: siteBaseUrl },
        { "@type": "ListItem", position: 2, name: "Blog", item: `${siteBaseUrl}/blog` },
        { "@type": "ListItem", position: 3, name: blogPost.title, item: canonicalUrl },
      ],
    };

    return (
      <main>
        <BlogPostPage
          post={{
            title: blogPost.title,
            slug: blogPost.slug,
            content: blogPost.content,
            excerpt: blogPost.excerpt,
            coverImage: blogPost.coverImage,
            category: blogPost.category,
            author: blogPost.author,
            readTime: blogPost.readTime,
            publishedAt: blogPost.publishedAt?.toISOString() ?? null,
            createdAt: blogPost.createdAt.toISOString(),
          }}
          config={config}
          basePath={basePath}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(blogPostJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
        />
      </main>
    );
  }

  // Verify page exists
  if (!config?.pages?.length) notFound();
  const pageExists = pageSlug === "" || config.pages.some((p) => p.slug === pageSlug);
  if (!pageExists) notFound();

  const isHomePage = pageSlug === "";

  // LocalBusiness JSON-LD for homepage
  const localBusinessJsonLd = isHomePage
    ? {
        "@context": "https://schema.org",
        "@type": "LocalBusiness",
        name: config?.global?.general?.businessName ?? "",
        description: config?.global?.seo?.description ?? "",
        telephone: config?.global?.general?.phone ?? "",
        email: config?.global?.general?.email ?? "",
        address: config?.global?.general?.address ?? "",
        url: siteBaseUrl,
        image: config?.global?.general?.logo || config?.global?.seo?.ogImage || "",
      }
    : null;

  // Breadcrumb JSON-LD
  const currentPage = config.pages.find((p) => p.slug === pageSlug);
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Ana Sayfa", item: siteBaseUrl },
      ...(pageSlug
        ? [
            {
              "@type": "ListItem",
              position: 2,
              name: currentPage?.name || pageSlug,
              item: canonicalUrl,
            },
          ]
        : []),
    ],
  };

  // FAQ Schema JSON-LD — auto-detect FAQ sections on the current page
  const faqSections = (currentPage ?? config.pages[0])?.sections
    ?.filter((s) => s.type === "faq" && s.isVisible)
    .map((s) => s.data as FaqData);

  const faqItems = faqSections?.flatMap((faq) => faq.items) ?? [];
  const faqJsonLd =
    faqItems.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faqItems.map((item) => ({
            "@type": "Question",
            name: item.question,
            acceptedAnswer: {
              "@type": "Answer",
              text: item.answer,
            },
          })),
        }
      : null;

  return (
    <main>
      <TemplateRenderer config={config} pageSlug={pageSlug} isPreview={false} basePath={basePath} siteSubdomain={subdomain} />
      {localBusinessJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd) }}
        />
      )}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      {faqJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
      )}
    </main>
  );
}
