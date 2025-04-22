import React from 'react';

const Login: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="flex w-full max-w-4xl bg-white rounded-lg shadow-md overflow-hidden">
        {/* Left Image Panel */}
        <div className="hidden md:flex w-1/2 items-center justify-center bg-[#EAF1FB]">
          <img src="/imglogin.png" alt="Signup Visual" className="w-3/4" />
        </div>

        {/* Right Form Panel */}
        <div className="w-full md:w-1/2 px-8 py-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-1">Log in to Exclusive</h2>
          <p className="text-sm text-gray-500 mb-6">Enter your details below</p>

          <form className="space-y-4">
            <input
              type="email"
              placeholder="Email or Phone Number"
              className="w-full px-4 py-2 border border-gray-300 rounded bg-[#EDF1F7] text-sm focus:outline-none focus:ring-2 focus:ring-green-700"
            />
            <input
              type="password"
              placeholder="Password"
              className="w-full px-4 py-2 border border-gray-300 rounded bg-[#EDF1F7] text-sm focus:outline-none focus:ring-2 focus:ring-green-700"
            />

            <div className="flex justify-end">
              <a href="#" className="text-sm text-gray-500 hover:underline">
                Forget Password?
              </a>
            </div>

            <button
              type="submit"
              className="w-full py-2 bg-green-700 text-white rounded hover:bg-green-800 transition-colors"
            >
              Log in
            </button>

            <button
              type="button"
              className="flex items-center justify-center w-full py-2 border border-gray-300 rounded hover:bg-gray-100"
            >
              <img
                src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                alt="Google"
                className="w-4 h-4 mr-2"
              />
              Log in with Google
            </button>
          </form>

          <p className="text-center text-sm text-gray-600 mt-6">
            Don’t have an account?{' '}
            <a href="#" className="text-black font-semibold hover:underline">
              Sign up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;