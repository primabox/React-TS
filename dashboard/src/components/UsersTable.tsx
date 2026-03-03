import { useEffect, useState } from 'react';
import { Search, Trash2, UserPlus, X, ChevronUp, ChevronDown, Download, AlertTriangle } from 'lucide-react';
import toast from 'react-hot-toast';

const initialUsers = [
  { id: 1, name: 'Alice Nováková',  email: 'alice@nexus.cz',   role: 'Administrátor', status: 'Aktivní'   },
  { id: 2, name: 'Jakub Svoboda',   email: 'jakub@seznam.cz',  role: 'Editor',        status: 'Aktivní'   },
  { id: 3, name: 'Marie Modrá',    email: 'marie@gmail.com',  role: 'Uživatel',      status: 'Neaktivní' },
  { id: 4, name: 'Tomáš Krejčí',   email: 'tomas@nexus.cz',   role: 'Editor',        status: 'Aktivní'   },
  { id: 5, name: 'Lucie Procházka', email: 'lucie@gmail.com',  role: 'Uživatel',      status: 'Aktivní'   },
  { id: 6, name: 'Ondřej Hora',    email: 'ondrej@nexus.cz',  role: 'Uživatel',      status: 'Neaktivní' },
  { id: 7, name: 'Eva Dvořáčková', email: 'eva@company.cz',   role: 'Administrátor', status: 'Aktivní'   },
];

const ROLES    = ['Administrátor', 'Editor', 'Uživatel'];
const STATUSES = ['Aktivní', 'Neaktivní'];
const PAGE_SIZE = 5;

type User     = typeof initialUsers[0];
type SortKey  = 'name' | 'role' | 'status';
type SortDir  = 'asc' | 'desc';

const card = { background: 'rgba(255,255,255,0.03)', border: '1px solid #1a1a1a' };

const inputStyle = {
  background: '#111111',
  border: '1px solid #1f1f1f',
  borderRadius: '8px',
  color: '#ffffff',
  outline: 'none',
  fontFamily: 'Inter, sans-serif',
  fontSize: '13px',
  transition: 'border-color 0.15s',
} as React.CSSProperties;

/* ── Add user modal ── */
interface AddUserModalProps { onClose: () => void; onAdd: (u: User) => void; }

