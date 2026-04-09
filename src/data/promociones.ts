import type { Promocion } from '../types/ProductoMenu';

export const MENU_PROMOCIONES: Promocion[] = [
  {
    id: 'PROMO-DUO',
    nombre: 'COMBO PAREJA REAL',
    precio: 11150,
    precioAnterior: 13150,
    ahorro: 2000,
    desc: '2 Lingotes a elegir + 2 Bebidas + 1 Torrijona.',
    imagen: 'promo-duo.webp',
    disponible: true,
  },
  {
    id: 'PROMO-SOLO',
    nombre: 'LINGOTE SINGLE XL',
    precio: 5000,
    precioAnterior: 6050,
    ahorro: 1000,
    desc: '1 Lingote Patrón + 1 Fresco de Cas + 1 Tentación.',
    imagen: 'promo-single.webp',
    disponible: true,
  }
];