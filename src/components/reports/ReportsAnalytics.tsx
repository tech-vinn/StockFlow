import React from 'react';
import { StockItem, StockTransaction } from '../../types';
import { formatCurrency } from '../../lib/utils';
import { TrendingUp, TrendingDown, DollarSign, PackageCheck, PackageMinus } from 'lucide-react';

interface ReportsAnalyticsProps {
  items: StockItem[];
  transactions: StockTransaction[];
}

export default function ReportsAnalytics({ items, transactions }: ReportsAnalyticsProps) {
  const salesTransactions = transactions.filter(t => t.type === 'remove' && t.unitPrice !== undefined);
  const purchaseTransactions = transactions.filter(t => t.type === 'add' && t.unitCost !== undefined);

  const totalRevenue = salesTransactions.reduce((acc, t) => acc + (t.quantity * (t.unitPrice || 0)), 0);
  const totalCost = purchaseTransactions.reduce((acc, t) => acc + (t.quantity * (t.unitCost || 0)), 0);
  
  const totalItemsSold = salesTransactions.reduce((acc, t) => acc + t.quantity, 0);
  const totalItemsPurchased = purchaseTransactions.reduce((acc, t) => acc + t.quantity, 0);

  const netProfit = totalRevenue - totalCost;
  const isProfit = netProfit >= 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div className="bg-white p-6 rounded-2xl border border-slate-200">
        <div className="flex items-center justify-between mb-4">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>
        <p className="text-slate-500 text-sm font-medium">Total Income (Sales)</p>
        <h3 className="text-3xl font-bold mt-1 text-slate-900">{formatCurrency(totalRevenue)}</h3>
      </div>
      
      <div className="bg-white p-6 rounded-2xl border border-slate-200">
        <div className="flex items-center justify-between mb-4">
          <div className="p-3 bg-rose-50 text-rose-600 rounded-xl">
            <TrendingDown className="w-6 h-6" />
          </div>
        </div>
        <p className="text-slate-500 text-sm font-medium">Total Spent (Purchases)</p>
        <h3 className="text-3xl font-bold mt-1 text-slate-900">{formatCurrency(totalCost)}</h3>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-slate-200">
        <div className="flex items-center justify-between mb-4">
          <div className={`p-3 rounded-xl ${isProfit ? 'bg-indigo-50 text-indigo-600' : 'bg-rose-50 text-rose-600'}`}>
            {isProfit ? <TrendingUp className="w-6 h-6" /> : <TrendingDown className="w-6 h-6" />}
          </div>
        </div>
        <p className="text-slate-500 text-sm font-medium">Net Profit / Loss</p>
        <h3 className={`text-3xl font-bold mt-1 ${isProfit ? 'text-indigo-600' : 'text-rose-600'}`}>
          {isProfit ? '+' : ''}{formatCurrency(netProfit)}
        </h3>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-slate-200">
        <div className="flex items-center justify-between mb-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
            <PackageCheck className="w-6 h-6" />
          </div>
        </div>
        <p className="text-slate-500 text-sm font-medium">Volume Sold vs Bought</p>
        <h3 className="text-xl font-bold mt-1 text-slate-900">{totalItemsSold} <span className="text-sm font-normal text-slate-500">sold</span> / {totalItemsPurchased} <span className="text-sm font-normal text-slate-500">bought</span></h3>
      </div>
    </div>
  );
}
