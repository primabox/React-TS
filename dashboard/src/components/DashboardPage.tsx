import { useEffect, useState } from 'react';
import { ShoppingCart, Users, TrendingUp, ArrowUpRight } from 'lucide-react';
import { SalesChart } from './SalesChart';
import { RecentSales } from './RecentSales';
import { RolesChart } from './RolesChart';

/* ── Count-up hook ── */
function useCountUp(target: number, duration = 900, active = true) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!active) return;
    let startTime: number | null = null;
    const step = (ts: number) => {
      if (!startTime) startTime = ts;
      const progress = Math.min((ts - startTime) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      setValue(Math.floor(ease * target));
      if (progress < 1) requestAnimationFrame(step);
      else setValue(target);
    };
    const id = requestAnimationFrame(step);
    return () => cancelAnimationFrame(id);
  }, [target, duration, active]);
  return value;
}

/* ── Stats config ── */
const statsConfig = [
  {
    id: 'revenue',
    label: 'Tržby',
    target: 128430,
    format: (n: number) => n.toLocaleString('cs-CZ') + ' Kč',
    change: '+14.2%',
    icon: ShoppingCart,
  },
  {
    id: 'users',
    label: 'Uživatelé',
    target: 2420,
    format: (n: number) => n.toLocaleString('cs-CZ'),
    change: '+8.1%',
    icon: Users,
  },
  {
    id: 'trend',
    label: 'Trend',
    target: 124,
    format: (n: number) => '+' + (n / 10).toFixed(1) + '%',
    change: '+3.2%',
    icon: TrendingUp,
  },
];

const card = {
  background: 'rgba(255,255,255,0.03)',
  border: '1px solid #1a1a1a',
};

/* ── Skeleton block helper ── */
function Skel({ className }: { className: string }) {
  return <div className={`skeleton ${className}`} />;
}

/* ── Stat card sub-component (runs its own count-up) ── */
function StatCard({ s, loading }: { s: typeof statsConfig[0]; loading: boolean }) {
  const n = useCountUp(s.target, 900, !loading);
  return (
    <div
      className="relative overflow-hidden rounded-xl p-6 cursor-default transition-all duration-200"
      style={card}
      onMouseEnter={e => {
        (e.currentTarget as HTMLElement).style.borderColor = 'rgba(220,38,38,0.25)';
        (e.currentTarget as HTMLElement).style.background  = 'rgba(255,255,255,0.04)';
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLElement).style.borderColor = '#1a1a1a';
        (e.currentTarget as HTMLElement).style.background  = 'rgba(255,255,255,0.03)';
      }}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.14em]" style={{ color: '#6b7280' }}>
            {s.label}
          </p>
          {loading
            ? <Skel className="mt-2 h-8 w-32" />
            : <h3 className="mt-2 text-2xl font-bold tracking-tight" style={{ color: '#ffffff' }}>{s.format(n)}</h3>
          }
          <div className="mt-3 flex items-center gap-1 text-xs font-medium" style={{ color: '#ef4444' }}>
            <ArrowUpRight size={12} />
            {s.change} tento měsíc
          </div>
        </div>
        <div className="rounded-lg p-2" style={{ background: 'rgba(255,255,255,0.05)', color: '#9ca3af' }}>
          <s.icon size={18} />
        </div>
      </div>
    </div>
  );
}

/* ── Dashboard page ── */
export function DashboardPage() {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 700);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="fade-up">

      {/* KPI Cards */}
      <div className="relative grid grid-cols-1 md:grid-cols-3 gap-4">
        <div
          className="pointer-events-none absolute inset-0 -z-10"
          style={{ background: 'radial-gradient(ellipse 60% 80% at 50% 50%, rgba(220,38,38,0.05), transparent)' }}
        />
        {statsConfig.map(s => <StatCard key={s.id} s={s} loading={loading} />)}
      </div>

      {/* Charts row — 3-col grid */}
      <div className="mt-5 grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* Sales chart */}
        <div className="lg:col-span-2 rounded-xl p-6" style={card}>
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-sm font-semibold" style={{ color: '#ffffff' }}>Analýza prodejů</h2>
              <p className="text-xs mt-0.5" style={{ color: '#6b7280' }}>Posledních 6 měsíců</p>
            </div>
            <span className="text-xs px-2.5 py-1 rounded-md font-medium"
              style={{ background: 'rgba(220,38,38,0.08)', color: '#ef4444', border: '1px solid rgba(220,38,38,0.2)' }}>
              Přehled
            </span>
          </div>
          {loading
            ? <Skel className="h-70 w-full" />
            : <SalesChart />
          }
        </div>

        {/* Right column: activity + roles stacked */}
        <div className="flex flex-col gap-4">
          <div className="rounded-xl p-6" style={card}>
            <h2 className="text-sm font-semibold mb-4" style={{ color: '#ffffff' }}>Poslední aktivita</h2>
            {loading ? (
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <Skel className="h-8 w-8 shrink-0 rounded-lg" />
                    <div className="flex-1 space-y-1.5">
                      <Skel className="h-3 w-3/4" />
                      <Skel className="h-2.5 w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            ) : <RecentSales />}
          </div>

          <div className="rounded-xl p-6" style={card}>
            <h2 className="text-sm font-semibold mb-1" style={{ color: '#ffffff' }}>Distribuce rolí</h2>
            <p className="text-xs mb-3" style={{ color: '#6b7280' }}>Celkem 37 uživatelů</p>
            {loading
              ? <Skel className="h-48 w-full" />
              : <RolesChart />
            }
          </div>
        </div>

      </div>
    </div>
  );
}