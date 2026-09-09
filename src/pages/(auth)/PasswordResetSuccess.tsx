// src/pages/PasswordResetSuccess.tsx
import { useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { CheckCircle2 } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { Button } from "@/components/ui/Button";

export function PasswordResetSuccess() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // If accessed directly without the success state, redirect to login
    if (!location.state?.success) {
      navigate("/login", { replace: true });
    }
  }, [location, navigate]);

  // Prevent rendering anything if unauthorized (avoids any flash of content)
  if (!location.state?.success) {
    return null;
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-6">
      <div className="w-full max-w-md text-center">
        <Logo  />
        <span className="bg-success-light text-success-dark-main mx-auto mb-5 flex size-16 items-center justify-center rounded-full">
          <CheckCircle2 className="size-7" />
        </span>
        <h1 className="text-gray-primary mb-2 text-2xl font-bold">Password reset!</h1>
        <p className="text-gray-secondary mb-8 text-sm">
          Your password has been changed successfully. You can now sign in with
          your new password.
        </p>
        <Link to="/login">
          <Button fullWidth>Back to Login</Button>
        </Link>
      </div>
    </div>
  );
}