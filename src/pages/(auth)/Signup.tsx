// src/pages/Signup.tsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, Mail, Lock, Phone, Eye, EyeOff, Check, X } from "lucide-react";
import { toast } from "sonner";
import { Logo } from "@/components/ui/Logo";
import { Button } from "@/components/ui/Button";
import { PlaceholderImage } from "@/components/ui/PlaceholderImage";
import { GoogleIcon, FacebookIcon } from "@/components/ui/BrandIcons";
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
    <div className="grid min-h-screen grid-cols-1 lg:grid-cols-2">
      <div className="flex flex-col justify-center px-6 py-12 sm:px-16">
        <Logo  />
        <h1 className="text-gray-primary mb-2 text-2xl font-bold">Create your account</h1>
        <p className="text-gray-secondary mb-6 text-sm">
          Join thousands of shoppers getting redefined shopping experiences.
        </p>

          

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <User className="text-gray-tertiary absolute top-1/2 left-4 size-4 -translate-y-1/2" />
            <input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Full name"
              className="border-gray-tertiary/32 focus:border-primary-main focus:ring-primary-main/20 h-12 w-full rounded-full border pr-4 pl-11 text-sm transition-shadow focus:ring-4 focus:outline-0"
            />
          </div>

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
            <Phone className="text-gray-tertiary absolute top-1/2 left-4 size-4 -translate-y-1/2" />
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Phone number (optional)"
              className="border-gray-tertiary/32 focus:border-primary-main focus:ring-primary-main/20 h-12 w-full rounded-full border pr-4 pl-11 text-sm transition-shadow focus:ring-4 focus:outline-0"
            />
          </div>

          <div className="space-y-2">
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
                onClick={() => setShowPassword(!showPassword)}
                className="text-gray-tertiary hover:text-gray-primary absolute top-1/2 right-4 -translate-y-1/2"
              >
                {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>

            {/* Password Requirements Checklist */}
            {password && (
              <div className="px-3 py-2 bg-gray-50 rounded-xl space-y-1.5 text-xs">
                <p className="font-medium text-gray-primary mb-1">Password must contain:</p>
                <div className="grid grid-cols-1 gap-1">
                  <div className={cn("flex items-center gap-2", hasMinLength ? "text-emerald-600" : "text-gray-secondary")}>
                    {hasMinLength ? <Check className="size-3.5" /> : <X className="size-3.5 text-gray-400" />}
                    <span>At least 8 characters</span>
                  </div>
                  <div className={cn("flex items-center gap-2", hasUpper ? "text-emerald-600" : "text-gray-secondary")}>
                    {hasUpper ? <Check className="size-3.5" /> : <X className="size-3.5 text-gray-400" />}
                    <span>One uppercase letter</span>
                  </div>
                  <div className={cn("flex items-center gap-2", hasLower ? "text-emerald-600" : "text-gray-secondary")}>
                    {hasLower ? <Check className="size-3.5" /> : <X className="size-3.5 text-gray-400" />}
                    <span>One lowercase letter</span>
                  </div>
                  <div className={cn("flex items-center gap-2", hasNumber ? "text-emerald-600" : "text-gray-secondary")}>
                    {hasNumber ? <Check className="size-3.5" /> : <X className="size-3.5 text-gray-400" />}
                    <span>One number</span>
                  </div>
                  <div className={cn("flex items-center gap-2", hasSymbol ? "text-emerald-600" : "text-gray-secondary")}>
                    {hasSymbol ? <Check className="size-3.5" /> : <X className="size-3.5 text-gray-400" />}
                    <span>One symbol (e.g. !@#$%^&*)</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="relative">
            <Lock className="text-gray-tertiary absolute top-1/2 left-4 size-4 -translate-y-1/2" />
            <input
              required
              type={showConfirmPassword ? "text" : "password"}
              value={passwordConfirmation}
              onChange={(e) => setPasswordConfirmation(e.target.value)}
              placeholder="Confirm password"
              className="border-gray-tertiary/32 focus:border-primary-main focus:ring-primary-main/20 h-12 w-full rounded-full border pr-11 pl-11 text-sm transition-shadow focus:ring-4 focus:outline-0"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="text-gray-tertiary hover:text-gray-primary absolute top-1/2 right-4 -translate-y-1/2"
            >
              {showConfirmPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          </div>

          
          <label className="text-gray-secondary flex items-start gap-2 text-sm">
            <input required type="checkbox" className="accent-primary-main mt-0.5" />
            I agree to the{" "}
            <Link to="/term-and-conditions" className="text-primary-main font-medium">
              Terms & Conditions
            </Link>
          </label>

          <Button type="submit" fullWidth disabled={loading}>
            {loading ? "Creating account..." : "Create Account"}
          </Button>
        </form>

        <p className="text-gray-secondary mt-6 text-center text-sm">
          Already have an account?{" "}
          <Link to="/login" className="text-primary-main font-medium">
            Sign in
          </Link>
        </p>
      </div>

      <div className="bg-primary-lighter/30 hidden lg:block">
        <PlaceholderImage label="Shopping Redefined" className="size-full" tone="primary" />
      </div>
    </div>
  );
}