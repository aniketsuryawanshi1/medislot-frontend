import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Calendar, Lock, Mail, Stethoscope } from "lucide-react";
import useAuth from "../hooks/useAuth";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../components/ui/form";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"), // Changed from username
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const Login = () => {
  const navigate = useNavigate();
  const { login, loading, error, user } = useAuth(); // Added user from Redux state
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "", // Changed from username
      password: "",
    },
  });

  const onSubmit = async (data) => {
    try {
      await login(data); // Now sends email and password
      const currentUser = user || JSON.parse(localStorage.getItem("user"));
      if (currentUser?.role === "doctor") {
        navigate("/doctor/dashboard");
      } else if (currentUser?.role === "patient") {
        navigate("/patient/dashboard");
      } else {
        console.error("Unknown user role");
      }
    } catch (err) {
      console.error("Login failed:", err);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Image/Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-teal-500 via-emerald-500 to-cyan-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRjMC0yLjIxLTEuNzktNC00LTRzLTQgMS43OS00IDQgMS43OSA0IDQgNCA0LTEuNzkgNC00em0wLTEwYzAtMi4yMS0xLjc5LTQtNC00cy00IDEuNzktNCA0IDEuNzkgNCA0IDQgNC0xLjc5IDQtNHptMC0xMGMwLTIuMjEtMS43OS00LTQtNHMtNCAxLjc5LTQgNCAxLjc5IDQgNCA0IDQtMS43OSA0LTR6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-20"></div>

        <div className="relative z-10 flex flex-col justify-center items-center w-full p-12 text-white">
          <div className="max-w-md">
            <Stethoscope className="w-16 h-16 mb-6" strokeWidth={1.5} />
            <h1 className="text-5xl font-bold mb-4 tracking-tight">MediSlot</h1>
            <p className="text-xl text-white/90 mb-8 leading-relaxed">
              Seamless healthcare appointment management for modern medical
              practices
            </p>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Calendar className="w-5 h-5" />
                <span>Smart scheduling & availability</span>
              </div>
              <div className="flex items-center space-x-3">
                <Calendar className="w-5 h-5" />
                <span>Real-time notifications</span>
              </div>
              <div className="flex items-center space-x-3">
                <Calendar className="w-5 h-5" />
                <span>Patient-doctor coordination</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome Back
            </h2>
            <p className="text-gray-600">
              Sign in to access your healthcare dashboard
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <FormField
                control={form.control}
                name="email" // Changed from username
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter your password"
                          className="pl-10"
                          {...field}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-600 hover:text-gray-900"
                        >
                          {showPassword ? "Hide" : "Show"}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex items-center justify-between">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className="rounded border-gray-300 text-teal-600 focus:ring-teal-500"
                  />
                  <span className="text-sm text-gray-600">Remember me</span>
                </label>
                <Link
                  to="/forgot-password"
                  className="text-sm text-teal-600 hover:text-teal-700 font-medium"
                >
                  Forgot password?
                </Link>
              </div>

              <Button
                type="submit"
                className="w-full bg-teal-600 hover:bg-teal-700 text-white h-11"
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Signing in...
                  </span>
                ) : (
                  "Sign In"
                )}
              </Button>

              <div className="text-center text-sm text-gray-600">
                Don't have an account?{" "}
                <Link
                  to="/register"
                  className="text-teal-600 hover:text-teal-700 font-medium"
                >
                  Create account
                </Link>
              </div>
            </form>
          </Form>

          <div className="pt-6 text-center text-xs text-gray-500">
            By signing in, you agree to our{" "}
            <a href="#" className="text-teal-600 hover:text-teal-700">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="#" className="text-teal-600 hover:text-teal-700">
              Privacy Policy
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
