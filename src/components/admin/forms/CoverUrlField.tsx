"use client";

import { useState } from "react";

import { AdminField } from "@/components/admin/AdminField";
import type { MediaOption } from "@/lib/admin/media-options";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";

export function CoverUrlField({
  defaultValue,
  mediaOptions = [],
  compact,
}: {
  defaultValue: string;
  mediaOptions?: MediaOption[];
  compact?: boolean;
}) {
  const [url, setUrl] = useState(defaultValue);

  return (
    <div className="space-y-2">
      <AdminField label="Cover URL" htmlFor="cover_url">
        <Input
          id="cover_url"
          name="cover_url"
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="URL atau pilih thumbnail →"
          className="h-9"
        />
      </AdminField>

      {mediaOptions.length > 0 ? (
        <div className="flex gap-1.5 overflow-x-auto pb-1">
          {mediaOptions.map((item) => (
            <button
              key={item.url}
              type="button"
              onClick={() => setUrl(item.url)}
              className={cn(
                "size-11 shrink-0 overflow-hidden rounded border-2 transition hover:opacity-90",
                url === item.url
                  ? "border-[var(--primary)]"
                  : "border-[var(--border)]",
              )}
              title={item.alt ?? "Pilih cover"}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={item.url} alt={item.alt ?? ""} className="size-full object-cover" />
            </button>
          ))}
        </div>
      ) : null}

      {!compact && url.trim() ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={url}
          alt="Cover preview"
          className="size-16 rounded border border-[var(--border)] object-cover"
        />
      ) : null}
    </div>
  );
}
