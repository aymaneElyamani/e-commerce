// features/authSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  token: string | null;
  isAuthenticated: boolean;
  email: string | null;
}

const initialState: AuthState = {
  token: null,
  isAuthenticated: false,
  email: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess(state, action: PayloadAction<{ token: string; email: string }>) {
      state.token = action.payload.token;
      state.isAuthenticated = true;
      state.email = action.payload.email;

      if (typeof window !== 'undefined') {
        localStorage.setItem('token', action.payload.token);
      }
    },
    logout(state) {
      state.token = null;
      state.isAuthenticated = false;
      state.email = null;

      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
      }
    },
    setProfile(state, action: PayloadAction<{ email: string }>) {
      state.email = action.payload.email;
      state.isAuthenticated = true;
      
    },
  },
});

export const { loginSuccess, logout, setProfile } = authSlice.actions;
export default authSlice.reducer;
