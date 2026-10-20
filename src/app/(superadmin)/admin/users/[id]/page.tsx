import { requireSuperAdmin } from "@/lib/auth-guard";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { UserEditForm } from "@/components/superadmin/UserEditForm";

export const metadata = {
  title: "Kullanici Detayi | Admin",
};

interface PageProps {
  params: { id: string };
}

export default async function UserDetailPage({ params }: PageProps) {
  const session = await requireSuperAdmin();

  const user = await prisma.user.findUnique({
    where: { id: params.id },
    include: {
      sites: {
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!user) {
    notFound();
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <a
          href="/admin"
          className="text-sm text-zinc-500 hover:text-zinc-700 transition-colors"
        >
          Kullanicilar
        </a>
        <svg
          className="h-4 w-4 text-zinc-300"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
        <span className="text-sm font-medium text-zinc-900">{user.username}</span>
      </div>

      <UserEditForm user={user} sites={user.sites} currentAdminId={session.user.id} />
    </div>
  );
}
