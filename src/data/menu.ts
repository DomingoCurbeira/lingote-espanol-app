import type { Lingote, Extra } from '../types';

export const EXTRAS_DISPONIBLES: Extra[] = [
  { id: 'ex-aguacate', nombre: 'Aguacate', precio: 600, disponible: true },
  { id: 'ex-cebolla', nombre: 'Cebolla Encurtida', precio: 500, disponible: true },
  { id: 'ex-natilla', nombre: 'Natilla', precio: 400, disponible: true },
  { id: 'ex-caribeña', nombre: 'Salsa Caribeña', precio: 500, disponible: true },
  { id: 'ex-alioli', nombre: 'Salsa Alioli', precio: 500, disponible: true },
  { id: 'ex-chipotle', nombre: 'Salsa Chipotle', precio: 500, disponible: true },
  { id: 'ex-mostaza', nombre: 'Salsa Mostaza-miel', precio: 500, disponible: true },
  { id: 'ex-pinto', nombre: 'Gallo Pinto', precio: 800, disponible: true },
  { id: 'ex-cerdo', nombre: 'Cerdo Mechado', precio: 1000, disponible: true },
  { id: 'ex-roxons', nombre: 'Chicharrón Español', precio: 1200, disponible: false },
];

export const MENU_LINGOTES: Lingote[] = [
  {
    id: 1,
    nombre: "Lingote Clásico",
    precio: 1700,
    descripcion: "La esencia de la tradición española. Nuestra tortilla artesanal, jugosa y dorada, servida sobre pan crujiente y coronada con el alioli casero que lo empezó todo.",
    imagen: "clasico.webp",
    ingredientesBase: ["Tortilla de Patatas", "Pan", "Alioli"],
    alergenos: ["🥚", "🌽"],
    disponible: true
    
  },
  {
    id: 2,
    nombre: "Lingote Tico",
    precio: 2000,
    descripcion: "El encuentro de dos mundos. El alma de nuestra tortilla española se abraza al sabor criollo del gallo pinto y la cremosidad inconfundible de la natilla tica.",
    imagen: "tico.webp",
    ingredientesBase: ["Tortilla de Patatas", "Gallo Pinto", "Natilla"],
    alergenos: ["🥚", "🥛"],
    disponible: true
    
  },
  {
    id: 3,
    nombre: "Lingote Patrón",
    precio: 2700,
    descripcion: "Para los que mandan en la mesa. Un lingote imponente cargado de cerdo mechado a fuego lento, la frescura del aguacate nacional y el toque vibrante de nuestra cebolla encurtida.",
    imagen: "patron.webp",
    ingredientesBase: ["Tortilla de Patatas", "Cerdo Mechado", "Aguacate", "Cebolla Encurtida"],
    alergenos: ["🥚"],
    disponible: true
  },
  // {
  //   id: 4,
  //   nombre: "Lingote Gallego",
  //   precio: 2700,
  //   descripcion: "Un viaje directo al norte de España con alma tropical. El crujiente y potente chicharrón gallego se fusiona con la intensidad picante de nuestra salsa caribeña.",
  //   imagen: "gallego.webp",
  //   ingredientesBase: ["Tortilla de Patatas", "Chicharrón Gallego", "Salsa Caribeña", "Pan"],
  //   alergenos: ["🥚"],
  //   disponible: true
  // },
  {
    id: 5,
    nombre: "Lingote Supremo",
    precio: 4000,
    descripcion: "La experiencia definitiva de fusión. Un festín donde no falta nada: gallo pinto, cerdo mechado, aguacate y natilla. Un homenaje total a la hermandad gastronómica.",
    imagen: "supremo.webp",
    ingredientesBase: ["Tortilla de Patatas", "Gallo Pinto", "Cerdo Mechado", "Aguacate", "Cebolla Encurtida"],
    alergenos: ["🥚"],
    disponible: true
  }
];