import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, User } from 'lucide-react';
import { obtenerEstadoTienda } from '../config/horarios';

interface Props {
  onOpenCart: () => void;
  onGoHome: () => void;
  onOpenProfile: () => void;
  cartCount: number;
}

export const Header = ({ onOpenCart, onGoHome, onOpenProfile, cartCount }: Props) => {
  const { estaAbierto, esCierreInminente } = obtenerEstadoTienda();

  return (
    <header className="sticky top-0 z-[100] w-full bg-white/90 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
        
        {/* Lado Izquierdo: Estado de la Tienda */}
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${estaAbierto ? (esCierreInminente ? 'bg-yellow-500' : 'bg-green-500') : 'bg-red-500'}`} />
            <span className={`text-[9px] font-black uppercase italic tracking-wider ${estaAbierto ? (esCierreInminente ? 'text-yellow-600' : 'text-green-600') : 'text-red-600'}`}>
              {estaAbierto ? (esCierreInminente ? 'Casi Cerrado' : 'Abierto') : 'Cerrado'}
            </span>
          </div>
        </div>

        {/* Centro: Logo/Home */}
        <button 
          onClick={onGoHome}
          className="absolute left-1/2 -translate-x-1/2 hover:scale-110 transition-transform active:scale-90"
        >
          <img src="/logo_lingote_transparente.svg" alt="Logo" className="w-10 h-10 object-contain" />
        </button>

        {/* Lado Derecho: Acciones */}
        <div className="flex items-center gap-1">
          <button 
            onClick={onOpenProfile}
            className="p-2 text-lingote-dark hover:bg-gray-100 rounded-xl transition-all active:scale-90"
          >
            <User size={20} strokeWidth={2.5} />
          </button>
          
          <button 
            onClick={onOpenCart}
            className="relative p-2 bg-lingote-dark text-white rounded-xl shadow-lg hover:scale-105 active:scale-95 transition-all"
          >
            <ShoppingBag size={20} strokeWidth={2.5} />
            <AnimatePresence>
              {cartCount > 0 && (
                <motion.span 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="absolute -top-1 -right-1 bg-lingote-red text-white text-[10px] font-black w-6 h-6 flex items-center justify-center rounded-full border-2 border-white shadow-lg"
                >
                  {cartCount}
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </div>
      </div>
    </header>
  );
};
