"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Upload, X, RotateCcw, Camera } from "lucide-react";
import type { MediaRole } from "@/pams/types/media";

export interface UploadResult {
  name: string;
  id?: string;
  path?: string;
  duplicate?: boolean;
  error?: string;
}

interface MediaUploadZoneProps {
  productionId?: string;
  role?: MediaRole;
  onComplete?: (results: UploadResult[]) => void;
}

interface QueueItem {
  id: string;
  file: File;
  progress: number;
  status: "pending" | "uploading" | "done" | "error" | "cancelled";
  error?: string;
  result?: UploadResult;
  controller?: AbortController;
}

interface AuthorizeResponse {
  sessionId: string;
  uploadUrl: string;
  method: "PUT" | "POST";
  headers?: Record<string, string>;
  direct?: boolean;
}

async function uploadViaWorker(
  item: QueueItem,
  productionId: string | undefined,
  role: MediaRole,
  signal: AbortSignal,
  onProgress: (pct: number) => void,
): Promise<UploadResult> {
  const authRes = await fetch("/api/dam/upload/authorize", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      originalName: item.file.name,
      mimeType: item.file.type || "application/octet-stream",
      fileSize: item.file.size,
      productionId,
      role,
    }),
    signal,
  });
  const auth = (await authRes.json()) as AuthorizeResponse & { error?: string };
  if (!authRes.ok) throw new Error(auth.error || "Upload authorization failed");

  if (auth.direct && auth.method === "PUT") {
    onProgress(30);
    const putRes = await fetch(auth.uploadUrl, {
      method: "PUT",
      headers: auth.headers,
      body: item.file,
      signal,
    });
    if (!putRes.ok) throw new Error("Direct upload to storage failed");
    onProgress(85);

    const completeRes = await fetch("/api/dam/upload/complete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId: auth.sessionId }),
      signal,
    });
    const complete = (await completeRes.json()) as {
      error?: string;
      id?: string;
      path?: string;
    };
    if (!completeRes.ok) throw new Error(complete.error || "Upload completion failed");
    onProgress(100);
    return {
      name: item.file.name,
      id: complete.id,
      path: complete.path,
    };
  }

  const formData = new FormData();
  formData.append("files", item.file);
  if (productionId) formData.append("productionId", productionId);
  formData.append("role", role);

  const res = await fetch("/api/dam/upload", {
    method: "POST",
    body: formData,
    signal,
  });
  const data = (await res.json()) as {
    error?: string;
    results?: UploadResult[];
  };
  if (!res.ok) throw new Error(data.error || "Upload failed");
  const result = data.results?.[0] as UploadResult | undefined;
  if (!result) throw new Error("Upload failed");
  onProgress(100);
  return result;
}

export function MediaUploadZone({
  productionId,
  role = "gallery",
  onComplete,
}: MediaUploadZoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [queue, setQueue] = useState<QueueItem[]>([]);

  const uploadFile = useCallback(
    async (item: QueueItem) => {
      const controller = new AbortController();
      setQueue((q) =>
        q.map((x) =>
          x.id === item.id
            ? { ...x, status: "uploading", progress: 10, controller }
            : x,
        ),
      );

      try {
        const result = await uploadViaWorker(
          item,
          productionId,
          role,
          controller.signal,
          (pct) => {
            setQueue((q) =>
              q.map((x) => (x.id === item.id ? { ...x, progress: pct } : x)),
            );
          },
        );

        setQueue((q) =>
          q.map((x) =>
            x.id === item.id
              ? { ...x, status: "done", progress: 100, result }
              : x,
          ),
        );
        return result;
      } catch (e) {
        if ((e as Error).name === "AbortError") {
          setQueue((q) =>
            q.map((x) =>
              x.id === item.id ? { ...x, status: "cancelled" } : x,
            ),
          );
          return;
        }
        setQueue((q) =>
          q.map((x) =>
            x.id === item.id
              ? {
                  ...x,
                  status: "error",
                  error: e instanceof Error ? e.message : "Upload failed",
                }
              : x,
          ),
        );
      }
    },
    [productionId, role],
  );

  const enqueue = useCallback(
    async (files: FileList | File[]) => {
      const list = Array.from(files);
      const items: QueueItem[] = list.map((file) => ({
        id: `${file.name}-${file.size}-${Date.now()}-${Math.random()}`,
        file,
        progress: 0,
        status: "pending",
      }));
      setQueue((q) => [...items, ...q]);

      const results: UploadResult[] = [];
      for (const item of items) {
        const r = await uploadFile(item);
        if (r) results.push(r);
      }
      onComplete?.(results);
    },
    [onComplete, uploadFile],
  );

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    if (e.dataTransfer.files.length) enqueue(e.dataTransfer.files);
  };

  const onPaste = useCallback(
    (e: ClipboardEvent) => {
      const files = Array.from(e.clipboardData?.files ?? []);
      if (files.length) enqueue(files);
    },
    [enqueue],
  );

  useEffect(() => {
    window.addEventListener("paste", onPaste as EventListener);
    return () => window.removeEventListener("paste", onPaste as EventListener);
  }, [onPaste]);

  return (
    <div className="space-y-3">
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        className={`relative rounded border-2 border-dashed p-8 text-center transition ${
          dragging
            ? "border-amber-500/60 bg-amber-500/5"
            : "border-white/15 bg-black/20"
        }`}
      >
        <Upload className="mx-auto text-white/30" size={28} />
        <p className="mt-3 text-sm text-white/70">
          Drag & drop files here, paste from clipboard, or browse
        </p>
        <p className="mt-1 text-xs text-white/40">
          Images, video (MP4/MOV/WebM), PDF, ZIP · up to 512 MB · direct-to-storage on Cloudflare
        </p>
        <div className="mt-4 flex flex-wrap justify-center gap-2">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="bg-amber-600 px-4 py-2 text-xs font-medium text-black"
          >
            Browse files
          </button>
          <button
            type="button"
            onClick={() => {
              if (inputRef.current) {
                inputRef.current.setAttribute("capture", "environment");
                inputRef.current.click();
              }
            }}
            className="inline-flex items-center gap-1 border border-white/20 px-4 py-2 text-xs text-white/70"
          >
            <Camera size={14} />
            Camera
          </button>
        </div>
        <input
          ref={inputRef}
          type="file"
          multiple
          className="hidden"
          accept="image/*,video/mp4,video/quicktime,video/webm,application/pdf,application/zip,.zip"
          onChange={(e) => {
            if (e.target.files?.length) enqueue(e.target.files);
            e.target.value = "";
            inputRef.current?.removeAttribute("capture");
          }}
        />
      </div>

      {queue.length > 0 ? (
        <ul className="space-y-2">
          {queue.map((item) => (
            <li
              key={item.id}
              className="flex items-center gap-3 rounded border border-white/10 bg-[#121216] px-3 py-2 text-xs"
            >
              <span className="flex-1 truncate text-white/70">{item.file.name}</span>
              <span className="text-white/40">
                {item.status === "uploading"
                  ? `${item.progress}%`
                  : item.status === "done"
                    ? item.result?.duplicate
                      ? "Duplicate"
                      : "Done"
                    : item.status}
              </span>
              {item.status === "uploading" ? (
                <button
                  type="button"
                  onClick={() => item.controller?.abort()}
                  className="text-white/40 hover:text-white"
                >
                  <X size={14} />
                </button>
              ) : item.status === "error" ? (
                <button
                  type="button"
                  onClick={() => uploadFile(item)}
                  className="text-amber-400"
                  title="Retry"
                >
                  <RotateCcw size={14} />
                </button>
              ) : null}
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
