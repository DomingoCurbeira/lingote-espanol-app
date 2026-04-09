import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import type { ProductoMenu, Promocion } from '../types/ProductoMenu';

interface Props {
  item: ProductoMenu | Promocion; // Acepta ambos
  onAdd: (item: ProductoMenu | Promocion) => void;
}

export const ProductoCard = ({ item, onAdd }: Props) => {
  const { nombre, precio, desc, imagen, disponible, ahorro, alergenos } = item;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`relative bg-white rounded-[2.5rem] p-4 shadow-xl border-b-4 border-gray-100 flex items-center gap-4 overflow-hidden transition-all ${
        !disponible ? 'opacity-60 grayscale' : 'hover:shadow-2xl hover:-translate-y-1'
      }`}
    >
      {/* Sello de Agotado */}
      {!disponible && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-white/40 backdrop-blur-[2px]">
          <span className="bg-lingote-red text-white font-black text-[10px] px-4 py-2 rounded-full uppercase italic tracking-tighter shadow-lg">
            Agotado ❌
          </span>
        </div>
      )}

      {/* Badge de Ahorro (Solo para Combos) */}
      {ahorro && disponible && (
        <div className="absolute -right-10 top-5 bg-lingote-gold text-lingote-dark text-[8px] font-black py-1 px-10 rotate-45 shadow-sm uppercase italic z-10">
          Ahorrá ₡{ahorro}
        </div>
      )}

      {/* Imagen del Producto */}
      <div className="w-24 h-24 bg-gray-50 rounded-3xl overflow-hidden flex-shrink-0 border border-gray-100 shadow-inner">
        <img 
          src={imagen ? `/${imagen}` : "/logo_lingote_oficial_ligero.webp"} 
          alt={nombre} 
          className="w-full h-full object-cover"
          onError={(e) => {(e.target as HTMLImageElement).src = "/logo_lingote_oficial_ligero.webp"}}
        />
      </div>
      
      {/* Información */}
      <div className="flex-grow">
        <div className="flex justify-between items-start mb-1">
          <h3 className="font-black text-sm text-lingote-dark uppercase italic leading-tight max-w-[120px]">
            {nombre}
          </h3>
          <span className="font-black text-sm text-lingote-blue italic">
            ₡{precio.toLocaleString()}
          </span>
        </div>
        
        <p className="text-[10px] text-gray-400 font-bold uppercase italic leading-tight mb-2">
          {desc}
        </p>

        {/* Alérgenos */}
        {alergenos && alergenos.length > 0 && (
          <div className="flex gap-1">
            {alergenos.map((a, i) => (
              <span key={i} className="text-xs bg-gray-100 w-6 h-6 flex items-center justify-center rounded-full opacity-70">
                {a}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Botón de Añadir */}
      <button 
        onClick={() => disponible && onAdd(item)}
        disabled={!disponible}
        className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg transition-all active:scale-90 ${
          disponible 
          ? 'bg-lingote-blue text-white hover:bg-lingote-blue/90' 
          : 'bg-gray-200 text-gray-400 cursor-not-allowed'
        }`}
      >
        <Plus size={24} strokeWidth={3} />
      </button>
    </motion.div>
  );
};