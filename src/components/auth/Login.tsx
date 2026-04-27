import React from 'react';
import { motion } from 'motion/react';
import { Package, ArrowRight, ShieldCheck, Zap, Globe } from 'lucide-react';

interface LoginProps {
  onLogin: () => void;
  loading: boolean;
}

export default function Login({ onLogin, loading }: LoginProps) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full"
      >
        <div className="text-center mb-10">
          <div className="inline-flex p-4 bg-indigo-600 rounded-3xl mb-6 shadow-xl shadow-indigo-200">
            <Package className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold font-display mb-3">StockFlow</h1>
          <p className="text-gray-500 text-lg">Intelligent inventory management for modern businesses.</p>
        </div>

        <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100 mb-8">
          <h2 className="text-xl font-bold mb-6 text-center">Welcome Back</h2>
          <button
            onClick={onLogin}
            disabled={loading}
            className="w-full flex items-center justify-center space-x-3 bg-white border-2 border-gray-100 py-3 rounded-2xl font-semibold hover:bg-gray-50 transition-all hover:border-gray-200 group"
          >
            <img src="https://www.google.com/favicon.ico" className="w-5 h-5" alt="Google" />
            <span>Continue with Google</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
          
          <p className="mt-6 text-center text-xs text-gray-400">
            By signing in, you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="flex justify-center mb-2">
              <Zap className="w-5 h-5 text-amber-500" />
            </div>
            <p className="text-[10px] font-bold uppercase text-gray-400 tracking-wider">Real-time</p>
          </div>
          <div className="text-center">
            <div className="flex justify-center mb-2">
              <ShieldCheck className="w-5 h-5 text-emerald-500" />
            </div>
            <p className="text-[10px] font-bold uppercase text-gray-400 tracking-wider">Secure</p>
          </div>
          <div className="text-center">
            <div className="flex justify-center mb-2">
              <Globe className="w-5 h-5 text-blue-500" />
            </div>
            <p className="text-[10px] font-bold uppercase text-gray-400 tracking-wider">Cloud Sync</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
