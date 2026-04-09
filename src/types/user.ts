export interface Usuario {
  nombre: string;
  telefono: string;
  direccion?: string; // Opcional por si luego implementamos delivery en Desamparados
}