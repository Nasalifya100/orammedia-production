import Link from "next/link";
import type { AnnouncementBanner as BannerConfig } from "@/pams/types/website-config";

interface AnnouncementBannerProps {
  banner: BannerConfig;
}

export function AnnouncementBanner({ banner }: AnnouncementBannerProps) {
  if (!banner.enabled || !banner.text.trim()) return null;

  const inner = (
    <p className="text-center text-sm text-foreground">{banner.text}</p>
  );

  return (
    <div className="border-b border-line bg-surface-1 px-4 py-3">
      {banner.href ? (
        <Link href={banner.href} className="block hover:opacity-80">
          {inner}
        </Link>
      ) : (
        inner
      )}
    </div>
  );
}
