
function Signup() {
  return (
    <div>
      <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="grid grid-cols-1 md:grid-cols-2 bg-white shadow-md rounded-lg overflow-hidden">
        {/* Left: Image */}
        <div className="flex items-center justify-center p-8 bg-blue-50">
          <img
            src="/signup-image.png"
            alt="Signup Visual"
            className="max-w-full h-auto"
          />
        </div>

        {/* Right: Signup Form */}
        <div className="p-8 w-full max-w-md">
          <h2 className="text-2xl font-bold mb-2">Create an account</h2>
          <p className="text-gray-500 mb-6">Enter your details below</p>

          <form className="space-y-4">
            <input
              type="text"
              placeholder="Name"
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
            <input
              type="email"
              placeholder="Email or Phone Number"
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
            <input
              type="password"
              placeholder="Password"
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
            <button
              type="submit"
              className="w-full bg-green-700 text-white py-2 rounded hover:bg-green-800"
            >
              Create Account
            </button>
            <button
              type="button"
              className="w-full border border-gray-300 py-2 rounded flex items-center justify-center"
            >
              <img
                src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                alt="Google"
                className="w-5 h-5 mr-2"
              />
              Sign up with Google
            </button>
          </form>

          <p className="text-center text-sm text-gray-600 mt-4">
            Already have account?{' '}
            <a href="#" className="text-black font-medium">
              Log in
            </a>
          </p>
        </div>
      </div>
    </div>
    </div>
  )
}

export default Signup