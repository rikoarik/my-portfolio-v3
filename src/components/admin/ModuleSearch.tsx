"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

import { ADMIN_NAV_GROUPS } from "@/lib/admin/nav-config";
import { clampQuery, flattenModules, searchModules } from "@/lib/admin/module-search";

export function ModuleSearch() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [highlight, setHighlight] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const modules = flattenModules(ADMIN_NAV_GROUPS);
  const results = searchModules(query, modules);

  const select = useCallback(
    (href: string) => {
      setQuery("");
      setOpen(false);
      router.push(href);
    },
    [router],
  );

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={containerRef} className="relative hidden md:block">
      <label className="admin-search flex">
        <Search className="admin-search-icon" aria-hidden />
        <input
          type="search"
          placeholder="Search modules..."
          aria-label="Search modules"
          aria-expanded={open && query.trim().length > 0}
          aria-controls="module-search-results"
          value={query}
          maxLength={100}
          onChange={(e) => {
            const next = clampQuery(e.target.value, 100);
            setQuery(next);
            setOpen(true);
            setHighlight(0);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={(e) => {
            if (!results.length) return;
            if (e.key === "ArrowDown") {
              e.preventDefault();
              setHighlight((h) => (h + 1) % results.length);
            } else if (e.key === "ArrowUp") {
              e.preventDefault();
              setHighlight((h) => (h - 1 + results.length) % results.length);
            } else if (e.key === "Enter" && results[highlight]) {
              e.preventDefault();
              select(results[highlight].href);
            } else if (e.key === "Escape") {
              setOpen(false);
            }
          }}
        />
      </label>
      {open && query.trim() ? (
        <ul
          id="module-search-results"
          role="listbox"
          className="absolute right-0 top-full z-50 mt-1 max-h-64 w-64 overflow-auto rounded-md border border-[var(--border)] bg-[var(--card)] py-1 shadow-lg"
        >
          {results.length === 0 ? (
            <li className="px-3 py-2 text-sm text-[var(--muted-foreground)]">
              Tidak ada modul cocok.
            </li>
          ) : (
            results.map((item, i) => (
              <li key={item.href} role="option" aria-selected={i === highlight}>
                <button
                  type="button"
                  className={`w-full px-3 py-2 text-left text-sm hover:bg-[var(--accent)] ${
                    i === highlight ? "bg-[var(--accent)]" : ""
                  }`}
                  onMouseEnter={() => setHighlight(i)}
                  onClick={() => select(item.href)}
                >
                  {item.label}
                </button>
              </li>
            ))
          )}
        </ul>
      ) : null}
    </div>
  );
}
