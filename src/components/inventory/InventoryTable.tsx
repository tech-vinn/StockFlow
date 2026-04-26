import React from 'react';
import { 
  Search, 
  Filter, 
  MoreVertical, 
  Plus, 
  Minus, 
  AlertCircle,
  MoreHorizontal,
  ChevronDown
} from 'lucide-react';
import { StockItem } from '../../types';
import { formatCurrency, formatDate, cn } from '../../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

interface InventoryTableProps {
  items: StockItem[];
  onAdjust: (item: StockItem, amount: number, reason: string) => void;
  onEdit: (item: StockItem) => void;
  onDelete: (id: string) => void;
}

export default function InventoryTable({ items, onAdjust, onEdit, onDelete }: InventoryTableProps) {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [filterCategory, setFilterCategory] = React.useState('all');
  const [activeActionId, setActiveActionId] = React.useState<string | null>(null);

  const categories = ['all', ...Array.from(new Set(items.map(item => item.category)))];

  const filteredItems = items.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          item.sku.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || item.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="p-4 md:p-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search inventory..."
            className="w-full pl-10 pr-4 py-2 bg-slate-100 border-none rounded-full text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center space-x-3">
          <div className="relative">
            <select
              className="appearance-none pl-4 pr-10 py-2 bg-slate-100 border-none rounded-full text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none cursor-pointer"
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat === 'all' ? 'All Categories' : cat}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-400">
              <th className="px-6 py-4">Item Details</th>
              <th className="px-6 py-4">Category</th>
              <th className="px-6 py-4 text-center">Level</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Unit Price</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredItems.map((item) => (
              <tr key={item.id} className="hover:bg-slate-50/80 transition-colors group">
                <td className="px-6 py-4">
                  <div>
                    <div className="font-medium text-slate-800">{item.name}</div>
                    <div className="text-xs text-slate-400 font-mono mt-0.5">{item.sku}</div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-slate-500">
                    {item.category}
                  </span>
                </td>
                <td className="px-6 py-4 text-center">
                  <span className={cn(
                    "font-medium text-sm tabular-nums",
                    item.quantity <= item.lowStockThreshold ? "text-rose-600" : "text-slate-700"
                  )}>
                    {item.quantity}
                  </span>
                </td>
                <td className="px-6 py-4">
                  {item.quantity <= item.lowStockThreshold ? (
                    <span className="px-2.5 py-1 bg-rose-50 text-rose-600 rounded-full text-[10px] font-bold uppercase tracking-tight">
                      Low Stock
                    </span>
                  ) : item.quantity === 0 ? (
                    <span className="px-2.5 py-1 bg-slate-100 text-slate-500 rounded-full text-[10px] font-bold uppercase tracking-tight">
                      Empty
                    </span>
                  ) : (
                    <span className="px-2.5 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-bold uppercase tracking-tight">
                      In Stock
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 text-sm font-semibold text-slate-800">
                  {formatCurrency(item.price)}
                </td>
                <td className="px-6 py-4 text-right relative">
                  <button 
                    onClick={() => setActiveActionId(activeActionId === item.id ? null : item.id!)}
                    className="p-2 hover:bg-slate-100 rounded-full transition-colors inline-block"
                  >
                    <MoreHorizontal className="w-5 h-5 text-slate-300 group-hover:text-slate-500" />
                  </button>
                  
                  <AnimatePresence>
                    {activeActionId === item.id && (
                      <>
                        <div 
                          className="fixed inset-0 z-10" 
                          onClick={() => setActiveActionId(null)} 
                        />
                        <motion.div 
                          initial={{ opacity: 0, scale: 0.95, y: -10 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.95, y: -10 }}
                          className="absolute right-6 top-14 z-20 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-1"
                        >
                          <button 
                            onClick={() => { onEdit(item); setActiveActionId(null); }}
                            className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 flex items-center"
                          >
                            Edit Item
                          </button>
                          <button 
                            onClick={() => { onDelete(item.id!); setActiveActionId(null); }}
                            className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 flex items-center"
                          >
                            Delete
                          </button>
                        </motion.div>
                      </>
                    )}
                  </AnimatePresence>
                </td>
              </tr>
            ))}
            {filteredItems.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                  No items found matching your filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
