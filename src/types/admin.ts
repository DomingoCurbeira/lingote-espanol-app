export interface Insumo {
  id: string;
  nombre: string;
  precio: number;
  unidad: string;
  categoria: string;
}

export interface IngredienteReceta {
  insumo_id: string;
  cantidad: number; // En la unidad del insumo (ej: 0.235 para 235g)
}

export interface Receta {
  id: string;
  nombre: string;
  categoria_tienda: 'lingotes' | 'bebidas' | 'postres' | 'salsas' | 'promociones';
  id_producto_tienda: string | number;
  ingredientes: IngredienteReceta[];
  packaging: IngredienteReceta[];
  merma_porcentaje: number;
}

export interface ResultadoCostos {
  nombre: string;
  costoInsumos: number;
  costoPackaging: number;
  costoDirecto: number;
  costoConMerma: number;
  margenSugerido: number;
}
