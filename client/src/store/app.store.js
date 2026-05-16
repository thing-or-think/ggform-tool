import { create } from 'zustand'

export const useAppStore = create((set) => ({
    appName: 'GGForm Tool',
    setAppName: (appName) => set({ appName })
}))