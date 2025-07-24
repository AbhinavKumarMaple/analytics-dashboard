"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
// import { useAuth } from "@/contexts/auth-context";
import { z } from "zod";
import { useAuth } from "@/hooks/use-auth";

// Form validation schema
const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [formErrors, setFormErrors] = useState<{ email?: string; password?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login, error: authError } = useAuth();
  const router = useRouter();

  const validateForm = () => {
    try {
      loginSchema.parse({ email, password });
      setFormErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors: { email?: string; password?: string } = {};
        error.errors.forEach((err) => {
          if (err.path[0] === "email") {
            errors.email = err.message;
          }
          if (err.path[0] === "password") {
            errors.password = err.message;
          }
        });
        setFormErrors(errors);
      }
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const success = await login(email, password);
      console.log("success", success);
      if (success) {
        router.push("/acquisition");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className=" flex min-h-screen items-center justify-center bg-white px-4 pb-12 pt-24 shadow-lg dark:bg-gray-800 sm:px-6 lg:px-8">
      <Card className="relative z-30 w-full max-w-md bg-white shadow-lg dark:bg-gray-700">
        <CardHeader className="space-y-1 pb-6">
          <CardTitle className="text-center text-2xl font-bold ">Welcome Back</CardTitle>
          <CardDescription className="text-center ">
            Sign in to your PANTHERA account
          </CardDescription>
        </CardHeader>
        <CardContent className="px-6 pb-6">
          {authError && (
            <div className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-600">{authError}</div>
          )}
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium ">
                Email address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className={`block w-full appearance-none rounded-lg border ${
                    formErrors.email ? "border-red-500" : "border-gray-300"
                  } relative z-10 bg-white px-4 py-3 text-sm placeholder-gray-400 shadow-sm transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50`}
                />
                {formErrors.email && (
                  <p className="mt-1 text-xs text-red-600">{formErrors.email}</p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium ">
                Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className={`block w-full appearance-none rounded-lg border ${
                    formErrors.password ? "border-red-500" : "border-gray-300"
                  } relative z-10 bg-white px-4 py-3 text-sm placeholder-gray-400 shadow-sm transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50`}
                />
                {formErrors.password && (
                  <p className="mt-1 text-xs text-red-600">{formErrors.password}</p>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="relative z-10 h-4 w-4 cursor-pointer rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm ">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <a
                  href="#"
                  className="relative z-10 cursor-pointer font-medium text-blue-600 hover:text-blue-800"
                >
                  Forgot your password?
                </a>
              </div>
            </div>

            <div>
              <Button
                type="submit"
                className="relative z-10 h-12 w-full rounded-lg bg-blue-600 text-base font-medium transition-colors hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Signing in..." : "Sign in"}
              </Button>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center px-6 pt-4">
          <p className="text-center text-sm ">
            Dont have an account?{" "}
            <a
              href="#"
              className="relative z-10 cursor-pointer font-medium text-blue-600 transition-colors hover:text-blue-800"
            >
              Contact your administrator
            </a>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
