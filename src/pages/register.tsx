
import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import {
  Sparkles,
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  ArrowRight,
  Loader2,
} from "lucide-react";

type AuthUser = {
  id: string;
  name: string;
  email: string;
};

type RegisterProps = {
  onAuthenticated: (user: AuthUser) => void;
};

function Register({ onAuthenticated }: RegisterProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    if (name.trim().length < 2) {
      setError("Name must contain at least 2 characters.");
      return;
    }

    if (password.length < 8) {
      setError("Password must contain at least 8 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setIsLoading(true);

      const response = await fetch(
        "https://documind-ai-buwz.onrender.com/api/auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            name: name.trim(),
            email: email.trim(),
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Registration failed.");
      }

      onAuthenticated(data.user);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#080914] px-5 py-12 text-white">
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[550px] w-[550px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-700/15 blur-[150px]" />

      <div className="relative w-full max-w-md">
        <Link
          to="/"
          className="mb-8 flex items-center justify-center gap-2 text-2xl font-bold"
        >
          <Sparkles className="text-violet-400" size={27} />
          DocuMind AI
        </Link>

        <div className="rounded-3xl border border-white/10 bg-[#111326] p-7 shadow-2xl shadow-violet-950/30 sm:p-9">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold">Create your account</h1>
            <p className="mt-3 text-sm text-slate-400">
              Start exploring your documents with AI.
            </p>
          </div>

          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Full name
              </label>

              <div className="flex items-center rounded-xl border border-white/10 bg-[#080914] px-4 transition focus-within:border-violet-400">
                <User size={18} className="text-slate-500" />

                <input
                  type="text"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="Enter your full name"
                  autoComplete="name"
                  minLength={2}
                  maxLength={60}
                  required
                  className="w-full bg-transparent px-3 py-3.5 text-sm text-white outline-none placeholder:text-slate-600"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Email address
              </label>

              <div className="flex items-center rounded-xl border border-white/10 bg-[#080914] px-4 transition focus-within:border-violet-400">
                <Mail size={18} className="text-slate-500" />

                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="you@example.com"
                  autoComplete="email"
                  required
                  className="w-full bg-transparent px-3 py-3.5 text-sm text-white outline-none placeholder:text-slate-600"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Password
              </label>

              <div className="flex items-center rounded-xl border border-white/10 bg-[#080914] px-4 transition focus-within:border-violet-400">
                <Lock size={18} className="text-slate-500" />

                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="At least 8 characters"
                  autoComplete="new-password"
                  minLength={8}
                  maxLength={128}
                  required
                  className="w-full bg-transparent px-3 py-3.5 text-sm text-white outline-none placeholder:text-slate-600"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-slate-500 transition hover:text-white"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Confirm password
              </label>

              <div className="flex items-center rounded-xl border border-white/10 bg-[#080914] px-4 transition focus-within:border-violet-400">
                <Lock size={18} className="text-slate-500" />

                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  placeholder="Re-enter your password"
                  autoComplete="new-password"
                  required
                  className="w-full bg-transparent px-3 py-3.5 text-sm text-white outline-none placeholder:text-slate-600"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowConfirmPassword(!showConfirmPassword)
                  }
                  className="text-slate-500 transition hover:text-white"
                  aria-label={
                    showConfirmPassword ? "Hide password" : "Show password"
                  }
                >
                  {showConfirmPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>
            </div>

            {error && (
              <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-violet-600 py-3.5 text-sm font-semibold text-white shadow-lg shadow-violet-900/30 transition hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isLoading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Creating account...
                </>
              ) : (
                <>
                  Create account
                  <ArrowRight size={17} />
                </>
              )}
            </button>
          </form>

          <p className="mt-7 text-center text-sm text-slate-400">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-semibold text-violet-400 hover:text-violet-300"
            >
              Sign in
            </Link>
          </p>
        </div>

        <p className="mt-6 text-center text-xs text-slate-600">
          Your documents deserve a smarter workspace.
        </p>
      </div>
    </main>
  );
}

export default Register;
