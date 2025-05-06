import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api/auth'; // Change if your Flask API is hosted elsewhere

// Create Axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
});

// Interface for login/register input
interface AuthCredentials {
  email: string;
  password: string;
}

// Interface for user profile
interface UserProfile {
  email: string;
}

// ============================
// Register User
// ============================

export const register = async ({ email, password }: AuthCredentials): Promise<string> => {
  try {
    const res = await api.post('/register', { email, password });
    return res.data.message;
  } catch (err) {
    if (axios.isAxiosError(err) && err.response) {
      // take the JSON “error” field if present
      const serverMsg = (err.response.data as any).error;
      throw new Error(serverMsg || 'Registration failed');
    }
    throw err;
  }
};
// ============================
// Login User and Save Token
// ============================
export const login = async ({ email, password }: AuthCredentials): Promise<string> => {
  const res = await api.post('/login', { email, password });
  const token = res.data.token;

  if (typeof window !== 'undefined') {
    localStorage.setItem('token', token);
  }

  return token;
};

// ============================
// Get User Profile (Protected)
// ============================
export const getProfile = async ({token } : {token : string}): Promise<UserProfile> => {


  const res = await api.get('/profile', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data.user;
};

// ============================
// Logout (Client-side only)
// ============================
export const logout = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('token');
  }
};

// ============================
// Check if user is logged in
// ============================
export const isLoggedIn = (): boolean => {
  if (typeof window === 'undefined') return false;
  return Boolean(localStorage.getItem('token'));
};
