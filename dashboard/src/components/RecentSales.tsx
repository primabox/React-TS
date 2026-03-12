const transactions = [
  { id: '1', user: 'Jan Novák',         amount: '12 400 Kč', status: 'Dokončeno', date: 'Před 2 min'  },
  { id: '2', user: 'Petr Svoboda',      amount: '3 100 Kč',  status: 'Čeká',      date: 'Před 15 min' },
  { id: '3', user: 'Alena Modrá',       amount: '8 900 Kč',  status: 'Dokončeno', date: 'Před 1 h'    },
  { id: '4', user: 'Tomáš Krejčí',      amount: '21 000 Kč', status: 'Dokončeno', date: 'Před 2 h'    },
  { id: '5', user: 'Lucie Procházková', amount: '1 290 Kč',  status: 'Zrušeno',   date: 'Před 3 h'    },
];

function getStatusCls(status: string) {
  if (status === 'Dokončeno') return 'bg-emerald-500/10 text-emerald-400';
  if (status === 'Čeká')      return 'bg-yellow-500/10 text-yellow-400';
  return 'bg-red-500/10 text-red-400';
}

export function RecentSales() {
  return (
    <div>
      {transactions.map((t, i) => (
        <div
          key={t.id}
          className={`flex items-center justify-between py-3 ${
            i < transactions.length - 1 ? 'border-b border-[#1a1a1a]' : ''
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-xs font-bold bg-white/6 text-[#9ca3af]">
              {t.user.charAt(0)}
            </div>
            <div>
              <p className="text-sm font-medium text-[#e5e7eb]">{t.user}</p>
              <p className="text-[11px] text-[#6b7280]">{t.date}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm font-semibold text-white">{t.amount}</p>
            <span className={`mt-0.5 inline-block rounded px-1.5 py-0.5 text-[10px] font-medium ${getStatusCls(t.status)}`}>
              {t.status}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}