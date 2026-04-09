import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Header } from './components/Header';
import { ModalUsuario } from './components/ModalUsuario';
import { SelectorCategorias } from './components/SelectorCategorias';
import { ProductoCard } from './components/ProductoCard';
import { LingoteCard } from './components/LingoteCard';
import { PersonalizacionModal } from './components/PersonalizacionModal';
import { CartDrawer } from './components/CartDrawer';
import { TiqueteGourmet } from './components/TiqueteGourmet'; // [NUEVO]
import { MENU_LINGOTES, MENU_BEBIDAS, MENU_COMBOS, MENU_POSTRES, MENU_PROMOCIONES } from './data'; 
import { useUserStore } from './store/useUserStore';
import { useCartStore } from './store/useCartStore'; 
import type { Categoria, ProductoMenu, Lingote, ItemCarrito, DatosPago } from './types';
import type { Promocion } from './types/ProductoMenu';

function App() {
  const [categoria, setCategoria] = useState<Categoria>('lingotes');
  const usuario = useUserStore((state) => state.usuario);
  const { addItem, vaciarCarrito } = useCartStore(); // [ACTUALIZADO]
  
  const [modalUsuarioAbierto, setModalUsuarioAbierto] = useState(false);
  const [mostrarMenu, setMostrarMenu] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [lingoteAConfigurar, setLingoteAConfigurar] = useState<Lingote | null>(null);

  // [NUEVO ESTADO] Para almacenar la información del pedido y mostrar el tiquete
  const [pedidoFinalizado, setPedidoFinalizado] = useState<{
    id: string;
    items: ItemCarrito[];
    usuario: any;
    pago: DatosPago;
    total: number;
    fecha: string;
  } | null>(null);

  const handleStart = () => {
    if (!usuario) setModalUsuarioAbierto(true);
    else setMostrarMenu(true);
  };

  const agregarAlCarrito = (item: ProductoMenu | Promocion) => {
  const nuevoItem: ItemCarrito = {
    idUnico: crypto.randomUUID(),
    // Usamos el cast 'as any' o 'as ProductoMenu' para que 
    // acepte el ID aunque sea string o number
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

  // [NUEVA FUNCIÓN] Se llama desde el CartDrawer cuando el usuario confirma el WhatsApp
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
    setMostrarMenu(false); // Vuelve a la landing page
    setPedidoFinalizado(null); // Quita el tiquete si estaba visible
    window.scrollTo({ top: 0, behavior: 'smooth' }); // Sube al inicio suavemente
  };

  // 1. Tipamos el estado para que acepte el evento (any es el camino rápido, pero efectivo aquí)
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e); // Ahora sí guardamos el evento sin quejas
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);

    // Limpiamos el evento al cerrar para que no gaste memoria
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
  }, []);

  const instalarApp = () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    deferredPrompt.userChoice.then((choiceResult: any) => {
      if (choiceResult.outcome === 'accepted') {
        console.log('✅ Cliente instaló la App');
      }
      setDeferredPrompt(null);
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-lingote-bg">
      <Header 
      onOpenCart={() => setIsCartOpen(true)} 
      onGoHome={volverAlInicio} 
    />
      
      <AnimatePresence mode="wait">
        {/* ESCENA 1: Tiquete de Comprobante */}
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
          /* ESCENA 2: Landing Page */
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
                <h2 className="text-3xl font-black text-lingote-dark italic uppercase tracking-tighter mb-4">
                  Raices Españolas, <span className="text-lingote-red text-4xl">Corazón tico</span>
                </h2>
                <button 
                  onClick={handleStart}
                  className="bg-lingote-gold text-lingote-dark px-10 py-4 rounded-2xl font-black text-xl shadow-xl hover:scale-105 active:scale-95 transition-all uppercase italic border-b-4 border-black/10"
                >
                  Ver el Menú
                </button>
              </div>
            </motion.main>
          ) : (
            /* ESCENA 3: Menú Principal */
            <motion.div 
              key="menu"
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }}
              className="flex-grow flex flex-col"
            >
              <SelectorCategorias activa={categoria} onChange={setCategoria} />
              
              <main className="flex-grow p-6 max-w-5xl mx-auto w-full">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={categoria}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-24"
                  >
                    {categoria === 'promociones' && MENU_PROMOCIONES.map(item => (
                      <ProductoCard 
                        key={item.id} 
                        item={item} 
                        onAdd={agregarAlCarrito} 
                      />
                    ))}

                    {categoria === 'lingotes' && MENU_LINGOTES.map(lingote => (
                      <LingoteCard 
                        key={lingote.id} 
                        lingote={lingote} 
                        onSelect={(l) => setLingoteAConfigurar(l)} 
                      />
                    ))}

                    {categoria === 'combos' && MENU_COMBOS.map(item => (
                      <ProductoCard key={item.id} item={item} onAdd={agregarAlCarrito} />
                    ))}

                    {categoria === 'bebidas' && MENU_BEBIDAS.map(item => (
                      <ProductoCard key={item.id} item={item} onAdd={agregarAlCarrito} />
                    ))}

                    {categoria === 'postres' && MENU_POSTRES.map(item => (
                      <ProductoCard key={item.id} item={item} onAdd={agregarAlCarrito} />
                    ))}
                  </motion.div>
                </AnimatePresence>
              </main>
            </motion.div>
          )
        )}
      </AnimatePresence>

      <ModalUsuario 
        isOpen={modalUsuarioAbierto} 
        onClose={() => {
          setModalUsuarioAbierto(false);
          if (useUserStore.getState().usuario) setMostrarMenu(true); 
        }} 
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
        onFinalizado={onFinalizarPedido} // [NUEVA PROP]
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
            <h4 className="text-lingote-dark font-black italic uppercase text-sm mb-4">Visítanos</h4>
            <p className="text-gray-400 text-xs leading-relaxed">
              Cartago, San Rafael de Oreamuno.<br/>
              De la Municipalidad, 100m Sur.
            </p>
          </div>
          <div>
            <h4 className="text-lingote-dark font-black italic uppercase text-sm mb-4">Horario</h4>
            <p className="text-gray-400 text-xs leading-relaxed">
              Lunes a Sábado: 10:00 AM - 16:00 PM<br/>
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