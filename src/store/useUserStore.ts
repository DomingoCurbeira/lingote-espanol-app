import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Usuario, PedidoHistorial } from '../types';

interface UserState {
  usuario: Usuario | null;
  historialPedidos: PedidoHistorial[];
  setUsuario: (user: Usuario) => void;
  borrarUsuario: () => void;
  agregarPedidoAlHistorial: (pedido: PedidoHistorial) => void;
  limpiarHistorial: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      usuario: null,
      historialPedidos: [],
      setUsuario: (user) => set({ usuario: user }),
      borrarUsuario: () => set({ usuario: null }),
      agregarPedidoAlHistorial: (pedido) => 
        set((state) => ({ 
          historialPedidos: [pedido, ...state.historialPedidos].slice(0, 10) // Guardamos los últimos 10
        })),
      limpiarHistorial: () => set({ historialPedidos: [] }),
    }),
    { name: 'lingote-user-profile-v2' }
  )
);
