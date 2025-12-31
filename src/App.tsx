import { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { ShipmentList } from './components/ShipmentList';
import { AddShipmentModal } from './components/AddShipmentModal';
import { LoginScreen } from './components/LoginScreen';
import { StatsOverview } from './components/StatsOverview';
import { LiveActivityFeed } from './components/LiveActivityFeed';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
// Plus import removed

import type { Shipment } from './types'; // Add import

function Dashboard() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingShipment, setEditingShipment] = useState<Shipment | null>(null);
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
    setEditingShipment(null); // Reset after close
  };

  return (
    <div className="flex bg-slate-50 min-h-screen font-sans">
      <Sidebar
        isCollapsed={isSidebarCollapsed}
        toggleSidebar={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />

      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <Header />

        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          <div className="max-w-[1600px] mx-auto space-y-6">

            {/* Top KPI Layer */}
            <StatsOverview />

            {/* Main Operational Zone - Full Width */}
            <div className="space-y-6">
              <ShipmentList
                onEdit={handleEditShipment}
                onNew={() => { setEditingShipment(null); setIsModalOpen(true); }}
              />
            </div>

            {/* Secondary Monitoring Layer - Below Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <LiveActivityFeed />
              </div>

              <div className="lg:col-span-1">
                {/* Secondary Meta Card */}
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm h-full flex flex-col justify-center">
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 text-center">System Integrity Console</h4>
                  <div className="space-y-6">
                    <div className="flex justify-between items-center text-xs font-bold px-4">
                      <span className="text-slate-500 uppercase tracking-tight">Backend API Latency</span>
                      <span className="text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                        24ms
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-xs font-bold px-4">
                      <span className="text-slate-500 uppercase tracking-tight">Global Node Sync</span>
                      <span className="text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full"></span>
                        100.0%
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-xs font-bold px-4">
                      <span className="text-slate-500 uppercase tracking-tight">Encryption Status</span>
                      <span className="text-slate-600 bg-slate-50 px-3 py-1 rounded-full border border-slate-200 flex items-center gap-2 font-black">
                        AES-256
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

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
      <ToastProvider>
        <Dashboard />
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;
