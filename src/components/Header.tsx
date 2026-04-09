import { useUserStore } from '../store/useUserStore';
import { useCartStore } from '../store/useCartStore'; // [NUEVO]
import { User, ShoppingBag } from 'lucide-react';

interface Props {
  onOpenCart: () => void;
  onGoHome: () => void; // [NUEVO]
}

export const Header = ({ onOpenCart, onGoHome }: Props) => {
  const usuario = useUserStore((state) => state.usuario);
  const carrito = useCartStore((state) => state.carrito);
  const totalItems = carrito.reduce((acc, item) => acc + item.cantidad, 0);
  const inicial = usuario?.nombre ? usuario.nombre.charAt(0).toUpperCase() : null;

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        
        {/* LOGO (Ahora es un botón de inicio) */}
        <button 
          onClick={onGoHome}
          className="flex items-center gap-3 hover:opacity-80 transition-opacity active:scale-95"
        >
          <img 
            src="/logo_lingote_oficial_ligero.webp" 
            alt="El Lingote Español" 
            className="h-14 w-auto drop-shadow-sm"
          />
          <div className="hidden sm:block text-left">
            <h1 className="text-xl font-black italic text-lingote-dark leading-none uppercase tracking-tighter">
              El Lingote <span className="text-lingote-red text-xs block not-italic tracking-widest font-bold">ESPAÑOL</span>
            </h1>
          </div>
        </button>

        {/* ACCIONES */}
        <div className="flex items-center gap-4">
          
          {/* BOTÓN CARRITO - [ACTUALIZADO] */}
          <button 
            onClick={onOpenCart}
            className="relative p-2 text-lingote-blue hover:bg-gray-50 rounded-full transition-all active:scale-90"
          >
            <ShoppingBag size={24} />
            
            {/* Solo mostramos el badge si hay productos */}
            {totalItems > 0 && (
              <span className="absolute top-0 right-0 bg-lingote-red text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-white animate-in zoom-in duration-300">
                {totalItems}
              </span>
            )}
          </button>

          {/* PERFIL DE USUARIO */}
          <button className="flex items-center gap-2 p-1 pr-4 bg-gray-50 rounded-full border border-gray-100 hover:border-lingote-gold transition-all">
            <div className="w-9 h-9 bg-lingote-blue rounded-full flex items-center justify-center text-white shadow-md">
              {inicial ? (
                <span className="font-black text-sm">{inicial}</span>
              ) : (
                <User size={18} />
              )}
            </div>
            <span className="text-xs font-black uppercase text-gray-500 hidden md:block">
              {usuario ? usuario.nombre.split(' ')[0] : 'Mi Perfil'}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};