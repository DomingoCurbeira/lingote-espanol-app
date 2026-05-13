import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Usuario, PedidoHistorial } from '../types';

interface UserState {
  usuario: Usuario | null;
  historialPedidos: PedidoHistorial[];
  sellos: number; // Nueva propiedad para la tarjeta de fidelización
  setUsuario: (user: Usuario) => void;
  borrarUsuario: () => void;
  agregarPedidoAlHistorial: (pedido: PedidoHistorial) => void;
  agregarSellos: (cantidad: number) => void;
  limpiarHistorial: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      usuario: null,
      historialPedidos: [],
      sellos: 0,
      setUsuario: (user) => set({ usuario: user }),
      borrarUsuario: () => set({ usuario: null }),
      agregarPedidoAlHistorial: (pedido) => 
        set((state) => ({ 
          historialPedidos: [pedido, ...state.historialPedidos].slice(0, 10) // Guardamos los últimos 10
        })),
      agregarSellos: (cantidad) => set((state) => ({ sellos: (state.sellos + cantidad) % 10 })),
      limpiarHistorial: () => set({ historialPedidos: [] }),
    }),
    { name: 'lingote-user-profile-v2' }
  )
);
