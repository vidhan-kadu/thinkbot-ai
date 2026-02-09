import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Login failed");
        setLoading(false);
        return;
      }

      login(data.token, data.user);
      navigate("/");
    } catch (err) {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen px-4 bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-950">
      {/* Back to chat – top left */}
      <button
        onClick={() => navigate("/")}
        className="absolute top-6 left-6 flex items-center gap-2 rounded-ls border border-neutral-700 px-3 py-3.5
               text-sm text-neutral-300 hover:text-white hover:border-neutral-400 transition"
      >
        ← Back to Chat
      </button>

      <Card className="w-full max-w-md overflow-hidden border shadow-2xl bg-neutral-900/70 backdrop-blur-xl border-neutral-800">
        <CardHeader className="space-y-2 text-center">
          <CardTitle className="text-2xl font-semibold tracking-tight text-white">
            Login to ThinkBot AI
          </CardTitle>
          <p className="text-sm text-neutral-400">
            Continue your AI conversations
          </p>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-neutral-300">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="box-border w-full px-4 border h-11 bg-zinc-800 border-zinc-700 text-zinc-100 placeholder:text-zinc-500 focus-visible:ring-2 focus-visible:ring-zinc-400/30 focus-visible:border-zinc-400"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-neutral-300">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="box-border w-full px-4 border h-11 bg-zinc-800 border-zinc-700 text-zinc-100 placeholder:text-zinc-500 focus-visible:ring-2 focus-visible:ring-zinc-400/30 focus-visible:border-zinc-400"
              />
            </div>

            {error && (
              <p className="text-sm text-center text-red-500">{error}</p>
            )}

            <div className="flex justify-center ">
              <Button
                type="submit"
                disabled={loading}
                className="w-full px-4 max-w-xs mx-auto font-medium transition-all duration-150 text-black bg-white shadow-none h-11 ring-0 focus:ring-0 focus-visible:ring-0 focus-visible:outline-none hover:bg-zinc-300 active:scale-[0.99] "
              >
                {loading ? "Signing in..." : "Login"}
              </Button>
            </div>
          </form>

          <div className="mt-6 text-sm text-center text-neutral-400">
            Don’t have an account?{" "}
            <span
              onClick={() => navigate("/signup")}
              className="text-white cursor-pointer hover:underline"
            >
              Sign up
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default Login;
