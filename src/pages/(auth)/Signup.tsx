// src/pages/Signup.tsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, Mail, Lock, Phone, Eye, EyeOff, Check, X, ShieldCheck, Star } from "lucide-react";
import { toast } from "sonner";
import { Logo } from "@/components/ui/Logo";
import { Button } from "@/components/ui/Button"; 
import { PlaceholderImage } from "@/components/ui/PlaceholderImage";
import { cn } from "@/lib/utils";
import { registerUser } from "@/api/auth";

export function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Password requirement checkers
  const hasMinLength = password.length >= 8;
  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSymbol = /[^A-Za-z0-9]/.test(password);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!hasMinLength || !hasUpper || !hasLower || !hasNumber || !hasSymbol) {
      toast.error("Please meet all password requirements.");
      return;
    }

    if (password !== passwordConfirmation) {
      toast.error("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const response = await registerUser({
        name,
        email,
        phone,
        password,
        password_confirmation: passwordConfirmation,
      });

      if (response.status) {
        toast.success(response.message || "Account created successfully!");
        const encodedEmail = btoa(email);
        navigate(`/verify-email?email=${encodeURIComponent(encodedEmail)}`);
      } else {
        toast.error(response.message || "Registration failed.");
      }
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || "An error occurred. Please try again.";
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid min-h-screen grid-cols-1 lg:grid-cols-2 bg-white">
      {/* Left Form Section */}
      <div className="flex flex-col justify-center px-6 py-12 sm:px-16 lg:px-20">
        <div className="mb-6">
          <Logo />
        </div>
        <h1 className="text-gray-primary mb-2 text-2xl sm:text-3xl font-black tracking-tight">Create your account</h1>
        <p className="text-gray-secondary mb-8 text-sm">
          Join thousands of shoppers getting redefined shopping experiences.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <User className="text-gray-400 absolute top-1/2 left-4 size-4 -translate-y-1/2" />
            <input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Full name"
              className="border-gray-200 focus:border-primary-main focus:ring-primary-main/20 h-12 w-full rounded-xl border pr-4 pl-11 text-sm bg-gray-50/50 transition-all focus:bg-white focus:ring-4 focus:outline-0"
            />
          </div>

          <div className="relative">
            <Mail className="text-gray-400 absolute top-1/2 left-4 size-4 -translate-y-1/2" />
            <input
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email address"
              className="border-gray-200 focus:border-primary-main focus:ring-primary-main/20 h-12 w-full rounded-xl border pr-4 pl-11 text-sm bg-gray-50/50 transition-all focus:bg-white focus:ring-4 focus:outline-0"
            />
          </div>

          <div className="relative">
            <Phone className="text-gray-400 absolute top-1/2 left-4 size-4 -translate-y-1/2" />
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Phone number (optional)"
              className="border-gray-200 focus:border-primary-main focus:ring-primary-main/20 h-12 w-full rounded-xl border pr-4 pl-11 text-sm bg-gray-50/50 transition-all focus:bg-white focus:ring-4 focus:outline-0"
            />
          </div>

          <div className="space-y-2">
            <div className="relative">
              <Lock className="text-gray-400 absolute top-1/2 left-4 size-4 -translate-y-1/2" />
              <input
                required
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="border-gray-200 focus:border-primary-main focus:ring-primary-main/20 h-12 w-full rounded-xl border pr-11 pl-11 text-sm bg-gray-50/50 transition-all focus:bg-white focus:ring-4 focus:outline-0"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-gray-400 hover:text-gray-600 absolute top-1/2 right-4 -translate-y-1/2 cursor-pointer"
              >
                {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>

            {/* Password Requirements Checklist */}
            {password && (
              <div className="px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl space-y-1.5 text-xs">
                <p className="font-semibold text-gray-700 mb-1">Password requirements:</p>
                <div className="grid grid-cols-1 gap-1.5">
                  <div className={cn("flex items-center gap-2", hasMinLength ? "text-emerald-600 font-medium" : "text-gray-400")}>
                    {hasMinLength ? <Check className="size-3.5 shrink-0" /> : <X className="size-3.5 shrink-0 text-gray-300" />}
                    <span>At least 8 characters</span>
                  </div>
                  <div className={cn("flex items-center gap-2", hasUpper ? "text-emerald-600 font-medium" : "text-gray-400")}>
                    {hasUpper ? <Check className="size-3.5 shrink-0" /> : <X className="size-3.5 shrink-0 text-gray-300" />}
                    <span>One uppercase letter</span>
                  </div>
                  <div className={cn("flex items-center gap-2", hasLower ? "text-emerald-600 font-medium" : "text-gray-400")}>
                    {hasLower ? <Check className="size-3.5 shrink-0" /> : <X className="size-3.5 shrink-0 text-gray-300" />}
                    <span>One lowercase letter</span>
                  </div>
                  <div className={cn("flex items-center gap-2", hasNumber ? "text-emerald-600 font-medium" : "text-gray-400")}>
                    {hasNumber ? <Check className="size-3.5 shrink-0" /> : <X className="size-3.5 shrink-0 text-gray-300" />}
                    <span>One number</span>
                  </div>
                  <div className={cn("flex items-center gap-2", hasSymbol ? "text-emerald-600 font-medium" : "text-gray-400")}>
                    {hasSymbol ? <Check className="size-3.5 shrink-0" /> : <X className="size-3.5 shrink-0 text-gray-300" />}
                    <span>One symbol (e.g. !@#$%^&*)</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="relative">
            <Lock className="text-gray-400 absolute top-1/2 left-4 size-4 -translate-y-1/2" />
            <input
              required
              type={showConfirmPassword ? "text" : "password"}
              value={passwordConfirmation}
              onChange={(e) => setPasswordConfirmation(e.target.value)}
              placeholder="Confirm password"
              className="border-gray-200 focus:border-primary-main focus:ring-primary-main/20 h-12 w-full rounded-xl border pr-11 pl-11 text-sm bg-gray-50/50 transition-all focus:bg-white focus:ring-4 focus:outline-0"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="text-gray-400 hover:text-gray-600 absolute top-1/2 right-4 -translate-y-1/2 cursor-pointer"
            >
              {showConfirmPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          </div>

          <label className="text-gray-secondary flex items-start gap-2.5 text-xs sm:text-sm pt-1">
            <input required type="checkbox" className="accent-primary-main mt-0.5 size-4 rounded border-gray-300" />
            <span>
              I agree to the{" "}
              <Link to="/term-and-conditions" className="text-primary-main font-semibold hover:underline">
                Terms & Conditions
              </Link>
            </span>
          </label>

          <Button type="submit" fullWidth disabled={loading} className="py-3.5 rounded-xl font-bold shadow-md">
            {loading ? "Creating account..." : "Create Account"}
          </Button>
        </form>

        <p className="text-gray-secondary mt-6 text-center text-sm">
          Already have an account?{" "}
          <Link to="/login" className="text-primary-main font-bold hover:underline">
            Sign in
          </Link>
        </p>
      </div>

      {/* Right Visual Side */}
      <div className="relative hidden overflow-hidden bg-slate-950 lg:block">
        <img
          src="/images/auth/closeup-shot-beautiful-young-african-women-with-shopping-bags.jpg"
          alt="Shopping experience cover"
          className="absolute inset-0 size-full object-cover opacity-80"
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = "none";
          }}
        />

        {/* Gradient Overlay */}
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
            Create your account to track orders, manage your wishlist, and unlock personalized artisan collections from trusted local creators.
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