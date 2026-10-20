import { requireAuth } from "@/lib/auth-guard";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { formatDateTime } from "@/lib/utils";

const ROOT_DOMAIN = process.env.NEXT_PUBLIC_ROOT_DOMAIN ?? "localhost:3000";

export const metadata = {
  title: "Dashboard",
};

export default async function DashboardPage() {
  const session = await requireAuth();

  const site = await prisma.site.findFirst({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  });

  const template = site
    ? await prisma.template.findUnique({ where: { id: site.templateId } })
    : null;

  // Real stats
  const now = new Date();
  const weekAgo = new Date(now);
  weekAgo.setDate(weekAgo.getDate() - 7);
  const todayStart = new Date(now);
  todayStart.setHours(0, 0, 0, 0);

  const [weeklyViews, todayViews, blogPostCount, unreadMessages] = await Promise.all([
    site
      ? prisma.pageView.count({ where: { siteId: site.id, createdAt: { gte: weekAgo } } })
      : Promise.resolve(0),
    site
      ? prisma.pageView.count({ where: { siteId: site.id, createdAt: { gte: todayStart } } })
      : Promise.resolve(0),
    site
      ? prisma.blogPost.count({ where: { siteId: site.id } })
      : Promise.resolve(0),
    site
      ? prisma.contactSubmission.count({ where: { siteId: site.id, isRead: false } })
      : Promise.resolve(0),
  ]);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Welcome */}
      <div>
        <h2 className="text-2xl font-bold text-zinc-900">
          Hosgeldiniz, {session.user.name || session.user.username}
        </h2>
        <p className="mt-1 text-sm text-zinc-500">
          Sitenizi buradan yonetin ve duzenleyin.
        </p>
      </div>

      {!site ? (
        /* ── No site ─────────────────────────────────────── */
        <div className="bg-white border border-zinc-200 rounded-lg p-10 text-center">
          <div className="mx-auto h-12 w-12 bg-zinc-100 rounded-lg flex items-center justify-center mb-4">
            <svg
              className="h-6 w-6 text-zinc-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
              />
            </svg>
          </div>
          <h3 className="text-base font-semibold text-zinc-900 mb-1">
            Sitenizi olusturmaya baslayin
          </h3>
          <p className="text-sm text-zinc-500 mb-6 max-w-sm mx-auto">
            Bir sablon secin, icerigini ozellestirin ve dakikalar icinde yayina alin.
          </p>
          <Link
            href="/templates"
            className="inline-flex items-center justify-center bg-black text-white text-sm font-medium px-6 py-2.5 rounded-md hover:bg-zinc-800 transition-colors"
          >
            Sablon Sec
          </Link>
        </div>
      ) : (
        /* ── Has site ─────────────────────────────────────── */
        <>
          {/* Site card */}
          <div className="bg-white border border-zinc-200 rounded-lg p-6">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <div className="flex items-center gap-2 mb-0.5">
                  <h3 className="text-base font-semibold text-zinc-900">
                    {site.customDomain ?? `${site.subdomain}.${ROOT_DOMAIN.split(":")[0]}`}
                  </h3>
                  <Badge variant={site.isPublished ? "success" : "default"}>
                    {site.isPublished ? "Yayında" : "Taslak"}
                  </Badge>
                </div>
                <p className="text-sm text-zinc-500">
                  Sablon:{" "}
                  <span className="font-medium text-zinc-700">
                    {template?.name ?? site.templateId}
                  </span>{" "}
                  &bull; Son guncelleme: {formatDateTime(site.updatedAt)}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Link
                href="/editor"
                className="inline-flex items-center gap-1.5 bg-black text-white text-sm font-medium px-4 py-2 rounded-md hover:bg-zinc-800 transition-colors"
              >
                <svg
                  className="h-3.5 w-3.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                  />
                </svg>
                Editoru Ac
              </Link>
              <Link
                href="/settings"
                className="inline-flex items-center gap-1.5 bg-white border border-zinc-300 text-zinc-700 text-sm font-medium px-4 py-2 rounded-md hover:bg-zinc-50 transition-colors"
              >
                Ayarlar
              </Link>
              {site.isPublished ? (
                <a
                  href={`https://${site.customDomain && site.domainVerified ? site.customDomain : `${site.subdomain}.${ROOT_DOMAIN.split(":")[0]}`}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-900 transition-colors"
                >
                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                  Siteyi Goruntule
                </a>
              ) : (
                <Link
                  href="/editor"
                  className="inline-flex items-center gap-1.5 bg-green-600 text-white text-sm font-medium px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
                >
                  Yayina Al
                </Link>
              )}
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: "Bu Hafta Ziyaretci", value: weeklyViews, href: "/analytics" },
              { label: "Bugun Goruntulenme", value: todayViews, href: "/analytics" },
              { label: "Blog Yazisi", value: blogPostCount, href: "/blog" },
              { label: "Okunmamis Mesaj", value: unreadMessages, href: "/submissions" },
            ].map((stat) => (
              <Link
                key={stat.label}
                href={stat.href}
                className="bg-white border border-zinc-200 rounded-lg px-5 py-4 hover:border-zinc-300 transition-colors"
              >
                <p className="text-xs font-medium text-zinc-500 uppercase tracking-wide">
                  {stat.label}
                </p>
                <p className="mt-1.5 text-2xl font-bold text-zinc-900">{stat.value}</p>
              </Link>
            ))}
          </div>
        </>
      )}
      {/* Help CTA — only shown when site not yet published */}
      {(!site || !site.isPublished) && (
        <div className="bg-zinc-50 border border-zinc-200 rounded-lg px-6 py-5 flex items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="shrink-0 h-8 w-8 rounded-md bg-zinc-200 flex items-center justify-center">
              <svg className="h-4 w-4 text-zinc-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-semibold text-zinc-900">Baslangic Rehberi</p>
              <p className="text-sm text-zinc-500 mt-0.5">
                Pixel&apos;u nasil kullanacaginizi adim adim ogrenmek icin yardim sayfasini inceleyin.
              </p>
            </div>
          </div>
          <Link
            href="/yardim"
            className="shrink-0 inline-flex items-center gap-1.5 bg-white border border-zinc-300 text-zinc-700 text-sm font-medium px-4 py-2 rounded-md hover:bg-zinc-100 transition-colors"
          >
            Rehbere Git
          </Link>
        </div>
      )}
    </div>
  );
}
