import { motion } from 'framer-motion';
import { Tag, Coffee, Utensils, IceCream, FlaskConical } from 'lucide-react';
import type { Categoria } from '../types';

interface Props {
  activa: Categoria;
  onChange: (cat: Categoria) => void;
}

const categorias: { id: Categoria; label: string; icon: any; color: string }[] = [
  { id: 'promociones', label: 'Promos', icon: Tag, color: 'bg-red-500' },
  { id: 'lingotes', label: 'Lingotes', icon: Utensils, color: 'bg-lingote-gold' },
  { id: 'salsas', label: 'Salsas', icon: FlaskConical, color: 'bg-green-600' },
  { id: 'bebidas', label: 'Bebidas', icon: Coffee, color: 'bg-blue-400' },
  { id: 'postres', label: 'Postres', icon: IceCream, color: 'bg-purple-500' },
];

export const SelectorCategorias = ({ activa, onChange }: Props) => {
  return (
    <nav className="bg-white/95 backdrop-blur-md sticky top-16 z-[80] border-b border-gray-100 w-full overflow-hidden">
      <div className="grid grid-cols-5 h-16 max-w-2xl mx-auto">
        {categorias.map((cat) => {
          const Icon = cat.icon;
          const isSelected = activa === cat.id;

          return (
            <button
              key={cat.id}
              onClick={() => onChange(cat.id)}
              className="flex flex-col items-center justify-center transition-all relative overflow-hidden"
            >
              <div className={`p-1.5 rounded-xl transition-all duration-300 ${isSelected ? `${cat.color} text-white shadow-md scale-110` : 'text-gray-400'}`}>
                <Icon size={16} strokeWidth={isSelected ? 3 : 2} />
              </div>
              <span className={`text-[8px] font-black uppercase mt-1 tracking-tighter transition-colors duration-300 ${isSelected ? 'text-lingote-dark' : 'text-gray-400 opacity-60'}`}>
                {cat.label}
              </span>
              
              {isSelected && (
                <motion.div 
                  layoutId="activeTabUnderline"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-lingote-gold" 
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}

              {cat.id === 'promociones' && !isSelected && (
                <span className="absolute top-2 right-4 flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-red-500"></span>
                </span>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
