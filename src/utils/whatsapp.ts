import type { ItemCarrito, Usuario, DatosPago } from '../types';

export const generarMensajeWhatsApp = (
  carrito: ItemCarrito[], 
  usuario: Usuario, 
  total: number, 
  pago: DatosPago,
  pedidoID: string 
) => {
  const fecha = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  let mensaje = `============================\n`;
  mensaje += `    *ORDEN: #${pedidoID}*\n`;
  mensaje += `============================\n`;
  mensaje += `*EL LINGOTE ESPAÑOL*\n`;
  mensaje += `============================\n\n`;
  
  mensaje += `*CLIENTE:* ${usuario.nombre.toUpperCase()}\n`;
  mensaje += `*PAGO:* ${pago.metodo === 'sinpe' ? `SINPE (Comp: ${pago.comprobante})` : 'EFECTIVO (Paga en caja)'}\n`;
  mensaje += `*HORA:* ${fecha}\n\n`;

  mensaje += `*DETALLE DEL PEDIDO:*\n`;
  mensaje += `----------------------------\n`;

  carrito.forEach((item) => {
    mensaje += `> *${item.cantidad}x ${item.producto.nombre.toUpperCase()}*\n`;
    
    if (item.extras.length > 0) {
      item.extras.forEach(extra => {
        mensaje += `   + ${extra.nombre}\n`;
      });
    }
    
    mensaje += `  _₡${(item.precioTotal * item.cantidad).toLocaleString()}_\n\n`;
  });

  mensaje += `----------------------------\n`;
  mensaje += `*TOTAL A PAGAR: ₡${total.toLocaleString()}*\n`;
  mensaje += `----------------------------\n\n`;
  
  // Ajuste aquí: Añadimos espacio antes de la nota de cierre
  mensaje += `*¡Gracias Por Preferirnos!*\n`;
  mensaje += `============================\n`;
  mensaje += `      *FIN DE LA ORDEN*\n`;
  mensaje += `============================\n\n`; // Doble salto para separar la nota
  
  // Nota de horario destacada con un emoji para que no se pierda
  mensaje += `⚠️ *NOTA IMPORTANTE:*\n`;
  mensaje += `Recuerde que nuestro local cierra a las 4:00 PM. Por favor, pase por su pedido antes de esa hora. ¡Gracias!`;

  const mensajeEncoded = encodeURIComponent(mensaje);
  
  // Su número de WhatsApp (España por el prefijo 34, o cámbielo a 506 si es de CR)
  const miTelefono = "34639835391"; 
  
  return `https://wa.me/${miTelefono}?text=${mensajeEncoded}`;
};