import { Suspense } from "react";
import { redirect } from "next/navigation";
import { requireAdminSession } from "@/pams/auth/session";
import { PreviewBanner } from "@/components/preview/PreviewBanner";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function PreviewLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  try {
    await requireAdminSession("productions.read");
  } catch {
    redirect("/admin/login");
  }

  return (
    <>
      <Suspense fallback={null}>
        <PreviewBanner />
      </Suspense>
      {children}
    </>
  );
}
