"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useMemo, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { SkillGroup } from "@/types/portfolio";

type Filter = "all" | "mobile" | "backend" | "tools";

function groupToFilter(name: string): Filter {
  const n = name.toLowerCase();
  if (n.includes("mobile")) return "mobile";
  if (n.includes("backend")) return "backend";
  if (n.includes("tools")) return "tools";
  return "all";
}

export function ToolboxSection({ groups }: { groups: SkillGroup[] }) {
  const reduce = useReducedMotion() ?? false;
  const [filter, setFilter] = useState<Filter>("all");

  const filtered = useMemo(() => {
    if (filter === "all") return groups;
    return groups.filter((g) => groupToFilter(g.name) === filter);
  }, [groups, filter]);

  return (
    <section
      id="toolbox"
      aria-labelledby="toolbox-title"
      className="px-5 py-16 sm:px-8 lg:px-14 xl:px-20"
    >
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45 }}
          className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"
        >
          <div>
            <h2
              id="toolbox-title"
              className="text-[clamp(1.6rem,3.5vw,2.5rem)] font-bold tracking-tight"
            >
              Toolbox
            </h2>
            <p className="mt-2 text-sm text-[var(--muted-foreground)] sm:text-base">
              Filter cepat. Fokus ke skill yang benar-benar dipakai shipping.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {(
              [
                ["all", "All"],
                ["mobile", "Mobile"],
                ["backend", "Backend"],
                ["tools", "Tools"],
              ] as const
            ).map(([id, label]) => (
              <Button
                key={id}
                type="button"
                size="sm"
                variant={filter === id ? "default" : "outline"}
                className="font-mono-meta h-9"
                onClick={() => setFilter(id)}
              >
                {label}
              </Button>
            ))}
          </div>
        </motion.div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((g, gi) => (
            <motion.div
              key={g.id}
              initial={reduce ? false : { opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ delay: reduce ? 0 : gi * 0.05, duration: 0.4 }}
              className="group relative overflow-hidden rounded-3xl border border-[var(--border)]/90 bg-[var(--card)]/60 p-6 backdrop-blur-md"
            >
              <div className="pointer-events-none absolute -right-8 -top-10 h-32 w-32 rounded-full bg-[radial-gradient(circle,rgb(52_245_197_/_0.16),transparent_70%)] blur-2xl opacity-60 transition-opacity group-hover:opacity-100" />
              <p className="font-mono-meta text-xs uppercase tracking-[0.2em] text-[var(--primary)]">
                {g.name}
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {g.skills.map((s) => (
                  <Badge
                    key={s.id}
                    variant="secondary"
                    className="border border-[var(--border)]/80 bg-[var(--muted)]/55 font-normal"
                  >
                    {s.name}
                  </Badge>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

