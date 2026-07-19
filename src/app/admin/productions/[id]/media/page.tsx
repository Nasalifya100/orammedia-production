import { redirect, notFound } from "next/navigation";
import { readSession } from "@/pams/auth/session";
import { productionService } from "@/pams/services/production.service";
import { ProductionMediaManager } from "@/components/dam/ProductionMediaManager";

export default async function ProductionMediaPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await readSession();
  if (!session) redirect("/admin/login");

  const { id } = await params;
  const production = await productionService.getAdmin(id);
  if (!production) notFound();

  return (
    <div className="p-8 md:p-12">
      <ProductionMediaManager
        productionId={production.id}
        productionTitle={production.title}
        media={production.media}
        trailers={production.trailers}
      />
    </div>
  );
}
