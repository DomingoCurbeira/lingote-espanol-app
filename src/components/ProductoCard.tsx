import { motion } from 'framer-motion';
import { Plus, XCircle } from 'lucide-react'; // Añadimos XCircle para el estado agotado
import type { ProductoMenu, Promocion } from '../types/ProductoMenu';

interface Props {
  item: ProductoMenu | Promocion;
  onAdd: (item: ProductoMenu | Promocion) => void;
}

export const ProductoCard = ({ item, onAdd }: Props) => {
  // Forzamos que si 'disponible' no viene, sea 'false' por defecto
  // Esto evita que un error de dedo en el data deje el producto abierto
  const disponible = item.disponible === true; 
  
  const { nombre, desc, imagen, ahorro, alergenos } = item;
  const precioMostrar = (item as any).precio || 0;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      style={{ pointerEvents: disponible ? 'auto' : 'none' }}
      className={`relative bg-white rounded-[2.5rem] p-4 shadow-xl border-b-4 border-gray-100 flex items-center gap-4 overflow-hidden transition-all ${!disponible ? 'opacity-50 grayscale' : ''}`}
    >
      {/* Sello de Agotado - Estilo "Sello de Caucho" */}
      {!disponible && (
        <div className="absolute inset-0 z-30 flex items-center justify-center bg-white/40 backdrop-blur-[1px]">
          <motion.div 
            initial={{ scale: 1.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="border-4 border-lingote-red text-lingote-red font-black text-sm px-4 py-1 rounded-xl uppercase italic tracking-tighter rotate-[-15deg] shadow-2xl bg-white"
          >
            Agotado ❌
          </motion.div>
        </div>
      )}

      {/* Badge de Ahorro (Solo para Combos y si está disponible) */}
      {ahorro && disponible && (
        <div className="absolute -right-10 top-5 bg-lingote-gold text-lingote-dark text-[8px] font-black py-1 px-10 rotate-45 shadow-sm uppercase italic z-10">
          Ahorrá ₡{ahorro.toLocaleString()}
        </div>
      )}

      {/* Imagen del Producto */}
      <div className={`w-24 h-24 bg-gray-50 rounded-3xl overflow-hidden flex-shrink-0 border border-gray-100 shadow-inner ${!disponible && 'grayscale'}`}>
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
          <h3 className={`font-black text-sm uppercase italic leading-tight max-w-[120px] ${disponible ? 'text-lingote-dark' : 'text-gray-400'}`}>
            {nombre}
          </h3>
          <span className={`font-black text-sm italic ${disponible ? 'text-lingote-blue' : 'text-gray-400'}`}>
            ₡{precioMostrar.toLocaleString()}
          </span>
        </div>
        
        <p className="text-[10px] text-gray-400 font-bold uppercase italic leading-tight mb-2 line-clamp-2">
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

      {/* Botón de Añadir / Agotado */}
      <button 
        type="button"
        disabled={!disponible}
        onClick={(e) => {
          e.stopPropagation();
          if (disponible) onAdd(item);
        }}
        className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg transition-all ${
          disponible 
          ? 'bg-lingote-blue text-white active:scale-90' 
          : 'bg-gray-200 text-gray-400 opacity-50'
        }`}
      >
        {disponible ? <Plus size={24} strokeWidth={3} /> : <XCircle size={20} />}
      </button>
    </motion.div>
  );
};