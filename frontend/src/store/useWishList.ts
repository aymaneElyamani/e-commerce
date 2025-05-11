import { create } from "zustand";
import { persist, PersistOptions } from "zustand/middleware";

// Type for wishlist product (reuses AddToCardType, or define a separate type if needed)
interface WishlistState {
  wishlist: Product[];
  addToWishlist: (product: Product) => void;
  removeFromWishlist: (id: string) => void;
  clearWishlist: () => void;
}

const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      wishlist: [],

      addToWishlist: (product: Product) => {
        const exists = get().wishlist.some(p => p.id === product.id);
        if (!exists) {
          set({ wishlist: [...get().wishlist, product] });
        }
      },

      removeFromWishlist: (id: string) => {
        set({
          wishlist: get().wishlist.filter(p => p.id !== id),
        });
      },

      clearWishlist: () => {
        set({ wishlist: [] });
      },
    }),
    {
      name: "wishlist-store",
      getStorage: () => localStorage,
    } as PersistOptions<WishlistState>
  )
);

export default useWishlistStore;
