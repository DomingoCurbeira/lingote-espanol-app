
import type { ProductoMenu } from '../types';

export const MENU_BEBIDAS: ProductoMenu[] = [
  { 
    id: 1, 
    nombre: "Fresco de Cas", 
    precio: 1400, 
    desc: "100% Natural (16oz)", 
    imagen: "cas.webp" ,
    disponible: true
  },
  { 
    id: 2, 
    nombre: "Mora en Leche", 
    precio: 1600, 
    desc: "Cremosa y dulce", 
    imagen: "mora.webp", 
    alergenos: ["🥛"],
    disponible: true 
  },
  { 
    id: 3, 
    nombre: "Chocolate", 
    precio: 1600, 
    desc: "Caliente", 
    imagen: "chocolate.webp", 
    alergenos: ["🥛"] ,
    disponible: true
  },
  { 
    id: 4, 
    nombre: "Agua Embotellada", 
    precio: 800, 
    desc: "Fría", 
    imagen: "agua.webp" ,
    disponible: true
  },
];