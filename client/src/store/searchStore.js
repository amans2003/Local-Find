import { create } from 'zustand';

const useSearchStore = create((set) => ({
  city: '',
  category: '',
  subCategory: '',
  subLocation: '',
  q: '',
  setSearch: (params) => set((state) => ({ ...state, ...params })),
  reset: () => set({ city: '', category: '', subCategory: '', subLocation: '', q: '' }),
}));

export default useSearchStore;
