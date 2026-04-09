import type { ProductoMenu } from '../types/ProductoMenu';

export const MENU_POSTRES: ProductoMenu[] = [
  { 
    id: 30, 
    nombre: "La Torrijona", 
    precio: 1950, 
    desc: "Torrija de Dona con helado de vainilla", 
    imagen: "torrijona.webp", 
    alergenos: ["🥛", "🥚"], 
    disponible: true
  },
  { 
    id: 31, 
    nombre: "Mestizaje Caprichoso", 
    precio: 1950, 
    desc: "Triffle de cremoso de leche con cookies", 
    imagen: "tentacion.webp", 
    alergenos: ["🥛"],
    disponible: true
  }
];