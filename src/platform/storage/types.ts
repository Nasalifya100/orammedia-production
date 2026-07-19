import "server-only";

export interface StoredObjectMeta {
  key: string;
  size: number;
  mimeType: string;
  etag?: string;
  checksum?: string;
}

export interface UploadAuthorization {
  uploadId: string;
  objectKey: string;
  uploadUrl: string;
  method: "PUT" | "POST";
  headers?: Record<string, string>;
  expiresAt: string;
  publicUrl: string;
}

export interface MultipartUploadInit {
  uploadId: string;
  objectKey: string;
  uploadIdR2: string;
  expiresAt: string;
  publicUrl: string;
}

export interface MultipartPartUrl {
  partNumber: number;
  uploadUrl: string;
  expiresAt: string;
}

export interface StorageProvider {
  readonly kind: "local" | "r2";

  upload(key: string, data: Buffer, mimeType: string): Promise<StoredObjectMeta>;

  initiateMultipartUpload(
    key: string,
    mimeType: string,
    totalBytes: number,
  ): Promise<MultipartUploadInit>;

  getMultipartPartUrl(
    objectKey: string,
    uploadIdR2: string,
    partNumber: number,
  ): Promise<MultipartPartUrl>;

  completeMultipartUpload(
    objectKey: string,
    uploadIdR2: string,
    parts: { partNumber: number; etag: string }[],
  ): Promise<StoredObjectMeta>;

  abortMultipartUpload(objectKey: string, uploadIdR2: string): Promise<void>;

  createUploadAuthorization(input: {
    key: string;
    mimeType: string;
    maxBytes: number;
    expiresSeconds?: number;
  }): Promise<UploadAuthorization>;

  delete(key: string): Promise<void>;

  replace(key: string, data: Buffer, mimeType: string): Promise<StoredObjectMeta>;

  read(key: string): Promise<Buffer | null>;

  head(key: string): Promise<StoredObjectMeta | null>;

  exists(key: string): Promise<boolean>;

  copy(sourceKey: string, destKey: string): Promise<void>;

  move(sourceKey: string, destKey: string): Promise<void>;

  listVariants(prefix: string): Promise<string[]>;

  getPublicUrl(key: string): string;

  createSignedReadUrl?(
    key: string,
    expiresSeconds?: number,
  ): Promise<string>;
}
