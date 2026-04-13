export const HORARIO_SERVICIO = {
  inicioHora: 10,
  inicioMinuto: 0,
  finHora: 15,    // Las 3 PM
  finMinuto: 45,  // y 45 minutos
  diasCerrado: [0], 
};

export const estaAbierto = () => {
  const ahora = new Date();
  const diaSemana = ahora.getDay();
  const horaActual = ahora.getHours();
  const minutosActuales = ahora.getMinutes();

  const esDiaLaboral = !HORARIO_SERVICIO.diasCerrado.includes(diaSemana);
  
  // Lógica: Estamos abiertos si...
  // Ya pasaron las 10:00 AM
  const yaAbrio = horaActual > HORARIO_SERVICIO.inicioHora || 
                 (horaActual === HORARIO_SERVICIO.inicioHora && minutosActuales >= HORARIO_SERVICIO.inicioMinuto);
                 
  // Y todavía no son las 3:45 PM
  const aunNoCierra = horaActual < HORARIO_SERVICIO.finHora || 
                     (horaActual === HORARIO_SERVICIO.finHora && minutosActuales < HORARIO_SERVICIO.finMinuto);

  return esDiaLaboral && yaAbrio && aunNoCierra;
};