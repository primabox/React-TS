import { useState } from 'react';
import { User, Lock, Trash2, Bell, Palette, Key, Copy, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';

const ACCENT_COLORS = [
  { name: 'Červená',  value: '#dc2626' },
  { name: 'Modrá',    value: '#2563eb' },
  { name: 'Zelená',   value: '#16a34a' },
  { name: 'Fialová',  value: '#9333ea' },
  { name: 'Oranžová', value: '#ea580c' },
];

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full transition-colors duration-200 focus:outline-none ${
        checked ? 'bg-red-600' : 'bg-[#2a2a2a]'
      }`}
    >
      <span
        className={`pointer-events-none inline-block h-4 w-4 rounded-full bg-white shadow transform transition-transform duration-200 mt-0.5 ${
          checked ? 'translate-x-4.5' : 'translate-x-0.5'
        }`}
      />
    </button>
  );
}

const inputCls =
  'w-full px-3 py-2.5 bg-[#111111] border border-[#1f1f1f] rounded-lg text-white text-sm outline-none focus:border-red-600/40 transition-colors placeholder:text-[#4b5563]';

export function SettingsPage() {
  const [notifs, setNotifs] = useState({ newUser: true, newOrder: true, alerts: false, reports: true });
  const [accent, setAccent] = useState('#dc2626');
  const [apiKey]            = useState('nxs_live_k9x2mP7qRtY3wZ8vLjN1cH6sA4dF0bE5');

  const handleSaveProfile    = () => toast.success('Profil byl uložen');
  const handleChangePassword = () => toast('Odkaz na změnu hesla byl odeslán.', { icon: '🔒' });
  const handleDeleteAccount  = () => toast.error('Účet byl smazán (demo)');
  const handleCopyKey        = () => { navigator.clipboard.writeText(apiKey); toast.success('API klíč zkopírován'); };
  const handleRegenKey       = () => toast('Nový API klíč vygenerován (demo)', { icon: '🔑' });

  return (
    <div className="max-w-2xl space-y-4 fade-up">

      {/* Profile */}
      <section className="rounded-xl p-6 bg-white/3 border border-[#1a1a1a]">
        <div className="flex items-center gap-3 mb-6">
          <div className="rounded-lg p-2 bg-white/5 text-[#9ca3af]"><User size={16} /></div>
          <h3 className="text-sm font-semibold text-white">Profil správce</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { label: 'Jméno',   type: 'text',  value: 'Admin User'      },
            { label: 'E-mail',  type: 'email', value: 'admin@nexus.cz'  },
            { label: 'Telefon', type: 'tel',   value: '+420 777 888 999' },
            { label: 'Pozice',  type: 'text',  value: 'Správce systému' },
          ].map(({ label, type, value }) => (
            <div key={label} className="space-y-1.5">
              <label className="ml-0.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#6b7280]">
                {label}
              </label>
              <input type={type} defaultValue={value} className={inputCls} />
            </div>
          ))}
        </div>
        <button onClick={handleSaveProfile} className="btn-red mt-6 rounded-lg px-5 py-2.5 text-sm">
          Uložit profil
        </button>
      </section>

      {/* Security */}
      <section className="rounded-xl p-6 bg-white/3 border border-[#1a1a1a]">
        <div className="flex items-center gap-3 mb-5">
          <div className="rounded-lg p-2 bg-white/5 text-[#9ca3af]"><Lock size={16} /></div>
          <h3 className="text-sm font-semibold text-white">Zabezpečení</h3>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between py-3 border-b border-[#1a1a1a]">
            <div>
              <p className="text-sm font-medium text-[#e5e7eb]">Dvoufaktorové ověření</p>
              <p className="text-xs text-[#6b7280] mt-0.5">Použijte autentifikační aplikaci</p>
            </div>
            <Toggle checked={false} onChange={() => toast('2FA aktivováno (demo)', { icon: '🔐' })} />
          </div>
          <button
            onClick={handleChangePassword}
            className="text-sm font-medium text-red-400 hover:text-red-600 transition-colors"
          >
            Změnit přístupové heslo →
          </button>
        </div>
      </section>

      {/* Notifications */}
      <section className="rounded-xl p-6 bg-white/3 border border-[#1a1a1a]">
        <div className="flex items-center gap-3 mb-5">
          <div className="rounded-lg p-2 bg-white/5 text-[#9ca3af]"><Bell size={16} /></div>
          <h3 className="text-sm font-semibold text-white">Oznámení</h3>
        </div>
        <div>
          {([
            { key: 'newUser',  label: 'Nový uživatel',        desc: 'Při registraci nového účtu'  },
            { key: 'newOrder', label: 'Nová objednávka',       desc: 'Při přijetí objednávky'      },
            { key: 'alerts',   label: 'Systémová upozornění',  desc: 'Chyby a výpadky serveru'     },
            { key: 'reports',  label: 'Týdenní report',        desc: 'Shrnutí každý pondělí ráno'  },
          ] as { key: keyof typeof notifs; label: string; desc: string }[]).map(({ key, label, desc }) => (
            <div key={key} className="flex items-center justify-between py-3 border-b border-[#141414] last:border-0">
              <div>
                <p className="text-sm font-medium text-[#e5e7eb]">{label}</p>
                <p className="text-xs text-[#6b7280] mt-0.5">{desc}</p>
              </div>
              <Toggle
                checked={notifs[key]}
                onChange={v => {
                  setNotifs(n => ({ ...n, [key]: v }));
                  toast.success(`${label} ${v ? 'zapnuto' : 'vypnuto'}`);
                }}
              />
            </div>
          ))}
        </div>
      </section>

      {/* Appearance */}
      <section className="rounded-xl p-6 bg-white/3 border border-[#1a1a1a]">
        <div className="flex items-center gap-3 mb-5">
          <div className="rounded-lg p-2 bg-white/5 text-[#9ca3af]"><Palette size={16} /></div>
          <h3 className="text-sm font-semibold text-white">Vzhled</h3>
        </div>
        <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#6b7280] mb-3">Barva akcentu</p>
        <div className="flex items-center gap-3">
          {ACCENT_COLORS.map(c => (
            <button
              key={c.value}
              title={c.name}
              onClick={() => { setAccent(c.value); toast.success(`Barva změněna na ${c.name}`); }}
              className="relative h-7 w-7 rounded-full transition-transform hover:scale-110"
              style={{ background: c.value }}
            >
              {accent === c.value && (
                <span className="absolute inset-0 flex items-center justify-center">
                  <span className="h-2 w-2 rounded-full bg-white" />
                </span>
              )}
            </button>
          ))}
        </div>
      </section>

      {/* API Keys */}
      <section className="rounded-xl p-6 bg-white/3 border border-[#1a1a1a]">
        <div className="flex items-center gap-3 mb-5">
          <div className="rounded-lg p-2 bg-white/5 text-[#9ca3af]"><Key size={16} /></div>
          <h3 className="text-sm font-semibold text-white">API klíče</h3>
        </div>
        <p className="text-xs text-[#6b7280] mb-4">
          Používejte API klíče pro přístup z externích aplikací. Nikomu je nesdělujte.
        </p>
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <div className="flex-1 px-3 py-2.5 rounded-lg bg-[#0d0d0d] border border-[#1f1f1f] overflow-hidden">
            <p className="text-xs font-mono text-[#6b7280] truncate">{apiKey}</p>
          </div>
          <button
            onClick={handleCopyKey}
            className="flex items-center gap-1.5 rounded-lg px-3 py-2.5 text-xs font-medium
                       border border-[#1f1f1f] text-[#6b7280] hover:text-[#e5e7eb]
                       hover:border-[#2a2a2a] transition-all shrink-0"
          >
            <Copy size={13} /> Kopírovat
          </button>
          <button
            onClick={handleRegenKey}
            className="flex items-center gap-1.5 rounded-lg px-3 py-2.5 text-xs font-medium
                       border border-[#1f1f1f] text-[#6b7280] hover:text-[#e5e7eb]
                       hover:border-[#2a2a2a] transition-all shrink-0"
          >
            <RefreshCw size={13} /> Obnovit
          </button>
        </div>
        <p className="text-[10px] text-[#4b5563]">Poslední použití: 12.3.2026 v 14:23</p>
      </section>

      {/* Danger zone */}
      <section className="rounded-xl p-6 bg-red-600/3 border border-red-600/15">
        <div className="flex items-center gap-3 mb-3">
          <Trash2 size={16} className="text-red-400" />
          <h3 className="text-sm font-semibold text-red-400">Nebezpečná zóna</h3>
        </div>
        <p className="mb-5 text-sm text-red-400/60">
          Smazáním účtu přijdete o všechna data. Tuto akci nelze vzít zpět.
        </p>
        <button onClick={handleDeleteAccount} className="btn-red rounded-lg px-5 py-2.5 text-sm">
          Smazat Nexus účet
        </button>
      </section>
    </div>
  );
}