import React from 'react';
import Navbar from '../common/Navbar';
import { FooterSection } from '../common/FooterSection';

const Login: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">

      {/* Main Content */}
      <div className="flex flex-col lg:flex-row flex-grow">
        {/* Left Side - Image */}
        <div className="hidden lg:flex lg:w-1/2 bg-[#CBE4E8] items-center justify-center p-4">
          <img
            src="/imglogin.png" // Remplace par le chemin de ton image
            alt="Shopping Illustration"
            className="max-w-full lg:max-w-[80%] h-auto"
          />
        </div>

        {/* Right Side - Login Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center px-4 py-8">
          <div className="max-w-md w-full">
            <h2 className="text-xl lg:text-2xl font-semibold mb-2 text-center lg:text-left">
              Log in to Exclusive
            </h2>
            <p className="text-sm text-gray-500 mb-6 text-center lg:text-left">
              Enter your details below
            </p>

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

              <div className="flex flex-col lg:flex-row items-center justify-between pt-4 space-y-4 lg:space-y-0">
                <button
                  type="submit"
                  className="bg-green-900 text-white px-6 py-2 rounded hover:bg-green-800 w-full lg:w-auto"
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

      {/* Footer */}
      <FooterSection />
    </div>
  );
};

export default Login;