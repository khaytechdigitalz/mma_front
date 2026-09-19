// src/pages/Login.tsx
import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation, useSearchParams } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, ShieldCheck, Star } from "lucide-react";
import { toast } from "sonner";
import { Logo } from "@/components/ui/Logo";
import { Button } from "@/components/ui/Button";
import { GoogleIcon, FacebookIcon } from "@/components/ui/BrandIcons";
import { loginUser } from "@/api/auth";
import { isAuthenticated, setAuthToken } from "@/lib/auth";
import { LoginOtpVerification } from "@/pages/(auth)/LoginOtpVerification";

export function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // 2FA state flow variables
  const [requires2fa, setRequires2fa] = useState(false);
  const [tempToken, setTempToken] = useState("");

  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const redirectTo =
    (location.state as { from?: string } | null)?.from || searchParams.get("from") || "/user-dashboard";

  useEffect(() => {
    if (searchParams.get("expired") === "1") {
      toast.error("Your session has expired. Please sign in again.");
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated()) {
      navigate(redirectTo, { replace: true });
    }
  }, [navigate, redirectTo]);

  const handleLoginSuccess = (token: string) => {
    setAuthToken(token);
    toast.success("Login successful!");
    navigate(redirectTo, { replace: true });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await loginUser({ email, password });

      if (response.status) {
        // Check if backend demands 2FA verification step
        if (response.requires_2fa) {
          const token = response.data?.token || response.token;
          if (token) {
            setTempToken(token);
            setRequires2fa(true);
            toast.info(response.message || "Please provide your 2FA code.");
          } else {
            toast.error("Missing verification token from server.");
          }
        } else {
          const token = response.data?.token || response.token;
          if (token) {
            handleLoginSuccess(token);
          }
        }
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
    <div className="grid min-h-screen grid-cols-1 lg:grid-cols-2 bg-white">
      {/* Form side */}
      <div className="flex flex-col justify-center px-6 py-12 sm:px-16 lg:px-20">
        <div className="mx-auto w-full max-w-sm">
          <div className="mb-8">
            <Logo />
          </div>

          {requires2fa ? (
            <LoginOtpVerification
              token={tempToken}
              onSuccess={handleLoginSuccess}
              onBack={() => setRequires2fa(false)}
            />
          ) : (
            <>
              <h1 className="text-gray-primary mb-2 text-2xl sm:text-3xl font-black tracking-tight">
                Welcome back
              </h1>
              <p className="text-gray-secondary mb-8 text-sm">
                Sign in to continue to your account.
              </p>

              {/* Social Login Buttons */}
              <div className="mb-6 grid grid-cols-2 gap-3">
                <button
                  type="button"
                  className="border-gray-200 hover:border-primary-main hover:bg-gray-50 flex h-12 items-center justify-center gap-2 rounded-xl border text-xs sm:text-sm font-semibold transition-all bg-white text-gray-700 cursor-pointer shadow-xs"
                >
                  <GoogleIcon className="size-4" /> Google
                </button>
                <button
                  type="button"
                  className="border-gray-200 hover:border-primary-main hover:bg-gray-50 flex h-12 items-center justify-center gap-2 rounded-xl border text-xs sm:text-sm font-semibold transition-all bg-white text-gray-700 cursor-pointer shadow-xs"
                >
                  <FacebookIcon className="size-4" /> Facebook
                </button>
              </div>

              <div className="mb-6 flex items-center gap-3">
                <span className="h-px flex-1 bg-gray-200" />
                <span className="text-gray-400 text-xs uppercase tracking-wider font-medium">Or email</span>
                <span className="h-px flex-1 bg-gray-200" />
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="relative">
                  <Mail className="text-gray-400 absolute top-1/2 left-4 size-4 -translate-y-1/2" />
                  <input
                    required
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email address"
                    className="border-gray-200 focus:border-primary-main focus:ring-primary-main/20 h-12 w-full rounded-xl border pr-4 pl-11 text-sm bg-gray-50/50 transition-all focus:bg-white focus:ring-4 focus:outline-0 text-gray-primary"
                  />
                </div>

                <div className="relative">
                  <Lock className="text-gray-400 absolute top-1/2 left-4 size-4 -translate-y-1/2" />
                  <input
                    required
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    className="border-gray-200 focus:border-primary-main focus:ring-primary-main/20 h-12 w-full rounded-xl border pr-11 pl-11 text-sm bg-gray-50/50 transition-all focus:bg-white focus:ring-4 focus:outline-0 text-gray-primary"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="text-gray-400 hover:text-gray-600 absolute top-1/2 right-4 -translate-y-1/2 cursor-pointer"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                </div>

                <div className="flex items-center justify-between text-xs sm:text-sm pt-1">
                  <label className="text-gray-secondary flex items-center gap-2 cursor-pointer select-none">
                    <input type="checkbox" className="accent-primary-main size-4 cursor-pointer rounded border-gray-300" />
                    Remember me
                  </label>
                  <Link to="/password-lost" className="text-primary-main font-semibold hover:underline">
                    Forgot password?
                  </Link>
                </div>

                <Button type="submit" fullWidth size="lg" disabled={loading} className="py-3.5 rounded-xl font-bold shadow-md mt-2">
                  {loading ? "Signing in..." : "Sign In"}
                </Button>
              </form>

              <p className="text-gray-secondary mt-8 text-center text-sm">
                Don't have an account?{" "}
                <Link to="/signup" className="text-primary-main font-bold hover:underline">
                  Create one
                </Link>
              </p>
            </>
          )}
        </div>
      </div>

      {/* Visual side */}
      <div className="relative hidden overflow-hidden bg-slate-950 lg:block">
        <img
          src="/images/auth/manbag.jpg"
          alt="Shopping experience cover"
          className="absolute inset-0 size-full object-cover opacity-80"
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = "none";
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

        <div className="absolute inset-x-0 bottom-0 p-16 z-10">
          <div className="mb-6 flex items-center gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} className="fill-amber-400 text-amber-400 size-4" />
            ))}
            <span className="ml-2 text-xs font-semibold text-white/90">4.9 from 12,000+ shoppers</span>
          </div>
          <h2 className="mb-3 text-2xl xl:text-3xl font-black text-white tracking-tight">
            Shopping Redefined, Satisfaction Delivered
          </h2>
          <p className="mb-6 max-w-md text-sm text-slate-300 leading-relaxed">
            Sign in to track orders, manage your wishlist, and get personalized deals from over 100 trusted local vendors.
          </p>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400">
            <ShieldCheck className="size-4" />
            Your data is always private and 100% secure.
          </div>
        </div>
      </div>
    </div>
  );
}