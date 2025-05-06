"use client";
import { login } from "@/services/auth";
import { loginSuccess } from "@/store/slices/authSlice";
import { RootState } from "@/store/store";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";

const Login: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false); // 👈 Loading state

  const dispatch = useDispatch();
  const router = useRouter();
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/");
    }
  }, [isAuthenticated, router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); // 👈 Start loading

    try {
      const token = await login({ email, password });
      dispatch(loginSuccess({ token, email }));
      console.log("Logged in! Token:", token);

      // Show success toast
      toast.success("Login successful!");

      // Optionally redirect or do something after success
    } catch (error: any) {
      console.error("Login failed:", error);

      // Show error toast with the error message
      toast.error(error.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setLoading(false); // 👈 Stop loading
    }
  };

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

          <form className="space-y-4" onSubmit={handleLogin}>
            <input
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              placeholder="Email or Phone Number"
              className="w-full px-4 py-2 border border-gray-300 rounded bg-[#EDF1F7] text-sm focus:outline-none focus:ring-2 focus:ring-green-700"
            />
            <input
              onChange={(e) => setPassword(e.target.value)}
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
              disabled={loading}
              className={`w-full py-2 rounded transition-colors text-white ${
                loading ? "bg-gray-500 cursor-not-allowed" : "bg-green-700 hover:bg-green-800"
              }`}
            >
              {loading ? "Logging in..." : "Log in"}
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
            Don’t have an account?{" "}
            <a href="/signup" className="text-black font-semibold hover:underline">
              Sign up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
