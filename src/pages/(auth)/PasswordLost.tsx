// src/pages/PasswordLost.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, KeyRound } from "lucide-react";
import { toast } from "sonner";
import { Logo } from "@/components/ui/Logo";
import { Button } from "@/components/ui/Button";
import { forgotPassword } from "@/api/auth";

export function PasswordLost() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await forgotPassword(email);

      if (response.status) {
        toast.success(response.message || "Reset code sent successfully!");
        // Base64 encode the email for the URL query parameter
        const encodedEmail = btoa(email);
        navigate(`/otp-verification?email=${encodeURIComponent(encodedEmail)}`);
      } else {
        toast.error(response.message || "Failed to send reset code.");
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
        <span className="bg-primary-lighter text-primary-main mx-auto mb-5 flex size-16 items-center justify-center rounded-full">
          <KeyRound className="size-7" />
        </span>
        <h1 className="text-gray-primary mb-2 text-2xl font-bold">Forgot your password?</h1>
        <p className="text-gray-secondary mb-8 text-sm">
          Enter your email address and we'll send you a code to reset your password.
        </p>
        <form onSubmit={handleSubmit} className="space-y-4 text-left">
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
          <Button type="submit" fullWidth disabled={loading}>
            {loading ? "Sending code..." : "Send Reset Code"}
          </Button>
        </form>
      </div>
    </div>
  );
}