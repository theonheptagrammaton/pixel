import { requireAuth } from "@/lib/auth-guard";
import { prisma } from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import { BlogPostEditor } from "@/components/blog/BlogPostEditor";

export const metadata = { title: "Yaziyi Duzenle" };

export default async function EditPostPage({
  params,
}: {
  params: { postId: string };
}) {
  const session = await requireAuth();
  const site = await prisma.site.findFirst({
    where: { userId: session.user.id },
  });
  if (!site) redirect("/templates");
  const post = await prisma.blogPost.findFirst({
    where: { id: params.postId, siteId: site.id },
  });
  if (!post) notFound();
  return (
    <div className="max-w-5xl mx-auto">
      <BlogPostEditor
        siteId={site.id}
        mode="edit"
        post={JSON.parse(JSON.stringify(post))}
      />
    </div>
  );
}
