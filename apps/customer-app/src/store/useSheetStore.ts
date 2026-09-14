import { create } from 'zustand';

export type SheetKind = 'insights' | 'alert' | 'scan' | 'detail' | 'connection';

export interface SheetStateData {
  kind: SheetKind;
  title?: string;
}

interface SheetStoreState {
  sheet: SheetStateData | null;
  openSheet: (sheet: SheetStateData) => void;
  openDetail: (title: string) => void;
  closeSheet: () => void;
}

export const useSheetStore = create<SheetStoreState>((set) => ({
  sheet: null,
  openSheet: (sheet) => set({ sheet }),
  openDetail: (title) => set({ sheet: { kind: 'detail', title } }),
  closeSheet: () => set({ sheet: null }),
}));
