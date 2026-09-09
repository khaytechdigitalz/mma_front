// src/pages/PasswordReset.tsx
import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Lock } from "lucide-react";
import { toast } from "sonner";
import { Logo } from "@/components/ui/Logo";
import { Button } from "@/components/ui/Button";
import { resetPassword } from "@/api/auth";

export function PasswordReset() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Decode email and otp from search params
  const encodedEmail = searchParams.get("email") || "";
  const encodedOtp = searchParams.get("otp") || "";

  let email = "";
  let otp = "";

  try {
    email = encodedEmail ? atob(encodedEmail) : "";
  } catch {
    email = encodedEmail; // Fallback
  }

  try {
    otp = encodedOtp ? atob(encodedOtp) : "";
  } catch {
    otp = encodedOtp; // Fallback
  }

  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== passwordConfirmation) {
      toast.error("Passwords do not match.");
      return;
    }

    if (!email || !otp) {
      toast.error("Missing verification details. Please restart the process.");
      navigate("/password-lost");
      return;
    }

    setLoading(true);

    try {
      const response = await resetPassword({
        email,
        password,
        password_confirmation: passwordConfirmation,
        otp,
      });
      
      if (response.status) {
        toast.success(response.message || "Password reset successfully!");
        navigate("/password-reset-success", { state: { success: true } });
      } else {
        toast.error(response.message || "Failed to reset password.");
      }
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || "An error occurred. Please try again.";
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-6">
      <div className="w-full max-w-md text-center">
        <Logo />
        <h1 className="text-gray-primary mb-2 text-2xl font-bold">Create a new password</h1>
        <p className="text-gray-secondary mb-8 text-sm">
          Choose a strong password you haven't used before.
        </p>
        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          <div className="relative">
            <Lock className="text-gray-tertiary absolute top-1/2 left-4 size-4 -translate-y-1/2" />
            <input
              required
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="New password"
              className="border-gray-tertiary/32 focus:border-primary-main focus:ring-primary-main/20 h-12 w-full rounded-full border pr-4 pl-11 text-sm transition-shadow focus:ring-4 focus:outline-0"
            />
          </div>
          <div className="relative">
            <Lock className="text-gray-tertiary absolute top-1/2 left-4 size-4 -translate-y-1/2" />
            <input
              required
              type="password"
              value={passwordConfirmation}
              onChange={(e) => setPasswordConfirmation(e.target.value)}
              placeholder="Confirm password"
              className="border-gray-tertiary/32 focus:border-primary-main focus:ring-primary-main/20 h-12 w-full rounded-full border pr-4 pl-11 text-sm transition-shadow focus:ring-4 focus:outline-0"
            />
          </div>
          <Button type="submit" fullWidth disabled={loading}>
            {loading ? "Resetting password..." : "Reset Password"}
          </Button>
        </form>
      </div>
    </div>
  );
}