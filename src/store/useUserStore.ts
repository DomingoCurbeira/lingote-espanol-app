import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Usuario } from '../types/user';

interface UserState {
  usuario: Usuario | null;
  setUsuario: (user: Usuario) => void;
  borrarUsuario: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      usuario: null,
      setUsuario: (user) => set({ usuario: user }),
      borrarUsuario: () => set({ usuario: null }),
    }),
    { name: 'lingote-user-profile' }
  )
);