import { create } from "zustand";
import type { Product } from "../services/useProductsService";

type ProductsState = {
  currentPage: number;
  currentQuery: string;
  currentProducts: Product[];
  selectedProduct: Product | null;
  availableItemsCount: number;
  setParams: (page: number, query: string) => void;
  setProducts: (products: Product[]) => void;
  setSelectedProduct: (product: Product | null) => void;
  setAvailableItemsCount: (count: number) => void;
  resetAll: () => void;
};

export const useProductsStore = create<ProductsState>((set) => ({
  currentPage: 1,
  currentQuery: "",
  currentProducts: [],
  selectedProduct: null,
  availableItemsCount: 0,
  setParams: (page, query) =>
    set({ currentPage: page ? page : 1, currentQuery: query ? query : "" }),
  setProducts: (products) => set({ currentProducts: products }),
  setSelectedProduct: (product) => set({ selectedProduct: product }),
  resetAll: () => {
    set({
      currentPage: 1,
      currentQuery: "",
      currentProducts: [],
      selectedProduct: null,
      availableItemsCount: 0,
    });
  },
  setAvailableItemsCount: (count) => {
    set({ availableItemsCount: count });
  },
}));
