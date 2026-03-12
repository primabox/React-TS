import { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data6m = [
  { name: 'Led', sales: 42000 },
  { name: 'Úno', sales: 38000 },
  { name: 'Bře', sales: 51000 },
  { name: 'Dub', sales: 47000 },
  { name: 'Kvě', sales: 53000 },
  { name: 'Čer', sales: 62000 },
];

const data12m = [
  { name: 'Led', sales: 42000 },
  { name: 'Úno', sales: 38000 },
  { name: 'Bře', sales: 51000 },
  { name: 'Dub', sales: 47000 },
  { name: 'Kvě', sales: 53000 },
  { name: 'Čer', sales: 62000 },
  { name: 'Čvc', sales: 58000 },
  { name: 'Srp', sales: 71000 },
  { name: 'Zář', sales: 68000 },
  { name: 'Říj', sales: 79000 },
  { name: 'Lis', sales: 85000 },
  { name: 'Pro', sales: 92000 },
];

type Period = '6m' | '12m';

const tooltipStyle = {
  background: '#111111',
  border: '1px solid #1f1f1f',
  borderRadius: '8px',
  color: '#ffffff',
  fontFamily: 'Inter, sans-serif',
  fontSize: '13px',
};

export function SalesChart() {
  const [period, setPeriod] = useState<Period>('6m');
  const data = period === '6m' ? data6m : data12m;

  return (
    <div>
      <div className="flex gap-1 mb-4">
        {(['6m', '12m'] as Period[]).map(p => (
          <button
            key={p}
            onClick={() => setPeriod(p)}
            className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-all ${
              period === p
                ? 'bg-red-600/10 text-red-400 border border-red-600/20'
                : 'text-[#6b7280] border border-[#1f1f1f] hover:text-[#e5e7eb] hover:border-[#2a2a2a]'
            }`}
          >
            {p === '6m' ? '6 měsíců' : '12 měsíců'}
          </button>
        ))}
      </div>
      <div className="h-65 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 5, right: 5, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="salesGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%"    stopColor="#dc2626" stopOpacity={0.2} />
                <stop offset="100%" stopColor="#dc2626" stopOpacity={0}   />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.04)" />
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#6b7280', fontSize: 11, fontFamily: 'Inter, sans-serif' }}
              dy={10}
            />
            <YAxis hide />
            <Tooltip
              contentStyle={tooltipStyle}
              itemStyle={{ color: '#ef4444' }}
              labelStyle={{ color: '#6b7280', marginBottom: '4px' }}
              cursor={{ stroke: 'rgba(220,38,38,0.12)', strokeWidth: 1 }}
              formatter={(v: number | undefined) => [`${(v ?? 0).toLocaleString('cs-CZ')} Kč`, 'Tržby']}
            />
            <Area
              type="monotone"
              dataKey="sales"
              stroke="#dc2626"
              strokeWidth={1.5}
              fillOpacity={1}
              fill="url(#salesGrad)"
              dot={false}
              activeDot={{ r: 4, fill: '#dc2626', stroke: 'rgba(220,38,38,0.3)', strokeWidth: 6 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}