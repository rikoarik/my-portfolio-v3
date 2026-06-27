"use client";

import { useEffect, useState } from "react";

import { isImageMime } from "@/lib/admin/media";

const THUMB_SIZE = 150;
const DEBOUNCE_MS = 500;
const LOAD_TIMEOUT_MS = 10_000;

export function MediaUrlPreview({ url }: { url: string }) {
  const [debouncedUrl, setDebouncedUrl] = useState(url);
  const [status, setStatus] = useState<"idle" | "loading" | "loaded" | "error">("idle");

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedUrl(url), DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [url]);

  useEffect(() => {
    if (!debouncedUrl.trim()) {
      setStatus("idle");
      return;
    }
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
    img.src = debouncedUrl;
    return () => clearTimeout(timer);
  }, [debouncedUrl]);

  if (!url.trim()) return null;

  if (status === "error") {
    return (
      <div
        className="flex items-center justify-center rounded border border-[var(--border)] bg-[var(--accent)]/20 text-xs text-[var(--muted-foreground)]"
        style={{ width: THUMB_SIZE, height: THUMB_SIZE }}
      >
        Preview tidak tersedia
      </div>
    );
  }

  if (status === "idle" || status === "loading") {
    return (
      <div
        className="flex items-center justify-center rounded border border-[var(--border)] bg-[var(--accent)]/20 text-xs text-[var(--muted-foreground)]"
        style={{ width: THUMB_SIZE, height: THUMB_SIZE }}
      >
        Memuat...
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={debouncedUrl}
      alt="URL preview"
      width={THUMB_SIZE}
      height={THUMB_SIZE}
      className="rounded border border-[var(--border)] object-contain"
      style={{ width: THUMB_SIZE, height: THUMB_SIZE }}
    />
  );
}

export function isLikelyImageUrl(url: string): boolean {
  return /\.(png|jpe?g|gif|webp|svg)(\?|$)/i.test(url) || url.includes("image");
}
