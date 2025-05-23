import axios from 'axios';

const API_BASE_URL = `${process.env.NEXT_PUBLIC_API_URL}/api/auth`; // Change if your Flask API is hosted elsewhere

// Create Axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
});

// Interface for login/register input
interface AuthCredentials {
  email: string;
  password: string;
}


// ============================
// Register User
// ============================

interface ErrorResponse {
  error?: string;
}

export const register = async ({ email, password }: AuthCredentials): Promise<string> => {
  try {
    const res = await api.post('/register', { email, password });
    return res.data.message;
  } catch (err) {
    if (axios.isAxiosError(err) && err.response) {
      const serverMsg = (err.response.data as ErrorResponse).error;
      throw new Error(serverMsg || 'Registration failed');
    }
    throw err;
  }
};

// ============================
// Login User and Save Token
// ============================

type loginReturn = {
  user : User, 
  token : string
}

export const login = async ({ email, password }: AuthCredentials): Promise<loginReturn> => {
  const res = await api.post('/login', { email, password });
  const token = res.data.token;
  const id = res.data.token;


  if (typeof window !== 'undefined') {
    localStorage.setItem('token', token);
  }

  return {token : token  , user : {id : id , email: email ,cover_img : undefined , name : ""  }};
};

// ============================
// Get User Profile (Protected)
// ============================
export const getProfile = async ({token } : {token : string}): Promise<User> => {


  const res = await api.get('/profile', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  

  console.log({"user load" : res.data.user});

  return res.data.user;
};

// ============================
// Logout (Client-side only)
// ============================
export const logoutUser = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.clear();
  }
};

// ============================
// Check if user is logged in
// ============================
export const isLoggedIn = (): boolean => {
  if (typeof window === 'undefined') return false;
  return Boolean(localStorage.getItem('token'));
};
