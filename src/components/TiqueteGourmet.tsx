
import { Printer, RefreshCw, Download } from 'lucide-react';
import html2canvas from 'html2canvas';
import { mostrarToast } from '../utils/alerts';
import type { ItemCarrito, Usuario, DatosPago } from '../types';

interface Props {
  pedido: {
    id: string;
    items: ItemCarrito[];
    usuario: Usuario;
    pago: DatosPago;
    total: number;
    fecha: string;
  };
  onNuevoPedido: () => void;
}

export const TiqueteGourmet = ({ pedido, onNuevoPedido }: Props) => {
  
  const imprimirTiquete = () => {
    window.print();
  };

  const descargarTiquete = async () => {
    const element = document.getElementById('seccion-tiquete');
    if (!element) return;

    // Pequeño delay para asegurar que el DOM esté listo y las imágenes cargadas
    await new Promise(resolve => setTimeout(resolve, 500));

    try {
      const canvas = await html2canvas(element, {
        backgroundColor: '#ffffff',
        scale: 2, // Reducimos un poco el scale para evitar saturación de memoria en móviles
        logging: true, // Habilitamos logging para ver errores en consola
        useCORS: true,
        allowTaint: true,
        scrollX: 0,
        scrollY: -window.scrollY, // Corregir posición si hay scroll
        onclone: (clonedDoc) => {
          // Aseguramos que el elemento clonado sea visible para la captura
          const el = clonedDoc.getElementById('seccion-tiquete');
          if (el) el.style.boxShadow = 'none';
        }
      });
      
      const dataUrl = canvas.toDataURL('image/png');
      
      // Método alternativo de descarga para móviles/PWA
      const link = document.createElement('a');
      link.setAttribute('href', dataUrl);
      link.setAttribute('download', `Tiquete_Lingote_${pedido.id}.png`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      mostrarToast('Tiquete guardado 📸');
    } catch (error) {
      console.error('Error al generar tiquete:', error);
      mostrarToast('Error al procesar imagen ❌');
    }
  };

  return (
    <div className="flex flex-col items-center p-4 w-full max-w-sm mx-auto">
      
      {/* Estilos específicos para que al imprimir SOLO salga el tiquete */}
      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          body * { visibility: hidden; }
          #seccion-tiquete, #seccion-tiquete * { visibility: visible; }
          #seccion-tiquete { 
            position: absolute; 
            left: 0; 
            top: 0; 
            width: 100%;
            margin: 0;
            padding: 20px;
          }
          .no-print { display: none !important; }
        }
      `}} />

      {/* EL TIQUETE VISUAL */}
      <div 
        id="seccion-tiquete"
        className="bg-white p-8 shadow-xl w-full border border-gray-100 rounded-sm"
        style={{ fontFamily: "'Courier New', Courier, monospace" }}
      >
        <div className="flex flex-col items-center mb-4 text-center">
          <img 
            src="/logo_lingote_oficial_ligero.webp" 
            alt="Logo" 
            crossOrigin="anonymous"
            className="w-24 h-24 object-contain mb-2" 
          />
          <h2 className="font-bold text-lg uppercase tracking-tight">El Lingote Español</h2>
          <p className="text-[10px] uppercase">San Rafael de Oreamuno, Cartago</p>
          <div className="w-full border-b border-dashed border-gray-400 my-3" />
          <p className="font-bold text-sm italic">ORDEN: #{pedido.id}</p>
          <div className="w-full border-b border-dashed border-gray-400 mt-3" />
        </div>

        <div className="text-[11px] space-y-1 mb-4">
          <p>FECHA: {pedido.fecha}</p>
          <p>CLIENTE: {pedido.usuario.nombre.toUpperCase()}</p>
          <p>PAGO: {pedido.pago.metodo.toUpperCase()}</p>
          {pedido.pago.comprobante && <p>COMPROBANTE: {pedido.pago.comprobante}</p>}
        </div>

        <div className="space-y-3 mb-4">
          {pedido.items.map((item, index) => (
            <div key={index} className="text-[12px]">
              <div className="flex justify-between font-bold">
                <span>{item.cantidad}x {item.producto.nombre.toUpperCase()}</span>
                <span>₡{(item.precioTotal * item.cantidad).toLocaleString()}</span>
              </div>
              {item.extras.map((extra, i) => (
                <p key={i} className="text-[10px] text-gray-500 ml-4">+ {extra.nombre}</p>
              ))}
            </div>
          ))}
        </div>

        <div className="w-full border-b border-dashed border-gray-400 mb-4" />

        <div className="flex justify-between items-center py-2 bg-gray-50 px-2">
          <span className="font-bold text-sm uppercase">Total:</span>
          <span className="font-black text-xl italic">
            ₡{pedido.total.toLocaleString()}
          </span>
        </div>

        <div className="mt-8 text-center">
          <p className="text-[10px] font-bold italic tracking-widest uppercase">¡Gracias por su compra!</p>
          <p className="text-[9px] mt-1 italic">Pura Vida, Olé</p>
          <div className="mt-4 h-6 w-full bg-[repeating-linear-gradient(90deg,#000,#000_1px,#fff_1px,#fff_3px)] opacity-10" />
        </div>

        {/* Dentro de TiqueteGourmet.tsx */}
        <div className="text-center mt-4 border-t border-dashed border-gray-200 pt-4">
        <p className="text-[10px] font-bold uppercase">📍 Dirección:</p>
        <p className="text-[10px]">200m Este de la Iglesia, San Rafael de Oreamuno</p>
        <p className="text-[10px] font-bold uppercase mt-2">⏰ Horario:</p>
        <p className="text-[10px]">Lun-Sab: 10:00 PM - 16:00 PM</p>
        </div>
      </div>

      {/* BOTONES DE ACCIÓN (Ocultos al imprimir) */}
      <div className="grid grid-cols-1 w-full gap-3 mt-8 no-print">
        <button 
          onClick={descargarTiquete}
          className="flex items-center justify-center gap-2 bg-lingote-gold text-lingote-dark py-4 rounded-2xl font-black uppercase italic shadow-lg active:scale-95 transition-all"
        >
          <Download size={20} /> Guardar Imagen 📸
        </button>
        <button 
          onClick={imprimirTiquete}
          className="flex items-center justify-center gap-2 bg-lingote-blue text-white py-4 rounded-2xl font-black uppercase italic shadow-lg active:scale-95 transition-all"
        >
          <Printer size={20} /> Imprimir Tiquete
        </button>
        <button 
          onClick={onNuevoPedido}
          className="flex items-center justify-center gap-2 bg-white text-lingote-blue border-2 border-lingote-blue py-4 rounded-2xl font-black uppercase italic active:scale-95 transition-all"
        >
          <RefreshCw size={20} /> Nuevo Pedido
        </button>
      </div>
    </div>
  );
};