import { useState, useEffect } from 'react';
import { ShipmentTable } from './ShipmentTable';
import { ShipmentCard } from './ShipmentCard';
import { ShipmentDetail } from './ShipmentDetail';
import { LayoutGrid, List, Search, Filter, ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { clsx } from 'clsx';
import type { Shipment } from '../types';
import { gql, useQuery, useMutation } from '@apollo/client';

const GET_SHIPMENTS = gql`
  query GetShipments($limit: Int, $offset: Int, $sortBy: String, $status: String, $search: String) {
    getShipments(limit: $limit, offset: $offset, sortBy: $sortBy, status: $status, search: $search) {
      totalCount
      shipments {
        id
        name
        age
        class
        subjects
        attendance
      }
    }
  }
`;

const DELETE_SHIPMENT = gql`
  mutation DeleteShipment($id: ID!) {
    deleteShipment(id: $id)
  }
`;

const PAGE_SIZE = 10;

interface ShipmentListProps {
  onEdit?: (shipment: Shipment) => void;
  onNew?: () => void;
}

export const ShipmentList: React.FC<ShipmentListProps> = ({ onEdit, onNew }) => {
  const [viewMode, setViewMode] = useState<'grid' | 'tile'>('grid');
  const [selectedShipment, setSelectedShipment] = useState<Shipment | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('All Shipments');
  const [page, setPage] = useState(0);
  const [sortBy, setSortBy] = useState('name_ASC');

  // Reset to first page when filtering/searching
  useEffect(() => {
    setPage(0);
  }, [searchQuery, activeTab, sortBy]);

  // Handle browser back button
  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      // If we go back and there is no detail state, close the detail view
      if (!event.state?.isDetail) {
        setSelectedShipment(null);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const handleSelectShipment = (shipment: Shipment) => {
    setSelectedShipment(shipment);
    window.history.pushState({ isDetail: true }, '');
  };

  const handleBackToList = () => {
    setSelectedShipment(null);
    // If the latest history state is detail, go back one step to clean up history
    if (window.history.state?.isDetail) {
      window.history.back();
    }
  };

  const { loading, error, data, refetch } = useQuery(GET_SHIPMENTS, {
    variables: {
      limit: PAGE_SIZE,
      offset: page * PAGE_SIZE,
      sortBy: sortBy,
      status: activeTab,
      search: searchQuery
    },
    fetchPolicy: 'cache-and-network'
  });

  const [deleteShipment] = useMutation(DELETE_SHIPMENT, {
    onCompleted: () => {
      refetch();
    },
    onError: (err: Error) => alert(err.message)
  });

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this shipment?")) {
      deleteShipment({ variables: { id } });
    }
  };

  if (loading && !data) {
    return (
      <div className="flex items-center justify-center h-64 bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          <p className="text-slate-500 font-medium">Loading Shipment Data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64 bg-slate-50 text-red-600">
        <div className="bg-white p-8 rounded-xl shadow-lg border border-red-100 max-w-md text-center">
          <h3 className="text-lg font-bold mb-2">Connection Error</h3>
          <p className="text-slate-600 mb-4">{error.graphQLErrors?.[0]?.message || error.message}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded text-slate-700 font-medium transition-colors"
          >
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  // Defensive check: If loading or no data, shipments is empty
  const filteredShipments: Shipment[] = data?.getShipments?.shipments || [];
  const totalCount = data?.getShipments?.totalCount || 0;
  const totalPages = Math.ceil(totalCount / PAGE_SIZE);

  if (selectedShipment) {
    return (
      <ShipmentDetail
        shipment={selectedShipment}
        onBack={handleBackToList}
      />
    );
  }

  return (
    <div className="space-y-4">
      {/* Unified Logistics Command Bar */}
      <div className="flex flex-row items-center gap-2 bg-white p-2 rounded-xl border border-slate-200 shadow-sm overflow-x-auto no-scrollbar">
        {/* Compact Tabs */}
        <div className="flex items-center bg-slate-100 p-1 rounded-lg shrink-0 h-10">
          {['All Shipments', 'In Transit', 'Pending', 'Delivered'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={clsx(
                "px-3 py-1.5 rounded-md text-xs font-bold transition-all h-full flex items-center",
                activeTab === tab
                  ? "bg-white text-indigo-600 shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
              )}
            >
              {tab.replace(' Shipments', '')}
            </button>
          ))}
        </div>

        <div className="h-8 w-[1px] bg-slate-100 shrink-0 mx-1"></div>

        {/* Dense Pagination Counter */}
        <div className="flex items-center gap-2 bg-slate-50 border border-slate-100 rounded-lg px-3 shrink-0 h-10">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
            {Math.min(totalCount, page * PAGE_SIZE + 1)}-{Math.min(totalCount, (page + 1) * PAGE_SIZE)} / {totalCount}
          </span>
          <div className="h-4 w-[1px] bg-slate-200 mx-1"></div>
          <button
            onClick={() => setPage(p => Math.max(0, p - 1))}
            disabled={page === 0}
            className="p-1 rounded hover:bg-white hover:border-slate-200 border border-transparent disabled:opacity-20 transition-all text-slate-400 hover:text-indigo-600"
          >
            <ChevronLeft size={16} />
          </button>
          <span className="text-xs font-black text-indigo-600 w-5 text-center">
            {page + 1}
          </span>
          <button
            onClick={() => setPage(p => (p + 1 < totalPages ? p + 1 : p))}
            disabled={page + 1 >= totalPages}
            className="p-1 rounded hover:bg-white hover:border-slate-200 border border-transparent disabled:opacity-20 transition-all text-slate-400 hover:text-indigo-600"
          >
            <ChevronRight size={16} />
          </button>
        </div>

        {/* Search & Toolset */}
        <div className="flex items-center gap-3 bg-slate-50 border border-slate-100 rounded-lg px-3 shrink-0 h-10 w-64 lg:w-72">
          <Search size={16} className="text-slate-400 shrink-0" />
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 bg-transparent text-xs font-semibold text-slate-700 focus:outline-none placeholder:text-slate-400"
          />

          <div className="h-5 w-[1px] bg-slate-200"></div>

          <div className="flex items-center gap-1">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-transparent text-[11px] font-bold text-slate-600 outline-none cursor-pointer pr-1 hover:text-indigo-600 transition-colors"
            >
              <option value="name_ASC">A-Z</option>
              <option value="name_DESC">Z-A</option>
              <option value="attendance_DESC">Progress</option>
              <option value="age_DESC">Newest</option>
            </select>
          </div>

          <div className="h-5 w-[1px] bg-slate-200"></div>

          <button className="p-1 rounded hover:bg-white hover:text-indigo-600 transition-all text-slate-400">
            <Filter size={16} />
          </button>
        </div>

        {/* View Selection & Action */}
        <div className="flex items-center gap-2 ml-auto">
          <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200 shrink-0 h-10">
            <button
              onClick={() => setViewMode('grid')}
              className={clsx(
                "p-1.5 rounded-md transition-all h-full flex items-center",
                viewMode === 'grid' ? "bg-white shadow-sm text-indigo-600" : "text-slate-400 hover:text-slate-600"
              )}
            >
              <List size={16} />
            </button>
            <button
              onClick={() => setViewMode('tile')}
              className={clsx(
                "p-1.5 rounded-md transition-all h-full flex items-center",
                viewMode === 'tile' ? "bg-white shadow-sm text-indigo-600" : "text-slate-400 hover:text-slate-600"
              )}
            >
              <LayoutGrid size={16} />
            </button>
          </div>

          <button
            onClick={onNew}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 h-10 rounded-lg text-xs font-bold shadow-md shadow-indigo-100 transition-all hover:scale-[1.02] active:scale-[0.98] uppercase tracking-wider shrink-0"
          >
            <Plus size={16} />
            <span>New Shipment</span>
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="animate-in fade-in duration-500 min-h-[400px]">
        {viewMode === 'grid' ? (
          <ShipmentTable
            shipments={filteredShipments}
            onSelectShipment={handleSelectShipment}
            onEdit={onEdit}
            onDelete={handleDelete}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredShipments.map(shipment => (
              <ShipmentCard
                key={shipment.id}
                shipment={shipment}
                onClick={() => handleSelectShipment(shipment)}
                onEdit={() => onEdit?.(shipment)}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}

        {filteredShipments.length === 0 && !loading && (
          <div className="text-center py-20 text-slate-400">
            <p>No shipments found matching "{searchQuery}"</p>
          </div>
        )}
      </div>

      {/* Bottom Pagination Bar */}
      <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
        <div className="text-xs font-bold text-slate-500">
          Showing <span className="text-slate-900">{Math.min(totalCount, page * PAGE_SIZE + 1)}-{Math.min(totalCount, (page + 1) * PAGE_SIZE)}</span> of <span className="text-slate-900">{totalCount}</span> shipments
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => setPage(p => Math.max(0, p - 1))}
            disabled={page === 0}
            className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-30 transition-all text-slate-600"
          >
            <ChevronLeft size={16} />
          </button>

          <div className="flex items-center gap-1 mx-2">
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => setPage(i)}
                className={clsx(
                  "w-8 h-8 rounded-lg text-xs font-black transition-all",
                  page === i
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-100"
                    : "text-slate-500 hover:bg-slate-50 border border-transparent hover:border-slate-200"
                )}
              >
                {i + 1}
              </button>
            ))}
          </div>

          <button
            onClick={() => setPage(p => (p + 1 < totalPages ? p + 1 : p))}
            disabled={page + 1 >= totalPages}
            className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-30 transition-all text-slate-600"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};
