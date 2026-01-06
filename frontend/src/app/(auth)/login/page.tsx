"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { login } from "@/services/auth";
import useAuthStore from "@/store/useAuthStore";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const router = useRouter();
  const { loginSuccess, isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/");
    }
  }, [isAuthenticated, router]);

  const validateForm = () => {
    const newErrors: typeof errors = {};
    if (!email) {
      newErrors.email = "Email is required.";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Invalid email format.";
    }

    if (!password) {
      newErrors.password = "Password is required.";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!validateForm()) return;

  setLoading(true);
  try {
    const { token, user } = await login({ email, password });
    loginSuccess(token, user);
    toast.success("Login successful!");
  } catch (error: unknown) {
    if (error instanceof Error) {
      const axiosError = error as { response?: { data?: { message?: string } } };
      toast.error(
        axiosError?.response?.data?.message || error.message || "Login failed. Please try again."
      );
    } else {
      toast.error("An unknown error occurred.");
    }
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="flex w-full max-w-4xl bg-card rounded-lg shadow-md overflow-hidden border border-border">
        {/* Left Panel */}
        <div className="hidden md:flex w-1/2 items-center justify-center bg-muted">
          <img src="/imglogin.png" alt="Login visual" className="w-3/4" />
        </div>

        {/* Right Panel */}
        <div className="w-full md:w-1/2 px-8 py-12">
          <h2 className="text-2xl font-bold text-foreground mb-1">Log in to Exclusive</h2>
          <p className="text-sm text-muted-foreground mb-6">Enter your details below</p>

          <form className="space-y-4" onSubmit={handleLogin}>
            <div>
              <Label className="pb-2" htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email or Phone Number"
              />
              {errors.email && <p className="text-destructive text-sm mt-1">{errors.email}</p>}
            </div>

            <div>
              <Label className="pb-2" htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
              />
              {errors.password && <p className="text-destructive text-sm mt-1">{errors.password}</p>}
            </div>

            <div className="flex justify-end">
              <a href="#" className="text-sm text-muted-foreground hover:underline">
                Forgot Password?
              </a>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full"
            >
              {loading ? "Logging in..." : "Log in"}
            </Button>

            <button
              type="button"
              className="flex items-center justify-center w-full py-2 border border-border rounded hover:bg-muted"
            >
              <img
                src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                alt="Google"
                className="w-4 h-4 mr-2"
              />
              Log in with Google
            </button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-6">
            Don’t have an account?{" "}
            <a href="/signup" className="text-foreground font-semibold hover:underline">
              Sign up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