function AddUserModal({ onClose, onAdd }: AddUserModalProps) {
  const [form, setForm]     = useState({ name: '', email: '', role: 'Uživatel', status: 'Aktivní' });
  const [errors, setErrors] = useState<Partial<typeof form>>({});

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  const validate = () => {
    const e: Partial<typeof form> = {};
    if (!form.name.trim())  e.name  = 'Jméno je povinné';
    if (!form.email.trim()) e.email = 'E-mail je povinný';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Neplatný e-mail';
    return e;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    onAdd({ id: Date.now(), ...form });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/70" onClick={onClose} />
      <div className="relative w-full max-w-md overflow-hidden rounded-xl p-7"
        style={{ background: '#111111', border: '1px solid #1f1f1f', boxShadow: '0 24px 64px rgba(0,0,0,0.8)' }}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-base font-semibold" style={{ color: '#ffffff' }}>Přidat uživatele</h2>
          <button onClick={onClose}
            className="flex h-7 w-7 items-center justify-center rounded-lg transition-colors"
            style={{ color: '#6b7280' }}
            onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.06)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
          ><X size={15} /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-[10px] font-semibold uppercase tracking-[0.12em]" style={{ color: '#6b7280' }}>Jméno</label>
            <input type="text" placeholder="Jan Novák" value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              className="w-full px-3 py-2.5"
              style={{ ...inputStyle, ...(errors.name ? { borderColor: 'rgba(220,38,38,0.5)' } : {}) }}
            />
            {errors.name && <p className="text-xs" style={{ color: '#ef4444' }}>{errors.name}</p>}
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] font-semibold uppercase tracking-[0.12em]" style={{ color: '#6b7280' }}>E-mail</label>
            <input type="text" placeholder="jan@nexus.cz" value={form.email}
              onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
              className="w-full px-3 py-2.5"
              style={{ ...inputStyle, ...(errors.email ? { borderColor: 'rgba(220,38,38,0.5)' } : {}) }}
            />
            {errors.email && <p className="text-xs" style={{ color: '#ef4444' }}>{errors.email}</p>}
          </div>
          <div className="grid grid-cols-2 gap-3">
            {([['Role', 'role', ROLES], ['Status', 'status', STATUSES]] as const).map(([label, key, options]) => (
              <div key={key} className="space-y-1.5">
                <label className="text-[10px] font-semibold uppercase tracking-[0.12em]" style={{ color: '#6b7280' }}>{label}</label>
                <select value={form[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                  className="w-full px-3 py-2.5" style={{ ...inputStyle, cursor: 'pointer' }}
                >
                  {options.map(o => <option key={o} value={o} style={{ background: '#111111' }}>{o}</option>)}
                </select>
              </div>
            ))}
          </div>
          <div className="flex gap-3 pt-1">
            <button type="button" onClick={onClose} className="btn-red-outline flex-1 rounded-lg px-4 py-2.5 text-sm">
              Zrušit
            </button>
            <button type="submit" className="btn-red flex-1 rounded-lg px-4 py-2.5 text-sm">
              Přidat
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ── Confirm delete dialog ── */
interface ConfirmDeleteProps { name: string; onConfirm: () => void; onCancel: () => void; }

function ConfirmDeleteDialog({ name, onConfirm, onCancel }: ConfirmDeleteProps) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onCancel(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onCancel]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/70" onClick={onCancel} />
      <div className="relative w-full max-w-sm overflow-hidden rounded-xl p-6"
        style={{ background: '#111111', border: '1px solid rgba(220,38,38,0.25)', boxShadow: '0 24px 64px rgba(0,0,0,0.8)' }}
      >
        <div className="flex items-center gap-3 mb-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg" style={{ background: 'rgba(220,38,38,0.1)' }}>
            <AlertTriangle size={16} style={{ color: '#ef4444' }} />
          </div>
          <h2 className="text-sm font-semibold" style={{ color: '#ffffff' }}>Odstranit uživatele</h2>
        </div>
        <p className="text-sm mb-6" style={{ color: '#6b7280' }}>
          Opravdu chcete odstranit <span style={{ color: '#e5e7eb', fontWeight: 600 }}>{name}</span>? Tuto akci nelze vzít zpět.
        </p>
        <div className="flex gap-3">
          <button onClick={onCancel} className="btn-red-outline flex-1 rounded-lg px-4 py-2.5 text-sm">
            Zrušit
          </button>
          <button onClick={onConfirm} className="btn-red flex-1 rounded-lg px-4 py-2.5 text-sm">
            Odstranit
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Sort indicator icon ── */
function SortIcon({ col, sortKey, sortDir }: { col: SortKey; sortKey: SortKey | null; sortDir: SortDir }) {
  if (sortKey !== col) return <ChevronUp size={11} style={{ opacity: 0.25 }} />;
  return sortDir === 'asc'
    ? <ChevronUp   size={11} style={{ color: '#ef4444' }} />
    : <ChevronDown size={11} style={{ color: '#ef4444' }} />;
}

/* ── Main export ── */
export function UsersTable() {
  const [users,         setUsers]         = useState(initialUsers);
  const [searchTerm,    setSearchTerm]    = useState('');
  const [showModal,     setShowModal]     = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<{ id: number; name: string } | null>(null);
  const [sortKey,       setSortKey]       = useState<SortKey | null>(null);
  const [sortDir,       setSortDir]       = useState<SortDir>('asc');
  const [page,          setPage]          = useState(1);

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir('asc'); }
    setPage(1);
  };

  const filtered = users.filter(u => u.name.toLowerCase().includes(searchTerm.toLowerCase()));

  const sorted = sortKey
    ? [...filtered].sort((a, b) => {
        const av = a[sortKey].toLowerCase();
        const bv = b[sortKey].toLowerCase();
        return sortDir === 'asc' ? av.localeCompare(bv, 'cs') : bv.localeCompare(av, 'cs');
      })
    : filtered;

  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const paginated = sorted.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  const addUser = (user: User) => {
    setUsers(prev => [...prev, user]);
    toast.success(`${user.name} byl přidán`);
  };

  const doDelete = () => {
    if (!confirmDelete) return;
    setUsers(prev => prev.filter(u => u.id !== confirmDelete.id));
    toast.error(`${confirmDelete.name} byl odstraněn`);
    setConfirmDelete(null);
  };

  const exportCSV = () => {
    const header = 'Jméno,E-mail,Role,Status';
    const rows   = users.map(u => `"${u.name}","${u.email}","${u.role}","${u.status}"`);
    const blob   = new Blob([header + '\n' + rows.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url    = URL.createObjectURL(blob);
    const a      = document.createElement('a');
    a.href       = url; a.download = 'uzivatele.csv'; a.click();
    URL.revokeObjectURL(url);
    toast.success('CSV exportováno');
  };

  const sortableCols: { key: SortKey; label: string }[] = [
    { key: 'name',   label: 'Uživatel' },
    { key: 'role',   label: 'Role'     },
    { key: 'status', label: 'Status'   },
  ];

  return (
    <div className="space-y-4">
      {showModal     && <AddUserModal onClose={() => setShowModal(false)} onAdd={addUser} />}
      {confirmDelete && <ConfirmDeleteDialog name={confirmDelete.name} onConfirm={doDelete} onCancel={() => setConfirmDelete(null)} />}

      {/* Toolbar */}
      <div className="flex items-center justify-between gap-3 rounded-xl p-3" style={card}>
        <div className="relative flex-1 max-w-sm">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#6b7280' }} />
          <input
            type="text" placeholder="Hledat uživatele…"
            className="w-full py-2 pl-9 pr-4 text-sm" style={inputStyle}
            onChange={e => { setSearchTerm(e.target.value); setPage(1); }}
            onFocus={e => (e.target.style.borderColor = 'rgba(220,38,38,0.4)')}
            onBlur={e  => (e.target.style.borderColor = '#1f1f1f')}
          />
        </div>
        <div className="flex items-center gap-2">
          <button onClick={exportCSV}
            className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium transition-colors duration-150"
            style={{ border: '1px solid #1f1f1f', color: '#6b7280' }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#e5e7eb'; (e.currentTarget as HTMLElement).style.borderColor = '#2a2a2a'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = '#6b7280'; (e.currentTarget as HTMLElement).style.borderColor = '#1f1f1f'; }}
          >
            <Download size={13} /> Export CSV
          </button>
          <button onClick={() => setShowModal(true)} className="btn-red flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm">
            <UserPlus size={14} /> Přidat
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl" style={card}>
        <table className="w-full text-left">
          <thead>
            <tr style={{ borderBottom: '1px solid #1a1a1a' }}>
              {sortableCols.map(({ key, label }) => (
                <th key={key} className="px-5 py-3.5" style={{ color: '#6b7280' }}>
                  <span className="th-sort text-[10px] font-semibold uppercase tracking-[0.12em]"
                    onClick={() => toggleSort(key)}>
                    {label} <SortIcon col={key} sortKey={sortKey} sortDir={sortDir} />
                  </span>
                </th>
              ))}
              <th className="px-5 py-3.5 text-right text-[10px] font-semibold uppercase tracking-[0.12em]"
                style={{ color: '#6b7280' }}></th>
            </tr>
          </thead>
          <tbody>
            {paginated.map(user => (
              <tr key={user.id} className="transition-colors" style={{ borderBottom: '1px solid #141414' }}
                onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.02)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
              >
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-xs font-semibold"
                      style={{ background: 'rgba(255,255,255,0.06)', color: '#9ca3af' }}>
                      {user.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-medium" style={{ color: '#e5e7eb' }}>{user.name}</p>
                      <p className="text-xs" style={{ color: '#6b7280' }}>{user.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-3.5 text-sm" style={{ color: '#9ca3af' }}>{user.role}</td>
                <td className="px-5 py-3.5">
                  <span className="rounded px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide"
                    style={user.status === 'Aktivní'
                      ? { background: 'rgba(34,197,94,0.08)',  color: '#4ade80' }
                      : { background: 'rgba(255,255,255,0.04)', color: '#6b7280' }
                    }
                  >{user.status}</span>
                </td>
                <td className="px-5 py-3.5 text-right">
                  <button onClick={() => setConfirmDelete({ id: user.id, name: user.name })}
                    className="rounded-lg p-1.5 transition-all" style={{ color: 'rgba(255,255,255,0.15)' }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#ef4444'; (e.currentTarget as HTMLElement).style.background = 'rgba(220,38,38,0.08)'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.15)'; (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
                  ><Trash2 size={15} /></button>
                </td>
              </tr>
            ))}
            {sorted.length === 0 && (
              <tr><td colSpan={4} className="px-5 py-14 text-center">
                <div className="flex flex-col items-center gap-2">
                  <Search size={24} style={{ color: 'rgba(255,255,255,0.08)' }} />
                  <p className="text-sm" style={{ color: '#6b7280' }}>Žádní uživatelé nenalezeni</p>
                </div>
              </td></tr>
            )}
          </tbody>
        </table>

        {/* Pagination footer */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-5 py-3" style={{ borderTop: '1px solid #1a1a1a' }}>
            <span className="text-xs" style={{ color: '#6b7280' }}>
              {Math.min((safePage - 1) * PAGE_SIZE + 1, sorted.length)}–{Math.min(safePage * PAGE_SIZE, sorted.length)} z {sorted.length} uživatelů
            </span>
            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                <button key={p} onClick={() => setPage(p)}
                  className="h-7 w-7 rounded-md text-xs font-medium transition-colors"
                  style={p === safePage
                    ? { background: '#dc2626', color: '#ffffff' }
                    : { color: '#6b7280' }
                  }
                  onMouseEnter={e => { if (p !== safePage) (e.currentTarget as HTMLElement).style.color = '#e5e7eb'; }}
                  onMouseLeave={e => { if (p !== safePage) (e.currentTarget as HTMLElement).style.color = '#6b7280'; }}
                >{p}</button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}