import React from 'react';
import { StockItem, StockTransaction } from '../../types';
import { formatCurrency, formatDate } from '../../lib/utils';
import { TrendingUp, TrendingDown, DollarSign, PackageCheck, Download } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

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

  const exportInventoryPDF = () => {
    const doc = new jsPDF();
    
    doc.setFontSize(16);
    doc.text('Inventory Report', 14, 20);
    doc.setFontSize(10);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 28);

    const headers = [['Name', 'SKU', 'Category', 'Quantity', 'Unit', 'Cost', 'Price', 'Expiry Date']];
    const data = items.map(i => [
      i.name,
      i.sku,
      i.category,
      i.quantity.toString(),
      i.unit,
      i.cost !== undefined ? formatCurrency(i.cost) : '-',
      i.price !== undefined ? formatCurrency(i.price) : '-',
      i.expiryDate ? formatDate(i.expiryDate) : '-'
    ]);

    autoTable(doc, {
      head: headers,
      body: data,
      startY: 35,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [51, 65, 85] }
    });

    doc.save(`inventory_export_${new Date().toISOString().split('T')[0]}.pdf`);
  };

  const exportTransactionsPDF = () => {
    const doc = new jsPDF();
    
    doc.setFontSize(16);
    doc.text('Transactions Report', 14, 20);
    doc.setFontSize(10);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 28);

    const headers = [['Date', 'Item', 'Type', 'Quantity', 'Reason', 'Unit Price', 'Unit Cost']];
    const data = [...transactions]
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .map(t => [
        formatDate(t.timestamp),
        t.itemName || t.itemId,
        t.type,
        t.quantity.toString(),
        t.reason,
        t.unitPrice !== undefined ? formatCurrency(t.unitPrice) : '-',
        t.unitCost !== undefined ? formatCurrency(t.unitCost) : '-'
      ]);

    autoTable(doc, {
      head: headers,
      body: data,
      startY: 35,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [51, 65, 85] }
    });

    doc.save(`transactions_export_${new Date().toISOString().split('T')[0]}.pdf`);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-end gap-3">
        <button 
          onClick={exportInventoryPDF}
          className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2 transition-colors"
        >
          <Download className="w-4 h-4" />
          Export Inventory (PDF)
        </button>
        <button 
          onClick={exportTransactionsPDF}
          className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2 transition-colors"
        >
          <Download className="w-4 h-4" />
          Export Transactions (PDF)
        </button>
      </div>

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
    </div>
  );
}
