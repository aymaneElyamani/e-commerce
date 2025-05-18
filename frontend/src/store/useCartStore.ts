import { create } from "zustand";
import { persist, PersistOptions } from "zustand/middleware";

// Cart store
interface AddToCartState {
  products: AddToCardType[];
  nextIdCart: number;
  addProduct: (product: Omit<AddToCardType, "idCart">) => void;
  removeProduct: (idCart: number) => void;
  clearCart: () => void;
  updateProduct: (
  idCart: number,
  updatedFields: Partial<Omit<AddToCardType, 'idCart'>>
) => void;
}

// Zustand store with auto-increment idCart
const useCartStore = create<AddToCartState>()(
  persist(
    (set, get) => ({
      products: [],
      nextIdCart: 1, // Start from 1

      addProduct: (product) => {
        const existingProduct = get().products.find(
          p =>
            p.idProduct === product.idProduct &&
            p.color === product.color &&
            p.size === product.size
        );

        if (existingProduct) {
          set({
            products: get().products.map(p =>
              p.idProduct === product.idProduct &&
              p.color === product.color &&
              p.size === product.size
                ? { ...p, quantity: p.quantity + product.quantity }
                : p
            ),
          });
        } else {
          const idCart = get().nextIdCart;
          const newProduct: AddToCardType = { ...product, idCart };
          set({
            products: [...get().products, newProduct],
            nextIdCart: idCart + 1,
          });
        }
      },

      removeProduct: (idCart) => {
        set({
          products: get().products.filter(p => p.idCart !== idCart),
        });
      },

      clearCart: () => {
        set({ products: [], nextIdCart: 1 });
      },

updateProduct: (idCart, updatedFields: Partial<Omit<AddToCardType, 'idCart'>>) => {
  set({
    products: get().products.map(p =>
      p.idCart === idCart ? { ...p, ...updatedFields } : p
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
