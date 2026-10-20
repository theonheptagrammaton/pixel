import { requireAuth } from "@/lib/auth-guard";
import { HelpPage } from "@/components/dashboard/HelpPage";

export const metadata = {
  title: "Yardim",
};

export default async function YardimPage() {
  await requireAuth();
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-zinc-900">
          Yardim ve Kullanim Kilavuzu
        </h2>
        <p className="mt-1 text-sm text-zinc-500">
          Pixel&apos;i nasil kullanacaginizi ogrenmek icin asagidaki rehberi inceleyin.
        </p>
      </div>
      <HelpPage />
    </div>
  );
}
