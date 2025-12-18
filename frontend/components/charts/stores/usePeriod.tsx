import { create } from "zustand";

interface SidebarStore {
  period: string;
  setPeriod: (period: string) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}
export const usePreriod = create<SidebarStore>((set) => ({
  period: "7d",
  setPeriod: (period) => set({ period: period }),
  activeTab: "this",
  setActiveTab: (tab) => set({ activeTab: tab }),
}));

// can
