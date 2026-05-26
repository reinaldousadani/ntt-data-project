import { create } from "zustand";
import type { Product } from "../services/useProductsService";

type ProductsState = {
  currentPage: number;
  currentQuery: string;
  currentProducts: Product[];
  selectedProduct: Product | null;
  availableItemsCount: number;
  mockAddedProducts: Record<string, Product>; // dummyjson will not actually add new product. Key will be "id"
  mockUpdatedProducts: Record<string, Product>; // dummyjson will not actually update existing product. Key will be "id"
  mockDeletedProducts: Record<string, Product>; // dummyjson will not actually delete existing product. Key will be "id"
  setParams: (page: number, query: string) => void;
  setProducts: (products: Product[]) => void;
  setSelectedProduct: (product: Product | null) => void;
  addMockProduct: (product: Product) => void;
  editMockProduct: (product: Product) => void;
  deleteMockProduct: (product: Product) => void;
  setAvailableItemsCount: (count: number) => void;
  resetAll: () => void;
};

export const useProductsStore = create<ProductsState>((set) => ({
  currentPage: 1,
  currentQuery: "",
  currentProducts: [],
  selectedProduct: null,
  availableItemsCount: 0,
  mockAddedProducts: {},
  mockUpdatedProducts: {},
  mockDeletedProducts: {},
  setParams: (page, query) =>
    set({ currentPage: page ? page : 1, currentQuery: query ? query : "" }),
  setProducts: (products) => set({ currentProducts: products }),
  setSelectedProduct: (product) => set({ selectedProduct: product }),
  addMockProduct: (product) =>
    set((state) => ({
      mockAddedProducts: { ...state.mockAddedProducts, [product.id]: product },
    })),
  editMockProduct: (product) =>
    set((state) => ({
      mockUpdatedProducts: {
        ...state.mockUpdatedProducts,
        [product.id]: product,
      },
    })),
  deleteMockProduct: (product) =>
    set((state) => ({
      mockDeletedProducts: {
        ...state.mockDeletedProducts,
        [product.id]: product,
      },
    })),
  resetAll: () => {
    set({
      currentPage: 1,
      currentQuery: "",
      currentProducts: [],
      selectedProduct: null,
      availableItemsCount: 0,
      mockAddedProducts: {},
      mockUpdatedProducts: {},
      mockDeletedProducts: {},
    });
  },
  setAvailableItemsCount: (count) => {
    set({ availableItemsCount: count });
  },
}));
