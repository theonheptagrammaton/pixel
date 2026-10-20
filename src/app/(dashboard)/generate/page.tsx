import { requireAuth } from "@/lib/auth-guard";
import GeneratorWizard from "@/components/site-generator/GeneratorWizard";

export const metadata = {
  title: "Site Olusturucu",
};

export default async function GeneratePage() {
  await requireAuth();
  return <GeneratorWizard />;
}
