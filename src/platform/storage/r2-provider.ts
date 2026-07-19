import "server-only";
import { AwsClient } from "aws4fetch";
import { sha256 } from "@/platform/storage/crypto";
import type {
  MultipartPartUrl,
  MultipartUploadInit,
  StorageProvider,
  StoredObjectMeta,
  UploadAuthorization,
} from "@/platform/storage/types";

interface R2Binding {
  head(key: string): Promise<{ size: number; etag: string; httpMetadata?: { contentType?: string } } | null>;
  get(key: string): Promise<{ body: ReadableStream; size: number } | null>;
  put(key: string, value: ArrayBuffer | ReadableStream, options?: { httpMetadata?: { contentType?: string } }): Promise<{ etag: string }>;
  delete(key: string): Promise<void>;
  createMultipartUpload(key: string, options?: { httpMetadata?: { contentType?: string } }): Promise<{ uploadId: string }>;
  resumeMultipartUpload(key: string, uploadId: string): {
    uploadPart(partNumber: number, value: ArrayBuffer | ReadableStream): Promise<{ etag: string }>;
    complete(parts: { partNumber: number; etag: string }[]): Promise<{ etag: string }>;
    abort(): Promise<void>;
  };
}

interface R2Env {
  DAM_BUCKET: R2Binding;
  R2_ACCOUNT_ID?: string;
  R2_ACCESS_KEY_ID?: string;
  R2_SECRET_ACCESS_KEY?: string;
  R2_BUCKET_NAME?: string;
  R2_PUBLIC_BASE_URL?: string;
}

async function getR2Env(): Promise<R2Env> {
  const { getCloudflareContext } = await import("@opennextjs/cloudflare");
  const { env } = await getCloudflareContext({ async: true });
  return env as unknown as R2Env;
}

function getPublicBase(env: R2Env): string {
  const base = env.R2_PUBLIC_BASE_URL ?? process.env.R2_PUBLIC_BASE_URL ?? "";
  return base.replace(/\/$/, "");
}

function getAwsClient(env: R2Env): AwsClient | null {
  const accessKeyId = env.R2_ACCESS_KEY_ID ?? process.env.R2_ACCESS_KEY_ID;
  const secretAccessKey = env.R2_SECRET_ACCESS_KEY ?? process.env.R2_SECRET_ACCESS_KEY;
  if (!accessKeyId || !secretAccessKey) return null;
  return new AwsClient({ accessKeyId, secretAccessKey, service: "s3", region: "auto" });
}

async function presignPut(
  env: R2Env,
  key: string,
  mimeType: string,
  expiresSeconds: number,
): Promise<string> {
  const client = getAwsClient(env);
  const accountId = env.R2_ACCOUNT_ID ?? process.env.R2_ACCOUNT_ID;
  const bucket = env.R2_BUCKET_NAME ?? process.env.R2_BUCKET_NAME ?? "orammedia-dam-staging";
  if (!client || !accountId) {
    throw new Error("R2 presigned uploads require R2_ACCOUNT_ID and API token secrets");
  }

  const url = new URL(
    `https://${accountId}.r2.cloudflarestorage.com/${bucket}/${key}`,
  );
  url.searchParams.set("X-Amz-Expires", String(expiresSeconds));

  const signed = await client.sign(
    new Request(url.toString(), {
      method: "PUT",
      headers: { "Content-Type": mimeType },
    }),
    { aws: { signQuery: true } },
  );
  return signed.url;
}

export class R2StorageProvider implements StorageProvider {
  readonly kind = "r2" as const;

  async upload(key: string, data: Buffer, mimeType: string): Promise<StoredObjectMeta> {
    const env = await getR2Env();
    const body = data.buffer.slice(
      data.byteOffset,
      data.byteOffset + data.byteLength,
    ) as ArrayBuffer;
    const result = await env.DAM_BUCKET.put(key, body, {
      httpMetadata: { contentType: mimeType },
    });
    return {
      key,
      size: data.length,
      mimeType,
      etag: result.etag,
      checksum: sha256(data),
    };
  }

  async initiateMultipartUpload(
    key: string,
    mimeType: string,
    totalBytes: number,
  ): Promise<MultipartUploadInit> {
    void totalBytes;
    const env = await getR2Env();
    const { uploadId } = await env.DAM_BUCKET.createMultipartUpload(key, {
      httpMetadata: { contentType: mimeType },
    });
    return {
      uploadId: `r2-${uploadId}`,
      objectKey: key,
      uploadIdR2: uploadId,
      expiresAt: new Date(Date.now() + 86_400_000).toISOString(),
      publicUrl: this.getPublicUrl(key),
    };
  }

  async getMultipartPartUrl(
    objectKey: string,
    uploadIdR2: string,
    partNumber: number,
  ): Promise<MultipartPartUrl> {
    const env = await getR2Env();
    const expiresSeconds = 3600;
    const url = await presignPut(env, `${objectKey}?partNumber=${partNumber}&uploadId=${uploadIdR2}`, "application/octet-stream", expiresSeconds);
    return {
      partNumber,
      uploadUrl: url,
      expiresAt: new Date(Date.now() + expiresSeconds * 1000).toISOString(),
    };
  }

