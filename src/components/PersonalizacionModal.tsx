import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, PlusCircle, MinusCircle, ArrowLeft, Check, Sparkles } from 'lucide-react';
import type { Lingote, Extra, ItemCarrito } from '../types';
import { CATEGORIAS_PERSONALIZACION } from '../data/menu';

interface Props {
  lingote: Lingote;
  isOpen: boolean;
  onClose: () => void;
  onConfirmar: (item: ItemCarrito) => void;
}

type Paso = 'base' | 'proteina' | 'vegetal' | 'salsa' | 'cantidad';

export const PersonalizacionModal = ({ lingote, isOpen, onClose, onConfirmar }: Props) => {
  const [pasoActual, setPasoActual] = useState<Paso>('base');
  const [base, setBase] = useState<Extra | null>(null);
  const [proteina, setProteina] = useState<Extra | null>(null);
  const [vegetales, setVegetales] = useState<Extra[]>([]);
  const [salsa, setSalsa] = useState<Extra | null>(null);
  const [cantidad, setCantidad] = useState(1);

  const pasos: Paso[] = ['base', 'proteina', 'vegetal', 'salsa', 'cantidad'];
  const indicePaso = pasos.indexOf(pasoActual);

  const extrasSeleccionados = useMemo(() => {
    const list = [];
    if (base) list.push(base);
    if (proteina) list.push(proteina);
    list.push(...vegetales);
    if (salsa) list.push(salsa);
    return list;
  }, [base, proteina, vegetales, salsa]);

  const precioExtrasTotal = useMemo(() => 
    extrasSeleccionados.reduce((sum, e) => sum + e.precio, 0),
  [extrasSeleccionados]);

  const precioUnitarioFinal = lingote.precio + precioExtrasTotal;

  const toggleVegetal = (extra: Extra) => {
    setVegetales(prev => 
      prev.some(e => e.id === extra.id)
        ? prev.filter(e => e.id !== extra.id)
        : [...prev, extra]
    );
  };

  const siguientePaso = () => {
    if (indicePaso < pasos.length - 1) {
      setPasoActual(pasos[indicePaso + 1]);
    }
  };

  const anteriorPaso = () => {
    if (indicePaso > 0) {
      setPasoActual(pasos[indicePaso - 1]);
    }
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
    setPasoActual('base');
    setBase(null);
    setProteina(null);
    setVegetales([]);
    setSalsa(null);
    setCantidad(1);
  };

  const renderContenidoPaso = () => {
    switch (pasoActual) {
      case 'base':
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-black italic uppercase text-lingote-dark">1. Elegí la Base</h3>
            <div className="grid grid-cols-1 gap-3">
              {CATEGORIAS_PERSONALIZACION.bases.map(item => (
                <button 
                  key={item.id}
                  onClick={() => { setBase(item); siguientePaso(); }}
                  className={`p-5 rounded-2xl border-2 flex items-center justify-between transition-all ${base?.id === item.id ? 'border-lingote-gold bg-white shadow-lg' : 'border-gray-100 bg-gray-50'}`}
                >
                  <span className="font-black uppercase italic text-sm">{item.nombre}</span>
                  <span className="text-xs font-bold text-gray-400">+{item.precio} ₡</span>
                </button>
              ))}
            </div>
          </div>
        );
      case 'proteina':
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-black italic uppercase text-lingote-dark">2. ¿Alguna Proteína?</h3>
            <div className="grid grid-cols-1 gap-3">
              <button 
                onClick={() => { setProteina(null); siguientePaso(); }}
                className={`p-5 rounded-2xl border-2 flex items-center justify-between transition-all ${!proteina ? 'border-lingote-gold bg-white shadow-lg' : 'border-gray-100 bg-gray-50'}`}
              >
                <span className="font-black uppercase italic text-sm text-gray-400 italic">Ninguna (Solo Tortilla)</span>
                <span className="text-xs font-bold">0 ₡</span>
              </button>
              {CATEGORIAS_PERSONALIZACION.proteinas.map(item => (
                <button 
                  key={item.id}
                  disabled={!item.disponible}
                  onClick={() => { setProteina(item); siguientePaso(); }}
                  className={`p-5 rounded-2xl border-2 flex items-center justify-between transition-all ${!item.disponible ? 'opacity-40 grayscale' : proteina?.id === item.id ? 'border-lingote-gold bg-white shadow-lg' : 'border-gray-100 bg-gray-50'}`}
                >
                  <span className="font-black uppercase italic text-sm">{item.nombre} {!item.disponible && '(Agotado)'}</span>
                  <span className="text-xs font-bold text-gray-400">+{item.precio} ₡</span>
                </button>
              ))}
            </div>
          </div>
        );
      case 'vegetal':
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-black italic uppercase text-lingote-dark">3. Toque de Frescura</h3>
            <div className="grid grid-cols-1 gap-3">
              {CATEGORIAS_PERSONALIZACION.vegetales.map(item => {
                const isSelected = vegetales.some(v => v.id === item.id);
                return (
                  <button 
                    key={item.id}
                    onClick={() => toggleVegetal(item)}
                    className={`p-5 rounded-2xl border-2 flex items-center justify-between transition-all ${isSelected ? 'border-lingote-gold bg-white shadow-lg' : 'border-gray-100 bg-gray-50'}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${isSelected ? 'bg-lingote-gold border-lingote-gold' : 'border-gray-300'}`}>
                        {isSelected && <Check size={14} className="text-lingote-dark" />}
                      </div>
                      <span className="font-black uppercase italic text-sm">{item.nombre}</span>
                    </div>
                    <span className="text-xs font-bold text-gray-400">+{item.precio} ₡</span>
                  </button>
                );
              })}
              <button 
                onClick={siguientePaso}
                className="w-full py-4 mt-4 bg-lingote-dark text-white font-black rounded-xl uppercase italic text-xs tracking-widest"
              >
                Continuar a las salsas
              </button>
            </div>
          </div>
        );
      case 'salsa':
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-black italic uppercase text-lingote-dark">4. Elegí tu Salsa</h3>
            <div className="grid grid-cols-1 gap-3">
              {CATEGORIAS_PERSONALIZACION.salsas.map(item => (
                <button 
                  key={item.id}
                  onClick={() => { setSalsa(item); siguientePaso(); }}
                  className={`p-5 rounded-2xl border-2 flex items-center justify-between transition-all ${salsa?.id === item.id ? 'border-lingote-gold bg-white shadow-lg' : 'border-gray-100 bg-gray-50'}`}
                >
                  <span className="font-black uppercase italic text-sm">{item.nombre}</span>
                  <span className="text-xs font-bold text-gray-400">+{item.precio} ₡</span>
                </button>
              ))}
            </div>
          </div>
        );
      case 'cantidad':
        return (
          <div className="space-y-8 flex flex-col items-center py-10">
            <h3 className="text-2xl font-black italic uppercase text-lingote-dark text-center">¡Listo! ¿Cuántos pedimos?</h3>
            <div className="flex items-center gap-8 text-lingote-blue">
                <button onClick={() => setCantidad(c => Math.max(1, c-1))} className="active:scale-90 transition-transform bg-gray-100 p-4 rounded-full"><MinusCircle size={40} /></button>
                <span className="text-6xl font-black italic tabular-nums w-20 text-center text-lingote-dark">{cantidad}</span>
                <button onClick={() => setCantidad(c => Math.min(10, c+1))} className="active:scale-90 transition-transform bg-gray-100 p-4 rounded-full"><PlusCircle size={40} /></button>
            </div>
          </div>
        );
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[150] flex items-end justify-center sm:items-center p-0 sm:p-4 overflow-hidden">
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-lingote-dark/70 backdrop-blur-sm"
          />

          <motion.div 
            initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative bg-lingote-bg w-full max-h-[92vh] sm:max-h-[90vh] sm:max-w-xl rounded-t-[3rem] sm:rounded-[3rem] shadow-2xl flex flex-col border border-gray-100 overflow-hidden"
          >
            <div className="p-6 border-b border-gray-100 bg-white shrink-0 z-10">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-3">
                   <Sparkles className="text-lingote-gold" />
                   <div>
                     <span className="text-[10px] font-black uppercase text-lingote-red leading-none">Paso {indicePaso + 1} de 5</span>
                     <h2 className="text-xl font-black text-lingote-dark uppercase italic tracking-tighter leading-tight">
                        Armá tu Lingote
                     </h2>
                   </div>
                </div>
                <button onClick={onClose} className="p-2 bg-gray-100 text-gray-400 rounded-full"><X size={20} /></button>
              </div>
              <div className="w-full h-1 bg-gray-100 rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-lingote-gold"
                  initial={{ width: 0 }}
                  animate={{ width: `${((indicePaso + 1) / pasos.length) * 100}%` }}
                />
              </div>
            </div>

            <div className="flex-grow overflow-y-auto p-6 no-scrollbar pb-10">
              {renderContenidoPaso()}
            </div>

            <div className="p-6 bg-white border-t border-gray-100 shrink-0 flex items-center justify-between gap-4">
               {indicePaso > 0 ? (
                 <button onClick={anteriorPaso} className="flex items-center gap-2 text-gray-400 font-bold uppercase italic text-xs">
                   <ArrowLeft size={16} /> Atrás
                 </button>
               ) : <div />}

               {pasoActual === 'cantidad' ? (
                 <button 
                  onClick={finalizarPersonalizacion}
                  className="px-10 py-5 bg-lingote-gold text-lingote-dark font-black text-lg rounded-2xl shadow-xl uppercase italic flex items-center gap-2"
                 >
                    Confirmar Pedido ⚡
                 </button>
               ) : (
                 <div className="text-right">
                    <span className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Precio Unitario</span>
                    <p className="text-2xl font-black text-lingote-dark italic tracking-tighter tabular-nums leading-none">
                      ₡{precioUnitarioFinal.toLocaleString()}
                    </p>
                 </div>
               )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
