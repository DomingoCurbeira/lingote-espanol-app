export type Categoria = 'promociones' | 'lingotes' | 'combos' | 'bebidas' | 'postres';

export interface ProductoMenu {
  id: number;
  nombre: string;
  precio: number;
  desc: string;
  imagen: string;
  disponible: boolean;
  alergenos?: string[];
  ahorro?: number;
}

export interface Extra {
  id: string;
  nombre: string;
  precio: number;
  disponible: boolean;
  descripcion?: string;
  categoria?: 'base' | 'proteina' | 'vegetal' | 'salsa'; // Para el flujo paso a paso
}

export interface Lingote {
  id: number;
  nombre: string;
  precio: number;
  descripcion: string;
  imagen: string;
  ingredientesBase: string[];
  alergenos: string[];
  disponible: boolean;
  personalizable: boolean; // Indica si permite abrir el modal de personalización
}

export interface ItemCarrito {
  idUnico: string;
  producto: Lingote | ProductoMenu;
  extras: Extra[];
  cantidad: number;
  precioTotal: number;
}

export type MetodoPago = 'sinpe' | 'efectivo';

export interface DatosPago {
  metodo: MetodoPago;
  comprobante?: string;
}

export interface Usuario {
  nombre: string;
  telefono: string;
  direccion?: string;
}

// [NUEVO] Tipo para representar un pedido en el historial
export interface PedidoHistorial {
  id: string;
  items: ItemCarrito[];
  total: number;
  fecha: string; // ISO String
  metodoPago: MetodoPago;
}
