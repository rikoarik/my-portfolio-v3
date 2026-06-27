"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import type { ChartDatum } from "@/lib/admin/dashboard-data";

export function ContentChartCard({ data }: { data: ChartDatum[] }) {
  return (
    <article className="admin-card p-4 md:p-5">
      <div className="mb-4">
        <h3 className="text-sm font-semibold">Content overview</h3>
        <p className="mt-1 text-xs text-[var(--muted-foreground)]">
          Published vs draft/pending per modul CMS.
        </p>
      </div>
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eef0f3" />
            <XAxis dataKey="name" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis allowDecimals={false} tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
            <Tooltip
              contentStyle={{
                borderRadius: 12,
                border: "1px solid #eef0f3",
                fontSize: 12,
              }}
            />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Bar dataKey="published" fill="#2563eb" radius={[6, 6, 0, 0]} />
            <Bar dataKey="draft" fill="#f59e0b" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </article>
  );
}
