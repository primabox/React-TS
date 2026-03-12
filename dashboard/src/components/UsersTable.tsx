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

const inputCls = 'w-full px-3 py-2.5 bg-[#111111] border border-[#1f1f1f] rounded-lg text-white text-sm outline-none focus:border-red-600/40 transition-colors placeholder:text-[#4b5563]';
const inputErrCls = 'w-full px-3 py-2.5 bg-[#111111] border border-red-600/50 rounded-lg text-white text-sm outline-none focus:border-red-600/60 transition-colors placeholder:text-[#4b5563]';

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
      <div className="relative w-full max-w-md overflow-hidden rounded-xl p-7 bg-[#111111] border border-[#1f1f1f] shadow-[0_24px_64px_rgba(0,0,0,0.8)]">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-base font-semibold text-white">Přidat uživatele</h2>
          <button onClick={onClose}
            className="flex h-7 w-7 items-center justify-center rounded-lg transition-colors text-[#6b7280] hover:bg-white/6"
          ><X size={15} /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#6b7280]">Jméno</label>
            <input type="text" placeholder="Jan Novák" value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              className={errors.name ? inputErrCls : inputCls}
            />
            {errors.name && <p className="text-xs text-red-400">{errors.name}</p>}
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#6b7280]">E-mail</label>
            <input type="text" placeholder="jan@nexus.cz" value={form.email}
              onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
              className={errors.email ? inputErrCls : inputCls}
            />
            {errors.email && <p className="text-xs text-red-400">{errors.email}</p>}
          </div>
          <div className="grid grid-cols-2 gap-3">
            {([['Role', 'role', ROLES], ['Status', 'status', STATUSES]] as const).map(([label, key, options]) => (
              <div key={key} className="space-y-1.5">
                <label className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#6b7280]">{label}</label>
                <select value={form[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                  className={`${inputCls} cursor-pointer`}
                >
                  {options.map(o => <option key={o} value={o} className="bg-[#111111]">{o}</option>)}
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
      <div className="relative w-full max-w-sm overflow-hidden rounded-xl p-6
                      bg-[#111111] border border-red-600/25 shadow-[0_24px_64px_rgba(0,0,0,0.8)]">
        <div className="flex items-center gap-3 mb-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-600/10">
            <AlertTriangle size={16} className="text-red-400" />
          </div>
          <h2 className="text-sm font-semibold text-white">Odstranit uživatele</h2>
        </div>
        <p className="text-sm mb-6 text-[#6b7280]">
          Opravdu chcete odstranit <span className="text-[#e5e7eb] font-semibold">{name}</span>? Tuto akci nelze vzít zpět.
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
  if (sortKey !== col) return <ChevronUp size={11} className="opacity-25" />;
  return sortDir === 'asc'
    ? <ChevronUp   size={11} className="text-red-500" />
    : <ChevronDown size={11} className="text-red-500" />;
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl p-3 bg-white/3 border border-[#1a1a1a]">
        <div className="relative flex-1 max-w-sm">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6b7280]" />
          <input
            type="text" placeholder="Hledat uživatele…"
            className="w-full py-2 pl-9 pr-4 text-sm bg-[#111111] border border-[#1f1f1f] rounded-lg text-white
                       outline-none focus:border-red-600/40 placeholder:text-[#4b5563] transition-colors"
            onChange={e => { setSearchTerm(e.target.value); setPage(1); }}
          />
        </div>
        <div className="flex items-center gap-2">
          <button onClick={exportCSV}
            className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium transition-all
                       border border-[#1f1f1f] text-[#6b7280] hover:text-[#e5e7eb] hover:border-[#2a2a2a]"
          >
            <Download size={13} /> Export CSV
          </button>
          <button onClick={() => setShowModal(true)} className="btn-red flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm">
            <UserPlus size={14} /> Přidat
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl bg-white/3 border border-[#1a1a1a]">
        <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-[#1a1a1a]">
              {sortableCols.map(({ key, label }) => (
                <th key={key} className="px-5 py-3.5 text-[#6b7280]">
                  <span className="th-sort text-[10px] font-semibold uppercase tracking-[0.12em]"
                    onClick={() => toggleSort(key)}>
                    {label} <SortIcon col={key} sortKey={sortKey} sortDir={sortDir} />
                  </span>
                </th>
              ))}
              <th className="px-5 py-3.5 text-right text-[10px] font-semibold uppercase tracking-[0.12em] text-[#6b7280]"></th>
            </tr>
          </thead>
          <tbody>
            {paginated.map(user => (
              <tr key={user.id} className="border-b border-[#141414] hover:bg-white/2 transition-colors">
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-xs font-semibold bg-white/6 text-[#9ca3af]">
                      {user.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-[#e5e7eb]">{user.name}</p>
                      <p className="text-xs text-[#6b7280]">{user.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-3.5 text-sm text-[#9ca3af]">{user.role}</td>
                <td className="px-5 py-3.5">
                  <span className={`rounded px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide ${
                    user.status === 'Aktivní'
                      ? 'bg-emerald-500/10 text-emerald-400'
                      : 'bg-white/4 text-[#6b7280]'
                  }`}>{user.status}</span>
                </td>
                <td className="px-5 py-3.5 text-right">
                  <button onClick={() => setConfirmDelete({ id: user.id, name: user.name })}
                    className="rounded-lg p-1.5 transition-all text-white/15 hover:text-red-400 hover:bg-red-600/8"
                  ><Trash2 size={15} /></button>
                </td>
              </tr>
            ))}
            {sorted.length === 0 && (
              <tr><td colSpan={4} className="px-5 py-14 text-center">
                <div className="flex flex-col items-center gap-2">
                  <Search size={24} className="text-white/10" />
                  <p className="text-sm text-[#6b7280]">Žádní uživatelé nenalezeni</p>
                </div>
              </td></tr>
            )}
          </tbody>
        </table>
        </div>

        {/* Pagination footer */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-5 py-3 border-t border-[#1a1a1a]">
            <span className="text-xs text-[#6b7280]">
              {Math.min((safePage - 1) * PAGE_SIZE + 1, sorted.length)}–{Math.min(safePage * PAGE_SIZE, sorted.length)} z {sorted.length} uživatelů
            </span>
            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                <button key={p} onClick={() => setPage(p)}
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