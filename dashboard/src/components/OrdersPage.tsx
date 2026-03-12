import { useState } from 'react';
import { Search, Download, Eye, ChevronUp, ChevronDown } from 'lucide-react';
import toast from 'react-hot-toast';

const initialOrders = [
  { id: '#10042', customer: 'Jan Novák',          amount: '12 400 Kč', status: 'Dokončeno', date: '12.3.2026', items: 3  },
  { id: '#10041', customer: 'Petr Svoboda',        amount: '3 100 Kč',  status: 'Čeká',      date: '12.3.2026', items: 1  },
  { id: '#10040', customer: 'Alena Modrá',         amount: '8 900 Kč',  status: 'Dokončeno', date: '11.3.2026', items: 5  },
  { id: '#10039', customer: 'Tomáš Krejčí',        amount: '21 000 Kč', status: 'Dokončeno', date: '11.3.2026', items: 8  },
  { id: '#10038', customer: 'Lucie Procházka',      amount: '1 290 Kč',  status: 'Zrušeno',   date: '10.3.2026', items: 1  },
  { id: '#10037', customer: 'Ondřej Hora',          amount: '6 700 Kč',  status: 'Čeká',      date: '10.3.2026', items: 2  },
  { id: '#10036', customer: 'Eva Dvořáčková',       amount: '34 500 Kč', status: 'Dokončeno', date: '9.3.2026',  items: 12 },
  { id: '#10035', customer: 'Martin Vlček',         amount: '4 200 Kč',  status: 'Čeká',      date: '8.3.2026',  items: 2  },
  { id: '#10034', customer: 'Kateřina Blažková',    amount: '9 800 Kč',  status: 'Dokončeno', date: '7.3.2026',  items: 4  },
  { id: '#10033', customer: 'Pavel Horáček',        amount: '15 300 Kč', status: 'Zrušeno',   date: '6.3.2026',  items: 6  },
  { id: '#10032', customer: 'Simona Jelínková',     amount: '7 450 Kč',  status: 'Dokončeno', date: '5.3.2026',  items: 3  },
  { id: '#10031', customer: 'Radek Mareš',          amount: '2 100 Kč',  status: 'Čeká',      date: '4.3.2026',  items: 1  },
];

const STATUS_TABS = ['Vše', 'Dokončeno', 'Čeká', 'Zrušeno'] as const;
type StatusTab = typeof STATUS_TABS[number];
type Order     = typeof initialOrders[0];
type SortKey   = 'id' | 'customer' | 'status' | 'date';
type SortDir   = 'asc' | 'desc';
const PAGE_SIZE = 7;

function StatusBadge({ status }: { status: string }) {
  const cls = ({
    'Dokončeno': 'bg-emerald-500/10 text-emerald-400',
    'Čeká':      'bg-yellow-500/10 text-yellow-400',
    'Zrušeno':   'bg-red-500/10 text-red-400',
  } as Record<string, string>)[status] ?? 'bg-white/5 text-[#6b7280]';
  return (
    <span className={`rounded px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide ${cls}`}>
      {status}
    </span>
  );
}

function SortIco({ col, sortKey, sortDir }: { col: SortKey; sortKey: SortKey | null; sortDir: SortDir }) {
  if (sortKey !== col) return <ChevronUp size={11} className="opacity-25" />;
  return sortDir === 'asc'
    ? <ChevronUp   size={11} className="text-red-500" />
    : <ChevronDown size={11} className="text-red-500" />;
}

