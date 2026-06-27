"use client";

import { useEffect, useState } from "react";
import { FileIcon } from "lucide-react";

import { isImageMime } from "@/lib/admin/media";

const THUMB_SIZE = 150;
const LOAD_TIMEOUT_MS = 10_000;

export function MediaThumb({
  url,
  mimeType,
  alt,
}: {
  url: string;
  mimeType?: string | null;
  alt?: string;
}) {
  const [status, setStatus] = useState<"loading" | "loaded" | "error">("loading");

  useEffect(() => {
    if (!isImageMime(mimeType)) return;
    setStatus("loading");
    const img = new Image();
    const timer = setTimeout(() => setStatus("error"), LOAD_TIMEOUT_MS);
    img.onload = () => {
      clearTimeout(timer);
      setStatus("loaded");
    };
    img.onerror = () => {
      clearTimeout(timer);
      setStatus("error");
    };
    img.src = url;
    return () => clearTimeout(timer);
  }, [url, mimeType]);

  if (!isImageMime(mimeType)) {
    return (
      <div
        className="flex items-center justify-center rounded border border-[var(--border)] bg-[var(--accent)]/20"
        style={{ width: THUMB_SIZE, height: THUMB_SIZE }}
        aria-label="Non-image file"
      >
        <FileIcon className="size-8 text-[var(--muted-foreground)]" />
      </div>
    );
  }

  if (status === "error") {
    return (
      <div
        className="flex items-center justify-center rounded border border-[var(--border)] bg-[var(--accent)]/20 text-xs text-[var(--muted-foreground)]"
        style={{ width: THUMB_SIZE, height: THUMB_SIZE }}
      >
        Tidak bisa dimuat
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={url}
      alt={alt ?? "Media thumbnail"}
      width={THUMB_SIZE}
      height={THUMB_SIZE}
      className="rounded border border-[var(--border)] object-contain"
      style={{ width: THUMB_SIZE, height: THUMB_SIZE }}
      onError={() => setStatus("error")}
      onLoad={() => setStatus("loaded")}
    />
  );
}
