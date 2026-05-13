import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface VentaRealizada {
  id: string;
  cliente?: string; // Nombre del cliente (opcional para walk-ins)
  items: { nombre: string; cantidad: number; precio: number }[];
  total: number;
  metodoPago: 'sinpe' | 'efectivo';
  fecha: string;
}

interface AdminState {
  pin: string;
  isAuthenticated: boolean;
  ventasDelDia: VentaRealizada[];
  
  // Acciones
  setAuthenticated: (status: boolean) => void;
  registrarVenta: (venta: VentaRealizada) => void;
  limpiarCaja: () => void;
}

export const useAdminStore = create<AdminState>()(
  persist(
    (set) => ({
      pin: '123456', // PIN por defecto (el usuario puede cambiarlo luego)
      isAuthenticated: false,
      ventasDelDia: [],
      
      setAuthenticated: (status) => set({ isAuthenticated: status }),
      
      registrarVenta: (venta) => 
        set((state) => ({ 
          ventasDelDia: [...state.ventasDelDia, venta] 
        })),
        
      limpiarCaja: () => set({ ventasDelDia: [] }),
    }),
    { name: 'lingote-admin-storage' }
  )
);
