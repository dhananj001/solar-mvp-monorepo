import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Copy, Check } from "lucide-react";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [copiedField, setCopiedField] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      // const res = await axios.post("/api/auth/login", { email, password });
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
      const res = await axios.post(`${API_BASE_URL}/api/auth/login`, {
        email,
        password,
      });

      localStorage.setItem("token", res.data.token);
      setMessage("Login successful");
      navigate("/dashboard");
    } catch (err) {
      setMessage(err.response?.data?.message || "Error logging in");
    } finally {
      setLoading(false);
    }
  };

  // const handleSubmit = (e) => {
  //   e.preventDefault();
  //   navigate("/dashboard");
  // };
      onClick={() => handleCopy(text, field)}
      className="ml-1 hover:text-blue-600 transition"
      title="Copy"

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-blue-50 px-4">
      <Card className="max-w-md w-full rounded-3xl shadow-xl bg-white border border-gray-200">
        <CardHeader className="pb-4 border-b border-gray-200">
          <div className="text-center">
            <div className="mx-auto mb-4 w-14 h-14 rounded-full bg-blue-600 flex items-center justify-center text-white text-2xl font-semibold select-none shadow-md">
              TT
            </div>
            <CardTitle className="text-2xl font-semibold text-gray-900">
              Tuljai Traders
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-1">
              <Label htmlFor="email" className="text-gray-800 font-medium">
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="owner@tuljaitraders.com"
                className="border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                autoComplete="email"
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="password" className="text-gray-800 font-medium">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                autoComplete="current-password"
              />
            </div>
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 transition font-semibold rounded-xl shadow-lg"
            >
              {loading ? "Logging in..." : "Login"}
            </Button>
          </form>

          {message && (
            <p
              className={cn(
                "mt-4 text-center text-sm select-none transition-colors",
                message.toLowerCase().includes("error")
                  ? "text-red-600"
                  : "text-green-600"
              )}
              role="alert"
            >
              {message}
            </p>
          )}

          {/* <p className="mt-6 text-center text-sm text-gray-700">
            Don’t have an account?{' '}
            <a
              href="/register"
              className="text-blue-600 hover:text-blue-800 font-semibold transition underline-offset-2 hover:underline"
            >
              Register
            </a>
          </p> */}
          <p className="mt-6 text-center text-sm text-gray-600 max-w-sm mx-auto">
            <strong className="font-semibold text-gray-800">Login:</strong>{" "}
            <span className="font-mono bg-gray-100 px-2  rounded text-gray-900 inline-flex items-center">
              infy@demo.com
              <CopyIcon text="infy@demo.com" field="email" />
            </span>{" "}
            | Password:{" "}
            <span className="font-mono bg-gray-100 px-2  rounded text-gray-900 inline-flex items-center">
              1234567890
              <CopyIcon text="1234567890" field="password" />
            </span>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

export default Login;
