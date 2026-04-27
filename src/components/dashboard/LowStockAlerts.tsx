import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { StockItem } from '../../types';

interface LowStockAlertsProps {
  items: StockItem[];
}

export default function LowStockAlerts({ items }: LowStockAlertsProps) {
  const lowStockItems = items.filter(i => i.quantity <= i.lowStockThreshold);

  if (lowStockItems.length === 0) {
    return null;
  }

  return (
    <div className="bg-white p-6 rounded-2xl border border-rose-100 shadow-sm shadow-rose-50/50">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-rose-50 rounded-xl">
            <AlertTriangle className="w-5 h-5 text-rose-600" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">Low Stock Alerts</h3>
        </div>
        <span className="bg-rose-100 text-rose-700 text-xs font-bold px-2.5 py-1 rounded-full">
          {lowStockItems.length} items
        </span>
      </div>

      <div className="space-y-3">
        {lowStockItems.slice(0, 5).map(item => (
          <div key={item.id} className="flex items-center justify-between p-3 bg-slate-50 hover:bg-slate-100 transition-colors rounded-xl border border-slate-100">
            <div className="flex flex-col">
              <span className="font-semibold text-slate-800 flex items-center gap-2">
                {item.name}
              </span>
              <span className="text-xs text-slate-500 font-mono mt-0.5">{item.sku}</span>
            </div>
            <div className="text-right">
              <span className="block text-sm font-bold text-rose-600">{item.quantity} {item.unit} left</span>
              <span className="block text-xs text-slate-400">Threshold: {item.lowStockThreshold}</span>
            </div>
          </div>
        ))}
        {lowStockItems.length > 5 && (
          <div className="text-center pt-2">
            <span className="text-sm text-slate-500 font-medium">
              + {lowStockItems.length - 5} more items low on stock
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
