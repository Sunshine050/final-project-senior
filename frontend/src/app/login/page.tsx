"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, Loader2, Stethoscope } from "lucide-react";
import authService from "@/services/authService";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      await authService.login({ email, password });
      router.push("/rescue/dashboard");
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      setError(
        error.response?.data?.message || "Login failed. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Quick login buttons for demo
  const quickLogin = async (email: string) => {
    setEmail(email);
    setPassword("password123");
    setIsLoading(true);
    setError("");

    try {
      await authService.login({ email, password: "password123" });
      router.push("/rescue/dashboard");
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      setError(
        error.response?.data?.message || "Login failed. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-cyan-50/50 to-teal-50/30 flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMwZDk0ODgiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyek0zNiAzMHYySDI0di0yaDEyek0zNiAyNnYySDI0di0yaDEyeiIvPjwvZz48L2c+PC9zdmc+')] opacity-50"></div>
      
      <Card className="w-full max-w-md bg-white/90 backdrop-blur-sm border-slate-200/60 shadow-xl shadow-teal-500/5 relative">
        <CardHeader className="text-center pb-2">
          <div className="w-20 h-20 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl shadow-teal-500/30">
            <Heart className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-slate-800">
            Emergency Care System
          </h1>
          <p className="text-slate-500">Sign in to access the dashboard</p>
        </CardHeader>

        <CardContent className="space-y-6">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm flex items-center gap-2">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                placeholder="Enter your email"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                placeholder="Enter your password"
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 text-white shadow-lg shadow-teal-500/25 py-2.5"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>

          {/* Quick Login for Demo */}
          <div className="border-t border-slate-200 pt-4">
            <p className="text-sm text-slate-500 text-center mb-3 flex items-center justify-center gap-2">
              <Stethoscope className="w-4 h-4" />
              Quick login (Demo accounts)
            </p>
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                size="sm"
                className="border-slate-200 text-slate-600 hover:bg-teal-50 hover:border-teal-300 hover:text-teal-700"
                onClick={() => quickLogin("admin@emergency.com")}
                disabled={isLoading}
              >
                Admin
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="border-slate-200 text-slate-600 hover:bg-teal-50 hover:border-teal-300 hover:text-teal-700"
                onClick={() => quickLogin("dispatcher@emergency.com")}
                disabled={isLoading}
              >
                Dispatcher
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="border-slate-200 text-slate-600 hover:bg-teal-50 hover:border-teal-300 hover:text-teal-700"
                onClick={() => quickLogin("rescue1@emergency.com")}
                disabled={isLoading}
              >
                Rescue Team
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="border-slate-200 text-slate-600 hover:bg-teal-50 hover:border-teal-300 hover:text-teal-700"
                onClick={() => quickLogin("hospital1@emergency.com")}
                disabled={isLoading}
              >
                Hospital
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
