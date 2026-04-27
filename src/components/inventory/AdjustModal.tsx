import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ArrowDownRight, ArrowUpRight, AlertCircle, DollarSign, Package } from 'lucide-react';
import { StockItem } from '../../types';

interface AdjustModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: StockItem | null;
  onSubmit: (amount: number, reason: string, type: 'buy' | 'sell' | 'adjust', unitValue?: number) => void;
}

export default function AdjustModal({ isOpen, onClose, item, onSubmit }: AdjustModalProps) {
  const [type, setType] = React.useState<'buy' | 'sell' | 'adjust'>('sell');
  const [amount, setAmount] = React.useState<number | ''>('');
  const [unitValue, setUnitValue] = React.useState<number | ''>('');
  const [reason, setReason] = React.useState('');

  React.useEffect(() => {
    if (isOpen && item) {
      setType('sell');
      setAmount('');
      setUnitValue(item.price || '');
      setReason(`Sale of ${item.name}`);
    }
  }, [isOpen, item]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || amount <= 0) return;
    onSubmit(
      Number(amount), 
      reason, 
      type, 
      unitValue !== '' ? Number(unitValue) : undefined
    );
    onClose();
  };

  if (!item) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden"
          >
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-xl font-bold text-slate-800">Record Transaction</h3>
              <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div className="flex bg-slate-100 p-1 rounded-xl">
                <button
                  type="button"
                  onClick={() => {
                    setType('sell');
                    setUnitValue(item.price || '');
                    setReason(`Sale of ${item.name}`);
                  }}
                  className={`flex-1 py-2 text-sm font-bold rounded-lg flex items-center justify-center space-x-2 transition-all ${type === 'sell' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  <ArrowUpRight className="w-4 h-4" />
                  <span>Sell Stock</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setType('buy');
                    setUnitValue(item.cost || '');
                    setReason(`Purchase of ${item.name}`);
                  }}
                  className={`flex-1 py-2 text-sm font-bold rounded-lg flex items-center justify-center space-x-2 transition-all ${type === 'buy' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  <ArrowDownRight className="w-4 h-4" />
                  <span>Buy Stock</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setType('adjust');
                    setUnitValue('');
                    setReason('Inventory count correction');
                  }}
                  className={`flex-1 py-2 text-sm font-bold rounded-lg flex items-center justify-center space-x-2 transition-all ${type === 'adjust' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  <AlertCircle className="w-4 h-4" />
                  <span>Adjust</span>
                </button>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 flex justify-between items-center">
                <div>
                  <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Current Stock</p>
                  <p className="text-xl font-bold text-slate-800">{item.quantity} {item.unit}</p>
                </div>
                <Package className="w-8 h-8 text-slate-300" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Quantity</label>
                  <input
                    required
                    type="number"
                    min="1"
                    className="w-full px-4 py-2 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    value={amount}
                    onChange={e => setAmount(e.target.value ? Number(e.target.value) : '')}
                    placeholder="0"
                  />
                </div>
                {type !== 'adjust' && (
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">
                      {type === 'sell' ? 'Selling Price (per unit)' : 'Cost Price (per unit)'}
                    </label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        required
                        type="number"
                        min="0"
                        step="0.01"
                        className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                        value={unitValue}
                        onChange={e => setUnitValue(e.target.value ? Number(e.target.value) : '')}
                        placeholder="0.00"
                      />
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Reason / Notes</label>
                <input
                  required
                  type="text"
                  className="w-full px-4 py-2 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  value={reason}
                  onChange={e => setReason(e.target.value)}
                  placeholder="e.g. Sold to Customer"
                />
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="submit"
                  className={`flex-1 py-3 px-4 rounded-xl font-bold text-white transition-all shadow-lg ${
                    type === 'sell' ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-200' :
                    type === 'buy' ? 'bg-blue-600 hover:bg-blue-700 shadow-blue-200' :
                    'bg-slate-800 hover:bg-slate-900 shadow-slate-200'
                  }`}
                >
                  {type === 'sell' ? 'Confirm Sale' : type === 'buy' ? 'Confirm Purchase' : 'Save Adjustment'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
