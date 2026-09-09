// src/pages/Login.tsx
import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation, useSearchParams } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, ShieldCheck, Star } from "lucide-react";
import { toast } from "sonner";
import { Logo } from "@/components/ui/Logo";
import { Button } from "@/components/ui/Button";
import { PlaceholderImage } from "@/components/ui/PlaceholderImage";
import { GoogleIcon, FacebookIcon } from "@/components/ui/BrandIcons";
import { loginUser } from "@/api/auth";
import { isAuthenticated, setAuthToken } from "@/lib/auth";

export function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const redirectTo =
    (location.state as { from?: string } | null)?.from || searchParams.get("from") || "/user-dashboard";

  // If the auth interceptor bounced the user here after a 401, let them know why.
  useEffect(() => {
    if (searchParams.get("expired") === "1") {
      toast.error("Your session has expired. Please sign in again.");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Check if already logged in on mount and redirect to dashboard
  useEffect(() => {
    if (isAuthenticated()) {
      navigate(redirectTo, { replace: true });
    }
  }, [navigate, redirectTo]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await loginUser({ email, password });

      if (response.status) {
        // Save token (adjust key based on your backend structure, e.g., response.data.token)
        const token = response.data?.token || response.token;
        if (token) {
          setAuthToken(token);
        }

        toast.success(response.message || "Login successful!");
        navigate(redirectTo, { replace: true });
      } else {
        toast.error(response.message || "Invalid credentials.");
      }
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || "Failed to sign in. Please check your details.";
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid min-h-screen grid-cols-1 lg:grid-cols-2">
      {/* Form side */}
      <div className="flex flex-col justify-center px-6 py-12 sm:px-16">
        <div className="mx-auto w-full max-w-sm">
          <div className="mb-10">
            <Logo />
          </div>

          <h1 className="text-gray-primary mb-2 text-2xl font-bold">
            Welcome back
          </h1>
          <p className="text-gray-secondary mb-8 text-sm">
            Sign in to continue to your account.
          </p>

          <div className="mb-6 grid grid-cols-2 gap-3">
            <button
              type="button"
              className="border-gray-tertiary/32 hover:border-primary-main hover:bg-primary-lighter/20 flex h-11 items-center justify-center gap-2 rounded-full border text-sm font-medium transition-colors"
            >
              <GoogleIcon className="size-4" /> Google
            </button>
            <button
              type="button"
              className="border-gray-tertiary/32 hover:border-primary-main hover:bg-primary-lighter/20 flex h-11 items-center justify-center gap-2 rounded-full border text-sm font-medium transition-colors"
            >
              <FacebookIcon className="size-4" /> Facebook
            </button>
          </div>

          <div className="mb-6 flex items-center gap-3">
            <span className="h-px flex-1 bg-gray-200" />
            <span className="text-gray-tertiary text-xs">Or sign in with email</span>
            <span className="h-px flex-1 bg-gray-200" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <Mail className="text-gray-tertiary absolute top-1/2 left-4 size-4 -translate-y-1/2" />
              <input
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email address"
                className="border-gray-tertiary/32 focus:border-primary-main focus:ring-primary-main/20 h-12 w-full rounded-full border pr-4 pl-11 text-sm transition-shadow focus:ring-4 focus:outline-0"
              />
            </div>

            <div className="relative">
              <Lock className="text-gray-tertiary absolute top-1/2 left-4 size-4 -translate-y-1/2" />
              <input
                required
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="border-gray-tertiary/32 focus:border-primary-main focus:ring-primary-main/20 h-12 w-full rounded-full border pr-11 pl-11 text-sm transition-shadow focus:ring-4 focus:outline-0"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="text-gray-tertiary hover:text-gray-secondary absolute top-1/2 right-4 -translate-y-1/2"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="text-gray-secondary flex items-center gap-2">
                <input type="checkbox" className="accent-primary-main size-4" />
                Remember me
              </label>
              <Link to="/password-lost" className="text-primary-main font-medium">
                Forgot password?
              </Link>
            </div>

            <Button type="submit" fullWidth size="lg" disabled={loading}>
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          <p className="text-gray-secondary mt-8 text-center text-sm">
            Don't have an account?{" "}
            <Link to="/signup" className="text-primary-main font-medium">
              Create one
            </Link>
          </p>
        </div>
      </div>

      {/* Visual side */}
      <div className="bg-primary-light relative hidden overflow-hidden lg:block">
        <img
          src={"/images/cart/cart1.webp"}
          alt={`cover`}
          className="absolute inset-0 size-full object-cover transition-transform duration-300 group-hover:scale-105"
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = "none";
          }}
        />

        <div className="from-primary-main/95 absolute inset-0 bg-gradient-to-t via-transparent to-transparent" />

        <div className="absolute inset-x-0 bottom-0 p-12">
          <div className="mb-6 flex items-center gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} className="fill-warning-dark text-warning-dark size-4" />
            ))}
            <span className="ml-2 text-sm text-white/80">4.9 from 12,000+ shoppers</span>
          </div>
          <h2 className="mb-3 text-2xl font-bold text-white md:text-3xl">
            Shopping Redefined, satisfaction delivered
          </h2>
          <p className="mb-6 max-w-sm text-sm text-white/70">
            Sign in to track orders, manage your wishlist, and get personalized
            deals from over 100 trusted local vendors.
          </p>
          <div className="flex items-center gap-2 text-sm text-white/80">
            <ShieldCheck className="size-4" />
            Your data is always private and secure.
          </div>
        </div>
      </div>
    </div>
  );
}