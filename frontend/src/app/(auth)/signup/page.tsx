"use client";

import { register } from "@/services/auth";
import useAuthStore from "@/store/useAuthStore";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

// Zod schema for validation
const SignupSchema = z.object({
  email: z.string().email("Adresse e-mail invalide"),
  password: z.string().min(6, "Le mot de passe doit contenir au moins 6 caractères"),
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
    } catch (error) {
      const message = error instanceof Error ? error.message : "Échec de l'inscription. Veuillez réessayer.";
      toast.error(message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
  <div className="flex w-full max-w-4xl bg-white rounded-lg shadow-md overflow-hidden">
    {/* Left Panel */}
    <div className="hidden md:flex w-1/2 items-center justify-center bg-[#EAF1FB]">
      <img src="/imglogin.png" alt="Signup visual" className="w-3/4" />
    </div>

    {/* Right Panel */}
    <div className="w-full md:w-1/2 px-8 py-12">
      <h2 className="text-2xl font-bold text-gray-900 mb-1">Create an Account</h2>
      <p className="text-sm text-gray-500 mb-6">Enter your details below</p>

      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="Email"
            autoComplete="email"
            {...formRegister("email")}
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            placeholder="Password"
            autoComplete="new-password"
            {...formRegister("password")}
          />
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
          )}
        </div>

        <Button
          type="submit"
          className="w-full"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Creating account..." : "Sign Up"}
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

      <p className="text-center text-sm text-gray-600 mt-6">
        Already have an account?{" "}
        <a href="/login" className="text-black font-semibold hover:underline">
          Log in
        </a>
      </p>
    </div>
  </div>
</div>
  );
}

export default Signup;
