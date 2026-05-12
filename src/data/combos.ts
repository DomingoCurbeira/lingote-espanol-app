import type { ProductoMenu } from '../types';

export const MENU_COMBOS: ProductoMenu[] = [
  { id: 1, nombre: "Clásico PRO Mora", precio: 2500, desc: "Lingote Clásico + Mora con Leche", alergenos: ["🥚", "🌽", "🥛"], ahorro: 400, imagen: "", disponible: true },
  { id: 2, nombre: "Clásico PRO Choco", precio: 2500, desc: "Lingote Clásico + Chocolate Caliente", alergenos: ["🥚", "🌽", "🥛"], ahorro: 400 , imagen: "", disponible: true },
  { id: 3, nombre: "Tico PRO Mora", precio: 3200, desc: "Lingote Tico + Mora con Leche", alergenos: ["🥚", "🥛"], ahorro: 400, imagen: "", disponible: true  },
  { id: 4, nombre: "Tico PRO Choco", precio: 3200, desc: "Lingote Tico + Chocolate Caliente", alergenos: ["🥚", "🥛"], ahorro: 400 , imagen: "", disponible: true },
  { id: 5, nombre: "Patrón PRO Mora", precio: 4200, desc: "Lingote Patrón + Mora con Leche", alergenos: ["🥚", "🥛"], ahorro: 400 , imagen: "", disponible: true },
  { id: 6, nombre: "Patrón PRO Choco", precio: 4200, desc: "Lingote Patrón + Chocolate Caliente", alergenos: ["🥚", "🥛"], ahorro: 400 , imagen: "", disponible: true },
  { id: 7, nombre: "Supremo PRO Mora", precio: 5200, desc: "La Bestia + Mora con Leche", alergenos: ["🥚", "🥛", "🌽"], ahorro: 400 , imagen: "", disponible: true },
  { id: 8, nombre: "Supremo PRO Choco", precio: 5200, desc: "La Bestia + Chocolate Caliente", alergenos: ["🥚", "🥛", "🌽"], ahorro: 400 , imagen: "", disponible: true },
  { id: 9, nombre: "Combo Clásico", precio: 2400, desc: "Lingote Clásico + Fresco Cas", alergenos: ["🥚", "🌽"], ahorro: 300 , imagen: "", disponible: true },
  { id: 10, nombre: "Combo Tico", precio: 3000, desc: "Lingote Tico + Fresco Cas", alergenos: ["🥚", "🥛"], ahorro: 400 , imagen: "", disponible: true },
  { id: 11, nombre: "Combo Patrón", precio: 4000, desc: "Lingote Patrón + Fresco Cas", alergenos: ["🥚"], ahorro: 400 , imagen: "", disponible: true },
  { id: 12, nombre: "Combo Supremo", precio: 5000, desc: "La Bestia + Fresco Cas", alergenos: ["🥚", "🥛"], ahorro: 400, imagen: "combo supremo + cas.webp", disponible: true  },
];
