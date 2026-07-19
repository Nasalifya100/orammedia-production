import { redirect } from "next/navigation";
import { readSession } from "@/pams/auth/session";
import { WizardStartForm } from "@/components/wizard/WizardStartForm";

export default async function WizardStartPage() {
  const session = await readSession();
  if (!session) redirect("/admin/login");

  return (
    <div className="min-h-screen p-8 md:p-12">
      <WizardStartForm />
    </div>
  );
}
