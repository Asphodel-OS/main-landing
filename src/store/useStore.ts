import { create } from 'zustand';
import * as THREE from 'three';

interface AnnotationData {
  id: string;
  x: number;
  y: number;
  visible: boolean;
}

interface AppState {
  scrollOffset: number;
  setScrollOffset: (offset: number) => void;
  annotations: Record<string, AnnotationData>;
  updateAnnotation: (id: string, data: Partial<AnnotationData>) => void;
}

export const useStore = create<AppState>((set) => ({
  scrollOffset: 0,
  setScrollOffset: (offset) => set({ scrollOffset: offset }),
  annotations: {},
  updateAnnotation: (id, data) => 
    set((state) => ({
      annotations: {
        ...state.annotations,
        [id]: { ...state.annotations[id], ...data, id }
      }
    })),
}));
