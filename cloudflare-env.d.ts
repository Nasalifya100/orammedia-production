/* Generated for OpenNext Cloudflare bindings — run npm run cf:typegen after wrangler changes */

interface CloudflareEnv {
  DB: D1Database;
  DAM_BUCKET: R2Bucket;
  RATE_LIMIT_KV: KVNamespace;
  ASSETS: Fetcher;
  WORKER_SELF_REFERENCE: Fetcher;
  DATABASE_PROVIDER?: string;
  STORAGE_PROVIDER?: string;
  R2_PUBLIC_BASE_URL?: string;
  R2_ACCOUNT_ID?: string;
  R2_ACCESS_KEY_ID?: string;
  R2_SECRET_ACCESS_KEY?: string;
  R2_BUCKET_NAME?: string;
  CF_ENV?: string;
  PAMS_SESSION_SECRET?: string;
}
