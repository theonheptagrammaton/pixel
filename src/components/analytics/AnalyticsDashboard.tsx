"use client";

import { useState, useEffect, useCallback } from "react";

interface DailyView {
  date: string;
  views: number;
}

interface PageStat {
  path: string;
  views: number;
}

interface ReferrerStat {
  referrer: string;
  views: number;
}

interface AnalyticsData {
  totalViews: number;
  uniquePaths: number;
  dailyViews: DailyView[];
  topPages: PageStat[];
  topReferrers: ReferrerStat[];
}

interface AnalyticsDashboardProps {
  siteId: string;
}

const periods = [
  { label: "7 gun", days: 7 },
  { label: "30 gun", days: 30 },
  { label: "90 gun", days: 90 },
] as const;

function formatShortDate(dateStr: string): string {
  const d = new Date(dateStr + "T00:00:00");
  return `${d.getDate()}.${d.getMonth() + 1}`;
}

function LineChart({ data }: { data: DailyView[] }) {
  if (data.length === 0) return null;

  const width = 700;
  const height = 220;
  const padLeft = 45;
  const padRight = 15;
  const padTop = 15;
  const padBottom = 35;

  const chartW = width - padLeft - padRight;
  const chartH = height - padTop - padBottom;

  const maxViews = Math.max(...data.map((d) => d.views), 1);
  const yTicks = 4;

  const points = data.map((d, i) => ({
    x: padLeft + (data.length === 1 ? chartW / 2 : (i / (data.length - 1)) * chartW),
    y: padTop + chartH - (d.views / maxViews) * chartH,
    ...d,
  }));

  const linePath = points.map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`).join(" ");
  const areaPath = `${linePath} L${points[points.length - 1].x},${padTop + chartH} L${points[0].x},${padTop + chartH} Z`;

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full" preserveAspectRatio="xMidYMid meet">
      <defs>
        <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#71717a" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#71717a" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Y axis ticks */}
      {Array.from({ length: yTicks + 1 }).map((_, i) => {
        const val = Math.round((maxViews / yTicks) * i);
        const y = padTop + chartH - (i / yTicks) * chartH;
        return (
          <g key={i}>
            <line x1={padLeft} y1={y} x2={padLeft + chartW} y2={y} stroke="#e4e4e7" strokeWidth={1} />
            <text x={padLeft - 8} y={y + 4} textAnchor="end" className="text-[10px]" fill="#a1a1aa">
              {val}
            </text>
          </g>
        );
      })}

      {/* Area fill */}
      <path d={areaPath} fill="url(#areaGrad)" />

      {/* Line */}
      <path d={linePath} fill="none" stroke="#3f3f46" strokeWidth={2} strokeLinejoin="round" />

      {/* Dots */}
      {points.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r={3} fill="#18181b" />
      ))}

      {/* X labels */}
      {points
        .filter((_, i) => {
          if (data.length <= 14) return true;
          if (data.length <= 31) return i % 3 === 0;
          return i % 7 === 0;
        })
        .map((p, i) => (
          <text key={i} x={p.x} y={height - 5} textAnchor="middle" className="text-[10px]" fill="#a1a1aa">
            {formatShortDate(p.date)}
          </text>
        ))}
    </svg>
  );
}

function Skeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white border border-zinc-200 rounded-lg p-5">
            <div className="h-3 w-24 bg-zinc-200 rounded mb-3" />
            <div className="h-7 w-16 bg-zinc-200 rounded" />
          </div>
        ))}
      </div>
      <div className="bg-white border border-zinc-200 rounded-lg p-6">
        <div className="h-4 w-40 bg-zinc-200 rounded mb-4" />
        <div className="h-48 bg-zinc-100 rounded" />
      </div>
    </div>
  );
}

export function AnalyticsDashboard({ siteId }: AnalyticsDashboardProps) {
  const [days, setDays] = useState<number>(7);
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/sites/${siteId}/analytics?days=${days}`);
      const json = await res.json();
      if (json.success) setData(json.data);
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  }, [siteId, days]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (loading) return <Skeleton />;

  if (!data || data.totalViews === 0) {
    return (
      <div className="space-y-4">
        <PeriodSelector days={days} onChange={setDays} />
        <div className="bg-white border border-zinc-200 rounded-lg p-12 text-center">
          <div className="mx-auto h-12 w-12 bg-zinc-100 rounded-lg flex items-center justify-center mb-4">
            <svg className="h-6 w-6 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
            </svg>
          </div>
          <p className="text-sm font-medium text-zinc-900">Henuz ziyaretci verisi yok</p>
          <p className="text-sm text-zinc-500 mt-1">Siteniz yayina alindiktan sonra ziyaretci verileri burada gorunecek.</p>
        </div>
      </div>
    );
  }

  const dailyAvg = data.dailyViews.length > 0
    ? Math.round(data.totalViews / data.dailyViews.length)
    : 0;

  return (
    <div className="space-y-6">
      <PeriodSelector days={days} onChange={setDays} />

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard label="Toplam Goruntulenme" value={data.totalViews} />
        <StatCard label="Benzersiz Sayfa" value={data.uniquePaths} />
        <StatCard label="Gunluk Ortalama" value={dailyAvg} />
      </div>

      {/* Chart */}
      <div className="bg-white border border-zinc-200 rounded-lg p-6">
        <h3 className="text-sm font-semibold text-zinc-900 mb-4">Gunluk Goruntulenme</h3>
        <LineChart data={data.dailyViews} />
      </div>

      {/* Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Pages */}
        <div className="bg-white border border-zinc-200 rounded-lg p-6">
          <h3 className="text-sm font-semibold text-zinc-900 mb-4">En Populer Sayfalar</h3>
          {data.topPages.length === 0 ? (
            <p className="text-sm text-zinc-500">Veri yok</p>
          ) : (
            <div className="space-y-3">
              {data.topPages.map((page) => {
                const pct = (page.views / data.topPages[0].views) * 100;
                return (
                  <div key={page.path}>
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-zinc-700 font-medium truncate mr-2">{page.path}</span>
                      <span className="text-zinc-500 shrink-0">{page.views}</span>
                    </div>
                    <div className="h-1.5 bg-zinc-100 rounded-full overflow-hidden">
                      <div className="h-full bg-zinc-400 rounded-full" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Referrers */}
        <div className="bg-white border border-zinc-200 rounded-lg p-6">
          <h3 className="text-sm font-semibold text-zinc-900 mb-4">Trafik Kaynaklari</h3>
          {data.topReferrers.length === 0 ? (
            <p className="text-sm text-zinc-500">Veri yok</p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-zinc-200">
                  <th className="text-left text-zinc-500 font-medium pb-2">Kaynak</th>
                  <th className="text-right text-zinc-500 font-medium pb-2">Goruntulenme</th>
                </tr>
              </thead>
              <tbody>
                {data.topReferrers.map((ref) => (
                  <tr key={ref.referrer} className="border-b border-zinc-100 last:border-0">
                    <td className="py-2 text-zinc-700 truncate max-w-[200px]">{ref.referrer}</td>
                    <td className="py-2 text-zinc-500 text-right">{ref.views}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

function PeriodSelector({ days, onChange }: { days: number; onChange: (d: number) => void }) {
  return (
    <div className="flex gap-1">
      {periods.map((p) => (
        <button
          key={p.days}
          onClick={() => onChange(p.days)}
          className={`px-3 py-1.5 text-sm rounded-md font-medium transition-colors ${
            days === p.days
              ? "bg-zinc-900 text-white"
              : "bg-white border border-zinc-200 text-zinc-600 hover:bg-zinc-50"
          }`}
        >
          {p.label}
        </button>
      ))}
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="bg-white border border-zinc-200 rounded-lg px-5 py-4">
      <p className="text-xs font-medium text-zinc-500 uppercase tracking-wide">{label}</p>
      <p className="mt-1.5 text-2xl font-bold text-zinc-900">{value.toLocaleString("tr-TR")}</p>
    </div>
  );
}
