import create from "zustand";
import GlobalState from "./global.types";

export const useGlobalStates = create<GlobalState>((set) => ({
  default: false,
  visibleCollectionIndex: 0,
  setVisibleCollectionIndex: (index: number) =>
    set((state) => ({ ...state, visibleCollectionIndex: index })),
}));
