import { create } from "zustand";
import { persist, PersistOptions } from "zustand/middleware";


interface AuthState {
  token: string | null;
  isAuthenticated: boolean;
  user: User | null;
  loginSuccess: (token: string, user: User) => void;
  logout: () => void;
  setProfile: (user: User) => void;
}

const useAuthStore = create(
  persist(
    (set) => ({
      token: null,
      isAuthenticated: false,
      user: null,

      // Login success, set token, user, and authentication status
      loginSuccess: (token: string, user: User) => {
        set({ token, user, isAuthenticated: true });
      },

      // Logout, reset all values and remove token from localStorage
      logout: () => {
        set({ token: null, user: null, isAuthenticated: false });
      },

      // Set the user in the store and mark as authenticated
      setProfile: (user: User) => {
        set({ user, isAuthenticated: true });
      },
    }),
    {
      name: "auth-store", // Unique name for the localStorage key
      getStorage: () => localStorage, // Use localStorage for persistence
    } as PersistOptions<AuthState> // Explicitly cast the options to the correct type
  )
);

export default useAuthStore;
