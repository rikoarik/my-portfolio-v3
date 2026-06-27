import Link from "next/link";

import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AnalyticsKpiCard } from "@/components/admin/dashboard/AnalyticsKpiCard";
import { OrganicLandingCard } from "@/components/admin/dashboard/OrganicLandingCard";
import { SeoBreakdownCard } from "@/components/admin/dashboard/SeoBreakdownCard";
import { ShortcutCard } from "@/components/admin/dashboard/ShortcutCard";
import { TopPagesTable } from "@/components/admin/dashboard/TopPagesTable";
import { TopReferrersTable } from "@/components/admin/dashboard/TopReferrersTable";
import { TrafficChartCard } from "@/components/admin/dashboard/TrafficChartCard";
import { getAnalyticsSnapshot } from "@/lib/admin/analytics-data";
import {
  DASHBOARD_SHORTCUTS,
  getDashboardSnapshot,
  SECONDARY_SHORTCUTS,
} from "@/lib/admin/dashboard-data";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const [analytics, cms] = await Promise.all([getAnalyticsSnapshot(), getDashboardSnapshot()]);

  return (
    <div className="space-y-3">
      <AdminPageHeader
        title="Analytics"
        description="Traffic, SEO signals, and quick access to CMS modules."
      />

      {cms.guestbookPending > 0 ? (
        <div className="rounded-[var(--admin-radius)] border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          {cms.guestbookPending} guestbook message
          {cms.guestbookPending > 1 ? "s" : ""} awaiting moderation.{" "}
          <Link href="/admin/dashboard/guestbook" className="font-medium underline">
            Review now
          </Link>
        </div>
      ) : null}

      <section aria-label="Analytics KPIs">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <AnalyticsKpiCard
            label="Views (30d)"
            value={analytics.totalViews30d}
            subtext={`${analytics.totalViews7d.toLocaleString()} in last 7 days`}
          />
          <AnalyticsKpiCard
            label="Visitors (7d)"
            value={analytics.uniqueVisitors7d}
            subtext={`${analytics.uniqueVisitors30d.toLocaleString()} unique in 30d`}
          />
          <AnalyticsKpiCard
            label="Organic share"
            value={analytics.organicShare7d}
            subtext="7-day search traffic share"
            suffix="%"
          />
          <AnalyticsKpiCard
            label="Today"
            value={analytics.totalViewsToday}
            subtext="Page views since midnight UTC"
          />
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-12" aria-label="Traffic overview">
        <div className="lg:col-span-8">
          <TrafficChartCard data={analytics.dailySeries} />
        </div>
        <div className="lg:col-span-4">
          <SeoBreakdownCard breakdown={analytics.seoBreakdown} />
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-2" aria-label="Top content">
        <TopPagesTable rows={analytics.topPages} />
        <TopReferrersTable rows={analytics.topReferrers} />
      </section>

      <section aria-label="SEO progress">
        <OrganicLandingCard rows={analytics.organicKeywords} />
      </section>

      <details className="admin-card group">
        <summary className="cursor-pointer list-none px-4 py-4 md:px-5 [&::-webkit-details-marker]:hidden">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-semibold">Manage content</h3>
              <p className="mt-1 text-xs text-[var(--muted-foreground)]">
                CMS shortcuts — collapsed by default.
              </p>
            </div>
            <span className="text-xs text-[var(--muted-foreground)] group-open:rotate-180">▼</span>
          </div>
        </summary>
        <div className="space-y-4 border-t border-[var(--border)] px-4 pb-4 pt-4 md:px-5">
          <div className="admin-shortcut-scroll lg:grid lg:grid-cols-4 lg:gap-4">
            {DASHBOARD_SHORTCUTS.map((item) => (
              <ShortcutCard key={item.id} {...item} />
            ))}
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {SECONDARY_SHORTCUTS.map((item) => (
              <ShortcutCard key={item.id} {...item} />
            ))}
          </div>
        </div>
      </details>
    </div>
  );
}
