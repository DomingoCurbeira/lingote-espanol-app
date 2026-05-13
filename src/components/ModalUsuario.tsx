import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUserStore } from '../store/useUserStore';
import { Smartphone, User, ChevronRight } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const ModalUsuario = ({ isOpen, onClose }: Props) => {
  const setUsuario = useUserStore((state) => state.setUsuario);
  const [nombre, setNombre] = useState('');
  const [telefono, setTelefono] = useState('');

  const handleGuardar = (e: React.FormEvent) => {
    e.preventDefault();
    if (nombre.length > 2 && telefono.length >= 8) {
      setUsuario({ nombre, telefono });
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
          {/* Overlay con desenfoque */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-lingote-dark/60 backdrop-blur-sm"
          />

          {/* Card del Modal */}
          <motion.div 
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative bg-white w-full max-w-sm rounded-[3rem] overflow-hidden shadow-2xl border-b-8 border-lingote-blue"
          >
            <div className="p-8">
              <div className="text-center mb-8">
                <div className="w-20 h-20 bg-lingote-bg rounded-3xl flex items-center justify-center mx-auto mb-4 border border-gray-100 shadow-inner">
                  <img src="/logo_lingote_oficial_ligero.webp" alt="Logo" className="w-14 h-14 object-contain" />
                </div>
                <h3 className="text-2xl font-black italic text-lingote-dark uppercase tracking-tighter">
                  ¡Hola, <span className="text-lingote-red">Bienvenido!</span>
                </h3>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">
                  Identificate para tu pedido
                </p>
              </div>

              <form onSubmit={handleGuardar} className="space-y-4">
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                  <input 
                    required
                    type="text" 
                    placeholder="TU NOMBRE"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value.toUpperCase())}
                    className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl py-4 pl-12 pr-4 font-bold text-sm outline-none focus:border-lingote-gold transition-all"
                  />
                </div>

                <div className="relative">
                  <Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                  <input 
                    required
                    type="tel" 
                    placeholder="TU WHATSAPP"
                    value={telefono}
                    onChange={(e) => setTelefono(e.target.value.replace(/\D/g, ''))}
                    className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl py-4 pl-12 pr-4 font-bold text-sm outline-none focus:border-lingote-gold transition-all"
                  />
                </div>

                <button 
                  type="submit"
                  className="w-full bg-lingote-blue text-white py-5 rounded-2xl font-black uppercase italic flex items-center justify-center gap-2 shadow-xl shadow-lingote-blue/20 active:scale-95 transition-all mt-4"
                >
                  Empezar a Crear <ChevronRight size={20} />
                </button>
              </form>
              
              <button 
                onClick={onClose}
                className="w-full mt-6 text-[10px] font-black text-gray-300 uppercase tracking-[0.2em] hover:text-gray-400 transition-colors"
              >
                Tal vez luego
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};