"use client";

import { motion, useReducedMotion } from "framer-motion";
import { CloudUpload, CreditCard, Layers, Shield } from "lucide-react";

const items = [
  { icon: Layers, label: "Multi-tenant fintech", value: "15+ apps" },
  { icon: CreditCard, label: "Payments", value: "QRIS · PPOB · POS" },
  { icon: Shield, label: "Stability", value: "offline-first + sync" },
  { icon: CloudUpload, label: "Delivery", value: "Play Store · App Store" },
] as const;

export function ProofStrip() {
  const reduce = useReducedMotion() ?? false;

  return (
    <section
      aria-label="Proof strip"
      className="px-5 py-10 sm:px-8 lg:px-14 xl:px-20"
    >
      <div className="mx-auto grid max-w-6xl gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((it, i) => {
          const Icon = it.icon;
          return (
            <motion.div
              key={it.label}
              initial={reduce ? false : { opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{
                duration: 0.45,
                delay: reduce ? 0 : i * 0.06,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="card-lift rounded-2xl border border-[var(--border)]/90 bg-[var(--card)]/55 p-5 backdrop-blur-md"
            >
              <div className="flex items-center justify-between gap-3">
                <p className="font-mono-meta text-[10px] uppercase tracking-[0.2em] text-[var(--muted-foreground)]">
                  {it.label}
                </p>
                <Icon className="h-4 w-4 text-[var(--primary)]" aria-hidden />
              </div>
              <p className="mt-3 text-lg font-semibold tracking-tight">
                {it.value}
              </p>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}