  async completeMultipartUpload(
    objectKey: string,
    uploadIdR2: string,
    parts: { partNumber: number; etag: string }[],
  ): Promise<StoredObjectMeta> {
    const env = await getR2Env();
    const upload = env.DAM_BUCKET.resumeMultipartUpload(objectKey, uploadIdR2);
    const result = await upload.complete(parts);
    const head = await env.DAM_BUCKET.head(objectKey);
    return {
      key: objectKey,
      size: head?.size ?? 0,
      mimeType: head?.httpMetadata?.contentType ?? "application/octet-stream",
      etag: result.etag,
    };
  }

  async abortMultipartUpload(objectKey: string, uploadIdR2: string): Promise<void> {
    const env = await getR2Env();
    await env.DAM_BUCKET.resumeMultipartUpload(objectKey, uploadIdR2).abort();
  }

  async createUploadAuthorization(input: {
    key: string;
    mimeType: string;
    maxBytes: number;
    expiresSeconds?: number;
  }): Promise<UploadAuthorization> {
    const env = await getR2Env();
    const expiresSeconds = input.expiresSeconds ?? 3600;
    const client = getAwsClient(env);
    const accountId = env.R2_ACCOUNT_ID ?? process.env.R2_ACCOUNT_ID;

    // Prefer direct-to-R2 presigned PUT when S3 API credentials exist.
    // Otherwise return a Worker proxy marker rewritten by mediaService after session create.
    let uploadUrl: string;
    if (client && accountId) {
      uploadUrl = await presignPut(env, input.key, input.mimeType, expiresSeconds);
    } else {
      uploadUrl = "__WORKER_PROXY__";
    }

    return {
      uploadId: `r2-${Date.now()}`,
      objectKey: input.key,
      uploadUrl,
      method: "PUT",
      headers: { "Content-Type": input.mimeType },
      expiresAt: new Date(Date.now() + expiresSeconds * 1000).toISOString(),
      publicUrl: this.getPublicUrl(input.key),
    };
  }

  async delete(key: string): Promise<void> {
    const env = await getR2Env();
    await env.DAM_BUCKET.delete(key);
  }

  async replace(key: string, data: Buffer, mimeType: string): Promise<StoredObjectMeta> {
    return this.upload(key, data, mimeType);
  }

  async read(key: string): Promise<Buffer | null> {
    const env = await getR2Env();
    const obj = await env.DAM_BUCKET.get(key);
    if (!obj?.body) return null;
    const ab = await new Response(obj.body).arrayBuffer();
    return Buffer.from(ab);
  }

  async head(key: string): Promise<StoredObjectMeta | null> {
    const env = await getR2Env();
    const head = await env.DAM_BUCKET.head(key);
    if (!head) return null;
    return {
      key,
      size: head.size,
      mimeType: head.httpMetadata?.contentType ?? "application/octet-stream",
      etag: head.etag,
    };
  }

  async exists(key: string): Promise<boolean> {
    return (await this.head(key)) !== null;
  }

  async copy(sourceKey: string, destKey: string): Promise<void> {
    const buf = await this.read(sourceKey);
    if (!buf) throw new Error(`Source not found: ${sourceKey}`);
    const meta = await this.head(sourceKey);
    await this.upload(destKey, buf, meta?.mimeType ?? "application/octet-stream");
  }

  async move(sourceKey: string, destKey: string): Promise<void> {
    await this.copy(sourceKey, destKey);
    await this.delete(sourceKey);
  }

  async listVariants(_prefix: string): Promise<string[]> {
    void _prefix;
    /* R2 list requires S3 API — deferred to migration tooling */
    return [];
  }

  getPublicUrl(key: string): string {
    const base = getPublicBase({} as R2Env);
    if (!base) return `/api/dam/asset?key=${encodeURIComponent(key)}`;
    return `${base}/${key}`;
  }

  async createSignedReadUrl(key: string, expiresSeconds = 3600): Promise<string> {
    const env = await getR2Env();
    const client = getAwsClient(env);
    const accountId = env.R2_ACCOUNT_ID ?? process.env.R2_ACCOUNT_ID;
    const bucket = env.R2_BUCKET_NAME ?? process.env.R2_BUCKET_NAME ?? "orammedia-dam-staging";
    if (!client || !accountId) {
      throw new Error("Signed read URLs require R2 API credentials");
    }
    const url = new URL(
      `https://${accountId}.r2.cloudflarestorage.com/${bucket}/${key}`,
    );
    url.searchParams.set("X-Amz-Expires", String(expiresSeconds));
    const signed = await client.sign(new Request(url.toString(), { method: "GET" }), {
      aws: { signQuery: true },
    });
    return signed.url;
  }
}
