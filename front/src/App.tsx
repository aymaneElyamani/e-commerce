// src/App.jsx
import { Routes, Route } from 'react-router-dom';
import Home from './pages/home/home';
import Products from './pages/products/products';
import Login from './pages/auth/login';
import Signup from './pages/auth/signup';
import NotFound from './pages/common/notFound';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path='/login' element = { <Login />}/>
      <Route path='/signup' element = { <Signup />}/>
      <Route path="/products" element={<Products />} />
      {/* <Route path="/products/:id" element={<DetailsProduct />} /> */}

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
