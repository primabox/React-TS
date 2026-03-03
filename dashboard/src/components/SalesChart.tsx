import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Led', sales: 4000 },
  { name: 'Úno', sales: 3000 },
  { name: 'Bře', sales: 2000 },
  { name: 'Dub', sales: 2780 },
  { name: 'Kvě', sales: 1890 },
  { name: 'Čer', sales: 2390 },
];

export function SalesChart() {
  return (
    <div className="h-70 w-full">
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
            contentStyle={{
              background: '#111111',
              border: '1px solid #1f1f1f',
              borderRadius: '8px',
              color: '#ffffff',
              fontFamily: 'Inter, sans-serif',
              fontSize: '13px',
            }}
            itemStyle={{ color: '#ef4444' }}
            labelStyle={{ color: '#6b7280', marginBottom: '4px' }}
            cursor={{ stroke: 'rgba(220,38,38,0.12)', strokeWidth: 1 }}
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
  );
}