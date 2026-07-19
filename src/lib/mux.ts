/** Mux thumbnail/poster URL helpers */

const MUX_IMAGE_BASE = "https://image.mux.com";

/** Default poster from Mux playback ID */
export function getMuxPosterUrl(
  playbackId: string,
  options?: { width?: number; time?: number },
): string {
  const { width = 1920, time = 0 } = options ?? {};
  return `${MUX_IMAGE_BASE}/${playbackId}/thumbnail.webp?width=${width}&time=${time}`;
}

/** HLS stream URL for Mux playback ID */
export function getMuxStreamUrl(playbackId: string): string {
  return `https://stream.mux.com/${playbackId}.m3u8`;
}

/** Env-based default showreel playback ID */
export function getDefaultMuxPlaybackId(): string | undefined {
  return process.env.NEXT_PUBLIC_MUX_PLAYBACK_ID || undefined;
}

/** Resolve poster — explicit URL wins, then Mux thumbnail */
export function resolvePosterUrl(
  posterUrl?: string,
  muxPlaybackId?: string,
): string | undefined {
  if (posterUrl) return posterUrl;
  if (muxPlaybackId) return getMuxPosterUrl(muxPlaybackId);
  return undefined;
}
