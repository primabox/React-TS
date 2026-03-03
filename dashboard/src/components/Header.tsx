import { useEffect, useRef, useState } from 'react';
import { Bell, User, Settings, LogOut } from 'lucide-react';
import toast from 'react-hot-toast';

const tabLabels: Record<string, string> = {
  dashboard: 'Dashboard',
  users:     'Uživatelé',
  settings:  'Nastavení',
};

const notifications = [
  { id: 1, text: 'Nový uživatel se zaregistroval', time: 'Před 2 min',  unread: true  },
  { id: 2, text: 'Prodej #1042 byl dokončen',       time: 'Před 15 min', unread: true  },
  { id: 3, text: 'Server backup proběhl úspěšně',   time: 'Před 1 h',   unread: false },
];

const dropdownStyle = {
  background: '#111111',
  border: '1px solid #1f1f1f',
  boxShadow: '0 16px 48px rgba(0,0,0,0.7)',
} as React.CSSProperties;

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export function Header({ activeTab, setActiveTab }: HeaderProps) {
  const [bellOpen,    setBellOpen]    = useState(false);
  const [avatarOpen,  setAvatarOpen]  = useState(false);
  const [unreadCount, setUnreadCount] = useState(notifications.filter(n => n.unread).length);

  const bellRef   = useRef<HTMLDivElement>(null);
  const avatarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onMouse(e: MouseEvent) {
      if (bellRef.current   && !bellRef.current.contains(e.target as Node))   setBellOpen(false);
      if (avatarRef.current && !avatarRef.current.contains(e.target as Node)) setAvatarOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') { setBellOpen(false); setAvatarOpen(false); }
    }
    document.addEventListener('mousedown', onMouse);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onMouse);
      document.removeEventListener('keydown', onKey);
    };
  }, []);

  const handleMarkAllRead = () => {
    setUnreadCount(0);
    setBellOpen(false);
    toast.success('Všechna oznámení označena jako přečtená');
  };

  const handleLogout = () => {
    setAvatarOpen(false);
    toast('Odhlašování… (demo)', { icon: '👋' });
  };

  return (
    <header
      className="flex h-14 shrink-0 items-center justify-between px-8"
      style={{ background: '#0d0d0d', borderBottom: '1px solid #1a1a1a' }}
    >
      <h1 className="text-sm font-semibold tracking-wide" style={{ color: '#ffffff' }}>
        {tabLabels[activeTab] ?? activeTab}
      </h1>

      <div className="flex items-center gap-2">

        {/* Bell */}
        <div ref={bellRef} className="relative">
          <button
            onClick={() => { setBellOpen(o => !o); setAvatarOpen(false); }}
            className="relative flex h-8 w-8 items-center justify-center rounded-lg transition-colors duration-150"
            style={{
              background: bellOpen ? 'rgba(255,255,255,0.06)' : 'transparent',
              color: '#6b7280',
            }}
            onMouseEnter={e => { if (!bellOpen) (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.04)'; }}
            onMouseLeave={e => { if (!bellOpen) (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
          >
            <Bell size={16} />
            {unreadCount > 0 && (
              <span
                className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full"
                style={{ background: '#dc2626', boxShadow: '0 0 6px rgba(220,38,38,0.8)' }}
              />
            )}
          </button>

          {bellOpen && (
            <div className="absolute right-0 top-10 z-50 w-76 overflow-hidden rounded-xl" style={dropdownStyle}>
              <div
                className="flex items-center justify-between px-4 py-3"
                style={{ borderBottom: '1px solid #1f1f1f' }}
              >
                <span className="text-sm font-semibold" style={{ color: '#ffffff' }}>Oznámení</span>
                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllRead}
                    className="text-xs font-medium transition-colors"
                    style={{ color: '#ef4444' }}
                    onMouseEnter={e => (e.currentTarget.style.color = '#dc2626')}
                    onMouseLeave={e => (e.currentTarget.style.color = '#ef4444')}
                  >
                    Označit vše
                  </button>
                )}
              </div>
              <ul>
                {notifications.map(n => (
                  <li
                    key={n.id}
                    className="flex items-start gap-3 px-4 py-3 transition-colors"
                    style={{
                      borderBottom: '1px solid #1a1a1a',
                      opacity: n.unread ? 1 : 0.45,
                    }}
                    onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.03)')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                  >
                    <span
                      className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full"
                      style={{ background: n.unread ? '#dc2626' : '#374151', flexShrink: 0 }}
                    />
                    <div>
                      <p className="text-sm leading-snug" style={{ color: '#e5e7eb' }}>{n.text}</p>
                      <p className="mt-0.5 text-[11px]" style={{ color: '#6b7280' }}>{n.time}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Avatar */}
        <div ref={avatarRef} className="relative">
          <button
            onClick={() => { setAvatarOpen(o => !o); setBellOpen(false); }}
            className="h-8 w-8 overflow-hidden rounded-lg border transition-all duration-150"
            style={{
              background: '#dc2626',
              borderColor: avatarOpen ? 'rgba(220,38,38,0.6)' : 'rgba(255,255,255,0.08)',
            }}
          >
            <span className="flex h-full w-full items-center justify-center text-xs font-bold text-white">A</span>
          </button>

          {avatarOpen && (
            <div className="absolute right-0 top-10 z-50 w-48 overflow-hidden rounded-xl" style={dropdownStyle}>
              <div className="px-4 py-3" style={{ borderBottom: '1px solid #1f1f1f' }}>
                <p className="text-sm font-semibold" style={{ color: '#ffffff' }}>Admin User</p>
                <p className="text-[11px]" style={{ color: '#6b7280' }}>admin@nexus.cz</p>
              </div>
              <ul className="py-1">
                {[
                  { icon: User,     label: 'Profil',    tab: 'settings' as const },
                  { icon: Settings, label: 'Nastavení', tab: 'settings' as const },
                ].map(({ icon: Icon, label, tab }) => (
                  <li key={label}>
                    <button
                      onClick={() => { setAvatarOpen(false); setActiveTab(tab); }}
                      className="flex w-full items-center gap-3 px-4 py-2.5 text-sm transition-colors"
                      style={{ color: '#9ca3af' }}
                      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.04)'; (e.currentTarget as HTMLElement).style.color = '#ffffff'; }}
                      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; (e.currentTarget as HTMLElement).style.color = '#9ca3af'; }}
                    >
                      <Icon size={14} />
                      {label}
                    </button>
                  </li>
                ))}
                <li style={{ borderTop: '1px solid #1f1f1f', marginTop: '4px' }}>
                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-3 px-4 py-2.5 text-sm transition-colors"
                    style={{ color: '#ef4444' }}
                    onMouseEnter={e => (e.currentTarget.style.background = 'rgba(220,38,38,0.06)')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                  >
                    <LogOut size={14} />
                    Odhlásit se
                  </button>
                </li>
              </ul>
            </div>
          )}
        </div>

      </div>
    </header>
  );
}