import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Camera, AlertCircle } from 'lucide-react';
import { useZxing } from 'react-zxing';

interface BarcodeScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onScan: (sku: string) => void;
}

export default function BarcodeScannerModal({ isOpen, onClose, onScan }: BarcodeScannerModalProps) {
  const [permissionError, setPermissionError] = useState(false);

  const { ref } = useZxing({
    onDecodeResult(result) {
      onScan(result.getText());
      onClose();
    },
    onError(error: any) {
      if (error && typeof error.message === 'string' && error.message.includes('Permission')) {
         setPermissionError(true);
      }
    }
  });

  if (!isOpen) return null;

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
          className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden"
        >
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
            <div className="flex items-center space-x-2">
              <Camera className="w-5 h-5 text-indigo-600" />
              <h3 className="text-xl font-bold text-slate-800">Scan Barcode</h3>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-400">
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className="p-6 flex flex-col items-center">
            {permissionError ? (
               <div className="bg-rose-50 border border-rose-100 rounded-xl p-4 flex items-start gap-3 w-full">
                 <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
                 <div>
                   <p className="font-bold text-rose-800 text-sm">Camera Permission Denied</p>
                   <p className="text-rose-600 text-xs mt-1">Please allow camera access in your browser settings to scan barcodes.</p>
                 </div>
               </div>
            ) : (
                <div className="relative w-full aspect-video bg-black rounded-2xl overflow-hidden shadow-inner ring-4 ring-slate-100">
                  <video ref={ref} className="absolute inset-0 w-full h-full object-cover" />
                  {/* Scanner overlay */}
                  <div className="absolute inset-0 border-[3px] border-indigo-500/50 m-8 rounded-xl z-10 pointer-events-none flex items-center justify-center">
                    <div className="w-full h-0.5 bg-indigo-500/50 animate-scan"></div>
                  </div>
                </div>
            )}
            <p className="mt-6 text-sm text-slate-500 text-center font-medium">
              Point your camera at a barcode to scan and search automatically.
            </p>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
