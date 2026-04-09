import type { ItemCarrito, Usuario, DatosPago } from '../types';

export const generarMensajeWhatsApp = (
  carrito: ItemCarrito[], 
  usuario: Usuario, 
  total: number, 
  pago: DatosPago,
  pedidoID: string ) => {
  const fecha = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  
  // Generamos un ID corto de 4 dígitos para que cada pedido sea único visualmente
 

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
  mensaje += `*¡Gracias Por Preferirnos!*\n`;
  mensaje += `============================\n`;
  mensaje += `      *FIN DE LA ORDEN*\n`;
  mensaje += `============================`;

  const mensajeEncoded = encodeURIComponent(mensaje);
  
  // Tu número de WhatsApp (puedes ajustarlo después)
  const miTelefono = "34639835391"; 
  
  return `https://wa.me/${miTelefono}?text=${mensajeEncoded}`;
};