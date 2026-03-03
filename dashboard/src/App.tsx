import { useEffect, useState } from 'react';
import { Toaster } from 'react-hot-toast';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { DashboardPage } from './components/DashboardPage';
import { UsersTable } from './components/UsersTable';
import { SettingsPage } from './components/SettingsPage';

const tabTitles: Record<string, string> = {
  dashboard: 'Dashboard',
  users:     'Uživatelé',
  settings:  'Nastavení',
};

export default function App() {
  const [activeTab,  setActiveTab]  = useState('dashboard');
  const [collapsed,  setCollapsed]  = useState(false);

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

      <div
        className="flex h-screen overflow-hidden"
        style={{ background: '#0a0a0a', fontFamily: 'Inter, sans-serif' }}
      >
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          collapsed={collapsed}
          setCollapsed={setCollapsed}
        />

        <div className="flex flex-1 flex-col overflow-hidden">
          <Header activeTab={activeTab} setActiveTab={setActiveTab} />

          <main className="flex-1 overflow-y-auto p-8 lg:p-10">
            {activeTab === 'dashboard' && <DashboardPage />}

            {activeTab === 'users' && (
              <div className="space-y-6 fade-up">
                <div>
                  <h2 className="text-2xl font-bold tracking-tight" style={{ color: '#ffffff' }}>
                    Správa týmu
                  </h2>
                  <p className="mt-1 text-sm" style={{ color: '#6b7280' }}>
                    Spravujte uživatele a jejich oprávnění
                  </p>
                </div>
                <UsersTable />
              </div>
            )}

            {activeTab === 'settings' && <SettingsPage />}
          </main>
        </div>
      </div>
    </>
  );
}