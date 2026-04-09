import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash2, Plus, Minus, ShoppingBag, CreditCard, Banknote } from 'lucide-react';
import { useCartStore } from '../store/useCartStore';
import { useUserStore } from '../store/useUserStore';
import { generarMensajeWhatsApp } from '../utils/whatsapp';
import type { MetodoPago, DatosPago, ItemCarrito } from '../types';
import { mostrarAlertaPago } from '../utils/alerts';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onFinalizado: (id: string, pago: DatosPago, total: number, items: ItemCarrito[]) => void; // Añadir esto
}

export const CartDrawer = ({ isOpen, onClose, onFinalizado }: Props) => {
  const { carrito, removeItem, updateCantidad, getTotal } = useCartStore();
  const usuario = useUserStore((state) => state.usuario);

  // Estados para el flujo de pago
  const [metodoPago, setMetodoPago] = useState<MetodoPago | null>(null);
  const [comprobante, setComprobante] = useState('');

  const handleFinalizarPedido = async () => {
  // Verificación de seguridad
  if (!metodoPago || !usuario) return;

  const pedidoID = Math.random().toString(36).substring(2, 6).toUpperCase();
  
  await mostrarAlertaPago(metodoPago, usuario.nombre);
  
  // Guardamos el objeto de pago para reusarlo
  const datosPago = { metodo: metodoPago, comprobante: comprobante || undefined };

  // Abrir WhatsApp
  const url = generarMensajeWhatsApp(carrito, usuario, getTotal(), datosPago, pedidoID);
  window.open(url, '_blank');

  // Notificar a App.tsx - Ahora onFinalizado ya será reconocido
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
            {/* Header */}
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-white shrink-0">
              <div className="flex items-center gap-2">
                <ShoppingBag className="text-lingote-blue" />
                <h2 className="text-xl font-black italic uppercase text-lingote-dark tracking-tighter">Tu Pedido</h2>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <X size={24} />
              </button>
            </div>

            {/* Lista de Items */}
            <div className="flex-grow overflow-y-auto p-6 space-y-6">
              {carrito.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-gray-300 italic text-center">
                  <ShoppingBag size={64} strokeWidth={1} className="mb-4 opacity-20" />
                  <p className="font-bold uppercase tracking-widest text-xs">El carrito está vacío</p>
                </div>
              ) : (
                carrito.map((item) => (
                  <div key={item.idUnico} className="flex gap-4 border-b border-gray-50 pb-6">
                    <img 
                      src={`/${item.producto.imagen}`} 
                      className="w-20 h-20 object-contain bg-gray-50 rounded-2xl border border-gray-100"
                      alt={item.producto.nombre} 
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
                ))
              )}
            </div>

            {/* Footer con Lógica de Pago */}
            {carrito.length > 0 && (
              <div className="p-6 bg-gray-50 border-t border-gray-100 shrink-0 space-y-4">
                
                {/* Selector de Método de Pago */}
                <div className="space-y-2">
                  <p className="text-[10px] font-black uppercase text-gray-400 italic">¿Cómo vas a pagar?</p>
                  <div className="grid grid-cols-2 gap-2">
                    <button 
                      onClick={() => setMetodoPago('sinpe')}
                      className={`p-3 rounded-xl border-2 flex flex-col items-center gap-1 transition-all ${metodoPago === 'sinpe' ? 'border-lingote-blue bg-white shadow-md' : 'border-gray-200 bg-gray-50 opacity-60'}`}
                    >
                      <CreditCard size={18} className={metodoPago === 'sinpe' ? 'text-lingote-blue' : ''} />
                      <span className="text-[10px] font-black uppercase">SINPE Móvil</span>
                    </button>
                    <button 
                      onClick={() => setMetodoPago('efectivo')}
                      className={`p-3 rounded-xl border-2 flex flex-col items-center gap-1 transition-all ${metodoPago === 'efectivo' ? 'border-lingote-blue bg-white shadow-md' : 'border-gray-200 bg-gray-50 opacity-60'}`}
                    >
                      <Banknote size={18} className={metodoPago === 'efectivo' ? 'text-lingote-blue' : ''} />
                      <span className="text-[10px] font-black uppercase">Efectivo</span>
                    </button>
                  </div>
                </div>

                {/* Input Comprobante SINPE */}
                <AnimatePresence>
                  {metodoPago === 'sinpe' && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }} 
                      animate={{ opacity: 1, height: 'auto' }} 
                      exit={{ opacity: 0, height: 0 }}
                      className="bg-white p-4 rounded-2xl border border-blue-100 shadow-inner"
                    >
                      <p className="text-[10px] font-bold text-lingote-blue mb-2 italic">Últimos 4 dígitos del comprobante:</p>
                      <input 
                        type="text" 
                        maxLength={4}
                        placeholder="0000"
                        value={comprobante}
                        onChange={(e) => setComprobante(e.target.value.replace(/\D/g, ''))}
                        className="w-full p-2 bg-gray-50 rounded-lg border-2 border-gray-100 outline-none focus:border-lingote-blue text-center font-black tracking-[0.5em] text-lg"
                      />
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
                  
                  <button 
                    disabled={!metodoPago || (metodoPago === 'sinpe' && comprobante.length < 4)}
                    onClick={handleFinalizarPedido}
                    className="w-full py-5 bg-lingote-blue disabled:bg-gray-200 text-white font-black text-xl rounded-2xl shadow-xl transition-all uppercase italic flex items-center justify-center gap-3 active:scale-95"
                  >
                    {!metodoPago 
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