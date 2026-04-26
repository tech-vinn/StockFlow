import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BarChart3, 
  Box, 
  History, 
  LayoutDashboard, 
  LogOut, 
  Menu, 
  Plus, 
  Settings, 
  X,
  Package,
  AlertTriangle,
  TrendingUp,
  Users
} from 'lucide-react';
import { cn } from '../../lib/utils';

interface ShellProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  user: any;
  onLogout: () => void;
}

export default function Shell({ children, activeTab, setActiveTab, user, onLogout }: ShellProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const navigation = [
    { name: 'Dashboard', icon: LayoutDashboard, id: 'dashboard' },
    { name: 'Inventory', icon: Box, id: 'inventory' },
    { name: 'Transactions', icon: History, id: 'transactions' },
    { name: 'Reports', icon: BarChart3, id: 'reports' },
    ...(user?.email === 'kaalekelvin47@gmail.com' ? [{ name: 'Team', icon: Users, id: 'team' }] : []),
  ];

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex md:w-64 md:flex-col bg-white border-r border-slate-200">
        <div className="flex flex-col flex-grow pt-5 pb-4 overflow-y-auto">
          <div className="flex items-center flex-shrink-0 px-6 space-x-2 mb-6">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold">S</div>
            <span className="text-xl font-bold font-display text-slate-800 tracking-tight uppercase">StockCore</span>
          </div>
          <nav className="mt-4 flex-1 px-3 space-y-1">
            {navigation.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={cn(
                  activeTab === item.id
                    ? 'bg-slate-100 text-indigo-600'
                    : 'text-slate-500 hover:bg-slate-50 transition-colors',
                  'group flex items-center px-3 py-2 text-sm font-medium rounded-md w-full transition-all'
                )}
              >
                <item.icon
                  className={cn(
                    activeTab === item.id ? 'text-indigo-600' : 'text-slate-400 group-hover:text-slate-500',
                    'mr-3 flex-shrink-0 h-5 w-5'
                  )}
                />
                {item.name}
              </button>
            ))}
          </nav>

          <div className="px-6 mt-6">
            <div className="bg-indigo-50 rounded-xl p-4">
              <p className="text-[10px] font-bold text-indigo-700 uppercase mb-1">Live Updates</p>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="text-[10px] text-slate-500 font-mono italic">Connected</span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex-shrink-0 flex border-t border-slate-100 p-4">
          <div className="flex items-center space-x-3 w-full">
            <img
              className="h-8 w-8 rounded-full bg-slate-100"
              src={user?.photoURL || `https://ui-avatars.com/api/?name=${user?.displayName}`}
              alt=""
            />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-slate-900 truncate uppercase tracking-wider">{user?.displayName}</p>
              <button 
                onClick={onLogout}
                className="text-[10px] font-medium text-slate-500 hover:text-slate-700 flex items-center space-x-1"
              >
                <LogOut className="w-3 h-3" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile menu - Backdrop */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMobileMenuOpen(false)}
            className="fixed inset-0 z-40 md:hidden bg-gray-600/75"
          />
        )}
      </AnimatePresence>

      {/* Mobile menu - Sidebar */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-y-0 left-0 z-50 w-full max-w-xs bg-white shadow-xl md:hidden flex flex-col"
          >
            <div className="flex items-center justify-between px-4 h-16 border-b border-gray-200">
              <div className="flex items-center space-x-2">
                <Package className="w-6 h-6 text-indigo-600" />
                <span className="text-xl font-bold font-display">StockSync</span>
              </div>
              <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 -mr-2 rounded-md hover:bg-gray-100">
                <X className="w-6 h-6" />
              </button>
            </div>
            <nav className="flex-1 px-4 py-4 space-y-1">
              {navigation.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setIsMobileMenuOpen(false);
                  }}
                  className={cn(
                    activeTab === item.id
                      ? 'bg-indigo-50 text-indigo-600'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900',
                    'group flex items-center px-4 py-3 text-base font-medium rounded-xl w-full'
                  )}
                >
                  <item.icon className="mr-4 h-6 w-6" />
                  {item.name}
                </button>
              ))}
            </nav>
            <div className="p-4 border-t border-gray-200">
              <button 
                onClick={onLogout}
                className="flex items-center space-x-3 w-full px-4 py-3 text-base font-medium text-gray-600 rounded-xl hover:bg-red-50 hover:text-red-600 transition-colors"
              >
                <LogOut className="w-6 h-6" />
                <span>Sign out</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex flex-col flex-1 w-0 overflow-hidden">
        <header className="md:hidden bg-white border-b border-gray-200 px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Package className="w-6 h-6 text-indigo-600" />
            <span className="text-xl font-bold font-display">StockSync</span>
          </div>
          <button onClick={() => setIsMobileMenuOpen(true)} className="p-2 -mr-2 rounded-md hover:bg-gray-100">
            <Menu className="w-6 h-6" />
          </button>
        </header>

        <main className="flex-1 overflow-y-auto focus:outline-none bg-gray-50 p-4 md:p-8">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
