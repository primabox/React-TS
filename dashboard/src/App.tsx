import { useEffect, useState } from 'react';
import { Toaster } from 'react-hot-toast';
import { Sidebar }       from './components/Sidebar';
import { Header }        from './components/Header';
import { DashboardPage } from './components/DashboardPage';
import { AnalyticsPage } from './components/AnalyticsPage';
import { OrdersPage }    from './components/OrdersPage';
import { UsersTable }    from './components/UsersTable';
import { SettingsPage }  from './components/SettingsPage';

const tabTitles: Record<string, string> = {
  dashboard: 'Dashboard',
  analytics: 'Analytika',
  orders:    'Objednávky',
  users:     'Uživatelé',
  settings:  'Nastavení',
};

export default function App() {
  const [activeTab,  setActiveTab]  = useState('dashboard');
  const [collapsed,  setCollapsed]  = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    document.title = `${tabTitles[activeTab] ?? activeTab} | Nexus Dash`;
  }, [activeTab]);

  return (
    <>
      <Toaster
        position="top-right"
        reverseOrder={false}
        toastOptions={{
          style: {
            background: '#111111',
            color: '#ffffff',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '8px',
            fontFamily: 'Inter, sans-serif',
            fontSize: '13px',
          },
        }}
      />

      <div className="flex h-screen overflow-hidden bg-[#0a0a0a]" style={{ fontFamily: 'Inter, sans-serif' }}>
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          collapsed={collapsed}
          setCollapsed={setCollapsed}
          mobileOpen={mobileOpen}
          setMobileOpen={setMobileOpen}
        />

        <div className="flex flex-1 flex-col overflow-hidden">
          <Header
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            onMenuToggle={() => setMobileOpen(o => !o)}
          />

          <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-10">
            {activeTab === 'dashboard' && <DashboardPage />}
            {activeTab === 'analytics' && <AnalyticsPage />}
            {activeTab === 'orders'    && <OrdersPage />}
            {activeTab === 'users'     && (
              <div className="space-y-6 fade-up">
                <div>
                  <h2 className="text-2xl font-bold tracking-tight text-white">Správa týmu</h2>
                  <p className="mt-1 text-sm text-[#6b7280]">Spravujte uživatele a jejich oprávnění</p>
                </div>
                <UsersTable />
              </div>
            )}
            {activeTab === 'settings'  && <SettingsPage />}
          </main>
        </div>
      </div>
    </>
  );
}