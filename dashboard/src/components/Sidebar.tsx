import { LayoutDashboard, Users, Settings, ChevronLeft, ChevronRight } from 'lucide-react';

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'users',     label: 'Uživatelé', icon: Users },
  { id: 'settings',  label: 'Nastavení', icon: Settings },
];

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  collapsed: boolean;
  setCollapsed: (v: boolean) => void;
}

export function Sidebar({ activeTab, setActiveTab, collapsed, setCollapsed }: SidebarProps) {
  return (
    <aside
      className="relative flex shrink-0 flex-col transition-all duration-200"
      style={{
        width: collapsed ? '56px' : '240px',
        background: '#0d0d0d',
        borderRight: '1px solid #1a1a1a',
        overflow: 'hidden',
      }}
    >
      {/* Logo */}
      <div
        className="flex items-center px-3.5 py-6"
        style={{ gap: collapsed ? 0 : '12px', minHeight: '72px' }}
      >
        <div
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-xs font-black text-white"
          style={{ background: '#dc2626' }}
        >
          N
        </div>
        {!collapsed && (
          <span className="whitespace-nowrap text-[15px] font-bold tracking-tight" style={{ color: '#ffffff' }}>
            Nexus Dash
          </span>
        )}
      </div>

      <div style={{ height: '1px', background: '#1a1a1a', margin: '0 12px 8px' }} />

      {/* Nav */}
      <nav className="flex-1 space-y-0.5 px-2">
        {navItems.map(({ id, label, icon: Icon }) => {
          const active = activeTab === id;
          return (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              title={collapsed ? label : undefined}
              className="group relative w-full flex items-center rounded-lg transition-all duration-150"
              style={{
                gap: collapsed ? 0 : '10px',
                padding: collapsed ? '9px 10px' : '9px 10px',
                justifyContent: collapsed ? 'center' : 'flex-start',
                background: active ? 'rgba(220,38,38,0.08)' : 'transparent',
                color: active ? '#ef4444' : '#6b7280',
              }}
              onMouseEnter={e => {
                if (!active) (e.currentTarget as HTMLElement).style.color = '#e5e7eb';
              }}
              onMouseLeave={e => {
                if (!active) (e.currentTarget as HTMLElement).style.color = '#6b7280';
              }}
            >
              {active && (
                <div
                  className="absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-r"
                  style={{ background: '#dc2626' }}
                />
              )}
              <Icon size={16} />
              {!collapsed && <span className="text-sm font-medium">{label}</span>}
            </button>
          );
        })}
      </nav>

      {/* Status badge (hidden when collapsed) */}
      {!collapsed && (
        <div
          className="mx-3 mb-3 rounded-lg p-3"
          style={{ background: '#111111', border: '1px solid #1a1a1a' }}
        >
          <div className="flex items-center gap-2">
            <span className="relative flex h-1.5 w-1.5 shrink-0">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-60" />
              <span className="inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
            </span>
            <span className="text-xs" style={{ color: '#6b7280' }}>Systém online</span>
          </div>
        </div>
      )}

      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="flex items-center justify-center rounded-lg transition-colors duration-150 mx-2 mb-4 py-2"
        style={{ color: '#6b7280', border: '1px solid #1a1a1a' }}
        title={collapsed ? 'Rozbalit' : 'Sbalit'}
        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#e5e7eb'; (e.currentTarget as HTMLElement).style.borderColor = '#2a2a2a'; }}
        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = '#6b7280'; (e.currentTarget as HTMLElement).style.borderColor = '#1a1a1a'; }}
      >
        {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </button>
    </aside>
  );
}