import { LayoutDashboard, Users, Settings, ChevronLeft, ChevronRight, BarChart2, ShoppingBag, X } from 'lucide-react';

const navItems = [
  { id: 'dashboard', label: 'Dashboard',  icon: LayoutDashboard },
  { id: 'analytics', label: 'Analytika',  icon: BarChart2        },
  { id: 'orders',    label: 'Objednávky', icon: ShoppingBag      },
  { id: 'users',     label: 'Uživatelé',  icon: Users            },
  { id: 'settings',  label: 'Nastavení',  icon: Settings         },
];

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  collapsed: boolean;
  setCollapsed: (v: boolean) => void;
  mobileOpen: boolean;
  setMobileOpen: (v: boolean) => void;
}

/* ── Shared inner content ── */
function SidebarContent({
  activeTab, setActiveTab, collapsed, setCollapsed, onNavClick,
}: {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  collapsed: boolean;
  setCollapsed: (v: boolean) => void;
  onNavClick?: () => void;
}) {
  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      {/* Logo */}
      <div className={`flex items-center px-3.5 py-6 min-h-18 ${collapsed ? '' : 'gap-3'}`}>
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-xs font-black text-white bg-red-600">
          N
        </div>
        {!collapsed && (
          <span className="whitespace-nowrap text-[15px] font-bold tracking-tight text-white">
            Nexus Dash
          </span>
        )}
      </div>

      <div className="h-px bg-[#1a1a1a] mx-3 mb-2" />

      {/* Nav */}
      <nav className="flex-1 space-y-0.5 px-2">
        {navItems.map(({ id, label, icon: Icon }) => {
          const active = activeTab === id;
          return (
            <button
              key={id}
              onClick={() => { setActiveTab(id); onNavClick?.(); }}
              title={collapsed ? label : undefined}
              className={`relative w-full flex items-center rounded-lg transition-all duration-150 px-2.5 py-2.5 ${
                collapsed ? 'justify-center' : 'gap-2.5 justify-start'
              } ${
                active
                  ? 'bg-red-600/8 text-red-500'
                  : 'text-[#6b7280] hover:text-[#e5e7eb] hover:bg-white/3'
              }`}
            >
              {active && (
                <div className="absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-r bg-red-600" />
              )}
              <Icon size={16} />
              {!collapsed && <span className="text-sm font-medium">{label}</span>}
            </button>
          );
        })}
      </nav>

      {/* Status badge */}
      {!collapsed && (
        <div className="mx-3 mb-3 rounded-lg p-3 bg-[#111111] border border-[#1a1a1a]">
          <div className="flex items-center gap-2">
            <span className="relative flex h-1.5 w-1.5 shrink-0">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-60" />
              <span className="inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
            </span>
            <span className="text-xs text-[#6b7280]">Systém online</span>
          </div>
        </div>
      )}

      {/* Collapse toggle (desktop only) */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="flex items-center justify-center rounded-lg transition-all duration-150
                   mx-2 mb-4 py-2 text-[#6b7280] border border-[#1a1a1a]
                   hover:text-[#e5e7eb] hover:border-[#2a2a2a]"
        title={collapsed ? 'Rozbalit' : 'Sbalit'}
      >
        {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </button>
    </div>
  );
}

export function Sidebar({ activeTab, setActiveTab, collapsed, setCollapsed, mobileOpen, setMobileOpen }: SidebarProps) {
  return (
    <>
      {/* ── Mobile overlay backdrop ── */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* ── Mobile drawer ── */}
      <div
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-[#0d0d0d] border-r border-[#1a1a1a]
                    transition-transform duration-300 ease-in-out lg:hidden
                    ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        {/* Close button */}
        <button
          onClick={() => setMobileOpen(false)}
          className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-lg
                     text-[#6b7280] hover:text-white hover:bg-white/6 transition-colors"
          aria-label="Zavřít menu"
        >
          <X size={16} />
        </button>

        <SidebarContent
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          collapsed={false}
          setCollapsed={setCollapsed}
          onNavClick={() => setMobileOpen(false)}
        />
      </div>

      {/* ── Desktop sidebar ── */}
      <aside
        className={`relative hidden lg:flex shrink-0 flex-col transition-all duration-200
                    bg-[#0d0d0d] border-r border-[#1a1a1a] overflow-hidden ${
          collapsed ? 'w-14' : 'w-60'
        }`}
      >
        <SidebarContent
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          collapsed={collapsed}
          setCollapsed={setCollapsed}
        />
      </aside>
    </>
  );
}