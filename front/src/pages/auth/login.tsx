import React from 'react';
import Navbar from '../common/Navbar';
import { FooterSection } from '../common/FooterSection';

const Login: React.FC = () => {
  return (
    <div>
      <div className="bg-[#285a43] py-12">
      <Navbar />
      </div>
    <div className="min-h-screen flex">
      {/* Left Side - Image */}
      <div className="w-1/2 bg-[#CBE4E8] flex items-center justify-center">
        <img
          src="/imglogin.png" // Remplace par le chemin de ton image
          alt="Shopping Illustration"
          className="max-w-[80%] h-auto"
        />
      </div>

      {/* Right Side - Login Form */}
      <div className="w-1/2 flex items-center justify-center px-8">
        <div className="max-w-md w-full">
          <h2 className="text-2xl font-semibold mb-2">Log in to Exclusive</h2>
          <p className="text-sm text-gray-500 mb-6">Enter your details below</p>

          <form className="space-y-4">
            <input
              type="text"
              placeholder="Email or Phone Number"
              className="w-full border-b border-gray-300 focus:outline-none py-2 placeholder:text-sm"
            />
            <input
              type="password"
              placeholder="Password"
              className="w-full border-b border-gray-300 focus:outline-none py-2 placeholder:text-sm"
            />

            <div className="flex items-center justify-between pt-4">
              <button
                type="submit"
                className="bg-green-900 text-white px-6 py-2 rounded hover:bg-green-800"
              >
                Log In
              </button>
              <a href="#" className="text-sm text-gray-500 hover:underline">
                Forget Password?
              </a>
            </div>
          </form>
        </div>
      </div>
    </div>
    <FooterSection/>
    </div>
  );
};

export default Login;
