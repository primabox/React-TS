import { useState } from 'react';
import {
  BarChart, Bar, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import { TrendingUp, Users, Eye, MousePointerClick } from 'lucide-react';

const monthlyData = [
  { month: 'Led', revenue: 42000, target: 38000 },
  { month: 'Úno', revenue: 38000, target: 40000 },
  { month: 'Bře', revenue: 51000, target: 45000 },
  { month: 'Dub', revenue: 47000, target: 46000 },
  { month: 'Kvě', revenue: 53000, target: 50000 },
  { month: 'Čer', revenue: 62000, target: 55000 },
  { month: 'Čvc', revenue: 58000, target: 58000 },
  { month: 'Srp', revenue: 71000, target: 62000 },
  { month: 'Zář', revenue: 68000, target: 65000 },
  { month: 'Říj', revenue: 79000, target: 70000 },
  { month: 'Lis', revenue: 85000, target: 75000 },
  { month: 'Pro', revenue: 92000, target: 80000 },
];

const weeklyVisitors = [
  { day: 'Po', visitors: 1200, bounce: 320 },
  { day: 'Út', visitors: 1890, bounce: 480 },
  { day: 'St', visitors: 2390, bounce: 560 },
  { day: 'Čt', visitors: 3490, bounce: 720 },
  { day: 'Pá', visitors: 2800, bounce: 610 },
  { day: 'So', visitors: 1800, bounce: 290 },
  { day: 'Ne', visitors: 1400, bounce: 210 },
];

const topPages = [
  { page: '/dashboard', views: 12400, change: '+8.2%',  positive: true  },
  { page: '/products',  views: 8900,  change: '+12.1%', positive: true  },
  { page: '/checkout',  views: 6200,  change: '-2.4%',  positive: false },
  { page: '/profile',   views: 4100,  change: '+5.7%',  positive: true  },
  { page: '/blog',      views: 3300,  change: '+18.3%', positive: true  },
];

const kpis = [
  { label: 'Celkových zobrazení',  value: '1.2M',   change: '+14.5%', icon: Eye              },
  { label: 'Unikátní návštěvníci', value: '284K',   change: '+8.1%',  icon: Users            },
  { label: 'Míra prokliku',        value: '3.24%',  change: '+1.2%',  icon: MousePointerClick },
  { label: 'Průměrný čas',         value: '4m 32s', change: '+0.8%',  icon: TrendingUp       },
];

const tooltipStyle = {
  background: '#111111',
  border: '1px solid #1f1f1f',
  borderRadius: '8px',
  color: '#ffffff',
  fontFamily: 'Inter, sans-serif',
  fontSize: '12px',
};

export function AnalyticsPage() {
  const [chartType, setChartType] = useState<'bar' | 'area'>('bar');

  return (
    <div className="space-y-5 fade-up">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-white">Analytika</h2>
        <p className="mt-1 text-sm text-[#6b7280]">Přehled výkonu a statistik za rok 2025</p>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map(({ label, value, change, icon: Icon }) => (
          <div
            key={label}
            className="rounded-xl p-5 bg-white/3 border border-[#1a1a1a]
                       hover:border-red-600/25 hover:bg-white/4 transition-all duration-200 cursor-default"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#6b7280]">{label}</p>
                <p className="mt-2 text-xl font-bold text-white">{value}</p>
                <p className="mt-2 text-xs font-medium text-red-400 flex items-center gap-1">
                  <TrendingUp size={11} /> {change} tento rok
                </p>
              </div>
              <div className="rounded-lg p-2 bg-white/5 text-[#9ca3af]">
                <Icon size={16} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Revenue vs Target */}
      <div className="rounded-xl p-6 bg-white/3 border border-[#1a1a1a]">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-sm font-semibold text-white">Tržby vs. Cíl</h2>
            <p className="text-xs mt-0.5 text-[#6b7280]">Celý rok 2025 (v Kč)</p>
          </div>
          <div className="flex gap-1">
            {(['bar', 'area'] as const).map(t => (
              <button
                key={t}
                onClick={() => setChartType(t)}
                className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${
                  chartType === t
                    ? 'bg-red-600/10 text-red-400 border border-red-600/20'
                    : 'text-[#6b7280] border border-[#1f1f1f] hover:text-[#e5e7eb] hover:border-[#2a2a2a]'
                }`}
              >
                {t === 'bar' ? 'Sloupcový' : 'Plošný'}
              </button>
            ))}
          </div>
        </div>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            {chartType === 'bar' ? (
              <BarChart data={monthlyData} margin={{ top: 5, right: 5, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="month" axisLine={false} tickLine={false}
                  tick={{ fill: '#6b7280', fontSize: 11, fontFamily: 'Inter' }} dy={10} />
                <YAxis hide />
                <Tooltip contentStyle={tooltipStyle} itemStyle={{ color: '#e5e7eb' }} labelStyle={{ color: '#6b7280' }} />
                <Legend iconType="circle" iconSize={8}
                  wrapperStyle={{ fontSize: '11px', color: '#6b7280', paddingTop: '12px' }} />
                <Bar dataKey="revenue" name="Tržby" fill="#dc2626" radius={[4, 4, 0, 0]} />
                <Bar dataKey="target"  name="Cíl"   fill="rgba(255,255,255,0.07)" radius={[4, 4, 0, 0]} />
              </BarChart>
            ) : (
              <AreaChart data={monthlyData} margin={{ top: 5, right: 5, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="anaRevGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%"   stopColor="#dc2626" stopOpacity={0.2} />
                    <stop offset="100%" stopColor="#dc2626" stopOpacity={0}   />
                  </linearGradient>
                  <linearGradient id="anaTargetGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%"   stopColor="#6b7280" stopOpacity={0.15} />
                    <stop offset="100%" stopColor="#6b7280" stopOpacity={0}    />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="month" axisLine={false} tickLine={false}
                  tick={{ fill: '#6b7280', fontSize: 11, fontFamily: 'Inter' }} dy={10} />
                <YAxis hide />
                <Tooltip contentStyle={tooltipStyle} itemStyle={{ color: '#e5e7eb' }} labelStyle={{ color: '#6b7280' }} />
                <Legend iconType="circle" iconSize={8}
                  wrapperStyle={{ fontSize: '11px', color: '#6b7280', paddingTop: '12px' }} />
                <Area type="monotone" dataKey="revenue" name="Tržby" stroke="#dc2626" strokeWidth={1.5}
                  fillOpacity={1} fill="url(#anaRevGrad)" dot={false} />
                <Area type="monotone" dataKey="target"  name="Cíl"   stroke="#6b7280" strokeWidth={1.5}
                  fillOpacity={1} fill="url(#anaTargetGrad)" dot={false} />
              </AreaChart>
            )}
          </ResponsiveContainer>
        </div>
      </div>

      {/* Weekly visitors + Top pages */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        <div className="lg:col-span-3 rounded-xl p-6 bg-white/3 border border-[#1a1a1a]">
          <h2 className="text-sm font-semibold text-white mb-0.5">Týdenní návštěvnost</h2>
          <p className="text-xs text-[#6b7280] mb-5">Návštěvníci vs. odchody</p>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyVisitors} margin={{ top: 5, right: 5, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="day" axisLine={false} tickLine={false}
                  tick={{ fill: '#6b7280', fontSize: 11 }} dy={10} />
                <YAxis hide />
                <Tooltip contentStyle={tooltipStyle} itemStyle={{ color: '#e5e7eb' }} labelStyle={{ color: '#6b7280' }} />
                <Legend iconType="circle" iconSize={8}
                  wrapperStyle={{ fontSize: '11px', color: '#6b7280', paddingTop: '12px' }} />
                <Bar dataKey="visitors" name="Návštěvníci" fill="#dc2626" radius={[4, 4, 0, 0]} />
                <Bar dataKey="bounce"   name="Odchody"     fill="rgba(255,255,255,0.07)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="lg:col-span-2 rounded-xl p-6 bg-white/3 border border-[#1a1a1a]">
          <h2 className="text-sm font-semibold text-white mb-0.5">Top stránky</h2>
          <p className="text-xs text-[#6b7280] mb-5">Podle počtu zobrazení</p>
          <div>
            {topPages.map((p, i) => (
              <div
                key={p.page}
                className={`flex items-center justify-between py-2.5 ${
                  i < topPages.length - 1 ? 'border-b border-[#1a1a1a]' : ''
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-bold text-[#374151] w-4 shrink-0">{i + 1}</span>
                  <span className="text-sm text-[#9ca3af] font-mono">{p.page}</span>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-white">{p.views.toLocaleString('cs-CZ')}</p>
                  <p className={`text-[10px] font-medium ${p.positive ? 'text-emerald-400' : 'text-red-400'}`}>
                    {p.change}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
