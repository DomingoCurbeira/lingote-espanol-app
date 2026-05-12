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
    desc: "Refrescante Triffle de 10oz: Capas de galleta María crujiente y cremoso artesanal de limón. El cierre perfecto para tu paladar.", 
    imagen: "trifle.webp", 
    alergenos: ["🥛"],
    disponible: true
  },
  { 
    id: 32, 
    nombre: "Lingote Vasco", 
    precio: 3000, 
    desc: "Tarta de Queso Vasca, Tipica Española", 
    imagen: "vasca.webp", 
    alergenos: ["🥛"],
    disponible: true
  }
];