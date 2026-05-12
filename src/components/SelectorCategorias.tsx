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
    <nav className="p-4 bg-white/50 backdrop-blur-md sticky top-20 z-40">
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 max-w-4xl mx-auto">
        {categorias.map((cat) => {
          const Icon = cat.icon;
          const isSelected = activa === cat.id;

          return (
            <button
              key={cat.id}
              onClick={() => onChange(cat.id)}
              className={`
                relative flex flex-col items-center justify-center py-3 rounded-2xl transition-all duration-300
                ${isSelected ? 'bg-white shadow-lg scale-105 z-10' : 'bg-gray-100/50 opacity-60'}
              `}
            >
              {isSelected && (
                <motion.div 
                  layoutId="activeTab"
                  className="absolute inset-0 border-2 border-lingote-gold rounded-2xl"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              <Icon size={20} className={isSelected ? 'text-lingote-dark' : 'text-gray-400'} />
              <span className={`text-[10px] font-black uppercase mt-1 tracking-tighter ${isSelected ? 'text-lingote-dark' : 'text-gray-400'}`}>
                {cat.label}
              </span>
              
              {cat.id === 'promociones' && (
                <span className="absolute -top-1 -right-1 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                </span>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};