import React from 'react';
import { motion } from 'motion/react';
import { Package, AlertTriangle, TrendingUp, DollarSign } from 'lucide-react';
import { StockItem } from '../../types';
import { formatCurrency, cn } from '../../lib/utils';

interface StatsGridProps {
  items: StockItem[];
}

export default function StatsGrid({ items }: StatsGridProps) {
  const totalStock = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalValue = items.reduce((sum, item) => sum + (item.quantity * item.price), 0);
  const lowStockItems = items.filter(item => item.quantity <= item.lowStockThreshold);
  const totalItems = items.length;

  const stats = [
    {
      name: 'Total Inventory',
      value: totalStock,
      label: 'Units in stock',
      icon: Package,
      color: 'bg-blue-500',
      textColor: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      name: 'Stock Value',
      value: formatCurrency(totalValue),
      label: 'Total assets value',
      icon: DollarSign,
      color: 'bg-emerald-500',
      textColor: 'text-emerald-600',
      bgColor: 'bg-emerald-50'
    },
    {
      name: 'Low Stock Alerts',
      value: lowStockItems.length,
      label: 'Items below threshold',
      icon: AlertTriangle,
      color: 'bg-amber-500',
      textColor: 'text-amber-600',
      bgColor: 'bg-amber-50',
      urgent: lowStockItems.length > 0
    },
    {
      name: 'Unique Products',
      value: totalItems,
      label: 'Active SKUs',
      icon: TrendingUp,
      color: 'bg-indigo-500',
      textColor: 'text-indigo-600',
      bgColor: 'bg-indigo-50'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.name}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-500 text-sm font-medium">{stat.name}</p>
              <h3 className="text-3xl font-bold mt-1 text-slate-900 tabular-nums">{stat.value}</h3>
              {stat.urgent ? (
                <span className="text-rose-500 text-xs font-bold">Requires action</span>
              ) : stat.name === 'Stock Value' ? (
                <span className="text-slate-400 text-xs">Calculated at cost</span>
              ) : (
                <p className="text-xs text-slate-400 mt-1">{stat.label}</p>
              )}
            </div>
            <div className={cn("p-2 rounded-lg transition-transform group-hover:scale-110", stat.bgColor, stat.textColor)}>
              <stat.icon className="w-5 h-5" />
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
