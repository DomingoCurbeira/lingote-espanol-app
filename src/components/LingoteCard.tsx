import { useState } from 'react'; // [NUEVO]
import { motion } from 'framer-motion';
import { ChefHat, Search } from 'lucide-react'; // [NUEVO ICONO]
import type { Lingote } from '../types';
import { ImageViewer } from './ImageViewer'; // [NUEVO IMPORT]

interface Props {
  lingote: Lingote;
  onSelect: (lingote: Lingote) => void;
}

export const LingoteCard = ({ lingote, onSelect }: Props) => {
  const { nombre, precio, descripcion, imagen, ingredientesBase, alergenos, disponible } = lingote;

  // [NUEVO ESTADO]
  const [viewerOpen, setViewerOpen] = useState(false);
  const imageSrc = `/${imagen}`;

  return (
    <>
        <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 30 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, type: 'spring' }}
            className="bg-white rounded-[3.5rem] overflow-hidden shadow-2xl border border-gray-100 flex flex-col group h-full"
        >
        {/* SECCIÓN DE IMAGEN: Con degradado para legibilidad */}
        <div className={`relative group bg-white rounded-t-[3.5rem] overflow-hidden shadow-xl transition-all ${
            !disponible 
            ? 'opacity-60 grayscale pointer-events-none' 
            : 'hover:shadow-2xl hover:-translate-y-1'
        }`}>
            {/* 1. CONTENEDOR QUE RECORTA (Ajustá el h-64 si lo querés más bajo) */}
            <div className="relative w-full h-64 sm:h-72 overflow-hidden"> 
                
                {/* Click para abrir la configuración del lingote (En la imagen) */}
                <div 
                    onClick={() => disponible && onSelect(lingote)}
                    className="absolute inset-0 z-10 cursor-pointer"
                />

                {/* 2. BOTÓN DE LUPA (Abrir ImageViewer) */}
                <div 
                    onClick={(e) => {
                        e.stopPropagation(); // Evita que se abra el personalizador al tocar la lupa
                        setViewerOpen(true);
                    }}
                    className="absolute inset-0 bg-lingote-dark/0 group-hover:bg-lingote-dark/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all z-40 cursor-zoom-in"
                >
                    <div className="bg-white/20 p-4 rounded-full backdrop-blur-sm border border-white/30 text-white transform group-hover:scale-110 transition-transform">
                        <Search size={24} strokeWidth={3} />
                    </div>
                </div>

                {/* Sello de Agotado */}
                {!disponible && (
                    <div className="absolute inset-0 z-50 flex items-center justify-center bg-white/20 backdrop-blur-[1px]">
                        <div className="bg-lingote-red text-white font-black text-sm px-6 py-2 rounded-full uppercase italic rotate-[-12deg] shadow-2xl border-2 border-white">
                            Agotado ❌
                        </div>
                    </div>
                )}

                {/* Brillo de fondo */}
                <div className="absolute inset-10 bg-white/50 blur-2xl rounded-full" />
                
                {/* LA IMAGEN */}
                <img 
                    src={imageSrc} 
                    alt={nombre}
                    className="w-full h-full object-cover relative z-0 drop-shadow-xl group-hover:scale-105 transition-transform duration-700"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-black/5" />
            </div>

            {/* PRECIO FLOTANTE */}
            <div className="absolute top-6 right-6 bg-lingote-blue py-2 px-6 rounded-2xl shadow-xl transform -rotate-2 group-hover:rotate-0 transition-transform z-30">
                <span className="text-white font-black text-2xl italic tracking-tighter">
                    ₡{precio.toLocaleString()}
                </span>
            </div>

            {/* ALÉRGENOS */}
            <div className="absolute bottom-6 left-6 flex gap-2 z-30">
                {alergenos.map(a => (
                    <span key={a} className="bg-white/90 backdrop-blur-md w-10 h-10 flex items-center justify-center rounded-full text-lg shadow-lg border border-white">
                        {a}
                    </span>
                ))}
            </div>
        </div>

        {/* CUERPO DEL CARD */}
        <div className="p-8 flex flex-col flex-grow">
            <div className="flex-grow">
            <div className="flex items-center gap-2 mb-3">
                <ChefHat size={16} className="text-lingote-red" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Receta Original</span>
            </div>
            
            <h3 className="text-3xl font-black text-lingote-dark uppercase italic tracking-tighter leading-none mb-4">
                {nombre}
            </h3>
            
            <p className="text-gray-500 text-sm leading-relaxed font-medium italic mb-6">
                {descripcion}
            </p>

            {/* INGREDIENTES (Chips Estilo Gourmet) */}
            <div className="flex flex-wrap gap-2 mb-8">
                {ingredientesBase.map((ing) => (
                <span key={ing} className="text-[9px] font-extrabold text-lingote-blue uppercase tracking-widest bg-lingote-blue/5 px-4 py-2 rounded-xl border border-lingote-blue/10">
                    {ing}
                </span>
                ))}
            </div>
            </div>

            {/* BOTÓN DE ACCIÓN: Gradiente Dorado */}
            <button 
            onClick={() => onSelect(lingote)}
            className={`w-full py-5 bg-gradient-to-r from-lingote-gold to-[#ffdb70] text-lingote-dark font-black text-xl rounded-[2rem] shadow-xl hover:shadow-lingote-gold/40 hover:-translate-y-1 active:translate-y-0 transition-all uppercase italic border-b-4 border-black/10 flex items-center justify-center gap-3 ${
                !disponible 
                ? 'opacity-60 grayscale pointer-events-none' 
                : 'cursor-pointer hover:shadow-2xl hover:-translate-y-1'
            }`}
            >
            Personalizar <span className="text-2xl">⚡</span>
            </button>
        </div>
        </motion.div>
    
     {/* [NUEVO COMPONENTE INYECTADO] */}
      <ImageViewer 
        src={imageSrc} 
        alt={nombre} 
        isOpen={viewerOpen} 
        onClose={() => setViewerOpen(false)} 
      />
    </> 
   

  );
};