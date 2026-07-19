import { redirect } from "next/navigation";
import { readSession } from "@/pams/auth/session";
import { mediaService } from "@/pams/services/media.service";
import { MediaLibraryClient } from "@/components/dam/MediaLibraryClient";

export default async function AdminMediaPage() {
  const session = await readSession();
  if (!session) redirect("/admin/login");

  const [media, insights] = await Promise.all([
    mediaService.list({ take: 300 }),
    mediaService.getInsights(),
  ]);

  return (
    <div className="p-8 md:p-12">
      <p className="text-[10px] uppercase tracking-[0.28em] text-amber-500/90">
        ORAM DAM
      </p>
      <h1 className="mt-3 text-3xl tracking-tight">Digital Asset Management</h1>
      <p className="mt-2 max-w-2xl text-sm text-white/50">
        Upload, organise and approve production media. Drag & drop from desktop or
        phone — no file system access required.
      </p>

      <div className="mt-10">
        <MediaLibraryClient
          initialMedia={media}
          insights={{
            unusedCount: insights.unusedCount,
            duplicateGroups: insights.duplicateGroups,
            recommendations: insights.recommendations,
          }}
        />
      </div>
    </div>
  );
}
