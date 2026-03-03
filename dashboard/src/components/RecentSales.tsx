const transactions = [
  { id: '1', user: 'Jan Novák',     amount: '12 400 Kč', status: 'Dokončeno', date: 'Před 2 min'  },
  { id: '2', user: 'Petr Svoboda',  amount: '3 100 Kč',  status: 'Čeká',      date: 'Před 15 min' },
  { id: '3', user: 'Alena Modrá',  amount: '8 900 Kč',  status: 'Dokončeno', date: 'Před 1 h'    },
];

export function RecentSales() {
  return (
    <div className="space-y-0">
      {transactions.map((t, i) => (
        <div
          key={t.id}
          className="flex items-center justify-between py-3 transition-colors"
          style={{
            borderBottom: i < transactions.length - 1 ? '1px solid #1a1a1a' : 'none',
          }}
        >
          <div className="flex items-center gap-3">
            <div
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-xs font-bold"
              style={{ background: 'rgba(255,255,255,0.06)', color: '#9ca3af' }}
            >
              {t.user.charAt(0)}
            </div>
            <div>
              <p className="text-sm font-medium" style={{ color: '#e5e7eb' }}>{t.user}</p>
              <p className="text-[11px]" style={{ color: '#6b7280' }}>{t.date}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm font-semibold" style={{ color: '#ffffff' }}>{t.amount}</p>
            <span
              className="mt-0.5 inline-block rounded px-1.5 py-0.5 text-[10px] font-medium"
              style={
                t.status === 'Dokončeno'
                  ? { background: 'rgba(34,197,94,0.08)', color: '#4ade80' }
                  : { background: 'rgba(234,179,8,0.08)',  color: '#facc15' }
              }
            >
              {t.status}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}