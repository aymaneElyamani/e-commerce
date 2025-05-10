import { create } from "zustand";
import { persist, PersistOptions } from "zustand/middleware";


// Cart store interface
interface AddToCartState {
  products: AddToCardType[];
  addProduct: (product: AddToCardType) => void;
  removeProduct: (id: string) => void;
  clearCart: () => void;
  updateQuantity: (id: string, quantity: number) => void;
}

// Zustand store with persistence
const useCartStore = create<AddToCartState>()(
  persist(
    (set, get) => ({
      products: [],
   
      addProduct: (product: AddToCardType) => {
        const existingProduct = get().products.find(p => p.idProduct == product.idProduct);
        if (existingProduct) {
          set({
            products: get().products.map(p =>
              p.idProduct == product.idProduct
                ? { ...p, quantity: p.quantity + product.quantity }
                : p
            ),
          });
        } else {
          set({ products: [...get().products, product] });
        }
      },

      removeProduct: (id: string) => {
        set({
          products: get().products.filter(p => p.idProduct != id),
        });
      },

      clearCart: () => {
        set({ products: [] });
      },

      updateQuantity: (id: string, quantity: number) => {
        set({
          products: get().products.map(p =>
            p.idProduct == id ? { ...p, quantity } : p
          ),
        });
      },
    }),
    {
      name: "addToCart-store",
      getStorage: () => localStorage,
    } as PersistOptions<AddToCartState>
  )
);

export default useCartStore;
