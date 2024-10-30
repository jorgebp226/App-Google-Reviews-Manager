import { create } from 'zustand'

export const useAuthStore = create((set) => ({
  isAuthenticated: false,
  user: null,
  setAuth: (isAuth, userData = null) => set({ 
    isAuthenticated: isAuth, 
    user: userData 
  }),
}));