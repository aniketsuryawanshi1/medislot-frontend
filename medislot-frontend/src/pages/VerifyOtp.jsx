import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { CheckCircle, Mail, ArrowLeft } from "lucide-react";
import useAuth from "../hooks/useAuth";
import { Button } from "../components/ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../components/ui/form";

const verifyOtpSchema = z.object({
  otp: z.string().length(6, "OTP must be 6 digits"),
});

const VerifyOtp = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { verifyOtp, loading, error, user } = useAuth();
  const [success, setSuccess] = useState(false);
  const email = location.state?.email || ""; // From Register navigation

  const form = useForm({
    resolver: zodResolver(verifyOtpSchema),
    defaultValues: {
      otp: "",
    },
  });

  const onSubmit = async (data) => {
    try {
      await verifyOtp({ email, otp: data.otp });
      setSuccess(true);
      // Navigate to login after success
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      console.error("OTP verification failed:", err);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50">
        <div className="text-center space-y-6">
          {/* Animated Success SVG */}
          <div className="flex justify-center">
            <svg
              width="120"
              height="120"
              viewBox="0 0 120 120"
              className="animate-pulse"
            >
              <circle
                cx="60"
                cy="60"
                r="50"
                fill="none"
                stroke="#10b981"
                strokeWidth="4"
                className="animate-spin"
                style={{ animationDuration: "2s" }}
              />
              <circle
                cx="60"
                cy="60"
                r="30"
                fill="#10b981"
                className="animate-bounce"
              >
                <animate
                  attributeName="r"
                  values="30;35;30"
                  dur="1s"
                  repeatCount="indefinite"
                />
              </circle>
              <path
                d="M45 60l10 10 20-20"
                stroke="white"
                strokeWidth="4"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="animate-dash"
              >
                <animate
                  attributeName="stroke-dasharray"
                  values="0,100;100,0"
                  dur="1s"
                  fill="freeze"
                />
              </path>
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-gray-900">
            Verification Successful!
          </h2>
          <p className="text-gray-600">Redirecting you to your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Side */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 via-purple-500 to-pink-500 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRjMC0yLjIxLTEuNzktNC00LTRzLTQgMS43OS00IDQgMS43OSA0IDQgNCA0LTEuNzkgNC00em0wLTEwYzAtMi4yMS0xLjc5LTQtNC00cy00IDEuNzktNCA0IDEuNzkgNCA0IDQgNC0xLjc5IDQtNHptMC0xMGMwLTIuMjEtMS43OS00LTQtNHMtNCAxLjc5LTQgNCAxLjc5IDQgNCA0IDQtMS43OSA0LTR6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-20"></div>

        <div className="relative z-10 flex flex-col justify-center items-center w-full p-12 text-white">
          <div className="max-w-md">
            {/* Animated Mail SVG */}
            <svg
              width="80"
              height="80"
              viewBox="0 0 80 80"
              className="mb-6 animate-bounce"
            >
              <rect
                x="10"
                y="20"
                width="60"
                height="40"
                rx="5"
                fill="none"
                stroke="white"
                strokeWidth="2"
                className="animate-pulse"
              />
              <path
                d="M10 25l30 20 30-20"
                fill="none"
                stroke="white"
                strokeWidth="2"
                className="animate-dash"
              >
                <animate
                  attributeName="stroke-dasharray"
                  values="0,100;100,0"
                  dur="2s"
                  repeatCount="indefinite"
                />
              </path>
              <circle
                cx="25"
                cy="35"
                r="3"
                fill="white"
                className="animate-ping"
              />
              <circle
                cx="40"
                cy="35"
                r="3"
                fill="white"
                className="animate-ping"
                style={{ animationDelay: "0.5s" }}
              />
              <circle
                cx="55"
                cy="35"
                r="3"
                fill="white"
                className="animate-ping"
                style={{ animationDelay: "1s" }}
              />
            </svg>
            <h1 className="text-4xl font-bold mb-4 tracking-tight">
              Verify Your Email
            </h1>
            <p className="text-xl text-white/90 mb-8 leading-relaxed">
              We've sent a 6-digit code to your email. Enter it below to
              continue.
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - OTP Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Enter Verification Code
            </h2>
            <p className="text-gray-600">
              We sent a code to <strong>{email}</strong>
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
                name="otp"
                render={({ field }) => (
                  <FormItem className="space-y-4">
                    <FormLabel className="text-center block">
                      Enter 6-digit code
                    </FormLabel>
                    <FormControl>
                      <div className="flex justify-center">
                        <InputOTP maxLength={6} {...field}>
                          <InputOTPGroup>
                            <InputOTPSlot index={0} />
                            <InputOTPSlot index={1} />
                            <InputOTPSlot index={2} />
                            <InputOTPSlot index={3} />
                            <InputOTPSlot index={4} />
                            <InputOTPSlot index={5} />
                          </InputOTPGroup>
                        </InputOTP>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white h-11"
                disabled={loading}
              >
                {loading ? "Verifying..." : "Verify Code"}
              </Button>

              <div className="text-center space-y-2">
                <p className="text-sm text-gray-600">
                  Didn't receive the code?{" "}
                  <button
                    type="button"
                    className="text-blue-600 hover:text-blue-700 font-medium"
                    onClick={() => {
                      // Implement resend logic if needed
                      console.log("Resend OTP");
                    }}
                  >
                    Resend
                  </button>
                </p>
                <button
                  type="button"
                  onClick={() => navigate("/register")}
                  className="text-sm text-gray-600 hover:text-gray-800 flex items-center justify-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to Register
                </button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default VerifyOtp;
