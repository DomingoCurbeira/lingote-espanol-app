export type Categoria = 'promociones' | 'lingotes' | 'combos' | 'bebidas' | 'postres';

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

export interface Extra {
  id: string;
  nombre: string;
  precio: number;
  disponible: boolean;
  descripcion?: string; // <--- AGREGÁ EL SIGNO DE PREGUNTA '?'
}

export interface Lingote {
  id: number;
  nombre: string;
  precioBase: number;
  descripcion: string;
  imagen: string;
  ingredientesBase: string[]; // Lo que siempre trae
  alergenos: string[];
   disponible?: boolean;
}

export interface ItemCarrito {
  idUnico: string;                   // Generado con crypto.randomUUID() para evitar duplicados
  producto: Lingote | ProductoMenu;  // Puede ser un lingote o un producto simple
  extras: Extra[];                   // Lista de extras añadidos (vacía para productos simples)
  cantidad: number;                  // Cuántas unidades de esta configuración específica
  precioTotal: number;               // El precio unitario calculado (Base + Extras)
}


export type MetodoPago = 'sinpe' | 'efectivo';

export interface DatosPago {
  metodo: MetodoPago;
  comprobante?: string; // Los 4 dígitos para SINPE
}

export interface Usuario {
  nombre: string;
  telefono: string;
  direccion?: string; // Opcional por si luego implementamos delivery en Desamparados
}