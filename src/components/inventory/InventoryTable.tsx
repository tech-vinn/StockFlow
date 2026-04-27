import React from 'react';
import { 
  Search, 
  ChevronDown,
  Pencil,
  Trash2,
  AlertTriangle,
  Clock,
  ScanLine,
  Barcode as BarcodeIcon
} from 'lucide-react';
import { StockItem } from '../../types';
import { formatCurrency, formatDate, cn } from '../../lib/utils';
import BarcodeScannerModal from './BarcodeScannerModal';
import BarcodeDisplayModal from './BarcodeDisplayModal';

interface InventoryTableProps {
  items: StockItem[];
  onAdjust: (item: StockItem) => void;
  onEdit: (item: StockItem) => void;
  onDelete: (id: string) => void;
}

export default function InventoryTable({ items, onAdjust, onEdit, onDelete }: InventoryTableProps) {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [filterCategory, setFilterCategory] = React.useState('all');
  const [isScannerOpen, setIsScannerOpen] = React.useState(false);
  const [barcodeItem, setBarcodeItem] = React.useState<StockItem | null>(null);

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
        <div className="relative flex-1 max-w-md flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search inventory..."
              className="w-full pl-10 pr-4 py-2 bg-slate-100 border-none rounded-full text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button 
            onClick={() => setIsScannerOpen(true)}
            className="p-2 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 rounded-full transition-colors shrink-0"
            title="Scan Barcode"
          >
            <ScanLine className="w-5 h-5" />
          </button>
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
        <table className="w-full text-left min-w-[800px]">
          <thead>
            <tr className="bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-400">
              <th className="px-6 py-4">Item Name</th>
              <th className="px-6 py-4">SKU</th>
              <th className="px-6 py-4">Category</th>
              <th className="px-6 py-4 text-center">Level</th>
              <th className="px-6 py-4">Expiry Date</th>
              <th className="px-6 py-4 text-center">Status</th>
              <th className="px-6 py-4">Unit Price</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredItems.map((item) => {
              const hasExpiry = !!item.expiryDate;
              const isExpiringSoon = false; // We will calculate this
              const isExpired = false; // We will calculate this
              let expiryClass = "text-slate-500";
              
              if (hasExpiry) {
                const today = new Date();
                const expDate = new Date(item.expiryDate!);
                const diffTime = expDate.getTime() - today.getTime();
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                
                if (diffDays < 0) {
                  expiryClass = "text-rose-600 font-medium";
                } else if (diffDays <= 30) {
                  expiryClass = "text-amber-600 font-medium";
                }
              }

              return (
              <tr key={item.id} className="hover:bg-slate-50/80 transition-colors group">
                <td className="px-6 py-4 font-medium text-slate-800">
                  <div className="flex items-center space-x-2">
                    <span>{item.name}</span>
                    {item.quantity <= item.lowStockThreshold && (
                      <div className="group/tooltip relative flex items-center justify-center">
                        <AlertTriangle className="w-4 h-4 text-rose-500" />
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover/tooltip:block w-max bg-slate-800 text-white text-[10px] px-2 py-1 rounded whitespace-nowrap z-10">
                          Low Stock
                        </div>
                      </div>
                    )}
                    {hasExpiry && expiryClass !== "text-slate-500" && (
                      <div className="group/tooltip relative flex items-center justify-center">
                        <Clock className={`w-4 h-4 ${expiryClass.includes('rose') ? 'text-rose-500' : 'text-amber-500'}`} />
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover/tooltip:block w-max bg-slate-800 text-white text-[10px] px-2 py-1 rounded whitespace-nowrap z-10">
                          {expiryClass.includes('rose') ? 'Expired' : 'Expiring Soon'}
                        </div>
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-slate-500 font-mono">
                  {item.sku}
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
                <td className={`px-6 py-4 text-sm ${expiryClass}`}>
                  {hasExpiry ? formatDate(item.expiryDate!) : <span className="text-slate-300">-</span>}
                </td>
                <td className="px-6 py-4 text-center">
                  {item.quantity <= item.lowStockThreshold ? (
                    <span className="px-2.5 py-1 bg-rose-50 text-rose-600 rounded-full text-[10px] font-bold uppercase tracking-tight whitespace-nowrap">
                      Low Stock
                    </span>
                  ) : item.quantity === 0 ? (
                    <span className="px-2.5 py-1 bg-slate-100 text-slate-500 rounded-full text-[10px] font-bold uppercase tracking-tight whitespace-nowrap">
                      Empty
                    </span>
                  ) : (
                    <span className="px-2.5 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-bold uppercase tracking-tight whitespace-nowrap">
                      In Stock
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 text-sm font-semibold text-slate-800">
                  {formatCurrency(item.price)}
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end space-x-2 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => setBarcodeItem(item)}
                      className="p-1.5 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
                      title="View Barcode"
                    >
                      <BarcodeIcon className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => onAdjust(item)}
                      className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors font-semibold text-xs px-2"
                      title="Record Transaction"
                    >
                      Trade
                    </button>
                    <button 
                      onClick={() => onEdit(item)}
                      className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                      title="Edit Item"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => onDelete(item.id!)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                      title="Delete Item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            );
            })}
            {filteredItems.length === 0 && (
              <tr>
                <td colSpan={8} className="px-6 py-12 text-center text-slate-500">
                  No items found matching your filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <BarcodeScannerModal 
        isOpen={isScannerOpen} 
        onClose={() => setIsScannerOpen(false)} 
        onScan={(sku) => setSearchTerm(sku)} 
      />

      <BarcodeDisplayModal 
        isOpen={!!barcodeItem} 
        onClose={() => setBarcodeItem(null)} 
        item={barcodeItem} 
      />
    </div>
  );
}
