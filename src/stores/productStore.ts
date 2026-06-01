import { create } from 'zustand';
import type { Product } from '@/types';
import { getProducts, setProducts } from '@/utils/storage';
import { DEFAULT_PRODUCTS } from '@/utils/constants';
import { useAppStore } from './appStore';

interface ProductState {
  products: Product[];

  loadProducts: () => void;
  addProduct: (product: Omit<Product, 'id' | 'createdAt'>) => void;
  updateProduct: (id: string, data: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
}

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
}

export const useProductStore = create<ProductState>((set, get) => ({
  products: [],

  loadProducts: () => {
    let list = getProducts() as Product[];
    if (list.length === 0) {
      list = DEFAULT_PRODUCTS.map((p) => ({
        ...p,
        id: generateId(),
        createdAt: new Date().toISOString(),
      }));
      setProducts(list);
    }
    set({ products: list });
  },

  addProduct: (product) => {
    const newProduct: Product = {
      ...product,
      id: generateId(),
      createdAt: new Date().toISOString(),
    };
    const updated = [...get().products, newProduct];
    setProducts(updated);
    set({ products: updated });
    useAppStore.getState().showToast('添加商品成功', 'success');
  },

  updateProduct: (id, data) => {
    const updated = get().products.map((p) => (p.id === id ? { ...p, ...data } : p));
    setProducts(updated);
    set({ products: updated });
    useAppStore.getState().showToast('更新成功', 'success');
  },

  deleteProduct: (id) => {
    const updated = get().products.filter((p) => p.id !== id);
    setProducts(updated);
    set({ products: updated });
    useAppStore.getState().showToast('删除成功', 'success');
  },
}));
