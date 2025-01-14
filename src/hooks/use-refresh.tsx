import { create } from 'zustand'

export const useRefresh = create<Watcher>()((set) => ({
  watch: 1,
  refresh: () => set((state) => ({ watch: state.watch + 1 })),
}))
