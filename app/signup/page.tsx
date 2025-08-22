"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Eye, EyeOff, Brain, ArrowLeft, Check } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const signupSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters").max(20, "Username must be less than 20 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type SignupFormData = z.infer<typeof signupSchema>;

export default function SignupPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState<string>("");
  const { register: registerUser, loading } = useAuth();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = async (data: SignupFormData) => {
    try {
      setError("");
      const success = await registerUser({
        username: data.username,
        email: data.email,
        password: data.password,
        firstName: data.firstName,
        lastName: data.lastName,
      });
      if (!success) {
        setError("Registration failed. Please try again.");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    }
  };

  const features = [
    "Access to GPT-4o, GPT-4o Mini, and GPT-3.5 Turbo",
    "Real-time streaming responses",
    "Advanced conversation history",
    "File upload support",
    "Secure and private conversations",
    "Free tier with 20 messages/month"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex items-center justify-center p-3 sm:p-4">
      <div className="w-full max-w-md">
        {/* Back to Home */}
        <Link 
          href="/" 
          className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors mb-6 sm:mb-8"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          <span className="hidden sm:inline">Back to Home</span>
          <span className="sm:hidden">Back</span>
        </Link>

        {/* Logo */}
        <div className="text-center mb-6 sm:mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl sm:rounded-2xl mb-3 sm:mb-4">
            <Brain className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
          </div>
          <h1 className="text-xl sm:text-2xl font-bold">Create your account</h1>
          <p className="text-sm sm:text-base text-muted-foreground">Join us and start chatting with AI</p>
        </div>

        <Card className="border-0 shadow-xl">
          <CardHeader className="space-y-1 p-4 sm:p-6">
            <CardTitle className="text-xl sm:text-2xl text-center">Sign up</CardTitle>
            <CardDescription className="text-center text-sm sm:text-base">
              Create your account to get started
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 p-4 sm:p-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription className="text-sm">{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="username" className="text-sm sm:text-base">Username</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Choose a username"
                  {...register("username")}
                  className={`text-sm sm:text-base ${errors.username ? "border-red-500" : ""}`}
                />
                {errors.username && (
                  <p className="text-xs sm:text-sm text-red-500">{errors.username.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm sm:text-base">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  {...register("email")}
                  className={`text-sm sm:text-base ${errors.email ? "border-red-500" : ""}`}
                />
                {errors.email && (
                  <p className="text-xs sm:text-sm text-red-500">{errors.email.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm sm:text-base">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a password"
                    {...register("password")}
                    className={`text-sm sm:text-base pr-10 ${errors.password ? "border-red-500" : ""}`}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
                {errors.password && (
                  <p className="text-xs sm:text-sm text-red-500">{errors.password.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-sm sm:text-base">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirm your password"
                  {...register("confirmPassword")}
                  className={`text-sm sm:text-base ${errors.confirmPassword ? "border-red-500" : ""}`}
                />
                {errors.confirmPassword && (
                  <p className="text-xs sm:text-sm text-red-500">{errors.confirmPassword.message}</p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full h-10 sm:h-11 text-sm sm:text-base"
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Creating account...</span>
                  </div>
                ) : (
                  "Create account"
                )}
              </Button>
            </form>

            <div className="text-center">
              <p className="text-xs sm:text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
