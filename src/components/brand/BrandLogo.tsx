import Image from "next/image";
import { cn } from "@/lib/utils";

const sizes = {
  sm: 32,
  md: 40,
  lg: 56,
  xl: 76,
} as const;

interface BrandLogoProps {
  size?: keyof typeof sizes;
  className?: string;
  priority?: boolean;
}

/** Oram Media Dynamics mark — square emblem, aspect handled by the frame. */
export function BrandLogo({
  size = "md",
  className,
  priority = false,
}: BrandLogoProps) {
  const px = sizes[size];

  return (
    <span
      className={cn(
        "relative inline-block shrink-0 overflow-hidden rounded-full ring-1 ring-white/10 transition-all duration-500",
        className,
      )}
      style={{ width: px, height: px }}
    >
      <Image
        src="/brand/oram-media-logo.png"
        alt="Oram Media Dynamics"
        fill
        priority={priority}
        sizes={`${px}px`}
        className="object-cover"
      />
    </span>
  );
}
