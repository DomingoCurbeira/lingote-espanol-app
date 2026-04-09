import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ItemCarrito } from '../types';

interface CartState {
  carrito: ItemCarrito[];
  addItem: (item: ItemCarrito) => void;
  removeItem: (idUnico: string) => void;
  updateCantidad: (idUnico: string, delta: number) => void;
  vaciarCarrito: () => void;
  getTotal: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      carrito: [],

      addItem: (item) => {
        set((state) => {
          // Si es un producto simple (sin extras) y ya está, sumamos cantidad
          const isSimple = item.extras.length === 0;
          const index = state.carrito.findIndex(i => 
            i.producto.id === item.producto.id && i.extras.length === 0
          );

          if (isSimple && index !== -1) {
            const nuevoCarrito = [...state.carrito];
            nuevoCarrito[index].cantidad += item.cantidad;
            return { carrito: nuevoCarrito };
          }

          // Si tiene extras o es nuevo, lo añadimos como item único
          return { carrito: [...state.carrito, item] };
        });
      },

      removeItem: (idUnico) => {
        set((state) => ({
          carrito: state.carrito.filter((i) => i.idUnico !== idUnico),
        }));
      },

      updateCantidad: (idUnico, delta) => {
        set((state) => ({
          carrito: state.carrito.map((i) =>
            i.idUnico === idUnico 
              ? { ...i, cantidad: Math.max(1, i.cantidad + delta) } 
              : i
          ),
        }));
      },

      vaciarCarrito: () => set({ carrito: [] }),

      getTotal: () => {
        const { carrito } = get();
        return carrito.reduce((acc, item) => acc + (item.precioTotal * item.cantidad), 0);
      },
    }),
    { name: 'lingote-cart-storage' } // Persistencia en localStorage
  )
);