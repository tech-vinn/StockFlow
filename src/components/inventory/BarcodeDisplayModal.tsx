import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Printer, Barcode as BarcodeIcon } from 'lucide-react';
// @ts-ignore
import Barcode from 'react-barcode';
import { StockItem } from '../../types';

interface BarcodeDisplayModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: StockItem | null;
}

export default function BarcodeDisplayModal({ isOpen, onClose, item }: BarcodeDisplayModalProps) {
  const printBarcode = () => {
    const svgElement = document.getElementById('barcode-svg-container')?.innerHTML;
    if (svgElement && item) {
      const printWindow = window.open('', '', 'width=600,height=400');
      if (printWindow) {
        printWindow.document.write(`
          <!DOCTYPE html>
          <html>
            <head>
              <title>Print Barcode - ${item.name}</title>
              <style>
                body {
                  font-family: system-ui, -apple-system, sans-serif;
                  display: flex;
                  flex-direction: column;
                  justify-content: center;
                  align-items: center;
                  height: 100vh;
                  margin: 0;
                  background: white;
                }
                .label {
                  font-size: 14px;
                  font-weight: bold;
                  margin-bottom: 8px;
                  color: #1e293b;
                }
                @media print {
                  @page { margin: 0; size: auto; }
                  body { height: auto; }
                }
              </style>
            </head>
            <body>
              <div class="label">${item.name} - ${item.category}</div>
              ${svgElement}
              <script>
                window.onload = () => {
                  window.print();
                  setTimeout(() => window.close(), 500);
                };
              </script>
            </body>
          </html>
        `);
        printWindow.document.close();
      }
    }
  };

  if (!isOpen || !item) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-sm bg-white rounded-3xl shadow-2xl overflow-hidden"
        >
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
            <h3 className="text-xl font-bold text-slate-800">Item Barcode</h3>
            <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400">
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className="p-8 flex flex-col items-center">
            <div className="p-4 bg-white rounded-2xl border border-slate-100 shadow-sm" id="barcode-svg-container">
              <Barcode 
                value={item.sku} 
                width={2} 
                height={80} 
                fontSize={16}
                background="#ffffff"
                lineColor="#0f172a"
              />
            </div>
            
            <p className="mt-4 text-center font-semibold text-slate-800">{item.name}</p>
            <p className="text-sm text-slate-500 mb-8">{item.category}</p>

            <button
              onClick={printBarcode}
              className="w-full py-3 px-4 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-slate-900/20"
            >
              <Printer className="w-5 h-5" />
              Print Barcode
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
