import { motion } from 'framer-motion';
import { ShoppingBag } from 'lucide-react';

export const ProductoCard = ({ item, onAdd }: { item: any, onAdd: (item: any) => void }) => {
  const { nombre, precio, desc, imagen, disponible, ahorro } = item;
  const fallbackImage = '/logo_lingote_oficial_ligero.webp';

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={`bg-white rounded-[2.5rem] shadow-xl border border-gray-100 flex gap-4 items-center group transition-all relative ${!disponible ? 'pointer-events-none' : 'hover:shadow-2xl hover:-translate-y-1'}`}
    >
      {/* BADGE DE AGOTADO (FUERA DEL FILTRO GRIS) */}
      {!disponible && (
        <div className="absolute inset-0 z-10 bg-white/10 backdrop-blur-[0.5px] flex items-center justify-center rounded-[2.5rem]">
          <span className="bg-red-600 text-white text-[7px] font-black px-3 py-1 rounded-full uppercase italic rotate-[-8deg] shadow-xl border border-white">
            AGOTADO ❌
          </span>
        </div>
      )}

      {/* CONTENIDO AFECTADO POR EL ESTADO */}
      <div className={`flex gap-4 items-center w-full p-6 transition-all duration-500 ${!disponible ? 'grayscale opacity-30 blur-[0.5px]' : ''}`}>
        {ahorro && ahorro > 0 && disponible && (
          <div className="absolute -top-3 -right-3 z-20 bg-lingote-gold text-lingote-dark px-3 py-1.5 rounded-2xl shadow-lg border-2 border-white flex flex-col items-center leading-none">
            <span className="text-[7px] font-black uppercase tracking-tighter opacity-70">Ahorrás</span>
            <span className="text-[11px] font-black italic">₡{ahorro.toLocaleString()}</span>
          </div>
        )}

        <div className="w-24 h-24 shrink-0 bg-gray-50 rounded-3xl overflow-hidden border border-gray-100 relative">
          <img 
            src={imagen ? `/${imagen}` : fallbackImage} 
            alt={nombre} 
            className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500" 
            onError={(e) => {
              (e.target as HTMLImageElement).src = fallbackImage;
            }}
          />
        </div>

        <div className="flex-grow">
          <h4 className="text-lg font-black text-lingote-dark uppercase italic tracking-tighter leading-tight">{nombre}</h4>
          <p className="text-gray-700 text-[10px] font-medium italic mt-1 leading-tight">{desc}</p>
          <div className="flex items-center justify-between mt-3">
            <span className="text-xl font-black text-lingote-blue italic tabular-nums">₡{precio.toLocaleString()}</span>
            <button 
              disabled={!disponible}
              onClick={() => onAdd(item)}
              className="p-3 bg-lingote-dark text-white rounded-2xl shadow-lg shadow-lingote-dark/20 active:scale-90 transition-all hover:bg-lingote-blue disabled:bg-gray-200"
            >
              <ShoppingBag size={18} strokeWidth={2.5} />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
