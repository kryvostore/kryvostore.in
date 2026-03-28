import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { ShopifyProduct } from '@/lib/shopify';

export interface FavoriteItem {
  product: ShopifyProduct;
  variantId: string;
  addedAt: number;
}

interface FavoritesStore {
  items: FavoriteItem[];
  addItem: (product: ShopifyProduct, variantId: string) => void;
  removeItem: (variantId: string) => void;
  clearFavorites: () => void;
  isFavorite: (variantId: string) => boolean;
}

export const useFavoritesStore = create<FavoritesStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product, variantId) => {
        const { items } = get();
        if (!items.find(i => i.variantId === variantId)) {
          set({ items: [...items, { product, variantId, addedAt: Date.now() }] });
        }
      },

      removeItem: (variantId) => {
        const { items } = get();
        set({ items: items.filter(i => i.variantId !== variantId) });
      },

      clearFavorites: () => set({ items: [] }),

      isFavorite: (variantId) => {
        const { items } = get();
        return !!items.find(i => i.variantId === variantId);
      }
    }),
    {
      name: 'shopify-favorites',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
