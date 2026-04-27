import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  ArrowUpRight, 
  ArrowDownLeft, 
  RefreshCw, 
  AlertCircle,
  Package,
  ArrowRight,
  History
} from 'lucide-react';
import { StockTransaction } from '../../types';
import { formatDate, cn, formatCurrency } from '../../lib/utils';

interface TransactionsListProps {
  transactions: StockTransaction[];
}

export default function TransactionsList({ transactions }: TransactionsListProps) {
  const getIcon = (type: string) => {
    switch (type) {
      case 'add': return <ArrowDownLeft className="w-4 h-4 text-emerald-600" />;
      case 'remove': return <ArrowUpRight className="w-4 h-4 text-red-600" />;
      case 'adjustment': return <RefreshCw className="w-4 h-4 text-blue-600" />;
      default: return <Package className="w-4 h-4 text-gray-600" />;
    }
  };

  const getBadgeClass = (type: string) => {
    switch (type) {
      case 'add': return 'bg-emerald-50 text-emerald-700 border-emerald-100';
      case 'remove': return 'bg-red-50 text-red-700 border-red-100';
      case 'adjustment': return 'bg-blue-50 text-blue-700 border-blue-100';
      default: return 'bg-gray-50 text-gray-700 border-gray-100';
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="p-6 border-b border-slate-100 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-slate-900">Activity History</h3>
          <p className="text-sm text-slate-500">Recent stock movements and adjustments</p>
        </div>
      </div>
      
      <div className="divide-y divide-slate-50">
        {transactions.length === 0 ? (
          <div className="py-12 text-center text-slate-400 flex flex-col items-center">
            <History className="w-8 h-8 mb-3 opacity-20" />
            <p>No transactions recorded yet</p>
          </div>
        ) : (
          transactions.map((tx, idx) => (
            <motion.div 
              key={tx.id || idx}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: Math.min(idx * 0.05, 1) }}
              className="p-4 md:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50/50 transition-colors"
            >
              <div className="flex items-start space-x-4">
                <div className={cn("p-2 rounded-xl border shrink-0", getBadgeClass(tx.type))}>
                  {getIcon(tx.type)}
                </div>
                <div>
                  <div className="font-semibold text-slate-900">
                    {tx.itemName || 'Deleted Item'}
                    {tx.type === 'remove' && tx.unitPrice && (
                      <span className="ml-2 text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                        Sold @ {formatCurrency(tx.unitPrice)}
                      </span>
                    )}
                    {tx.type === 'add' && tx.unitCost && (
                      <span className="ml-2 text-xs font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md">
                        Bought @ {formatCurrency(tx.unitCost)}
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5 flex items-center">
                    <span>{tx.reason}</span>
                    <span className="mx-2 text-slate-300">•</span>
                    <span>{formatDate(tx.timestamp)}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between md:justify-end gap-6">
                <div className="text-right">
                  <div className={cn(
                    "font-bold tabular-nums",
                    tx.type === 'add' ? 'text-emerald-600' : tx.type === 'remove' ? 'text-rose-600' : 'text-blue-600'
                  )}>
                    {tx.type === 'add' ? '+' : tx.type === 'remove' ? '-' : ''}{tx.quantity}
                  </div>
                </div>
                
                <div className="flex items-center text-[10px] font-bold text-slate-400 bg-slate-50 px-3 py-1 rounded-lg border border-slate-100">
                  <span>{tx.previousQuantity}</span>
                  <ArrowRight className="w-3 h-3 mx-2 text-slate-300" />
                  <span className="text-slate-900">{tx.newQuantity}</span>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}


