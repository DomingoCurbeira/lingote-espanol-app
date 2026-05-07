/**
 * CONFIGURACIÓN DE HORARIOS DEL LINGOTE ESPAÑOL
 * Aquí puedes modificar las horas de apertura, cierre y el margen de seguridad para pagos.
 */
export const CONFIG_HORARIO = {
  horaApertura: 8,       // 8:00 AM
  minutoApertura: 0,
  
  horaCierreLocal: 16,   // 4:00 PM (Cierre físico del local)
  minutoCierreLocal: 0,

  // Margen de minutos antes del cierre para dejar de recibir pedidos
  // Ejemplo: Si el local cierra a las 16:00 y el margen es 15, dejamos de recibir a las 15:45
  margenCierreMinutos: 15, 

  diasCerrado: [0], // 0 = Domingo
};

export const obtenerEstadoTienda = () => {
  const ahora = new Date();
  const diaSemana = ahora.getDay();
  const horaActual = ahora.getHours();
  const minutosActuales = ahora.getMinutes();

  const esDiaLaboral = !CONFIG_HORARIO.diasCerrado.includes(diaSemana);
  
  // Calculamos la hora de fin de pedidos (Cierre - Margen)
  const fechaCierrePedidos = new Date(ahora);
  fechaCierrePedidos.setHours(CONFIG_HORARIO.horaCierreLocal, CONFIG_HORARIO.minutoCierreLocal - CONFIG_HORARIO.margenCierreMinutos, 0);
  
  const horaFinPedidos = fechaCierrePedidos.getHours();
  const minutoFinPedidos = fechaCierrePedidos.getMinutes();

  // 1. Verificamos si ya abrió
  const yaAbrio = horaActual > CONFIG_HORARIO.horaApertura || 
                 (horaActual === CONFIG_HORARIO.horaApertura && minutosActuales >= CONFIG_HORARIO.minutoApertura);
                 
  // 2. Verificamos si ya cerró la recepción de pedidos
  const aunNoCierraPedidos = horaActual < horaFinPedidos || 
                            (horaActual === horaFinPedidos && minutosActuales < minutoFinPedidos);

  // 3. Verificamos si estamos en el "Margen de Cierre" (últimos 15 min de pedidos)
  // Útil para mostrar avisos de "Cierre inminente"
  const minutosTotalesActual = horaActual * 60 + minutosActuales;
  const minutosTotalesFin = horaFinPedidos * 60 + minutoFinPedidos;
  const esCierreInminente = yaAbrio && aunNoCierraPedidos && (minutosTotalesFin - minutosTotalesActual <= 15);

  return {
    estaAbierto: esDiaLaboral && yaAbrio && aunNoCierraPedidos,
    esCierreInminente,
    horarioTexto: `${CONFIG_HORARIO.horaApertura}:00 AM a ${CONFIG_HORARIO.horaCierreLocal}:00 PM`,
    horaLimitePedidos: `${horaFinPedidos}:${minutoFinPedidos.toString().padStart(2, '0')}`
  };
};

/**
 * Función simplificada para mantener compatibilidad con el resto de la app
 */
export const estaAbierto = () => obtenerEstadoTienda().estaAbierto;
