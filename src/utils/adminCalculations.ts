import type { Insumo, Receta, ResultadoCostos } from '../types/admin';

/**
 * Calcula el costo total de una receta basado en los precios actuales de los insumos.
 */
export const calcularCostoReceta = (
  receta: Receta,
  todosLosInsumos: Insumo[]
): ResultadoCostos => {
  const findInsumo = (id: string) => todosLosInsumos.find(i => i.id === id);

  const costoInsumos = receta.ingredientes.reduce((total, ing) => {
    const insumo = findInsumo(ing.insumo_id);
    return total + (insumo ? insumo.precio * ing.cantidad : 0);
  }, 0);

  const costoPackaging = receta.packaging.reduce((total, pack) => {
    const insumo = findInsumo(pack.insumo_id);
    return total + (insumo ? insumo.precio * pack.cantidad : 0);
  }, 0);

  const costoDirecto = costoInsumos + costoPackaging;
  const costoConMerma = costoDirecto * (1 + receta.merma_porcentaje / 100);

  return {
    nombre: receta.nombre,
    costoInsumos,
    costoPackaging,
    costoDirecto,
    costoConMerma,
    margenSugerido: 0 // Se calculará comparando con el precio de venta real
  };
};

/**
 * Genera una lista de compras consolidada para una producción planeada.
 */
export const generarListaCompras = (
  planeacion: { recetaId: string; cantidad: number }[],
  recetas: Receta[],
  insumos: Insumo[]
) => {
  const totales: { [insumoId: string]: number } = {};

  planeacion.forEach(p => {
    const receta = recetas.find(r => r.id === p.recetaId);
    if (!receta) return;

    [...receta.ingredientes, ...receta.packaging].forEach(i => {
      totales[i.insumo_id] = (totales[i.insumo_id] || 0) + (i.cantidad * p.cantidad);
    });
  });

  return Object.keys(totales).map(id => {
    const insumo = insumos.find(i => i.id === id);
    return {
      nombre: insumo?.nombre || 'Desconocido',
      cantidad: totales[id],
      unidad: insumo?.unidad || '',
      costoEstimado: (insumo?.precio || 0) * totales[id]
    };
  });
};
