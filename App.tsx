import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { TopHeader } from './components/layout/TopHeader';
import { LeftSidebar } from './components/layout/LeftSidebar';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { DashboardPage } from './pages/DashboardPage';
import { RiskMapPage } from './pages/RiskMapPage';
import { NowcastPage } from './pages/NowcastPage';
import { ImpactAnalysisPage } from './pages/ImpactAnalysisPage';
import { EvacuationPage } from './pages/EvacuationPage';
import { AlertsPage } from './pages/AlertsPage';
import { SimulatorPage } from './pages/SimulatorPage';
import { ReportsPage } from './pages/ReportsPage';
import { SettingsPage } from './pages/SettingsPage';
import { CitizenDashboardPage } from './pages/CitizenDashboardPage';

const AppContent: React.FC = () => {
  const { user, activeTab, role } = useAuth();
  const [authView, setAuthView] = useState<'login' | 'register'>('login');

  if (!user) {
    if (authView === 'register') {
      return <RegisterPage onNavigateLogin={() => setAuthView('login')} />;
    }
    return <LoginPage onNavigateRegister={() => setAuthView('register')} />;
  }

  return (
    <div className="min-h-screen bg-[#061426] text-white flex flex-col font-sans select-none antialiased">
      {/* Top Fixed Header */}
      <TopHeader />

      {/* Main Container below Header */}
      <div className="flex pt-14 min-h-screen">
        {/* Left Sidebar */}
        <LeftSidebar />

        {/* Dynamic Route View Content */}
        <main className="grow transition-all duration-300 md:ml-64 bg-[#061426] min-h-[calc(100vh-3.5rem)] pb-12 overflow-x-hidden">
          {role === 'CITIZEN' && activeTab === 'dashboard' ? (
            <CitizenDashboardPage />
          ) : (
            <>
              {activeTab === 'dashboard' && <DashboardPage />}
              {activeTab === 'risk-map' && <RiskMapPage />}
              {activeTab === 'nowcast' && <NowcastPage />}
              {activeTab === 'impact-analysis' && <ImpactAnalysisPage />}
              {activeTab === 'evacuation' && <EvacuationPage />}
              {activeTab === 'alerts' && <AlertsPage />}
              {activeTab === 'simulator' && <SimulatorPage />}
              {activeTab === 'reports' && <ReportsPage />}
              {activeTab === 'settings' && <SettingsPage />}
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;
