import { create } from 'zustand'

type Theme = 'light' | 'dark'

type ThemeState = {
  theme: Theme
  toggleTheme: () => void
  setTheme: (theme: Theme) => void
}

const useTheme = create<ThemeState>((set) => ({
  theme: 'light',

  toggleTheme: () =>
    set((state) => ({
      theme: state.theme === 'light' ? 'dark' : 'light',
    })),

  setTheme: (theme) => set({ theme }),
}))

export default useTheme
