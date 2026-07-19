import "server-only";
import { mkdir, writeFile, unlink, readFile, readdir } from "node:fs/promises";
import path from "node:path";
import { sha256 } from "@/platform/storage/crypto";
import type {
  MultipartPartUrl,
  MultipartUploadInit,
  StorageProvider,
  StoredObjectMeta,
  UploadAuthorization,
} from "@/platform/storage/types";

import { resolveLocalPublicPath } from "@/pams/security/storage-keys";

const PUBLIC_ROOT = path.join(/* turbopackIgnore: true */ process.cwd(), "public");

function keyToDiskPath(key: string): string {
  return resolveLocalPublicPath(PUBLIC_ROOT, key);
}

function keyToPublicPath(key: string): string {
  if (key.startsWith("/")) return key;
  return `/${key.replace(/\\/g, "/")}`;
}

export class LocalStorageProvider implements StorageProvider {
  readonly kind = "local" as const;

  async upload(key: string, data: Buffer, mimeType: string): Promise<StoredObjectMeta> {
    const diskPath = keyToDiskPath(key);
    await mkdir(path.dirname(diskPath), { recursive: true });
    await writeFile(diskPath, data);
    return {
      key,
      size: data.length,
      mimeType,
      checksum: sha256(data),
    };
  }

  async initiateMultipartUpload(
    key: string,
    _mimeType: string,
    _totalBytes: number,
  ): Promise<MultipartUploadInit> {
    void _mimeType;
    void _totalBytes;
    const uploadId = `local-${Date.now()}`;
    return {
      uploadId,
      objectKey: key,
      uploadIdR2: uploadId,
      expiresAt: new Date(Date.now() + 3600_000).toISOString(),
      publicUrl: this.getPublicUrl(key),
    };
  }

  async getMultipartPartUrl(
    objectKey: string,
    _uploadIdR2: string,
    partNumber: number,
  ): Promise<MultipartPartUrl> {
    return {
      partNumber,
      uploadUrl: `/api/dam/upload/local-part?key=${encodeURIComponent(objectKey)}&part=${partNumber}`,
      expiresAt: new Date(Date.now() + 3600_000).toISOString(),
    };
  }

  async completeMultipartUpload(
    objectKey: string,
    _uploadIdR2: string,
    _parts: { partNumber: number; etag: string }[],
  ): Promise<StoredObjectMeta> {
    void _uploadIdR2;
    void _parts;
    const buf = await this.read(objectKey);
    return {
      key: objectKey,
      size: buf?.length ?? 0,
      mimeType: "application/octet-stream",
      checksum: buf ? sha256(buf) : undefined,
    };
  }

  async abortMultipartUpload(): Promise<void> {
    /* local multipart uses buffered route */
  }

  async createUploadAuthorization(input: {
    key: string;
    mimeType: string;
    maxBytes: number;
    expiresSeconds?: number;
  }): Promise<UploadAuthorization> {
    const expiresAt = new Date(
      Date.now() + (input.expiresSeconds ?? 3600) * 1000,
    ).toISOString();
    return {
      uploadId: `local-${Date.now()}`,
      objectKey: input.key,
      uploadUrl: "/api/dam/upload",
      method: "POST",
      expiresAt,
      publicUrl: this.getPublicUrl(input.key),
    };
  }

  async delete(key: string): Promise<void> {
    const diskPath = keyToDiskPath(key);
    try {
      await unlink(diskPath);
    } catch {
      /* may not exist */
    }
  }

  async replace(key: string, data: Buffer, mimeType: string): Promise<StoredObjectMeta> {
    await this.delete(key);
    return this.upload(key, data, mimeType);
  }

  async read(key: string): Promise<Buffer | null> {
    try {
      return await readFile(keyToDiskPath(key));
    } catch {
      return null;
    }
  }

  async head(key: string): Promise<StoredObjectMeta | null> {
    const buf = await this.read(key);
    if (!buf) return null;
    return { key, size: buf.length, mimeType: "application/octet-stream" };
  }

  async exists(key: string): Promise<boolean> {
    return (await this.head(key)) !== null;
  }

  async copy(sourceKey: string, destKey: string): Promise<void> {
    const buf = await this.read(sourceKey);
    if (!buf) throw new Error(`Source not found: ${sourceKey}`);
    await this.upload(destKey, buf, "application/octet-stream");
  }

  async move(sourceKey: string, destKey: string): Promise<void> {
    await this.copy(sourceKey, destKey);
    await this.delete(sourceKey);
  }

  async listVariants(prefix: string): Promise<string[]> {
    const dir = keyToDiskPath(prefix);
    try {
      const files = await readdir(dir);
      return files.map((f) => keyToPublicPath(path.join(prefix, f)));
    } catch {
      return [];
    }
  }

  getPublicUrl(key: string): string {
    return keyToPublicPath(key);
  }
}