export function OrdersPage() {
  const [orders]              = useState<Order[]>(initialOrders);
  const [search, setSearch]   = useState('');
  const [tab,    setTab]      = useState<StatusTab>('Vše');
  const [sortKey, setSortKey] = useState<SortKey | null>(null);
  const [sortDir, setSortDir] = useState<SortDir>('asc');
  const [page,   setPage]     = useState(1);

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir('asc'); }
    setPage(1);
  };

  const filtered = orders
    .filter(o => tab === 'Vše' || o.status === tab)
    .filter(o =>
      o.customer.toLowerCase().includes(search.toLowerCase()) ||
      o.id.toLowerCase().includes(search.toLowerCase()),
    );

  const sorted = sortKey
    ? [...filtered].sort((a, b) => {
        const av = a[sortKey]; const bv = b[sortKey];
        return sortDir === 'asc' ? av.localeCompare(bv, 'cs') : bv.localeCompare(av, 'cs');
      })
    : filtered;

  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const safePage   = Math.min(page, totalPages);
  const paginated  = sorted.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  const exportCSV = () => {
    const header = 'ID,Zákazník,Částka,Status,Datum,Položky';
    const rows   = orders.map(o =>
      `"${o.id}","${o.customer}","${o.amount}","${o.status}","${o.date}","${o.items}"`,
    );
    const blob = new Blob([header + '\n' + rows.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href = url; a.download = 'objednavky.csv'; a.click();
    URL.revokeObjectURL(url);
    toast.success('CSV exportováno');
  };

  const sortCols: { key: SortKey; label: string }[] = [
    { key: 'id',       label: 'Objednávka' },
    { key: 'customer', label: 'Zákazník'   },
    { key: 'status',   label: 'Status'     },
    { key: 'date',     label: 'Datum'      },
  ];

  const itemsWord = (n: number) => n === 1 ? 'položka' : n < 5 ? 'položky' : 'položek';

  return (
    <div className="space-y-5 fade-up">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-white">Objednávky</h2>
        <p className="mt-1 text-sm text-[#6b7280]">Přehled a správa objednávek</p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {([
          { label: 'Celkem',            value: orders.length,                               cls: 'text-white'       },
          { label: 'Dokončeno',         value: orders.filter(o => o.status === 'Dokončeno').length, cls: 'text-emerald-400' },
          { label: 'Čeká na vyřízení', value: orders.filter(o => o.status === 'Čeká').length,      cls: 'text-yellow-400'  },
        ] as const).map(({ label, value, cls }) => (
          <div key={label} className="rounded-xl p-4 bg-white/3 border border-[#1a1a1a]">
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#6b7280]">{label}</p>
            <p className={`mt-2 text-2xl font-bold ${cls}`}>{value}</p>
          </div>
        ))}
      </div>

      {/* Table card */}
      <div className="rounded-xl bg-white/3 border border-[#1a1a1a]">

        {/* Status tabs + search */}
        <div className="flex flex-wrap items-center gap-1 px-4 pt-4 pb-3 border-b border-[#1a1a1a]">
          {STATUS_TABS.map(t => {
            const count = t === 'Vše' ? orders.length : orders.filter(o => o.status === t).length;
            return (
              <button
                key={t}
                onClick={() => { setTab(t); setPage(1); }}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  tab === t
                    ? 'bg-red-600/10 text-red-400 border border-red-600/20'
                    : 'text-[#6b7280] hover:text-[#e5e7eb]'
                }`}
              >
                {t}
                <span className={`ml-1.5 text-[10px] ${tab === t ? 'text-red-400/70' : 'text-[#374151]'}`}>
                  {count}
                </span>
              </button>
            );
          })}
          <div className="ml-auto flex items-center gap-2">
            <div className="relative">
              <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6b7280]" />
              <input
                type="text"
                placeholder="Hledat…"
                className="py-1.5 pl-8 pr-3 text-sm bg-[#111111] border border-[#1f1f1f] rounded-lg
                           text-white outline-none focus:border-red-600/40 placeholder:text-[#4b5563]
                           transition-colors w-32 sm:w-44"
                onChange={e => { setSearch(e.target.value); setPage(1); }}
              />
            </div>
            <button
              onClick={exportCSV}
              className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium
                         border border-[#1f1f1f] text-[#6b7280] hover:text-[#e5e7eb]
                         hover:border-[#2a2a2a] transition-all"
            >
              <Download size={12} /> Export CSV
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-[#1a1a1a]">
              {sortCols.map(({ key, label }) => (
                <th key={key} className="px-5 py-3.5 text-[#6b7280]">
                  <span
                    className="th-sort text-[10px] font-semibold uppercase tracking-[0.12em]"
                    onClick={() => toggleSort(key)}
                  >
                    {label} <SortIco col={key} sortKey={sortKey} sortDir={sortDir} />
                  </span>
                </th>
              ))}
              <th className="px-5 py-3.5 text-right text-[10px] font-semibold uppercase tracking-[0.12em] text-[#6b7280]">
                Částka
              </th>
              <th className="px-5 py-3.5" />
            </tr>
          </thead>
          <tbody>
            {paginated.map(order => (
              <tr key={order.id} className="border-b border-[#141414] hover:bg-white/2 transition-colors">
                <td className="px-5 py-3.5 font-mono text-sm text-[#9ca3af]">{order.id}</td>
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg
                                    text-xs font-semibold bg-white/6 text-[#9ca3af]">
                      {order.customer.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-[#e5e7eb]">{order.customer}</p>
                      <p className="text-xs text-[#6b7280]">{order.items} {itemsWord(order.items)}</p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-3.5"><StatusBadge status={order.status} /></td>
                <td className="px-5 py-3.5 text-sm text-[#6b7280]">{order.date}</td>
                <td className="px-5 py-3.5 text-right text-sm font-semibold text-white">{order.amount}</td>
                <td className="px-5 py-3.5 text-right">
                  <button
                    onClick={() => toast(`${order.id} — ${order.customer}`, { icon: '📋' })}
                    className="rounded-lg p-1.5 text-white/20 hover:text-[#e5e7eb] hover:bg-white/6 transition-all"
                    title="Detail objednávky"
                  >
                    <Eye size={14} />
                  </button>
                </td>
              </tr>
            ))}
            {sorted.length === 0 && (
              <tr>
                <td colSpan={6} className="px-5 py-14 text-center">
                  <div className="flex flex-col items-center gap-2">
                    <Search size={24} className="text-white/10" />
                    <p className="text-sm text-[#6b7280]">Žádné objednávky nenalezeny</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>

        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-5 py-3 border-t border-[#1a1a1a]">
            <span className="text-xs text-[#6b7280]">
              {Math.min((safePage - 1) * PAGE_SIZE + 1, sorted.length)}–{Math.min(safePage * PAGE_SIZE, sorted.length)} z {sorted.length}
            </span>
            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`h-7 w-7 rounded-md text-xs font-medium transition-colors ${
                    p === safePage ? 'bg-red-600 text-white' : 'text-[#6b7280] hover:text-[#e5e7eb]'
                  }`}
                >{p}</button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
