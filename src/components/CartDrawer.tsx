import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash2, Plus, Minus, ShoppingBag, CreditCard, Banknote, Clock, Lock, UserCheck, FlaskConical } from 'lucide-react';
import { useCartStore } from '../store/useCartStore';
import { useUserStore } from '../store/useUserStore';
import { generarMensajeWhatsApp } from '../utils/whatsapp';
import type { MetodoPago, DatosPago, ItemCarrito } from '../types';
import { mostrarAlertaPago } from '../utils/alerts';
import { PagoSinpeAyuda } from './PagoSinpeAyuda';
import { obtenerEstadoTienda } from '../config/horarios';
import { MENU_SALSAS } from '../data/salsas';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onFinalizado: (id: string, pago: DatosPago, total: number, items: ItemCarrito[]) => void;
  onRequireUser: () => void;
}

export const CartDrawer = ({ isOpen, onClose, onFinalizado, onRequireUser }: Props) => {
  const { carrito, removeItem, updateCantidad, getTotal, addItem } = useCartStore();
  const { usuario, agregarPedidoAlHistorial, agregarSellos } = useUserStore();

  const [metodoPago, setMetodoPago] = useState<MetodoPago | null>(null);
  const [comprobante, setComprobante] = useState('');

  const inputRef = useRef<HTMLInputElement>(null);

  const { estaAbierto: abierto, esCierreInminente, horarioTexto, horaLimitePedidos } = obtenerEstadoTienda();

  const enfocarComprobante = () => {
    setTimeout(() => {
      inputRef.current?.focus();
    }, 600);
  };

  const handleAddSalsaRapida = (salsa: any) => {
    addItem({
      idUnico: crypto.randomUUID(),
      producto: salsa,
      extras: [],
      cantidad: 1,
      precioTotal: salsa.precio
    });
  };

  const handleFinalizarPedido = async () => {
    if (!usuario) {
      onRequireUser();
      return;
    }

    if (!metodoPago) return;

    const pedidoID = Math.random().toString(36).substring(2, 6).toUpperCase();
    await mostrarAlertaPago(metodoPago, usuario.nombre);
    
    const datosPago = { metodo: metodoPago, comprobante: comprobante || undefined };
    const url = generarMensajeWhatsApp(carrito, usuario, getTotal(), datosPago, pedidoID);
    
    // Fidelización: 1 Lingote = 1 Sello
    const lingotesComprados = carrito.reduce((total, item) => {
      // IDs de lingotes y bocata
      const idsLingotes = [1, 2, 3, 5, 6, 99];
      return total + (idsLingotes.includes(item.producto.id) ? item.cantidad : 0);
    }, 0);
    
    if (lingotesComprados > 0) {
      agregarSellos(lingotesComprados);
    }

    agregarPedidoAlHistorial({
      id: pedidoID,
      items: [...carrito],
      total: getTotal(),
      fecha: new Date().toISOString(),
      metodoPago: metodoPago
    });

    window.open(url, '_blank');
    onFinalizado(pedidoID, datosPago, getTotal(), [...carrito]);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] overflow-hidden">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          />

          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl flex flex-col"
          >
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-white shrink-0">
              <div className="flex items-center gap-2">
                <ShoppingBag className="text-lingote-blue" />
                <h2 className="text-xl font-black italic uppercase text-lingote-dark tracking-tighter">Tu Pedido</h2>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <X size={24} />
              </button>
            </div>

            <div className="flex-grow overflow-y-auto p-6 space-y-6">
              {carrito.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-gray-300 italic text-center">
                  <ShoppingBag size={64} strokeWidth={1} className="mb-4 opacity-20" />
                  <p className="font-bold uppercase tracking-widest text-xs">El carrito está vacío</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {carrito.map((item) => {
                    const fallbackImage = '/logo_lingote_oficial_ligero.webp';
                    return (
                      <div key={item.idUnico} className="flex gap-4 border-b border-gray-50 pb-6 last:border-0">
                        <img 
                          src={item.producto.imagen ? `/${item.producto.imagen}` : fallbackImage} 
                          className="w-20 h-20 object-contain bg-gray-50 rounded-2xl border border-gray-100"
                          alt={item.producto.nombre} 
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = fallbackImage;
                          }}
                        />
                        <div className="flex-grow">
                          <div className="flex justify-between">
                            <h4 className="font-black uppercase italic text-sm text-lingote-dark">{item.producto.nombre}</h4>
                            <button onClick={() => removeItem(item.idUnico)} className="text-gray-300 hover:text-lingote-red transition-colors">
                              <Trash2 size={16} />
                            </button>
                          </div>
                          {item.extras.length > 0 && (
                            <p className="text-[10px] text-lingote-blue font-bold italic mt-1">
                              + {item.extras.map(e => e.nombre).join(', ')}
                            </p>
                          )}
                          <div className="flex justify-between items-center mt-3">
                            <div className="flex items-center gap-3 bg-gray-100 rounded-xl px-2 py-1">
                              <button onClick={() => updateCantidad(item.idUnico, -1)} className="p-1 hover:text-lingote-blue"><Minus size={14} /></button>
                              <span className="font-black text-sm w-4 text-center">{item.cantidad}</span>
                              <button onClick={() => updateCantidad(item.idUnico, 1)} className="p-1 hover:text-lingote-blue"><Plus size={14} /></button>
                            </div>
                            <span className="font-black text-lingote-dark italic text-sm tabular-nums">
                              ₡{(item.precioTotal * item.cantidad).toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}

                  {/* SECCIÓN CROSS-SELL SALSAS */}
                  <div className="mt-8 pt-6 border-t border-gray-100 animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <div className="flex items-center gap-2 mb-4">
                      <FlaskConical size={14} className="text-lingote-blue" />
                      <h5 className="text-[10px] font-black uppercase italic text-lingote-dark tracking-widest">
                        ¿Le ponemos más salsas de autor?
                      </h5>
                    </div>
                    <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar px-1">
                      {MENU_SALSAS.map(salsa => (
                        <button
                          key={salsa.id}
                          onClick={() => handleAddSalsaRapida(salsa)}
                          className="shrink-0 bg-white border border-gray-200 p-3 rounded-2xl shadow-sm hover:shadow-md transition-all active:scale-95 flex flex-col items-center gap-1 min-w-[95px]"
                        >
                          <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center mb-1">
                            <img 
                              src={`/${salsa.imagen}`} 
                              alt={salsa.nombre} 
                              className="w-7 h-7 object-contain"
                              onError={(e) => (e.target as any).src = '/logo_lingote_oficial_ligero.webp'}
                            />
                          </div>
                          <span className="text-[8px] font-black uppercase italic text-lingote-dark text-center leading-none">
                            {salsa.nombre.split(' ')[0]}
                          </span>
                          <span className="text-[9px] font-black text-lingote-blue italic mt-0.5">₡{salsa.precio}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {carrito.length > 0 && (
              <div className="p-6 bg-gray-50 border-t border-gray-100 shrink-0 space-y-4 max-h-[60vh] overflow-y-auto no-scrollbar">
                
                <div className={`space-y-2 transition-opacity ${!abierto ? 'opacity-40 grayscale pointer-events-none' : ''}`}>
                  <div className="flex justify-between items-end">
                    <p className="text-[10px] font-black uppercase text-gray-400 italic">¿Cómo vas a pagar?</p>
                    {!abierto && (
                      <span className="flex items-center gap-1 text-red-500 font-black text-[9px] uppercase italic">
                        <Lock size={10} /> Pagos bloqueados
                      </span>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <button 
                      onClick={() => setMetodoPago('sinpe')}
                      className={`p-3 rounded-xl border-2 flex flex-col items-center gap-1 transition-all ${metodoPago === 'sinpe' ? 'border-lingote-blue bg-white shadow-md' : 'border-gray-200 bg-gray-50'}`}
                    >
                      <CreditCard size={18} className={metodoPago === 'sinpe' ? 'text-lingote-blue' : ''} />
                      <span className="text-[10px] font-black uppercase">SINPE Móvil</span>
                    </button>
                    <button 
                      onClick={() => setMetodoPago('efectivo')}
                      className={`p-3 rounded-xl border-2 flex flex-col items-center gap-1 transition-all ${metodoPago === 'efectivo' ? 'border-lingote-blue bg-white shadow-md' : 'border-gray-200 bg-gray-50'}`}
                    >
                      <Banknote size={18} className={metodoPago === 'efectivo' ? 'text-lingote-blue' : ''} />
                      <span className="text-[10px] font-black uppercase">Efectivo</span>
                    </button>
                  </div>
                </div>

                <AnimatePresence>
                  {metodoPago === 'sinpe' && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }} 
                      animate={{ opacity: 1, height: 'auto' }} 
                      exit={{ opacity: 0, height: 0 }}
                      className="space-y-4"
                    >
                      <PagoSinpeAyuda 
                        montoTotal={getTotal()} 
                        onBancoClick={enfocarComprobante} 
                      />

                      <div className="bg-white p-4 rounded-2xl border border-blue-100 shadow-inner">
                        <p className="text-[10px] font-bold text-lingote-blue mb-2 italic text-center">
                          Digitá los últimos 4 dígitos del comprobante:
                        </p>
                        <input 
                          ref={inputRef}
                          type="text" 
                          inputMode="numeric"
                          maxLength={4}
                          placeholder="0000"
                          value={comprobante}
                          onChange={(e) => setComprobante(e.target.value.replace(/\D/g, ''))}
                          className="w-full p-2 bg-gray-50 rounded-lg border-2 border-gray-100 outline-none focus:border-lingote-blue text-center font-black tracking-[0.5em] text-lg text-lingote-dark"
                        />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="pt-2">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-gray-400 font-black uppercase tracking-widest text-[10px] italic">Total final</span>
                    <span className="text-3xl font-black italic text-lingote-dark tracking-tighter tabular-nums">
                      ₡{getTotal().toLocaleString()}
                    </span>
                  </div>
                  
                  {!abierto && (
                    <div className="bg-orange-50 border-2 border-orange-200 rounded-xl p-4 mb-4 flex items-start gap-3">
                      <div className="bg-orange-500 text-white p-1 rounded-lg shrink-0 mt-0.5">
                        <Clock size={16} strokeWidth={3} />
                      </div>
                      <div className="flex-1">
                        <p className="text-[11px] font-black text-orange-900 leading-tight uppercase">
                          PEDIDOS NO DISPONIBLES 🚫
                        </p>
                        <p className="text-[10px] text-orange-800 font-bold italic mt-1">
                          Nuestro horario es de {horarioTexto}. <br/>
                          Por seguridad, los pagos se bloquean a las {horaLimitePedidos}.
                        </p>
                      </div>
                    </div>
                  )}

                  {esCierreInminente && (
                    <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-3 mb-4 flex items-center gap-3 animate-pulse">
                      <div className="bg-yellow-500 text-white p-1 rounded-full">
                        <Clock size={16} />
                      </div>
                      <div className="flex-1">
                        <p className="text-[11px] font-black text-yellow-900 leading-tight uppercase">
                          ¡Última llamada de cocina! ⏳
                        </p>
                        <p className="text-[10px] text-yellow-800 font-bold italic">
                          Aceptamos pedidos hasta las {horaLimitePedidos} para que te dé tiempo de recoger. ¡Apurate!
                        </p>
                      </div>
                    </div>
                  )}

                  <button 
                    disabled={!abierto || !!(usuario && metodoPago === 'sinpe' && comprobante.length < 4)}
                    onClick={handleFinalizarPedido}
                    className={`w-full py-5 font-black text-xl rounded-2xl shadow-xl transition-all uppercase italic flex items-center justify-center gap-3 active:scale-95 ${
                      abierto 
                        ? 'bg-lingote-blue text-white disabled:bg-gray-200' 
                        : 'bg-gray-400 text-gray-200 cursor-not-allowed'
                    }`}
                  >
                    {!abierto 
                      ? 'Cocina Cerrada' 
                      : !usuario 
                        ? <>Completar mis Datos <UserCheck size={24} /></>
                        : !metodoPago 
                          ? 'Elegí cómo pagar' 
                          : (metodoPago === 'sinpe' && comprobante.length < 4) 
                            ? 'Faltan los 4 dígitos' 
                            : 'Confirmar Pedido ⚡'
                    }
                  </button>
                </div>
              </div>
            )}
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
};
