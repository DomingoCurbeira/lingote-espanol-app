import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface VentaRealizada {
  id: string;
  cliente?: string; 
  items: { nombre: string; cantidad: number; precio: number }[];
  total: number;
  metodoPago: 'sinpe' | 'efectivo';
  fecha: string;
  confirmada?: boolean; // Para verificar pagos SINPE
}

interface AdminState {
  pin: string;
  isAuthenticated: boolean;
  ventasDelDia: VentaRealizada[];

  // Acciones
  setAuthenticated: (status: boolean) => void;
  actualizarPin: (nuevoPin: string) => void;
  confirmarPago: (id: string) => void;
  registrarVenta: (venta: VentaRealizada) => void;
  limpiarCaja: () => void;
}

export const useAdminStore = create<AdminState>()(
  persist(
    (set) => ({
      pin: '123456', 
      isAuthenticated: false,
      ventasDelDia: [],

      setAuthenticated: (status) => set({ isAuthenticated: status }),

      actualizarPin: (nuevoPin) => set({ pin: nuevoPin }),

      confirmarPago: (id) => set((state) => ({
        ventasDelDia: state.ventasDelDia.map(v => 
          v.id === id ? { ...v, confirmada: true } : v
        )
      })),

      registrarVenta: (venta) => 
        set((state) => ({ 
          ventasDelDia: [...state.ventasDelDia, { ...venta, confirmada: venta.metodoPago === 'efectivo' }] 
        })),

        
      limpiarCaja: () => set({ ventasDelDia: [] }),
    }),
    { name: 'lingote-admin-storage' }
  )
);
