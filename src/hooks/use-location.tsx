import { create } from 'zustand'

export const useLocation = create<CurrentMap>()((set) => ({
  location: { province: '', positive: 0, negative: 0, ratio: 0 },
  setLocation: (location) => set(() => ({ location })),
}))
