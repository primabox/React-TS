import { useEffect, useRef, useState } from 'react';
import { Bell, User, Settings, LogOut, Menu } from 'lucide-react';
import toast from 'react-hot-toast';

const tabLabels: Record<string, string> = {
  dashboard: 'Dashboard',
  analytics: 'Analytika',
  orders:    'Objednávky',
  users:     'Uživatelé',
  settings:  'Nastavení',
};

const notifications = [
  { id: 1, text: 'Nový uživatel se zaregistroval', time: 'Před 2 min',  unread: true  },
  { id: 2, text: 'Prodej #1042 byl dokončen',       time: 'Před 15 min', unread: true  },
  { id: 3, text: 'Server backup proběhl úspěšně',   time: 'Před 1 h',   unread: false },
];

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onMenuToggle: () => void;
}

export function Header({ activeTab, setActiveTab, onMenuToggle }: HeaderProps) {
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
    <header className="flex h-14 shrink-0 items-center justify-between px-4 sm:px-6 lg:px-8 bg-[#0d0d0d] border-b border-[#1a1a1a]">
      <div className="flex items-center gap-3">
        {/* Hamburger – visible on mobile/tablet only */}
        <button
          onClick={onMenuToggle}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-[#6b7280]
                     hover:text-white hover:bg-white/4 transition-colors lg:hidden"
          aria-label="Otevřít menu"
        >
          <Menu size={18} />
        </button>

        <h1 className="text-sm font-semibold tracking-wide text-white">
          {tabLabels[activeTab] ?? activeTab}
        </h1>
      </div>

      <div className="flex items-center gap-2">

        {/* Bell */}
        <div ref={bellRef} className="relative">
          <button
            onClick={() => { setBellOpen(o => !o); setAvatarOpen(false); }}
            className={`relative flex h-8 w-8 items-center justify-center rounded-lg transition-colors duration-150 text-[#6b7280] ${
              bellOpen ? 'bg-white/6' : 'hover:bg-white/4'
            }`}
          >
            <Bell size={16} />
            {unreadCount > 0 && (
              <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-red-600"
                style={{ boxShadow: '0 0 6px rgba(220,38,38,0.8)' }}
              />
            )}
          </button>

          {bellOpen && (
            <div className="absolute right-0 top-10 z-50 w-76 overflow-hidden rounded-xl
                            bg-[#111111] border border-[#1f1f1f] shadow-[0_16px_48px_rgba(0,0,0,0.7)]">
              <div className="flex items-center justify-between px-4 py-3 border-b border-[#1f1f1f]">
                <span className="text-sm font-semibold text-white">Oznámení</span>
                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllRead}
                    className="text-xs font-medium text-red-400 hover:text-red-600 transition-colors"
                  >
                    Označit vše
                  </button>
                )}
              </div>
              <ul>
                {notifications.map(n => (
                  <li
                    key={n.id}
                    className={`flex items-start gap-3 px-4 py-3 border-b border-[#1a1a1a] hover:bg-white/3 transition-colors ${
                      n.unread ? '' : 'opacity-45'
                    }`}
                  >
                    <span
                      className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${n.unread ? 'bg-red-600' : 'bg-[#374151]'}`}
                    />
                    <div>
                      <p className="text-sm leading-snug text-[#e5e7eb]">{n.text}</p>
                      <p className="mt-0.5 text-[11px] text-[#6b7280]">{n.time}</p>
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
            className={`h-8 w-8 overflow-hidden rounded-lg border bg-red-600 transition-all duration-150 ${
              avatarOpen ? 'border-red-600/60' : 'border-white/8'
            }`}
          >
            <span className="flex h-full w-full items-center justify-center text-xs font-bold text-white">A</span>
          </button>

          {avatarOpen && (
            <div className="absolute right-0 top-10 z-50 w-48 overflow-hidden rounded-xl
                            bg-[#111111] border border-[#1f1f1f] shadow-[0_16px_48px_rgba(0,0,0,0.7)]">
              <div className="px-4 py-3 border-b border-[#1f1f1f]">
                <p className="text-sm font-semibold text-white">Admin User</p>
                <p className="text-[11px] text-[#6b7280]">admin@nexus.cz</p>
              </div>
              <ul className="py-1">
                {[
                  { icon: User,     label: 'Profil',    tab: 'settings' as const },
                  { icon: Settings, label: 'Nastavení', tab: 'settings' as const },
                ].map(({ icon: Icon, label, tab }) => (
                  <li key={label}>
                    <button
                      onClick={() => { setAvatarOpen(false); setActiveTab(tab); }}
                      className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-[#9ca3af]
                                 hover:bg-white/4 hover:text-white transition-all"
                    >
                      <Icon size={14} />
                      {label}
                    </button>
                  </li>
                ))}
                <li className="border-t border-[#1f1f1f] mt-1">
                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-red-400
                               hover:bg-red-600/6 transition-colors"
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