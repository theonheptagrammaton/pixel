import { requireSuperAdmin } from "@/lib/auth-guard";
import { prisma } from "@/lib/prisma";
import { UserRole } from "@prisma/client";
import { AdminPanel } from "@/components/superadmin/AdminPanel";

export const metadata = {
  title: "Kullanici Yonetimi | Admin",
};

export default async function AdminPage() {
  await requireSuperAdmin();

  const users = await prisma.user.findMany({
    where: { role: { not: UserRole.SUPER_ADMIN } },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      username: true,
      name: true,
      phone: true,
      createdAt: true,
      sites: {
        select: { subdomain: true },
        take: 1,
      },
    },
  });

  const serialized = users.map((u) => ({
    ...u,
    phone: u.phone ?? "",
    createdAt: u.createdAt.toISOString(),
    subdomain: u.sites[0]?.subdomain ?? null,
  }));

  return (
    <div className="max-w-6xl mx-auto">
      <AdminPanel users={serialized} />
    </div>
  );
}
