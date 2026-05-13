import React, { useState, useMemo } from 'react';
import { 
  TrendingUp, Package, ShoppingCart, ArrowLeft,
  Calculator, Download, Plus, Trash2, Banknote,
  Smartphone, LayoutDashboard, Boxes
} from 'lucide-react';
import html2canvas from 'html2canvas';
import insumosData from '../data/admin/insumos.json';
import recetasData from '../data/admin/recetas.json';
import { MENU_LINGOTES, MENU_BEBIDAS, MENU_POSTRES, MENU_SALSAS, MENU_PROMOCIONES } from '../data';
import { calcularCostoReceta, generarListaCompras } from '../utils/adminCalculations';
import type { Insumo, Receta } from '../types/admin';
import { useAdminStore } from '../store/useAdminStore';
import type { VentaRealizada } from '../store/useAdminStore';
import { useMenuStore } from '../store/useMenuStore';
import { mostrarToast, MySwal } from '../utils/alerts';

export const AdminPanel: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState<'caja' | 'stock' | 'rentabilidad' | 'precios' | 'produccion'>('caja');
  const { registrarVenta, ventasDelDia, limpiarCaja } = useAdminStore();
  const { toggleDisponibilidad, estaDisponible } = useMenuStore();
  
  const allInsumos: Insumo[] = useMemo(() => [
    ...insumosData.vegetales, ...insumosData.proteinas, ...insumosData.lacteos,
    ...insumosData.panaderia_y_dulce, ...insumosData.packaging, ...insumosData.otros
  ], []);

  const [localInsumos, setLocalInsumos] = useState<Insumo[]>(allInsumos);
  const [produccion, setProduccion] = useState<{ [id: string]: number }>({
    'rec-lingote-clasico': 0, 'rec-lingote-tico': 0, 'rec-lingote-patron': 0, 'rec-lingote-supremo': 0,
    'rec-fresco-cas': 0, 'rec-mora-leche': 0, 'rec-chocolate': 0, 'rec-torrijona': 0,
    'rec-capricho-limon': 0, 'rec-lingote-vasco': 0, 'rec-bocata-real': 0,
    'rec-promo-express': 0, 'rec-promo-golosa': 0, 'rec-promo-real': 0
  });

  const [ticketActual, setTicketActual] = useState<{producto: any, cantidad: number}[]>([]);
  const [nombreCliente, setNombreCliente] = useState('');
  
  const allProducts = useMemo(() => [...MENU_PROMOCIONES, ...MENU_LINGOTES, ...MENU_BEBIDAS, ...MENU_POSTRES, ...MENU_SALSAS], []);
  const totalTicket = ticketActual.reduce((sum, item) => sum + (item.producto.precio * item.cantidad), 0);
  const totalVentasHoy = ventasDelDia.reduce((sum, v) => sum + v.total, 0);

  const analysis = useMemo(() => {
    const lookup: any = { lingotes: MENU_LINGOTES, bebidas: MENU_BEBIDAS, postres: MENU_POSTRES, salsas: MENU_SALSAS, promociones: MENU_PROMOCIONES };
    return (recetasData as Receta[]).map(receta => {
      const costos = calcularCostoReceta(receta, localInsumos);
      const arrayTienda = lookup[receta.categoria_tienda] || [];
      const productoTienda = arrayTienda.find((p: any) => p.id === receta.id_producto_tienda);
      const precioVenta = productoTienda?.precio || 0;
      const ganancia = precioVenta - costos.costoConMerma;
      const margen = precioVenta > 0 ? (ganancia / precioVenta) * 100 : 0;
      return { ...costos, precioVenta, ganancia, margen };
    });
  }, [localInsumos]);

  const listaCompras = useMemo(() => {
    const planeacion = Object.keys(produccion).filter(id => produccion[id] > 0).map(id => ({ recetaId: id, cantidad: produccion[id] }));
    return generarListaCompras(planeacion, recetasData as Receta[], localInsumos);
  }, [produccion, localInsumos]);

  const agregarAlTicket = (producto: any) => {
    setTicketActual(prev => {
      const existe = prev.find(i => i.producto.id === producto.id && i.producto.nombre === producto.nombre);
      if (existe) return prev.map(i => (i.producto.id === producto.id && i.producto.nombre === producto.nombre) ? {...i, cantidad: i.cantidad + 1} : i);
      return [...prev, { producto, cantidad: 1 }];
    });
  };

  const removerDelTicket = (id: number, nombre: string) => {
    setTicketActual(prev => prev.filter(i => !(i.producto.id === id && i.producto.nombre === nombre)));
  };

  const procesarVenta = (metodo: 'sinpe' | 'efectivo') => {
    if (ticketActual.length === 0) return;
    const nuevaVenta: VentaRealizada = {
      id: Math.random().toString(36).substring(2, 6).toUpperCase(),
      cliente: nombreCliente || 'Cliente Mostrador',
      items: ticketActual.map(i => ({ nombre: i.producto.nombre, cantidad: i.cantidad, precio: i.producto.precio })),
      total: totalTicket, metodoPago: metodo, fecha: new Date().toISOString()
    };
    registrarVenta(nuevaVenta);
    setTicketActual([]);
    setNombreCliente('');
    mostrarToast(`Venta #${nuevaVenta.id} registrada 💰`);
  };

  const handleResetCaja = () => {
    MySwal.fire({
      title: '<span class="font-black italic uppercase text-lingote-dark">¿Reiniciar Caja?</span>',
      html: '<p class="text-gray-500 font-medium italic text-sm">Se borrarán todas las ventas registradas hoy. <br/> Asegurate de haber anotado tus totales.</p>',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'SÍ, REINICIAR',
      cancelButtonText: 'CANCELAR',
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#94a3b8',
      customClass: {
        popup: 'rounded-[2.5rem]',
        confirmButton: 'rounded-xl font-black italic px-6 py-3 shadow-lg uppercase',
        cancelButton: 'rounded-xl font-black italic px-6 py-3 uppercase'
      }
    }).then((result) => {
      if (result.isConfirmed) {
        limpiarCaja();
        mostrarToast('Caja reiniciada 🧹');
      }
    });
  };

  const descargarLista = async () => {
    const element = document.getElementById('lista-compras-export');
    if (!element) return;
    const canvas = await html2canvas(element, { backgroundColor: '#ffffff', scale: 2 });
    const link = document.createElement('a');
    link.download = `Lista_Compras_Lingote_${new Date().toLocaleDateString().replace(/\//g, '-')}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
    mostrarToast('Lista descargada con éxito 📥');
  };

  const descargarReporteDiario = async () => {
    const element = document.getElementById('reporte-diario-export');
    if (!element) return;
    const canvas = await html2canvas(element, { backgroundColor: '#ffffff', scale: 2 });
    const link = document.createElement('a');
    link.download = `Cierre_Caja_Lingote_${new Date().toLocaleDateString().replace(/\//g, '-')}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
    mostrarToast('Reporte descargado 📋');
  };

  const tabs = [
    { id: 'caja', label: 'Caja', icon: ShoppingCart },
    { id: 'stock', label: 'Stock', icon: Boxes },
    { id: 'rentabilidad', label: 'Ganancia', icon: LayoutDashboard },
    { id: 'precios', label: 'Costos', icon: TrendingUp },
    { id: 'produccion', label: 'Cocina', icon: Calculator },
  ];

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 flex flex-col h-screen overflow-hidden">
      <header className="bg-white border-b border-gray-200 px-4 py-3 sticky top-0 z-50 shrink-0 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-left">
          <div className="flex items-center gap-3">
            <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-xl text-gray-400 transition-colors"><ArrowLeft size={20} /></button>
            <h1 className="text-sm font-black uppercase italic text-lingote-dark tracking-tighter leading-none">Cerebro Real 🧠</h1>
          </div>
          
          <div className="flex items-center gap-2 bg-green-50 px-3 py-1.5 rounded-xl border border-green-100">
             <div className="text-right">
                <p className="text-[7px] font-black text-green-600 uppercase opacity-70 leading-none">Ventas Hoy</p>
                <p className="text-xs font-black text-green-700 italic">₡{totalVentasHoy.toLocaleString()}</p>
             </div>
             <TrendingUp size={14} className="text-green-500" />
          </div>
        </div>
      </header>

      <div className="flex-grow flex flex-col lg:flex-row overflow-hidden text-left">
        <aside className="w-full lg:w-20 bg-white border-b lg:border-r border-gray-200 z-40 shrink-0 text-left">
          <nav className="p-2 grid grid-cols-5 lg:grid-cols-1 gap-1 h-full">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isSelected = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex flex-col items-center justify-center py-2 px-1 rounded-xl transition-all ${
                    isSelected ? 'bg-lingote-blue text-white shadow-md scale-95' : 'text-gray-400 hover:bg-gray-50'
                  }`}
                >
                  <Icon size={18} strokeWidth={isSelected ? 3 : 2} />
                  <span className="text-[7px] font-black uppercase mt-1 tracking-tighter">{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </aside>

        <main className="flex-grow overflow-y-auto no-scrollbar p-4 lg:p-6 bg-gray-50 text-left">
          <div className="max-w-6xl mx-auto">
            {activeTab === 'caja' && (
              <div className="flex flex-col lg:flex-row gap-6 items-start h-full text-left">
                <div className="w-full lg:flex-1 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 text-left">
                  {allProducts.map(p => (
                    <button key={`${p.id}-${p.nombre}`} onClick={() => agregarAlTicket(p)} className="bg-white p-3 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center gap-2 active:scale-95 hover:shadow-md transition-all">
                      <div className="w-10 h-10 bg-gray-50 rounded-xl overflow-hidden shrink-0">
                         <img src={`/${p.imagen}`} className="w-full h-full object-contain" onError={(e) => (e.target as any).src = '/logo_lingote_oficial_ligero.webp'} />
                      </div>
                      <div>
                        <p className="text-[8px] font-black uppercase italic leading-none text-lingote-dark line-clamp-1">{p.nombre}</p>
                        <p className="text-[9px] font-black text-lingote-blue mt-1 italic">₡{p.precio.toLocaleString()}</p>
                      </div>
                    </button>
                  ))}
                </div>

                <aside className="w-full lg:w-80 lg:sticky lg:top-0 h-fit text-left">
                  <div className="bg-white rounded-[2rem] shadow-xl border border-gray-100 flex flex-col overflow-hidden text-left">
                    <div className="p-4 bg-lingote-dark text-white flex justify-between items-center text-left">
                       <h3 className="font-black uppercase italic tracking-widest text-[9px] flex items-center gap-2 leading-none"><ShoppingCart size={14} /> Ticket</h3>
                       <button onClick={() => setTicketActual([])} className="text-[8px] font-black uppercase opacity-50 hover:opacity-100">Vaciar</button>
                    </div>
                    <div className="max-h-[40vh] overflow-y-auto p-3 space-y-2 no-scrollbar text-left">
                      {ticketActual.length === 0 ? (
                        <div className="h-32 flex flex-col items-center justify-center text-gray-300 italic opacity-50"><Plus size={24} className="mb-1" /><p className="text-[8px] uppercase font-black">Sumá productos</p></div>
                      ) : (
                        ticketActual.map(item => (
                          <div key={`${item.producto.id}-${item.producto.nombre}`} className="flex justify-between items-center bg-gray-50 p-2 rounded-xl border border-gray-100 text-left">
                            <div className="flex-1 text-left"><p className="text-[9px] font-black uppercase text-lingote-dark italic leading-none">{item.producto.nombre}</p><p className="text-[8px] font-bold text-gray-400 mt-0.5">₡{item.producto.precio.toLocaleString()} x {item.cantidad}</p></div>
                            <button onClick={() => removerDelTicket(item.producto.id, item.producto.nombre)} className="p-1.5 text-red-200 hover:text-red-500 transition-colors"><Trash2 size={14} /></button>
                          </div>
                        ))
                      )}
                    </div>
                    <div className="p-4 bg-gray-50 border-t border-gray-100 space-y-3 text-left">
                      <input 
                        type="text"
                        placeholder="Nombre del Cliente (Opcional)"
                        value={nombreCliente}
                        onChange={(e) => setNombreCliente(e.target.value)}
                        className="w-full p-2 text-[10px] border border-gray-200 rounded-lg outline-none focus:border-lingote-blue italic font-medium bg-white"
                      />
                      <div className="flex justify-between items-center"><span className="text-[9px] font-black uppercase text-gray-400 italic">Total</span><span className="text-2xl font-black text-lingote-dark italic tracking-tighter">₡{totalTicket.toLocaleString()}</span></div>
                      <div className="grid grid-cols-2 gap-2">
                        <button onClick={() => procesarVenta('efectivo')} disabled={ticketActual.length === 0} className="bg-white border border-gray-200 p-3 rounded-xl flex flex-col items-center gap-1 text-green-600 active:scale-95 disabled:opacity-30"><Banknote size={18} /><span className="text-[7px] font-black uppercase">Efectivo</span></button>
                        <button onClick={() => procesarVenta('sinpe')} disabled={ticketActual.length === 0} className="bg-white border border-gray-200 p-3 rounded-xl flex flex-col items-center gap-1 text-lingote-blue active:scale-95 disabled:opacity-30"><Smartphone size={18} /><span className="text-[7px] font-black uppercase">SINPE</span></button>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 bg-white p-6 rounded-[2rem] shadow-xl border border-gray-100 text-left">
                    <div className="flex justify-between items-center mb-4">
                        <h4 className="text-[10px] font-black uppercase text-gray-400 tracking-widest flex items-center gap-2"><TrendingUp size={14} /> Resumen de Hoy</h4>
                        {ventasDelDia.length > 0 && (
                            <button onClick={descargarReporteDiario} className="p-1.5 bg-lingote-blue text-white rounded-lg shadow-md active:scale-95 transition-all">
                                <Download size={14} />
                            </button>
                        )}
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-center">
                        <div className="bg-green-50 p-4 rounded-2xl"><p className="text-[8px] font-black uppercase text-green-700 opacity-70">Ventas</p><p className="text-xl font-black text-green-700 italic tabular-nums">₡{totalVentasHoy.toLocaleString()}</p></div>
                        <div className="bg-gray-50 p-4 rounded-2xl"><p className="text-[8px] font-black uppercase text-gray-400 opacity-70">Pedidos</p><p className="text-xl font-black text-gray-700 italic tabular-nums">{ventasDelDia.length}</p></div>
                    </div>

                    <div style={{ position: 'absolute', left: '-9999px', top: 0 }}>
                        <div id="reporte-diario-export" style={{ backgroundColor: '#ffffff', color: '#1e293b' }} className="p-10 w-[600px] text-left">
                            <div style={{ borderColor: '#1e293b', borderBottomWidth: '4px' }} className="pb-6 mb-8 text-left">
                                <p style={{ color: '#2b3674' }} className="text-sm font-black uppercase tracking-[0.4em]">El Lingote Español</p>
                                <h2 style={{ color: '#1e293b' }} className="text-4xl font-black uppercase italic tracking-tighter mt-1 leading-none">Cierre de Jornada</h2>
                                <p style={{ color: '#94a3b8' }} className="text-md font-bold italic mt-2">{new Date().toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                            </div>

                            <div className="grid grid-cols-2 gap-6 mb-10">
                                <div style={{ backgroundColor: '#f8fafc', borderColor: '#f1f5f9', borderWidth: '1px' }} className="p-6 rounded-[2rem] shadow-sm text-left">
                                    <p style={{ color: '#94a3b8' }} className="text-[10px] font-black uppercase tracking-widest">Total en Caja</p>
                                    <p style={{ color: '#2b3674' }} className="text-4xl font-black italic mt-1 text-left tabular-nums">₡{totalVentasHoy.toLocaleString()}</p>
                                </div>
                                <div style={{ backgroundColor: '#f8fafc', borderColor: '#f1f5f9', borderWidth: '1px' }} className="p-6 rounded-[2rem] border border-gray-100 shadow-sm text-left">
                                    <p style={{ color: '#94a3b8' }} className="text-[10px] font-black uppercase tracking-widest">Transacciones</p>
                                    <p style={{ color: '#1e293b' }} className="text-4xl font-black italic mt-1 text-left tabular-nums">{ventasDelDia.length}</p>
                                </div>
                            </div>

                            <div className="space-y-6 text-left">
                                <h3 style={{ color: '#94a3b8', borderColor: '#f1f5f9' }} className="text-[12px] font-black uppercase tracking-[0.3em] border-b pb-3 mb-6">Detalle de Ventas</h3>
                                {ventasDelDia.map((v, idx) => (
                                    <div key={idx} style={{ borderColor: '#f8fafc' }} className="flex justify-between items-start border-b pb-4">
                                        <div className="text-left">
                                            <div className="flex items-center gap-2">
                                                <span style={{ backgroundColor: '#f1f5f9', color: '#64748b' }} className="text-[8px] font-black px-2 py-0.5 rounded uppercase leading-none">#{v.id}</span>
                                                <p style={{ color: '#1e293b' }} className="text-sm font-black uppercase italic leading-none">{v.cliente}</p>
                                            </div>
                                            <p style={{ color: '#94a3b8' }} className="text-[10px] font-bold uppercase mt-1">{v.metodoPago} • {new Date(v.fecha).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                                            <p style={{ color: '#64748b' }} className="text-[10px] font-medium mt-1 italic">{v.items.map(i => `${i.cantidad}x ${i.nombre}`).join(', ')}</p>
                                        </div>
                                        <p style={{ color: '#2b3674' }} className="text-lg font-black italic tabular-nums">₡{v.total.toLocaleString()}</p>
                                    </div>
                                ))}
                            </div>

                            <div style={{ borderColor: '#f1f5f9' }} className="mt-16 pt-8 border-t-2 border-dashed text-center opacity-30">
                                <p style={{ color: '#cbd5e1' }} className="text-[10px] font-black uppercase tracking-[0.3em]">© 2026 EL LINGOTE ESPAÑOL • PURA VIDA, OLÉ</p>
                            </div>
                        </div>
                    </div>

                    <button onClick={handleResetCaja} className="w-full mt-4 py-2 text-[8px] font-black uppercase text-gray-300 hover:text-red-400 transition-colors">Resetear Caja</button>
                  </div>
                </aside>
              </div>
            )}

            {activeTab === 'stock' && (
              <div className="bg-white rounded-[2rem] shadow-xl overflow-hidden border border-gray-100 animate-in fade-in duration-500 text-left">
                <div className="p-5 bg-lingote-red text-white flex justify-between items-center text-left">
                    <h3 className="font-black uppercase italic tracking-widest flex items-center gap-2 text-xs leading-none"><Package size={16} /> Control Stock</h3>
                </div>
                <div className="p-5 space-y-6 text-left">
                  {[
                    { label: 'Lingotes', cat: 'lingotes', items: MENU_LINGOTES },
                    { label: 'Promos', cat: 'promociones', items: MENU_PROMOCIONES },
                    { label: 'Bebidas', cat: 'bebidas', items: MENU_BEBIDAS },
                    { label: 'Postres', cat: 'postres', items: MENU_POSTRES },
                    { label: 'Salsas', cat: 'salsas', items: MENU_SALSAS }
                  ].map(seccion => (
                    <div key={seccion.label} className="text-left">
                      <h4 className="text-[8px] font-black uppercase text-gray-400 mb-3 tracking-[0.2em] border-b pb-1 text-left">{seccion.label}</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 text-left">
                        {seccion.items.map(p => {
                          const disponible = estaDisponible(seccion.cat as any, p.id);
                          return (
                            <button key={`${seccion.cat}-${p.id}`} 
                              onClick={() => {
                                toggleDisponibilidad(seccion.cat as any, p.id);
                                mostrarToast(`${p.nombre} ${!disponible ? 'habilitado' : 'agotado'} 🚦`);
                              }} 
                              className={`p-3 rounded-xl border flex items-center justify-between transition-all ${disponible ? 'border-green-100 bg-green-50/20' : 'border-red-100 bg-red-50'}`}
                            >
                              <span className={`text-[9px] font-black uppercase italic leading-none ${disponible ? 'text-lingote-dark' : 'text-red-400'}`}>{p.nombre}</span>
                              <div className={`w-7 h-4 rounded-full relative transition-colors ${disponible ? 'bg-green-500' : 'bg-gray-300'}`}><div className={`absolute top-0.5 w-3 h-3 bg-white rounded-full transition-all ${disponible ? 'right-0.5' : 'left-0.5'}`} /></div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'rentabilidad' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 animate-in fade-in duration-500 text-left">
                {analysis.map(item => (
                  <div key={item.nombre} className="bg-white p-5 rounded-[1.5rem] shadow-md border border-gray-100 text-left">
                    <div className="flex justify-between items-start mb-4 text-left">
                      <h3 className="text-xs font-black uppercase italic text-lingote-dark leading-tight">{item.nombre}</h3>
                      <span className={`px-2 py-0.5 rounded-full text-[8px] font-black ${item.margen > 60 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{item.margen.toFixed(0)}%</span>
                    </div>
                    <div className="space-y-1.5 text-[10px] font-bold italic text-gray-500 text-left border-t pt-2 mt-2">
                      <div className="flex justify-between"><span>Costo:</span><span className="text-gray-700 font-black">₡{item.costoConMerma.toLocaleString()}</span></div>
                      <div className="flex justify-between"><span>Venta:</span><span className="text-lingote-blue font-black">₡{item.precioVenta.toLocaleString()}</span></div>
                      <div className="flex justify-between border-t pt-1.5 text-green-600 font-black"><span>Ganancia:</span><span>₡{item.ganancia.toLocaleString()}</span></div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'precios' && (
              <div className="bg-white rounded-[2rem] shadow-xl overflow-hidden border border-gray-100 text-left">
                <table className="w-full text-left">
                  <thead className="bg-gray-50 text-[8px] font-black uppercase text-gray-400 italic"><tr><th className="p-4">Insumo</th><th className="p-4 text-right">Precio (₡)</th></tr></thead>
                  <tbody className="divide-y divide-gray-100">
                    {localInsumos.map(insumo => (<tr key={insumo.id} className="hover:bg-blue-50/30 transition-colors text-gray-700"><td className="p-4 text-left"><p className="font-black uppercase text-[10px] italic text-gray-700">{insumo.nombre}</p><p className="text-[7px] text-gray-400 uppercase">{insumo.categoria}</p></td><td className="p-4 text-right"><input type="number" value={insumo.precio} onChange={(e) => { const val = parseFloat(e.target.value); setLocalInsumos(prev => prev.map(i => i.id === insumo.id ? {...i, precio: val} : i)); }} className="w-20 p-2 bg-gray-50 border border-gray-100 rounded-lg text-right font-black text-lingote-blue outline-none focus:border-lingote-blue" /></td></tr>))}
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === 'produccion' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-in fade-in duration-500 text-left">
                <div className="bg-white p-5 rounded-[2rem] border border-gray-100 text-left">
                  <h3 className="font-black uppercase italic text-xs mb-4 flex items-center gap-2 text-left leading-none"><Calculator size={16} /> Planear</h3>
                  <div className="grid grid-cols-1 gap-2 text-left">
                    {(recetasData as Receta[]).map(rec => (<div key={rec.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-xl text-left"><span className="text-[9px] font-black uppercase italic text-gray-600">{rec.nombre}</span><input type="number" min="0" value={produccion[rec.id] || 0} onChange={(e) => setProduccion(prev => ({...prev, [rec.id]: parseInt(e.target.value) || 0}))} className="w-12 p-1.5 bg-white border border-gray-200 rounded-lg text-center font-black text-[10px]" /></div>))}
                  </div>
                </div>
                <div className="bg-white p-6 rounded-[2rem] shadow-xl border-2 border-lingote-blue/10 relative overflow-hidden text-left">
                  <div className="flex justify-between items-center mb-4 text-left">
                    <h3 className="font-black uppercase italic text-[10px] text-lingote-blue flex items-center gap-2 leading-none">
                      <ShoppingCart size={16} /> Lista Compras
                    </h3>
                    {listaCompras.length > 0 && (
                      <button onClick={descargarLista} className="p-2 bg-lingote-gold text-lingote-dark rounded-xl shadow-md text-[8px] font-black uppercase italic transition-all active:scale-95">
                        <Download size={14} />
                      </button>
                    )}
                  </div>

                  {listaCompras.length === 0 ? (
                    <p className="text-center text-gray-300 py-10 italic text-[10px]">No hay planes hoy</p>
                  ) : (
                    <div className="space-y-2">
                        <div className="border-b-2 border-dashed border-gray-100 pb-2 mb-2 text-center">
                            <p className="text-[10px] font-black text-lingote-dark uppercase italic text-center">Resumen de Cantidades</p>
                        </div>
                        {listaCompras.map(item => (
                          <div key={item.nombre} className="flex justify-between text-[9px] font-bold">
                            <span className="uppercase text-gray-600">{item.nombre}</span>
                            <span className="text-lingote-blue font-black">{item.cantidad.toFixed(1)} {item.unidad}</span>
                          </div>
                        ))}
                    </div>
                  )}

                  {/* ELEMENTO FUERA DE PANTALLA PARA EXPORTACIÓN LIMPIA */}
                  <div style={{ position: 'absolute', left: '-9999px', top: 0 }}>
                    <div id="lista-compras-export" style={{ backgroundColor: '#ffffff', color: '#1e293b' }} className="space-y-2 p-10 bg-white rounded-xl text-left w-[500px]">
                      <div style={{ borderBottomColor: '#f1f5f9', borderBottomWidth: '2px', borderBottomStyle: 'dashed' }} className="pb-3 mb-4 text-left">
                        <p style={{ color: '#2b3674' }} className="text-[10px] font-black uppercase tracking-[0.3em]">El Lingote Español</p>
                        <h4 style={{ color: '#1e293b' }} className="text-xl font-black uppercase italic leading-none mt-2">Orden de Compra</h4>
                        <p style={{ color: '#94a3b8' }} className="text-[8px] font-bold mt-1 uppercase italic">{new Date().toLocaleDateString()}</p>
                      </div>
                      <div className="space-y-2">
                          {listaCompras.map(item => (
                            <div key={item.nombre} style={{ backgroundColor: '#f8fafc' }} className="flex justify-between p-2 rounded-lg border border-gray-100">
                                <span style={{ color: '#64748b' }} className="text-[9px] font-black uppercase italic">{item.nombre}</span>
                                <span style={{ color: '#2b3674' }} className="text-sm font-black tabular-nums">{item.cantidad.toFixed(1)} {item.unidad}</span>
                            </div>
                          ))}
                      </div>
                      <div style={{ borderTopColor: '#f1f5f9', borderTopWidth: '2px', borderTopStyle: 'dashed' }} className="pt-4 mt-6 flex justify-between items-center bg-white">
                        <span style={{ color: '#1e293b' }} className="text-[10px] font-black italic uppercase tracking-widest">Total Estimado:</span>
                        <span style={{ color: '#2b3674' }} className="text-2xl font-black italic tabular-nums leading-none">₡{listaCompras.reduce((sum, item) => sum + item.costoEstimado, 0).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};
