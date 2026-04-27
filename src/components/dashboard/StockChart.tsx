import React from 'react';
import { BarChart as BarChartIcon } from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from 'recharts';
import { StockItem } from '../../types';

interface StockChartProps {
  items: StockItem[];
}

export default function StockChart({ items }: StockChartProps) {
  // Get top 10 items by value
  const data = [...items]
    .sort((a, b) => (b.quantity * b.price) - (a.quantity * a.price))
    .slice(0, 8)
    .map(item => ({
      name: item.name.length > 15 ? item.name.substring(0, 15) + '...' : item.name,
      value: item.quantity * item.price,
      quantity: item.quantity
    }));

  const COLORS = ['#6366f1', '#8b5cf6', '#a855f7', '#d946ef', '#ec4899', '#f43f5e', '#f97316', '#eab308'];

  if (items.length === 0) {
    return (
      <div className="bg-white p-8 rounded-2xl border border-gray-100 flex flex-col items-center justify-center min-h-[300px]">
        <div className="p-3 bg-gray-50 rounded-full mb-4">
          <BarChartIcon className="w-8 h-8 text-gray-300" />
        </div>
        <p className="text-gray-500 font-medium">No stock data to visualize</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
      <div className="mb-6">
        <h3 className="text-lg font-bold text-slate-900">Stock Value Distribution</h3>
        <p className="text-sm text-slate-500">Top items by current inventory value</p>
      </div>
      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis 
              dataKey="name" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#94a3b8', fontSize: 11 }}
              angle={-25}
              textAnchor="end"
              height={60}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#94a3b8', fontSize: 11 }}
              tickFormatter={(value) => `$${value}`}
            />
            <Tooltip 
              contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
              formatter={(value: number) => [`$${value.toFixed(2)}`, 'Value']}
            />
            <Bar dataKey="value" radius={[6, 6, 0, 0]} barSize={40}>
              {data.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
