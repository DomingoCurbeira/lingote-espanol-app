import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface MenuState {
  // Guardamos un mapa de IDs "agotados" por categoría para evitar colisiones
  // Ejemplo: { lingotes: [1, 2], bebidas: [1] }
  agotados: {
    lingotes: number[];
    bebidas: number[];
    postres: number[];
    salsas: number[];
    promociones: string[];
  };
  
  toggleDisponibilidad: (categoria: keyof MenuState['agotados'], id: any) => void;
  estaDisponible: (categoria: keyof MenuState['agotados'], id: any) => boolean;
}

export const useMenuStore = create<MenuState>()(
  persist(
    (set, get) => ({
      agotados: {
        lingotes: [],
        bebidas: [],
        postres: [],
        salsas: [],
        promociones: []
      },

      toggleDisponibilidad: (categoria, id) => {
        set((state) => {
          const currentAgotados = state.agotados[categoria] as any[];
          const isAgotado = currentAgotados.includes(id);
          
          const newAgotados = isAgotado
            ? currentAgotados.filter(item => item !== id)
            : [...currentAgotados, id];
            
          return {
            agotados: {
              ...state.agotados,
              [categoria]: newAgotados
            }
          };
        });
      },

      estaDisponible: (categoria, id) => {
        const currentAgotados = get().agotados[categoria] as any[];
        return !currentAgotados.includes(id);
      }
    }),
    { name: 'lingote-menu-availability' }
  )
);
