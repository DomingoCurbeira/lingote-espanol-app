import type { ItemCarrito, Usuario, DatosPago } from '../types';

export const generarMensajeWhatsApp = (
  carrito: ItemCarrito[], 
  usuario: Usuario, 
  total: number, 
  pago: DatosPago,
  pedidoID: string 
) => {
  const fecha = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  let mensaje = `🥘 *NUEVO PEDIDO: #${pedidoID}*\n`;
  mensaje += `━━━━━━━━━━━━━━━━━━━━\n`;
  mensaje += `*EL LINGOTE ESPAÑOL*\n`;
  mensaje += `_Raíces Españolas, Corazón Tico_\n`;
  mensaje += `━━━━━━━━━━━━━━━━━━━━\n\n`;
  
  mensaje += `👤 *CLIENTE:* ${usuario.nombre.toUpperCase()}\n`;
  mensaje += `💳 *PAGO:* ${pago.metodo === 'sinpe' ? `📲 SINPE (Comp: ${pago.comprobante})` : '💵 EFECTIVO (En Caja)'}\n`;
  mensaje += `⏰ *HORA:* ${fecha}\n\n`;

  mensaje += `🛒 *DETALLE DEL PEDIDO:*\n`;
  mensaje += `────────────────────\n`;

  carrito.forEach((item) => {
    mensaje += `*${item.cantidad}x ${item.producto.nombre.toUpperCase()}*\n`;
    
    if (item.extras.length > 0) {
      mensaje += `   _Extras:_ ${item.extras.map(e => e.nombre).join(', ')}\n`;
    }
    
    mensaje += `   → ₡${(item.precioTotal * item.cantidad).toLocaleString()}\n\n`;
  });

  mensaje += `────────────────────\n`;
  mensaje += `💰 *TOTAL A PAGAR: ₡${total.toLocaleString()}*\n`;
  mensaje += `────────────────────\n\n`;
  
  mensaje += `¡Muchas gracias por su pedido! 🙏🥘\n`;
  mensaje += `*¡Olé y Pura Vida!*\n\n`;
  
  mensaje += `⚠️ *NOTA:* Recuerde retirar su pedido antes de las 4:00 PM.`;

  const mensajeEncoded = encodeURIComponent(mensaje);
  
  const miTelefono = "34639835391"; // Número Temporal de Pruebas (España)
  
  return `https://wa.me/${miTelefono}?text=${mensajeEncoded}`;
};
