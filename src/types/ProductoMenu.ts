// src/types/ProductoMenu.ts o dentro de src/types/index.ts

export interface ProductoMenu {
  id: number;           // Identificador único numérico (ej: 1, 2, 30)
  nombre: string;       // Nombre del producto (ej: "Fresco de Cas")
  precio: number;       // Precio en Colones (ej: 1400)
  desc: string;         // Descripción corta o detalles (ej: "100% Natural")
  imagen: string;       // Nombre del archivo en /public (ej: "cas.webp")
  disponible: boolean;  // Estado para el sello de "Agotado"
  
  // Campos opcionales (Usamos '?' porque no todos los productos los tienen)
  alergenos?: string[]; // Lista de emojis o nombres (ej: ["🥛", "🥚"])
  ahorro?: number;      // Monto de descuento, usado principalmente en COMBOS
}

// Creamos la interfaz específica para Promociones
// Usamos 'Omit' para cambiar el tipo de 'id' de number a string
export type Promocion = Omit<ProductoMenu, 'id'> & {
  id: string; // Aquí forzamos que el ID sea string
  precioAnterior?: number;
  esTemporal?: boolean;
};