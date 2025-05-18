"use client";

import { register } from "@/services/auth";
import useAuthStore from "@/store/useAuthStore";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

// Zod schema for validation
const SignupSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type SignupFormData = z.infer<typeof SignupSchema>;

function Signup() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();

  const {
    register: formRegister,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormData>({
    resolver: zodResolver(SignupSchema),
  });

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/");
    }
  }, [isAuthenticated, router]);

  const onSubmit = async (data: SignupFormData) => {
    try {
      const message = await register(data);
      toast.success(message);
      router.push("/login");
    } catch (error: any) {
      toast.error(error.message || "Sign-up failed. Please try again.");
    }
  };

  return (
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

          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <Input
                type="email"
                placeholder="Email"
                {...formRegister("email")}
              />
              {errors.email && (
                <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>
              )}
            </div>

            <div>
              <Input
                type="password"
                placeholder="Password"
                {...formRegister("password")}
              />
              {errors.password && (
                <p className="text-sm text-red-500 mt-1">{errors.password.message}</p>
              )}
            </div>

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Creating account..." : "Create Account"}
            </Button>

            <Button
              type="button"
              variant="outline"
              className="w-full flex items-center justify-center"
            >
              <img
                src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                alt="Google"
                className="w-5 h-5 mr-2"
              />
              Sign up with Google
            </Button>
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
  );
}

export default Signup;
