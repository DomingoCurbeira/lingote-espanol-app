import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Phone, History, RefreshCcw, Calendar, LogOut, ShoppingBag, Award } from 'lucide-react';
import { useUserStore } from '../store/useUserStore';
import { useCartStore } from '../store/useCartStore';
import { StampCard } from './StampCard';
import type { PedidoHistorial } from '../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onRepeatOrder: () => void;
}

export const ModalPerfil = ({ isOpen, onClose, onRepeatOrder }: Props) => {
  const { usuario, historialPedidos, sellos, borrarUsuario, limpiarHistorial } = useUserStore();
  const { addItem, vaciarCarrito } = useCartStore();

  const handleRepetirPedido = (pedido: PedidoHistorial) => {
    vaciarCarrito();
    pedido.items.forEach(item => {
      addItem({
        ...item,
        idUnico: crypto.randomUUID()
      });
    });
    onRepeatOrder();
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[250] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-lingote-dark/80 backdrop-blur-md"
          />

          <motion.div 
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative bg-white w-full max-w-lg rounded-[3rem] shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
          >
            <div className="p-8 bg-gradient-to-br from-gray-50 to-white border-b border-gray-100 relative">
              <button onClick={onClose} className="absolute top-6 right-6 p-2 hover:bg-gray-200 rounded-full transition-all">
                <X size={20} />
              </button>
              
              <div className="flex items-center gap-6">
                <div className="w-20 h-20 bg-lingote-gold rounded-3xl flex items-center justify-center shadow-xl shadow-lingote-gold/20">
                  <User size={40} className="text-lingote-dark" />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-lingote-dark uppercase italic tracking-tighter">Mi Perfil</h2>
                  {usuario ? (
                    <div className="space-y-1 mt-1">
                      <p className="text-sm font-bold text-gray-600">{usuario.nombre}</p>
                      <p className="text-xs text-gray-400 flex items-center gap-1 font-medium">
                        <Phone size={10} /> {usuario.telefono}
                      </p>
                    </div>
                  ) : (
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1 italic">Sin registro</p>
                  )}
                </div>
              </div>
            </div>

            <div className="flex-grow overflow-y-auto p-8 space-y-10 no-scrollbar pb-20">
              {/* SECCIÓN DE FIDELIDAD */}
              <section>
                <div className="flex items-center gap-2 text-lingote-gold mb-6">
                  <Award size={20} />
                  <h3 className="text-sm font-black uppercase tracking-widest italic">Mi Fidelidad</h3>
                </div>
                <StampCard sellos={sellos} />
              </section>

              <section>
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2 text-lingote-blue">
                    <History size={20} />
                    <h3 className="text-sm font-black uppercase tracking-widest italic">Pedidos Recientes</h3>
                  </div>
                  {historialPedidos.length > 0 && (
                    <button onClick={limpiarHistorial} className="text-[10px] font-bold text-gray-300 hover:text-red-400 uppercase tracking-tighter transition-colors">
                      Limpiar
                    </button>
                  )}
                </div>

                {historialPedidos.length === 0 ? (
                  <div className="py-10 text-center space-y-3 bg-gray-50 rounded-[2rem] border border-dashed border-gray-200">
                    <div className="text-gray-300 flex justify-center"><ShoppingBag size={32} /></div>
                    <p className="text-xs font-bold text-gray-400 uppercase italic">Aún no has hecho pedidos</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {historialPedidos.map((pedido) => (
                      <div key={pedido.id} className="bg-white border border-gray-100 rounded-3xl p-5 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <p className="text-[10px] font-black text-lingote-blue uppercase">Pedido #{pedido.id}</p>
                            <div className="flex items-center gap-2 text-[10px] text-gray-400 font-medium mt-1">
                              <Calendar size={10} />
                              {new Date(pedido.fecha).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })}
                            </div>
                          </div>
                          <p className="text-lg font-black text-lingote-dark italic tabular-nums">₡{pedido.total.toLocaleString()}</p>
                        </div>
                        
                        <div className="flex flex-wrap gap-1 mb-4">
                          {pedido.items.map((item, idx) => (
                            <span key={idx} className="text-[9px] bg-gray-50 text-gray-500 px-2 py-1 rounded-lg font-bold">
                              {item.cantidad}x {item.producto.nombre}
                            </span>
                          ))}
                        </div>

                        <button 
                          onClick={() => handleRepetirPedido(pedido)}
                          className="w-full py-3 bg-gray-50 hover:bg-lingote-gold hover:text-lingote-dark text-gray-500 font-black text-[10px] rounded-xl uppercase italic transition-all flex items-center justify-center gap-2"
                        >
                          <RefreshCcw size={14} /> Repetir este pedido
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </section>

              {usuario && (
                <button 
                  onClick={borrarUsuario}
                  className="w-full py-4 border-2 border-gray-100 text-gray-400 hover:text-red-500 hover:border-red-500/20 rounded-2xl text-[10px] font-black uppercase italic transition-all flex items-center justify-center gap-2"
                >
                  <LogOut size={14} /> Cerrar Sesión en este equipo
                </button>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
