import React from 'react';
import { Clock } from 'lucide-react';
import { StockItem } from '../../types';
import { formatDate } from '../../lib/utils';

interface ExpiringItemsAlertsProps {
  items: StockItem[];
}

export default function ExpiringItemsAlerts({ items }: ExpiringItemsAlertsProps) {
  const today = new Date();
  
  const expiringItems = items.filter(i => {
    if (!i.expiryDate) return false;
    const expDate = new Date(i.expiryDate);
    const diffTime = expDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 30; // Expired or expiring within 30 days
  }).sort((a, b) => new Date(a.expiryDate!).getTime() - new Date(b.expiryDate!).getTime());

  if (expiringItems.length === 0) {
    return null;
  }

  return (
    <div className="bg-white p-6 rounded-2xl border border-amber-100 shadow-sm shadow-amber-50/50 mt-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-amber-50 rounded-xl">
            <Clock className="w-5 h-5 text-amber-600" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">Expiring Soon / Expired</h3>
        </div>
        <span className="bg-amber-100 text-amber-700 text-xs font-bold px-2.5 py-1 rounded-full">
          {expiringItems.length} items
        </span>
      </div>

      <div className="space-y-3">
        {expiringItems.slice(0, 5).map(item => {
          const expDate = new Date(item.expiryDate!);
          const diffDays = Math.ceil((expDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
          const isExpired = diffDays < 0;

          return (
            <div key={item.id} className={`flex items-center justify-between p-3 bg-slate-50 hover:bg-slate-100 transition-colors rounded-xl border ${isExpired ? 'border-rose-200' : 'border-amber-200'}`}>
              <div className="flex flex-col">
                <span className="font-semibold text-slate-800 flex items-center gap-2">
                  {item.name}
                </span>
                <span className="text-xs text-slate-500 font-mono mt-0.5">{item.sku}</span>
              </div>
              <div className="text-right">
                <span className={`block text-sm font-bold ${isExpired ? 'text-rose-600' : 'text-amber-600'}`}>
                  {isExpired ? 'Expired' : `Expires in ${diffDays} day${diffDays === 1 ? '' : 's'}`}
                </span>
                <span className="block text-xs text-slate-400">{formatDate(item.expiryDate!)}</span>
              </div>
            </div>
          );
        })}
        {expiringItems.length > 5 && (
          <div className="text-center pt-2">
            <span className="text-sm text-slate-500 font-medium">
              + {expiringItems.length - 5} more items expiring
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
