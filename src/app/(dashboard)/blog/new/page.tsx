import { requireAuth } from "@/lib/auth-guard";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { BlogPostEditor } from "@/components/blog/BlogPostEditor";

export const metadata = { title: "Yeni Yazi" };

export default async function NewPostPage() {
  const session = await requireAuth();
  const site = await prisma.site.findFirst({
    where: { userId: session.user.id },
  });
  if (!site) redirect("/templates");
  return (
    <div className="max-w-5xl mx-auto">
      <BlogPostEditor siteId={site.id} mode="create" />
    </div>
  );
}
