import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Usuario, PedidoHistorial } from '../types';

interface UserState {
  usuario: Usuario | null;
  historialPedidos: PedidoHistorial[];
  ultimoPedido: any | null; // [NUEVO] Para persistir el tiquete visual
  sellos: number;
  setUsuario: (user: Usuario) => void;
  borrarUsuario: () => void;
  agregarPedidoAlHistorial: (pedido: PedidoHistorial) => void;
  setUltimoPedido: (pedido: any) => void;
  limpiarUltimoPedido: () => void;
  agregarSellos: (cantidad: number) => void;
  limpiarHistorial: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      usuario: null,
      historialPedidos: [],
      ultimoPedido: null,
      sellos: 0,
      setUsuario: (user) => set({ usuario: user }),
      borrarUsuario: () => set({ usuario: null }),
      setUltimoPedido: (pedido) => set({ ultimoPedido: pedido }),
      limpiarUltimoPedido: () => set({ ultimoPedido: null }),
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
