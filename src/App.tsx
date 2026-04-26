/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useAuth } from './hooks/useAuth';
import { useInventory } from './hooks/useInventory';
import Shell from './components/layout/Shell';
import StatsGrid from './components/dashboard/StatsGrid';
import StockChart from './components/dashboard/StockChart';
import InventoryTable from './components/inventory/InventoryTable';
import TransactionsList from './components/inventory/TransactionsList';
import StockModal from './components/inventory/StockModal';
import TeamManagement from './components/team/TeamManagement';
import Login from './components/auth/Login';
import { Plus, Bell, X } from 'lucide-react';
import { StockItem } from './types';
import { useTeam } from './hooks/useTeam';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const { user, profile, login, logout, loading: authLoading } = useAuth();
  const { 
    items, 
    transactions, 
    loading: itemsLoading, 
    addItem, 
    updateItem, 
    adjustStock, 
    removeItem 
  } = useInventory(user?.uid);

  const isAdmin = profile?.role === 'admin' || user?.email === 'kaalekelvin47@gmail.com';
  const { teamMembers, loading: teamLoading, newJoiner, clearNotification } = useTeam(isAdmin);

  const [activeTab, setActiveTab] = React.useState('dashboard');
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [editingItem, setEditingItem] = React.useState<StockItem | undefined>(undefined);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!user) {
    return <Login onLogin={login} loading={authLoading} />;
  }

  const handleEdit = (item: StockItem) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const handleAddNew = () => {
    setEditingItem(undefined);
    setIsModalOpen(true);
  };

  const handleSubmit = (data: any) => {
    if (editingItem?.id) {
      updateItem(editingItem.id, data);
    } else {
      addItem(data);
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="space-y-6">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold">Dashboard</h1>
                <p className="text-gray-500">Welcome back, {user.displayName}</p>
              </div>
              <button 
                onClick={handleAddNew}
                className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
              >
                <Plus className="w-5 h-5 mr-2" />
                Add New Item
              </button>
            </header>
            
            <StatsGrid items={items} />
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <StockChart items={items} />
              <TransactionsList transactions={transactions.slice(0, 5)} />
            </div>
          </div>
        );
      
      case 'inventory':
        return (
          <div className="space-y-6">
            <header className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold">Inventory</h1>
                <p className="text-gray-500">Manage your list of products and stock levels</p>
              </div>
              <button 
                onClick={handleAddNew}
                className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
              >
                <Plus className="w-5 h-5 mr-2" />
                Add Item
              </button>
            </header>
            <InventoryTable 
              items={items} 
              onEdit={handleEdit}
              onAdjust={adjustStock}
              onDelete={removeItem}
            />
          </div>
        );

      case 'transactions':
        return (
          <div className="space-y-6">
            <header>
              <h1 className="text-3xl font-bold">Transactions</h1>
              <p className="text-gray-500">History of all stock movements and updates</p>
            </header>
            <TransactionsList transactions={transactions} />
          </div>
        );

      case 'reports':
        return (
          <div className="space-y-6">
            <header>
              <h1 className="text-3xl font-bold">Reports</h1>
              <p className="text-gray-500">Detailed analytics and stock performance</p>
            </header>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <StockChart items={items} />
              <div className="bg-white p-6 rounded-2xl border border-gray-100 h-full">
                <h3 className="text-lg font-bold mb-4">Stock Insights</h3>
                <div className="space-y-4">
                  {items.filter(i => i.quantity <= i.lowStockThreshold).map(item => (
                    <div key={item.id} className="flex items-center justify-between p-3 bg-amber-50 rounded-xl border border-amber-100">
                      <span className="text-sm font-medium text-amber-900">{item.name}</span>
                      <span className="text-xs font-bold text-amber-600">LOW STOCK: {item.quantity}</span>
                    </div>
                  ))}
                  {items.length === 0 && <p className="text-gray-400 text-center py-10">No insights available</p>}
                </div>
              </div>
            </div>
          </div>
        );

      case 'team':
        return isAdmin ? (
          <div className="space-y-6">
            <header>
              <h1 className="text-3xl font-bold">Team Management</h1>
              <p className="text-gray-500">Manage user access and see who joined your business</p>
            </header>
            <TeamManagement members={teamMembers} loading={teamLoading} />
          </div>
        ) : null;

      default:
        return null;
    }
  };

  return (
    <Shell 
      activeTab={activeTab} 
      setActiveTab={setActiveTab} 
      user={user} 
      onLogout={logout}
    >
      {renderContent()}

      <AnimatePresence>
        {newJoiner && (
          <motion.div
            initial={{ opacity: 0, x: 100, y: 20 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            exit={{ opacity: 0, x: 100 }}
            className="fixed bottom-6 right-6 z-[60] w-full max-w-sm"
          >
            <div className="bg-white rounded-2xl shadow-2xl border border-slate-100 p-4 flex items-center space-x-4">
              <div className="bg-indigo-50 p-3 rounded-xl shrink-0">
                <Bell className="w-6 h-6 text-indigo-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold text-slate-900">New Team Member!</p>
                <p className="text-xs text-slate-500">{newJoiner.displayName} ({newJoiner.email}) just joined.</p>
              </div>
              <button onClick={clearNotification} className="p-1 hover:bg-slate-100 rounded-lg shrink-0">
                <X className="w-4 h-4 text-slate-400" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <StockModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        initialData={editingItem}
      />
    </Shell>
  );
}

