import type { Lingote, Extra } from '../types';

/**
 * EXTRAS PARA EL "ARMÁ TU LINGOTE"
 * Organizados por categorías para el flujo paso a paso
 */
export const CATEGORIAS_PERSONALIZACION = {
  bases: [
    // { id: 'b-pan', nombre: 'Pan Crujiente', precio: 0, disponible: true },
    { id: 'b-pinto', nombre: 'Gallo Pinto', precio: 500, disponible: true },
  ],
  proteinas: [
    { id: 'p-cerdo', nombre: 'Cerdo Mechado', precio: 1000, disponible: true },
    // { id: 'p-chicharron', nombre: 'Chicharrón Español', precio: 1200, disponible: false },
    // { id: 'p-huevo', nombre: 'Huevo Frito', precio: 500, disponible: true },
  ],
  vegetales: [
    { id: 'v-aguacate', nombre: 'Aguacate', precio: 600, disponible: true },
    { id: 'v-cebolla', nombre: 'Cebolla Encurtida', precio: 500, disponible: true },
  ],
  salsas: [
    { id: 's-alioli', nombre: 'Salsa Alioli', precio: 0, disponible: true },
    { id: 's-natilla', nombre: 'Natilla', precio: 500, disponible: true },
    { id: 's-caribeña', nombre: 'Salsa Caribeña', precio: 500, disponible: true },
    { id: 's-chipotle', nombre: 'Salsa Chipotle', precio: 500, disponible: true },
    { id: 's-mostaza', nombre: 'Salsa Mostaza-miel', precio: 500, disponible: true },
  ]
};

// Mantenemos esto para compatibilidad si otros componentes lo usan
export const EXTRAS_DISPONIBLES: Extra[] = [
  ...CATEGORIAS_PERSONALIZACION.bases,
  ...CATEGORIAS_PERSONALIZACION.proteinas,
  ...CATEGORIAS_PERSONALIZACION.vegetales,
  ...CATEGORIAS_PERSONALIZACION.salsas,
];

export const MENU_LINGOTES: Lingote[] = [
  {
    id: 1,
    nombre: "Lingote Clásico",
    precio: 1300,
    descripcion: "La esencia de la tradición española. Nuestra tortilla artesanal, jugosa y dorada, servida sobre pan crujiente y coronada con el alioli casero que lo empezó todo.",
    imagen: "clasico.webp",
    ingredientesBase: ["Tortilla de Patatas", "Pan", "Alioli"],
    alergenos: ["🥚", "🌽"],
    disponible: true,
    personalizable: false 
  },
  {
    id: 2,
    nombre: "Lingote Tico",
    precio: 2000,
    descripcion: "El encuentro de dos mundos. El alma de nuestra tortilla española se abraza al sabor criollo del gallo pinto y la cremosidad inconfundible de la natilla tica.",
    imagen: "tico.webp",
    ingredientesBase: ["Tortilla de Patatas", "Gallo Pinto", "Natilla"],
    alergenos: ["🥚", "🥛"],
    disponible: true,
    personalizable:  false
  },
  {
    id: 3,
    nombre: "Lingote Patrón",
    precio: 3000,
    descripcion: "Para los que mandan en la mesa. Un lingote imponente cargado con 100g de cerdo mechado a fuego lento, la frescura del aguacate nacional y el toque vibrante de nuestra cebolla encurtida.",
    imagen: "patron.webp",
    ingredientesBase: ["Tortilla de Patatas", "Cerdo Mechado", "Aguacate", "Cebolla Encurtida"],
    alergenos: ["🥚"],
    disponible: true,
    personalizable: false 
  },
  {
    id: 5,
    nombre: "Lingote Supremo",
    precio: 4000,
    descripcion: "La experiencia definitiva de fusión. Un festín donde no falta nada: gallo pinto, 100g de cerdo mechado, aguacate y natilla. Un homenaje total a la hermandad gastronómica.",
    imagen: "supremo.webp",
    ingredientesBase: ["Tortilla de Patatas", "Gallo Pinto", "Cerdo Mechado", "Aguacate", "Cebolla Encurtida"],
    alergenos: ["🥚"],
    disponible: true,
    personalizable: false 
  },
  {
    id: 99,
    nombre: "Diseña tu Lingote",
    precio: 1500, // Precio base de la Tortilla sola
    descripcion: "¡Tu eres el chef! Partimos de nuestra base de Tortilla de Patatas y tu elijes los toppings que más te gusten.",
    imagen: "lingote_tortilla.webp", // Deberás añadir esta imagen o usar un placeholder
    ingredientesBase: ["Tortilla de Patatas"],
    alergenos: ["🥚"],
    disponible: true,
    personalizable: true // UNICA OPCIÓN PERSONALIZABLE
  }
];
