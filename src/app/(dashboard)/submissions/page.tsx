import { requireAuth } from "@/lib/auth-guard";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { SubmissionsManager } from "@/components/submissions/SubmissionsManager";

export const metadata = { title: "Mesajlar" };

export default async function SubmissionsPage() {
  const session = await requireAuth();
  const site = await prisma.site.findFirst({
    where: { userId: session.user.id },
  });
  if (!site) {
    return (
      <div className="max-w-md mx-auto mt-24 text-center">
        <div className="bg-white border border-zinc-200 rounded-lg p-8">
          <h3 className="text-lg font-semibold text-zinc-900 mb-2">Henuz bir siteniz yok</h3>
          <p className="text-sm text-zinc-500 mb-6">Mesajlari gorebilmek icin once bir sablon secip sitenizi olusturmaniz gerekiyor.</p>
          <Link href="/templates" className="inline-flex items-center justify-center bg-zinc-900 text-white text-sm font-medium px-5 py-2.5 rounded-md hover:bg-zinc-800 transition-colors">
            Sablon Sec
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto">
      <SubmissionsManager siteId={site.id} />
    </div>
  );
}
