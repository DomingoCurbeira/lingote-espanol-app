import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, ArrowRight } from 'lucide-react';
import { useAdminStore } from '../store/useAdminStore';

export const AdminLock = ({ children }: { children: React.ReactNode }) => {
  const { pin, isAuthenticated, setAuthenticated } = useAdminStore();
  const [inputPin, setInputPin] = useState('');
  const [error, setError] = useState(false);

  const handleCheck = () => {
    if (inputPin === pin) {
      setAuthenticated(true);
      setError(false);
    } else {
      setError(true);
      setInputPin('');
      setTimeout(() => setError(false), 1000);
    }
  };

  if (isAuthenticated) return <>{children}</>;

  return (
    <div className="min-h-screen bg-lingote-dark flex items-center justify-center p-6 text-white">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-xs w-full text-center space-y-8"
      >
        <div className="flex flex-col items-center">
          <div className={`p-6 rounded-3xl bg-white/10 backdrop-blur-xl border-2 transition-colors duration-500 ${error ? 'border-red-500 bg-red-500/20' : 'border-lingote-gold/30'}`}>
            <Lock size={48} className={error ? 'text-red-500' : 'text-lingote-gold'} />
          </div>
          <h2 className="text-2xl font-black uppercase italic mt-6 tracking-tighter">Acceso Reservado</h2>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-2 italic">Solo personal autorizado</p>
        </div>

        <div className="space-y-4">
          <div className="flex justify-center gap-4 h-4 mb-4">
            {[...Array(6)].map((_, i) => (
              <div 
                key={i} 
                className={`w-3 h-3 rounded-full transition-all duration-300 ${i < inputPin.length ? 'bg-lingote-gold scale-125' : 'bg-white/20'}`} 
              />
            ))}
          </div>

          <div className="grid grid-cols-3 gap-3">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 'C', 0, 'OK'].map((val) => (
              <button
                key={val}
                onClick={() => {
                  if (val === 'C') setInputPin('');
                  else if (val === 'OK') handleCheck();
                  else if (inputPin.length < 6) setInputPin(prev => prev + val);
                }}
                className={`h-16 rounded-2xl font-black text-xl flex items-center justify-center active:scale-90 transition-all ${
                  val === 'OK' ? 'bg-lingote-blue text-white' : 'bg-white/10 hover:bg-white/20'
                }`}
              >
                {val === 'OK' ? <ArrowRight /> : val}
              </button>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
};
