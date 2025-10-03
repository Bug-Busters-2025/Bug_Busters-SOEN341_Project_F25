import { Link } from "react-router";
import { useState } from "react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) throw new Error("Login failed");
      alert("Login successful!");
      // redirect to dashboard or home
    } catch (err) {
      console.error(err);
      alert("Invalid credentials.");
    }
  };

  return (
    <div className="w-full h-screen flex items-center justify-center bg-background text-foreground transition-colors">
      <div className="bg-card shadow-lg rounded-lg p-8 w-full max-w-md text-center space-y-6 border border-border">
        <h1 className="text-3xl font-bold text-foreground">Login</h1>
        <form onSubmit={handleLogin} className="space-y-4 text-left">
          <div>
            <label className="block mb-1 text-sm font-medium text-foreground">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-colors"
              required
            />
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium text-foreground">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-colors"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 px-6 rounded-lg font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            Login
          </button>
        </form>
        <p className="text-sm text-muted-foreground">
          Don’t have an account?{" "}
          <Link
            to="/signup"
            className="text-primary hover:underline focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}
