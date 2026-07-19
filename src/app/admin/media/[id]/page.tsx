import Image from "next/image";
import Link from "next/link";
import { redirect, notFound } from "next/navigation";
import { readSession } from "@/pams/auth/session";
import { mediaService } from "@/pams/services/media.service";
import {
  approveMediaAction,
  deleteMediaAction,
  flipMediaAction,
  rotateMediaAction,
  updateMediaMetadataAction,
} from "@/app/admin/media/actions";
import { MEDIA_ROLES, parseVariants } from "@/pams/types/media";

export default async function MediaAssetPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await readSession();
  if (!session) redirect("/admin/login");

  const { id } = await params;
  const asset = await mediaService.findById(id);
  if (!asset) notFound();

  const variants = parseVariants(asset.variantsJson);
  const preview = asset.kind === "image" ? variants.webp || asset.path : asset.path;

  const field = (
    name: string,
    label: string,
    value: string | number | null | undefined,
    multiline = false,
  ) => (
    <label className="block text-xs uppercase tracking-[0.14em] text-white/40">
      {label}
      {multiline ? (
        <textarea
          name={name}
          rows={3}
          defaultValue={value ?? ""}
          className="mt-2 w-full border border-white/10 bg-black/40 px-3 py-2 text-sm"
        />
      ) : (
        <input
          name={name}
          defaultValue={value ?? ""}
          className="mt-2 w-full border border-white/10 bg-black/40 px-3 py-2 text-sm"
        />
      )}
    </label>
  );

  return (
    <div className="p-8 md:p-12">
      <Link href="/admin/media" className="text-xs text-white/40 hover:text-white">
        ← Media library
      </Link>
      <h1 className="mt-4 text-2xl tracking-tight">
        {asset.title || asset.filename}
      </h1>
      <p className="mt-1 text-sm text-white/50">{asset.path}</p>

      <div className="mt-8 grid gap-8 lg:grid-cols-[360px_1fr]">
        <div className="space-y-4">
          <div className="relative aspect-[4/3] overflow-hidden rounded border border-white/10 bg-black">
            {asset.kind === "image" ? (
              <Image
                src={preview}
                alt={asset.altText || asset.title || asset.filename}
                fill
                unoptimized={preview.includes("/api/dam/") || preview.startsWith("http")}
                className="object-contain"
                sizes="360px"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-white/40">
                {asset.kind.toUpperCase()}
              </div>
            )}
          </div>

          {asset.kind === "image" ? (
            <div className="flex flex-wrap gap-2">
              {[90, 180, 270].map((deg) => (
                <form key={deg} action={rotateMediaAction}>
                  <input type="hidden" name="id" value={asset.id} />
                  <input type="hidden" name="productionId" value={asset.productionId ?? ""} />
                  <input type="hidden" name="degrees" value={deg} />
                  <button type="submit" className="border border-white/15 px-3 py-1.5 text-xs">
                    Rotate {deg}°
                  </button>
                </form>
              ))}
              <form action={flipMediaAction}>
                <input type="hidden" name="id" value={asset.id} />
                <input type="hidden" name="productionId" value={asset.productionId ?? ""} />
                <input type="hidden" name="axis" value="horizontal" />
                <button type="submit" className="border border-white/15 px-3 py-1.5 text-xs">
                  Flip H
                </button>
              </form>
              <form action={flipMediaAction}>
                <input type="hidden" name="id" value={asset.id} />
                <input type="hidden" name="productionId" value={asset.productionId ?? ""} />
                <input type="hidden" name="axis" value="vertical" />
                <button type="submit" className="border border-white/15 px-3 py-1.5 text-xs">
                  Flip V
                </button>
              </form>
            </div>
          ) : null}

          <div className="flex flex-wrap gap-2">
            <form action={approveMediaAction}>
              <input type="hidden" name="id" value={asset.id} />
              <input type="hidden" name="productionId" value={asset.productionId ?? ""} />
              <input type="hidden" name="status" value="approved" />
              <button type="submit" className="bg-emerald-700 px-4 py-2 text-xs text-white">
                Approve
              </button>
            </form>
            <form action={approveMediaAction}>
              <input type="hidden" name="id" value={asset.id} />
              <input type="hidden" name="productionId" value={asset.productionId ?? ""} />
              <input type="hidden" name="status" value="rejected" />
              <button type="submit" className="border border-red-500/40 px-4 py-2 text-xs text-red-300">
                Reject
              </button>
            </form>
            <form action={deleteMediaAction}>
              <input type="hidden" name="id" value={asset.id} />
              <input type="hidden" name="productionId" value={asset.productionId ?? ""} />
              <button type="submit" className="border border-white/15 px-4 py-2 text-xs text-white/50">
                Delete
              </button>
            </form>
          </div>

          {variants.webp || variants.avif || variants.thumbnail ? (
            <div className="text-xs text-white/40">
              <p className="uppercase tracking-wider">Generated variants</p>
              <ul className="mt-2 space-y-1 break-all">
                {variants.thumbnail ? <li>Thumb: {variants.thumbnail}</li> : null}
                {variants.webp ? <li>WebP: {variants.webp}</li> : null}
                {variants.avif ? <li>AVIF: {variants.avif}</li> : null}
                {variants.sizes?.map((s) => (
                  <li key={s.path}>{s.width}w: {s.path}</li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>

        <form action={updateMediaMetadataAction} className="space-y-6">
          <input type="hidden" name="id" value={asset.id} />
          <input type="hidden" name="productionId" value={asset.productionId ?? ""} />

          <div className="grid gap-4 md:grid-cols-2">
            {field("title", "Title", asset.title)}
            <label className="block text-xs uppercase tracking-[0.14em] text-white/40">
              Role
              <select
                name="role"
                defaultValue={asset.role}
                className="mt-2 w-full border border-white/10 bg-black/40 px-3 py-2 text-sm"
              >
                {MEDIA_ROLES.map((r) => (
                  <option key={r.value} value={r.value}>
                    {r.label}
                  </option>
                ))}
              </select>
            </label>
            {field("caption", "Caption", asset.caption)}
            {field("altText", "Alt text", asset.altText)}
            {field("description", "Description", asset.description, true)}
            {field("location", "Location", asset.location)}
            {field("photographer", "Photographer", asset.photographer)}
            {field("camera", "Camera", asset.camera)}
            {field("copyright", "Copyright", asset.copyright)}
            {field("rightsOwner", "Rights owner", asset.rightsOwner)}
            {field("usageRights", "Usage rights", asset.usageRights, true)}
            <label className="block text-xs uppercase tracking-[0.14em] text-white/40">
              Approval
              <select
                name="approvalStatus"
                defaultValue={asset.approvalStatus}
                className="mt-2 w-full border border-white/10 bg-black/40 px-3 py-2 text-sm"
              >
                {["pending", "approved", "rejected", "archived"].map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </label>
            <label className="block text-xs uppercase tracking-[0.14em] text-white/40">
              Verification
              <select
                name="verificationStatus"
                defaultValue={asset.verificationStatus}
                className="mt-2 w-full border border-white/10 bg-black/40 px-3 py-2 text-sm"
              >
                {["unverified", "verified", "disputed"].map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </label>
          </div>

          <div className="flex flex-wrap gap-4 text-sm">
            {(
              [
                ["heroEligible", "Hero"],
                ["posterEligible", "Poster"],
                ["thumbnailEligible", "Thumbnail"],
                ["homepageEligible", "Homepage"],
                ["socialEligible", "Social"],
                ["ogEligible", "Open Graph"],
              ] as const
            ).map(([key, label]) => (
              <label key={key} className="flex items-center gap-2 text-white/70">
                <input
                  type="checkbox"
                  name={key}
                  defaultChecked={
                    key === "heroEligible" ? asset.heroEligible :
                    key === "posterEligible" ? asset.posterEligible :
                    key === "thumbnailEligible" ? asset.thumbnailEligible :
                    key === "homepageEligible" ? asset.homepageEligible :
                    key === "socialEligible" ? asset.socialEligible :
                    asset.ogEligible
                  }
                />
                {label}
              </label>
            ))}
          </div>

          <p className="text-xs text-white/30">
            {asset.width}×{asset.height} · {asset.fileSize ? `${Math.round(asset.fileSize / 1024)} KB` : ""} ·{" "}
            {asset.checksum?.slice(0, 12)}…
          </p>

          <button type="submit" className="bg-amber-600 px-6 py-3 text-sm font-medium text-black">
            Save metadata
          </button>
        </form>
      </div>
    </div>
  );
}
