import { requireAuth } from "@/lib/auth-guard";
import { redirect } from "next/navigation";
import { OnboardingWizard } from "@/components/onboarding/OnboardingWizard";

export default async function OnboardingPage() {
  const session = await requireAuth();

  if (session.user.onboarded) {
    redirect("/dashboard");
  }

  return <OnboardingWizard />;
}
