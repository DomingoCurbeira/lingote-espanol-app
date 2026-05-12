import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Header } from './components/Header';
import { ModalUsuario } from './components/ModalUsuario';
import { ModalPerfil } from './components/ModalPerfil';
import { SelectorCategorias } from './components/SelectorCategorias';
import { ProductoCard } from './components/ProductoCard';
import { LingoteCard } from './components/LingoteCard';
import { PersonalizacionModal } from './components/PersonalizacionModal';
import { CartDrawer } from './components/CartDrawer';
import { TiqueteGourmet } from './components/TiqueteGourmet';
import { UbicacionSeccion } from './components/UbicacionSeccion';
import { MENU_LINGOTES, MENU_BEBIDAS, MENU_POSTRES, MENU_PROMOCIONES, MENU_SALSAS } from './data'; 
import { useUserStore } from './store/useUserStore';
import { useCartStore } from './store/useCartStore'; 
import type { Categoria, ProductoMenu, Lingote, ItemCarrito, DatosPago } from './types';
import type { Promocion } from './types/ProductoMenu';

function App() {
  const [categoria, setCategoria] = useState<Categoria>('lingotes');
  const usuario = useUserStore((state) => state.usuario);
  const { addItem, vaciarCarrito, itemsCount } = useCartStore();
  
  const [modalUsuarioAbierto, setModalUsuarioAbierto] = useState(false);
  const [modalPerfilAbierto, setModalPerfilAbierto] = useState(false);
  const [mostrarMenu, setMostrarMenu] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [lingoteAConfigurar, setLingoteAConfigurar] = useState<Lingote | null>(null);

  const [pedidoFinalizado, setPedidoFinalizado] = useState<{
    id: string;
    items: ItemCarrito[];
    usuario: any;
    pago: DatosPago;
    total: number;
    fecha: string;
  } | null>(null);

  const handleStart = () => {
    setMostrarMenu(true);
  };

  const agregarAlCarrito = (item: ProductoMenu | Promocion) => {
    const nuevoItem: ItemCarrito = {
      idUnico: crypto.randomUUID(),
      producto: item as any, 
      extras: [],
      cantidad: 1,
      precioTotal: item.precio 
    };
    addItem(nuevoItem);
    setIsCartOpen(true);
  };

  const confirmarPersonalizacion = (itemCarrito: ItemCarrito) => {
    addItem(itemCarrito);
    setLingoteAConfigurar(null);
    setIsCartOpen(true);
  };

  const onFinalizarPedido = (id: string, pago: DatosPago, total: number, items: ItemCarrito[]) => {
    setPedidoFinalizado({
      id,
      items,
      usuario,
      pago,
      total,
      fecha: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });
    vaciarCarrito();
    setIsCartOpen(false);
  };

  const volverAlInicio = () => {
    setMostrarMenu(false);
    setPedidoFinalizado(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
  }, []);

  const instalarApp = () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    deferredPrompt.userChoice.then(() => {
      setDeferredPrompt(null);
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-lingote-bg">
      <Header 
        onOpenCart={() => setIsCartOpen(true)} 
        onGoHome={volverAlInicio} 
        onOpenProfile={() => setModalPerfilAbierto(true)}
        cartCount={itemsCount()}
      />
      
      <AnimatePresence mode="wait">
        {pedidoFinalizado ? (
          <motion.main
            key="ticket"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="flex-grow flex items-center justify-center p-4"
          >
            <TiqueteGourmet 
              pedido={pedidoFinalizado} 
              onNuevoPedido={() => setPedidoFinalizado(null)} 
            />
          </motion.main>
        ) : (
          !mostrarMenu ? (
            <motion.main 
              key="landing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex-grow flex items-center justify-center p-6 text-center"
            >
              <div className="max-w-md">
                <div className="w-48 h-48 mx-auto mb-8 relative flex items-center justify-center">
                  <div className="absolute inset-0 bg-gradient-to-tr from-lingote-gold to-lingote-red rounded-full opacity-20 animate-ping" />
                  <div className="absolute inset-4 bg-white/50 blur-2xl rounded-full" />
                  <img 
                    src="/logo_lingote_transparente.svg" 
                    alt="Lingote" 
                    className="relative z-10 w-40 h-40 object-contain drop-shadow-2xl" 
                  />
                </div>
                <h1 className="text-5xl font-black text-lingote-dark italic uppercase tracking-tighter leading-none mb-4">
                  Raíces <span className="text-lingote-red">Españolas</span>,<br/>
                  Corazón <span className="text-lingote-blue">Tico</span>
                </h1>
                <p className="text-gray-500 font-medium italic mb-10">La mejor tortilla española de Cartago.</p>
                <button 
                  onClick={handleStart}
                  className="bg-lingote-blue text-white font-black text-2xl px-12 py-6 rounded-[2rem] shadow-2xl hover:bg-lingote-dark transition-all transform active:scale-95 italic uppercase"
                >
                  ¡Tengo Hambre! ⚡
                </button>
              </div>
            </motion.main>
          ) : (
            <motion.div 
              key="menu"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex flex-col flex-grow"
            >
              <main className="flex-grow max-w-5xl mx-auto w-full p-6">
                <SelectorCategorias 
                  activa={categoria} 
                  onChange={setCategoria} 
                />

                <AnimatePresence mode="wait">
                  <motion.div
                    key={categoria}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12 pb-20"
                  >
                    {categoria === 'lingotes' && MENU_LINGOTES.map(lingote => (
                      <LingoteCard key={lingote.id} lingote={lingote} onSelect={setLingoteAConfigurar} />
                    ))}

                    {categoria === 'promociones' && MENU_PROMOCIONES.map(item => (
                      <ProductoCard key={item.id} item={item} onAdd={agregarAlCarrito} />
                    ))}

                    {categoria === 'bebidas' && MENU_BEBIDAS.map(item => (
                      <ProductoCard key={item.id} item={item} onAdd={agregarAlCarrito} />
                    ))}

                    {categoria === 'postres' && MENU_POSTRES.map(item => (
                      <ProductoCard key={item.id} item={item} onAdd={agregarAlCarrito} />
                    ))}

                    {categoria === 'salsas' && MENU_SALSAS.map(item => (
                      <ProductoCard key={item.id} item={item} onAdd={agregarAlCarrito} />
                    ))}
                  </motion.div>
                </AnimatePresence>
                
                <UbicacionSeccion />
              </main>
            </motion.div>
          )
        )}
      </AnimatePresence>

      <ModalUsuario 
        isOpen={modalUsuarioAbierto} 
        onClose={() => setModalUsuarioAbierto(false)} 
      />

      <ModalPerfil 
        isOpen={modalPerfilAbierto} 
        onClose={() => setModalPerfilAbierto(false)} 
        onRepeatOrder={() => setIsCartOpen(true)}
      />

      {lingoteAConfigurar && (
        <PersonalizacionModal
          isOpen={!!lingoteAConfigurar}
          lingote={lingoteAConfigurar}
          onClose={() => setLingoteAConfigurar(null)}
          onConfirmar={confirmarPersonalizacion}
        />
      )}

      <CartDrawer 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
        onFinalizado={onFinalizarPedido}
        onRequireUser={() => setModalUsuarioAbierto(true)}
      />

      <footer className="py-12 bg-white border-t border-gray-100 mt-auto px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
          <div>
            <h4 className="text-lingote-dark font-black italic uppercase text-sm mb-4">El Lingote Español</h4>
            <p className="text-gray-400 text-xs leading-relaxed">
              Raices Españolas y Corazón Tico en Cartago.
            </p>
          </div>
          <div>
            <h4 className="text-lingote-dark font-black italic uppercase text-sm mb-4">Ubicación</h4>
            <p className="text-gray-400 text-xs leading-relaxed italic">
              Próximamente local físico en Cartago.<br/>
              Punto de recogida actual por confirmar.
            </p>
          </div>
          <div>
            <h4 className="text-lingote-dark font-black italic uppercase text-sm mb-4">Horario Comercial</h4>
            <p className="text-gray-400 text-xs leading-relaxed">
              Lunes a Sábado: 8:00 AM - 4:00 PM<br/>
              Domingos: Cerrado
            </p>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-gray-50 text-center">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-300">
            © 2026 EL LINGOTE ESPAÑOL • PURA VIDA, OLÉ
          </p>
        </div>
      </footer>

      {deferredPrompt && (
        <button 
          onClick={instalarApp}
          className="fixed bottom-24 right-6 z-50 bg-lingote-gold text-lingote-dark font-black px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-2 animate-bounce uppercase italic text-sm"
        >
          📲 Instalar App
        </button>
      )}
    </div>
  );
}

export default App;
