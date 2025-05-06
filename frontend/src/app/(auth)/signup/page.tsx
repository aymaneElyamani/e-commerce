"use client";

import { register } from "@/services/auth";
import { RootState } from "@/store/store";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";

function Signup() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false); // Loading state

  const dispatch = useDispatch();
  const router = useRouter();
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/"); // Redirect to home if authenticated
    }
  }, [isAuthenticated, router]);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevents page refresh
    setLoading(true); // Start loading

    try {
      const message = await register({
        email,
        password,
      });

      // Optionally, dispatch any actions here if needed
      // dispatch(loginSuccess({ token, email }));

      toast.success(message); // Show success toast
      router.push("/login"); // Redirect to login page

    } catch (error: any) {
      // console.error("Sign up failed:", error);
      toast.error(error.message|| "Sign-up failed. Please try again."); // Show error toast
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <div>
      <div className="flex min-h-screen items-center justify-center bg-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-2 bg-white shadow-md rounded-lg overflow-hidden">
          {/* Left: Image */}
          <div className="flex items-center justify-center p-8 bg-blue-50">
            <img
              src="/signup-imglogin.png"
              alt="Signup Visual"
              className="max-w-full h-auto w-3/4"
            />
          </div>

          {/* Right: Signup Form */}
          <div className="p-8 w-full max-w-md">
            <h2 className="text-2xl font-bold mb-2">Create an account</h2>
            <p className="text-gray-500 mb-6">Enter your details below</p>

            <form className="space-y-4" onSubmit={handleSignUp}>
              <input
                type="email"
                placeholder="Email or Phone Number"
                className="w-full border border-gray-300 rounded px-3 py-2"
                onChange={(e) => setEmail(e.target.value)}
              />
              <input
                type="password"
                placeholder="Password"
                className="w-full border border-gray-300 rounded px-3 py-2"
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="submit"
                disabled={loading}
                className={`w-full py-2 rounded transition-colors text-white ${
                  loading ? "bg-gray-500 cursor-not-allowed" : "bg-green-700 hover:bg-green-800"
                }`}
              >
                {loading ? "Creating account..." : "Create Account"}
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
              Already have an account?{" "}
              <Link href="/login" className="text-black font-medium">
                Log in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signup;
