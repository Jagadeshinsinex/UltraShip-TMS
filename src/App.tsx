import { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { DashboardPage } from './components/DashboardPage';
import { ShipmentsPage } from './components/ShipmentsPage';
import { DriversPage } from './components/DriversPage';
import { VehiclesPage } from './components/VehiclesPage';
import { AnalyticsPage } from './components/AnalyticsPage';
import { SettingsPage } from './components/SettingsPage';
import { AddShipmentModal } from './components/AddShipmentModal';
import { LoginScreen } from './components/LoginScreen';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { SearchProvider } from './context/SearchContext';
import { ThemeProvider } from './context/ThemeContext';

import type { Shipment } from './types';

type ViewType = 'dashboard' | 'shipments' | 'drivers' | 'vehicles' | 'analytics' | 'settings';

function MainApp() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingShipment, setEditingShipment] = useState<Shipment | null>(null);
  const [currentView, setCurrentView] = useState<ViewType>('dashboard');
  const { role, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!role) {
    return <LoginScreen />;
  }

  const handleEditShipment = (shipment: Shipment) => {
    setEditingShipment(shipment);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingShipment(null);
  };

  const handleNavigate = (view: string) => {
    setCurrentView(view as 'dashboard' | 'shipments');
  };

  const handleSelectShipment = () => {
    // When a shipment is selected from dashboard, navigate to shipments view
    setCurrentView('shipments');
    // The ShipmentList component will handle showing the detail view
  };

  return (
    <div className="flex bg-slate-50 min-h-screen font-sans">
      <Sidebar
        isCollapsed={isSidebarCollapsed}
        toggleSidebar={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        currentView={currentView}
        onNavigate={handleNavigate}
      />

      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <Header onNavigate={handleNavigate} />

        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          <div className="max-w-[1600px] mx-auto">

            {/* Render current view */}
            {currentView === 'dashboard' && (
              <DashboardPage
                onNavigateToShipments={() => setCurrentView('shipments')}
                onSelectShipment={handleSelectShipment}
              />
            )}

            {currentView === 'shipments' && (
              <ShipmentsPage
                onEdit={handleEditShipment}
                onNew={() => { setEditingShipment(null); setIsModalOpen(true); }}
              />
            )}

            {currentView === 'drivers' && <DriversPage />}

            {currentView === 'vehicles' && <VehiclesPage />}

            {currentView === 'analytics' && <AnalyticsPage />}

            {currentView === 'settings' && <SettingsPage />}

            <AddShipmentModal
              isOpen={isModalOpen}
              onClose={handleCloseModal}
              shipmentToEdit={editingShipment}
            />
          </div>
        </main>
      </div>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <ToastProvider>
          <SearchProvider>
            <MainApp />
          </SearchProvider>
        </ToastProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
