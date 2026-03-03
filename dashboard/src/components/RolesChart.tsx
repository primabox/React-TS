import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const data = [
  { name: 'Administrátor', value: 4,  color: '#dc2626' },
  { name: 'Editor',        value: 9,  color: '#6b7280' },
  { name: 'Uživatel',      value: 24, color: '#374151' },
];

const tooltipStyle = {
  background: '#111111',
  border: '1px solid #1f1f1f',
  borderRadius: '8px',
  color: '#ffffff',
  fontFamily: 'Inter, sans-serif',
  fontSize: '13px',
} as React.CSSProperties;

export function RolesChart() {
  return (
    <div className="h-48 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={52}
            outerRadius={74}
            paddingAngle={3}
            dataKey="value"
            strokeWidth={0}
          >
            {data.map((entry, index) => (
              <Cell key={index} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={tooltipStyle}
            itemStyle={{ color: '#e5e7eb' }}
            formatter={(value: number | undefined, name: string | undefined) => [`${value ?? 0} uživatelů`, name ?? '']}
          />
          <Legend
            iconType="circle"
            iconSize={8}
            wrapperStyle={{ fontSize: '11px', color: '#6b7280', paddingTop: '8px' }}
            formatter={(value: string) => (
              <span style={{ color: '#9ca3af' }}>{value}</span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
