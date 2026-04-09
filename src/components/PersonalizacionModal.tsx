import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChefHat, Tag, PlusCircle, MinusCircle } from 'lucide-react';
import type { Lingote, Extra, ItemCarrito } from '../types';
import { EXTRAS_DISPONIBLES } from '../data/menu';

interface Props {
  lingote: Lingote;
  isOpen: boolean;
  onClose: () => void;
  onConfirmar: (item: ItemCarrito) => void;
}

export const PersonalizacionModal = ({ lingote, isOpen, onClose, onConfirmar }: Props) => {
  const [extrasSeleccionados, setExtrasSeleccionados] = useState<Extra[]>([]);
  const [cantidad, setCantidad] = useState(1);

  const precioExtrasTotal = useMemo(() => 
    extrasSeleccionados.reduce((sum, e) => sum + e.precio, 0),
  [extrasSeleccionados]);

  const precioUnitarioFinal = lingote.precioBase + precioExtrasTotal;
  const precioPedidoTotal = precioUnitarioFinal * cantidad;

  const toggleExtra = (extra: Extra) => {
    setExtrasSeleccionados(prev => 
      prev.some(e => e.id === extra.id)
        ? prev.filter(e => e.id !== extra.id)
        : [...prev, extra]
    );
  };

  const finalizarPersonalizacion = () => {
    const nuevoItem: ItemCarrito = {
      idUnico: crypto.randomUUID(),
      producto: lingote,
      extras: extrasSeleccionados,
      cantidad: cantidad,
      precioTotal: precioUnitarioFinal
    };
    onConfirmar(nuevoItem);
    resetForm();
  };

  const resetForm = () => {
    setExtrasSeleccionados([]);
    setCantidad(1);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[150] flex items-end justify-center sm:items-center p-0 sm:p-4 overflow-hidden">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-lingote-dark/70 backdrop-blur-sm"
          />

          <motion.div 
            initial={{ y: "100%", opacity: 0.5 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "100%", opacity: 0.5 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            /* CAMBIO CLAVE: max-h-[92vh] y flex-col para controlar el scroll en desktop */
            className="relative bg-lingote-bg w-full max-h-[92vh] sm:max-h-[90vh] sm:max-w-xl rounded-t-[3rem] sm:rounded-[3rem] shadow-2xl flex flex-col border border-gray-100 overflow-hidden"
          >
            {/* 1. HEADER FIJO (shrink-0 evita que se aplaste) */}
            <div className="p-6 border-b border-gray-100 bg-white shrink-0 z-10">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                   <img src={`/${lingote.imagen}`} alt={lingote.nombre} className="w-12 h-12 object-contain" />
                   <div>
                     <span className="text-[10px] font-black uppercase text-lingote-red leading-none">Armando tu</span>
                     <h2 className="text-xl sm:text-2xl font-black text-lingote-dark uppercase italic tracking-tighter leading-tight">
                        {lingote.nombre}
                     </h2>
                   </div>
                </div>
                <button onClick={onClose} className="p-2 bg-gray-100 text-gray-400 hover:bg-gray-200 rounded-full transition-colors">
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* 2. CUERPO SCROLLABLE (flex-grow toma el espacio sobrante) */}
            <div className="flex-grow overflow-y-auto p-6 space-y-8 no-scrollbar pb-10">
              <section>
                <div className="flex items-center gap-2 mb-4 text-lingote-blue">
                   <ChefHat size={18} />
                   <h4 className="text-xs font-black uppercase tracking-widest">Receta Original (Incluida)</h4>
                </div>
                <div className="flex flex-wrap gap-2">
                   {lingote.ingredientesBase.map(ing => (
                      <span key={ing} className="bg-gray-100 text-gray-500 font-bold text-[10px] uppercase px-4 py-2 rounded-xl italic">
                         {ing}
                      </span>
                   ))}
                </div>
              </section>

              <section>
                <div className="flex items-center gap-2 mb-4 text-lingote-gold">
                   <Tag size={18} />
                   <h4 className="text-xs font-black uppercase tracking-widest">Dale el Toque Final <span className='text-gray-400'>(Opcionales)</span></h4>
                </div>
                <div className="space-y-3">
                   {EXTRAS_DISPONIBLES.map(extra => {
                      const isSelected = extrasSeleccionados.some(e => e.id === extra.id);
                      return (
                         <button 
                            key={extra.id}
                            onClick={() => toggleExtra(extra)}
                            className={`w-full p-5 rounded-2xl border-2 flex items-center gap-4 transition-all text-left ${
                               isSelected 
                               ? 'bg-white border-lingote-gold shadow-lg shadow-lingote-gold/10' 
                               : 'bg-gray-50 border-gray-100 hover:border-gray-200'
                            }`}
                         >
                            <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center shrink-0 transition-colors ${isSelected ? 'bg-lingote-gold border-lingote-gold text-lingote-dark' : 'border-gray-300 bg-white text-white'}`}>
                               ✓
                            </div>
                            <div className="flex-grow">
                               <p className={`font-black uppercase italic tracking-tighter text-sm ${isSelected ? 'text-lingote-dark' : 'text-gray-600'}`}>
                                  {extra.nombre}
                               </p>
                               <p className="text-[10px] text-gray-400 font-medium italic mt-0.5">
                                  {extra.descripcion}
                               </p>
                            </div>
                            <span className={`font-black text-sm shrink-0 ${isSelected ? 'text-lingote-gold' : 'text-gray-400'}`}>
                               +₡{extra.precio.toLocaleString()}
                            </span>
                         </button>
                      );
                   })}
                </div>
              </section>

              <section className="bg-white p-6 rounded-3xl border border-gray-100 flex items-center justify-between">
                 <h4 className="text-sm font-black text-lingote-dark uppercase italic tracking-tight">¿Cuántos Lingotes?</h4>
                 <div className="flex items-center gap-4 text-lingote-blue">
                    <button onClick={() => setCantidad(c => Math.max(1, c-1))} className="active:scale-90 transition-transform"><MinusCircle size={28} /></button>
                    <span className="text-3xl font-black italic tabular-nums w-8 text-center text-lingote-dark">{cantidad}</span>
                    <button onClick={() => setCantidad(c => Math.min(10, c+1))} className="active:scale-90 transition-transform"><PlusCircle size={28} /></button>
                 </div>
              </section>
            </div>

            {/* 3. FOOTER FIJO (shrink-0 para que el botón siempre sea visible) */}
            <div className="p-6 bg-white/90 backdrop-blur-md border-t border-gray-100 shrink-0 flex items-center gap-4 z-10">
               <div className='flex-grow'>
                  <span className='text-[10px] font-bold text-gray-400 uppercase leading-none'>Total Pedido</span>
                  <p className="text-3xl font-black text-lingote-dark italic tracking-tighter tabular-nums leading-none">
                     ₡{precioPedidoTotal.toLocaleString()}
                  </p>
               </div>
               <button 
                  onClick={finalizarPersonalizacion}
                  className="px-8 sm:px-12 py-5 bg-lingote-gold text-lingote-dark font-black text-lg rounded-2xl shadow-xl hover:bg-[#ffdb70] active:scale-95 transition-all uppercase italic flex items-center gap-2"
               >
                  Añadir ⚡
               </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};