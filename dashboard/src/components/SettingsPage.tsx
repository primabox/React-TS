import { User, Lock, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

const card = {
  background: 'rgba(255,255,255,0.03)',
  border: '1px solid #1a1a1a',
};

const inputStyle = {
  background: '#111111',
  border: '1px solid #1f1f1f',
  color: '#ffffff',
  borderRadius: '8px',
  fontFamily: 'Inter, sans-serif',
  fontSize: '13px',
  outline: 'none',
  transition: 'border-color 0.15s',
} as React.CSSProperties;

export function SettingsPage() {
  const handleSaveProfile    = () => toast.success('Profil byl uložen');
  const handleChangePassword = () => toast('Odkaz na změnu hesla byl odeslán.', { icon: '🔒' });
  const handleDeleteAccount  = () => toast.error('Účet byl smazán (demo)');

  return (
    <div className="max-w-2xl space-y-4 fade-up">

      {/* Profile */}
      <section className="rounded-xl p-6" style={card}>
        <div className="flex items-center gap-3 mb-6">
          <div className="rounded-lg p-2" style={{ background: 'rgba(255,255,255,0.05)', color: '#9ca3af' }}>
            <User size={16} />
          </div>
          <h3 className="text-sm font-semibold" style={{ color: '#ffffff' }}>Profil správce</h3>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {[
            { label: 'Jméno',  type: 'text',  value: 'Admin User' },
            { label: 'E-mail', type: 'email', value: 'admin@nexus.cz' },
          ].map(({ label, type, value }) => (
            <div key={label} className="space-y-1.5">
              <label
                className="ml-0.5 text-[10px] font-semibold uppercase tracking-[0.12em]"
                style={{ color: '#6b7280' }}
              >
                {label}
              </label>
              <input
                type={type}
                defaultValue={value}
                className="w-full px-3 py-2.5"
                style={inputStyle}
                onFocus={e => (e.target.style.borderColor = 'rgba(220,38,38,0.4)')}
                onBlur={e  => (e.target.style.borderColor = '#1f1f1f')}
              />
            </div>
          ))}
        </div>
        <button
          onClick={handleSaveProfile}
          className="btn-red mt-6 rounded-lg px-5 py-2.5 text-sm"
        >
          Uložit profil
        </button>
      </section>

      {/* Security */}
      <section className="rounded-xl p-6" style={card}>
        <div className="flex items-center gap-3 mb-6">
          <div className="rounded-lg p-2" style={{ background: 'rgba(255,255,255,0.05)', color: '#9ca3af' }}>
            <Lock size={16} />
          </div>
          <h3 className="text-sm font-semibold" style={{ color: '#ffffff' }}>Zabezpečení</h3>
        </div>
        <button
          onClick={handleChangePassword}
          className="text-sm font-medium transition-colors duration-150"
          style={{ color: '#ef4444' }}
          onMouseEnter={e => (e.currentTarget.style.color = '#dc2626')}
          onMouseLeave={e => (e.currentTarget.style.color = '#ef4444')}
        >
          Změnit přístupové heslo →
        </button>
      </section>

      {/* Danger zone */}
      <section
        className="rounded-xl p-6"
        style={{ background: 'rgba(220,38,38,0.03)', border: '1px solid rgba(220,38,38,0.15)' }}
      >
        <div className="flex items-center gap-3 mb-3">
          <Trash2 size={16} style={{ color: '#ef4444' }} />
          <h3 className="text-sm font-semibold" style={{ color: '#ef4444' }}>Nebezpečná zóna</h3>
        </div>
        <p className="mb-5 text-sm" style={{ color: 'rgba(239,68,68,0.6)' }}>
          Smazáním účtu přijdete o všechna data. Tuto akci nelze vzít zpět.
        </p>
        <button
          onClick={handleDeleteAccount}
          className="btn-red rounded-lg px-5 py-2.5 text-sm"
        >
          Smazat Nexus účet
        </button>
      </section>
    </div>
  );
}