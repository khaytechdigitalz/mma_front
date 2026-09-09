// src/pages/VerifyEmail.tsx
import { useState, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { Logo } from "@/components/ui/Logo";
import { Button } from "@/components/ui/Button";
import { verifyEmail, resendVerification } from "@/api/auth";

export function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Decode email from search params (Base64 decoded)
  const encodedEmail = searchParams.get("email") || "";
  let decodedEmail = "";
  try {
    decodedEmail = encodedEmail ? atob(encodedEmail) : "";
  } catch (e) {
    decodedEmail = encodedEmail; // Fallback if unencoded
  }

  const [otpValues, setOtpValues] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (index: number, value: string) => {
    // Only allow numbers
    if (value && !/^\d+$/.test(value)) return;

    const newValues = [...otpValues];
    newValues[index] = value;
    setOtpValues(newValues);

    // Auto-advance to next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otpValues[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleResend = async () => {
    if (!decodedEmail) {
      toast.error("Email address missing. Please register again.");
      navigate("/signup");
      return;
    }

    setResending(true);
    try {
      const response = await resendVerification(decodedEmail);
      if (response.status) {
        toast.success(response.message || "Verification code resent successfully!");
      } else {
        toast.error(response.message || "Failed to resend code.");
      }
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || "Failed to resend code. Please try again.";
      toast.error(errorMsg);
    } finally {
      setResending(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const otp = otpValues.join("");

    if (otp.length < 6) {
      toast.error("Please enter the complete 6-digit code.");
      return;
    }

    if (!decodedEmail) {
      toast.error("Email address missing. Please register again.");
      navigate("/signup");
      return;
    }

    setLoading(true);

    try {
      const response = await verifyEmail({ email: decodedEmail, otp });

      if (response.status) {
        toast.success(response.message || "Email verified successfully! Please sign in.");
        navigate("/login");
      } else {
        toast.error(response.message || "Invalid verification code.");
      }
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || "Verification failed. Please try again.";
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
          <ShieldCheck className="size-7" />
        </span>
        <h1 className="text-gray-primary mb-2 text-2xl font-bold">Verify your email</h1>
        <p className="text-gray-secondary mb-8 text-sm">
          Enter the 6-digit verification code sent to{" "}
          <span className="font-semibold text-gray-primary">{decodedEmail || "your email"}</span>.
        </p>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex justify-center gap-2 sm:gap-3">
            {otpValues.map((val, i) => (
              <input
                key={i}
                ref={(el) => {
                  inputRefs.current[i] = el;
                }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={val}
                onChange={(e) => handleChange(i, e.target.value)}
                onKeyDown={(e) => handleKeyDown(i, e)}
                className="border-gray-tertiary/32 focus:border-primary-main focus:ring-primary-main/20 size-12 sm:size-14 rounded-xl border text-center text-lg font-bold transition-shadow focus:ring-4 focus:outline-0"
              />
            ))}
          </div>
          <Button type="submit" fullWidth disabled={loading}>
            {loading ? "Verifying..." : "Verify Email"}
          </Button>
        </form>
        <p className="text-gray-secondary mt-6 text-sm">
          Didn't receive a code?{" "}
          <button
            type="button"
            onClick={handleResend}
            disabled={resending}
            className="text-primary-main font-medium hover:underline disabled:opacity-50"
          >
            {resending ? "Resending..." : "Resend"}
          </button>
        </p>
      </div>
    </div>
  );
}